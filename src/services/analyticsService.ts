export interface AnalyticsEvent {
  id: string;
  type: 'analysis_request' | 'analysis_complete' | 'api_error' | 'user_action' | 'security_analysis';
  timestamp: number;
  data: any;
  userId?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'response_time' | 'throughput' | 'error_rate' | 'availability' | 'security_metrics';
}

export interface APIHealthMetric {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
  availability: number;
  lastCheck: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private apiHealth: Map<string, APIHealthMetric> = new Map();
  private sessionId: string;
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMetrics();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMetrics(): void {
    // Initialize API health for known services
    const services = ['Gemini AI', 'Perspective API', 'Google Cloud NLP', 'IPQS', 'Web Risk'];
    services.forEach(service => {
      this.apiHealth.set(service, {
        service,
        status: 'healthy',
        responseTime: 0,
        errorRate: 0,
        availability: 100,
        lastCheck: Date.now()
      });
    });
  }

  trackEvent(type: AnalyticsEvent['type'], data: any, userId?: string): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      data,
      userId,
      sessionId: this.sessionId
    };

    this.events.unshift(event);
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }

    this.notifySubscribers({ type: 'event', data: event });
    console.log('Analytics Event:', event);
  }

  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric['category']): void {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: Date.now(),
      category
    };

    this.metrics.unshift(metric);
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(0, 500);
    }

    this.notifySubscribers({ type: 'metric', data: metric });
  }

  updateAPIHealth(service: string, responseTime: number, isError: boolean = false): void {
    const current = this.apiHealth.get(service) || {
      service,
      status: 'healthy' as const,
      responseTime: 0,
      errorRate: 0,
      availability: 100,
      lastCheck: 0
    };

    const now = Date.now();
    const timeSinceLastCheck = now - current.lastCheck;
    
    // Update response time (rolling average)
    current.responseTime = current.responseTime === 0 ? responseTime : 
      (current.responseTime * 0.7 + responseTime * 0.3);

    // Update error rate (rolling average)
    if (isError) {
      current.errorRate = Math.min(100, (current.errorRate * 0.9 + 10));
    } else {
      current.errorRate = Math.max(0, (current.errorRate * 0.95));
    }

    // Update availability
    if (timeSinceLastCheck > 0) {
      const uptime = isError ? 0 : 100;
      current.availability = (current.availability * 0.95 + uptime * 0.05);
    }

    // Determine status
    if (current.errorRate > 50 || current.availability < 50) {
      current.status = 'down';
    } else if (current.errorRate > 20 || current.availability < 80 || current.responseTime > 5000) {
      current.status = 'degraded';
    } else {
      current.status = 'healthy';
    }

    current.lastCheck = now;
    this.apiHealth.set(service, current);

    this.notifySubscribers({ type: 'api_health', data: { service, health: current } });
  }

  getRecentEvents(count: number = 50): AnalyticsEvent[] {
    return this.events.slice(0, count);
  }

  getMetrics(category?: PerformanceMetric['category'], timeRange?: number): PerformanceMetric[] {
    let filteredMetrics = this.metrics;

    if (category) {
      filteredMetrics = filteredMetrics.filter(m => m.category === category);
    }

    if (timeRange) {
      const cutoff = Date.now() - timeRange;
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= cutoff);
    }

    return filteredMetrics;
  }

  getAPIHealth(): APIHealthMetric[] {
    return Array.from(this.apiHealth.values());
  }

  getDashboardData(): any {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    
    const recentEvents = this.getRecentEvents(100);
    const recentMetrics = this.getMetrics(undefined, 60 * 60 * 1000);
    
    return {
      summary: {
        totalRequests: recentEvents.filter(e => e.type === 'analysis_request').length,
        successfulAnalyses: recentEvents.filter(e => e.type === 'analysis_complete').length,
        errors: recentEvents.filter(e => e.type === 'api_error').length,
        avgResponseTime: this.calculateAverageResponseTime(recentMetrics)
      },
      apiHealth: this.getAPIHealth(),
      recentEvents: recentEvents.slice(0, 20),
      performanceCharts: this.generateChartData(recentMetrics)
    };
  }

  private calculateAverageResponseTime(metrics: PerformanceMetric[]): number {
    const responseTimes = metrics.filter(m => m.category === 'response_time');
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((sum, m) => sum + m.value, 0) / responseTimes.length;
  }

  private generateChartData(metrics: PerformanceMetric[]): any {
    const categories = ['response_time', 'throughput', 'error_rate', 'availability'] as const;
    const chartData: any = {};

    categories.forEach(category => {
      const categoryMetrics = metrics.filter(m => m.category === category);
      chartData[category] = categoryMetrics.map(m => ({
        timestamp: m.timestamp,
        value: m.value,
        name: m.name
      }));
    });

    return chartData;
  }

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(data: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Analytics subscriber error:', error);
      }
    });
  }
}

export const analyticsService = AnalyticsService.getInstance();
