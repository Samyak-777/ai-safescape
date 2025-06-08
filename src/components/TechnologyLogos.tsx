
import React from 'react';
import AnimatedSection from './AnimatedSection';

interface TechnologyLogo {
  name: string;
  url: string;
  altText: string;
}

const googleCloudLogos: TechnologyLogo[] = [
  {
    name: 'Google Cloud',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
    altText: 'Google Cloud'
  },
  {
    name: 'Cloud NLP',
    url: 'https://cloud.google.com/static/images/cloud-logo.svg',
    altText: 'Cloud Natural Language Processing'
  },
  {
    name: 'Vision API',
    url: 'https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853acdde86ecadb99d06d6ce562ea4dfe6/cloud/images/favicons/onecloud/super_cloud.png',
    altText: 'Vision API'
  },
  {
    name: 'Gemini Pro',
    url: 'https://seeklogo.com/images/G/google-gemini-logo-A5787B2669-seeklogo.com.png',
    altText: 'Gemini Pro'
  },
  {
    name: 'Vertex AI',
    url: 'https://cloud.google.com/_static/cloud/images/social-icon-google-cloud-1200-630.png',
    altText: 'Vertex AI'
  }
];

const partnerLogos: TechnologyLogo[] = [
  {
    name: 'IPQS',
    url: 'https://avatars.githubusercontent.com/u/68890251?s=200&v=4',
    altText: 'IP Quality Score'
  },
  {
    name: 'Arya.ai',
    url: 'https://media.licdn.com/dms/image/C4D0BAQHxTZG9qQZ8jw/company-logo_200_200/0/1630457263043/arya_ai_logo?e=2147483647&v=beta&t=k3Jk7bQGNGPKr4vQWJX8cTKyQWs2Q5J5j1Tz8K4nB2s',
    altText: 'Arya AI'
  },
  {
    name: 'Bolster',
    url: 'https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1474471585/gkzhnhpzgxpv4vvkrp7e.png',
    altText: 'Bolster AI'
  },
  {
    name: 'TinEye',
    url: 'https://tineye.com/images/widgets/tineye_logo.png',
    altText: 'TinEye Reverse Image Search'
  },
  {
    name: 'OpenCV',
    url: 'https://opencv.org/wp-content/uploads/2022/05/logo.png',
    altText: 'OpenCV'
  }
];

interface TechnologyLogosProps {
  variant?: 'google' | 'partners' | 'all';
}

const TechnologyLogos: React.FC<TechnologyLogosProps> = ({ variant = 'all' }) => {
  const logosToShow = variant === 'google' 
    ? googleCloudLogos 
    : variant === 'partners' 
      ? partnerLogos 
      : [...googleCloudLogos, ...partnerLogos];

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
                target.src = `https://via.placeholder.com/64x64/6366f1/ffffff?text=${logo.name.charAt(0)}`;
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
