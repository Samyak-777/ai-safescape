import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import Button from '@/components/Button';
import AccessibilityHelper from '@/components/AccessibilityHelper';
import { SkipLink, FOCUS_STYLES, TOUCH_TARGET_SIZE } from '@/utils/accessibility';
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
  Brain, 
  Users, 
  Award, 
  Sparkles,
  Clock, 
  Filter, 
  Phone, 
  Mail, 
  Accessibility
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

  const advancedFeatures = [
    {
      title: "Gemini 2.5 Pro Integration",
      description: "Latest AI model with advanced reasoning, function calling, and structured outputs for superior content analysis.",
      icon: <Sparkles size={24} />,
      category: "AI Technology",
      highlights: ["Function calling", "Structured outputs", "Advanced reasoning", "Context awareness"]
    },
    {
      title: "Personalized AI Assistant",
      description: "Intelligent recommendations and actionable guidance based on detected threats and user context.",
      icon: <Brain size={24} />,
      category: "User Experience",
      highlights: ["Risk assessment", "Priority actions", "Learning insights", "Follow-up suggestions"]
    },
    {
      title: "Advanced Security Analysis",
      description: "Comprehensive threat intelligence with social engineering detection and advanced risk scoring.",
      icon: <Shield size={24} />,
      category: "Security",
      highlights: ["Threat intelligence", "Risk scoring", "Social engineering detection", "Advanced patterns"]
    },
    {
      title: "Real-time Streaming",
      description: "Live analysis results with streaming capabilities for immediate feedback and user engagement.",
      icon: <Zap size={24} />,
      category: "Performance",
      highlights: ["Live updates", "Streaming analysis", "Immediate feedback", "Real-time processing"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#text-analysis">Skip to text analysis features</SkipLink>
      <SkipLink href="#accessibility-features">Skip to accessibility features</SkipLink>
      
      <Navbar />
      <AccessibilityHelper />
      
      <main id="main-content" className="flex-grow pt-24" tabIndex={-1}>
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Platform Features
              </span>
              <h1 className="text-4xl font-bold mb-4">Advanced Content Safety & Analysis</h1>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Our platform integrates cutting-edge AI technologies with comprehensive accessibility features 
                to provide thorough analysis and verification of content while ensuring usability for all users.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="glass-card rounded-2xl p-8 mb-12">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-medium">Quick Navigation</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('advanced-features')}
                  className={`${FOCUS_STYLES.ring} ${TOUCH_TARGET_SIZE.minimum}`}
                >
                  <Sparkles size={16} />
                  <span>Advanced AI</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('text-analysis')}
                  className={`${FOCUS_STYLES.ring} ${TOUCH_TARGET_SIZE.minimum}`}
                >
                  <FileText size={16} />
                  <span>Text Analysis</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollToSection('accessibility-features')}
                  className={`${FOCUS_STYLES.ring} ${TOUCH_TARGET_SIZE.minimum}`}
                >
                  <Accessibility size={16} />
                  <span>Accessibility</span>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Advanced Features Section */}
        <section id="advanced-features" className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Advanced Capabilities
              </span>
              <h2 className="text-3xl font-bold mb-4">Next-Generation AI Features</h2>
              <p className="text-muted-foreground max-w-2xl">
                Powered by Google's latest AI technologies with advanced accessibility and user experience enhancements.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <AnimatedSection key={index} className="glass-card rounded-2xl p-6 flex flex-col h-full" delay={0.1 * (index + 1)}>
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {feature.category}
                  </span>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Text Analysis Features */}
        <section id="text-analysis" className="section-container">
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
        
        {/* Accessibility Features Section */}
        <section id="accessibility-features" className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Accessibility & Inclusion
              </span>
              <h2 className="text-3xl font-bold mb-4">WCAG 2.2 Compliant Design</h2>
              <p className="text-muted-foreground max-w-2xl">
                Built from the ground up with accessibility in mind, ensuring all users can safely and effectively 
                interact with our platform regardless of their abilities or assistive technologies.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.1}>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Universal Design</h3>
              <p className="text-muted-foreground mb-4">
                Designed for all users with clear visual hierarchy, consistent navigation, and intuitive interactions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Clear visual hierarchy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Consistent UI patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Plain language content</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.2}>
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Accessibility size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Keyboard Navigation</h3>
              <p className="text-muted-foreground mb-4">
                Full keyboard accessibility with visible focus indicators and logical tab order throughout the platform.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Tab navigation support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Visible focus indicators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Skip links available</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.3}>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Help & Support</h3>
              <p className="text-muted-foreground mb-4">
                Always-available help system with crisis resources and guided assistance for vulnerable users.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Prominent help button</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Crisis resource access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Guided workflows</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.4}>
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">WCAG 2.2 Standards</h3>
              <p className="text-muted-foreground mb-4">
                Meets or exceeds Web Content Accessibility Guidelines 2.2 at AA level for maximum compatibility.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>4.5:1 contrast ratios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>24px minimum targets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Screen reader compatible</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.5}>
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Crisis Support</h3>
              <p className="text-muted-foreground mb-4">
                Immediate access to crisis resources and mental health support for users who encounter disturbing content.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Crisis hotline access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Mental health resources</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Emergency contacts</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="glass-card rounded-2xl p-6" delay={0.6}>
              <div className="bg-teal-500/10 text-teal-600 dark:text-teal-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Multi-language Support</h3>
              <p className="text-muted-foreground mb-4">
                Internationalization support with proper language attributes and right-to-left text support.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Language detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>RTL text support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span>Cultural sensitivity</span>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </section>
        
        {/* Technology Stack */}
        <section id="tech-stack" className="section-container">
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
          
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-8 rounded-2xl mb-8">
              <h3 className="text-xl font-medium mb-6 text-center">Google Cloud Technologies</h3>
              <TechnologyLogos variant="google" />
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-medium mb-6 text-center">Partner Technologies</h3>
              <TechnologyLogos variant="partners" />
            </div>
          </AnimatedSection>
        </section>
        
        {/* Call to Action */}
        <section className="section-container bg-muted/30">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-8 rounded-2xl">
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Experience Safe Content Analysis?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our platform provides comprehensive, accessible, and user-friendly content verification 
                to help protect you and your community from harmful content.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className={`${FOCUS_STYLES.ring} ${TOUCH_TARGET_SIZE.recommended}`}
                  onClick={() => {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    setTimeout(() => window.location.href = '/#demo', 500);
                  }}
                >
                  <FileText size={20} />
                  <span>Try Demo</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={`${FOCUS_STYLES.ring} ${TOUCH_TARGET_SIZE.recommended}`}
                  onClick={() => window.location.href = '/documentation'}
                >
                  <BarChart size={20} />
                  <span>View Documentation</span>
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
