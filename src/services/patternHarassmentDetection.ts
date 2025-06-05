
// Pattern-based Harassment/Cyberbullying Detection using Gemini AI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAvsHmUnfT1um4K9aysmuo_jlwl4_8B7xM';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface HarassmentPattern {
  patternType: 'repeated_targeting' | 'coordinated_attack' | 'escalating_harassment' | 'sustained_campaign';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  temporalPattern?: {
    frequency: number;
    duration: string;
    escalation: boolean;
  };
}

export interface HarassmentDetectionResult {
  isHarassment: boolean;
  patterns: HarassmentPattern[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  actionRecommendations: string[];
}

export const detectHarassmentPatterns = async (
  content: string,
  userHistory?: string[],
  contextData?: {
    platform: string;
    userRelationship: string;
    previousInteractions: number;
  }
): Promise<HarassmentDetectionResult> => {
  try {
    const analysisPrompt = `You are an expert in cyberbullying and online harassment pattern detection. Analyze the following content for harassment patterns.

Content to analyze: "${content}"

${userHistory ? `Previous user interactions: ${JSON.stringify(userHistory)}` : ''}
${contextData ? `Context: ${JSON.stringify(contextData)}` : ''}

Look for these specific harassment patterns:
1. Repeated targeting - same victim, similar language/themes
2. Coordinated attacks - multiple accounts, synchronized timing
3. Escalating harassment - increasing severity over time
4. Sustained campaigns - persistent harassment over extended periods

Consider these indicators:
- Personal attacks and insults
- Threats or intimidation
- Doxxing attempts or privacy violations
- Identity-based harassment
- Pile-on behaviors
- Manipulation and gaslighting
- Sexual harassment
- Stalking behaviors

Provide analysis in JSON format:
{
  "isHarassment": boolean,
  "patterns": [
    {
      "patternType": "repeated_targeting|coordinated_attack|escalating_harassment|sustained_campaign",
      "severity": "low|medium|high|critical",
      "confidence": number (0-1),
      "indicators": ["specific indicators found"],
      "temporalPattern": {
        "frequency": number,
        "duration": "timespan",
        "escalation": boolean
      }
    }
  ],
  "riskLevel": "low|medium|high|critical",
  "explanation": "detailed explanation of findings",
  "actionRecommendations": ["specific actions to take"]
}`;

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const result = JSON.parse(text);
      return result;
    } catch {
      return {
        isHarassment: false,
        patterns: [],
        riskLevel: 'low',
        explanation: 'Analysis completed but results unclear',
        actionRecommendations: ['Monitor for additional patterns']
      };
    }
  } catch (error) {
    console.error('Harassment pattern detection error:', error);
    return {
      isHarassment: false,
      patterns: [],
      riskLevel: 'low',
      explanation: 'Harassment detection service temporarily unavailable',
      actionRecommendations: ['Manual review recommended']
    };
  }
};
