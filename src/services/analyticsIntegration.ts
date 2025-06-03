
import { analyticsService } from './analyticsService';
import { errorHandler } from './errorHandling';

// Wrapper to add analytics to API calls
export const withAnalytics = async <T>(
  serviceName: string,
  operation: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();
  
  try {
    analyticsService.trackEvent('analysis_request', {
      service: serviceName,
      operation,
      timestamp: startTime
    });

    const result = await apiCall();
    const responseTime = Date.now() - startTime;

    analyticsService.updateAPIHealth(serviceName, responseTime, false);
    analyticsService.recordMetric(
      `${serviceName} Response Time`,
      responseTime,
      'ms',
      'response_time'
    );

    analyticsService.trackEvent('analysis_complete', {
      service: serviceName,
      operation,
      responseTime,
      success: true
    });

    return result;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    analyticsService.updateAPIHealth(serviceName, responseTime, true);
    analyticsService.recordMetric(
      `${serviceName} Error Rate`,
      1,
      'count',
      'error_rate'
    );

    analyticsService.trackEvent('api_error', {
      service: serviceName,
      operation,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime
    });

    throw error;
  }
};

// Enhanced error handling with analytics
export const handleAnalyticsError = (
  service: string,
  operation: string,
  error: any
) => {
  const enhancedError = errorHandler.handleAPIError(error, service, operation, false);
  
  analyticsService.trackEvent('api_error', {
    service,
    operation,
    error: enhancedError.message,
    context: enhancedError.context
  });

  return enhancedError;
};

// Track user actions
export const trackUserAction = (action: string, data?: any) => {
  analyticsService.trackEvent('user_action', {
    action,
    ...data
  });
};
