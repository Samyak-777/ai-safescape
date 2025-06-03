
// Advanced Gemini 2.5 Flash/Pro API integration with Google I/O 2025 features
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDBcnmhOWEcYtp2PMFuYvAnisKyXspMMPE';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiAdvancedResult {
  isHarmful: boolean;
  harmCategories: string[];
  confidence: number;
  explanation: string;
  reasoning: string[];
  contextualFactors: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface GeminiMultimodalResult extends GeminiAdvancedResult {
  imageAnalysis?: {
    hasInappropriateContent: boolean;
    detectedObjects: string[];
    textInImage: string;
  };
}

// Function calling schema for structured analysis
const analysisFunction = {
  name: "analyze_content_structured",
  description: "Analyze content for harmful elements with detailed structured output",
  parameters: {
    type: "object",
    properties: {
      isHarmful: {
        type: "boolean",
        description: "Whether the content contains harmful elements"
      },
      harmCategories: {
        type: "array",
        items: { type: "string" },
        description: "Categories of harm detected"
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence score for the analysis"
      },
      explanation: {
        type: "string",
        description: "Detailed explanation of the analysis"
      },
      reasoning: {
        type: "array",
        items: { type: "string" },
        description: "Step-by-step reasoning process"
      },
      contextualFactors: {
        type: "array",
        items: { type: "string" },
        description: "Contextual factors that influenced the decision"
      },
      riskLevel: {
        type: "string",
        enum: ["low", "medium", "high", "critical"],
        description: "Overall risk level assessment"
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "Recommendations for content handling"
      }
    },
    required: ["isHarmful", "harmCategories", "confidence", "explanation", "reasoning", "riskLevel"]
  }
};

export const analyzeContentWithGeminiAdvanced = async (
  content: string, 
  analysisType: string,
  useStructuredOutput: boolean = true
): Promise<GeminiAdvancedResult> => {
  try {
    const systemPrompt = `You are an advanced AI safety analyst with expertise in ${analysisType}. 
    Analyze the provided content with deep contextual understanding, considering:
    - Cultural and linguistic nuances
    - Intent and context
    - Potential for misinterpretation
    - Severity and immediacy of risk
    - Mitigation strategies`;

    const userPrompt = `Analyze this content for ${analysisType}:\n\n"${content}"`;

    const requestBody: any = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userPrompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
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
    };

    // Use function calling for structured output if requested
    if (useStructuredOutput) {
      requestBody.tools = [{
        functionDeclarations: [analysisFunction]
      }];
      requestBody.toolConfig = {
        functionCallingConfig: {
          mode: "ANY",
          allowedFunctionNames: ["analyze_content_structured"]
        }
      };
    }

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini Advanced API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle function calling response
    if (useStructuredOutput && data.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
      const functionCall = data.candidates[0].content.parts[0].functionCall;
      if (functionCall.name === "analyze_content_structured") {
        return {
          ...functionCall.args,
          contextualFactors: functionCall.args.contextualFactors || [],
          recommendations: functionCall.args.recommendations || []
        };
      }
    }

    // Fallback to text parsing
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const result = JSON.parse(text);
      return {
        isHarmful: result.isHarmful || false,
        harmCategories: result.harmCategories || [],
        confidence: result.confidence || 0,
        explanation: result.explanation || 'Analysis completed',
        reasoning: result.reasoning || [],
        contextualFactors: result.contextualFactors || [],
        riskLevel: result.riskLevel || 'low',
        recommendations: result.recommendations || []
      };
    } catch {
      return {
        isHarmful: false,
        harmCategories: [],
        confidence: 0,
        explanation: 'Unable to parse analysis result',
        reasoning: ['Analysis parsing failed'],
        contextualFactors: [],
        riskLevel: 'low',
        recommendations: ['Retry analysis with different parameters']
      };
    }
  } catch (error) {
    console.error('Gemini Advanced API error:', error);
    throw new Error('Advanced AI content analysis service unavailable');
  }
};

export const analyzeMultimodalContent = async (
  textContent: string,
  imageData?: string,
  analysisType: string = "comprehensive safety analysis"
): Promise<GeminiMultimodalResult> => {
  try {
    const parts: any[] = [];
    
    // Add text content
    if (textContent) {
      parts.push({
        text: `Analyze this content for ${analysisType}:\n\n"${textContent}"`
      });
    }

    // Add image content if provided (base64 encoded)
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      });
      parts.push({
        text: "Also analyze the image for inappropriate content, objects, and any text present."
      });
    }

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini Multimodal API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const result = JSON.parse(text);
      return {
        isHarmful: result.isHarmful || false,
        harmCategories: result.harmCategories || [],
        confidence: result.confidence || 0,
        explanation: result.explanation || 'Multimodal analysis completed',
        reasoning: result.reasoning || [],
        contextualFactors: result.contextualFactors || [],
        riskLevel: result.riskLevel || 'low',
        recommendations: result.recommendations || [],
        imageAnalysis: imageData ? {
          hasInappropriateContent: result.imageAnalysis?.hasInappropriateContent || false,
          detectedObjects: result.imageAnalysis?.detectedObjects || [],
          textInImage: result.imageAnalysis?.textInImage || ''
        } : undefined
      };
    } catch {
      return {
        isHarmful: false,
        harmCategories: [],
        confidence: 0,
        explanation: 'Unable to parse multimodal analysis result',
        reasoning: ['Multimodal analysis parsing failed'],
        contextualFactors: [],
        riskLevel: 'low',
        recommendations: ['Retry analysis with different parameters']
      };
    }
  } catch (error) {
    console.error('Gemini Multimodal API error:', error);
    throw new Error('Advanced multimodal analysis service unavailable');
  }
};

// Real-time streaming analysis for large content
export const streamAnalyzeContent = async (
  content: string,
  analysisType: string,
  onPartialResult: (partial: Partial<GeminiAdvancedResult>) => void
): Promise<GeminiAdvancedResult> => {
  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this content for ${analysisType} and provide streaming updates:\n\n"${content}"`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini Streaming API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    let fullText = '';
    let partialResult: Partial<GeminiAdvancedResult> = {};

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const newText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              fullText += newText;
              
              // Try to parse partial result and notify
              try {
                partialResult = JSON.parse(fullText);
                onPartialResult(partialResult);
              } catch {
                // Not yet complete JSON, continue
              }
            } catch (e) {
              console.warn('Failed to parse streaming chunk:', e);
            }
          }
        }
      }
    }

    // Return final result
    return partialResult as GeminiAdvancedResult;
  } catch (error) {
    console.error('Gemini Streaming API error:', error);
    throw new Error('Streaming analysis service unavailable');
  }
};
