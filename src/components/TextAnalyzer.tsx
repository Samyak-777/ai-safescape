
import React, { useState } from 'react';
import Button from './Button';
import { Check, AlertCircle, Ban, Search, Filter, Shield } from 'lucide-react';

interface AnalysisOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['profanity', 'fact-check']);

  const analysisOptions: AnalysisOption[] = [
    { 
      id: 'profanity', 
      label: 'Profanity Check', 
      icon: <Ban size={18} />,
      description: 'Detect inappropriate language and profanity'
    },
    { 
      id: 'fact-check', 
      label: 'Fact Check', 
      icon: <Check size={18} />,
      description: 'Verify claims and fact accuracy'
    },
    { 
      id: 'scam', 
      label: 'Scam Detection', 
      icon: <AlertCircle size={18} />,
      description: 'Identify suspicious URLs and text patterns'
    },
    { 
      id: 'ethics', 
      label: 'Ethical Analysis', 
      icon: <Shield size={18} />,
      description: 'Check for hate speech or harmful content'
    },
    { 
      id: 'ascii', 
      label: 'ASCII Detection', 
      icon: <Search size={18} />,
      description: 'Detect ASCII art in the text'
    },
  ];

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate analysis - in a real app this would call APIs
    setTimeout(() => {
      // Demo result based on example text
      let result;
      
      if (text.toLowerCase().includes('fake news') && selectedOptions.includes('fact-check')) {
        result = {
          type: 'fact-check',
          status: 'warning' as const,
          message: 'This text contains unverified claims that may need fact-checking'
        };
      } else if (text.toLowerCase().includes('free money') && selectedOptions.includes('scam')) {
        result = {
          type: 'scam',
          status: 'danger' as const,
          message: 'This text contains suspicious patterns typical of scams'
        };
      } else if (text.toLowerCase().includes('stupid') && selectedOptions.includes('profanity')) {
        result = {
          type: 'profanity',
          status: 'warning' as const,
          message: 'This text contains mild inappropriate language'
        };
      } else if (text.includes('¯\\_(ツ)_/¯') && selectedOptions.includes('ascii')) {
        result = {
          type: 'ascii',
          status: 'clean' as const,
          message: 'ASCII art detected but appears harmless'
        };
      } else {
        result = {
          type: 'general',
          status: 'clean' as const,
          message: 'No issues detected in the provided text'
        };
      }
      
      setAnalysisResults(result);
      setIsAnalyzing(false);
    }, 1500);
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
          {analysisOptions.map((option) => (
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
              {option.icon}
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
          analysisResults.status === 'clean' ? 'bg-green-500/10 text-green-700' :
          analysisResults.status === 'warning' ? 'bg-yellow-500/10 text-yellow-700' :
          'bg-red-500/10 text-red-700'
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
