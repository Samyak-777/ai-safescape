
import React, { useState, useRef } from 'react';
import Button from './Button';
import { Upload, Image, AlertCircle, Check, Ban, Search, Shield, Brain } from 'lucide-react';
import { analyzeImage, imageAnalysisOptions } from '@/services/api';
import { analyzeImageWithVertexAI, VertexAIResponse } from '@/services/vertexAI';
import { toast } from 'sonner';

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>(null);
  const [vertexResults, setVertexResults] = useState<VertexAIResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['manipulation', 'safe-search']);
  const [useVertexAI, setUseVertexAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setVertexResults(null);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload an image file');
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    setVertexResults(null);
    
    try {
      if (useVertexAI) {
        const result = await analyzeImageWithVertexAI(image);
        setVertexResults(result);
        toast.success('Vertex AI analysis completed successfully');
      } else {
        if (selectedOptions.length === 0) {
          toast.error('Please select at least one analysis option');
          return;
        }
        
        const result = await analyzeImage(image, selectedOptions);
        setAnalysisResults(result);
        
        // Show toast notification based on result
        if (result.status === 'clean') {
          toast.success('Image analysis completed successfully');
        } else if (result.status === 'warning') {
          toast.warning('Potential issues detected in image');
        } else {
          toast.error('Issues detected in image');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Error analyzing image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Image':
        return <Image size={18} />;
      case 'AlertCircle':
        return <AlertCircle size={18} />;
      case 'Ban':
        return <Ban size={18} />;
      case 'Check':
        return <Check size={18} />;
      case 'Search':
        return <Search size={18} />;
      case 'Shield':
        return <Shield size={18} />;
      default:
        return <Check size={18} />;
    }
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
              onClick={() => {
                setImage(null);
                setAnalysisResults(null);
                setVertexResults(null);
              }}
            >
              <Ban size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">Analysis Engine</p>
        <div className="flex gap-3 mb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
              !useVertexAI
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
            onClick={() => setUseVertexAI(false)}
          >
            <Shield size={18} />
            Standard Analysis
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
              useVertexAI
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
            onClick={() => setUseVertexAI(true)}
          >
            <Brain size={18} />
            Vertex AI Analysis
          </button>
        </div>
        
        {!useVertexAI && (
          <>
            <p className="text-sm font-medium mb-3">Analysis Options</p>
            <div className="flex flex-wrap gap-2">
              {imageAnalysisOptions.map((option) => (
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
          </>
        )}
      </div>
      
      <Button
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        disabled={!image || (!useVertexAI && selectedOptions.length === 0)}
      >
        <Image size={18} />
        {useVertexAI ? 'Analyze with Vertex AI' : 'Analyze Image'}
      </Button>
      
      {/* Standard Analysis Results */}
      {analysisResults && !useVertexAI && (
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

      {/* Vertex AI Results */}
      {vertexResults && useVertexAI && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Analysis Results */}
          <div className="bg-blue-500/10 text-blue-700 dark:text-blue-400 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-full bg-blue-500/20">
                <Brain size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-3">Vertex AI Analysis Results</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Manipulation Check:</p>
                    <p>{vertexResults.analyzeImage.results.manipulationCheck}</p>
                  </div>
                  <div>
                    <p className="font-medium">Content Safety:</p>
                    <p>{vertexResults.analyzeImage.results.contentSafety}</p>
                  </div>
                  <div>
                    <p className="font-medium">Objects Detected:</p>
                    <p>{vertexResults.analyzeImage.results.objectsDetected.slice(0, 5).join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-medium">Text Extracted:</p>
                    <p>{vertexResults.analyzeImage.results.textExtracted}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-medium">Additional Context:</p>
                  <p>{vertexResults.analyzeImage.results.additionalContext}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Explanation */}
          <div className="bg-purple-500/10 text-purple-700 dark:text-purple-400 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-full bg-purple-500/20">
                <Search size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-3">Analysis Explanation</p>
                <div className="text-sm whitespace-pre-line">
                  {vertexResults.analysisExplanation.detailedBreakdown}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
