
// Google Safe Browsing (Web Risk) API integration
const WEB_RISK_API_KEY = import.meta.env.VITE_WEB_RISK_API_KEY || 'AIzaSyDXyZ0BViMMS7m9M8lxoz9lxlIFosC2x3U';
const WEB_RISK_BASE_URL = 'https://webrisk.googleapis.com/v1';

export interface WebRiskResult {
  isThreat: boolean;
  threatTypes: string[];
  confidence: number;
}

export const checkUrlWithWebRisk = async (url: string): Promise<WebRiskResult> => {
  try {
    const response = await fetch(`${WEB_RISK_BASE_URL}/uris:search?key=${WEB_RISK_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uri: url,
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'POTENTIALLY_HARMFUL_APPLICATION'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Web Risk API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      isThreat: !!data.threat,
      threatTypes: data.threat?.threatTypes || [],
      confidence: data.threat ? 0.9 : 0.1,
    };
  } catch (error) {
    console.error('Web Risk API error:', error);
    throw new Error('URL threat detection service unavailable');
  }
};
