import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ThreatIntelData {
  id: string;
  threat_title: string;
  description: string;
  threat_category: string;
  platform: string;
  primary_domain?: string;
  severity: 'Critical' | 'High' | 'Low';
  status: 'misinformation' | 'verified_true';
  created_at: string;
}

const ThreatIntel = () => {
  const [threats, setThreats] = useState<ThreatIntelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchThreats();

    // Set up real-time subscription
    const channel = supabase
      .channel('threat_intel_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threat_intel',
        },
        () => {
          fetchThreats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchThreats = async () => {
    const { data, error } = await supabase
      .from('threat_intel')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching threats:', error);
      setLoading(false);
      return;
    }

    setThreats((data as any) || []);
    setLoading(false);
  };

  const importCSVData = async () => {
    setImporting(true);
    const csvData = [
      {
        threat_title: 'Fake: Government offering free mobile recharge for 3 months.',
        description: 'A viral WhatsApp message is sharing a link claiming the government is giving free 3-month recharges to all citizens. This is a phishing scam to steal personal information.',
        threat_category: 'Financial Scam',
        platform: 'WhatsApp',
        primary_domain: 'free-recharge-gov.online',
        severity: 'critical',
        status: 'misinformation',
        threat_type: 'Phishing & Financial Scam'
      },
      {
        threat_title: "Verified: ISRO successfully puts Chandrayaan-3's lander into sleep mode.",
        description: 'The Indian Space Research Organisation (ISRO) has confirmed that the Vikram lander and Pragyan rover have been set into sleep mode.',
        threat_category: 'Science & Technology',
        platform: 'Official News',
        primary_domain: 'isro.gov.in',
        severity: 'low',
        status: 'verified_true',
        threat_type: 'Verified News'
      },
      {
        threat_title: 'False Claim: RBI to impose new transaction charges on all UPI payments.',
        description: 'A photoshopped image claims RBI will add new charges to UPI transactions over ₹100. NPCI confirmed this is false.',
        threat_category: 'Financial Misinformation',
        platform: 'Facebook / Twitter',
        primary_domain: null,
        severity: 'high',
        status: 'misinformation',
        threat_type: 'Financial Misinformation'
      },
      {
        threat_title: 'Misleading: Old video of market dispute shared with false communal angle.',
        description: 'An old video is shared with a fake communal narrative to incite tension.',
        threat_category: 'Social / Communal',
        platform: 'WhatsApp / Facebook',
        primary_domain: null,
        severity: 'high',
        status: 'misinformation',
        threat_type: 'Social Manipulation'
      },
      {
        threat_title: "Verified: G20 Leaders' Summit in New Delhi adopts consensus declaration.",
        description: 'The G20 summit concluded with all nations adopting the New Delhi Leaders\' Declaration.',
        threat_category: 'Politics / World News',
        platform: 'Official News',
        primary_domain: 'pib.gov.in',
        severity: 'low',
        status: 'verified_true',
        threat_type: 'Verified News'
      },
      {
        threat_title: 'Alert: Deepfake video of Chief Minister making false promises goes viral.',
        description: 'A deepfake video is being used for political manipulation ahead of elections.',
        threat_category: 'Political Misinformation',
        platform: 'Social Media',
        primary_domain: null,
        severity: 'critical',
        status: 'misinformation',
        threat_type: 'Deepfake & Political Manipulation'
      },
      {
        threat_title: 'Verified: Health Ministry issues advisory for seasonal dengue prevention.',
        description: 'The Health Ministry has issued guidelines to prevent dengue spread.',
        threat_category: 'Public Health',
        platform: 'Official Channels',
        primary_domain: 'mohfw.gov.in',
        severity: 'low',
        status: 'verified_true',
        threat_type: 'Verified News'
      },
      {
        threat_title: "Scam Alert: Fake 'Diwali Blockbuster Sale' on fraudulent website.",
        description: 'A fake e-commerce website is scamming users with fake Diwali discounts.',
        threat_category: 'E-commerce Scam',
        platform: 'Instagram / Facebook',
        primary_domain: 'best-deals-diwali.shop',
        severity: 'critical',
        status: 'misinformation',
        threat_type: 'E-commerce Scam'
      },
      {
        threat_title: "Verified: India records its highest-ever medal tally at the Asian Games.",
        description: 'India crosses 100 medals for the first time in Asian Games history.',
        threat_category: 'Sports',
        platform: 'Official News',
        primary_domain: 'olympics.com',
        severity: 'low',
        status: 'verified_true',
        threat_type: 'Verified News'
      },
      {
        threat_title: "False: Viral rumor of a famous Bollywood actor's death in an accident.",
        description: 'A death hoax about a Bollywood actor is trending, but the actor is safe.',
        threat_category: 'Social Media Rumor',
        platform: 'X (Twitter)',
        primary_domain: null,
        severity: 'high',
        status: 'misinformation',
        threat_type: 'Celebrity Death Hoax'
      }
    ];

    try {
      const { error } = await supabase
        .from('threat_intel')
        .insert(csvData);

      if (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data. See console for details.');
      } else {
        alert('Successfully imported 10 threat intelligence records!');
        fetchThreats();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to import data.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Community Threat Intelligence Hub</h1>
            <p className="text-muted-foreground">
              Real-time alerts on misinformation trends, powered by our community.
            </p>
            <button
              onClick={importCSVData}
              disabled={importing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {importing ? 'Importing...' : 'Import CSV Data'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading threat intelligence...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {threats.map((threat) => (
                <Card key={threat.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Badge 
                        className={
                          threat.status === 'misinformation'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }
                      >
                        {threat.status === 'misinformation' 
                          ? '⚠️ Misinformation Alert' 
                          : '✅ Verified True'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{threat.threat_title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {threat.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>🏷️</span>
                        <span>{threat.threat_category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>{threat.platform}</span>
                      </div>
                      {threat.primary_domain && (
                        <div className="flex items-center gap-1">
                          <span>🔗</span>
                          <span>{threat.primary_domain}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>
                          Seen {formatDistanceToNow(new Date(threat.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThreatIntel;
