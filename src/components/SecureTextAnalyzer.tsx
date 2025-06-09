
import React, { useState } from 'react';
import Button from './Button';
import { FileText, AlertCircle, Check, Ban, Search, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
  confidence?: number;
}

const textAnalysisOptions = [
  { 
    id: 'profanity', 
    label: 'Profanity Check', 
    icon: 'Ban',
    description: 'Detect inappropriate language and profanity'
  },
  { 
    id: 'fact-check', 
    label: 'Fact Check', 
    icon: 'Check',
    description: 'Verify claims and fact accuracy'
  },
  { 
    id: 'scam', 
    label: 'Scam Detection', 
    icon: 'AlertCircle',
    description: 'Identify suspicious patterns and fraud indicators'
  },
  { 
    id: 'ethics', 
    label: 'Ethical Analysis', 
    icon: 'Shield',
    description: 'Check for hate speech or harmful content'
  },
  { 
    id: 'ascii', 
    label: 'ASCII Detection', 
    icon: 'Search',
    description: 'Detect ASCII art patterns in text'
  },
];

const SecureTextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity', 'scam']);

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      toast.error('Please enter some text to analyze');
      return false;
    }
    
    if (input.length > 10000) {
      toast.error('Text is too long (maximum 10,000 characters)');
      return false;
    }
    
    return true;
  };

  const handleAnalyze = async () => {
    if (!validateInput(text)) return;
    
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one analysis option');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('secure-text-analysis', {
        body: {
          text: text.trim(),
          options: selectedOptions
        }
      });
      
      if (error) {
        console.error('Analysis error:', error);
        toast.error('Analysis service temporarily unavailable');
        return;
      }
      
      if (data?.results) {
        setAnalysisResults(data.results);
        
        // Show appropriate toast based on results
        const hasIssues = data.results.some((result: AnalysisResult) => 
          result.status === 'warning' || result.status === 'danger'
        );
        
        if (hasIssues) {
          const criticalIssues = data.results.filter((result: AnalysisResult) => 
            result.status === 'danger'
          ).length;
          
          if (criticalIssues > 0) {
            toast.error(`Analysis completed - ${criticalIssues} critical issue(s) detected`);
          } else {
            toast.warning('Analysis completed - potential issues detected');
          }
        } else {
          toast.success('Analysis completed - no issues detected');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Ban':
        return <Ban size={18} />;
      case 'Check':
        return <Check size={18} />;
      case 'AlertCircle':
        return <AlertCircle size={18} />;
      case 'Shield':
        return <Shield size={18} />;
      case 'Search':
        return <Search size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return <Check size={16} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'danger':
        return <Ban size={16} className="text-red-600" />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-medium mb-6">Secure Text Analysis</h3>
      
      <div className="mb-6">
        <textarea
          className="w-full h-32 p-4 rounded-xl border border-border bg-background/50 resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Enter text to analyze for content safety, misinformation, and other issues..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={10000}
        />
        <div className="text-right text-sm text-muted-foreground mt-1">
          {text.length}/10,000 characters
        </div>
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
      
      <Button
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        disabled={!text.trim() || selectedOptions.length === 0}
      >
        <FileText size={18} />
        Analyze Text
      </Button>
      
      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">Analysis Results</h4>
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
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{result.type}</p>
                  <p className="text-sm mt-1">{result.message}</p>
                  {result.confidence && (
                    <p className="text-xs mt-1 opacity-70">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureTextAnalyzer;
