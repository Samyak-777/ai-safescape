
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import AnalysisTools from '@/components/AnalysisTools';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Shield, FileText, Image as ImageIcon, Server, Search, Code } from 'lucide-react';

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
              icon={<ImageIcon size={24} />}
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
        
        <AnalysisTools />
        
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <AnimatedSection delay={0.1} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src="https://www.gstatic.com/devrel-devsite/prod/va65162e8ce9aacc75e4d3c0cd6d166fc6ceaaf184fea0ff0eac1d9b62c0480be/cloud/images/cloud-logo.svg" alt="Google Cloud" className="w-14" />
                </div>
                <h3 className="text-sm font-medium">Google Cloud</h3>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src="https://lh3.googleusercontent.com/YMTL5mX7SMGZatN8g-WDx4QnrDEQQ_DrVgB72b9nQRcFP9OvNR-WQ7-fI1T-u8-C4kFFlwBU7kRVvjlh5gMd7uTVlTGZUHQ" alt="Cloud NLP" className="w-12" />
                </div>
                <h3 className="text-sm font-medium">Cloud NLP</h3>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src="https://lh3.googleusercontent.com/jH-kZQhA69FWc6L5Shl0fgNB-jFYCZv7-RH8CYl-im1CYGWxV18uMTTtNZwuWDm87rz9nGgKYZ5F84KxlJxEWA-5pZMNzAoO" alt="Vision API" className="w-12" />
                </div>
                <h3 className="text-sm font-medium">Vision API</h3>
              </AnimatedSection>
              
              <AnimatedSection delay={0.4} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src="https://lh3.googleusercontent.com/XGJWRU2fO7HrLKZTm50hN5GfBnQhZPenxn9jTvwuW7s6qLJJEmX9LKMxdC_LXG5zDRvpNcOGKbhLfQ2wLHmo81Y-4ZbUqc8" alt="Gemini Pro" className="w-12" />
                </div>
                <h3 className="text-sm font-medium">Gemini Pro</h3>
              </AnimatedSection>
              
              <AnimatedSection delay={0.5} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src="https://lh3.googleusercontent.com/Nu7vDDZnKhbV-GLRW04c04B4Qye1v8iRPR9YHjBck5-QcvzxkV6BQJiL0eJQkbK3zA2LY_kMHG-LP43kkbWx-vMTbl9Wy_S3" alt="Vertex AI" className="w-12" />
                </div>
                <h3 className="text-sm font-medium">Vertex AI</h3>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
