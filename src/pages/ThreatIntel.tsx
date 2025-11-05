import { useEffect, useState } from "react";
import { Shield, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ThreatIntelData {
  id: string;
  threat_type: string;
  threat_category: string;
  primary_domain: string | null;
  description: string;
  severity: string;
  detection_count: number;
  last_seen_at: string;
}

const ThreatIntel = () => {
  const [threats, setThreats] = useState<ThreatIntelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('threat-intel-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threat_intel'
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
    try {
      const { data, error } = await supabase
        .from('threat_intel')
        .select('*')
        .order('last_seen_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setThreats(data || []);
    } catch (error) {
      console.error('Error fetching threats:', error);
      toast.error('Failed to load threat intelligence');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Community Threat Intelligence Hub</h1>
              <p className="text-muted-foreground">
                Real-time trending threats detected across the AI SafeScape community
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading threat intelligence...</p>
            </div>
          ) : threats.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No threats detected yet</p>
                <p className="text-muted-foreground mt-2">
                  The community is safe! Threat intelligence will appear here as they're detected.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {threats.map((threat) => (
                <Card key={threat.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <CardTitle className="text-lg">{threat.threat_type}</CardTitle>
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {threat.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{threat.threat_category}</span>
                      </div>
                      {threat.primary_domain && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Source:</span>
                          <code className="bg-muted px-2 py-1 rounded text-xs">
                            {threat.primary_domain}
                          </code>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last seen:</span>
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(threat.last_seen_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    {threat.detection_count > 1 && (
                      <div className="mt-3 pt-3 border-t">
                        <Badge variant="outline">
                          Detected {threat.detection_count} times in the last 7 days
                        </Badge>
                      </div>
                    )}
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