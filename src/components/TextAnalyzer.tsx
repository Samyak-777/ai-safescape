
import React, { useState } from 'react';
import Button from './Button';
import { Check, AlertCircle, Ban, Search, Filter, ShieldIcon } from 'lucide-react';
import { analyzeText, textAnalysisOptions } from '@/services/api';
import { toast } from 'sonner';

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity', 'fact-check']);

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (!text.trim() || selectedOptions.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      const result = await analyzeText(text, selectedOptions);
      setAnalysisResults(result);
      
      // Show toast notification based on result
      if (result.status === 'clean') {
        toast.success('Analysis completed successfully');
      } else if (result.status === 'warning') {
        toast.warning('Potential issues detected');
      } else {
        toast.error('Issues detected in content');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Error analyzing text');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      default:
        return <Check size={18} />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-medium mb-6">Text Analysis</h3>
      
      <div className="mb-6">
        <textarea
          className="w-full h-40 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter text to analyze for potential misinformation, profanity, or fraud signals..."
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
          Analyze Text
        </Button>
        <button
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setText('')}
          disabled={!text.trim()}
        >
          Clear
        </button>
      </div>
      
      {analysisResults && (
        <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
          analysisResults.status === 'clean' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
          analysisResults.status === 'warning' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
          'bg-red-500/10 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 p-1.5 rounded-full ${
              analysisResults.status === 'clean' ? 'bg-green-500/20' :
              analysisResults.status === 'warning' ? 'bg-yellow-500/20' :
              'bg-red-500/20'
            }`}>
              {analysisResults.status === 'clean' ? <Check size={16} /> :
               analysisResults.status === 'warning' ? <AlertCircle size={16} /> :
               <Ban size={16} />}
            </div>
            <div>
              <p className="font-medium">{
                analysisResults.status === 'clean' ? 'All Clear' :
                analysisResults.status === 'warning' ? 'Potential Issue Detected' :
                'Issue Detected'
              }</p>
              <p className="text-sm mt-1">{analysisResults.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
