
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import Button from '@/components/Button';
import { 
  Code, 
  FileText, 
  Image, 
  Search, 
  Shield, 
  Ban, 
  AlertCircle, 
  Check, 
  Database,
  Globe,
  Zap,
  RefreshCw,
  BarChart,
  Lock,
  Users,
  Brain,
  Network,
  Eye,
  MessageCircle,
  TrendingUp,
  Target,
  Layers,
  Bot,
  UserCheck,
  Activity,
  Phone
} from 'lucide-react';
import TechnologyLogos from '@/components/TechnologyLogos';

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
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary mb-6">
                Advanced AI-Powered Features
              </span>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Comprehensive Content Analysis & Protection
              </h1>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                Our platform integrates cutting-edge AI technologies to provide thorough analysis and verification of text, images, and behavioral patterns across digital platforms.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="glass-card rounded-3xl p-8 mb-16 border border-primary/10">
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Explore Our Features</h2>
                <p className="text-muted-foreground">Jump to any section to learn more</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('text-analysis')}
                  className="hover:bg-primary/10"
                >
                  <FileText size={16} />
                  Text Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('image-analysis')}
                  className="hover:bg-primary/10"
                >
                  <Image size={16} />
                  Image Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('advanced-detection')}
                  className="hover:bg-primary/10"
                >
                  <Brain size={16} />
                  Advanced AI Detection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('ai-assistant')}
                  className="hover:bg-primary/10"
                >
                  <MessageCircle size={16} />
                  AI Assistant
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('tech-stack')}
                  className="hover:bg-primary/10"
                >
                  <Code size={16} />
                  Technology
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>
        
        <section id="text-analysis" className="section-container bg-gradient-to-br from-muted/20 to-primary/5">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-red-500/10 text-red-600 dark:text-red-400 mb-6">
                Core Text Analysis
              </span>
              <h2 className="text-4xl font-bold mb-6">Multi-dimensional Text Verification</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Real-time analysis of text content across multiple threat vectors using advanced AI models.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full border border-red-500/10" delay={0.1}>
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Ban size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Profanity Detection</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Advanced detection of inappropriate language, obscenities, and contextual profanity across multiple languages and cultural contexts.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Powered by:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Azure AI Language Service
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Custom profanity detection models
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full border border-blue-500/10" delay={0.2}>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fact Verification</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Real-time verification of claims against trusted sources with misinformation detection and credibility scoring.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Powered by:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Azure AI Search verification
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    GPT-4o contextual analysis
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full border border-yellow-500/10" delay={0.3}>
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scam & Phishing Detection</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Intelligent identification of suspicious URLs, phishing attempts, and social engineering tactics in real-time.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Powered by:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    IPQualityScore fraud detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Advanced pattern recognition
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full border border-purple-500/10" delay={0.4}>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ethical Content Analysis</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Comprehensive evaluation for harmful content, hate speech, discrimination, and ethical violations.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Powered by:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Azure AI Content Safety
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Ethical assessment models
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-6 flex flex-col h-full border border-green-500/10" delay={0.5}>
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">ASCII Art Detection</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Specialized detection of ASCII art patterns and hidden messages within seemingly innocent text content.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Powered by:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Custom pattern recognition
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Unicode analysis algorithms
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section id="advanced-detection" className="section-container">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 mb-6">
                Advanced AI Detection
              </span>
              <h2 className="text-4xl font-bold mb-6">Next-Generation Threat Detection</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Sophisticated AI-powered detection systems that identify complex patterns, coordinated attacks, and emerging threats.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-orange-500/10" delay={0.1}>
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pattern-based Harassment Detection</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Advanced detection of coordinated harassment campaigns, repeated targeting, and escalating cyberbullying patterns across multiple interactions.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Repeated Targeting Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies patterns of sustained harassment against specific individuals
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Escalation Detection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Monitors increasing severity and frequency of harmful interactions
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-cyan-500/10" delay={0.2}>
              <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Bot size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI-Generated Content Detection</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sophisticated detection of AI-generated text, images, and multimedia content using SynthID principles and model fingerprinting.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain size={18} />
                    Model Fingerprinting
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies specific AI models used for content generation
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Layers size={18} />
                    SynthID Watermark Detection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Detects invisible watermarks in AI-generated content
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-red-500/10" delay={0.3}>
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Contextual Harm Detection</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Deep semantic analysis for detecting subtle forms of harm including self-harm indicators, grooming attempts, and radicalization content.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <UserCheck size={18} />
                    Behavioral Pattern Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes user interaction patterns for concerning behaviors
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle size={18} />
                    Conversation Context Understanding
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluates entire conversation threads for subtle harm indicators
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-indigo-500/10" delay={0.4}>
              <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Network size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Coordinated Behavior Detection</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Advanced network analysis to identify bot farms, sockpuppet networks, and coordinated inauthentic behavior campaigns.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Activity size={18} />
                    Network Topology Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Maps relationships between accounts and identifies suspicious clusters
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <RefreshCw size={18} />
                    Temporal Pattern Recognition
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Detects synchronized posting and coordinated amplification
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section id="image-analysis" className="section-container bg-gradient-to-br from-muted/20 to-blue-500/5">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
                Image Analysis
              </span>
              <h2 className="text-4xl font-bold mb-6">Advanced Image Verification</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Comprehensive image analysis powered by Azure AI Vision for manipulation detection, content safety, and text extraction.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-green-500/10" delay={0.1}>
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Image size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Manipulation Detection</h3>
              <p className="text-muted-foreground mb-6">
                Advanced detection of image editing, deepfakes, and digital manipulation using AI-powered analysis.
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Deepfake Detection</h4>
                  <p className="text-xs text-muted-foreground">AI-generated face and voice analysis</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Photoshop Artifacts</h4>
                  <p className="text-xs text-muted-foreground">Digital editing signature detection</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Metadata Analysis</h4>
                  <p className="text-xs text-muted-foreground">EXIF data inconsistency checking</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-primary/10" delay={0.2}>
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Content Safety</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive scanning for inappropriate, harmful, or unsafe visual content across multiple categories.
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">SafeSearch Filtering</h4>
                  <p className="text-xs text-muted-foreground">Adult and explicit content detection</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Violence Detection</h4>
                  <p className="text-xs text-muted-foreground">Graphic content identification</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Hate Symbol Recognition</h4>
                  <p className="text-xs text-muted-foreground">Extremist imagery detection</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-blue-500/10" delay={0.3}>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Text Extraction</h3>
              <p className="text-muted-foreground mb-6">
                Advanced OCR with multi-language support and intelligent text analysis for harmful content detection.
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Multi-language OCR</h4>
                  <p className="text-xs text-muted-foreground">Text extraction in 100+ languages</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Context Analysis</h4>
                  <p className="text-xs text-muted-foreground">Semantic understanding of extracted text</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">Handwriting Recognition</h4>
                  <p className="text-xs text-muted-foreground">Advanced handwritten text detection</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section className="section-container bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary mb-6">
                New Features
              </span>
              <h2 className="text-4xl font-bold mb-6">Advanced User Experience Features</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Cutting-edge features designed to provide transparency, handle edge cases, and prioritize user safety.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-primary/10" delay={0.1}>
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Database size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Source of Truth Indicator</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Every analysis now displays its source, showing whether the result came from our real-time database verification or deep AI analysis.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Database size={18} className="text-blue-500" />
                    Real-Time Database
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Instant verification against our curated database of known misinformation for maximum speed and accuracy
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain size={18} className="text-purple-500" />
                    Azure OpenAI Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Novel content analyzed using GPT-4o on Azure for deep, contextual understanding
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Eye size={18} className="text-green-500" />
                    Transparent Process
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Visual indicators and tooltips explain the verification method used for each analysis
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-yellow-500/10" delay={0.2}>
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Edge Case Visualizer</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Clear visual indicators when analysis is limited due to paywalls or access restrictions, with transparent fallback explanations.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lock size={18} className="text-yellow-600" />
                    Paywall Detection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically identifies when content is behind a paywall and switches to metadata analysis
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle size={18} className="text-orange-500" />
                    Warning Banner
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Prominent visual warning explains limitations and provides context for restricted analysis
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Check size={18} className="text-green-500" />
                    Fallback Strategy
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Graceful degradation ensures users still receive useful insights even with limited access
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-red-500/10" delay={0.3}>
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Urgent Help Button</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                One-click access to critical support resources for users facing immediate digital threats or safety concerns.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Phone size={18} className="text-red-500" />
                    Emergency Contacts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Direct access to cyber crime helpline (1930) and support organizations
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    Support Resources
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Curated list of verified helplines and government fact-checking services
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap size={18} className="text-purple-500" />
                    Instant Access
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Always-visible button ensures help is available when users need it most
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-cyan-500/10" delay={0.4}>
              <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">RAG-Powered "Misinformation Radar"</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Hybrid AI system combining Retrieval-Augmented Generation with advanced LLM analysis for instant, accurate verification.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Database size={18} className="text-cyan-500" />
                    Vector Database Search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Instant lookup in curated misinformation database using advanced embedding similarity
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain size={18} className="text-purple-500" />
                    GPT-4o Fallback
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Novel content analyzed with Azure OpenAI when database match isn't found
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap size={18} className="text-green-500" />
                    Hybrid Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Best of both worlds: speed of database lookup with intelligence of AI analysis
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="glass-card rounded-2xl p-8 border border-orange-500/10" delay={0.5}>
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">"Paywall" Edge Case & Fallback</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Robust handling of restricted content with transparent fallback to metadata-based analysis when full content is unavailable.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle size={18} className="text-orange-500" />
                    Automatic Detection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies paywalls, login requirements, and content restrictions automatically
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe size={18} className="text-blue-500" />
                    Metadata Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes URL structure, domain reputation, and public metadata for credibility assessment
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Eye size={18} className="text-purple-500" />
                    Transparent Communication
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clear warnings inform users when analysis is limited and explain the alternative approach
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section id="ai-assistant" className="section-container">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 mb-6">
                AI Assistant
              </span>
              <h2 className="text-4xl font-bold mb-6">Personalized Harm Analysis & Guidance</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Intelligent AI assistant that provides personalized support and guidance for users who encounter online harms.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="glass-card rounded-3xl p-12 border border-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection delay={0.1}>
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary w-20 h-20 rounded-2xl flex items-center justify-center">
                    <MessageCircle size={40} />
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Empathetic AI Support</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      Our AI assistant provides immediate, personalized guidance for users experiencing online harassment, misinformation, or other digital harms.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain size={18} className="text-primary" />
                          Contextual Understanding
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Analyzes multimodal inputs for comprehensive situation assessment
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Shield size={18} className="text-green-500" />
                          Safety Guidance
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Provides immediate safety recommendations and action plans
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users size={18} className="text-blue-500" />
                          Resource Connection
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Links to mental health resources and support organizations
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Database size={18} className="text-purple-500" />
                          Evidence Collection
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Guides users through proper documentation procedures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 border border-primary/10">
                  <h4 className="text-xl font-semibold mb-6">Key Capabilities</h4>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Multimodal Input Processing</h5>
                        <p className="text-sm text-muted-foreground">
                          Understands text descriptions, image uploads, and contextual information simultaneously
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500/10 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Immediate Harm Assessment</h5>
                        <p className="text-sm text-muted-foreground">
                          Quickly evaluates threat level and provides appropriate response recommendations
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/10 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Cultural Sensitivity</h5>
                        <p className="text-sm text-muted-foreground">
                          Adapts responses based on cultural context and local support resources
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/10 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Privacy-First Design</h5>
                        <p className="text-sm text-muted-foreground">
                          Maintains user privacy while providing effective support and guidance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        <section id="tech-stack" className="section-container bg-gradient-to-br from-muted/20 to-primary/5">
          <AnimatedSection>
            <div className="mb-20">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
                Technology Stack
              </span>
              <h2 className="text-4xl font-bold mb-6">Powered by Microsoft Azure & Advanced AI</h2>
              <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                Our platform leverages cutting-edge Microsoft Azure technologies and partner services for robust, scalable content analysis.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="space-y-12">
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-10 rounded-3xl border border-primary/10">
                <h3 className="text-2xl font-semibold mb-8 text-center">Microsoft Azure Technologies</h3>
                <TechnologyLogos variant="google" />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-10 rounded-3xl border border-blue-500/10">
                <h3 className="text-2xl font-semibold mb-8 text-center">Partner Technologies</h3>
                <TechnologyLogos variant="partners" />
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section className="section-container">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Lock size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Digital Space?</h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
                Join thousands of users who trust our AI-powered platform to combat misinformation, detect threats, and ensure online safety.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  onClick={() => {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    setTimeout(() => window.location.href = '/#demo', 500);
                  }}
                >
                  <Image size={20} />
                  Try Demo Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/20 hover:bg-primary/10"
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
