
import React, { useState, useRef } from 'react';
import Button from './Button';
import { Upload, Image as ImageIcon, AlertCircle, Check, Ban, Search } from 'lucide-react';

interface AnalysisOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['manipulation', 'safe-search']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisOptions: AnalysisOption[] = [
    { 
      id: 'manipulation', 
      label: 'Manipulation Check', 
      icon: <Search size={18} />,
      description: 'Detect edited images and deepfakes'
    },
    { 
      id: 'safe-search', 
      label: 'Content Safety', 
      icon: <Shield size={18} />,
      description: 'Check for inappropriate visual content'
    },
    { 
      id: 'text-extract', 
      label: 'Text Extraction', 
      icon: <ImageIcon size={18} />,
      description: 'Extract and analyze text from images'
    },
  ];

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setAnalysisResults(null);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file');
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate analysis - in a real app this would call Vision API etc.
    setTimeout(() => {
      // Demo result based on random selection
      const results = [
        {
          type: 'manipulation',
          status: 'warning' as const,
          message: 'This image shows potential signs of manipulation around the edges'
        },
        {
          type: 'safe-search',
          status: 'clean' as const,
          message: 'No inappropriate content detected in this image'
        },
        {
          type: 'text-extract',
          status: 'clean' as const,
          message: 'Text extracted and verified with no concerning content'
        },
        {
          type: 'general',
          status: 'clean' as const,
          message: 'Image analysis complete - no issues detected'
        }
      ];
      
      // Randomly select a result for demo purposes
      const randomIndex = Math.floor(Math.random() * results.length);
      setAnalysisResults(results[randomIndex]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-medium mb-6">Image Analysis</h3>
      
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
        
        {!image ? (
          <div 
            className="w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={triggerFileInput}
          >
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Upload size={20} />
            </div>
            <p className="text-muted-foreground mb-1">Click to upload an image</p>
            <p className="text-sm text-muted-foreground">JPG, PNG, GIF up to 5MB</p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={image} 
              alt="Uploaded image" 
              className="w-full h-64 object-contain rounded-xl bg-white/30 dark:bg-black/20"
            />
            <button 
              className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-1.5 rounded-lg hover:bg-white dark:hover:bg-black text-foreground transition-colors"
              onClick={() => setImage(null)}
            >
              <Ban size={16} />
            </button>
          </div>
        )}
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
      
      <Button
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        disabled={!image || selectedOptions.length === 0}
      >
        <ImageIcon size={18} />
        Analyze Image
      </Button>
      
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

export default ImageAnalyzer;

const Shield: React.FC<{ size: number }> = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
