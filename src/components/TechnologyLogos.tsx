
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
    url: 'https://www.gstatic.com/devrel-devsite/prod/va65162e8ce9aacc75e4d3c0cd6d166fc6ceaaf184fea0ff0eac1d9b62c0480be/cloud/images/cloud-logo.svg',
    altText: 'Google Cloud'
  },
  {
    name: 'Cloud NLP',
    url: 'https://lh3.googleusercontent.com/YMTL5mX7SMGZatN8g-WDx4QnrDEQQ_DrVgB72b9nQRcFP9OvNR-WQ7-fI1T-u8-C4kFFlwBU7kRVvjlh5gMd7uTVlTGZUHQ',
    altText: 'Cloud Natural Language Processing'
  },
  {
    name: 'Vision API',
    url: 'https://lh3.googleusercontent.com/jH-kZQhA69FWc6L5Shl0fgNB-jFYCZv7-RH8CYl-im1CYGWxV18uMTTtNZwuWDm87rz9nGgKYZ5F84KxlJxEWA-5pZMNzAoO',
    altText: 'Vision API'
  },
  {
    name: 'Gemini Pro',
    url: 'https://lh3.googleusercontent.com/XGJWRU2fO7HrLKZTm50hN5GfBnQhZPenxn9jTvwuW7s6qLJJEmX9LKMxdC_LXG5zDRvpNcOGKbhLfQ2wLHmo81Y-4ZbUqc8',
    altText: 'Gemini Pro'
  },
  {
    name: 'Vertex AI',
    url: 'https://lh3.googleusercontent.com/Nu7vDDZnKhbV-GLRW04c04B4Qye1v8iRPR9YHjBck5-QcvzxkV6BQJiL0eJQkbK3zA2LY_kMHG-LP43kkbWx-vMTbl9Wy_S3',
    altText: 'Vertex AI'
  }
];

const partnerLogos: TechnologyLogo[] = [
  {
    name: 'IPQS',
    url: 'https://www.ipqualityscore.com/templates/simple/img/logo/ipqs.svg',
    altText: 'IP Quality Score'
  },
  {
    name: 'Arya.ai',
    url: 'https://arya.ai/hubfs/Aryaai_April2021/Images/arya-logo.svg',
    altText: 'Arya AI'
  },
  {
    name: 'Bolster',
    url: 'https://bolster.ai/assets/images/logo.svg',
    altText: 'Bolster AI'
  },
  {
    name: 'TinEye',
    url: 'https://tineye.com/images/press/tineye-color.png',
    altText: 'TinEye Reverse Image Search'
  },
  {
    name: 'OpenCV',
    url: 'https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_white_600x.png',
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
            />
          </div>
          <h3 className="text-sm font-medium">{logo.name}</h3>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default TechnologyLogos;
