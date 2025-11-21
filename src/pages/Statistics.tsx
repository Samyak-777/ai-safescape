import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Shield, AlertTriangle } from 'lucide-react';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 1247,
    totalThreats: 342,
    mostCommonThreat: 'Financial Scams',
  });

  const [categoryData, setCategoryData] = useState([
    { category: 'Financial Scam', count: 145, fill: 'hsl(var(--chart-1))' },
    { category: 'Health Misinformation', count: 89, fill: 'hsl(var(--chart-2))' },
    { category: 'Social/Communal', count: 67, fill: 'hsl(var(--chart-3))' },
    { category: 'Political Misinformation', count: 54, fill: 'hsl(var(--chart-4))' },
    { category: 'E-commerce Scam', count: 43, fill: 'hsl(var(--chart-5))' },
    { category: 'Social Media Rumor', count: 38, fill: 'hsl(var(--chart-1))' },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase
      .from('community_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setStats({
        totalAnalyses: data.total_analyses,
        totalThreats: data.total_threats,
        mostCommonThreat: data.most_common_threat,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Community Statistics</h1>
            <p className="text-muted-foreground">
              Collective impact of our community in fighting misinformation
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-chart-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Community Analyses</CardTitle>
                <Activity className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  {stats.totalAnalyses.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Content items analyzed by our community
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Threats Identified</CardTitle>
                <Shield className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
                  {stats.totalThreats.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  High-risk items detected and flagged
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common Threat</CardTitle>
                <AlertTriangle className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-chart-5 to-primary bg-clip-text text-transparent">
                  {stats.mostCommonThreat}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leading category of threats detected
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Threats by Category</CardTitle>
              <CardDescription>Distribution of detected threats across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    className="text-xs"
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
