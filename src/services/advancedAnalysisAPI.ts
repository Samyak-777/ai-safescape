
// Advanced Analysis API integrating all new detection features
import { detectHarassmentPatterns } from './patternHarassmentDetection';
import { detectAIGeneratedContent } from './aiContentDetection';
import { detectContextualHarm } from './contextualHarmDetection';
import { detectCoordinatedBehavior } from './coordinatedBehaviorDetection';

export interface AdvancedAnalysisResult {
  type: string;
  status: 'clean' | 'warning' | 'danger' | 'critical';
  message: string;
  confidence: number;
  urgency?: 'immediate' | 'urgent' | 'monitor' | 'none';
  details?: any;
  recommendations?: string[];
}

export const analyzeTextWithAdvancedFeatures = async (
  text: string,
  options: string[],
  context?: {
    userHistory?: string[];
    networkData?: any;
    userProfile?: any;
  }
): Promise<AdvancedAnalysisResult[]> => {
  console.log('Running advanced analysis with features:', options);
  
  const results: AdvancedAnalysisResult[] = [];
  
  try {
    // Pattern-based Harassment Detection
    if (options.includes('harassment-patterns')) {
      const harassmentResult = await detectHarassmentPatterns(
        text,
        context?.userHistory,
        context?.userProfile
      );
      
      results.push({
        type: 'harassment pattern detection',
        status: harassmentResult.isHarassment ? 
          (harassmentResult.riskLevel === 'critical' ? 'critical' : 
           harassmentResult.riskLevel === 'high' ? 'danger' : 'warning') : 'clean',
        message: harassmentResult.explanation,
        confidence: harassmentResult.patterns.length > 0 ? 
          Math.max(...harassmentResult.patterns.map(p => p.confidence)) : 0.9,
        details: harassmentResult,
        recommendations: harassmentResult.actionRecommendations,
        urgency: harassmentResult.riskLevel === 'critical' ? 'immediate' : 
                harassmentResult.riskLevel === 'high' ? 'urgent' : 'monitor'
      });
    }

    // AI-Generated Content Detection
    if (options.includes('ai-content-detection')) {
      const aiContentResult = await detectAIGeneratedContent(text);
      
      results.push({
        type: 'AI content detection',
        status: aiContentResult.isAIGenerated ? 
          (aiContentResult.confidence > 0.8 ? 'danger' : 'warning') : 'clean',
        message: aiContentResult.isAIGenerated ? 
          `AI-generated content detected (${aiContentResult.detectedModel || 'unknown model'})` :
          'Content appears to be human-generated',
        confidence: aiContentResult.confidence,
        details: aiContentResult
      });
    }

    // Contextual Harm Detection
    if (options.includes('contextual-harm')) {
      const contextualResult = await detectContextualHarm(
        text,
        context?.userHistory,
        context?.userProfile
      );
      
      results.push({
        type: 'contextual harm detection',
        status: contextualResult.harmType !== 'none' ? 
          (contextualResult.riskLevel === 'critical' ? 'critical' :
           contextualResult.riskLevel === 'high' ? 'danger' : 'warning') : 'clean',
        message: contextualResult.explanation,
        confidence: contextualResult.confidence,
        urgency: contextualResult.urgency,
        details: contextualResult,
        recommendations: contextualResult.interventionRecommendations
      });
    }

    // Coordinated Behavior Detection
    if (options.includes('coordinated-behavior')) {
      const coordinatedResult = await detectCoordinatedBehavior(
        text,
        context?.networkData
      );
      
      results.push({
        type: 'coordinated behavior detection',
        status: coordinatedResult.isCoordinated ? 
          (coordinatedResult.threatLevel === 'critical' ? 'critical' :
           coordinatedResult.threatLevel === 'high' ? 'danger' : 'warning') : 'clean',
        message: coordinatedResult.explanation,
        confidence: coordinatedResult.confidence,
        details: coordinatedResult,
        recommendations: coordinatedResult.mitigation,
        urgency: coordinatedResult.threatLevel === 'critical' ? 'immediate' : 'monitor'
      });
    }

    return results;
  } catch (error) {
    console.error('Advanced analysis error:', error);
    return [{
      type: 'advanced analysis',
      status: 'warning',
      message: 'Some advanced analysis features temporarily unavailable',
      confidence: 0,
    }];
  }
};

// New analysis options for the UI
export const advancedAnalysisOptions = [
  {
    id: 'harassment-patterns',
    label: 'Harassment Patterns',
    icon: 'UserX',
    description: 'Detect coordinated harassment and cyberbullying patterns'
  },
  {
    id: 'ai-content-detection',
    label: 'AI Content Detection',
    icon: 'Bot',
    description: 'Identify AI-generated text and deepfake content'
  },
  {
    id: 'contextual-harm',
    label: 'Contextual Harm',
    icon: 'Heart',
    description: 'Detect self-harm, grooming, and radicalization indicators'
  },
  {
    id: 'coordinated-behavior',
    label: 'Coordinated Networks',
    icon: 'Network',
    description: 'Identify bot networks and inauthentic behavior'
  }
];
