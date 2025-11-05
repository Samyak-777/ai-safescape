
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Image, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  TrendingUp,
  Eye
} from 'lucide-react';
import { ComprehensiveImageReport as ReportType } from '@/services/comprehensiveImageAnalysis';

interface ComprehensiveImageReportProps {
  report: ReportType;
}

const ComprehensiveImageReport: React.FC<ComprehensiveImageReportProps> = ({ report }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-500/10';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-500/10';
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="w-full mt-6 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Comprehensive Image Analysis Report
            </CardTitle>
            <CardDescription>In-depth multi-dimensional image evaluation</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getTrustScoreColor(report.overallAssessment.trustScore)}`}>
              {report.overallAssessment.trustScore}
            </div>
            <div className="text-xs text-muted-foreground">Trust Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Assessment Alert */}
        <Alert className={`mb-6 ${getRiskColor(report.overallAssessment.riskLevel)}`}>
          <div className="flex items-start gap-3">
            {report.overallAssessment.riskLevel === 'low' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> :
             report.overallAssessment.riskLevel === 'critical' ? <Shield className="w-5 h-5 mt-0.5" /> :
             <AlertTriangle className="w-5 h-5 mt-0.5" />}
            <div className="flex-1">
              <div className="font-semibold mb-1">
                Risk Level: {report.overallAssessment.riskLevel.toUpperCase()}
              </div>
              <AlertDescription>{report.overallAssessment.summary}</AlertDescription>
            </div>
          </div>
        </Alert>

        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="structure">
              <Image className="w-4 h-4 mr-1" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="manipulation">
              <Eye className="w-4 h-4 mr-1" />
              Manipulation
            </TabsTrigger>
            <TabsTrigger value="safety">
              <Shield className="w-4 h-4 mr-1" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="w-4 h-4 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="context">
              <Sparkles className="w-4 h-4 mr-1" />
              Context
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <TrendingUp className="w-4 h-4 mr-1" />
              Actions
            </TabsTrigger>
          </TabsList>

          {/* Image Structure Tab */}
          <TabsContent value="structure" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Dimensions</div>
                <div className="font-medium">{report.imageStructure.dimensions}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Format</div>
                <div className="font-medium">{report.imageStructure.format}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Color Profile</div>
                <div className="font-medium">{report.imageStructure.colorProfile}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Technical Quality</div>
                <div className="font-medium">{report.imageStructure.technicalQuality}</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Composition</div>
              <div className="text-sm">{report.imageStructure.composition}</div>
            </div>
            {report.imageStructure.visualElements.length > 0 && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">Visual Elements</div>
                <div className="flex flex-wrap gap-2">
                  {report.imageStructure.visualElements.map((element, idx) => (
                    <Badge key={idx} variant="secondary">{element}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Manipulation Analysis Tab */}
          <TabsContent value="manipulation" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Manipulation Detection</div>
                <Badge variant={report.manipulationAnalysis.isManipulated ? "destructive" : "default"}>
                  {report.manipulationAnalysis.isManipulated ? "Detected" : "Not Detected"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Confidence Level</div>
                  <Progress value={report.manipulationAnalysis.confidence * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(report.manipulationAnalysis.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Manipulation Type</div>
                  <div className="text-sm font-medium">{report.manipulationAnalysis.manipulationType}</div>
                </div>
              </div>
            </div>
            {report.manipulationAnalysis.indicators.length > 0 && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">Detected Indicators</div>
                <ul className="space-y-1">
                  {report.manipulationAnalysis.indicators.map((indicator, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Detailed Explanation</div>
              <div className="text-sm">{report.manipulationAnalysis.detailedExplanation}</div>
            </div>
          </TabsContent>

          {/* Content Safety Tab */}
          <TabsContent value="safety" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Safety Assessment</div>
                <Badge variant={report.contentSafety.isInappropriate ? "destructive" : "default"}>
                  {report.contentSafety.isInappropriate ? "Issues Found" : "Safe"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Severity Level</div>
                  <div className="text-sm font-medium capitalize">{report.contentSafety.severity}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                  <Progress value={report.contentSafety.confidence * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(report.contentSafety.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            {report.contentSafety.categories.length > 0 && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">Safety Categories</div>
                <div className="flex flex-wrap gap-2">
                  {report.contentSafety.categories.map((category, idx) => (
                    <Badge key={idx} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Explanation</div>
              <div className="text-sm">{report.contentSafety.explanation}</div>
            </div>
          </TabsContent>

          {/* Text Extraction Tab */}
          <TabsContent value="text" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Text Detection</div>
                <Badge variant={report.textExtraction.hasText ? "default" : "secondary"}>
                  {report.textExtraction.hasText ? "Text Found" : "No Text"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Language</div>
                  <div className="text-sm font-medium">{report.textExtraction.language}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Text Quality</div>
                  <div className="text-sm font-medium">{report.textExtraction.textQuality}</div>
                </div>
              </div>
            </div>
            {report.textExtraction.hasText && (
              <>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Extracted Text</div>
                  <div className="text-sm whitespace-pre-wrap font-mono bg-background/50 p-3 rounded">
                    {report.textExtraction.extractedText || "No text extracted"}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Text Analysis</div>
                  <div className="text-sm">{report.textExtraction.textAnalysis}</div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Contextual Analysis Tab */}
          <TabsContent value="context" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Image Type</div>
                <div className="font-medium capitalize">{report.contextualAnalysis.imageType}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Mood</div>
                <div className="font-medium">{report.contextualAnalysis.mood}</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Primary Subject</div>
              <div className="text-sm">{report.contextualAnalysis.primarySubject}</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Setting</div>
              <div className="text-sm">{report.contextualAnalysis.setting}</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">Apparent Purpose</div>
              <div className="text-sm">{report.contextualAnalysis.purpose}</div>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommended Actions
              </div>
              <ul className="space-y-2">
                {report.overallAssessment.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveImageReport;
