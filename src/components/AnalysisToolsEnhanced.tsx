import React from 'react';
import AnimatedSection from './AnimatedSection';
import SecureTextAnalyzer from './SecureTextAnalyzer';
import SecureImageAnalyzer from './SecureImageAnalyzer';

const AnalysisToolsEnhanced: React.FC = () => {
  return (
    <section className="section-container">
      <AnimatedSection>
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Analysis Tools
          </span>
          <h2 className="text-3xl font-bold mb-4">Secure Content Analysis</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze text and images for safety, authenticity, and compliance using our secure, privacy-focused tools.
          </p>
        </div>
      </AnimatedSection>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedSection>
          <SecureTextAnalyzer />
        </AnimatedSection>
        
        <AnimatedSection>
          <SecureImageAnalyzer />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AnalysisToolsEnhanced;
