
import React, { useState, useRef } from 'react';
import Button from './Button';
import { Upload, Image, AlertCircle, Check, Ban, Search, Shield, Eye, FileText, Zap } from 'lucide-react';
import { analyzeImage, imageAnalysisOptions } from '@/services/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface VertexAIAnalysisResult {
  manipulation_check: string;
  content_safety: string;
  objects_detected: string[];
  confidence_scores: number[];
  additional_context: string;
  text_extracted: string;
  detailed_breakdown: string;
}

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    type: string;
    status: 'clean' | 'warning' | 'danger';
    message: string;
  }>(null);
  const [vertexAIResults, setVertexAIResults] = useState<VertexAIAnalysisResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['manipulation', 'safe-search', 'vertex-ai']);
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
        setVertexAIResults(null);
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

  const simulateVertexAIAnalysis = async (): Promise<VertexAIAnalysisResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock Vertex AI analysis results
    return {
      manipulation_check: "No signs of digital manipulation detected. Image appears authentic with consistent lighting and shadows.",
      content_safety: "Content is safe for general audiences. No inappropriate or harmful content detected.",
      objects_detected: ["person", "computer", "desk", "office environment", "window"],
      confidence_scores: [0.95, 0.89, 0.92, 0.87, 0.78],
      additional_context: "Professional office setting with a person working at a computer workstation. Natural lighting from window creates appropriate shadows and highlights.",
      text_extracted: "No readable text detected in the image",
      detailed_breakdown: "The analysis identified a person with high confidence (95%) as the main subject, positioned at a computer workstation. The office environment is clearly defined with typical workplace elements including a desk, computer equipment, and natural lighting from a window. The lighting patterns and shadow consistency suggest this is an authentic photograph without digital manipulation. Color distribution and pixel analysis indicate normal camera compression without signs of AI generation or significant post-processing. The scene composition follows natural photography principles with appropriate depth of field and perspective."
    };
  };

  const handleAnalyze = async () => {
    if (!image || selectedOptions.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);
    setVertexAIResults(null);
    
    try {
      // Standard analysis
      const result = await analyzeImage(image, selectedOptions);
      setAnalysisResults(result);
      
      // Vertex AI analysis if selected
      if (selectedOptions.includes('vertex-ai')) {
        const vertexResult = await simulateVertexAIAnalysis();
        setVertexAIResults(vertexResult);
      }
      
      // Show toast notification based on result
      if (result.status === 'clean') {
        toast.success('Image analysis completed successfully');
      } else if (result.status === 'warning') {
        toast.warning('Potential issues detected in image');
      } else {
        toast.error('Issues detected in image');
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

  // Enhanced analysis options including Vertex AI
  const enhancedAnalysisOptions = [
    ...imageAnalysisOptions,
    {
      id: 'vertex-ai',
      label: 'Vertex AI Analysis',
      icon: 'Zap',
      description: 'Comprehensive AI-powered analysis with detailed explanations'
    }
  ];

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
      case 'Zap':
        return <Zap size={18} />;
      default:
        return <Check size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-medium mb-6">Image Analysis with Vertex AI</h3>
        
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
                  setVertexAIResults(null);
                }}
              >
                <Ban size={16} />
              </button>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Analysis Options</p>
          <div className="flex flex-wrap gap-2">
            {enhancedAnalysisOptions.map((option) => (
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
                {option.id === 'vertex-ai' && (
                  <Badge variant="secondary" className="ml-1 text-xs">NEW</Badge>
                )}
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
          {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}
        </Button>
      </div>

      {/* Standard Analysis Results */}
      {analysisResults && (
        <Card className={`animate-fade-in ${
          analysisResults.status === 'clean' ? 'border-green-500/20 bg-green-500/5' :
          analysisResults.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
          'border-red-500/20 bg-red-500/5'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${
                analysisResults.status === 'clean' ? 'bg-green-500/20 text-green-600' :
                analysisResults.status === 'warning' ? 'bg-yellow-500/20 text-yellow-600' :
                'bg-red-500/20 text-red-600'
              }`}>
                {analysisResults.status === 'clean' ? <Check size={16} /> :
                 analysisResults.status === 'warning' ? <AlertCircle size={16} /> :
                 <Ban size={16} />}
              </div>
              Standard Analysis Results
              <Badge variant={
                analysisResults.status === 'clean' ? 'secondary' :
                analysisResults.status === 'warning' ? 'destructive' : 'destructive'
              }>
                {analysisResults.status === 'clean' ? 'All Clear' :
                 analysisResults.status === 'warning' ? 'Warning' : 'Issue Detected'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{analysisResults.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Vertex AI Analysis Results */}
      {vertexAIResults && (
        <div className="space-y-6">
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Vertex AI Analysis Results
                <Badge variant="outline">Powered by Google Cloud</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Manipulation Check</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{vertexAIResults.manipulation_check}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Content Safety</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{vertexAIResults.content_safety}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Objects Detected</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {vertexAIResults.objects_detected.map((object, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {object} ({(vertexAIResults.confidence_scores[index] * 100).toFixed(1)}%)
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Additional Context</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{vertexAIResults.additional_context}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Text Extracted</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{vertexAIResults.text_extracted}</p>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Explanation Section */}
          <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Analysis Explanation
                <Badge variant="outline">Detailed Breakdown</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed">{vertexAIResults.detailed_breakdown}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
