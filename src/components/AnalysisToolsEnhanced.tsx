
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Zap, Clock, Sparkles } from 'lucide-react';
import AsyncTextAnalyzer from './AsyncTextAnalyzer';
import TextAnalyzer from './TextAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import AdvancedTextAnalyzer from './AdvancedTextAnalyzer';
import AnimatedSection from './AnimatedSection';

const AnalysisToolsEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advanced-ai');

  return (
    <section className="section-container bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedSection>
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Advanced Analysis Tools
          </span>
          <h2 className="text-3xl font-bold mb-4">Next-Generation AI Content Verification</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience cutting-edge AI analysis with Google I/O 2025 technologies, featuring Gemini 2.5, 
            structured outputs, streaming analysis, and advanced reasoning capabilities.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="advanced-ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Advanced</span>
              <span className="sm:hidden">AI</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                2025
              </Badge>
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
              <span className="sm:hidden">Image</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advanced-ai" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Advanced AI Analysis
                  <Badge variant="outline" className="ml-2">
                    Gemini 2.5
                  </Badge>
                  <Badge variant="secondary" className="ml-1">
                    Google I/O 2025
                  </Badge>
                </CardTitle>
                <CardDescription>
                  State-of-the-art content analysis using Gemini 2.5 with function calling, 
                  structured outputs, streaming capabilities, and advanced reasoning for 
                  context-aware safety detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedTextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="async-text" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Asynchronous Text Analysis
                  <Badge variant="outline" className="ml-2">
                    Production Ready
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Experience scalable, resilient text analysis with event-driven architecture, 
                  circuit breakers, and automatic retry mechanisms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AsyncTextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync-text" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Synchronous Text Analysis
                  <Badge variant="outline" className="ml-2">
                    Legacy Mode
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Traditional synchronous processing for immediate results. 
                  Uses the same resilient APIs but with blocking operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-purple-500" />
                  Image Content Analysis
                </CardTitle>
                <CardDescription>
                  Analyze images for inappropriate content, manipulation detection, and text extraction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AnimatedSection className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <CardTitle className="text-lg">Gemini 2.5</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Latest AI model with function calling and structured outputs
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <CardTitle className="text-lg">Real-time Streaming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live analysis results as they process for immediate feedback
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="h-8 w-8 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-xs font-bold">CB</span>
              </div>
              <CardTitle className="text-lg">Circuit Breakers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fault tolerance with automatic failure detection and recovery
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <CardTitle className="text-lg">Context Awareness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced reasoning with cultural and contextual understanding
              </p>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default AnalysisToolsEnhanced;
