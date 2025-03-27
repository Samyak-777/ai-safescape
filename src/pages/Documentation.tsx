
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { 
  FileText, 
  Code, 
  Book, 
  Server, 
  ChevronDown,
  Copy,
  Check,
  ArrowRight,
  Globe,
  Shield,
  Database
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['getting-started']);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeSnippets = {
    textAnalysis: `// Example API call for text analysis
fetch('https://api.safescape.io/analyze/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: "Text to analyze for potential issues",
    options: {
      profanity: true,
      factCheck: true,
      scamDetection: true,
      ethical: true
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    imageAnalysis: `// Example API call for image analysis
fetch('https://api.safescape.io/analyze/image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData // FormData object containing the image file
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    responseFormat: `// Example response format
{
  "id": "analysis-123456",
  "timestamp": "2023-07-15T14:22:31Z",
  "results": {
    "profanity": {
      "detected": false,
      "confidence": 0.98,
      "details": []
    },
    "factCheck": {
      "verified": true,
      "confidence": 0.87,
      "sources": [
        {
          "url": "https://example.com/source",
          "title": "Source Title",
          "reliability": "high"
        }
      ]
    },
    "scamDetection": {
      "suspicious": false,
      "confidence": 0.95,
      "details": []
    }
  },
  "summary": {
    "status": "safe",
    "recommendedAction": "approve"
  }
}`
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="section-container mb-0 pb-0">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Documentation
              </span>
              <h1 className="text-4xl font-bold mb-4">Technical Documentation</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive guides and API documentation for integrating our content analysis platform.
              </p>
            </div>
          </AnimatedSection>
        </section>
        
        <section className="section-container pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AnimatedSection className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-5 sticky top-24">
                <h3 className="text-lg font-medium mb-4">Documentation</h3>
                <nav className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <Book size={18} />
                    <span>Overview</span>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      activeTab === 'api' 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('api')}
                  >
                    <Code size={18} />
                    <span>API Reference</span>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      activeTab === 'user-guide' 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('user-guide')}
                  >
                    <FileText size={18} />
                    <span>User Guide</span>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      activeTab === 'technologies' 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('technologies')}
                  >
                    <Server size={18} />
                    <span>Technologies</span>
                  </button>
                </nav>
              </div>
            </AnimatedSection>
            
            {/* Content */}
            <AnimatedSection className="lg:col-span-3" delay={0.2}>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
                      <p className="text-muted-foreground mb-4">
                        SafeScape is a comprehensive content analysis platform that leverages AI to detect and prevent profanity, misinformation, and fraud in digital content. Our platform integrates multiple technologies to provide thorough analysis of text, images, and metadata.
                      </p>
                      <p className="text-muted-foreground">
                        This documentation provides details on how to use our platform, integrate with our API, and understand the technologies powering our solutions.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Key Features</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-1 rounded-full">
                            <Check size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Text Analysis</p>
                            <p className="text-sm text-muted-foreground">
                              Detect profanity, misinformation, scams, and ethical concerns in text content.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-1 rounded-full">
                            <Check size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Image Verification</p>
                            <p className="text-sm text-muted-foreground">
                              Analyze images for manipulation, inappropriate content, and extract text for verification.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-1 rounded-full">
                            <Check size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Multi-dimensional Analysis</p>
                            <p className="text-sm text-muted-foreground">
                              Combine multiple AI models for comprehensive content verification.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-1 rounded-full">
                            <Check size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Developer API</p>
                            <p className="text-sm text-muted-foreground">
                              Integrate our analysis capabilities directly into your applications.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Use Cases</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">Content Moderation</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically screen and filter user-generated content for inappropriate material and misinformation.
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">Education</h4>
                          <p className="text-sm text-muted-foreground">
                            Verify educational content for accuracy and identify potential misinformation in learning materials.
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">Fraud Prevention</h4>
                          <p className="text-sm text-muted-foreground">
                            Identify potential scams and fraudulent content before it reaches users.
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">Research Verification</h4>
                          <p className="text-sm text-muted-foreground">
                            Verify sources and content for academic and journalistic research.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        className="flex items-center gap-2 font-medium text-primary hover:underline"
                        onClick={() => setActiveTab('api')}
                      >
                        View API Documentation
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* API Reference Tab */}
                {activeTab === 'api' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">API Reference</h2>
                      <p className="text-muted-foreground mb-4">
                        Our RESTful API allows you to integrate content analysis capabilities directly into your applications. This section provides details on endpoints, parameters, and response formats.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <button 
                          className={`w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl font-medium transition-colors ${
                            openAccordions.includes('getting-started') ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleAccordion('getting-started')}
                        >
                          <span>Getting Started</span>
                          <ChevronDown 
                            className={`transition-transform ${
                              openAccordions.includes('getting-started') ? 'rotate-180' : ''
                            }`} 
                            size={18} 
                          />
                        </button>
                        
                        {openAccordions.includes('getting-started') && (
                          <div className="mt-4 p-4 border-l-2 border-primary/30 space-y-4">
                            <p className="text-muted-foreground">
                              To get started with our API, you'll need to obtain an API key by registering for an account. Once you have your API key, you can make requests to our endpoints.
                            </p>
                            <div>
                              <h4 className="font-medium mb-2">Base URL</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm">
                                https://api.safescape.io/v1
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Authentication</h4>
                              <p className="text-muted-foreground mb-2">
                                All API requests require authentication using your API key in the Authorization header:
                              </p>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm">
                                Authorization: Bearer YOUR_API_KEY
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          className={`w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl font-medium transition-colors ${
                            openAccordions.includes('text-analysis-api') ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleAccordion('text-analysis-api')}
                        >
                          <span>Text Analysis API</span>
                          <ChevronDown 
                            className={`transition-transform ${
                              openAccordions.includes('text-analysis-api') ? 'rotate-180' : ''
                            }`} 
                            size={18} 
                          />
                        </button>
                        
                        {openAccordions.includes('text-analysis-api') && (
                          <div className="mt-4 p-4 border-l-2 border-primary/30 space-y-4">
                            <p className="text-muted-foreground">
                              The Text Analysis API allows you to analyze text content for profanity, misinformation, scams, and ethical concerns.
                            </p>
                            <div>
                              <h4 className="font-medium mb-2">Endpoint</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                                <span>POST /analyze/text</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Example Request</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm relative">
                                <pre className="whitespace-pre-wrap">{codeSnippets.textAnalysis}</pre>
                                <button 
                                  className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                  onClick={() => copyCode(codeSnippets.textAnalysis, 'text-analysis')}
                                  title="Copy code"
                                >
                                  {copiedCode === 'text-analysis' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          className={`w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl font-medium transition-colors ${
                            openAccordions.includes('image-analysis-api') ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleAccordion('image-analysis-api')}
                        >
                          <span>Image Analysis API</span>
                          <ChevronDown 
                            className={`transition-transform ${
                              openAccordions.includes('image-analysis-api') ? 'rotate-180' : ''
                            }`} 
                            size={18} 
                          />
                        </button>
                        
                        {openAccordions.includes('image-analysis-api') && (
                          <div className="mt-4 p-4 border-l-2 border-primary/30 space-y-4">
                            <p className="text-muted-foreground">
                              The Image Analysis API allows you to analyze images for manipulation, inappropriate content, and extract text for verification.
                            </p>
                            <div>
                              <h4 className="font-medium mb-2">Endpoint</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm">
                                POST /analyze/image
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Example Request</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm relative">
                                <pre className="whitespace-pre-wrap">{codeSnippets.imageAnalysis}</pre>
                                <button 
                                  className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                  onClick={() => copyCode(codeSnippets.imageAnalysis, 'image-analysis')}
                                  title="Copy code"
                                >
                                  {copiedCode === 'image-analysis' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          className={`w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl font-medium transition-colors ${
                            openAccordions.includes('response-format') ? 'text-primary' : ''
                          }`}
                          onClick={() => toggleAccordion('response-format')}
                        >
                          <span>Response Format</span>
                          <ChevronDown 
                            className={`transition-transform ${
                              openAccordions.includes('response-format') ? 'rotate-180' : ''
                            }`} 
                            size={18} 
                          />
                        </button>
                        
                        {openAccordions.includes('response-format') && (
                          <div className="mt-4 p-4 border-l-2 border-primary/30 space-y-4">
                            <p className="text-muted-foreground">
                              All API responses are returned in JSON format with a consistent structure.
                            </p>
                            <div>
                              <h4 className="font-medium mb-2">Example Response</h4>
                              <div className="bg-black/80 text-white p-3 rounded-lg font-mono text-sm relative">
                                <pre className="whitespace-pre-wrap">{codeSnippets.responseFormat}</pre>
                                <button 
                                  className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                  onClick={() => copyCode(codeSnippets.responseFormat, 'response-format')}
                                  title="Copy code"
                                >
                                  {copiedCode === 'response-format' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User Guide Tab */}
                {activeTab === 'user-guide' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">User Guide</h2>
                      <p className="text-muted-foreground mb-4">
                        This guide provides step-by-step instructions for using the SafeScape platform and its features.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <FileText size={18} className="text-primary" />
                          </div>
                          Text Analysis
                        </h3>
                        <ol className="space-y-3 ml-8 list-decimal">
                          <li className="text-muted-foreground">
                            Navigate to the Text Analysis tab in the platform
                          </li>
                          <li className="text-muted-foreground">
                            Enter or paste the text you want to analyze in the text field
                          </li>
                          <li className="text-muted-foreground">
                            Select the analysis options you want to apply (profanity, fact-check, scam detection, etc.)
                          </li>
                          <li className="text-muted-foreground">
                            Click the "Analyze Text" button to start the analysis
                          </li>
                          <li className="text-muted-foreground">
                            Review the results and take appropriate action based on the findings
                          </li>
                        </ol>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <ImageIcon size={18} className="text-primary" />
                          </div>
                          Image Analysis
                        </h3>
                        <ol className="space-y-3 ml-8 list-decimal">
                          <li className="text-muted-foreground">
                            Navigate to the Image Analysis tab in the platform
                          </li>
                          <li className="text-muted-foreground">
                            Upload the image you want to analyze by clicking the upload area or dragging and dropping
                          </li>
                          <li className="text-muted-foreground">
                            Select the analysis options you want to apply (manipulation check, content safety, text extraction)
                          </li>
                          <li className="text-muted-foreground">
                            Click the "Analyze Image" button to start the analysis
                          </li>
                          <li className="text-muted-foreground">
                            Review the results and take appropriate action based on the findings
                          </li>
                        </ol>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Code size={18} className="text-primary" />
                          </div>
                          API Integration
                        </h3>
                        <ol className="space-y-3 ml-8 list-decimal">
                          <li className="text-muted-foreground">
                            Register for an account and obtain your API key
                          </li>
                          <li className="text-muted-foreground">
                            Choose the appropriate endpoint for your needs (text or image analysis)
                          </li>
                          <li className="text-muted-foreground">
                            Implement the API calls in your application using the provided code examples
                          </li>
                          <li className="text-muted-foreground">
                            Process the response data according to your application's requirements
                          </li>
                          <li className="text-muted-foreground">
                            Implement appropriate error handling and fallback mechanisms
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Technologies Tab */}
                {activeTab === 'technologies' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                      <p className="text-muted-foreground mb-4">
                        SafeScape integrates multiple technologies to provide comprehensive content analysis. This section details the key technologies and how they work together.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Globe size={18} className="text-primary" />
                          </div>
                          Google Cloud Technologies
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Google Cloud Natural Language API</h4>
                            <p className="text-sm text-muted-foreground">
                              Used for sentiment analysis, content classification, and entity recognition in text content. This technology helps identify the context and sentiment of text.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Cloud Vision API</h4>
                            <p className="text-sm text-muted-foreground">
                              Enables image analysis for inappropriate content detection, text extraction from images, and facial recognition for deepfake detection.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Gemini Pro Vision</h4>
                            <p className="text-sm text-muted-foreground">
                              Provides advanced AI capabilities for integrated analysis of text and visual content, enabling more comprehensive content verification.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Fact Check API</h4>
                            <p className="text-sm text-muted-foreground">
                              Verifies claims against a database of fact-checked content from reputable sources, helping identify misinformation.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Shield size={18} className="text-primary" />
                          </div>
                          External Services
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">IPQualityScore & Bolster AI</h4>
                            <p className="text-sm text-muted-foreground">
                              Integrated for fraud detection, bot identification, and URL safety analysis to protect users from online scams and phishing attempts.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Google Images & TinEye</h4>
                            <p className="text-sm text-muted-foreground">
                              Provide reverse image search capabilities to identify the original source of images and detect manipulated or miscontextualized images.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">API League & Asciified</h4>
                            <p className="text-sm text-muted-foreground">
                              Used for ASCII art detection and processing, helping identify potentially problematic ASCII content.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-5 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Database size={18} className="text-primary" />
                          </div>
                          Development Infrastructure
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">Vertex AI</h4>
                            <p className="text-sm text-muted-foreground">
                              Provides a unified platform for machine learning model training, deployment, and management, enabling scalable AI solutions.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">OpenCV & OCR</h4>
                            <p className="text-sm text-muted-foreground">
                              Used for image processing and text recognition in images, enabling extraction and analysis of text from visual content.
                            </p>
                          </div>
                          <div className="bg-white/30 dark:bg-black/20 p-4 rounded-xl">
                            <h4 className="font-medium mb-1">IDX</h4>
                            <p className="text-sm text-muted-foreground">
                              Facilitates seamless cloud development integration, providing a streamlined development environment for our solutions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
