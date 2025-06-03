
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import SecurityAnalysisPanel from './SecurityAnalysisPanel';
import { SecurityAnalysisResult } from '@/services/threatIntelligence';

const AdvancedSecurityAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [latestResult, setLatestResult] = useState<SecurityAnalysisResult | null>(null);

  const handleAnalysisComplete = (result: SecurityAnalysisResult) => {
    setHasAnalyzed(true);
    setLatestResult(result);
  };

  const exampleThreats = [
    "URGENT: Your PayPal account has been suspended. Click here to verify your identity immediately or lose access forever. https://paypal-verification.suspicious-site.com",
    "Congratulations! You've won $50,000 in the international lottery. To claim your prize, please wire transfer $500 for processing fees to our secure account.",
    "Security Alert: Unusual activity detected on your Microsoft account. Please confirm your password by clicking this link: https://microsoft-security.fake-domain.net"
  ];

  const loadExample = (example: string) => {
    setContent(example);
    setHasAnalyzed(false);
    setLatestResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Advanced Security Content Analyzer
            <Badge variant="secondary" className="ml-2">
              Threat Intelligence
            </Badge>
          </CardTitle>
          <CardDescription>
            Analyze content for security threats, phishing attempts, social engineering, 
            and malicious patterns using advanced threat intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Content to Analyze
              </label>
              <Textarea
                placeholder="Paste suspicious emails, messages, or content here for security analysis..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium block">
                Try Example Threats:
              </label>
              <div className="grid gap-2">
                {exampleThreats.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example)}
                    className="text-left h-auto p-3 justify-start"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {example.substring(0, 80)}...
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {latestResult && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {latestResult.riskLevel === 'minimal' || latestResult.riskLevel === 'low' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  )}
                  <span className="font-medium">
                    Analysis Complete - {latestResult.riskLevel.toUpperCase()} Risk
                  </span>
                  <Badge variant="outline">
                    Score: {latestResult.overallScore}/100
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Found {latestResult.threats.length} threat(s) and {latestResult.patterns.length} suspicious pattern(s)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {content.trim() && (
        <SecurityAnalysisPanel 
          content={content} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Security Analysis Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Threat Detection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Social engineering patterns</li>
                <li>• Phishing indicators</li>
                <li>• Financial fraud schemes</li>
                <li>• Brand impersonation</li>
                <li>• Urgency tactics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Intelligence Sources</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Community threat feeds</li>
                <li>• Security vendor databases</li>
                <li>• Pattern recognition AI</li>
                <li>• Real-time analysis</li>
                <li>• Risk scoring algorithms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSecurityAnalyzer;
