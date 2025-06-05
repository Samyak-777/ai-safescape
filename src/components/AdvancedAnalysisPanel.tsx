
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserX, Bot, Heart, Network, AlertTriangle, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeTextWithAdvancedFeatures, advancedAnalysisOptions } from '@/services/advancedAnalysisAPI';

interface AdvancedAnalysisPanelProps {
  text: string;
  onResultsReady?: (results: any[]) => void;
}

const AdvancedAnalysisPanel: React.FC<AdvancedAnalysisPanelProps> = ({ text, onResultsReady }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['harassment-patterns']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'UserX':
        return <UserX size={18} />;
      case 'Bot':
        return <Bot size={18} />;
      case 'Heart':
        return <Heart size={18} />;
      case 'Network':
        return <Network size={18} />;
      default:
        return <Shield size={18} />;
    }
  };

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const performAdvancedAnalysis = async () => {
    if (!text.trim() || selectedOptions.length === 0) {
      toast.error('Please enter text and select at least one advanced analysis option');
      return;
    }

    setIsAnalyzing(true);
    setResults([]);

    try {
      const analysisResults = await analyzeTextWithAdvancedFeatures(text, selectedOptions);
      setResults(analysisResults);
      onResultsReady?.(analysisResults);

      const criticalResults = analysisResults.filter(r => r.status === 'critical');
      const dangerResults = analysisResults.filter(r => r.status === 'danger');

      if (criticalResults.length > 0) {
        toast.error('Critical threats detected', {
          description: 'Immediate intervention may be required',
          duration: 8000,
        });
      } else if (dangerResults.length > 0) {
        toast.warning('High-risk content detected', {
          description: 'Review recommendations carefully',
          duration: 6000,
        });
      } else {
        toast.success('Advanced analysis completed', {
          description: 'No critical threats identified',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Advanced analysis error:', error);
      toast.error('Advanced analysis failed', {
        description: 'Please try again later',
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'critical':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'immediate':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'urgent':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'monitor':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Advanced AI Detection
        </CardTitle>
        <CardDescription>
          Next-generation threat detection using pattern analysis, AI content detection, and behavioral analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Advanced Detection Features</label>
          <div className="grid grid-cols-1 gap-3">
            {advancedAnalysisOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => handleOptionToggle(option.id)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getIconComponent(option.icon)}
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={performAdvancedAnalysis}
          disabled={isAnalyzing || !text.trim() || selectedOptions.length === 0}
          className="w-full"
          variant="outline"
        >
          {isAnalyzing ? (
            <>
              <Bot className="mr-2 h-4 w-4 animate-pulse" />
              Running Advanced Analysis...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Advanced Analysis
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-sm">Advanced Analysis Results</h4>
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium capitalize">{result.type}</h5>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                    {result.urgency && getUrgencyIcon(result.urgency)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">{result.message}</p>
                
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Recommendations:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalysisPanel;
