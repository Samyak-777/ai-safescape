
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, XCircle, Sparkles, Brain, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeContentWithGeminiAdvanced, GeminiAdvancedResult } from '@/services/geminiAdvanced';
import { reportThreat, determineThreatCategory, extractDomain } from '@/services/threatReporting';

interface AnalysisResultWithType extends GeminiAdvancedResult {
  type: string;
}

const AdvancedTextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useStructuredOutput, setUseStructuredOutput] = useState(true);
  const [results, setResults] = useState<AnalysisResultWithType[]>([]);
  const [apiWarning, setApiWarning] = useState<string | null>(null);
  const { toast } = useToast();

  const analysisOptions = [
    { 
      id: 'profanity', 
      label: 'Advanced Profanity Detection', 
      description: 'Context-aware inappropriate language detection',
      prompt: 'profanity, toxicity, and inappropriate language with cultural context'
    },
    { 
      id: 'misinformation', 
      label: 'Misinformation Analysis', 
      description: 'Fact-checking and misinformation detection',
      prompt: 'misinformation, fact-checking, and false claims with source verification'
    },
    { 
      id: 'bias', 
      label: 'Bias Detection', 
      description: 'Identify cultural, gender, and social biases',
      prompt: 'bias, discrimination, and unfair representation across all dimensions'
    },
    { 
      id: 'manipulation', 
      label: 'Manipulation Tactics', 
      description: 'Detect psychological manipulation and coercion',
      prompt: 'manipulation, coercion, psychological pressure, and emotional exploitation'
    },
    { 
      id: 'privacy', 
      label: 'Privacy Violations', 
      description: 'Identify potential privacy breaches and data exposure',
      prompt: 'privacy violations, personal data exposure, and confidentiality breaches'
    },
  ];

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const analyzeText = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    if (selectedOptions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one analysis option",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResults([]);
    setApiWarning(null);

    try {
      const analysisPromises = selectedOptions.map(async (optionId) => {
        const option = analysisOptions.find(opt => opt.id === optionId);
        if (!option) return null;

        try {
          const result = await analyzeContentWithGeminiAdvanced(
            text,
            option.prompt,
            useStructuredOutput
          );
          
          // Check if this is a fallback result
          if (result.explanation?.includes('Fallback analysis') || result.explanation?.includes('API temporarily unavailable')) {
            setApiWarning('Gemini API is not enabled. Please enable the Generative Language API in your Google Cloud project for full functionality.');
          }
          
          return { ...result, type: option.label } as AnalysisResultWithType;
        } catch (error) {
          console.error(`Analysis error for ${option.label}:`, error);
          return {
            type: option.label,
            isHarmful: false,
            harmCategories: [],
            confidence: 0,
            explanation: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            reasoning: ['Service temporarily unavailable'],
            contextualFactors: [],
            riskLevel: 'low' as const,
            recommendations: ['Please try again later or check API configuration']
          } as AnalysisResultWithType;
        }
      });

      const analysisResults = await Promise.all(analysisPromises);
      const validResults = analysisResults.filter(result => result !== null) as AnalysisResultWithType[];
      
      setResults(validResults);
      
      // Auto-report high-risk threats to community intelligence
      const highRiskResults = validResults.filter(r => 
        r.riskLevel === 'high' || r.riskLevel === 'critical'
      );
      
      if (highRiskResults.length > 0) {
        // Extract URLs from text for domain reporting
        const urlPattern = /https?:\/\/[^\s]+/gi;
        const urls = text.match(urlPattern) || [];
        const primaryDomain = urls.length > 0 ? extractDomain(urls[0]) : undefined;
        
        // Combine all threat categories
        const allCategories = highRiskResults.flatMap(r => r.harmCategories || []);
        const threatCategory = determineThreatCategory(text, allCategories);
        
        // Report the threat
        await reportThreat({
          threatType: `${threatCategory} Detected`,
          threatCategory,
          primaryDomain,
          description: `High-risk content detected: ${allCategories.slice(0, 3).join(', ')}`,
          severity: highRiskResults.some(r => r.riskLevel === 'critical') ? 'critical' : 'high',
        });
      }
      
      const fallbackCount = validResults.filter(r => r.explanation?.includes('Fallback analysis')).length;
      if (fallbackCount > 0) {
        toast({
          title: "Analysis Complete (Limited)",
          description: `Completed ${validResults.length} analyses. ${fallbackCount} used fallback due to API limitations.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `Completed ${validResults.length} advanced analyses`,
        });
      }
    } catch (error) {
      console.error('Advanced analysis error:', error);
      toast({
        title: "Error",
        description: "Advanced analysis failed. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, selectedOptions, useStructuredOutput, toast]);

  const getStatusIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Advanced AI Text Analysis
            <Badge variant="outline" className="ml-2">Gemini 3</Badge>
          </CardTitle>
          <CardDescription>
            Next-generation content analysis with structured outputs and advanced reasoning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiWarning && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {apiWarning}
                <a 
                  href="https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary underline hover:no-underline"
                >
                  Enable API →
                </a>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Structured Output</label>
                <p className="text-xs text-muted-foreground">Use function calling for consistent results</p>
              </div>
              <Switch
                checked={useStructuredOutput}
                onCheckedChange={setUseStructuredOutput}
              />
            </div>
          </div>

          <Textarea
            placeholder="Enter text for advanced AI analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
          />

          <div className="space-y-3">
            <label className="text-sm font-medium">Advanced Analysis Options</label>
            <div className="grid grid-cols-1 gap-3">
              {analysisOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                  />
                  <div className="space-y-1 flex-1">
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                    >
                      <Brain className="h-4 w-4 text-purple-500" />
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={analyzeText}
            disabled={isAnalyzing || !text.trim() || selectedOptions.length === 0}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Start Advanced Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analysis Results</CardTitle>
            <CardDescription>
              AI-powered content analysis with detailed reasoning and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.riskLevel)}
                      <h3 className="font-semibold">{result.type}</h3>
                      <Badge className={getRiskColor(result.riskLevel)}>
                        {result.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Analysis</h4>
                      <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </div>

                    {result.reasoning.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Reasoning Process</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.reasoning.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.harmCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Detected Issues</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.harmCategories.map((category, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.contextualFactors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Contextual Factors</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.contextualFactors.map((factor, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-xs mt-1">→</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs">Risk Assessment:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          result.riskLevel === 'low' ? 'bg-green-500' :
                          result.riskLevel === 'medium' ? 'bg-yellow-500' :
                          result.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${
                            result.riskLevel === 'low' ? 25 :
                            result.riskLevel === 'medium' ? 50 :
                            result.riskLevel === 'high' ? 75 : 100
                          }%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedTextAnalyzer;
