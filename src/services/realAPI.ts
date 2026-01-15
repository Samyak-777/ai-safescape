
// Real API integration service replacing mock APIs
import { moderateTextWithGoogleNLP, analyzeSentimentWithGoogleNLP } from './googleCloudNLP';
import { analyzeToxicityWithPerspective } from './perspectiveAPI';
import { checkUrlWithWebRisk } from './webRiskAPI';
import { checkUrlWithIPQS } from './ipqsAPI';
import { checkPhishingWithArya } from './aryaAPI';
import { analyzeContentWithAzureOpenAI } from './geminiAPI';
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
    const [nlpResult, perspectiveResult] = await Promise.allSettled([
      moderateTextWithGoogleNLP(text).catch(() => null),
      analyzeToxicityWithPerspective(text).catch(() => null),
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

    if (nlpResult.status === 'fulfilled' && nlpResult.value && nlpResult.value.categories.length > 0) {
      const harmfulCategories = nlpResult.value.categories.filter(cat => 
        cat.name.includes('Toxic') || cat.name.includes('Profanity') || cat.name.includes('Insult')
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
      details: { 
        nlp: nlpResult.status === 'fulfilled' ? nlpResult.value : null, 
        perspective: perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null 
      },
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
    // Use Azure OpenAI for fact-checking with proper error handling
    const result = await analyzeContentWithAzureOpenAI(text, 'fact-checking, misinformation detection, and claim verification');

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No factual inaccuracies detected';

    if (result && result.isHarmful) {
      if (result.confidence > 0.7) {
        status = 'danger';
        message = 'Potential misinformation detected - claims require verification';
      } else if (result.confidence > 0.4) {
        status = 'warning';
        message = 'Some claims may need independent verification';
      }
    }

    // Basic pattern-based fallback for suspicious content
    const suspiciousPatterns = ['fake news', 'conspiracy', 'secret government', 'they don\'t want you to know'];
    const lowerText = text.toLowerCase();
    const foundPatterns = suspiciousPatterns.filter(pattern => lowerText.includes(pattern));
    
    if (foundPatterns.length > 0 && status === 'clean') {
      status = 'warning';
      message = 'Content contains phrases that often appear in misinformation';
    }

    return {
      type: 'fact check',
      status,
      message: result?.explanation || message,
      confidence: result?.confidence || (foundPatterns.length > 0 ? 0.6 : 0.9),
      details: result,
    };
  } catch (error) {
    console.error('Fact check error:', error);
    // Provide basic pattern-based analysis as fallback
    const suspiciousPatterns = ['fake news', 'conspiracy', 'secret', 'cover-up'];
    const lowerText = text.toLowerCase();
    const foundPatterns = suspiciousPatterns.filter(pattern => lowerText.includes(pattern));
    
    return {
      type: 'fact check',
      status: foundPatterns.length > 0 ? 'warning' : 'clean',
      message: foundPatterns.length > 0 ? 'Content may contain unverified claims' : 'Basic fact-check completed',
      confidence: 0.5,
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
        Promise.allSettled(urls.map(url => checkUrlWithWebRisk(url).catch(() => null))),
        Promise.allSettled(urls.map(url => checkUrlWithIPQS(url).catch(() => null))),
        Promise.allSettled(urls.map(url => checkPhishingWithArya(url).catch(() => null)))
      );
    }

    // Analyze text content with Azure OpenAI
    promises.push(analyzeContentWithAzureOpenAI(text, 'scam, phishing, fraud detection, and financial manipulation').catch(() => null));

    const results = await Promise.allSettled(promises);
    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No scam indicators detected';
    let maxConfidence = 0;

    // Process URL analysis results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        if (Array.isArray(result.value)) {
          result.value.forEach((urlResult: any) => {
            if (urlResult?.isThreat || urlResult?.isSuspicious || urlResult?.isPhishing) {
              status = urlResult.isThreat || urlResult.isPhishing ? 'danger' : 'warning';
              message = urlResult.isThreat ? 'Malicious URLs detected' : 
                       urlResult.isPhishing ? 'Phishing URLs detected' : 'Suspicious URLs detected';
              maxConfidence = Math.max(maxConfidence, 0.8);
            }
          });
        } else if (result.value?.isHarmful) {
          const newStatus = result.value.confidence > 0.7 ? 'danger' : 'warning';
          if (status === 'clean' || (status === 'warning' && newStatus === 'danger')) {
            status = newStatus;
            message = result.value.explanation;
            maxConfidence = Math.max(maxConfidence, result.value.confidence);
          }
        }
      }
    });

    // Basic pattern-based fallback for scam detection
    const scamPatterns = ['free money', 'wire transfer', 'urgent action required', 'click here now', 'limited time offer'];
    const lowerText = text.toLowerCase();
    const foundScamPatterns = scamPatterns.filter(pattern => lowerText.includes(pattern));
    
    if (foundScamPatterns.length > 1 && status === 'clean') {
      status = 'warning';
      message = 'Content contains multiple phrases common in scam attempts';
      maxConfidence = 0.7;
    } else if (foundScamPatterns.length > 0 && status === 'clean') {
      message = 'Content appears safe but contains some promotional language';
      maxConfidence = 0.9;
    }

    return {
      type: 'scam detection',
      status,
      message,
      confidence: maxConfidence || 0.9,
      details: { results, foundPatterns: foundScamPatterns },
    };
  } catch (error) {
    console.error('Scam detection error:', error);
    // Provide basic pattern-based analysis as fallback
    const scamPatterns = ['free money', 'wire transfer', 'urgent', 'click here', 'limited time'];
    const lowerText = text.toLowerCase();
    const foundPatterns = scamPatterns.filter(pattern => lowerText.includes(pattern));
    
    return {
      type: 'scam detection',
      status: foundPatterns.length > 1 ? 'warning' : 'clean',
      message: foundPatterns.length > 1 ? 'Potential scam indicators detected' : 'Basic scam check completed',
      confidence: 0.6,
    };
  }
};

const analyzeEthicsReal = async (text: string): Promise<AnalysisResult> => {
  try {
    const [perspectiveResult, azureResult] = await Promise.allSettled([
      analyzeToxicityWithPerspective(text).catch(() => null),
      analyzeContentWithAzureOpenAI(text, 'ethical violations, hate speech, and harmful content').catch(() => null),
    ]);

    let status: 'clean' | 'warning' | 'danger' = 'clean';
    let message = 'No ethical concerns detected';
    let confidence = 0;

    if (perspectiveResult.status === 'fulfilled' && perspectiveResult.value) {
      const ethicalIssues = Math.max(
        perspectiveResult.value.identityAttack,
        perspectiveResult.value.threat,
        perspectiveResult.value.severeToxicity
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

    if (azureResult.status === 'fulfilled' && azureResult.value && azureResult.value.isHarmful) {
      const newStatus = azureResult.value.confidence > 0.7 ? 'danger' : 'warning';
      if (status === 'clean' || (status === 'warning' && newStatus === 'danger')) {
        status = newStatus;
        message = azureResult.value.explanation;
        confidence = Math.max(confidence, azureResult.value.confidence);
      }
    }

    return {
      type: 'ethical analysis',
      status,
      message,
      confidence: confidence || 0.9,
      details: { 
        perspective: perspectiveResult.status === 'fulfilled' ? perspectiveResult.value : null, 
        azureOpenAI: azureResult.status === 'fulfilled' ? azureResult.value : null 
      },
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
