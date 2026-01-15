
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToAnalysisSection = () => {
    // First try to find the Azure OpenAI advanced analysis section on the current page
    const advancedAITab = document.querySelector('[data-state="active"][value="advanced-ai"]');
    if (advancedAITab) {
      // If already on advanced-ai tab, just scroll to it
      const analysisSection = document.getElementById('analysis-tools');
      if (analysisSection) {
        analysisSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Find the analysis tools section and switch to advanced-ai tab
      const analysisSection = document.getElementById('analysis-tools');
      if (analysisSection) {
        // Scroll to the section first
        analysisSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Then switch to the advanced-ai tab after a short delay
        setTimeout(() => {
          const advancedAIButton = document.querySelector('[data-value="advanced-ai"]') as HTMLButtonElement;
          if (advancedAIButton) {
            advancedAIButton.click();
          }
        }, 500);
      }
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-[hsl(262,83%,58%)]/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="lg:w-1/2 space-y-6 mb-12 lg:mb-0 animate-fade-in">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Microsoft Imagine Cup 2026
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Cognitive Security Shield built on <span className="text-primary">Azure AI</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                Powered by Azure OpenAI Service and Azure AI Content Safety. An enterprise-grade platform that analyzes text, images, and metadata to detect and help prevent profanity, misinformation, and fraud in real-time.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/features')}
              >
                Explore Features
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToAnalysisSection}
                id="demo-button"
                aria-label="Try the Azure OpenAI analysis demo"
              >
                Try Demo
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent" />
                Azure AI Search
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary" />
                Azure AI Vision
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[hsl(262,83%,58%)]" />
                Azure OpenAI GPT-4o
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:ml-12">
            <div className="relative glass-card rounded-2xl p-1 overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[hsl(262,83%,58%)]/20 opacity-30" />
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  alt="AI Analysis Platform"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                Built on Microsoft Azure
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
