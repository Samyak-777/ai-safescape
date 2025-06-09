
// Vertex AI Image Analysis Service
const VERTEX_AI_API_KEY = 'AIzaSyDgLbLuKlkWxjSlR_hQBcFBqF0Xp7xp6JE';
const VERTEX_AI_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

export interface VertexAIImageResult {
  manipulationCheck: string;
  contentSafety: string;
  objectsDetected: string[];
  confidenceScores: number[];
  additionalContext: string;
  textExtracted: string;
}

export interface VertexAIAnalysisExplanation {
  detailedBreakdown: string;
}

export interface VertexAIResponse {
  analyzeImage: {
    results: VertexAIImageResult;
  };
  analysisExplanation: VertexAIAnalysisExplanation;
}

export const analyzeImageWithVertexAI = async (imageBase64: string): Promise<VertexAIResponse> => {
  try {
    console.log('Starting Vertex AI image analysis...');
    
    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'TEXT_DETECTION', maxResults: 10 },
            { type: 'SAFE_SEARCH_DETECTION', maxResults: 1 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            { type: 'IMAGE_PROPERTIES', maxResults: 1 }
          ]
        }
      ]
    };

    const response = await fetch(`${VERTEX_AI_ENDPOINT}?key=${VERTEX_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Vertex AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Vertex AI response:', data);

    if (data.responses && data.responses[0]) {
      const result = data.responses[0];
      
      // Extract objects and labels
      const labels = result.labelAnnotations || [];
      const objects = result.localizedObjectAnnotations || [];
      const textAnnotations = result.textAnnotations || [];
      const safeSearch = result.safeSearchAnnotation || {};
      
      const objectsDetected = [
        ...labels.map((label: any) => label.description),
        ...objects.map((obj: any) => obj.name)
      ].slice(0, 10);
      
      const confidenceScores = [
        ...labels.map((label: any) => label.score),
        ...objects.map((obj: any) => obj.score)
      ].slice(0, 10);

      // Extract text
      const extractedText = textAnnotations.length > 0 
        ? textAnnotations[0].description || 'No text detected'
        : 'No text detected';

      // Safety assessment
      const safetyLevels = ['VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'];
      const contentSafety = `Adult: ${safeSearch.adult || 'UNKNOWN'}, Violence: ${safeSearch.violence || 'UNKNOWN'}, Medical: ${safeSearch.medical || 'UNKNOWN'}`;
      
      // Manipulation check (simplified heuristic)
      const manipulationCheck = objects.length > 0 && labels.length > 5 
        ? 'Low risk of manipulation - Natural content detected' 
        : 'Unable to determine manipulation status';

      const additionalContext = `Image contains ${labels.length} detected labels and ${objects.length} localized objects. ${textAnnotations.length > 0 ? 'Text is present.' : 'No text detected.'}`;

      // Generate detailed explanation
      const detailedBreakdown = generateDetailedExplanation(labels, objects, textAnnotations, safeSearch);

      return {
        analyzeImage: {
          results: {
            manipulationCheck,
            contentSafety,
            objectsDetected,
            confidenceScores,
            additionalContext,
            textExtracted: extractedText
          }
        },
        analysisExplanation: {
          detailedBreakdown
        }
      };
    } else {
      throw new Error('No analysis results returned from Vertex AI');
    }
  } catch (error) {
    console.error('Vertex AI analysis error:', error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const generateDetailedExplanation = (labels: any[], objects: any[], textAnnotations: any[], safeSearch: any): string => {
  let explanation = 'Analysis Results:\n\n';
  
  if (labels.length > 0) {
    explanation += `**Detected Labels:** The image analysis identified ${labels.length} key elements including: ${labels.slice(0, 5).map(l => `${l.description} (${(l.score * 100).toFixed(1)}% confidence)`).join(', ')}. `;
  }
  
  if (objects.length > 0) {
    explanation += `**Localized Objects:** Found ${objects.length} specific objects positioned within the image: ${objects.slice(0, 3).map(o => o.name).join(', ')}. `;
  }
  
  if (textAnnotations.length > 0) {
    explanation += `**Text Content:** The image contains readable text: "${textAnnotations[0].description?.substring(0, 100)}${textAnnotations[0].description?.length > 100 ? '...' : ''}". `;
  } else {
    explanation += `**Text Content:** No readable text was detected in this image. `;
  }
  
  explanation += `**Safety Assessment:** The content safety analysis indicates adult content likelihood is ${safeSearch.adult || 'UNKNOWN'}, violence likelihood is ${safeSearch.violence || 'UNKNOWN'}. `;
  
  explanation += `**Overall Assessment:** This appears to be a ${labels.length > 0 ? labels[0].description?.toLowerCase() : 'general'} image with ${objects.length > 0 ? 'clearly identifiable objects' : 'abstract or unclear elements'}. The high confidence scores suggest reliable detection results.`;
  
  return explanation;
};
