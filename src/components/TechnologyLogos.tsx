
import React from 'react';
import AnimatedSection from './AnimatedSection';

interface TechnologyLogo {
  name: string;
  url: string;
  altText: string;
}

const azureCloudLogos: TechnologyLogo[] = [
  {
    name: 'Microsoft Azure',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    altText: 'Microsoft Azure'
  },
  {
    name: 'Azure OpenAI',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    altText: 'Azure OpenAI Service'
  },
  {
    name: 'Azure AI Vision',
    url: '/lovable-uploads/9c4a5859-27ed-4799-8d02-8b97676d6241.png',
    altText: 'Azure AI Vision'
  },
  {
    name: 'Azure AI Search',
    url: '/lovable-uploads/9d20d5c9-edc7-432b-9b97-d462f6217cec.png',
    altText: 'Azure AI Search'
  },
  {
    name: 'Azure Cosmos DB',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cosmosdb/cosmosdb-original.svg',
    altText: 'Azure Cosmos DB'
  }
];

const partnerLogos: TechnologyLogo[] = [
  {
    name: 'IPQS',
    url: '/lovable-uploads/423f5029-0b2f-424e-ad74-c44c8a38280a.png',
    altText: 'IP Quality Score'
  },
  {
    name: 'Arya.ai',
    url: '/lovable-uploads/9e451d3a-9cc4-49ef-b090-2a3dd8dd0421.png',
    altText: 'Arya AI'
  },
  {
    name: 'Bolster',
    url: '/lovable-uploads/02769c05-96eb-4ba3-b4b3-2191da95546d.png',
    altText: 'Bolster AI'
  },
  {
    name: 'TinEye',
    url: '/lovable-uploads/e6d6eaa9-a0bf-4cf3-a3d0-6b9dd8dd08cf.png',
    altText: 'TinEye Reverse Image Search'
  },
  {
    name: 'OpenCV',
    url: 'https://opencv.org/wp-content/uploads/2022/05/logo.png',
    altText: 'OpenCV'
  }
];

interface TechnologyLogosProps {
  variant?: 'azure' | 'partners' | 'all' | 'google';
}

const TechnologyLogos: React.FC<TechnologyLogosProps> = ({ variant = 'all' }) => {
  // Map 'google' to 'azure' for backward compatibility
  const effectiveVariant = variant === 'google' ? 'azure' : variant;
  
  const logosToShow = effectiveVariant === 'azure' 
    ? azureCloudLogos 
    : effectiveVariant === 'partners' 
      ? partnerLogos 
      : [...azureCloudLogos, ...partnerLogos];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {logosToShow.map((logo, index) => (
        <AnimatedSection key={logo.name} delay={0.1 * (index + 1)} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white/10 dark:bg-black/10 rounded-full p-2">
            <img 
              src={logo.url} 
              alt={logo.altText} 
              className="max-w-full max-h-full object-contain" 
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/64x64/0078d4/ffffff?text=${logo.name.charAt(0)}`;
              }}
            />
          </div>
          <h3 className="text-sm font-medium">{logo.name}</h3>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default TechnologyLogos;
