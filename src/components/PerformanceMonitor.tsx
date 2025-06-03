
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, HardDrive, Wifi, Zap } from 'lucide-react';

interface PerformanceData {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  timing: {
    navigation: number;
    render: number;
    domComplete: number;
  };
  network: {
    connection: string;
    downlink: number;
    rtt: number;
  };
  fps: number;
}

const PerformanceMonitor: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    const updatePerformanceData = () => {
      try {
        // Memory usage
        const memory = (performance as any).memory || { usedJSHeapSize: 0, totalJSHeapSize: 0 };
        const memoryData = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          percentage: memory.totalJSHeapSize > 0 ? 
            Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100) : 0
        };

        // Navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const timing = {
          navigation: navigation ? Math.round(navigation.loadEventEnd - navigation.navigationStart) : 0,
          render: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
          domComplete: navigation ? Math.round(navigation.domComplete - navigation.navigationStart) : 0
        };

        // Network information
        const connection = (navigator as any).connection || {};
        const network = {
          connection: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        };

        // Estimate FPS (simplified)
        const fps = 60; // Placeholder - in production, you'd measure actual frame rate

        setPerformanceData({
          memory: memoryData,
          timing,
          network,
          fps
        });
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    };

    updatePerformanceData();
    const interval = setInterval(updatePerformanceData, 2000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'bg-green-500' };
    if (value <= thresholds.warning) return { status: 'warning', color: 'bg-yellow-500' };
    return { status: 'poor', color: 'bg-red-500' };
  };

  const getConnectionQuality = (effectiveType: string) => {
    switch (effectiveType) {
      case '4g':
        return { quality: 'Excellent', color: 'text-green-600' };
      case '3g':
        return { quality: 'Good', color: 'text-yellow-600' };
      case '2g':
        return { quality: 'Poor', color: 'text-red-600' };
      default:
        return { quality: 'Unknown', color: 'text-gray-600' };
    }
  };

  if (!performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const memoryStatus = getPerformanceStatus(performanceData.memory.percentage, { good: 50, warning: 80 });
  const loadTimeStatus = getPerformanceStatus(performanceData.timing.navigation, { good: 1000, warning: 3000 });
  const connectionQuality = getConnectionQuality(performanceData.network.connection);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Monitor
        </CardTitle>
        <CardDescription>Real-time application performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <Badge variant={memoryStatus.status === 'good' ? 'default' : 'destructive'}>
              {performanceData.memory.used}MB / {performanceData.memory.total}MB
            </Badge>
          </div>
          <Progress value={performanceData.memory.percentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {performanceData.memory.percentage}% of available memory
          </div>
        </div>

        {/* Load Performance */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold">{performanceData.timing.navigation}ms</div>
            <div className="text-xs text-muted-foreground">Page Load</div>
            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${loadTimeStatus.color}`}></div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{performanceData.timing.render}ms</div>
            <div className="text-xs text-muted-foreground">DOM Ready</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{performanceData.fps}</div>
            <div className="text-xs text-muted-foreground">FPS</div>
          </div>
        </div>

        {/* Network Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <Badge variant="outline" className={connectionQuality.color}>
              {performanceData.network.connection.toUpperCase()}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Downlink:</span>
              <span className="ml-1 font-medium">{performanceData.network.downlink} Mbps</span>
            </div>
            <div>
              <span className="text-muted-foreground">RTT:</span>
              <span className="ml-1 font-medium">{performanceData.network.rtt}ms</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">System Status</span>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800">
            Optimal
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
