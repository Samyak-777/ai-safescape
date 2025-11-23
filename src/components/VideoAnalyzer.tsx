import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Upload, Video, AlertCircle, CheckCircle, Loader2, Play, Film } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface VideoAnalysisResult {
  videoMetadata: {
    duration: string;
    format: string;
    source: string;
  };
  audioAnalysis: {
    hasHateSpeech: boolean;
    transcription: string;
    language: string;
    sentimentScore: number;
    concerns: string[];
  };
  visualAnalysis: {
    manipulatedFrames: boolean;
    textDetected: string[];
    sceneDescription: string;
    concerns: string[];
  };
  contextualVerification: {
    isOldContent: boolean;
    originalSource?: string;
    originalDate?: string;
    currentClaims: string;
    verificationResult: string;
  };
  overallAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    recommendations: string[];
  };
}

const VideoAnalyzer: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('Video file size must be less than 50MB');
        return;
      }
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('Video loaded successfully');
    }
  };

  const analyzeVideo = async (source: 'file' | 'url') => {
    if (source === 'file' && !videoFile) {
      toast.error('Please select a video file first');
      return;
    }
    if (source === 'url' && !videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate video analysis (in production, this would call Gemini 3 Pro with video input)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock result - in production, this would come from Gemini 3 Pro video analysis
      const mockResult: VideoAnalysisResult = {
        videoMetadata: {
          duration: '0:45',
          format: source === 'file' ? (videoFile?.type || 'video/mp4') : 'video/mp4',
          source: source === 'file' ? videoFile?.name || 'Uploaded Video' : videoUrl
        },
        audioAnalysis: {
          hasHateSpeech: false,
          transcription: 'Sample transcription of audio content from the video...',
          language: 'Hindi/English',
          sentimentScore: 0.65,
          concerns: []
        },
        visualAnalysis: {
          manipulatedFrames: false,
          textDetected: ['Sample text overlay', 'WhatsApp forward message'],
          sceneDescription: 'Outdoor scene showing a crowd gathering',
          concerns: ['Out-of-context footage warning']
        },
        contextualVerification: {
          isOldContent: true,
          originalSource: 'News channel XYZ, 2021',
          originalDate: 'March 2021',
          currentClaims: 'Video claims to show recent protest in Delhi 2025',
          verificationResult: 'This video is from 2021, not 2025. It shows a different event and is being shared out of context.'
        },
        overallAssessment: {
          riskLevel: 'high',
          summary: 'This video contains out-of-context footage being presented as current events. Original footage is from 2021 and unrelated to current claims.',
          recommendations: [
            'Do not share this video without proper context',
            'Report misinformation to platform moderators',
            'Cross-check claims with official news sources',
            'Look for original source before believing forwarded videos'
          ]
        }
      };

      setResult(mockResult);
      toast.success('Video analysis completed');
    } catch (error) {
      console.error('Video analysis error:', error);
      toast.error('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Video Analysis - Gemini 3 Pro Multimodal
        </CardTitle>
        <CardDescription>
          Analyze videos for manipulated content, out-of-context footage, hate speech in audio, and visual misinformation. 
          Perfect for detecting "WhatsApp University" viral videos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload Video</TabsTrigger>
            <TabsTrigger value="url">Video URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">{videoFile?.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Different Video
                  </Button>
                </div>
              ) : (
                <>
                  <Film className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Video File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports MP4, MOV, AVI (Max 50MB)
                    </p>
                  </div>
                </>
              )}
            </div>
            {videoFile && (
              <Button
                onClick={() => analyzeVideo('file')}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Video...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Analyze Video
                  </>
                )}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Enter video URL (YouTube, Twitter, etc.)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste a link to a video from YouTube, Twitter, or other platforms
              </p>
            </div>
            <Button
              onClick={() => analyzeVideo('url')}
              disabled={isAnalyzing || !videoUrl.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Analyze Video
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {result && (
          <div className="space-y-4 mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <Badge className={getRiskColor(result.overallAssessment.riskLevel)}>
                {result.overallAssessment.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>

            {/* Overall Assessment */}
            <div className={`rounded-lg p-4 border-2 ${
              result.overallAssessment.riskLevel === 'high' || result.overallAssessment.riskLevel === 'critical'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm">{result.overallAssessment.summary}</p>
                </div>
              </div>
            </div>

            {/* Contextual Verification - Most Important for Viral Videos */}
            {result.contextualVerification.isOldContent && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  ⚠️ Out-of-Context Content Detected
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Original Source:</strong> {result.contextualVerification.originalSource}</p>
                  <p><strong>Original Date:</strong> {result.contextualVerification.originalDate}</p>
                  <p><strong>Current Claims:</strong> {result.contextualVerification.currentClaims}</p>
                  <p className="text-orange-700 dark:text-orange-300 font-medium mt-3">
                    {result.contextualVerification.verificationResult}
                  </p>
                </div>
              </div>
            )}

            {/* Audio Analysis */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                🎤 Audio Analysis
                {result.audioAnalysis.hasHateSpeech && <Badge variant="destructive">Hate Speech Detected</Badge>}
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Language:</strong> {result.audioAnalysis.language}</p>
                <p><strong>Transcription:</strong> {result.audioAnalysis.transcription}</p>
                {result.audioAnalysis.concerns.length > 0 && (
                  <div>
                    <strong>Concerns:</strong>
                    <ul className="list-disc list-inside">
                      {result.audioAnalysis.concerns.map((concern, idx) => (
                        <li key={idx}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Analysis */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                👁️ Visual Analysis
                {result.visualAnalysis.manipulatedFrames && <Badge variant="destructive">Manipulation Detected</Badge>}
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Scene:</strong> {result.visualAnalysis.sceneDescription}</p>
                {result.visualAnalysis.textDetected.length > 0 && (
                  <div>
                    <strong>Text in Video:</strong>
                    <ul className="list-disc list-inside">
                      {result.visualAnalysis.textDetected.map((text, idx) => (
                        <li key={idx}>{text}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.visualAnalysis.concerns.length > 0 && (
                  <div>
                    <strong>Visual Concerns:</strong>
                    <ul className="list-disc list-inside">
                      {result.visualAnalysis.concerns.map((concern, idx) => (
                        <li key={idx}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-primary">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {result.overallAssessment.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoAnalyzer;
