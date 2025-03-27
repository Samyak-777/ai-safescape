
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import Button from '@/components/Button';
import { 
  FileText, 
  Image as ImageIcon, 
  Search, 
  Shield, 
  Ban, 
  AlertCircle, 
  Code, 
  Check, 
  Database,
  Globe,
  Zap,
  RefreshCw,
  BarChart,
  Lock
} from 'lucide-react';

const Features: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbar = document.querySelector('header');
      const navbarHeight = navbar?.clientHeight || 0;
      const yOffset = -navbarHeight - 20;
      
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Features
              </span>
              <h1 className="text-4xl font-bold mb-4">Comprehensive Content Analysis</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform integrates multiple AI technologies to provide thorough analysis and verification of text, images, and metadata.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="glass-card rounded-2xl p-8 mb-12">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-medium">Jump to feature</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('text-analysis')}
                >
                  <FileText size={16} />
                  Text Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('image-analysis')}
                >
                  <ImageIcon size={16} />
                  Image Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('tech-stack')}
                >
                  <Code size={16} />
                  Technology Stack
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>
        
        <section id="text-analysis" className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Text Analysis
              </span>
              <h2 className="text-3xl font-bold mb-4">Multi-dimensional Text Verification</h2>
              <p className="text-muted-foreground max-w-2xl">
                Our platform analyzes text content across multiple dimensions to provide comprehensive verification and safety checks.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.1}>
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Ban size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Profanity Check</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Detect inappropriate language, obscenities, and profanity in text content. Our system recognizes explicit language across multiple languages and contexts.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-2">Powered by:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Google Cloud Natural Language API
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Custom profanity detection models
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.2}>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Fact Checking</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Verify claims against trusted sources and identify potential misinformation. Our fact-checking system evaluates text against a database of verified facts.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-2">Powered by:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Google Fact Check API
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Gemini Pro for contextual analysis
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.3}>
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Scam/Phishing Detection</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Identify suspicious URLs, phishing attempts, and common scam patterns in text content. The system flags potentially harmful links and deceptive messaging.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-2">Powered by:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    IPQualityScore for fraud detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Arya.ai for phishing pattern recognition
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.4}>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Ethical Analysis</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Evaluate text for harmful content, hate speech, discrimination, and other ethical concerns. Our system identifies potentially harmful messaging.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-2">Powered by:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Google Cloud NLP sentiment analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    Custom ethical content assessment models
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section id="image-analysis" className="section-container">
          <AnimatedSection>
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Image Analysis
              </span>
              <h2 className="text-3xl font-bold mb-4">Comprehensive Image Verification</h2>
              <p className="text-muted-foreground max-w-2xl">
                Our platform analyzes images for manipulation, inappropriate content, and extracts text for further verification.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-xl font-medium mb-3">Image Manipulation Check</h3>
                <p className="text-muted-foreground mb-6">
                  Detect signs of image manipulation, including deepfakes, photoshopping, and other alterations. Our system analyzes metadata, pixel patterns, and image inconsistencies.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Database size={18} />
                      Metadata Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Examines EXIF data for inconsistencies and signs of modification
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Search size={18} />
                      Reverse Image Search
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Compares against databases to find original unmodified images
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle size={18} />
                      AI-Generated Detection
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies artifacts and patterns common in AI-generated imagery
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-medium mb-3">SafeSearch & Content Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Scan images for inappropriate or harmful content, including adult content, violence, and other concerning imagery. Extract and analyze text within images.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Ban size={18} />
                      Inappropriate Content Detection
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies adult, violent, or otherwise harmful visual content
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText size={18} />
                      OCR Text Extraction
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Extracts text from images for further analysis and verification
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Globe size={18} />
                      Multi-language Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Processes text in multiple languages with translation capabilities
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section id="tech-stack" className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Technology Stack
              </span>
              <h2 className="text-3xl font-bold mb-4">Powered by Google Cloud</h2>
              <p className="text-muted-foreground max-w-2xl">
                Our platform leverages Google Cloud technologies and external services for robust and accurate content analysis.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.1}>
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Core Technologies</h3>
              <div className="text-muted-foreground space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Google Cloud NLP</p>
                    <p className="text-sm">For profanity, sentiment, and text classification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Cloud Vision API</p>
                    <p className="text-sm">For SafeSearch and explicit content detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Gemini Pro Vision</p>
                    <p className="text-sm">For advanced text-visual integration analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Fact Check API</p>
                    <p className="text-sm">For verifying claims against trusted sources</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.2}>
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">External Integrations</h3>
              <div className="text-muted-foreground space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">IPQualityScore</p>
                    <p className="text-sm">For fraud detection and bot identification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Google Images & TinEye</p>
                    <p className="text-sm">For reverse image search capabilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Arya.ai & Bolster AI</p>
                    <p className="text-sm">For phishing and URL safety analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">API League & Asciified</p>
                    <p className="text-sm">For ASCII detection and processing</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.3}>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Development Stack</h3>
              <div className="text-muted-foreground space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Vertex AI</p>
                    <p className="text-sm">For scalable model deployment and training</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">OpenCV & OCR</p>
                    <p className="text-sm">For image processing and text recognition</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">IDX</p>
                    <p className="text-sm">For seamless cloud development integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Modern Web Technologies</p>
                    <p className="text-sm">React, Tailwind CSS, and TypeScript</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section className="section-container">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-8 rounded-2xl">
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to start verifying content?</h2>
              <p className="text-muted-foreground mb-8">
                Our platform provides comprehensive analysis for text and images, helping you combat misinformation and ensure content safety.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    setTimeout(() => window.location.href = '/#demo', 500);
                  }}
                >
                  <ImageIcon size={20} />
                  Try Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/documentation'}
                >
                  <BarChart size={20} />
                  View Documentation
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
