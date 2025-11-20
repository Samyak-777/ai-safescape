import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ThreatStats {
  totalAnalyses: number;
  totalThreats: number;
  mostCommonThreat: string;
  categoryData: { category: string; count: number }[];
}

const Statistics = () => {
  const [stats, setStats] = useState<ThreatStats>({
    totalAnalyses: 0,
    totalThreats: 0,
    mostCommonThreat: "No data",
    categoryData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreatStatistics();
  }, []);

  const fetchThreatStatistics = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "threatIntel"));
      const threats = querySnapshot.docs.map((doc) => doc.data());

      // Calculate total analyses and threats
      const totalAnalyses = threats.length;
      const totalThreats = threats.filter(
        (t) => t.status === "misinformation"
      ).length;

      // Count threats by category
      const categoryCount: { [key: string]: number } = {};
      threats.forEach((threat) => {
        if (threat.status === "misinformation") {
          const category = threat.category || "Unknown";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      // Find most common threat
      const mostCommon = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

      // Format data for chart
      const chartData = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      setStats({
        totalAnalyses,
        totalThreats,
        mostCommonThreat: mostCommon ? mostCommon[0] : "No data",
        categoryData: chartData,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Community Statistics</h1>
            <p className="text-muted-foreground">
              Real-time insights from our community's collective effort in fighting misinformation
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Community Analyses</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.totalAnalyses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Content items analyzed by the community
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Threats Identified</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{stats.totalThreats}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Misinformation cases detected
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common Threat</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary truncate">
                  {stats.mostCommonThreat}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leading category of detected threats
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Threats by Category</CardTitle>
              <CardDescription>
                Distribution of detected misinformation across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.categoryData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No threat data available yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
