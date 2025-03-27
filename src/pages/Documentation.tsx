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
  Image
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
                Comprehensive guide to integrating our content analysis API into your applications.
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
                      <a href="https://cloud.google.com/natural-language" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Google Cloud NLP
                      </a>
                    </li>
                    <li>
                      <a href="https://cloud.google.com/vision" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Vision API
                      </a>
                    </li>
                    <li>
                      <a href="https://developers.google.com/fact-check/tools/api" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Fact Check API
                      </a>
                    </li>
                    <li>
                      <a href="https://ai.google.dev/gemini/docs/model/gemini-pro" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                        <ArrowRight size={12} />
                        Gemini Pro
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
                        Our API provides comprehensive content analysis capabilities to help you protect your platform from harmful content, misinformation, and fraud.
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
                      <h2 className="text-2xl font-bold mb-4">Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <FileText size={18} className="text-primary" />
                            </div>
                            <h3 className="font-medium">Text Analysis</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Analyze text for profanity, misinformation, hate speech, and potential scams.
                          </p>
                        </div>
                        
                        <div className="bg-muted/50 p-5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Image size={18} className="text-primary" />
                            </div>
                            <h3 className="font-medium">Image Analysis</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Detect manipulated images, inappropriate content, and extract text from images.
                          </p>
                        </div>
                        
                        <div className="bg-muted/50 p-5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Globe size={18} className="text-primary" />
                            </div>
                            <h3 className="font-medium">Multilingual Support</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Support for 100+ languages with automatic language detection.
                          </p>
                        </div>
                        
                        <div className="bg-muted/50 p-5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Database size={18} className="text-primary" />
                            </div>
                            <h3 className="font-medium">Comprehensive Reports</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Detailed analysis reports with confidence scores and detected issues.
                          </p>
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
  "language": "en" // Optional, auto-detected if not specified
}`}</code>
                              <button onClick={() => copyCode(`{
  "text": "Text to analyze",
  "options": ["profanity", "fact-check", "scam", "ethics", "ascii"],
  "language": "en" // Optional, auto-detected if not specified
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
    },
    // Additional results for each requested option
  ]
}`}</code>
                              <button onClick={() => copyCode(`{
  "status": "success",
  "results": [
    {
      "type": "profanity",
      "status": "clean", // or "warning", "danger"
      "confidence": 0.98,
      "message": "No inappropriate language detected",
      "details": {}
    },
    // Additional results for each requested option
  ]
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
  "extract_text_language": "en" // Optional for OCR
}`}</code>
                              <button onClick={() => copyCode(`{
  "image": "base64_encoded_image_data", // or
  "image_url": "https://example.com/image.jpg",
  "options": ["manipulation", "safe-search", "text-extract"],
  "extract_text_language": "en" // Optional for OCR
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
      "type": "manipulation",
      "status": "warning", // or "clean", "danger"
      "confidence": 0.85,
      "message": "Potential image manipulation detected",
      "details": {
        "manipulated_regions": ["bottom-right"],
        "manipulation_type": "splicing"
      }
    },
    // Additional results for each requested option
  ]
}`}</code>
                              <button onClick={() => copyCode(`{
  "status": "success",
  "results": [
    {
      "type": "manipulation",
      "status": "warning", // or "clean", "danger"
      "confidence": 0.85,
      "message": "Potential image manipulation detected",
      "details": {
        "manipulated_regions": ["bottom-right"],
        "manipulation_type": "splicing"
      }
    },
    // Additional results for each requested option
  ]
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
                        Learn how to effectively use our content analysis tools and interpret the results.
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
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
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
                            <span><strong>Manipulation Check:</strong> Detects edited images, deepfakes, and other alterations using metadata and pixel analysis</span>
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
                    </div>
                  </div>
                )}
                
                {activeTab === 'technologies' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Our Technology Stack</h2>
                      <p className="text-muted-foreground mb-6">
                        We use a combination of Google Cloud technologies and specialized partner services to provide comprehensive content analysis.
                      </p>
                      
                      <h3 className="text-xl font-medium mb-4">Google Cloud Technologies</h3>
                      <div className="glass-card mb-8">
                        <TechnologyLogos variant="google" />
                      </div>
                      
                      <h3 className="text-xl font-medium mb-4">Partner Technologies</h3>
                      <div className="glass-card">
                        <TechnologyLogos variant="partners" />
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
                Our support team is available to help you integrate and use our API effectively.
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
