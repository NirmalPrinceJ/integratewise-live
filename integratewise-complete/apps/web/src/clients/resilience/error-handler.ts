// src/services/resilience/error-handler.ts
// Comprehensive Error Handling and Recovery System

interface ErrorContext {
  userId?: string;
  requestId?: string;
  service: string;
  operation: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorRecoveryStrategy {
  name: string;
  condition: (error: Error, context: ErrorContext) => boolean;
  action: (error: Error, context: ErrorContext) => Promise<any>;
  maxRetries?: number;
  backoffMs?: number;
}

interface ErrorClassification {
  type: 'transient' | 'permanent' | 'rate_limit' | 'auth' | 'validation' | 'external' | 'internal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
  userMessage: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export class ErrorHandler {
  private recoveryStrategies: ErrorRecoveryStrategy[] = [];
  private errorCounts: Map<string, number> = new Map();
  private alertThresholds: Map<string, number> = new Map();

  constructor() {
    this.initializeRecoveryStrategies();
    this.initializeAlertThresholds();
  }

  private initializeRecoveryStrategies() {
    // Network timeout recovery
    this.recoveryStrategies.push({
      name: 'network_retry',
      condition: (error) => error.message.includes('timeout') || error.message.includes('network'),
      action: async (error, context) => {
        console.log(`Retrying ${context.operation} due to network error`);
        // In practice, this would retry the original operation
        return { retry: true, delay: 1000 };
      },
      maxRetries: 3,
      backoffMs: 1000
    });

    // Rate limit recovery
    this.recoveryStrategies.push({
      name: 'rate_limit_backoff',
      condition: (error) => error.message.includes('rate limit') || error.message.includes('429'),
      action: async (error, context) => {
        const backoffTime = this.calculateBackoff(context);
        console.log(`Backing off ${context.operation} for ${backoffTime}ms due to rate limit`);
        await this.delay(backoffTime);
        return { retry: true, delay: 0 };
      },
      maxRetries: 5,
      backoffMs: 2000
    });

    // Authentication refresh
    this.recoveryStrategies.push({
      name: 'auth_refresh',
      condition: (error) => error.message.includes('unauthorized') || error.message.includes('401'),
      action: async (error, context) => {
        console.log(`Attempting to refresh authentication for ${context.operation}`);
        // In practice, this would refresh tokens
        return { retry: true, delay: 0 };
      },
      maxRetries: 1
    });

    // External service degradation
    this.recoveryStrategies.push({
      name: 'service_degradation',
      condition: (error, context) => context.service === 'external' && this.isServiceDegraded(context.service),
      action: async (error, context) => {
        console.log(`Using degraded mode for ${context.operation}`);
        // Return cached or default data
        return { degraded: true, data: this.getDegradedResponse(context) };
      },
      maxRetries: 0
    });
  }

  private initializeAlertThresholds() {
    this.alertThresholds.set('auth_errors', 10);
    this.alertThresholds.set('rate_limits', 5);
    this.alertThresholds.set('external_failures', 20);
    this.alertThresholds.set('internal_errors', 50);
  }

  async handleError(error: Error, context: ErrorContext): Promise<any> {
    const classification = this.classifyError(error, context);
    const errorKey = `${context.service}_${classification.type}`;

    // Increment error count
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // Log the error
    this.logError(error, classification, context);

    // Check for alerts
    this.checkAlerts(errorKey, classification);

    // Attempt recovery
    if (classification.retryable) {
      return await this.attemptRecovery(error, context);
    }

    // If not retryable, throw user-friendly error
    throw new Error(classification.userMessage);
  }

  private classifyError(error: Error, context: ErrorContext): ErrorClassification {
    const message = error.message.toLowerCase();

    if (message.includes('timeout') || message.includes('network') || message.includes('connection')) {
      return {
        type: 'transient',
        severity: 'medium',
        retryable: true,
        userMessage: 'Service temporarily unavailable. Please try again.',
        logLevel: 'warn'
      };
    }

    if (message.includes('rate limit') || message.includes('429')) {
      return {
        type: 'rate_limit',
        severity: 'medium',
        retryable: true,
        userMessage: 'Too many requests. Please wait a moment.',
        logLevel: 'warn'
      };
    }

    if (message.includes('unauthorized') || message.includes('401') || message.includes('forbidden') || message.includes('403')) {
      return {
        type: 'auth',
        severity: 'high',
        retryable: false,
        userMessage: 'Authentication required. Please log in again.',
        logLevel: 'error'
      };
    }

    if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
      return {
        type: 'validation',
        severity: 'low',
        retryable: false,
        userMessage: 'Invalid input. Please check your data.',
        logLevel: 'info'
      };
    }

    if (context.service === 'external') {
      return {
        type: 'external',
        severity: 'medium',
        retryable: true,
        userMessage: 'External service error. Please try again later.',
        logLevel: 'error'
      };
    }

    // Default to internal error
    return {
      type: 'internal',
      severity: 'high',
      retryable: false,
      userMessage: 'An unexpected error occurred. Please contact support.',
      logLevel: 'error'
    };
  }

