// src/services/resilience/circuit-breaker.ts
// Circuit Breaker Pattern for External Service Resilience

interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  recoveryTimeout: number; // Time to wait before trying again (ms)
  monitoringPeriod: number; // Time window for failure counting (ms)
  successThreshold: number; // Number of successes needed to close
}

interface CircuitBreakerState {
  status: 'closed' | 'open' | 'half-open';
  failures: number;
  successes: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private serviceName: string;

  constructor(serviceName: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.serviceName = serviceName;
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      monitoringPeriod: 60000, // 1 minute
      successThreshold: 3,
      ...config
    };

    this.state = {
      status: 'closed',
      failures: 0,
      successes: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.status === 'open') {
      if (Date.now() < this.state.nextAttemptTime) {
        throw new Error(`Circuit breaker is OPEN for ${this.serviceName}`);
      }

      // Transition to half-open
      this.state.status = 'half-open';
      console.log(`Circuit breaker HALF-OPEN for ${this.serviceName}`);
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
    this.state.failures = 0;

    if (this.state.status === 'half-open') {
      this.state.successes++;

      if (this.state.successes >= this.config.successThreshold) {
        // Close the circuit
        this.state.status = 'closed';
        this.state.successes = 0;
        console.log(`Circuit breaker CLOSED for ${this.serviceName}`);
      }
    }

    // Reset monitoring window if needed
    this.resetMonitoringWindow();
  }

  private onFailure() {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();

    if (this.state.status === 'half-open') {
      // Go back to open
      this.state.status = 'open';
      this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      this.state.successes = 0;
      console.log(`Circuit breaker OPEN (from half-open) for ${this.serviceName}`);
    } else if (this.state.failures >= this.config.failureThreshold) {
      // Open the circuit
      this.state.status = 'open';
      this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      console.log(`Circuit breaker OPEN for ${this.serviceName}`);
    }
  }

  private resetMonitoringWindow() {
    const now = Date.now();
    if (now - this.state.lastFailureTime > this.config.monitoringPeriod) {
      this.state.failures = 0;
    }
  }

  getState(): CircuitBreakerState & { serviceName: string } {
    return {
      ...this.state,
      serviceName: this.serviceName
    };
  }

  // Force state changes (for testing/admin)
  forceOpen() {
    this.state.status = 'open';
    this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
  }

  forceClose() {
    this.state.status = 'closed';
    this.state.failures = 0;
    this.state.successes = 0;
  }
}

// Circuit Breaker Registry
export class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map();

  getBreaker(serviceName: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(serviceName, config));
    }

    return this.breakers.get(serviceName)!;
  }

  getAllStates() {
    const states: Array<CircuitBreakerState & { serviceName: string }> = [];

    for (const [serviceName, breaker] of this.breakers) {
      states.push(breaker.getState());
    }

    return states;
  }

  resetAll() {
    for (const breaker of this.breakers.values()) {
      breaker.forceClose();
    }
  }
}

// Global registry
export const circuitBreakerRegistry = new CircuitBreakerRegistry();