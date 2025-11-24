
// Comprehensive Image Analysis Service
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBGYfToFI7spphZQ7VgEGxdLKstZjbUh1g';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface ComprehensiveImageReport {
  imageStructure: {
    dimensions: string;
    format: string;
    colorProfile: string;
    composition: string;
    visualElements: string[];
    technicalQuality: string;
  };
  manipulationAnalysis: {
    isManipulated: boolean;
    manipulationType: string;
    confidence: number;
    indicators: string[];
    detailedExplanation: string;
  };
  contentSafety: {
    isInappropriate: boolean;
    categories: string[];
    severity: string;
    confidence: number;
    explanation: string;
  };
  textExtraction: {
    hasText: boolean;
    extractedText: string;
    textAnalysis: string;
    language: string;
    textQuality: string;
  };
  contextualAnalysis: {
    imageType: string;
    primarySubject: string;
    setting: string;
    mood: string;
    purpose: string;
  };
  overallAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    recommendations: string[];
    trustScore: number;
  };
}

const prepareImageData = (imageData: string): string => {
  if (imageData.startsWith('data:image/')) {
    return imageData.split(',')[1];
  }
  return imageData;
};

export const performComprehensiveImageAnalysis = async (imageData: string): Promise<ComprehensiveImageReport> => {
  try {
    const base64Data = prepareImageData(imageData);
    
    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Perform a comprehensive, in-depth analysis of this image. Provide detailed insights across multiple dimensions:

1. IMAGE STRUCTURE & TECHNICAL ANALYSIS:
   - Analyze image dimensions, format, and color profile
   - Evaluate composition, visual elements, and technical quality
   - Identify artistic/photographic techniques used

2. MANIPULATION DETECTION:
   - Check for digital manipulation, editing, or AI generation
   - Look for: inconsistent lighting/shadows, pixel artifacts, copy-paste signs, deepfake indicators, AI-generated markers, Photoshop artifacts, compression inconsistencies
   - Provide specific indicators and confidence level

3. CONTENT SAFETY:
   - Screen for: nudity/sexual content, violence/graphic content, hate symbols, harassment indicators, illegal activities, self-harm content, inappropriate content involving minors
   - Categorize and rate severity

4. TEXT EXTRACTION & ANALYSIS:
   - Extract all visible text from the image
   - Analyze text for: inappropriate language, misinformation, scam indicators, hate speech, spam
   - Determine language and text quality

5. CONTEXTUAL ANALYSIS:
   - Identify image type (photo/illustration/screenshot/meme/etc.)
   - Describe primary subject, setting, mood, and apparent purpose
   
6. OVERALL ASSESSMENT:
   - Provide risk level (low/medium/high/critical)
   - Generate summary and actionable recommendations
   - Calculate trust score (0-100)

Return your analysis in this EXACT JSON format:
{
  "imageStructure": {
    "dimensions": "estimated dimensions",
    "format": "detected format",
    "colorProfile": "color analysis",
    "composition": "composition description",
    "visualElements": ["element1", "element2"],
    "technicalQuality": "quality assessment"
  },
  "manipulationAnalysis": {
    "isManipulated": boolean,
    "manipulationType": "none/photoshop/ai-generated/deepfake/copy-paste",
    "confidence": 0.0-1.0,
    "indicators": ["indicator1", "indicator2"],
    "detailedExplanation": "detailed explanation"
  },
  "contentSafety": {
    "isInappropriate": boolean,
    "categories": ["category1", "category2"],
    "severity": "none/low/medium/high",
    "confidence": 0.0-1.0,
    "explanation": "safety explanation"
  },
  "textExtraction": {
    "hasText": boolean,
    "extractedText": "all visible text",
    "textAnalysis": "text content analysis",
    "language": "detected language",
    "textQuality": "quality assessment"
  },
  "contextualAnalysis": {
    "imageType": "photo/illustration/screenshot/meme/other",
    "primarySubject": "main subject description",
    "setting": "setting/environment description",
    "mood": "mood/tone description",
    "purpose": "apparent purpose"
  },
  "overallAssessment": {
    "riskLevel": "low/medium/high/critical",
    "summary": "comprehensive summary",
    "recommendations": ["recommendation1", "recommendation2"],
    "trustScore": 0-100
  }
}`
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4000,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
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
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanedText);
      return result;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Return a fallback report
      return createFallbackReport();
    }
  } catch (error) {
    console.error('Comprehensive image analysis error:', error);
    throw error;
  }
};

const createFallbackReport = (): ComprehensiveImageReport => {
  return {
    imageStructure: {
      dimensions: "Unable to determine",
      format: "Unknown",
      colorProfile: "Unable to analyze",
      composition: "Analysis unavailable",
      visualElements: [],
      technicalQuality: "Unable to assess"
    },
    manipulationAnalysis: {
      isManipulated: false,
      manipulationType: "none",
      confidence: 0.5,
      indicators: [],
      detailedExplanation: "Analysis service temporarily unavailable"
    },
    contentSafety: {
      isInappropriate: false,
      categories: [],
      severity: "none",
      confidence: 0.5,
      explanation: "Safety check could not be completed"
    },
    textExtraction: {
      hasText: false,
      extractedText: "",
      textAnalysis: "Text extraction unavailable",
      language: "Unknown",
      textQuality: "Unable to assess"
    },
    contextualAnalysis: {
      imageType: "unknown",
      primarySubject: "Unable to determine",
      setting: "Unable to determine",
      mood: "Unable to determine",
      purpose: "Unable to determine"
    },
    overallAssessment: {
      riskLevel: "medium",
      summary: "Image analysis service is temporarily unavailable. Please try again later.",
      recommendations: ["Retry analysis when service is available"],
      trustScore: 50
    }
  };
};
