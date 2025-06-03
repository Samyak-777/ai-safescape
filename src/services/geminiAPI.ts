
// Gemini 2.5 Flash/Pro API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDBcnmhOWEcYtp2PMFuYvAnisKyXspMMPE';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiAnalysisResult {
  isHarmful: boolean;
  harmCategories: string[];
  confidence: number;
  explanation: string;
}

export const analyzeContentWithGemini = async (content: string, analysisType: string): Promise<GeminiAnalysisResult> => {
  try {
    const prompt = `Analyze the following content for ${analysisType}. Respond with a JSON object containing: isHarmful (boolean), harmCategories (array of strings), confidence (number 0-1), explanation (string).

Content: "${content}"`;

    const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const result = JSON.parse(text);
      return {
        isHarmful: result.isHarmful || false,
        harmCategories: result.harmCategories || [],
        confidence: result.confidence || 0,
        explanation: result.explanation || 'Analysis completed',
      };
    } catch {
      return {
        isHarmful: false,
        harmCategories: [],
        confidence: 0,
        explanation: 'Unable to parse analysis result',
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI content analysis service unavailable');
  }
};
