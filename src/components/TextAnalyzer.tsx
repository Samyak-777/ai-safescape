import React, { useState } from 'react';
import Button from './Button';
import PersonalizedAssistant from './PersonalizedAssistant';
import { Check, AlertCircle, Ban, Search, Filter, ShieldIcon } from 'lucide-react';
import { textAnalysisOptions } from '@/services/api';
import { toast } from 'sonner';
import { analyzeTextWithRealAPIs } from '@/services/realAPI';
import { errorHandler } from '@/services/errorHandling';
import ServiceStatusIndicator from './ServiceStatusIndicator';
import RetryButton from './RetryButton';
import AdvancedAnalysisPanel from './AdvancedAnalysisPanel';

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | Array<{
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
    confidence?: number;
  }>>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity', 'fact-check']);
  const [failedServices, setFailedServices] = useState<string[]>([]);
  const [showAssistant, setShowAssistant] = useState(false);

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const performAnalysis = async (isRetry: boolean = false) => {
    if (!text.trim() || selectedOptions.length === 0) {
      toast.error('Please enter text and select at least one analysis option');
      return;
    }
    
    if (isRetry) {
      setIsRetrying(true);
    } else {
      setIsAnalyzing(true);
    }
    setAnalysisResults(null);
    setFailedServices([]);
    setShowAssistant(false);
    
    try {
      console.log('Starting analysis with options:', selectedOptions);
      const results = await analyzeTextWithRealAPIs(text, selectedOptions);
      console.log('Analysis results:', results);
      
      // Track failed services
      const failed = results
        .filter(result => result.message.includes('unavailable') || result.message.includes('failed'))
        .map(result => result.type);
      
      setFailedServices(failed);
      setAnalysisResults(results);
      
      // Show assistant if there are meaningful results
      const meaningfulResults = results.filter(r => r.status !== 'clean' || r.confidence);
      if (meaningfulResults.length > 0) {
        setShowAssistant(true);
      }
      
      // Use enhanced success messaging
      const successfulServices = results.filter(r => !failed.includes(r.type)).length;
      if (successfulServices > 0) {
        toast.success(`Analysis completed for ${successfulServices} service${successfulServices > 1 ? 's' : ''}`, {
          description: failed.length > 0 ? `${failed.length} service${failed.length > 1 ? 's' : ''} temporarily unavailable` : undefined,
          duration: 4000,
        });
      } else {
        toast.warning('All services unavailable', {
          description: 'Please check your API configuration or try again later',
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      const enhancedError = errorHandler.handleAPIError(
        error,
        'Analysis Engine',
        'text analysis',
        false
      );
      
      // Show user-friendly error message
      if (enhancedError.context?.fallbackAvailable) {
        toast.warning('Some services unavailable', {
          description: 'Analysis completed with available services. Some features may be limited.',
          duration: 5000,
        });
      } else {
        toast.error('Analysis failed', {
          description: enhancedError.context?.userMessage || 'Please try again later',
          duration: 5000,
        });
      }
    } finally {
      setIsAnalyzing(false);
      setIsRetrying(false);
    }
  };

  const handleAnalyze = () => performAnalysis(false);
  const handleRetry = () => performAnalysis(true);

  // Function to get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Ban':
        return <Ban size={18} />;
      case 'Search':
        return <Search size={18} />;
      case 'ShieldIcon':
        return <ShieldIcon size={18} />;
      case 'AlertCircle':
        return <AlertCircle size={18} />;
      case 'Check':
        return <Check size={18} />;
      default:
        return <Check size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">Real-Time Text Analysis</h3>
          <ServiceStatusIndicator />
        </div>
        
        <div className="mb-6">
          <textarea
            className="w-full h-40 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter text to analyze for potential misinformation, profanity, or fraud signals using real AI APIs..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Analysis Options</p>
          <div className="flex flex-wrap gap-2">
            {textAnalysisOptions.map((option) => (
              <button
                key={option.id}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedOptions.includes(option.id)
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
                onClick={() => handleOptionToggle(option.id)}
                title={option.description}
              >
                {getIconComponent(option.icon)}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={!text.trim() || selectedOptions.length === 0}
          >
            <Filter size={18} />
            Analyze with Real APIs
          </Button>
          <div className="flex items-center gap-3">
            {failedServices.length > 0 && (
              <RetryButton
                onRetry={handleRetry}
                isRetrying={isRetrying}
                failedServices={failedServices}
              />
            )}
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setText('')}
              disabled={!text.trim()}
            >
              Clear
            </button>
          </div>
        </div>
        
        {analysisResults && analysisResults.length > 0 && (
          <div className="mt-6 space-y-4">
            {analysisResults.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl animate-fade-in ${
                  result.status === 'clean' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                  result.status === 'warning' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                  'bg-red-500/10 text-red-700 dark:text-red-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-full ${
                    result.status === 'clean' ? 'bg-green-500/20' :
                    result.status === 'warning' ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {result.status === 'clean' ? <Check size={16} /> :
                    result.status === 'warning' ? <AlertCircle size={16} /> :
                    <Ban size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{result.type}</p>
                      {result.confidence && (
                        <span className="text-xs opacity-70">
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{result.message}</p>
                    {result.message.includes('unavailable') && (
                      <p className="text-xs mt-2 opacity-75">
                        This service is temporarily unavailable. Results from other services are still shown.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Advanced Analysis Panel */}
      {text.trim() && (
        <AdvancedAnalysisPanel 
          text={text}
          onResultsReady={(results) => {
            console.log('Advanced analysis results:', results);
          }}
        />
      )}

      {/* Personalized AI Assistant */}
      {showAssistant && analysisResults && (
        <PersonalizedAssistant 
          analysisResults={analysisResults}
          onRecommendationsReady={(recommendations) => {
            console.log('Personalized recommendations ready:', recommendations);
          }}
        />
      )}
    </div>
  );
};

export default TextAnalyzer;
