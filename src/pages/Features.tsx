
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Image, Server, Search, Code, BarChart3, Zap, Brain, MessageCircle, Users, Globe, ArrowRight } from 'lucide-react';

const Features: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToGeminiAnalysis = () => {
    // Navigate to home page and scroll to Gemini AI section
    navigate('/');
    setTimeout(() => {
      const geminiSection = document.querySelector('[data-tab="advanced-ai"]');
      if (geminiSection) {
        geminiSection.scrollIntoView({ behavior: 'smooth' });
        // Click the advanced-ai tab to ensure it's active
        const advancedTab = document.querySelector('[value="advanced-ai"]') as HTMLButtonElement;
        if (advancedTab) {
          advancedTab.click();
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary mb-6">
                Platform Features
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Comprehensive AI-Powered Content Analysis
              </h1>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                Our platform combines cutting-edge AI technologies to provide real-time content verification, 
                threat detection, and user protection across multiple modalities and languages.
              </p>
              <div className="mt-8">
                <Button size="lg" onClick={scrollToGeminiAnalysis} className="group">
                  Try Demo Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Core Features */}
        <section className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Core Analysis Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Advanced AI-powered analysis across multiple content types and threat vectors.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Text Analysis"
              description="Detect profanity, misinformation, hate speech, and scam attempts in text content across multiple languages using advanced NLP."
              icon={<FileText size={24} />}
              delay={0.1}
            />
            <FeatureCard 
              title="Image Verification"
              description="Analyze images for manipulation, inappropriate content, and extract text using Vertex AI and Vision API for comprehensive verification."
              icon={<Image size={24} />}
              delay={0.2}
            />
            <FeatureCard 
              title="Fact Checking"
              description="Verify claims against trusted sources and provide confidence scores with evidence links using real-time fact-checking APIs."
              icon={<Search size={24} />}
              delay={0.3}
            />
            <FeatureCard 
              title="Fraud Detection"
              description="Identify phishing attempts, suspicious URLs, and other fraud indicators using pattern recognition and threat intelligence."
              icon={<Shield size={24} />}
              delay={0.4}
            />
            <FeatureCard 
              title="Cloud Infrastructure"
              description="Powered by Google Cloud technologies for reliable, scalable, and secure analysis with 99.9% uptime guarantee."
              icon={<Server size={24} />}
              delay={0.5}
            />
            <FeatureCard 
              title="Real-time Analytics"
              description="Monitor system performance and API health with comprehensive analytics dashboard and custom reporting."
              icon={<BarChart3 size={24} />}
              delay={0.6}
            />
          </div>
        </section>

        {/* Advanced Features */}
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Advanced AI Capabilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Next-generation AI features powered by Gemini and advanced machine learning models.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Gemini AI Integration"
              description="Advanced reasoning and multimodal analysis using Google's latest Gemini model for context-aware safety detection."
              icon={<Brain size={24} />}
              delay={0.1}
            />
            <FeatureCard 
              title="Asynchronous Processing"
              description="High-performance analysis with event-driven architecture, circuit breakers, and automatic retry mechanisms."
              icon={<Zap size={24} />}
              delay={0.2}
            />
            <FeatureCard 
              title="Personalized Assistant"
              description="Empathetic AI assistant providing culturally sensitive support and immediate guidance for users experiencing harm."
              icon={<MessageCircle size={24} />}
              delay={0.3}
            />
            <FeatureCard 
              title="Coordinated Behavior Detection"
              description="Identify bot networks, inauthentic behavior, and coordinated harassment campaigns using advanced pattern analysis."
              icon={<Users size={24} />}
              delay={0.4}
            />
          </div>
        </section>

        {/* Technology Stack */}
        <section className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built on enterprise-grade technologies for maximum reliability and performance.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Google Cloud Platform"
              description="Leveraging Cloud NLP, Vision API, Vertex AI, and Gemini for comprehensive content analysis and threat detection."
              icon={<Globe size={24} />}
              delay={0.1}
            />
            <FeatureCard 
              title="API Integrations"
              description="Seamless integration with IPQS, Arya.ai, Bolster, TinEye, and other leading security and analysis services."
              icon={<Code size={24} />}
              delay={0.2}
            />
            <FeatureCard 
              title="Scalable Architecture"
              description="Event-driven microservices with circuit breakers, retry logic, and horizontal scaling for enterprise workloads."
              icon={<Server size={24} />}
              delay={0.3}
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-container">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <div className="glass-card p-12 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <h2 className="text-3xl font-bold mb-6">Ready to Experience Advanced AI Analysis?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Join thousands of users protecting their digital experiences with our cutting-edge AI platform. 
                  Start analyzing content with our advanced tools today.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" onClick={scrollToGeminiAnalysis} className="group">
                    Try Our Demo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                    Learn More
                  </Button>
                </div>
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
