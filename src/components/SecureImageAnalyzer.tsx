
import React, { useState, useRef } from 'react';
import Button from './Button';
import { Upload, Image, AlertCircle, Check, Ban, Search, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageAnalysisResult {
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
}

const imageAnalysisOptions = [
  { 
    id: 'manipulation', 
    label: 'Manipulation Check', 
    icon: 'Search',
    description: 'Detect edited images and deepfakes'
  },
  { 
    id: 'safe-search', 
    label: 'Content Safety', 
    icon: 'Shield',
    description: 'Check for inappropriate visual content'
  },
  { 
    id: 'text-extract', 
    label: 'Text Extraction', 
    icon: 'Image',
    description: 'Extract and analyze text from images'
  },
];

const SecureImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['manipulation', 'safe-search']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(option => option !== id) 
        : [...prev, id]
    );
  };

  const validateImageFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image file is too large (maximum 10MB)');
      return false;
    }
    
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setAnalysisResult(null);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one analysis option');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('secure-image-analysis', {
        body: {
          imageData: image,
          options: selectedOptions
        }
      });
      
      if (error) {
        console.error('Image analysis error:', error);
        toast.error('Image analysis service temporarily unavailable');
        return;
      }
      
      if (data) {
        setAnalysisResult(data);
        
        // Show appropriate toast based on result
        if (data.status === 'clean') {
          toast.success('Image analysis completed - no issues detected');
        } else if (data.status === 'warning') {
          toast.warning('Image analysis completed - potential issues detected');
        } else {
          toast.error('Image analysis completed - issues detected');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during image analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
      <h3 className="text-xl font-medium mb-6">Secure Image Analysis</h3>
      
      <div className="mb-6">
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
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
            <p className="text-sm text-muted-foreground">JPEG, PNG, GIF, WebP up to 10MB</p>
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
                setAnalysisResult(null);
              }}
              title="Remove image"
            >
              <Ban size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-6">
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
      </div>
      
      <Button
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        disabled={!image || selectedOptions.length === 0}
      >
        <Image size={18} />
        Analyze Image
      </Button>
      
      {/* Analysis Result */}
      {analysisResult && (
        <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
          analysisResult.status === 'clean' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
          analysisResult.status === 'warning' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
          'bg-red-500/10 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 p-1.5 rounded-full ${
              analysisResult.status === 'clean' ? 'bg-green-500/20' :
              analysisResult.status === 'warning' ? 'bg-yellow-500/20' :
              'bg-red-500/20'
            }`}>
              {analysisResult.status === 'clean' ? <Check size={16} /> :
               analysisResult.status === 'warning' ? <AlertCircle size={16} /> :
               <Ban size={16} />}
            </div>
            <div>
              <p className="font-medium">{
                analysisResult.status === 'clean' ? 'Analysis Complete' :
                analysisResult.status === 'warning' ? 'Potential Issues Detected' :
                'Issues Detected'
              }</p>
              <p className="text-sm mt-1">{analysisResult.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureImageAnalyzer;
