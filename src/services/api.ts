
// Simulated API service with free APIs where possible
// In a production environment, these would connect to real endpoints

// Mock API response function
const mockApiResponse = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Text Analysis Services
export const analyzeText = async (text: string, options: string[]): Promise<{
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
}> => {
  // In a real app, this would call different API endpoints based on options
  console.log(`Analyzing text with options: ${options.join(', ')}`);
  
  // Simple analysis logic to simulate different API responses
  if (text.toLowerCase().includes('fake news') && options.includes('fact-check')) {
    return mockApiResponse({
      type: 'fact-check',
      status: 'warning',
      message: 'This text contains unverified claims that may need fact-checking'
    });
  } else if (text.toLowerCase().includes('free money') && options.includes('scam')) {
    return mockApiResponse({
      type: 'scam',
      status: 'danger',
      message: 'This text contains suspicious patterns typical of scams'
    });
  } else if (text.toLowerCase().includes('stupid') && options.includes('profanity')) {
    return mockApiResponse({
      type: 'profanity',
      status: 'warning',
      message: 'This text contains mild inappropriate language'
    });
  } else if (text.includes('¯\\_(ツ)_/¯') && options.includes('ascii')) {
    return mockApiResponse({
      type: 'ascii',
      status: 'clean',
      message: 'ASCII art detected but appears harmless'
    });
  } else if (text.toLowerCase().includes('hate') && options.includes('ethics')) {
    return mockApiResponse({
      type: 'ethics',
      status: 'danger',
      message: 'This text may contain content that violates ethical guidelines'
    });
  } else {
    return mockApiResponse({
      type: 'general',
      status: 'clean',
      message: 'No issues detected in the provided text'
    });
  }
};

// Image Analysis Services
export const analyzeImage = async (imageData: string, options: string[]): Promise<{
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
}> => {
  console.log(`Analyzing image with options: ${options.join(', ')}`);
  
  // Simulated image analysis with random results for demo purposes
  const results = [
    {
      type: 'manipulation',
      status: 'warning' as const,
      message: 'This image shows potential signs of manipulation around the edges'
    },
    {
      type: 'safe-search',
      status: 'clean' as const,
      message: 'No inappropriate content detected in this image'
    },
    {
      type: 'text-extract',
      status: 'clean' as const,
      message: 'Text extracted and verified with no concerning content'
    },
    {
      type: 'general',
      status: 'clean' as const,
      message: 'Image analysis complete - no issues detected'
    }
  ];
  
  // Randomly select a result for demo purposes
  const randomIndex = Math.floor(Math.random() * results.length);
  return mockApiResponse(results[randomIndex], 1500);
};

// Export all potential analysis options for reuse
export const textAnalysisOptions = [
  { 
    id: 'profanity', 
    label: 'Profanity Check', 
    icon: 'Ban',
    description: 'Detect inappropriate language and profanity'
  },
  { 
    id: 'fact-check', 
    label: 'Fact Check', 
    icon: 'Check',
    description: 'Verify claims and fact accuracy'
  },
  { 
    id: 'scam', 
    label: 'Scam Detection', 
    icon: 'AlertCircle',
    description: 'Identify suspicious URLs and text patterns'
  },
  { 
    id: 'ethics', 
    label: 'Ethical Analysis', 
    icon: 'Shield',
    description: 'Check for hate speech or harmful content'
  },
  { 
    id: 'ascii', 
    label: 'ASCII Detection', 
    icon: 'Search',
    description: 'Detect ASCII art in the text'
  },
];

export const imageAnalysisOptions = [
  { 
    id: 'manipulation', 
    label: 'Manipulation Check', 
    icon: 'Search',
    description: 'Detect edited images and deepfakes'
  },
  { 
    id: 'safe-search', 
    label: 'Content Safety', 
    icon: 'Shield',
    description: 'Check for inappropriate visual content'
  },
  { 
    id: 'text-extract', 
    label: 'Text Extraction', 
    icon: 'Image',
    description: 'Extract and analyze text from images'
  },
];
