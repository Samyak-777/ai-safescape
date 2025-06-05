
// Contextual Harm Detection for Self-Harm, Grooming, and Radicalization
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAvsHmUnfT1um4K9aysmuo_jlwl4_8B7xM';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface ContextualHarmResult {
  harmType: 'self_harm' | 'grooming' | 'radicalization' | 'none';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  urgency: 'immediate' | 'urgent' | 'monitor' | 'none';
  indicators: {
    behavioral: string[];
    linguistic: string[];
    contextual: string[];
    temporal: string[];
  };
  interventionRecommendations: string[];
  resourceRecommendations: string[];
  explanation: string;
}

export const detectContextualHarm = async (
  content: string,
  conversationHistory?: string[],
  userProfile?: {
    age?: number;
    vulnerabilityFactors?: string[];
    previousIncidents?: string[];
  }
): Promise<ContextualHarmResult> => {
  try {
    const analysisPrompt = `You are a specialized AI system trained to detect subtle contextual harms that require immediate intervention. Analyze this content for signs of self-harm, grooming, or radicalization.

Content: "${content}"

${conversationHistory ? `Conversation history: ${JSON.stringify(conversationHistory)}` : ''}
${userProfile ? `User context: ${JSON.stringify(userProfile)}` : ''}

CRITICAL HARM TYPES TO DETECT:

1. SELF-HARM INDICATORS:
- Direct or indirect suicidal ideation
- Self-injury references or planning
- Expressions of hopelessness or despair
- Isolation and withdrawal patterns
- Substance abuse mentions
- Eating disorder behaviors

2. GROOMING INDICATORS:
- Age-inappropriate conversations
- Gradual boundary violations
- Isolation tactics
- Gift-giving or special attention
- Secret-keeping requests
- Sexual content introduction
- Location or meeting requests

3. RADICALIZATION INDICATORS:
- Extremist ideology exposure
- Us-vs-them mentality development
- Conspiracy theory adoption
- Violence normalization
- Identity crisis exploitation
- Social isolation encouragement

Look for SUBTLE CUES:
- Metaphorical language
- Coded communications
- Emotional manipulation
- Progressive desensitization
- Trust-building tactics
- Vulnerability exploitation

Provide urgent assessment in JSON format:
{
  "harmType": "self_harm|grooming|radicalization|none",
  "riskLevel": "low|medium|high|critical",
  "confidence": number (0-1),
  "urgency": "immediate|urgent|monitor|none",
  "indicators": {
    "behavioral": ["behavior pattern indicators"],
    "linguistic": ["language pattern indicators"],
    "contextual": ["situational indicators"],
    "temporal": ["time-based patterns"]
  },
  "interventionRecommendations": ["immediate actions needed"],
  "resourceRecommendations": ["support resources to provide"],
  "explanation": "detailed professional assessment"
}

IMPORTANT: This is for user safety. Be thorough but avoid false positives that could cause unnecessary alarm.`;

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
            temperature: 0.05, // Very low temperature for consistent safety analysis
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
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
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
        harmType: 'none',
        riskLevel: 'low',
        confidence: 0,
        urgency: 'none',
        indicators: {
          behavioral: [],
          linguistic: [],
          contextual: [],
          temporal: []
        },
        interventionRecommendations: ['Manual review recommended'],
        resourceRecommendations: [],
        explanation: 'Contextual harm analysis inconclusive'
      };
    }
  } catch (error) {
    console.error('Contextual harm detection error:', error);
    return {
      harmType: 'none',
      riskLevel: 'low',
      confidence: 0,
      urgency: 'none',
      indicators: {
        behavioral: [],
        linguistic: [],
        contextual: [],
        temporal: []
      },
      interventionRecommendations: ['System error - manual review required'],
      resourceRecommendations: [],
      explanation: 'Contextual harm detection service temporarily unavailable'
    };
  }
};
