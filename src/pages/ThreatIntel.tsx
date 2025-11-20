import { useEffect, useState } from "react";
import { Shield, AlertTriangle, MessageSquare, Link2, Clock } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ThreatIntelData {
  id: string;
  threatTitle: string;
  threatDescription: string;
  category: string;
  platform: string;
  sourceDomain: string | null;
  riskLevel: 'Critical' | 'High' | 'Low';
  status: 'misinformation' | 'verified_true';
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

const ThreatIntel = () => {
  const [threats, setThreats] = useState<ThreatIntelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time Firestore listener
    const q = query(
      collection(db, 'threatIntel'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const threatsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ThreatIntelData[];
        
        setThreats(threatsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching threats:', error);
        toast.error('Failed to load threat intelligence');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'misinformation':
        return {
          bg: 'bg-[#EA4335]',
          text: 'text-white',
          label: '⚠️ Misinformation Alert'
        };
      case 'verified_true':
        return {
          bg: 'bg-[#34A853]',
          text: 'text-white',
          label: '✅ Verified True'
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-foreground',
          label: status
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Community Threat Intelligence Hub</h1>
              <p className="text-muted-foreground">
                Real-time alerts on misinformation trends, powered by our community.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading threat intelligence...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threats.map((threat) => {
                const statusStyle = getStatusStyle(threat.status);
                return (
                  <Card key={threat.id} className="hover:shadow-lg transition-shadow border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 flex-wrap">
                        <Badge className={`${statusStyle.bg} ${statusStyle.text} px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap`}>
                          {statusStyle.label}
                        </Badge>
                        <CardTitle className="text-xl font-bold leading-tight flex-1">
                          {threat.threatTitle}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base leading-relaxed text-foreground">
                        {threat.threatDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-2 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>🏷️</span>
                          <span>{threat.category}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{threat.platform}</span>
                        </div>
                        
                        {threat.sourceDomain && (
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <code className="bg-muted px-2 py-0.5 rounded text-xs">
                              {threat.sourceDomain}
                            </code>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Seen {formatDistanceToNow(new Date(threat.timestamp.seconds * 1000), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThreatIntel;