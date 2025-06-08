
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToGeminiAnalysis = () => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete then scroll
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
    } else {
      // Already on home page, just scroll to the section
      const geminiSection = document.querySelector('[data-tab="advanced-ai"]');
      if (geminiSection) {
        geminiSection.scrollIntoView({ behavior: 'smooth' });
        // Click the advanced-ai tab to ensure it's active
        const advancedTab = document.querySelector('[value="advanced-ai"]') as HTMLButtonElement;
        if (advancedTab) {
          advancedTab.click();
        }
      }
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="lg:w-1/2 space-y-6 mb-12 lg:mb-0 animate-fade-in">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Google Solution Challenge
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Combat Online <span className="text-primary">Misinformation</span> with AI
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                An AI-powered platform that analyzes text, images, and metadata to detect and help prevent profanity, misinformation, and fraud in real-time.
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
                onClick={scrollToGeminiAnalysis}
              >
                Try Demo
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-400" />
                Google Cloud NLP
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400" />
                Vision API
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-400" />
                Gemini Pro
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:ml-12">
            <div className="relative glass-card rounded-2xl p-1 overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30" />
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  alt="AI Analysis Platform"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
