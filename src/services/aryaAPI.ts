
// Arya.ai Phishing Detection API integration
const ARYA_API_KEY = import.meta.env.VITE_ARYA_API_KEY || 'your api key here';
const ARYA_BASE_URL = 'https://ping.arya.ai/api/v1';

export interface AryaResult {
  isPhishing: boolean;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const checkPhishingWithArya = async (url: string): Promise<AryaResult> => {
  try {
    const response = await fetch(`${ARYA_BASE_URL}/phishing-detection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARYA_API_KEY}`,
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Arya API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return {
      isPhishing: data.is_phishing || false,
      confidence: data.confidence || 0,
      riskLevel: data.risk_level || 'low',
    };
  } catch (error) {
    console.error('Arya API error:', error);
    throw new Error('Phishing detection service unavailable');
  }
};
