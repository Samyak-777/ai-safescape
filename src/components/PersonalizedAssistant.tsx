import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, AlertTriangle, CheckCircle, Clock, ExternalLink, Download, Lightbulb, Heart, Shield, HelpCircle } from 'lucide-react';
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
        analysisCount: analysisResults.length,
        platform: 'AI-SafeScape'
      });

      const result = await getPersonalizedRecommendations(analysisResults, {
        userType: 'individual',
        riskTolerance: 'medium'
      });

      setRecommendations(result);
      onRecommendationsReady?.(result);

      analyticsService.trackEvent('analysis_complete', {
        type: 'personalized_harm_guidance',
        recommendationCount: result.recommendations.length,
        riskLevel: result.overallRiskAssessment
      });
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      analyticsService.trackEvent('api_error', {
        service: 'AI-SafeScape Personalized Assistant',
        error: 'Failed to generate harm guidance'
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
            <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
            AI-SafeScape Personal Assistant
          </CardTitle>
          <CardDescription>
            Analyzing your situation and preparing personalized support and guidance...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-muted-foreground">Preparing your personalized support...</span>
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
            <Shield className="h-5 w-5 text-blue-500" />
            AI-SafeScape Personal Assistant
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Trained for Online Safety
            </Badge>
          </CardTitle>
          <CardDescription>
            Empathetic AI guidance specifically designed to help you navigate online harms and stay safe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Empathetic Risk Assessment */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Your Safety Assessment</h3>
                <p className="text-sm text-blue-800">{recommendations.overallRiskAssessment}</p>
                <p className="text-xs text-blue-600 mt-2 italic">
                  Remember: You're not alone. AI-SafeScape is here to support you through this.
                </p>
              </div>
            </div>
          </div>

          {/* Immediate Safety Actions */}
          {recommendations.priorityActions.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Immediate Safety Steps
                <Badge variant="destructive" className="text-xs">Take Action Now</Badge>
              </h3>
              <div className="space-y-3">
                {recommendations.priorityActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0 font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-red-900">{action}</p>
                      <p className="text-xs text-red-700 mt-1">Your safety is our priority. Please take this action immediately.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalized Harm Guidance */}
          {recommendations.recommendations.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-purple-500" />
                Personalized Guidance & Support
              </h3>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {recommendations.recommendations.map((rec, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-purple-400">
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
                      
                      <p className="text-sm mb-3 font-medium text-purple-900">{rec.summary}</p>
                      
                      {rec.detailedAnalysis && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                          <h4 className="text-xs font-medium text-purple-700 mb-1">Understanding What Happened</h4>
                          <p className="text-xs text-purple-800">{rec.detailedAnalysis}</p>
                        </div>
                      )}

                      {rec.actionSteps.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Recommended Actions
                          </h4>
                          <ul className="text-xs space-y-1">
                            {rec.actionSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                                <span className="text-green-600 font-bold">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.preventionTips.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <Shield className="h-3 w-3 text-blue-500" />
                            Future Protection Tips
                          </h4>
                          <ul className="text-xs space-y-1">
                            {rec.preventionTips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                                <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.resources.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <Heart className="h-3 w-3 text-pink-500" />
                            Support Resources
                          </h4>
                          <div className="space-y-2">
                            {rec.resources.map((resource, resIndex) => (
                              <div key={resIndex} className="flex items-start gap-2 text-xs p-2 bg-pink-50 rounded">
                                <ExternalLink className="h-3 w-3 text-pink-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-pink-900">{resource.title}</span>
                                  <p className="text-pink-700">{resource.description}</p>
                                  {resource.url && (
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                                       className="text-pink-600 hover:text-pink-800 underline">
                                      Visit Resource →
                                    </a>
                                  )}
                                </div>
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
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium mb-2">Security Report</h4>
              <ScrollArea className="h-40">
                <p className="text-sm whitespace-pre-wrap">{securityReport}</p>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">You're Protected</h4>
            <p className="text-xs text-green-800">
              AI-SafeScape is continuously monitoring and learning to keep you safer online. 
              If you need immediate help, please contact local authorities or crisis support services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedAssistant;
