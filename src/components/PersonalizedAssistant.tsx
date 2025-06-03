
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, AlertTriangle, CheckCircle, Clock, ExternalLink, Download, Lightbulb } from 'lucide-react';
import { getPersonalizedRecommendations, generateSecurityReport, PersonalizedAssistantResult, AssistantRecommendation } from '@/services/personalizedAssistant';
import { analyticsService } from '@/services/analyticsService';

interface PersonalizedAssistantProps {
  analysisResults: any[];
  onRecommendationsReady?: (recommendations: PersonalizedAssistantResult) => void;
}

const PersonalizedAssistant: React.FC<PersonalizedAssistantProps> = ({
  analysisResults,
  onRecommendationsReady
}) => {
  const [recommendations, setRecommendations] = useState<PersonalizedAssistantResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [securityReport, setSecurityReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (analysisResults && analysisResults.length > 0) {
      generateRecommendations();
    }
  }, [analysisResults]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      analyticsService.trackEvent('user_action', {
        action: 'generate_personalized_recommendations',
        analysisCount: analysisResults.length
      });

      const result = await getPersonalizedRecommendations(analysisResults, {
        userType: 'individual',
        riskTolerance: 'medium'
      });

      setRecommendations(result);
      onRecommendationsReady?.(result);

      analyticsService.trackEvent('analysis_complete', {
        type: 'personalized_recommendations',
        recommendationCount: result.recommendations.length,
        riskLevel: result.overallRiskAssessment
      });
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      analyticsService.trackEvent('api_error', {
        service: 'Personalized Assistant',
        error: 'Failed to generate recommendations'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    if (!recommendations) return;
    
    setIsGeneratingReport(true);
    try {
      const report = await generateSecurityReport(analysisResults, recommendations);
      setSecurityReport(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'high': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'low': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'soon': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'when_convenient': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500 animate-pulse" />
            AI Security Assistant
          </CardTitle>
          <CardDescription>
            Analyzing your content and generating personalized recommendations...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Security Assistant
            <Badge variant="secondary">Powered by Gemini 2.5 Pro</Badge>
          </CardTitle>
          <CardDescription>
            Personalized analysis and recommendations based on detected threats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Risk Assessment */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Overall Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">{recommendations.overallRiskAssessment}</p>
          </div>

          {/* Priority Actions */}
          {recommendations.priorityActions.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Immediate Actions Required
              </h3>
              <ul className="space-y-2">
                {recommendations.priorityActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-600 text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Recommendations */}
          {recommendations.recommendations.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Detailed Recommendations</h3>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {recommendations.recommendations.map((rec, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(rec.severity)}>
                            {rec.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{rec.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getUrgencyIcon(rec.urgencyLevel)}
                          {rec.estimatedTime}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{rec.summary}</p>
                      
                      {rec.detailedAnalysis && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Analysis</h4>
                          <p className="text-xs text-muted-foreground">{rec.detailedAnalysis}</p>
                        </div>
                      )}

                      {rec.actionSteps.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Action Steps</h4>
                          <ul className="text-xs space-y-1">
                            {rec.actionSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-1">
                                <span className="text-primary">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.preventionTips.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Prevention Tips</h4>
                          <ul className="text-xs space-y-1">
                            {rec.preventionTips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-1">
                                <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.resources.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Resources</h4>
                          <div className="space-y-1">
                            {rec.resources.map((resource, resIndex) => (
                              <div key={resIndex} className="flex items-center gap-2 text-xs">
                                <ExternalLink className="h-3 w-3" />
                                <span className="font-medium">{resource.title}</span>
                                <span className="text-muted-foreground">- {resource.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Learning Insights */}
          {recommendations.learningInsights.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Security Learning Insights
              </h3>
              <ul className="space-y-2 text-sm">
                {recommendations.learningInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Suggestions */}
          {recommendations.followUpSuggestions.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Follow-up Suggestions</h3>
              <ul className="space-y-2 text-sm">
                {recommendations.followUpSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Report Generation */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Report</h4>
              <p className="text-xs text-muted-foreground">Generate a comprehensive security report</p>
            </div>
            <Button 
              onClick={generateReport} 
              disabled={isGeneratingReport}
              size="sm"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingReport ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          {securityReport && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Security Report</h4>
              <ScrollArea className="h-40">
                <p className="text-sm whitespace-pre-wrap">{securityReport}</p>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedAssistant;
