
// Coordinated Inauthentic Behavior (CIB) Detection using Network Analysis
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBGYfToFI7spphZQ7VgEGxdLKstZjbUh1g';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface NetworkBehaviorPattern {
  patternType: 'bot_network' | 'coordinated_amplification' | 'astroturfing' | 'sockpuppet_farm';
  networkSize: number;
  coordinationLevel: 'low' | 'medium' | 'high';
  confidence: number;
  indicators: string[];
}

export interface CIBDetectionResult {
  isCoordinated: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  networkPatterns: NetworkBehaviorPattern[];
  campaignType?: 'misinformation' | 'harassment' | 'manipulation' | 'spam';
  confidence: number;
  indicators: {
    temporal: string[];
    content: string[];
    behavioral: string[];
    network: string[];
  };
  explanation: string;
  mitigation: string[];
}

export const detectCoordinatedBehavior = async (
  content: string,
  networkData?: {
    userIds: string[];
    timestamps: number[];
    similarContent: string[];
    interactionPatterns: any[];
  }
): Promise<CIBDetectionResult> => {
  try {
    const analysisPrompt = `You are an expert in detecting coordinated inauthentic behavior and bot networks. Analyze the following data for signs of coordinated manipulation campaigns.

Content: "${content}"

${networkData ? `Network Data: ${JSON.stringify(networkData)}` : ''}

DETECTION FOCUS AREAS:

1. BOT NETWORK INDICATORS:
- Identical or near-identical content
- Synchronized posting times
- Similar account creation patterns
- Automated behavior signatures
- Unnatural engagement patterns

2. COORDINATED AMPLIFICATION:
- Rapid content spread across multiple accounts
- Artificial trending attempts
- Cross-platform coordination
- Vote/engagement manipulation
- Strategic timing patterns

3. ASTROTURFING CAMPAIGNS:
- Fake grassroots movements
- Manufactured consensus
- False flag operations
- Opinion manipulation
- Sponsored inauthentic content

4. SOCKPUPPET FARMS:
- Multiple personas from same operator
- Shared linguistic patterns
- Similar posting schedules
- Cross-account interactions
- Identity deception

ANALYZE FOR:
- Content similarity metrics
- Temporal coordination patterns
- Account behavior anomalies
- Network topology signatures
- Linguistic fingerprints
- Engagement manipulation
- Platform-specific indicators

Provide detailed assessment in JSON format:
{
  "isCoordinated": boolean,
  "threatLevel": "low|medium|high|critical",
  "networkPatterns": [
    {
      "patternType": "bot_network|coordinated_amplification|astroturfing|sockpuppet_farm",
      "networkSize": number,
      "coordinationLevel": "low|medium|high",
      "confidence": number (0-1),
      "indicators": ["specific indicators found"]
    }
  ],
  "campaignType": "misinformation|harassment|manipulation|spam",
  "confidence": number (0-1),
  "indicators": {
    "temporal": ["time-based patterns"],
    "content": ["content similarity patterns"],
    "behavioral": ["behavior patterns"],
    "network": ["network structure patterns"]
  },
  "explanation": "detailed analysis of coordination evidence",
  "mitigation": ["recommended countermeasures"]
}`;

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
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
            temperature: 1.0,
            maxOutputTokens: 1500,
          },
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
        isCoordinated: false,
        threatLevel: 'low',
        networkPatterns: [],
        confidence: 0,
        indicators: {
          temporal: [],
          content: [],
          behavioral: [],
          network: []
        },
        explanation: 'Coordinated behavior analysis inconclusive',
        mitigation: ['Continue monitoring for patterns']
      };
    }
  } catch (error) {
    console.error('Coordinated behavior detection error:', error);
    return {
      isCoordinated: false,
      threatLevel: 'low',
      networkPatterns: [],
      confidence: 0,
      indicators: {
        temporal: [],
        content: [],
        behavioral: [],
        network: []
      },
      explanation: 'Coordinated behavior detection service temporarily unavailable',
      mitigation: ['Manual investigation recommended']
    };
  }
};
