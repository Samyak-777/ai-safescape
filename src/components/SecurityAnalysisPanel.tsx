
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Search, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { threatIntelligenceService, SecurityAnalysisResult, ThreatIntelligenceData } from '@/services/threatIntelligence';

interface SecurityAnalysisPanelProps {
  content: string;
  onAnalysisComplete?: (result: SecurityAnalysisResult) => void;
}

const SecurityAnalysisPanel: React.FC<SecurityAnalysisPanelProps> = ({ 
  content, 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null);
  const [threatIntel, setThreatIntel] = useState<ThreatIntelligenceData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const performSecurityAnalysis = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Perform pattern analysis
      const result = threatIntelligenceService.analyzeSecurityPatterns(content);
      setAnalysisResult(result);
      
      // Extract and analyze URLs for threat intelligence
      const urlPattern = /https?:\/\/[^\s]+/gi;
      const urls = content.match(urlPattern) || [];
      
      if (urls.length > 0) {
        const intelPromises = urls.slice(0, 5).map(url => // Limit to first 5 URLs
          threatIntelligenceService.lookupThreatIntelligence(url, 'url')
        );
        const intelResults = await Promise.all(intelPromises);
        setThreatIntel(intelResults);
      }
      
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Security analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-green-600 bg-green-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Advanced Security Analysis
          <Badge variant="outline" className="ml-2">
            Threat Intel
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive security analysis with threat intelligence and pattern detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            onClick={performSecurityAnalysis}
            disabled={!content.trim() || isAnalyzing}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Run Security Analysis'}
          </Button>
          
          {analysisResult && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Security Score:</span>
              <Badge className={getRiskColor(analysisResult.riskLevel)}>
                {analysisResult.overallScore}/100 ({analysisResult.riskLevel.toUpperCase()})
              </Badge>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Running security analysis...</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {analysisResult && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="threats">Threats</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="intel">Threat Intel</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Security Score</span>
                          <span className="text-sm font-medium">{analysisResult.overallScore}/100</span>
                        </div>
                        <Progress value={analysisResult.overallScore} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Risk Level:</span>
                        <Badge className={getRiskColor(analysisResult.riskLevel)}>
                          {analysisResult.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Threats Detected:</span>
                        <span className="font-medium">{analysisResult.threats.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Patterns Found:</span>
                        <span className="font-medium">{analysisResult.patterns.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Recommendations:</span>
                        <span className="font-medium">{analysisResult.recommendations.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysisResult.recommendations.length > 0 && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">Security Recommendations:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="threats" className="space-y-4">
              {analysisResult.threats.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No security threats detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisResult.threats.map((threat, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(threat.severity)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{threat.type}</h4>
                              <Badge variant="outline">
                                {Math.round(threat.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {threat.description}
                            </p>
                            {threat.mitigation && (
                              <div className="bg-muted/50 p-2 rounded text-xs">
                                <strong>Mitigation:</strong> {threat.mitigation}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              {analysisResult.patterns.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No suspicious patterns detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisResult.patterns.map((pattern, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{pattern.pattern}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{pattern.matches} matches</Badge>
                            <Badge 
                              className={
                                pattern.riskScore > 20 ? 'bg-red-100 text-red-800' :
                                pattern.riskScore > 10 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }
                            >
                              Risk: {pattern.riskScore}
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={Math.min((pattern.riskScore / 30) * 100, 100)} 
                          className="h-2"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="intel" className="space-y-4">
              {threatIntel.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No URLs found for threat intelligence lookup</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {threatIntel.map((intel, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {intel.isMalicious ? 
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> :
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          }
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <Badge 
                                className={
                                  intel.threatLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                  intel.threatLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                  intel.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }
                              >
                                {intel.threatLevel.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(intel.confidence * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-sm mb-2">{intel.description}</p>
                            {intel.categories.length > 0 && (
                              <div className="flex gap-1 mb-2">
                                {intel.categories.map((cat, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Sources: {intel.sources.join(', ')}
                              {intel.lastSeen && ` • Last seen: ${new Date(intel.lastSeen).toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAnalysisPanel;
