
import React, { useState } from 'react';
import Button from './Button';
import { Check, AlertCircle, Ban, Search, Filter, ShieldIcon } from 'lucide-react';
import { textAnalysisOptions } from '@/services/api';
import { toast } from 'sonner';
import { analyzeText } from '@/services/api';

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | Array<{
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity', 'fact-check']);

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (!text.trim() || selectedOptions.length === 0) {
      toast.error('Please enter text and select at least one analysis option');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      console.log('Starting analysis with options:', selectedOptions);
      // Use the mock API directly instead of the serverless function
      const results = await analyzeText(text, selectedOptions);
      console.log('Analysis results:', results);
      setAnalysisResults(results);
      
      // Determine overall status for toast notification
      const highestSeverity = results.reduce((highest, current) => {
        if (current.status === 'danger') return 'danger';
        if (current.status === 'warning' && highest !== 'danger') return 'warning';
        return highest === 'danger' || highest === 'warning' ? highest : 'clean';
      }, 'clean' as 'clean' | 'warning' | 'danger');
      
      // Show toast notification based on highest severity
      if (highestSeverity === 'clean') {
        toast.success('Analysis completed successfully');
      } else if (highestSeverity === 'warning') {
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
      case 'Check':
        return <Check size={18} />;
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
                <div>
                  <p className="font-medium capitalize">{result.type}</p>
                  <p className="text-sm mt-1">{result.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
