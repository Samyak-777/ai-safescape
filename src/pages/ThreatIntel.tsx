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
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching threats:', error);
      setLoading(false);
      return;
    }

    setThreats((data as any) || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Community Threat Intelligence Hub</h1>
            <p className="text-muted-foreground">
              Real-time alerts on misinformation trends, powered by our community.
            </p>
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
