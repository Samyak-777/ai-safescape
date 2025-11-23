
// Personalized AI Assistant using Gemini 3 Pro for intelligent recommendations
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBGYfToFI7spphZQ7VgEGxdLKstZjbUh1g';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface AssistantRecommendation {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  summary: string;
  detailedAnalysis: string;
  actionSteps: string[];
  preventionTips: string[];
  resources: {
    title: string;
    url?: string;
    description: string;
  }[];
  urgencyLevel: 'immediate' | 'soon' | 'when_convenient';
  estimatedTime: string;
}

export interface PersonalizedAssistantResult {
  overallRiskAssessment: string;
  priorityActions: string[];
  recommendations: AssistantRecommendation[];
  learningInsights: string[];
  followUpSuggestions: string[];
}

const generatePersonalizedRecommendations = async (
  analysisResults: any[],
  userContext?: {
    previousAnalyses?: any[];
    userType?: 'individual' | 'business' | 'educator';
    riskTolerance?: 'low' | 'medium' | 'high';
  }
): Promise<PersonalizedAssistantResult> => {
  try {
    const contextPrompt = `You are an expert AI-SafeScape assistant specifically trained to help users who have encountered online harms. You provide empathetic, actionable guidance while maintaining user safety and well-being.

Your core responsibilities:
- Analyze detected online harms with deep understanding
- Provide immediate safety recommendations
- Offer emotional support and coping strategies
- Guide users to appropriate resources (mental health, legal aid, safety organizations)
- Explain the nature of threats in understandable terms
- Suggest evidence collection and reporting procedures

IMPORTANT: Do NOT include any dates, timestamps, or time references in your response. Focus on timeless guidance and support.

User Context:
- Platform: AI-SafeScape (content safety and harm detection)
- User Type: ${userContext?.userType || 'individual'}
- Risk Tolerance: ${userContext?.riskTolerance || 'medium'}
- Previous Analyses: ${userContext?.previousAnalyses?.length || 0} past analyses

Analysis Results to Review:
${JSON.stringify(analysisResults, null, 2)}

Please provide personalized guidance that includes:
1. Clear explanation of detected harms in empathetic language
2. Immediate safety actions the user should take
3. Detailed recommendations for each specific issue
4. Coping strategies and emotional support guidance
5. Resources for further help (mental health, legal, safety organizations)
6. Evidence preservation and reporting guidance

IMPORTANT: Always maintain an empathetic, supportive tone. Acknowledge the user's experience and validate their concerns. Do not include any dates or timestamps in your response.

Format your response as valid JSON with this structure:
{
  "overallRiskAssessment": "Empathetic explanation of the situation without any date references",
  "priorityActions": ["Immediate safety action 1", "Immediate safety action 2"],
  "recommendations": [
    {
      "severity": "high",
      "category": "Category name",
      "summary": "Brief, supportive summary",
      "detailedAnalysis": "Detailed, empathetic explanation",
      "actionSteps": ["Step 1", "Step 2"],
      "preventionTips": ["Prevention tip 1", "Prevention tip 2"],
      "resources": [{"title": "Resource", "description": "Description", "url": "https://example.com"}],
      "urgencyLevel": "immediate",
      "estimatedTime": "5-10 minutes"
    }
  ],
  "learningInsights": ["Insight 1", "Insight 2"],
  "followUpSuggestions": ["Follow-up suggestion 1", "Follow-up suggestion 2"]
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
              text: contextPrompt
            }]
          }],
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 2000,
            candidateCount: 1,
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
      return {
        overallRiskAssessment: result.overallRiskAssessment || 'Analysis completed successfully',
        priorityActions: result.priorityActions || [],
        recommendations: result.recommendations || [],
        learningInsights: result.learningInsights || [],
        followUpSuggestions: result.followUpSuggestions || []
      };
    } catch (parseError) {
      console.warn('Failed to parse assistant response, using fallback');
      return generateFallbackRecommendations(analysisResults);
    }
  } catch (error) {
    console.error('Personalized assistant error:', error);
    return generateFallbackRecommendations(analysisResults);
  }
};

const generateFallbackRecommendations = (analysisResults: any[]): PersonalizedAssistantResult => {
  const threats = analysisResults.filter(r => r.status === 'danger');
  const warnings = analysisResults.filter(r => r.status === 'warning');
  
  return {
    overallRiskAssessment: threats.length > 0 ? 
      `High risk detected: ${threats.length} critical issue(s) found` :
      warnings.length > 0 ? 
        `Medium risk: ${warnings.length} warning(s) require attention` :
        'Low risk: Content appears safe',
    priorityActions: threats.length > 0 ? [
      'Do not click any suspicious links',
      'Verify sender authenticity through alternative channels',
      'Report suspicious content to appropriate authorities'
    ] : ['Continue with normal caution'],
    recommendations: [],
    learningInsights: [
      'Always verify suspicious links before clicking',
      'Be cautious of urgent language and pressure tactics',
      'Check sender authenticity through multiple channels'
    ],
    followUpSuggestions: [
      'Regular security awareness training',
      'Keep software and browsers updated',
      'Use strong, unique passwords'
    ]
  };
};

export const getPersonalizedRecommendations = async (
  analysisResults: any[],
  userContext?: any
): Promise<PersonalizedAssistantResult> => {
  return generatePersonalizedRecommendations(analysisResults, userContext);
};

export const generateSecurityReport = async (
  analysisResults: any[],
  recommendations: PersonalizedAssistantResult
): Promise<string> => {
  try {
    const reportPrompt = `Generate a concise security report based on this analysis. 

IMPORTANT: Do NOT include any dates, timestamps, creation dates, or time references in the report.

Analysis Results: ${JSON.stringify(analysisResults, null, 2)}
Recommendations: ${JSON.stringify(recommendations, null, 2)}

Create a brief, professional security report (max 500 words) that:
1. Summarizes findings clearly without any date references
2. Highlights key risks
3. Provides actionable next steps
4. Uses non-technical language when possible
5. Focuses on timeless security guidance

Do not include any dates, timestamps, or time-based references in the report.`;

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
              text: reportPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Report generation failed';
  } catch (error) {
    console.error('Security report generation error:', error);
    return 'Unable to generate security report at this time.';
  }
};
