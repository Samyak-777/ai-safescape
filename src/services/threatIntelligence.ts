
// Advanced threat intelligence and security analysis service
export interface ThreatIntelligenceData {
  isMalicious: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  confidence: number;
  sources: string[];
  lastSeen?: string;
  description?: string;
}

export interface SecurityAnalysisResult {
  overallScore: number;
  riskLevel: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  threats: Array<{
    type: string;
    severity: 'info' | 'warning' | 'danger';
    confidence: number;
    description: string;
    mitigation?: string;
  }>;
  patterns: Array<{
    pattern: string;
    matches: number;
    riskScore: number;
  }>;
  recommendations: string[];
}

class ThreatIntelligenceService {
  private static instance: ThreatIntelligenceService;
  private cache = new Map<string, { data: ThreatIntelligenceData; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ThreatIntelligenceService {
    if (!ThreatIntelligenceService.instance) {
      ThreatIntelligenceService.instance = new ThreatIntelligenceService();
    }
    return ThreatIntelligenceService.instance;
  }

  // Simulate threat intelligence lookup (in production, this would connect to real threat feeds)
  async lookupThreatIntelligence(indicator: string, type: 'url' | 'domain' | 'ip' | 'hash'): Promise<ThreatIntelligenceData> {
    const cacheKey = `${type}:${indicator}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock threat intelligence data based on common indicators
    const result = this.generateMockThreatData(indicator, type);
    
    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  private generateMockThreatData(indicator: string, type: string): ThreatIntelligenceData {
    const suspiciousPatterns = [
      'bit.ly', 'tinyurl.com', 'goo.gl', // URL shorteners
      'phishing', 'malware', 'scam', 'fraud',
      'bitcoin', 'cryptocurrency', 'urgent',
      'click here', 'verify account', 'suspended'
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => 
      indicator.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isSuspicious) {
      return {
        isMalicious: true,
        threatLevel: Math.random() > 0.5 ? 'high' : 'medium',
        categories: ['phishing', 'social_engineering'],
        confidence: 0.7 + Math.random() * 0.3,
        sources: ['Community Feed', 'Security Vendor'],
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Identified as potentially malicious based on known attack patterns'
      };
    }

    return {
      isMalicious: false,
      threatLevel: 'low',
      categories: [],
      confidence: 0.1 + Math.random() * 0.3,
      sources: ['Clean Feed'],
      description: 'No known threats associated with this indicator'
    };
  }

  // Advanced pattern analysis for security threats
  analyzeSecurityPatterns(content: string): SecurityAnalysisResult {
    const threats: SecurityAnalysisResult['threats'] = [];
    const patterns: SecurityAnalysisResult['patterns'] = [];
    let overallScore = 100;

    // Social engineering patterns
    const socialEngineeringPatterns = [
      { pattern: /urgent(ly)?|immediate(ly)?|asap/gi, risk: 15, name: 'Urgency tactics' },
      { pattern: /verify.*account|confirm.*identity/gi, risk: 20, name: 'Identity verification scam' },
      { pattern: /click.*here.*now|click.*link.*below/gi, risk: 18, name: 'Suspicious call-to-action' },
      { pattern: /suspended.*account|account.*locked/gi, risk: 25, name: 'Account threat scam' },
      { pattern: /limited.*time.*offer|expires.*soon/gi, risk: 12, name: 'False scarcity' }
    ];

    // Financial fraud patterns
    const financialPatterns = [
      { pattern: /wire.*transfer|bank.*transfer/gi, risk: 30, name: 'Wire transfer request' },
      { pattern: /bitcoin|cryptocurrency|crypto/gi, risk: 20, name: 'Cryptocurrency mention' },
      { pattern: /inheritance|lottery.*winner|prize/gi, risk: 35, name: 'Advance fee fraud' },
      { pattern: /tax.*refund|irs.*refund/gi, risk: 25, name: 'Tax refund scam' },
      { pattern: /free.*money|easy.*money/gi, risk: 22, name: 'Money scam indicators' }
    ];

    // Phishing patterns
    const phishingPatterns = [
      { pattern: /paypal|amazon|microsoft|google/gi, risk: 15, name: 'Brand impersonation' },
      { pattern: /login.*expire|password.*expire/gi, risk: 20, name: 'Credential harvesting' },
      { pattern: /security.*alert|security.*notice/gi, risk: 18, name: 'Fake security notice' },
      { pattern: /update.*payment|update.*billing/gi, risk: 22, name: 'Payment update scam' }
    ];

    const allPatterns = [...socialEngineeringPatterns, ...financialPatterns, ...phishingPatterns];

    // Analyze patterns
    allPatterns.forEach(({ pattern, risk, name }) => {
      const matches = content.match(pattern);
      if (matches) {
        const matchCount = matches.length;
        const patternRisk = Math.min(risk * matchCount, risk * 2); // Cap at 2x base risk
        
        patterns.push({
          pattern: name,
          matches: matchCount,
          riskScore: patternRisk
        });

        threats.push({
          type: name,
          severity: patternRisk > 25 ? 'danger' : patternRisk > 15 ? 'warning' : 'info',
          confidence: Math.min(0.6 + (matchCount * 0.1), 0.95),
          description: `Detected ${matchCount} instance(s) of ${name.toLowerCase()}`,
          mitigation: this.getMitigationAdvice(name)
        });

        overallScore -= patternRisk;
      }
    });

    // URL analysis
    const urlPattern = /https?:\/\/[^\s]+/gi;
    const urls = content.match(urlPattern);
    if (urls && urls.length > 3) {
      const risk = Math.min(urls.length * 5, 25);
      overallScore -= risk;
      threats.push({
        type: 'Multiple URLs',
        severity: 'warning',
        confidence: 0.7,
        description: `Content contains ${urls.length} URLs, which may indicate spam or phishing`,
        mitigation: 'Verify all URLs before clicking'
      });
    }

    // Determine risk level
    const riskLevel = this.calculateRiskLevel(Math.max(0, overallScore));
    const recommendations = this.generateRecommendations(threats, patterns);

    return {
      overallScore: Math.max(0, overallScore),
      riskLevel,
      threats,
      patterns,
      recommendations
    };
  }

  private getMitigationAdvice(threatType: string): string {
    const mitigations: Record<string, string> = {
      'Urgency tactics': 'Take time to verify claims independently',
      'Identity verification scam': 'Contact the organization directly through official channels',
      'Suspicious call-to-action': 'Avoid clicking suspicious links',
      'Account threat scam': 'Log in through the official website, not through links',
      'Wire transfer request': 'Never send money to unknown parties',
      'Cryptocurrency mention': 'Be cautious of crypto-related requests',
      'Advance fee fraud': 'Legitimate organizations do not ask for upfront fees',
      'Brand impersonation': 'Verify sender authenticity through official channels'
    };
    return mitigations[threatType] || 'Exercise caution and verify independently';
  }

  private calculateRiskLevel(score: number): SecurityAnalysisResult['riskLevel'] {
    if (score >= 90) return 'minimal';
    if (score >= 75) return 'low';
    if (score >= 50) return 'medium';
    if (score >= 25) return 'high';
    return 'critical';
  }

  private generateRecommendations(threats: SecurityAnalysisResult['threats'], patterns: SecurityAnalysisResult['patterns']): string[] {
    const recommendations = ['Always verify sender identity through independent channels'];
    
    if (threats.some(t => t.type.includes('URL'))) {
      recommendations.push('Scan URLs with security tools before visiting');
    }
    
    if (threats.some(t => t.severity === 'danger')) {
      recommendations.push('Consider this content high-risk and avoid any requested actions');
    }
    
    if (patterns.some(p => p.riskScore > 20)) {
      recommendations.push('This content shows multiple red flags typical of scams');
    }

    return recommendations;
  }
}

export const threatIntelligenceService = ThreatIntelligenceService.getInstance();
