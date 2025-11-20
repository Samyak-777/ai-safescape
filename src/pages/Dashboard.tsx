import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Shield, TrendingUp, Activity } from "lucide-react";

interface UserAnalysis {
  id: string;
  content_preview: string;
  risk_level: string;
  created_at: string;
  content_type: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<UserAnalysis[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    threatsDetected: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await fetchUserData(session.user.id);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user analyses
      const { data: analysesData, error: analysesError } = await supabase
        .from("user_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (analysesError) throw analysesError;

      setAnalyses(analysesData || []);

      // Calculate stats
      const { count: totalCount } = await supabase
        .from("user_analyses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: threatCount } = await supabase
        .from("user_analyses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("risk_level", "High");

      setStats({
        totalAnalyses: totalCount || 0,
        threatsDetected: threatCount || 0,
      });
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "Low":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back, {user?.email}!</CardTitle>
              <CardDescription>
                Here's an overview of your activity on AI SafeScape
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyses Performed</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalAnalyses}</div>
                <p className="text-xs text-muted-foreground">Total content analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                <Shield className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.threatsDetected}</div>
                <p className="text-xs text-muted-foreground">High-risk content identified</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your last 5 analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {analyses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analyses yet. Start analyzing content to see your activity here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium mb-1">
                          {analysis.content_preview?.substring(0, 60) || "Content analyzed"}
                          {analysis.content_preview && analysis.content_preview.length > 60 && "..."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()} • {analysis.content_type}
                        </p>
                      </div>
                      <Badge className={getRiskBadgeColor(analysis.risk_level)}>
                        {analysis.risk_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
