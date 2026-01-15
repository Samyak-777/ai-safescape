import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Image, Zap, Clock, Sparkles, Shield, MessageCircle, Brain, Target, Bot, Network, AlertTriangle, Mic, Upload, Send } from 'lucide-react';
import AsyncTextAnalyzer from './AsyncTextAnalyzer';
import TextAnalyzer from './TextAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import AdvancedTextAnalyzer from './AdvancedTextAnalyzer';
import AdvancedSecurityAnalyzer from './AdvancedSecurityAnalyzer';
import PersonalizedAssistant from './PersonalizedAssistant';
import AdvancedAnalysisPanel from './AdvancedAnalysisPanel';
import AnimatedSection from './AnimatedSection';
const AnalysisToolsEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advanced-ai');
  const [advancedThreatText, setAdvancedThreatText] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>, section: 'threat' | 'assistant') => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Audio file uploaded for ${section}:`, file.name);
      // TODO: Process audio file for transcription
    }
  };
  const startRecording = async (section: 'threat' | 'assistant') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      recorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: 'audio/wav'
        });
        console.log(`Audio recorded for ${section}:`, audioBlob);
        // TODO: Process recorded audio for transcription
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };
  const handleThreatAnalysis = () => {
    if (advancedThreatText.trim()) {
      // Process the text for advanced threat detection
      const mockResult = {
        text: advancedThreatText,
        status: 'warning',
        type: 'Advanced Threat Analysis',
        confidence: 0.85
      };
      setAnalysisResults([mockResult]);
      console.log('Advanced threat analysis initiated for:', advancedThreatText);
    }
  };
  const handleAssistantAnalysis = () => {
    if (assistantText.trim()) {
      // Process the text for AI assistant analysis
      const mockResult = {
        text: assistantText,
        status: 'info',
        type: 'AI Assistant Analysis',
        confidence: 0.90
      };
      setAnalysisResults([mockResult]);
      console.log('AI assistant analysis initiated for:', assistantText);
    }
  };
  return <section id="analysis-tools" className="section-container bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <AnimatedSection>
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary mb-6">
            Next-Generation AI Analysis Tools
          </span>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Advanced Content Verification & Threat Detection
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Experience cutting-edge AI analysis with Azure OpenAI technologies, featuring GPT-4o, 
            advanced behavioral pattern detection, coordinated threat analysis, and personalized AI assistance.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7 mb-8">
            <TabsTrigger value="advanced-ai" className="flex items-center gap-2">
              <span className="inline-flex"><Sparkles className="h-4 w-4" /></span>
              <span className="hidden sm:inline">Azure AI</span>
              <span className="sm:hidden">AI</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                <span>GPT-4o</span>
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="advanced-analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">Adv</span>
              <Badge variant="destructive" className="ml-1 text-xs">
                NEW
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Sec</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Assistant</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="async-text" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Async</span>
              <span className="sm:hidden">Async</span>
            </TabsTrigger>
            <TabsTrigger value="sync-text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Sync</span>
              <span className="sm:hidden">Sync</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Image</span>
              <span className="sm:hidden">Img</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advanced-ai" className="mt-6">
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-primary/5">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex"><Sparkles className="h-5 w-5 text-purple-500" /></span>
                  <span>Azure OpenAI Advanced Analysis</span>
                  <Badge variant="outline" className="ml-2">
                    <span>GPT-4o</span>
                  </Badge>
                  <Badge variant="secondary" className="ml-1">
                    <span>Azure</span>
                  </Badge>
                </CardTitle>
                <CardDescription>
                  State-of-the-art content analysis using Azure OpenAI GPT-4o with function calling, 
                  structured outputs, streaming capabilities, and advanced reasoning for 
                  context-aware safety detection and real-time threat assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedTextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced-analysis" className="mt-6">
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-500" />
                  Advanced Threat Detection
                  <Badge variant="destructive" className="ml-2">
                    Pattern Analysis
                  </Badge>
                  <Badge variant="outline" className="ml-1">
                    NEW
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Advanced threat detection with sophisticated pattern analysis. AI-powered detection of harassment patterns, 
                  AI-generated content, contextual harm indicators, and coordinated inauthentic behavior using advanced 
                  machine learning and behavioral analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input Section */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="threat-text" className="block text-sm font-medium mb-2">
                      Enter Text for Analysis
                    </label>
                    <Textarea id="threat-text" placeholder="Paste or type the text content you want to analyze for threats, harassment patterns, or harmful content..." value={advancedThreatText} onChange={e => setAdvancedThreatText(e.target.value)} className="min-h-[100px] resize-none" />
                  </div>
                  
                  {/* Audio Input Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Audio Input Options</label>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" onClick={() => startRecording('threat')} disabled={isRecording} className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        {isRecording ? 'Recording...' : 'Record Audio'}
                      </Button>
                      
                      {isRecording && <Button variant="destructive" size="sm" onClick={stopRecording} className="flex items-center gap-2">
                          Stop Recording
                        </Button>}
                      
                      <div className="relative">
                        <input type="file" accept="audio/*" onChange={e => handleAudioUpload(e, 'threat')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Audio
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleThreatAnalysis} disabled={!advancedThreatText.trim()} className="w-full flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Analyze for Threats
                  </Button>
                </div>
                
                <AdvancedAnalysisPanel text={advancedThreatText} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-pink-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Security
                  <Badge variant="destructive" className="ml-2">
                    Advanced Security Analysis
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Advanced security analysis with threat intelligence integration, 
                  advanced pattern detection, social engineering identification, and comprehensive risk scoring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedSecurityAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="mt-6">
            <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-pink-500" />
                  Assistant
                  <Badge variant="outline" className="ml-2">
                    Personalized AI Assistant
                  </Badge>
                  <Badge variant="secondary" className="ml-1">
                    Empathetic AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Personalized AI Assistant with empathetic AI capabilities. Intelligent assistant providing 
                  personalized support and guidance for users experiencing online harms. Features multimodal 
                  input processing, immediate harm assessment, and culturally sensitive responses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input Section */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="assistant-text" className="block text-sm font-medium mb-2">
                      Describe Your Situation or Ask for Help
                    </label>
                    <Textarea id="assistant-text" placeholder="Share your concerns, describe what happened, or ask for guidance. Our AI assistant will provide personalized support and recommendations..." value={assistantText} onChange={e => setAssistantText(e.target.value)} className="min-h-[100px] resize-none" />
                  </div>
                  
                  {/* Audio Input Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Voice Input Options</label>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" onClick={() => startRecording('assistant')} disabled={isRecording} className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        {isRecording ? 'Recording...' : 'Record Voice'}
                      </Button>
                      
                      {isRecording && <Button variant="destructive" size="sm" onClick={stopRecording} className="flex items-center gap-2">
                          Stop Recording
                        </Button>}
                      
                      <div className="relative">
                        <input type="file" accept="audio/*" onChange={e => handleAudioUpload(e, 'assistant')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Audio
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleAssistantAnalysis} disabled={!assistantText.trim()} className="w-full flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Get AI Assistance
                  </Button>
                </div>
                
                <PersonalizedAssistant analysisResults={analysisResults} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="async-text" className="mt-6">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Async
                  <Badge variant="outline" className="ml-2">
                    Asynchronous Text Analysis
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Asynchronous text analysis with scalable, resilient event-driven architecture, 
                  circuit breakers, and automatic retry mechanisms for high-volume processing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AsyncTextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync-text" className="mt-6">
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Sync
                  <Badge variant="outline" className="ml-2">
                    Synchronous Text Analysis
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Synchronous text analysis with traditional processing for immediate results. 
                  Uses the same resilient APIs but with blocking operations for simpler integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="mt-6">
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-indigo-500" />
                  Image
                  <Badge variant="outline" className="ml-2">
                    Image Analysis
                  </Badge>
                </CardTitle>
                <CardDescription>Image analysis powered by Azure AI. Comprehensive analysis for manipulation detection, content safety verification, and intelligent text extraction with multi-language support.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AnimatedSection className="mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="text-center border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-primary/10">
            <CardHeader>
              <Sparkles className="h-10 w-10 mx-auto text-purple-500 mb-3" />
              <CardTitle className="text-lg">Azure AI Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced AI model with contextual understanding and real-time analysis
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <CardHeader>
              <Target className="h-10 w-10 mx-auto text-orange-500 mb-3" />
              <CardTitle className="text-lg">Pattern Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced harassment and coordinated behavior pattern recognition
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
            <CardHeader>
              <Bot className="h-10 w-10 mx-auto text-cyan-500 mb-3" />
              <CardTitle className="text-lg">AI Content Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sophisticated detection of AI-generated content and deepfakes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
            <CardHeader>
              <MessageCircle className="h-10 w-10 mx-auto text-pink-500 mb-3" />
              <CardTitle className="text-lg">Empathetic AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personalized support with cultural sensitivity and immediate guidance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-500/20 bg-gradient-to-br from-red-500/10 to-pink-500/10">
            <CardHeader>
              <AlertTriangle className="h-10 w-10 mx-auto text-red-500 mb-3" />
              <CardTitle className="text-lg">Contextual Harm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Deep analysis for subtle harm indicators and intervention triggers
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <CardHeader>
              <Network className="h-10 w-10 mx-auto text-indigo-500 mb-3" />
              <CardTitle className="text-lg">Network Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coordinated behavior detection and bot network identification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardHeader>
              <Zap className="h-10 w-10 mx-auto text-blue-500 mb-3" />
              <CardTitle className="text-lg">Real-time Streaming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live analysis results with immediate feedback and intervention
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <CardHeader>
              <div className="h-10 w-10 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white text-sm font-bold">CB</span>
              </div>
              <CardTitle className="text-lg">Circuit Breakers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fault tolerance with automatic failure detection and recovery
              </p>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-8 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Next-Gen AI Analysis?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our advanced AI-powered platform combines cutting-edge detection capabilities with empathetic user support 
              for comprehensive digital safety and content verification.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="px-3 py-1">Azure AI Powered<Sparkles className="h-3 w-3 mr-1" />
                Gemini AI Powered
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Brain className="h-3 w-3 mr-1" />
                Advanced Pattern Detection
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <MessageCircle className="h-3 w-3 mr-1" />
                Empathetic AI Support
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Comprehensive Security
              </Badge>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>;
};
export default AnalysisToolsEnhanced;