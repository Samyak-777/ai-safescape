
// Advanced Gemini 3 Flash/Pro API integration with Google I/O 2025 features
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBGYfToFI7spphZQ7VgEGxdLKstZjbUh1g';
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
    - Mitigation strategies
    
    You are specifically trained for AI-SafeScape platform to protect users from online harms.`;

    const userPrompt = `Analyze this content for ${analysisType}:\n\n"${content}"`;

    const requestBody: any = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userPrompt}`
        }]
      }],
      generationConfig: {
        temperature: 1.0,
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
      `${GEMINI_BASE_URL}/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Check if it's an API not enabled error
      if (response.status === 403 && errorData?.error?.message?.includes('has not been used in project')) {
        console.warn('Gemini API not enabled, providing fallback analysis');
        return createFallbackAnalysis(content, analysisType);
      }
      
      throw new Error(`Gemini Advanced API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
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
      return createFallbackAnalysis(content, analysisType);
    }
  } catch (error) {
    console.error('Gemini Advanced API error:', error);
    
    // Provide fallback analysis instead of throwing
    return createFallbackAnalysis(content, analysisType);
  }
};

// Fallback analysis when Gemini API is unavailable
const createFallbackAnalysis = (content: string, analysisType: string): GeminiAdvancedResult => {
  // Basic pattern-based analysis as fallback
  const lowerContent = content.toLowerCase();
  
  let isHarmful = false;
  let harmCategories: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let confidence = 0.3; // Lower confidence for fallback analysis
  
  // Basic pattern detection based on analysis type
  if (analysisType.includes('profanity') || analysisType.includes('toxicity')) {
    const profanityPatterns = ['damn', 'hell', 'stupid', 'idiot', 'hate'];
    const matches = profanityPatterns.filter(pattern => lowerContent.includes(pattern));
    if (matches.length > 0) {
      isHarmful = true;
      harmCategories.push('potentially inappropriate language');
      riskLevel = matches.length > 2 ? 'medium' : 'low';
    }
  }
  
  if (analysisType.includes('misinformation') || analysisType.includes('fact')) {
    const suspiciousPatterns = ['secret', 'government conspiracy', 'they don\'t want you to know'];
    const matches = suspiciousPatterns.filter(pattern => lowerContent.includes(pattern));
    if (matches.length > 0) {
      isHarmful = true;
      harmCategories.push('potential misinformation indicators');
      riskLevel = 'medium';
    }
  }
  
  if (analysisType.includes('bias') || analysisType.includes('discrimination')) {
    // Very basic bias detection
    if (lowerContent.includes('all ') || lowerContent.includes('never ') || lowerContent.includes('always ')) {
      harmCategories.push('potential overgeneralization');
      riskLevel = 'low';
    }
  }
  
  return {
    isHarmful,
    harmCategories,
    confidence,
    explanation: `Fallback analysis completed for ${analysisType}. Advanced AI analysis temporarily unavailable - please enable the Generative Language API in your Google Cloud project for more accurate results.`,
    reasoning: [
      'Basic pattern matching performed as fallback',
      'Limited analysis due to API unavailability',
      'Results may not reflect full content context'
    ],
    contextualFactors: ['API service temporarily unavailable'],
    riskLevel,
    recommendations: [
      'Enable Generative Language API for comprehensive analysis',
      'Consider manual review for important content',
      'Use additional verification methods when possible'
    ]
  };
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
