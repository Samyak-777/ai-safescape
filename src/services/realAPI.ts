
// Real API integration service replacing mock APIs
import { moderateTextWithGoogleNLP, analyzeSentimentWithGoogleNLP } from './googleCloudNLP';
import { analyzeToxicityWithPerspective } from './perspectiveAPI';
import { checkUrlWithWebRisk } from './webRiskAPI';
import { checkUrlWithIPQS } from './ipqsAPI';
import { checkPhishingWithArya } from './aryaAPI';
import { analyzeContentWithGemini } from './geminiAPI';
import { detectASCIIPatterns } from './asciiDetection';

export interface AnalysisResult {
  type: string;
  status: 'clean' | 'warning' | 'danger';
  message: string;
  confidence?: number;
  details?: any;
}

// Extract URLs from text for URL-based analysis
const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

const analyzeProfanityReal = async (text: string): Promise<AnalysisResult> => {
  try {
    // Use both Google NLP and Perspective API for comprehensive profanity detection
    const [nlpResult, perspectiveResult] = await Promise.all([
      moderateTextWithGoogleNLP(text).catch(() => null),
      analyzeToxicityWithPerspective(text).catch(() => null),
    ]);

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No inappropriate language detected';
    let confidence = 0;

    if (perspectiveResult) {
      const maxToxicity = Math.max(
        perspectiveResult.toxicity,
        perspectiveResult.profanity,
        perspectiveResult.insult
      );
      
      if (maxToxicity > 0.7) {
        status = 'danger';
        message = 'High levels of inappropriate language detected';
        confidence = maxToxicity;
      } else if (maxToxicity > 0.4) {
        status = 'warning';
        message = 'Potentially inappropriate language detected';
        confidence = maxToxicity;
      } else {
        confidence = 1 - maxToxicity;
      }
    }

    if (nlpResult && nlpResult.categories.length > 0) {
      const harmfulCategories = nlpResult.categories.filter(cat => 
        cat.name.includes('Toxic') || cat.name.includes('Profanity')
      );
      if (harmfulCategories.length > 0) {
        status = status === 'clean' ? 'warning' : status;
        message = `Detected: ${harmfulCategories.map(c => c.name).join(', ')}`;
      }
    }

    return {
      type: 'profanity check',
      status,
      message,
      confidence,
      details: { nlpResult, perspectiveResult },
    };
  } catch (error) {
    console.error('Profanity analysis error:', error);
    return {
      type: 'profanity check',
      status: 'clean',
      message: 'Profanity check service temporarily unavailable',
    };
  }
};

const analyzeFactCheckReal = async (text: string): Promise<AnalysisResult> => {
  try {
    // Use Gemini for fact-checking with its grounding capabilities
    const result = await analyzeContentWithGemini(text, 'fact-checking and misinformation');

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No factual inaccuracies detected';

    if (result.isHarmful) {
      if (result.confidence > 0.7) {
        status = 'danger';
        message = 'Potential misinformation detected';
      } else if (result.confidence > 0.4) {
        status = 'warning';
        message = 'Claims may need verification';
      }
    }

    return {
      type: 'fact check',
      status,
      message: result.explanation || message,
      confidence: result.confidence,
      details: result,
    };
  } catch (error) {
    console.error('Fact check error:', error);
    return {
      type: 'fact check',
      status: 'clean',
      message: 'Fact-checking service temporarily unavailable',
    };
  }
};

