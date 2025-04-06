
// API client for communicating with serverless functions
// This file provides frontend-friendly API clients that don't expose sensitive information

export interface AnalysisRequest {
  text: string;
  options: string[];
}

export interface AnalysisResponse {
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
}

// Base URL for your serverless functions
// In production, replace this with your actual serverless function URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-serverless-function-url.com/api';

/**
 * Send text to serverless function for analysis
 * The serverless function handles the API keys and logic for different analysis types
 */
export const analyzeTextSecure = async (text: string, options: string[]): Promise<AnalysisResponse[]> => {
  try {
    console.log(`Securely analyzing text with options: ${options.join(', ')}`);
    
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        options,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error calling analysis service:', error);
    throw new Error('Analysis service unavailable');
  }
};

// For development and testing purposes, this function simulates 
// the serverless function response while you set up the actual backend
export const analyzeTextMock = async (text: string, options: string[]): Promise<AnalysisResponse[]> => {
  console.log(`Using mock API for text analysis with options: ${options.join(', ')}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const results: AnalysisResponse[] = [];
  
  // Generate mock results based on selected options
  options.forEach(option => {
    switch(option) {
      case 'profanity':
        if (text.toLowerCase().includes('stupid') || text.toLowerCase().includes('damn')) {
          results.push({
            type: 'profanity check',
            status: 'warning',
            message: 'This text contains mild inappropriate language'
          });
        } else {
          results.push({
            type: 'profanity check',
            status: 'clean',
            message: 'No inappropriate language detected'
          });
        }
        break;
      case 'fact-check':
        if (text.toLowerCase().includes('fake') || text.toLowerCase().includes('conspiracy')) {
          results.push({
            type: 'fact check',
            status: 'warning',
            message: 'This text contains claims that may need verification'
          });
        } else {
          results.push({
            type: 'fact check',
            status: 'clean',
            message: 'No factual inaccuracies detected'
          });
        }
        break;
      case 'scam':
        if (text.toLowerCase().includes('money') || text.toLowerCase().includes('transfer')) {
          results.push({
            type: 'scam detection',
            status: 'danger',
            message: 'This text contains patterns typical of scam attempts'
          });
        } else {
          results.push({
            type: 'scam detection',
            status: 'clean',
            message: 'No scam indicators detected'
          });
        }
        break;
      case 'ethics':
        if (text.toLowerCase().includes('hate') || text.toLowerCase().includes('threat')) {
          results.push({
            type: 'ethical analysis',
            status: 'danger',
            message: 'This text may contain content that violates ethical guidelines'
          });
        } else {
          results.push({
            type: 'ethical analysis',
            status: 'clean',
            message: 'No ethical concerns detected'
          });
        }
        break;
      case 'ascii':
        if (text.includes('¯\\_(ツ)_/¯') || text.match(/[^\x00-\x7F]+/)) {
          results.push({
            type: 'ascii detection',
            status: 'clean',
            message: 'ASCII art detected but appears harmless'
          });
        } else {
          results.push({
            type: 'ascii detection',
            status: 'clean',
            message: 'No special ASCII patterns detected'
          });
        }
        break;
    }
  });
  
  return results;
};

// Use mock by default in development, use secure function in production
export const analyzeTextWithService = import.meta.env.PROD ? analyzeTextSecure : analyzeTextMock;
