
// IPQuality Score API integration
const IPQS_API_KEY = import.meta.env.VITE_IPQS_API_KEY || 'your api key here';
const IPQS_BASE_URL = 'https://www.ipqualityscore.com/api/json';

export interface IPQSResult {
  isSuspicious: boolean;
  riskScore: number;
  categories: string[];
  message: string;
}

export const checkUrlWithIPQS = async (url: string): Promise<IPQSResult> => {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${IPQS_BASE_URL}/url/${IPQS_API_KEY}/${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IPQS API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const categories = [];
    if (data.phishing) categories.push('phishing');
    if (data.malware) categories.push('malware');
    if (data.suspicious) categories.push('suspicious');
    if (data.adult) categories.push('adult');

    return {
      isSuspicious: data.suspicious || data.phishing || data.malware,
      riskScore: data.risk_score || 0,
      categories,
      message: data.message || 'URL analysis completed',
    };
  } catch (error) {
    console.error('IPQS API error:', error);
    throw new Error('URL fraud detection service unavailable');
  }
};