const analyzeScamReal = async (text: string): Promise<AnalysisResult> => {
  try {
    const urls = extractUrls(text);
    const promises: Promise<any>[] = [];

    // Check URLs with multiple services
    if (urls.length > 0) {
      promises.push(
        Promise.all(urls.map(url => checkUrlWithWebRisk(url).catch(() => null))),
        Promise.all(urls.map(url => checkUrlWithIPQS(url).catch(() => null))),
        Promise.all(urls.map(url => checkPhishingWithArya(url).catch(() => null)))
      );
    }

    // Analyze text content with Gemini
    promises.push(analyzeContentWithGemini(text, 'scam, phishing, and fraud detection'));

    const results = await Promise.all(promises);
    const [webRiskResults, ipqsResults, aryaResults, geminiResult] = results;

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No scam indicators detected';
    let maxConfidence = 0;

    // Analyze URL results
    if (webRiskResults && webRiskResults.some((r: any) => r?.isThreat)) {
      status = 'danger';
      message = 'Malicious URLs detected';
      maxConfidence = 0.9;
    } else if (ipqsResults && ipqsResults.some((r: any) => r?.isSuspicious)) {
      status = 'warning';
      message = 'Suspicious URLs detected';
      maxConfidence = 0.7;
    } else if (aryaResults && aryaResults.some((r: any) => r?.isPhishing)) {
      status = 'danger';
      message = 'Phishing URLs detected';
      maxConfidence = 0.8;
    }

    // Analyze text content
    if (geminiResult && geminiResult.isHarmful) {
      const newStatus = geminiResult.confidence > 0.7 ? 'danger' : 'warning';
      if (status === 'clean' || (status === 'warning' && newStatus === 'danger')) {
        status = newStatus;
        message = geminiResult.explanation;
        maxConfidence = Math.max(maxConfidence, geminiResult.confidence);
      }
    }

    return {
      type: 'scam detection',
      status,
      message,
      confidence: maxConfidence,
      details: { webRiskResults, ipqsResults, aryaResults, geminiResult },
    };
  } catch (error) {
    console.error('Scam detection error:', error);
    return {
      type: 'scam detection',
      status: 'clean',
      message: 'Scam detection service temporarily unavailable',
    };
  }
};

const analyzeEthicsReal = async (text: string): Promise<AnalysisResult> => {
  try {
    const [perspectiveResult, geminiResult] = await Promise.all([
      analyzeToxicityWithPerspective(text).catch(() => null),
      analyzeContentWithGemini(text, 'ethical violations, hate speech, and harmful content').catch(() => null),
    ]);

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No ethical concerns detected';
    let confidence = 0;

    if (perspectiveResult) {
      const ethicalIssues = Math.max(
        perspectiveResult.identityAttack,
        perspectiveResult.threat,
        perspectiveResult.severeToxicity
      );

      if (ethicalIssues > 0.7) {
        status = 'danger';
        message = 'Serious ethical violations detected';
        confidence = ethicalIssues;
      } else if (ethicalIssues > 0.4) {
        status = 'warning';
        message = 'Potential ethical concerns detected';
        confidence = ethicalIssues;
      }
    }

    if (geminiResult && geminiResult.isHarmful) {
      const newStatus = geminiResult.confidence > 0.7 ? 'danger' : 'warning';
      if (status === 'clean' || (status === 'warning' && newStatus === 'danger')) {
        status = newStatus;
        message = geminiResult.explanation;
        confidence = Math.max(confidence, geminiResult.confidence);
      }
    }

    return {
      type: 'ethical analysis',
      status,
      message,
      confidence,
      details: { perspectiveResult, geminiResult },
    };
  } catch (error) {
    console.error('Ethical analysis error:', error);
    return {
      type: 'ethical analysis',
      status: 'clean',
      message: 'Ethical analysis service temporarily unavailable',
    };
  }
};

const analyzeASCIIReal = async (text: string): Promise<AnalysisResult> => {
  try {
    const result = await detectASCIIPatterns(text);

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No special ASCII patterns detected';

    if (result.hasASCII) {
      if (result.confidence > 0.7) {
        status = 'warning';
        message = `ASCII art detected: ${result.patterns.join(', ')}`;
      } else {
        status = 'clean';
        message = 'ASCII patterns detected but appear harmless';
      }
    }

    return {
      type: 'ascii detection',
      status,
      message,
      confidence: result.confidence,
      details: result,
    };
  } catch (error) {
    console.error('ASCII detection error:', error);
    return {
      type: 'ascii detection',
      status: 'clean',
      message: 'ASCII detection service temporarily unavailable',
    };
  }
};

export const analyzeTextWithRealAPIs = async (text: string, options: string[]): Promise<AnalysisResult[]> => {
  console.log(`Analyzing text with real APIs. Options: ${options.join(', ')}`);
  
  const analysisPromises = options.map(async (option) => {
    switch(option) {
      case 'profanity':
        return analyzeProfanityReal(text);
      case 'fact-check':
        return analyzeFactCheckReal(text);
      case 'scam':
        return analyzeScamReal(text);
      case 'ethics':
        return analyzeEthicsReal(text);
      case 'ascii':
        return analyzeASCIIReal(text);
      default:
        return {
          type: option,
          status: 'clean' as const,
          message: 'Analysis completed',
        };
    }
  });

  try {
    const results = await Promise.all(analysisPromises);
    return results;
  } catch (error) {
    console.error('Text analysis error:', error);
    throw new Error('Analysis services temporarily unavailable');
  }
};
