
import { toast } from 'sonner';

export interface ErrorContext {
  service: string;
  operation: string;
  userMessage: string;
  technicalDetails?: string;
  retryable: boolean;
  fallbackAvailable: boolean;
}

export interface EnhancedError extends Error {
  code?: string;
  status?: number;
  context?: ErrorContext;
  timestamp: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: EnhancedError[] = [];
  private maxLogSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  createEnhancedError(
    message: string,
    context: ErrorContext,
    originalError?: Error
  ): EnhancedError {
    const error = new Error(message) as EnhancedError;
    error.context = context;
    error.timestamp = Date.now();
    
    if (originalError) {
      error.stack = originalError.stack;
      if ('code' in originalError) error.code = (originalError as any).code;
      if ('status' in originalError) error.status = (originalError as any).status;
    }

    this.logError(error);
    return error;
  }

  handleAPIError(
    error: any,
    service: string,
    operation: string,
    showToast: boolean = true
  ): EnhancedError {
    let userMessage = 'Service temporarily unavailable';
    let retryable = true;
    let fallbackAvailable = false;

    // Determine error type and appropriate user message
    if (error?.status === 403 || error?.message?.includes('403')) {
      userMessage = 'API key not configured or invalid';
      retryable = false;
      fallbackAvailable = true;
    } else if (error?.status === 429) {
      userMessage = 'Rate limit exceeded. Please try again in a moment';
      retryable = true;
    } else if (error?.status === 500) {
      userMessage = 'Service is experiencing issues. Please try again later';
      retryable = true;
    } else if (!navigator.onLine) {
      userMessage = 'No internet connection detected';
      retryable = true;
    }

    const context: ErrorContext = {
      service,
      operation,
      userMessage,
      technicalDetails: error?.message || 'Unknown error',
      retryable,
      fallbackAvailable
    };

    const enhancedError = this.createEnhancedError(
      `${service} ${operation} failed: ${error?.message || 'Unknown error'}`,
      context,
      error
    );

    if (showToast) {
      this.showUserFriendlyError(enhancedError);
    }

    return enhancedError;
  }

  showUserFriendlyError(error: EnhancedError): void {
    if (!error.context) return;

    const { userMessage, retryable, fallbackAvailable } = error.context;
    
    let description = userMessage;
    if (fallbackAvailable) {
      description += '. Using alternative analysis methods.';
    } else if (retryable) {
      description += '. Please try again.';
    }

    toast.error('Analysis Issue', {
      description,
      duration: retryable ? 4000 : 6000,
    });
  }

  showSuccessWithWarnings(
    successMessage: string,
    warnings: string[] = [],
    failedServices: string[] = []
  ): void {
    if (failedServices.length === 0) {
      toast.success(successMessage);
      return;
    }

    let description = successMessage;
    if (failedServices.length > 0) {
      description += ` (${failedServices.join(', ')} unavailable)`;
    }

    toast.success('Analysis Complete', {
      description,
      duration: 5000,
    });

    // Show warnings as separate toasts
    warnings.forEach((warning, index) => {
      setTimeout(() => {
        toast.warning('Service Notice', {
          description: warning,
          duration: 4000,
        });
      }, (index + 1) * 1000);
    });
  }

  private logError(error: EnhancedError): void {
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
    
    console.error('Enhanced Error:', {
      message: error.message,
      context: error.context,
      timestamp: new Date(error.timestamp).toISOString(),
      stack: error.stack
    });
  }

  getRecentErrors(count: number = 10): EnhancedError[] {
    return this.errorLog.slice(0, count);
  }

  getServiceHealth(): Record<string, { healthy: boolean; lastError?: EnhancedError }> {
    const services = ['Gemini AI', 'Perspective API', 'Google Cloud NLP', 'IPQS', 'Web Risk'];
    const health: Record<string, { healthy: boolean; lastError?: EnhancedError }> = {};

    services.forEach(service => {
      const recentErrors = this.errorLog
        .filter(error => error.context?.service === service)
        .slice(0, 5);
      
      const recentFailures = recentErrors.filter(
        error => Date.now() - error.timestamp < 5 * 60 * 1000 // Last 5 minutes
      );

      health[service] = {
        healthy: recentFailures.length < 3,
        lastError: recentErrors[0]
      };
    });

    return health;
  }
}

export const errorHandler = ErrorHandler.getInstance();
