
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { publishAnalysisRequest, AnalysisRequest, AnalysisResponse } from '@/services/pubsubService';
import { analyzeTextWithResilientAPIs } from '@/services/resilientAPI';

interface AnalysisResult {
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
  confidence?: number;
  processingTime?: number;
  apiSource?: string;
}

const AsyncTextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'sync' | 'async'>('async');
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  const analysisOptions = [
    { id: 'profanity', label: 'Profanity Detection', description: 'Detect inappropriate language' },
    { id: 'fact-check', label: 'Fact Check', description: 'Verify factual claims' },
    { id: 'scam', label: 'Scam Detection', description: 'Identify fraud attempts' },
    { id: 'ethics', label: 'Ethics Check', description: 'Detect ethical violations' },
    { id: 'ascii', label: 'ASCII Detection', description: 'Find special characters' },
  ];

  // Set up global callback for async results
  useEffect(() => {
    const handleAnalysisComplete = (response: AnalysisResponse) => {
      if (response.id === currentRequestId) {
        setIsAnalyzing(false);
        setCurrentRequestId(null);
        
        if (response.status === 'completed') {
          setResults(response.results);
          toast({
            title: "Analysis Complete",
            description: `Processed in ${response.processingTime}ms`,
          });
        } else {
          toast({
            title: "Analysis Failed",
            description: "Unable to complete analysis. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      (window as any).onAnalysisComplete = handleAnalysisComplete;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).onAnalysisComplete;
      }
    };
  }, [currentRequestId, toast]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const analyzeTextAsync = useCallback(async () => {
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

    try {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentRequestId(requestId);

      const request: AnalysisRequest = {
        id: requestId,
        content: text,
        analysisTypes: selectedOptions,
        timestamp: Date.now(),
      };

      await publishAnalysisRequest(request);
      
      toast({
        title: "Analysis Started",
        description: "Your request has been queued for processing",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setCurrentRequestId(null);
      toast({
        title: "Error",
        description: "Failed to start analysis. Please try again.",
        variant: "destructive",
      });
    }
  }, [text, selectedOptions, toast]);

  const analyzeTextSync = useCallback(async () => {
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

    try {
      const analysisResults = await analyzeTextWithResilientAPIs(text, selectedOptions);
      setResults(analysisResults);
      
      toast({
        title: "Analysis Complete",
        description: "Text analysis finished successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Analysis failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, selectedOptions, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
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
            <Zap className="h-5 w-5" />
            Advanced Text Analysis
          </CardTitle>
          <CardDescription>
            Analyze text content using multiple AI services with resilient, scalable architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Processing Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="async"
                  checked={analysisMode === 'async'}
                  onChange={(e) => setAnalysisMode(e.target.value as 'async')}
                  className="text-primary"
                />
                <span className="text-sm">Asynchronous (Recommended)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="sync"
                  checked={analysisMode === 'sync'}
                  onChange={(e) => setAnalysisMode(e.target.value as 'sync')}
                  className="text-primary"
                />
                <span className="text-sm">Synchronous</span>
              </label>
            </div>
          </div>

          <Textarea
            placeholder="Enter text to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="space-y-3">
            <label className="text-sm font-medium">Analysis Options</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={analysisMode === 'async' ? analyzeTextAsync : analyzeTextSync}
            disabled={isAnalyzing || !text.trim() || selectedOptions.length === 0}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {analysisMode === 'async' ? 'Processing...' : 'Analyzing...'}
              </>
            ) : (
              <>
                {analysisMode === 'async' ? <Clock className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />}
                {analysisMode === 'async' ? 'Queue Analysis' : 'Analyze Now'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Content analysis completed using {analysisMode} processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <h3 className="font-semibold capitalize">{result.type}</h3>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {result.processingTime && (
                        <span>{result.processingTime}ms</span>
                      )}
                      {result.apiSource && (
                        <span>via {result.apiSource}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                  {result.confidence !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs">{Math.round(result.confidence * 100)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AsyncTextAnalyzer;
