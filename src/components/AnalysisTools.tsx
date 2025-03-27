
import React, { useState } from 'react';
import TextAnalyzer from './TextAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import { FileText, Image as ImageIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const AnalysisTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  return (
    <section id="demo" className="section-container">
      <AnimatedSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Try Our Analysis Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload content for analysis or try our demo tools to see how our AI models detect and flag potential issues in text and images.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="max-w-3xl mx-auto">
        <div className="bg-white/30 dark:bg-black/20 p-1 rounded-xl flex mb-6">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-white dark:bg-black/40 shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-black/20 text-muted-foreground'
            }`}
            onClick={() => setActiveTab('text')}
          >
            <FileText size={18} />
            Text Analysis
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'image'
                ? 'bg-white dark:bg-black/40 shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-black/20 text-muted-foreground'
            }`}
            onClick={() => setActiveTab('image')}
          >
            <ImageIcon size={18} />
            Image Analysis
          </button>
        </div>

        <div className="transition-all duration-300">
          {activeTab === 'text' ? (
            <div className="animate-fade-in">
              <TextAnalyzer />
            </div>
          ) : (
            <div className="animate-fade-in">
              <ImageAnalyzer />
            </div>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default AnalysisTools;
