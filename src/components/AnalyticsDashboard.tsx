
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Zap,
  Users,
  Server
} from 'lucide-react';
import { analyticsService, AnalyticsEvent, PerformanceMetric, APIHealthMetric } from '@/services/analyticsService';

interface DashboardData {
  summary: {
    totalRequests: number;
    successfulAnalyses: number;
    errors: number;
    avgResponseTime: number;
  };
  apiHealth: APIHealthMetric[];
  recentEvents: AnalyticsEvent[];
  performanceCharts: any;
}

const AnalyticsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const updateDashboard = () => {
      const data = analyticsService.getDashboardData();
      setDashboardData(data);
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);

    const unsubscribe = analyticsService.subscribe((update) => {
      if (isLive) {
        updateDashboard();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [isLive]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time system monitoring and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <Activity className="h-4 w-4 mr-1" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.summary.totalRequests > 0 
                ? Math.round((dashboardData.summary.successfulAnalyses / dashboardData.summary.totalRequests) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.summary.successfulAnalyses} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dashboardData.summary.avgResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">Average latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Count</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardData.summary.errors}
            </div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-health">API Health</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Types</CardTitle>
                <CardDescription>Request distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profanity Check</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fact Check</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scam Detection</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ethics Analysis</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.apiHealth.map((health) => (
              <Card key={health.service}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{health.service}</CardTitle>
                    {getStatusIcon(health.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge className={getStatusColor(health.status)}>
                    {health.status.toUpperCase()}
                  </Badge>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span>{Math.round(health.responseTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate:</span>
                      <span>{health.errorRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span>{health.availability.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Availability</span>
                      <span>{health.availability.toFixed(0)}%</span>
                    </div>
                    <Progress value={health.availability} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest system events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {dashboardData.recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          event.type === 'analysis_complete' ? 'bg-green-500' :
                          event.type === 'api_error' ? 'bg-red-500' :
                          event.type === 'analysis_request' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{event.type.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
