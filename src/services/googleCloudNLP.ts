
// Google Cloud Natural Language API integration
const GOOGLE_NLP_API_KEY = import.meta.env.VITE_GOOGLE_NLP_API_KEY || 'your api key here';
const GOOGLE_NLP_BASE_URL = 'https://language.googleapis.com/v2';

export interface NLPModerationResult {
  categories: Array<{
    name: string;
    confidence: number;
  }>;
  confidence: number;
}

export interface NLPSentimentResult {
  sentiment: {
    magnitude: number;
    score: number;
  };
}

export const moderateTextWithGoogleNLP = async (text: string): Promise<NLPModerationResult> => {
  try {
    const response = await fetch(`${GOOGLE_NLP_BASE_URL}/documents:moderateText?key=${GOOGLE_NLP_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google NLP API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return {
      categories: data.moderationCategories || [],
      confidence: data.moderationCategories?.[0]?.confidence || 0,
    };
  } catch (error) {
    console.error('Google NLP moderation error:', error);
    throw new Error('Text moderation service unavailable');
  }
};

export const analyzeSentimentWithGoogleNLP = async (text: string): Promise<NLPSentimentResult> => {
  try {
    const response = await fetch(`${GOOGLE_NLP_BASE_URL}/documents:analyzeSentiment?key=${GOOGLE_NLP_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google NLP API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return {
      sentiment: data.documentSentiment || { magnitude: 0, score: 0 },
    };
  } catch (error) {
    console.error('Google NLP sentiment analysis error:', error);
    throw new Error('Sentiment analysis service unavailable');
  }
};
