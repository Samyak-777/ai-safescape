
// Google Jigsaw Perspective API integration
const PERSPECTIVE_API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY || 'your api key here';
const PERSPECTIVE_BASE_URL = 'https://commentanalyzer.googleapis.com/v1alpha1';

export interface PerspectiveResult {
  toxicity: number;
  severeToxicity: number;
  identityAttack: number;
  insult: number;
  profanity: number;
  threat: number;
}

export const analyzeToxicityWithPerspective = async (text: string): Promise<PerspectiveResult> => {
  try {
    const response = await fetch(`${PERSPECTIVE_BASE_URL}/comments:analyze?key=${PERSPECTIVE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text },
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          IDENTITY_ATTACK: {},
          INSULT: {},
          PROFANITY: {},
          THREAT: {},
        },
        doNotStore: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perspective API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const scores = data.attributeScores;

    return {
      toxicity: scores.TOXICITY?.summaryScore?.value || 0,
      severeToxicity: scores.SEVERE_TOXICITY?.summaryScore?.value || 0,
      identityAttack: scores.IDENTITY_ATTACK?.summaryScore?.value || 0,
      insult: scores.INSULT?.summaryScore?.value || 0,
      profanity: scores.PROFANITY?.summaryScore?.value || 0,
      threat: scores.THREAT?.summaryScore?.value || 0,
    };
  } catch (error) {
    console.error('Perspective API error:', error);
    throw new Error('Toxicity analysis service unavailable');
  }
};