  private async attemptRecovery(error: Error, context: ErrorContext): Promise<any> {
    for (const strategy of this.recoveryStrategies) {
      if (strategy.condition(error, context)) {
        try {
          const result = await strategy.action(error, context);

          if (result.retry) {
            // Implement retry logic with backoff
            return await this.retryWithBackoff(
              () => this.simulateRetry(context),
              strategy.maxRetries || 3,
              strategy.backoffMs || 1000
            );
          }

          if (result.degraded) {
            return result.data;
          }

          return result;
        } catch (recoveryError) {
          console.error(`Recovery strategy ${strategy.name} failed:`, recoveryError);
          continue;
        }
      }
    }

    throw error; // No recovery strategy worked
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    backoffMs: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          const delay = backoffMs * Math.pow(2, attempt - 1); // Exponential backoff
          await this.delay(delay);
        }
      }
    }

    throw lastError!;
  }

  private async simulateRetry(context: ErrorContext): Promise<any> {
    // In practice, this would retry the original operation
    console.log(`Retrying ${context.operation} for ${context.service}`);
    // Simulate success for demo
    return { success: true, retried: true };
  }

  private isServiceDegraded(serviceName: string): boolean {
    // Check if service has high error rates
    const errorCount = Array.from(this.errorCounts.entries())
      .filter(([key]) => key.startsWith(`${serviceName}_`))
      .reduce((sum, [, count]) => sum + count, 0);

    return errorCount > 10; // Threshold for degradation
  }

  private getDegradedResponse(context: ErrorContext): any {
    // Return cached or default data for degraded mode
    switch (context.operation) {
      case 'get_tasks':
        return { tasks: [], degraded: true, message: 'Using cached data' };
      case 'get_accounts':
        return { accounts: [], degraded: true, message: 'Service temporarily limited' };
      default:
        return { degraded: true, message: 'Service operating in degraded mode' };
    }
  }

  private calculateBackoff(context: ErrorContext): number {
    // Calculate backoff based on error history
    const errorKey = `${context.service}_rate_limit`;
    const errorCount = this.errorCounts.get(errorKey) || 0;

    // Exponential backoff with jitter
    const baseDelay = 1000 * Math.pow(2, errorCount);
    const jitter = Math.random() * 1000;

    return Math.min(baseDelay + jitter, 30000); // Max 30 seconds
  }

  private logError(error: Error, classification: ErrorClassification, context: ErrorContext) {
    const logEntry = {
      level: classification.logLevel,
      message: error.message,
      stack: error.stack,
      classification,
      context,
      timestamp: new Date().toISOString()
    };

    console[classification.logLevel](JSON.stringify(logEntry));

    // In production, send to logging service
  }

  private checkAlerts(errorKey: string, classification: ErrorClassification) {
    const threshold = this.alertThresholds.get(errorKey) || this.alertThresholds.get(classification.type) || 100;
    const currentCount = this.errorCounts.get(errorKey) || 0;

    if (currentCount >= threshold) {
      this.sendAlert(errorKey, currentCount, classification);
    }
  }

  private sendAlert(errorKey: string, count: number, classification: ErrorClassification) {
    const alert = {
      type: 'error_threshold_exceeded',
      errorKey,
      count,
      severity: classification.severity,
      message: `Error threshold exceeded for ${errorKey}: ${count} errors`,
      timestamp: new Date().toISOString()
    };

    console.error('ALERT:', JSON.stringify(alert));

    // In production, send to alerting system (PagerDuty, Slack, etc.)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for monitoring
  getErrorStats() {
    return {
      errorCounts: Object.fromEntries(this.errorCounts),
      alertThresholds: Object.fromEntries(this.alertThresholds)
    };
  }

  resetErrorCounts() {
    this.errorCounts.clear();
  }
}

// Export singleton
export const errorHandler = new ErrorHandler();