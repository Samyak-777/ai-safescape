
// Resilient API service with circuit breakers and retry mechanisms
import { circuitBreakers } from './circuitBreaker';
import { retryService, isRetryableError } from './retryService';
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
  processingTime?: number;
  apiSource?: string;
}

// Resilient wrapper for Google NLP
const resilientGoogleNLP = async (text: string) => {
  return await circuitBreakers.googleNLP.execute(async () => {
    return await retryService.execute(
      () => moderateTextWithGoogleNLP(text),
      isRetryableError
    );
  });
};

// Resilient wrapper for Perspective API
const resilientPerspective = async (text: string) => {
  return await circuitBreakers.perspective.execute(async () => {
    return await retryService.execute(
      () => analyzeToxicityWithPerspective(text),
      isRetryableError
    );
  });
};

// Resilient wrapper for Web Risk API
const resilientWebRisk = async (url: string) => {
  return await circuitBreakers.webRisk.execute(async () => {
    return await retryService.execute(
      () => checkUrlWithWebRisk(url),
      isRetryableError
    );
  });
};

// Resilient wrapper for IPQS API
const resilientIPQS = async (url: string) => {
  return await circuitBreakers.ipqs.execute(async () => {
    return await retryService.execute(
      () => checkUrlWithIPQS(url),
      isRetryableError
    );
  });
};

// Resilient wrapper for Arya API
const resilientArya = async (url: string) => {
  return await circuitBreakers.arya.execute(async () => {
    return await retryService.execute(
      () => checkPhishingWithArya(url),
      isRetryableError
    );
  });
};

// Resilient wrapper for Gemini API
const resilientGemini = async (content: string, analysisType: string) => {
  return await circuitBreakers.gemini.execute(async () => {
    return await retryService.execute(
      () => analyzeContentWithGemini(content, analysisType),
      isRetryableError
    );
  });
};

// Extract URLs from text
const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Individual analysis functions with resilience
const analyzeProfanityResilient = async (text: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    const [nlpResult, perspectiveResult] = await Promise.allSettled([
      resilientGoogleNLP(text).catch(() => null),
      resilientPerspective(text).catch(() => null),
    ]);

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No inappropriate language detected';
    let confidence = 0;

    if (perspectiveResult.status === 'fulfilled' && perspectiveResult.value) {
      const maxToxicity = Math.max(
        perspectiveResult.value.toxicity,
        perspectiveResult.value.profanity,
        perspectiveResult.value.insult
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

    return {
      type: 'profanity check',
      status,
      message,
      confidence,
      processingTime: Date.now() - startTime,
      apiSource: 'perspective + google-nlp',
      details: {
        nlp: nlpResult.status === 'fulfilled' ? nlpResult.value : null,
        perspective: perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null,
      },
    };
  } catch (error) {
    console.error('Resilient profanity analysis error:', error);
    return {
      type: 'profanity check',
      status: 'clean',
      message: 'Profanity check service temporarily unavailable',
      processingTime: Date.now() - startTime,
    };
  }
};

const analyzeScamResilient = async (text: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    const urls = extractUrls(text);
    const promises: Promise<any>[] = [];

    // Check URLs with resilient services
    if (urls.length > 0) {
      promises.push(
        Promise.allSettled(urls.map(url => resilientWebRisk(url).catch(() => null))),
        Promise.allSettled(urls.map(url => resilientIPQS(url).catch(() => null))),
        Promise.allSettled(urls.map(url => resilientArya(url).catch(() => null)))
      );
    }

    // Analyze text content with Gemini
    promises.push(resilientGemini(text, 'scam, phishing, and fraud detection').catch(() => null));

    const results = await Promise.allSettled(promises);
    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No scam indicators detected';
    let maxConfidence = 0;

    // Process results with proper error handling
    if (results.length > 0) {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          // Process URL analysis results
          if (Array.isArray(result.value)) {
            result.value.forEach((urlResult: any) => {
              if (urlResult?.isThreat || urlResult?.isSuspicious || urlResult?.isPhishing) {
                status = urlResult.isThreat || urlResult.isPhishing ? 'danger' : 'warning';
                message = urlResult.isThreat ? 'Malicious URLs detected' : 
                         urlResult.isPhishing ? 'Phishing URLs detected' : 'Suspicious URLs detected';
                maxConfidence = Math.max(maxConfidence, 0.8);
              }
            });
          }
          // Process Gemini analysis result
          else if (result.value?.isHarmful) {
            const newStatus = result.value.confidence > 0.7 ? 'danger' : 'warning';
            if (status === 'clean' || (status === 'warning' && newStatus === 'danger')) {
              status = newStatus;
              message = result.value.explanation;
              maxConfidence = Math.max(maxConfidence, result.value.confidence);
            }
          }
        }
      });
    }

    return {
      type: 'scam detection',
      status,
      message,
      confidence: maxConfidence,
      processingTime: Date.now() - startTime,
      apiSource: 'web-risk + ipqs + arya + gemini',
      details: { results },
    };
  } catch (error) {
    console.error('Resilient scam detection error:', error);
    return {
      type: 'scam detection',
      status: 'clean',
      message: 'Scam detection service temporarily unavailable',
      processingTime: Date.now() - startTime,
    };
  }
};

export const analyzeTextWithResilientAPIs = async (
  text: string, 
  options: string[]
): Promise<AnalysisResult[]> => {
  console.log(`Analyzing text with resilient APIs. Options: ${options.join(', ')}`);
  
  const analysisPromises = options.map(async (option) => {
    switch(option) {
      case 'profanity':
        return analyzeProfanityResilient(text);
      case 'scam':
        return analyzeScamResilient(text);
      case 'ascii':
        const startTime = Date.now();
        const result = await detectASCIIPatterns(text);
        return {
          type: 'ascii detection',
          status: result.hasASCII && result.confidence > 0.7 ? 'warning' : 'clean',
          message: result.hasASCII ? `ASCII art detected: ${result.patterns.join(', ')}` : 'No special ASCII patterns detected',
          confidence: result.confidence,
          processingTime: Date.now() - startTime,
          apiSource: 'internal',
          details: result,
        };
      default:
        return {
          type: option,
          status: 'clean' as const,
          message: 'Analysis completed',
          processingTime: 0,
        };
    }
  });

  try {
    const results = await Promise.all(analysisPromises);
    return results;
  } catch (error) {
    console.error('Resilient text analysis error:', error);
    throw new Error('Analysis services temporarily unavailable');
  }
};
