
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Target,
  CheckCircle,
  AlertTriangle,
  Globe,
  UserCheck,
  Clock
} from 'lucide-react';

interface SocialImpactMetrics {
  directImpact: {
    harmsDetected: Array<{
      type: string;
      count: number;
      modality: string;
      trend: number;
    }>;
    exposureReduction: Array<{
      period: string;
      before: number;
      after: number;
      reduction: number;
    }>;
    aiEngagement: {
      uniqueUsers: number;
      totalInteractions: number;
      avgSessionDuration: number;
      completionRate: number;
    };
    userWellbeing: Array<{
      metric: string;
      score: number;
      trend: number;
    }>;
  };
  indirectImpact: {
    platformMetrics: Array<{
      month: string;
      activeUsers: number;
      growthRate: number;
      retention: number;
    }>;
    partnerships: Array<{
      name: string;
      type: string;
      impact: string;
      status: 'active' | 'pending' | 'completed';
    }>;
    testimonials: Array<{
      id: string;
      text: string;
      author: string;
      role: string;
      impact: string;
    }>;
  };
}

const SocialImpactDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SocialImpactMetrics | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    // Simulate loading impact metrics data
    const loadMetrics = () => {
      setMetrics({
        directImpact: {
          harmsDetected: [
            { type: 'Profanity', count: 1247, modality: 'Text', trend: 15 },
            { type: 'Misinformation', count: 892, modality: 'Text', trend: -8 },
            { type: 'Phishing', count: 534, modality: 'Text', trend: 22 },
            { type: 'Harassment', count: 389, modality: 'Text', trend: -12 },
            { type: 'Inappropriate Images', count: 267, modality: 'Image', trend: 5 },
            { type: 'Multimodal Threats', count: 156, modality: 'Multimodal', trend: 18 }
          ],
          exposureReduction: [
            { period: 'Week 1', before: 100, after: 23, reduction: 77 },
            { period: 'Week 2', before: 100, after: 18, reduction: 82 },
            { period: 'Week 3', before: 100, after: 15, reduction: 85 },
            { period: 'Week 4', before: 100, after: 12, reduction: 88 }
          ],
          aiEngagement: {
            uniqueUsers: 2847,
            totalInteractions: 15642,
            avgSessionDuration: 7.5,
            completionRate: 89
          },
          userWellbeing: [
            { metric: 'Sense of Safety', score: 87, trend: 12 },
            { metric: 'Platform Trust', score: 91, trend: 8 },
            { metric: 'Content Confidence', score: 84, trend: 15 },
            { metric: 'Overall Satisfaction', score: 89, trend: 10 }
          ]
        },
        indirectImpact: {
          platformMetrics: [
            { month: 'Jan', activeUsers: 1200, growthRate: 15, retention: 78 },
            { month: 'Feb', activeUsers: 1450, growthRate: 21, retention: 82 },
            { month: 'Mar', activeUsers: 1680, growthRate: 16, retention: 85 },
            { month: 'Apr', activeUsers: 2100, growthRate: 25, retention: 87 },
            { month: 'May', activeUsers: 2580, growthRate: 23, retention: 89 },
            { month: 'Jun', activeUsers: 2847, growthRate: 10, retention: 91 }
          ],
          partnerships: [
            { name: 'Global Safety Initiative', type: 'Research', impact: 'Policy Development', status: 'active' },
            { name: 'Youth Protection Alliance', type: 'Education', impact: 'Awareness Programs', status: 'active' },
            { name: 'Digital Wellness Foundation', type: 'Community', impact: 'Support Networks', status: 'pending' },
            { name: 'AI Ethics Consortium', type: 'Standards', impact: 'Best Practices', status: 'completed' }
          ],
          testimonials: [
            {
              id: '1',
              text: 'AI-SafeScape helped me identify and avoid multiple phishing attempts. I feel much safer online now.',
              author: 'Sarah M.',
              role: 'Student',
              impact: 'Personal Safety'
            },
            {
              id: '2',
              text: 'Our organization has seen a 78% reduction in harmful content exposure since implementing AI-SafeScape.',
              author: 'Dr. James Chen',
              role: 'Digital Safety Researcher',
              impact: 'Community Protection'
            },
            {
              id: '3',
              text: 'The personalized recommendations helped our team understand and prevent coordinated harassment campaigns.',
              author: 'Maria Rodriguez',
              role: 'Community Manager',
              impact: 'Platform Moderation'
            }
          ]
        }
      });
    };

    loadMetrics();
  }, []);

  useEffect(() => {
    if (metrics?.indirectImpact.testimonials.length) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => 
          (prev + 1) % metrics.indirectImpact.testimonials.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [metrics]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Social Impact Dashboard</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive metrics showing our platform's real-world impact on online safety and user well-being
        </p>
      </div>

      <Tabs defaultValue="direct" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct">Direct Impact Metrics</TabsTrigger>
          <TabsTrigger value="indirect">Indirect Impact Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-6">
          {/* Harms Detection Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Online Harms Detected & Mitigated
                </CardTitle>
                <CardDescription>
                  Breakdown by type and modality with trend indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.directImpact.harmsDetected}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {metrics.directImpact.harmsDetected.map((harm, index) => (
                    <div key={harm.type} className="flex items-center justify-between text-sm">
                      <span>{harm.type}</span>
                      <Badge variant={harm.trend > 0 ? "destructive" : "default"}>
                        {harm.trend > 0 ? '+' : ''}{harm.trend}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Exposure Reduction Over Time
                </CardTitle>
                <CardDescription>
                  Comparative analysis showing reduced harmful content exposure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.directImpact.exposureReduction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="before" stroke="#ef4444" name="Before Intervention" />
                    <Line type="monotone" dataKey="after" stroke="#10b981" name="After Intervention" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.directImpact.exposureReduction[metrics.directImpact.exposureReduction.length - 1].reduction}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Reduction</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Personalized AI Assistant Engagement
              </CardTitle>
              <CardDescription>
                User interaction metrics and engagement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {metrics.directImpact.aiEngagement.uniqueUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {metrics.directImpact.aiEngagement.totalInteractions.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {metrics.directImpact.aiEngagement.avgSessionDuration}m
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {metrics.directImpact.aiEngagement.completionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Well-being Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                User Well-being & Safety Sentiment
              </CardTitle>
              <CardDescription>
                User-reported metrics based on feedback and surveys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.directImpact.userWellbeing.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{metric.score}%</span>
                        <Badge variant={metric.trend > 0 ? "default" : "secondary"}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indirect" className="space-y-6">
          {/* Platform Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Platform Adoption & Retention
              </CardTitle>
              <CardDescription>
                User growth trends and retention metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.indirectImpact.platformMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">
                    {metrics.indirectImpact.platformMetrics[metrics.indirectImpact.platformMetrics.length - 1].growthRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Growth Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">
                    {metrics.indirectImpact.platformMetrics[metrics.indirectImpact.platformMetrics.length - 1].retention}%
                  </div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">
                    {metrics.indirectImpact.platformMetrics[metrics.indirectImpact.platformMetrics.length - 1].activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnerships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Strategic Partnerships
              </CardTitle>
              <CardDescription>
                Collaborations with online safety organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.indirectImpact.partnerships.map((partnership, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{partnership.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {partnership.type} • {partnership.impact}
                      </div>
                    </div>
                    <Badge variant={
                      partnership.status === 'active' ? 'default' :
                      partnership.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {partnership.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                User Stories & Testimonials
              </CardTitle>
              <CardDescription>
                Real feedback from beneficiaries and stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[200px] flex items-center justify-center">
                {metrics.indirectImpact.testimonials.length > 0 && (
                  <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <div className="text-lg italic">
                      "{metrics.indirectImpact.testimonials[currentTestimonial].text}"
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {metrics.indirectImpact.testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metrics.indirectImpact.testimonials[currentTestimonial].role}
                      </div>
                      <Badge variant="outline">
                        {metrics.indirectImpact.testimonials[currentTestimonial].impact}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {metrics.indirectImpact.testimonials.map((_, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`w-2 h-2 rounded-full p-0 ${
                      index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialImpactDashboard;
