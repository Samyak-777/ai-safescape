
// Circuit Breaker pattern for resilient API calls
export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 10000, // 10 seconds
      ...config,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Global circuit breakers for different services
export const circuitBreakers = {
  googleNLP: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
  perspective: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
  webRisk: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
  ipqs: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
  arya: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
  gemini: new CircuitBreaker({ failureThreshold: 3, resetTimeout: 30000 }),
};
