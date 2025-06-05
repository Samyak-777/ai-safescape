
// Gemini 2.5 Flash/Pro API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDBcnmhOWEcYtp2PMFuYvAnisKyXspMMPE';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiResult {
  isHarmful: boolean;
  confidence: number;
  explanation: string;
  categories: string[];
}

export const analyzeContentWithGemini = async (content: string, analysisType: string): Promise<GeminiResult> => {
  try {
    const prompt = `Analyze the following content for ${analysisType}:

Content: "${content}"

Please provide:
1. A boolean indicating if this content is harmful or problematic
2. A confidence score (0-1)
3. A brief explanation of your assessment
4. Categories of potential issues found

Respond in JSON format with fields: isHarmful, confidence, explanation, categories`;

    const response = await fetch(`${GEMINI_BASE_URL}/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isHarmful: parsed.isHarmful || false,
          confidence: parsed.confidence || 0,
          explanation: parsed.explanation || 'Analysis completed',
          categories: parsed.categories || [],
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from Gemini response, using fallback');
    }

    // Fallback: analyze text response
    const isHarmful = text.toLowerCase().includes('harmful') || text.toLowerCase().includes('problematic');
    return {
      isHarmful,
      confidence: isHarmful ? 0.7 : 0.3,
      explanation: text.substring(0, 200) + '...',
      categories: [],
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI content analysis service unavailable');
  }
};
