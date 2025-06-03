
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import AnalysisToolsEnhanced from '@/components/AnalysisToolsEnhanced';
import TechnologyLogos from '@/components/TechnologyLogos';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ServiceStatusIndicator from '@/components/ServiceStatusIndicator';
import AccessibilityHelper from '@/components/AccessibilityHelper';
import { SkipLink, FOCUS_STYLES, TOUCH_TARGET_SIZE } from '@/utils/accessibility';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, FileText, Image, Server, Search, Code, BarChart3, Brain, Users, Award } from 'lucide-react';

const Index: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Links for Keyboard Navigation - WCAG 2.4.1 */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#demo">Skip to analysis tools</SkipLink>
      <SkipLink href="#features">Skip to features</SkipLink>
      
      <Navbar />
      
      {/* Analytics Dashboard Modal */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent 
          className="max-w-6xl max-h-[80vh] overflow-y-auto"
          aria-describedby="analytics-description"
        >
          <DialogHeader>
            <DialogTitle>System Analytics & Monitoring</DialogTitle>
            <DialogDescription id="analytics-description">
              Real-time performance metrics and system health monitoring dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsDashboard />
            </div>
            <div>
              <PerformanceMonitor />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <ServiceStatusIndicator />
        <Button
          onClick={() => setShowAnalytics(true)}
          size="lg"
          className={`
            ${TOUCH_TARGET_SIZE.recommended} 
            ${FOCUS_STYLES.ring}
            rounded-full shadow-lg hover:shadow-xl transition-all duration-200
          `}
          aria-label="Open analytics dashboard"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="sr-only">Analytics</span>
        </Button>
      </div>
      
      {/* Accessibility Helper */}
      <AccessibilityHelper />
      
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Hero />
        
        <section id="features" className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Advanced Capabilities
              </span>
              <h2 className="text-3xl font-bold mb-4">Next-Generation Content Safety</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Our platform combines cutting-edge AI with comprehensive safety measures to protect users 
                from harmful content while maintaining accessibility and ease of use.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="AI-Powered Text Analysis"
              description="Advanced detection of misinformation, hate speech, profanity, and fraud using Google Gemini 2.5 Pro with real-time streaming analysis."
              icon={<FileText size={24} />}
              delay={0.1}
            />
            <FeatureCard 
              title="Intelligent Image Verification"
              description="Comprehensive image analysis including manipulation detection, inappropriate content screening, and AI-generated content identification."
              icon={<Image size={24} />}
              delay={0.2}
            />
            <FeatureCard 
              title="Personalized AI Assistant"
              description="Smart recommendations and guidance tailored to detected threats, providing actionable steps for user safety and security."
              icon={<Brain size={24} />}
              delay={0.3}
            />
            <FeatureCard 
              title="Advanced Threat Intelligence"
              description="Real-time threat detection with comprehensive risk scoring, social engineering identification, and security analysis."
              icon={<Shield size={24} />}
              delay={0.4}
            />
            <FeatureCard 
              title="Accessible Design"
              description="WCAG 2.2 compliant interface designed for all users, including those with disabilities, featuring keyboard navigation and screen reader support."
              icon={<Users size={24} />}
              delay={0.5}
            />
            <FeatureCard 
              title="Enterprise Analytics"
              description="Comprehensive monitoring with real-time performance metrics, circuit breakers, and detailed security reporting capabilities."
              icon={<BarChart3 size={24} />}
              delay={0.6}
            />
          </div>
        </section>
        
        <AnalysisToolsEnhanced />
        
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Technology Excellence
              </span>
              <h2 className="text-3xl font-bold mb-4">Powered by Google Cloud & Advanced AI</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We leverage the latest Google Cloud technologies and cutting-edge AI models to provide 
                accurate, scalable, and reliable content analysis with enterprise-grade security.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="glass-card p-8 rounded-2xl mb-12">
            <TechnologyLogos variant="google" />
          </div>
          
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Trusted Partners
              </span>
              <h2 className="text-3xl font-bold mb-4">Integrated Security Ecosystem</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We partner with leading security providers to deliver comprehensive threat detection 
                and content verification across multiple specialized domains.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="glass-card p-8 rounded-2xl mb-12">
            <TechnologyLogos variant="partners" />
          </div>

          {/* New Features Highlight */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gemini 2.5 Pro</h3>
                <p className="text-muted-foreground">
                  Latest AI technology with advanced reasoning, function calling, and structured outputs
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">WCAG 2.2 Compliant</h3>
                <p className="text-muted-foreground">
                  Fully accessible design meeting international accessibility standards
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Server size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
                <p className="text-muted-foreground">
                  Scalable architecture with monitoring, analytics, and robust error handling
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
