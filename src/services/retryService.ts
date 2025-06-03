
// Retry mechanism with exponential backoff
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class RetryService {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2,
      ...config,
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === this.config.maxAttempts || !shouldRetry(error)) {
          throw error;
        }

        const delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
          this.config.maxDelay
        );

        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Helper function to determine if an error is retryable
export const isRetryableError = (error: any): boolean => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true; // Network error
  }
  
  if (error.message && error.message.includes('timeout')) {
    return true; // Timeout error
  }
  
  if (error.status && error.status >= 500 && error.status < 600) {
    return true; // Server error
  }
  
  if (error.status === 429) {
    return true; // Rate limit - should retry with backoff
  }
  
  return false;
};

export const retryService = new RetryService();
