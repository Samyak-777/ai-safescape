import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, CheckCircle, Shield, Zap, Database, AlertTriangle, Phone, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AnalysisResult {
  analysisType: 'rag-match' | 'paywall-limited' | 'full-gemini';
  source?: 'REAL-TIME_DATABASE' | 'DEEP_AI_ANALYSIS';
  isKnownMisinformation?: boolean;
  isPaywalled?: boolean;
  fallback?: boolean;
  fallback_reason?: string;
  confidence?: number;
  matchedDocument?: {
    id: string;
    category: string;
    explanation: string;
    tags: string[];
  };
  verdict?: string;
  message?: string;
  recommendation?: string;
  aiAnalysis?: string;
  urlMetadata?: {
    domain: string;
    title: string;
    isPaywalled: boolean;
  };
  warning?: string;
}

const MisinformationRadar: React.FC = () => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const handleAnalyze = async (inputType: 'url' | 'text') => {
    const input = inputType === 'url' ? url : text;
    
    if (!input.trim()) {
      toast.error('Please provide a URL or text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('rag-analysis', {
        body: inputType === 'url' ? { url: input } : { text: input }
      });

      if (error) throw error;

      setResult(data);
      
      if (data.isKnownMisinformation) {
        toast.error('Known Misinformation Detected!', {
          description: 'This matches a verified piece of misinformation in our database.',
        });
      } else if (data.isPaywalled) {
        toast.warning('Paywall Detected', {
          description: 'Analysis is limited to public metadata only.',
        });
      } else {
        toast.success('Analysis Complete', {
          description: 'Deep AI analysis finished.',
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis Failed', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Card className="p-6 mt-6 animate-fade-in">
        <div className="space-y-4">
          {/* Edge Case Visualizer - Warning Banner for Paywall */}
          {result.fallback && result.fallback_reason && (
            <div className="w-full bg-orange-500/20 border-2 border-orange-500/50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 text-lg mb-1">
                    ⚠️ Limited Analysis: {result.fallback_reason}
                  </h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    The assessment below is based on public metadata only and may not be fully accurate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Source of Truth Indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            {result.source && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-help ${
                      result.source === 'REAL-TIME_DATABASE' 
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30' 
                        : 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                    }`}>
                      {result.source === 'REAL-TIME_DATABASE' ? (
                        <>
                          <Database className="w-3.5 h-3.5" />
                          Verified by Real-Time Database
                        </>
                      ) : (
                        <>
                          <Brain className="w-3.5 h-3.5" />
                          Analyzed by Gemini 2.5 Pro
                        </>
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      {result.source === 'REAL-TIME_DATABASE'
                        ? 'This result was instantly verified against our curated database of known misinformation for maximum speed and accuracy.'
                        : "This novel content was analyzed using Google's advanced Gemini 2.5 Pro model for a deep, contextual understanding."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Known Misinformation Alert */}
          {result.isKnownMisinformation && result.matchedDocument && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                    ⚠️ KNOWN MISINFORMATION DETECTED
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                    {result.matchedDocument.explanation}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.matchedDocument.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-red-500/20 text-red-700 dark:text-red-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Category: {result.matchedDocument.category}
                  </p>
                  {result.confidence && (
                    <p className="text-xs text-red-600 dark:text-red-300 mt-2">
                      Match Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                  )}
                </div>
              </div>
              {result.recommendation && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Recommended Action:
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {result.recommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paywall Warning */}
          {result.isPaywalled && result.urlMetadata && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">
                    {result.warning || 'Paywall Detected'}
                  </h3>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mb-2">
                    Domain: {result.urlMetadata.domain}
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Title: {result.urlMetadata.title}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {result.aiAnalysis && (() => {
            try {
              // Try to parse JSON from the AI response
              const jsonMatch = result.aiAnalysis.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                
                return (
                  <div className="space-y-4">
                    {/* Credibility Score */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Credibility Score
                        </h3>
                        <span className={`text-2xl font-bold ${
                          parsed.credibility_score >= 70 ? 'text-green-500' :
                          parsed.credibility_score >= 40 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {parsed.credibility_score}/100
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            parsed.credibility_score >= 70 ? 'bg-green-500' :
                            parsed.credibility_score >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${parsed.credibility_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Risk Level & Verdict */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                        <p className={`font-semibold uppercase ${
                          parsed.risk_level === 'critical' ? 'text-red-600' :
                          parsed.risk_level === 'high' ? 'text-orange-600' :
                          parsed.risk_level === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {parsed.risk_level}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Verdict</p>
                        <p className="font-semibold capitalize">{parsed.verdict}</p>
                      </div>
                    </div>

                    {/* Red Flags */}
                    {parsed.red_flags && parsed.red_flags.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Red Flags
                        </h3>
                        <ul className="space-y-1">
                          {parsed.red_flags.map((flag: any, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{typeof flag === 'object' ? JSON.stringify(flag) : flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Analysis */}
                    {parsed.analysis && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {typeof parsed.analysis === 'object' ? JSON.stringify(parsed.analysis, null, 2) : parsed.analysis}
                        </p>
                      </div>
                    )}

                    {/* Recommendation */}
                    {parsed.recommendation && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-primary">Recommendation</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {typeof parsed.recommendation === 'object' ? JSON.stringify(parsed.recommendation, null, 2) : parsed.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
            } catch (e) {
              console.error('Error parsing AI response:', e);
            }
            
            // Fallback to raw text if parsing fails
            return (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  AI Analysis
                </h3>
                <p className="text-sm whitespace-pre-wrap">{result.aiAnalysis}</p>
              </div>
            );
          })()}

          {/* Clean Result */}
          {!result.isKnownMisinformation && !result.isPaywalled && result.message && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Urgent Help Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowHelpDialog(true)}
          variant="destructive"
          className="gap-2"
        >
          <Phone className="w-4 h-4" />
          Urgent Help
        </Button>
      </div>

      {/* Urgent Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Immediate Support Resources
            </DialogTitle>
            <DialogDescription className="sr-only">
              Emergency helpline numbers and resources for immediate assistance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                If you or someone you know is in immediate danger, please contact the authorities.
              </p>
            </div>

            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-1">Cyber Crime Helpline</h4>
                <a
                  href="tel:1930"
                  className="text-primary hover:underline font-medium text-lg"
                >
                  📞 Dial 1930
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  National helpline for reporting cybercrime
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-1">National Commission for Women</h4>
                <a
                  href="tel:7827170170"
                  className="text-primary hover:underline font-medium text-lg"
                >
                  📞 Dial 7827170170
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  24x7 helpline for women in distress
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-1">Government Fact-Checker</h4>
                <a
                  href="https://factcheck.pib.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  🔗 PIB Fact Check
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Official government fact-checking service
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowHelpDialog(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">🎯 Misinformation Radar</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          RAG-powered misinformation detection with instant matching against known false claims
          and intelligent paywall handling
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Database className="w-4 h-4" /> 15+ Known Patterns
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" /> Instant Detection
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" /> AI-Powered
          </span>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="url">Analyze URL</TabsTrigger>
            <TabsTrigger value="text">Analyze Text</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Enter URL to analyze
              </label>
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mb-4"
              />
            </div>
            <Button
              onClick={() => handleAnalyze('url')}
              disabled={isAnalyzing || !url.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze URL
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Paste text to analyze
              </label>
              <Textarea
                placeholder="Enter text, message, or claim to check for misinformation..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="mb-4"
              />
            </div>
            <Button
              onClick={() => handleAnalyze('text')}
              disabled={isAnalyzing || !text.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze Text
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {renderResult()}
      </Card>
    </div>
  );
};

export default MisinformationRadar;
