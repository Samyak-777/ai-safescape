
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import AnalysisToolsEnhanced from '@/components/AnalysisToolsEnhanced';
import TechnologyLogos from '@/components/TechnologyLogos';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Shield, FileText, Image, Server, Search, Code } from 'lucide-react';

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="section-container bg-muted/30">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Key Features
              </span>
              <h2 className="text-3xl font-bold mb-4">Advanced Content Analysis</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform uses cutting-edge AI to analyze content across multiple dimensions, providing thorough verification and detection.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Text Analysis"
              description="Detect profanity, misinformation, hate speech, and scam attempts in text content across multiple languages."
              icon={<FileText size={24} />}
              delay={0.1}
            />
            <FeatureCard 
              title="Image Verification"
              description="Analyze images for manipulation, inappropriate content, and extract text for further verification."
              icon={<Image size={24} />}
              delay={0.2}
            />
            <FeatureCard 
              title="Fact Checking"
              description="Verify claims against trusted sources and provide confidence scores with evidence links."
              icon={<Search size={24} />}
              delay={0.3}
            />
            <FeatureCard 
              title="Fraud Detection"
              description="Identify phishing attempts, suspicious URLs, and other fraud indicators in content."
              icon={<Shield size={24} />}
              delay={0.4}
            />
            <FeatureCard 
              title="Cloud Infrastructure"
              description="Powered by Google Cloud technologies for reliable, scalable, and secure analysis."
              icon={<Server size={24} />}
              delay={0.5}
            />
            <FeatureCard 
              title="Developer API"
              description="Integrate our analysis capabilities directly into your applications with our comprehensive API."
              icon={<Code size={24} />}
              delay={0.6}
            />
          </div>
        </section>
        
        <AnalysisToolsEnhanced />
        
        <section className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Our Technology
              </span>
              <h2 className="text-3xl font-bold mb-4">Powered by Google Technologies</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We leverage the latest Google Cloud technologies to provide accurate and efficient content analysis.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="glass-card p-8 rounded-2xl">
            <TechnologyLogos variant="google" />
          </div>
          
          <AnimatedSection className="mt-16">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Partner Ecosystem
              </span>
              <h2 className="text-3xl font-bold mb-4">Integrated Partner Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We integrate with leading security and analysis services to provide comprehensive content verification.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="glass-card p-8 rounded-2xl">
            <TechnologyLogos variant="partners" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
