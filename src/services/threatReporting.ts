import { supabase } from "@/integrations/supabase/client";

export interface ThreatReport {
  threatType: string;
  threatCategory: string;
  primaryDomain?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Reports a high-risk threat to the community threat intelligence database
 */
export async function reportThreat(report: ThreatReport): Promise<void> {
  try {
    const { error } = await supabase.rpc('upsert_threat_intel', {
      p_threat_type: report.threatType,
      p_threat_category: report.threatCategory,
      p_primary_domain: report.primaryDomain || null,
      p_description: report.description,
      p_severity: report.severity,
    });

    if (error) {
      console.error('Failed to report threat:', error);
    } else {
      console.log('Threat reported successfully:', report.threatType);
    }
  } catch (error) {
    console.error('Error reporting threat:', error);
  }
}

/**
 * Extracts domain from URL
 */
export function extractDomain(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return undefined;
  }
}

/**
 * Determines threat category based on content analysis
 */
export function determineThreatCategory(content: string, threats: string[]): string {
  const contentLower = content.toLowerCase();
  
  if (threats.some(t => t.toLowerCase().includes('financial') || t.toLowerCase().includes('money'))) {
    return 'Financial Scam';
  }
  if (threats.some(t => t.toLowerCase().includes('phishing') || t.toLowerCase().includes('credential'))) {
    return 'Phishing';
  }
  if (threats.some(t => t.toLowerCase().includes('malware') || t.toLowerCase().includes('virus'))) {
    return 'Malware';
  }
  if (contentLower.includes('health') || contentLower.includes('medical') || contentLower.includes('vaccine')) {
    return 'Health Misinformation';
  }
  if (contentLower.includes('election') || contentLower.includes('voting') || contentLower.includes('political')) {
    return 'Political Misinformation';
  }
  
  return 'General Scam';
}
