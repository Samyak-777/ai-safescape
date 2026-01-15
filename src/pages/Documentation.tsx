import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import Button from '@/components/Button';
import {
  Code,
  FileText,
  Search,
  Check,
  Copy,
  ArrowRight,
  Globe,
  Shield,
  Database,
  Image,
  Brain,
  Users,
  AlertTriangle,
  Target,
  Bot,
  Network,
  MessageCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import TechnologyLogos from '@/components/TechnologyLogos';

const Documentation: React.FC = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeAPIEndpoint, setActiveAPIEndpoint] = useState<string>('text');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Documentation
              </span>
              <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive guide to integrating our advanced AI-powered content analysis API into your applications.
              </p>
            </div>
          </AnimatedSection>
        </section>
        
        <section className="section-container pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <AnimatedSection className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-5 sticky top-24">
                <h3 className="text-lg font-medium mb-4">Documentation</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'overview' 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'api' 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveTab('api')}
                    >
                      API Reference
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'advanced-features' 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveTab('advanced-features')}
                    >
                      Advanced Features
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'user-guide' 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveTab('user-guide')}
                    >
                      User Guide
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'technologies' 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveTab('technologies')}
                    >
                      Technologies
                    </button>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Resources</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://azure.microsoft.com/en-us/products/ai-services/openai-service" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Azure OpenAI
                      </a>
                    </li>
                    <li>
                      <a href="https://azure.microsoft.com/en-us/products/ai-services/ai-language" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Azure AI Language
                      </a>
                    </li>
                    <li>
                      <a href="https://azure.microsoft.com/en-us/products/ai-services/ai-vision" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Azure AI Vision
                      </a>
                    </li>
                    <li>
                      <a href="https://azure.microsoft.com/en-us/products/ai-services/ai-content-safety" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Azure AI Content Safety
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="lg:col-span-3" delay={0.2}>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                      <p className="text-muted-foreground mb-6">
                        Our platform provides next-generation AI-powered content analysis capabilities including advanced threat detection, 
                        behavioral pattern analysis, and personalized AI assistance for comprehensive digital safety.
                      </p>
                      
                      <div className="bg-muted/50 p-5 rounded-xl mb-6">
                        <h3 className="text-lg font-medium mb-3">Quick Start</h3>
                        <ol className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                            <span>Sign up for an API key through the <a href="#" className="text-primary hover:underline">developer portal</a></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                            <span>Include your API key in the request header</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                            <span>Choose from basic analysis or advanced AI detection features</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                            <span>Make requests to our endpoints as documented in the API Reference</span>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-lg font-medium mb-3">API Base URL</h3>
                        <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                          <code className="text-sm">https://api.contentverifier.com/v1/</code>
                          <button onClick={() => copyCode("https://api.contentverifier.com/v1/")} className="text-gray-400 hover:text-white">
                            <Copy size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          All API requests must use HTTPS and include your API key in the headers.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Core Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-muted/50 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <FileText size={20} className="text-primary" />
                            </div>
                            <h3 className="font-semibold">Basic Text Analysis</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Fundamental content analysis for profanity, fact-checking, scam detection, and ethical compliance.
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Profanity detection across 100+ languages</li>
                            <li>• Real-time fact verification</li>
                            <li>• Scam and phishing identification</li>
                            <li>• Ethical content assessment</li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/50 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Image size={20} className="text-primary" />
                            </div>
                            <h3 className="font-semibold">Advanced Image Analysis</h3>
                          </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Powered by Azure AI Vision for comprehensive image verification and content safety.
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Manipulation and deepfake detection</li>
                            <li>• Content safety scanning</li>
                            <li>• Multi-language text extraction</li>
                            <li>• AI-generated content identification</li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/50 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Brain size={20} className="text-primary" />
                            </div>
                            <h3 className="font-semibold">Advanced AI Detection</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Next-generation threat detection using sophisticated AI models and behavioral analysis.
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Pattern-based harassment detection</li>
                            <li>• AI-generated content source detection</li>
                            <li>• Contextual harm analysis</li>
                            <li>• Coordinated behavior identification</li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/50 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <MessageCircle size={20} className="text-primary" />
                            </div>
                            <h3 className="font-semibold">AI Assistant</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Personalized AI support for users experiencing online harms with immediate guidance.
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Multimodal input processing</li>
                            <li>• Immediate harm assessment</li>
                            <li>• Safety guidance and resources</li>
                            <li>• Evidence collection support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'advanced-features' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Advanced AI Detection Features</h2>
                      <p className="text-muted-foreground mb-6">
                        Our platform includes cutting-edge AI detection capabilities powered by Azure OpenAI for sophisticated threat analysis.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-500/20 p-3 rounded-full">
                              <Target size={24} className="text-orange-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">Pattern-based Harassment Detection</h3>
                              <span className="text-sm text-orange-600 font-medium">Endpoint: /analyze/harassment-patterns</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Advanced detection of coordinated harassment campaigns, repeated targeting, and escalating cyberbullying patterns 
                            across multiple interactions using temporal analysis and user behavior modeling.
                          </p>
                          <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                            <code className="text-sm whitespace-pre">{`{
  "interactions": [
    {"user_id": "user123", "content": "...", "timestamp": "..."},
    {"user_id": "user456", "content": "...", "timestamp": "..."}
  ],
  "target_user": "victim_user_id",
  "analysis_window": "24h"
}`}</code>
                            <button onClick={() => copyCode(`{
  "interactions": [...],
  "target_user": "victim_user_id", 
  "analysis_window": "24h"
}`)} className="text-gray-400 hover:text-white">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-cyan-500/20 p-3 rounded-full">
                              <Bot size={24} className="text-cyan-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">AI-Generated Content Detection</h3>
                              <span className="text-sm text-cyan-600 font-medium">Endpoint: /analyze/ai-generated</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Sophisticated detection of AI-generated text, images, and multimedia content using model fingerprinting, 
                            SynthID watermark detection, and stylistic analysis.
                          </p>
                          <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                            <code className="text-sm whitespace-pre">{`{
  "content": "Text or base64 image data",
  "content_type": "text|image|audio",
  "detection_methods": ["fingerprinting", "synthid", "stylistic"]
}`}</code>
                            <button onClick={() => copyCode(`{
  "content": "Text or base64 image data",
  "content_type": "text|image|audio",
  "detection_methods": ["fingerprinting", "synthid", "stylistic"]
}`)} className="text-gray-400 hover:text-white">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-6 rounded-xl border border-red-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-500/20 p-3 rounded-full">
                              <AlertTriangle size={24} className="text-red-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">Contextual Harm Detection</h3>
                              <span className="text-sm text-red-600 font-medium">Endpoint: /analyze/contextual-harm</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Deep semantic analysis for detecting subtle forms of harm including self-harm indicators, grooming attempts, 
                            and radicalization content using conversation context and behavioral patterns.
                          </p>
                          <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                            <code className="text-sm whitespace-pre">{`{
  "conversation_thread": [...],
  "user_profile": {"age_group": "minor", "risk_factors": [...]},
  "harm_types": ["self_harm", "grooming", "radicalization"]
}`}</code>
                            <button onClick={() => copyCode(`{
  "conversation_thread": [...],
  "user_profile": {...},
  "harm_types": ["self_harm", "grooming", "radicalization"]
}`)} className="text-gray-400 hover:text-white">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border border-indigo-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-500/20 p-3 rounded-full">
                              <Network size={24} className="text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">Coordinated Behavior Detection</h3>
                              <span className="text-sm text-indigo-600 font-medium">Endpoint: /analyze/coordinated-behavior</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Advanced network analysis to identify bot farms, sockpuppet networks, and coordinated inauthentic behavior 
                            campaigns using graph neural networks and temporal pattern analysis.
                          </p>
                          <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                            <code className="text-sm whitespace-pre">{`{
  "user_network": [{"user_id": "...", "connections": [...]}],
  "content_propagation": [{"content_hash": "...", "amplifiers": [...]}],
  "time_window": "7d"
}`}</code>
                            <button onClick={() => copyCode(`{
  "user_network": [...],
  "content_propagation": [...],
  "time_window": "7d"
}`)} className="text-gray-400 hover:text-white">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'api' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">API Reference</h2>
                      <p className="text-muted-foreground mb-6">
                        Detailed information about our API endpoints, request parameters, and response formats.
                      </p>
                      
                      <div className="bg-muted/50 p-5 rounded-xl mb-6">
                        <div className="flex space-x-2 mb-6">
                          <button
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                              activeAPIEndpoint === 'text' 
                                ? 'bg-primary/15 text-primary' 
                                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                            onClick={() => setActiveAPIEndpoint('text')}
                          >
                            Text Analysis
                          </button>
                          <button
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                              activeAPIEndpoint === 'image' 
                                ? 'bg-primary/15 text-primary' 
                                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                            onClick={() => setActiveAPIEndpoint('image')}
                          >
                            Image Analysis
                          </button>
                          <button
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                              activeAPIEndpoint === 'assistant' 
                                ? 'bg-primary/15 text-primary' 
                                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                            onClick={() => setActiveAPIEndpoint('assistant')}
                          >
                            AI Assistant
                          </button>
                        </div>
                        
                        {activeAPIEndpoint === 'text' && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Text Analysis Endpoint</h3>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm">POST /analyze/text</code>
                              <button onClick={() => copyCode("POST /analyze/text")} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Request Parameters</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm whitespace-pre">{`{
  "text": "Text to analyze",
  "options": ["profanity", "fact-check", "scam", "ethics", "ascii"],
  "language": "en", // Optional, auto-detected if not specified
  "advanced": {
    "harassment_detection": true,
    "ai_content_detection": true,
    "contextual_harm": true
  }
}`}</code>
                              <button onClick={() => copyCode(`{
  "text": "Text to analyze",
  "options": ["profanity", "fact-check", "scam", "ethics", "ascii"],
  "language": "en",
  "advanced": {
    "harassment_detection": true,
    "ai_content_detection": true,
    "contextual_harm": true
  }
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Response Format</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center">
                              <code className="text-sm whitespace-pre">{`{
  "status": "success",
  "results": [
    {
      "type": "profanity",
      "status": "clean", // or "warning", "danger"
      "confidence": 0.98,
      "message": "No inappropriate language detected",
      "details": {}
    }
  ],
  "advanced_results": {
    "harassment_patterns": {...},
    "ai_generated_likelihood": 0.15,
    "contextual_harm_indicators": [...]
  }
}`}</code>
                              <button onClick={() => copyCode(`{
  "status": "success",
  "results": [...],
  "advanced_results": {...}
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {activeAPIEndpoint === 'image' && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Image Analysis Endpoint</h3>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm">POST /analyze/image</code>
                              <button onClick={() => copyCode("POST /analyze/image")} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Request Parameters</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm whitespace-pre">{`{
  "image": "base64_encoded_image_data", // or
  "image_url": "https://example.com/image.jpg",
  "options": ["manipulation", "safe-search", "text-extract"],
  "extract_text_language": "en", // Optional for OCR
  "azure_analysis": true // Use Azure AI for enhanced analysis
}`}</code>
                              <button onClick={() => copyCode(`{
  "image": "base64_encoded_image_data",
  "image_url": "https://example.com/image.jpg",
  "options": ["manipulation", "safe-search", "text-extract"],
  "extract_text_language": "en",
  "azure_analysis": true
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Response Format</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center">
                              <code className="text-sm whitespace-pre">{`{
  "status": "success",
  "type": "manipulation detection",
  "status": "warning", // or "clean", "danger"
  "confidence": 0.85,
  "message": "Potential image manipulation detected",
  "details": {
    "manipulation": {
      "isManipulated": true,
      "manipulationType": "deepfake",
      "confidence": 0.85
    },
    "contentSafety": {...},
    "textExtraction": {...}
  }
}`}</code>
                              <button onClick={() => copyCode(`{
  "status": "success",
  "type": "manipulation detection",
  "status": "warning",
  "confidence": 0.85,
  "message": "Potential image manipulation detected",
  "details": {...}
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {activeAPIEndpoint === 'assistant' && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">AI Assistant Endpoint</h3>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm">POST /assistant/analyze</code>
                              <button onClick={() => copyCode("POST /assistant/analyze")} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Request Parameters</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center mb-3">
                              <code className="text-sm whitespace-pre">{`{
  "input": {
    "text": "User's description of the situation",
    "images": ["base64_image_1", "base64_image_2"],
    "context": "harassment|misinformation|safety_concern"
  },
  "user_profile": {
    "age_group": "adult|minor",
    "vulnerability_indicators": [...],
    "location": "country_code"
  },
  "urgency": "low|medium|high|critical"
}`}</code>
                              <button onClick={() => copyCode(`{
  "input": {
    "text": "User's description",
    "images": [...],
    "context": "harassment"
  },
  "user_profile": {...},
  "urgency": "medium"
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                            
                            <h4 className="font-medium mt-5 mb-2">Response Format</h4>
                            <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center">
                              <code className="text-sm whitespace-pre">{`{
  "status": "success",
  "assessment": {
    "threat_level": "medium",
    "harm_categories": ["cyberbullying", "privacy_violation"],
    "confidence": 0.89
  },
  "guidance": {
    "immediate_actions": [...],
    "safety_recommendations": [...],
    "documentation_advice": [...],
    "resource_links": [...]
  },
  "follow_up": {
    "recommended_check_in": "24h",
    "escalation_triggers": [...]
  }
}`}</code>
                              <button onClick={() => copyCode(`{
  "status": "success",
  "assessment": {...},
  "guidance": {...},
  "follow_up": {...}
}`)} className="text-gray-400 hover:text-white">
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-lg font-medium mb-3">Authentication</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          All API requests require authentication using an API key. Include your API key in the request header:
                        </p>
                        <div className="bg-black rounded-lg p-3 text-white flex justify-between items-center">
                          <code className="text-sm">X-API-Key: your_api_key_here</code>
                          <button onClick={() => copyCode("X-API-Key: your_api_key_here")} className="text-gray-400 hover:text-white">
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'user-guide' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">User Guide</h2>
                      <p className="text-muted-foreground mb-6">
                        Learn how to effectively use our advanced content analysis tools and interpret the results.
                      </p>
                      
                      <div className="bg-muted/50 p-5 rounded-xl mb-6">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <FileText size={18} className="text-primary" />
                          </div>
                          Text Analysis
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Our text analysis tools can identify various types of problematic content:
                        </p>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-4">
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Profanity Check:</strong> Identifies inappropriate language, obscenities, and profanity in multiple languages</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Fact Check:</strong> Verifies claims against trusted sources to detect potential misinformation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Scam Detection:</strong> Identifies phishing attempts, suspicious URLs, and common scam patterns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Ethical Analysis:</strong> Detects hate speech, discrimination, and other harmful content</span>
                          </li>
                        </ul>
                        <p className="text-sm text-muted-foreground">
                          For best results, include as much context as possible in your text submissions.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl mb-6">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Image size={18} className="text-primary" />
                          </div>
                          Image Analysis
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Our image analysis tools help verify the authenticity and safety of images:
                        </p>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-4">
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Manipulation Check:</strong> Detects edited images, deepfakes, and other alterations using Azure AI Vision analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>SafeSearch:</strong> Identifies inappropriate or harmful content in images</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Text Extraction:</strong> Uses OCR to extract and analyze text within images</span>
                          </li>
                        </ul>
                        <p className="text-sm text-muted-foreground">
                          For optimal image analysis, upload high-resolution images without previous compressions or filters.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Sparkles size={18} className="text-primary" />
                          </div>
                          Advanced Features
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Our advanced AI detection capabilities provide comprehensive threat analysis:
                        </p>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-4">
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Pattern-based Harassment:</strong> Identifies coordinated attacks and escalating patterns across interactions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>AI Content Detection:</strong> Identifies AI-generated content using model fingerprinting and SynthID</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Contextual Harm:</strong> Detects subtle indicators of self-harm, grooming, and radicalization</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                            <span><strong>Coordinated Behavior:</strong> Identifies bot networks and inauthentic amplification campaigns</span>
                          </li>
                        </ul>
                        <p className="text-sm text-muted-foreground">
                          These features require additional context and may have longer processing times for comprehensive analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'technologies' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Our Technology Stack</h2>
                      <p className="text-muted-foreground mb-6">
                        We use a combination of Microsoft Azure technologies, Azure OpenAI, and specialized partner services to provide comprehensive content analysis.
                      </p>
                      
                      <h3 className="text-xl font-medium mb-4">Microsoft Azure Technologies</h3>
                      <div className="glass-card mb-8">
                        <TechnologyLogos variant="google" />
                      </div>
                      
                      <h3 className="text-xl font-medium mb-4">Partner Technologies</h3>
                      <div className="glass-card">
                        <TechnologyLogos variant="partners" />
                      </div>
                      
                      <div className="mt-8 bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <Sparkles className="text-primary" size={24} />
                          Powered by Azure OpenAI
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Our platform leverages Microsoft's most advanced AI model (GPT-4o) for sophisticated content analysis and threat detection.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Zap size={14} className="text-primary" />
                            Advanced reasoning and contextual understanding
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap size={14} className="text-primary" />
                            Multimodal analysis (text, images, audio)
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap size={14} className="text-primary" />
                            Real-time safety assessment and guidance
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap size={14} className="text-primary" />
                            Cultural sensitivity and language support
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section className="section-container">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Our support team is available to help you integrate and use our advanced AI-powered API effectively.
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/#demo'}
              >
                <Code size={20} />
                Try Our Demo
              </Button>
            </div>
          </AnimatedSection>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
