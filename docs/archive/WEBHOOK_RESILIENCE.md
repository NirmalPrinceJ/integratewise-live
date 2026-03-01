# Webhook Processing with Resilience Patterns

This guide demonstrates best practices for implementing webhook processing with comprehensive resilience patterns in the IntegrateWise system.

## Overview

The webhook processing system implements multiple layers of resilience to handle:

- **Connection Errors**: Automatic retry until successful with exponential backoff
- **API Rate Limits**: Intelligent detection and handling of rate limiting
- **Governor Limits**: Handling of quota and daily/monthly limits
- **Circuit Breakers**: Prevention of cascade failures
- **Comprehensive Error Handling**: Structured error responses and logging

## Core Components

### 1. Error Handling Framework (`packages/lib/src/error-handling.ts`)

Provides standardized error handling with specialized retry mechanisms:

```typescript
import {
  withConnectionRetry,
  withRateLimitHandling,
  withApiResilience,
  CircuitBreaker,
  createAppError
} from '@integratewise/lib/error-handling';

// Connection retry with jitter
await withConnectionRetry(
  async () => {
    return await fetch('https://api.example.com/webhook');
  },
  {
    maxAttempts: 10,
    baseDelay: 1000,
    maxDelay: 300000, // 5 minutes
    jitter: true,
    onRetry: (attempt, error, delay) => {
      console.log(`Retry ${attempt} after ${delay}ms: ${error.message}`);
    }
  }
);
```

### 2. Resilient API Client (`packages/lib/src/api-client.ts`)

Pre-configured API client with built-in resilience:

```typescript
import { ApiClientFactory } from '@integratewise/lib/api-client';

// Create a client for Stripe API
const stripeClient = ApiClientFactory.createStripeClient(process.env.STRIPE_SECRET_KEY);

// Make resilient requests
const payment = await stripeClient.post('/v1/payment_intents', {
  amount: 1000,
  currency: 'usd'
});
```

### 3. Webhook Processor (`packages/lib/src/webhook-processor.ts`)

High-level webhook processing with all resilience patterns:

```typescript
import { WebhookProcessorFactory } from '@integratewise/lib/webhook-processor';

const processor = WebhookProcessorFactory.createHighVolumeProcessor();

const result = await processor.processWebhook(webhookPayload, async (webhook) => {
  // Process webhook business logic
  await processWebhookData(webhook);
});
```

## Best Practices

### 1. Connection Error Handling

**Problem**: Network issues, DNS failures, temporary service unavailability.

**Solution**: Implement retry logic that continues until successful:

```typescript
// Use withConnectionRetry for operations that must succeed
await withConnectionRetry(
  async () => {
    return await databaseConnection.query('SELECT * FROM events');
  },
  {
    maxAttempts: 10,        // Keep trying for a long time
    baseDelay: 1000,        // Start with 1 second
    maxDelay: 300000,       // Up to 5 minutes
    jitter: true,           // Add randomness to prevent thundering herd
    retryCondition: (error) => {
      return error.code === 'ECONNREFUSED' ||
             error.code === 'ENOTFOUND' ||
             error.message.includes('timeout');
    }
  }
);
```

### 2. API Rate Limiting

**Problem**: External APIs limit request frequency.

**Solution**: Detect rate limits and implement intelligent backoff:

```typescript
await withRateLimitHandling(
  async () => {
    return await externalAPI.call('/endpoint');
  },
  {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 3600000, // 1 hour
    detectRateLimit: (error) => {
      if (error.statusCode === 429) {
        const retryAfter = error.headers?.['retry-after'];
        return {
          isRateLimit: true,
          retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : undefined
        };
      }
      return { isRateLimit: false };
    },
    onRateLimit: (retryAfter, attempt) => {
      console.log(`Rate limited, waiting ${retryAfter}ms (attempt ${attempt})`);
    }
  }
);
```

### 3. Governor Limits

**Problem**: API quotas (daily, monthly, total requests).

**Solution**: More aggressive backoff for governor limits:

```typescript
await withRateLimitHandling(
  async () => {
    return await externalAPI.call('/endpoint');
  },
  {
    maxAttempts: 3,
    baseDelay: 60000,     // Start with 1 minute
    maxDelay: 86400000,   // Up to 24 hours
    detectGovernorLimit: (error) => {
      const message = error.message.toLowerCase();
      return {
        isGovernorLimit: message.includes('quota exceeded') ||
                        message.includes('daily limit') ||
                        message.includes('monthly limit')
      };
    },
    onGovernorLimit: (retryAfter, attempt) => {
      console.log(`Governor limit hit, waiting ${retryAfter}ms (attempt ${attempt})`);
    }
  }
);
```

### 4. Circuit Breaker Pattern

**Problem**: Failing services causing cascade failures.

**Solution**: Temporarily stop calling failing services:

```typescript
const circuitBreaker = new CircuitBreaker(5, 60000); // 5 failures, 1 minute recovery

const result = await circuitBreaker.execute(async () => {
  return await unreliableService.call();
});

// Check circuit breaker state
if (circuitBreaker.getState() === 'open') {
  // Service is down, use fallback
  return fallbackResponse;
}
```

### 5. Rate Limiting Strategies

Choose the appropriate rate limiting strategy:

```typescript
// Token Bucket: Smooth rate limiting
const tokenBucket = new TokenBucket(100, 10); // 100 tokens, refill 10/sec

// Sliding Window: Burst protection
const slidingWindow = new SlidingWindowLimiter(60000, 100); // 100 requests/minute

// Adaptive: Adjusts based on success/failure
const adaptive = new AdaptiveRateLimiter(10); // Start at 10 requests/sec
adaptive.recordSuccess(); // Increase rate
adaptive.recordError();   // Decrease rate
```

### 6. Combined Resilience

Use `withApiResilience` for comprehensive protection:

```typescript
await withApiResilience(
  async () => {
    return await externalAPI.call('/critical-endpoint');
  },
  {
    connectionMaxAttempts: 10,
    rateLimitMaxAttempts: 5,
    governorMaxAttempts: 3,
    onConnectionRetry: (attempt, error, delay) => {
      console.log(`Connection retry ${attempt}: ${error.message}`);
    },
    onRateLimit: (retryAfter, attempt) => {
      console.log(`Rate limit retry after ${retryAfter}ms`);
    },
    onGovernorLimit: (retryAfter, attempt) => {
      console.log(`Governor limit retry after ${retryAfter}ms`);
    }
  }
);
```

## Configuration Examples

### High-Volume Webhooks (Stripe, GitHub)

```typescript
const processor = new WebhookProcessor({
  maxConnectionRetries: 15,
  connectionBaseDelay: 500,
  connectionMaxDelay: 600000, // 10 minutes

  maxRateLimitRetries: 10,
  rateLimitBaseDelay: 2000,
  rateLimitMaxDelay: 7200000, // 2 hours

  circuitBreaker: {
    failureThreshold: 10,
    recoveryTimeout: 300000 // 5 minutes
  },

  rateLimit: {
    type: 'adaptive',
    config: { baseRate: 50 }
  }
});
```

### Critical Webhooks (Payment Failures, Security Events)

```typescript
const processor = new WebhookProcessor({
  maxConnectionRetries: 20,
  connectionBaseDelay: 1000,
  connectionMaxDelay: 1800000, // 30 minutes

  maxGovernorRetries: 10,
  governorBaseDelay: 600000, // 10 minutes
  governorMaxDelay: 604800000, // 1 week

  circuitBreaker: {
    failureThreshold: 3, // Lower threshold
    recoveryTimeout: 600000 // 10 minutes
  },

  rateLimit: {
    type: 'token-bucket',
    config: { capacity: 10, refillRate: 1 } // Conservative
  }
});
```

### Third-Party Integrations

```typescript
const processor = new WebhookProcessor({
  maxRateLimitRetries: 8,
  rateLimitBaseDelay: 10000, // 10 seconds
  rateLimitMaxDelay: 3600000,

  circuitBreaker: {
    failureThreshold: 8,
    recoveryTimeout: 900000 // 15 minutes
  },

  rateLimit: {
    type: 'sliding-window',
    config: {
      windowSize: 60000, // 1 minute
      maxRequests: 30
    }
  }
});
```

## Monitoring and Observability

### Health Checks

```typescript
// Get processor status
const rateLimitStatus = processor.getRateLimitStatus();
const circuitBreakerStatus = processor.getCircuitBreakerStatus();

console.log('Rate limiter:', rateLimitStatus);
console.log('Circuit breaker:', circuitBreakerStatus);
```

### Metrics to Monitor

- **Connection retry attempts**: Number of retries per operation
- **Rate limit hits**: Frequency of rate limiting
- **Circuit breaker state**: Open/closed status
- **Processing latency**: Time to process webhooks
- **Error rates**: Success/failure ratios
- **Queue depth**: Backlog of pending webhooks

### Logging Best Practices

```typescript
// Structured logging with correlation IDs
log.info('Webhook processing started', {
  correlationId,
  webhookId: webhook.id,
  eventType: webhook.eventType,
  attempt: currentAttempt
});

log.error('Webhook processing failed', {
  correlationId,
  webhookId: webhook.id,
  error: error.message,
  retryable: isRetryable,
  nextRetryAt: calculateNextRetry()
});
```

## Error Classification

### Retryable Errors
- Network timeouts
- Connection refused
- DNS resolution failures
- HTTP 5xx errors
- Rate limiting (429)
- Temporary service unavailability

### Non-Retryable Errors
- Authentication failures (401/403)
- Invalid request data (400)
- Not found (404)
- Validation errors
- Business logic violations

## Testing Resilience

### Unit Tests

```typescript
describe('Webhook Processor Resilience', () => {
  it('should retry on connection errors', async () => {
    let attempts = 0;
    const mockOperation = jest.fn(() => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Connection refused');
      }
      return 'success';
    });

    const result = await withConnectionRetry(mockOperation, {
      maxAttempts: 5,
      retryCondition: (error) => error.message.includes('Connection')
    });

    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should handle rate limiting', async () => {
    const mockAPI = jest.fn()
      .mockRejectedValueOnce({ statusCode: 429, headers: { 'retry-after': '2' } })
      .mockResolvedValueOnce('success');

    const result = await withRateLimitHandling(mockAPI);

    expect(result).toBe('success');
    expect(mockAPI).toHaveBeenCalledTimes(2);
  });
});
```

### Integration Tests

```typescript
describe('End-to-End Resilience', () => {
  it('should process webhooks under load', async () => {
    // Simulate high load with rate limiting
    const webhooks = generateWebhookBatch(1000);

    const results = await processor.processWebhooksBatch(webhooks, async (webhook) => {
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error('Simulated failure');
      }
      await processWebhook(webhook);
    });

    const successCount = results.filter(r => r.success).length;
    expect(successCount).toBeGreaterThan(900); // >90% success rate
  });
});
```

## Migration Guide

### From Basic to Resilient Webhooks

1. **Replace direct fetch calls**:
   ```typescript
   // Before
   const response = await fetch(url, options);

   // After
   const response = await withApiResilience(() => fetch(url, options));
   ```

2. **Add webhook processors**:
   ```typescript
   // Before
   export async function handleWebhook(req, res) {
     // Basic processing
   }

   // After
   const processor = WebhookProcessorFactory.createHighVolumeProcessor();

   export async function handleWebhook(req, res) {
     const result = await processor.processWebhook(webhookPayload, async (webhook) => {
       // Processing logic
     });
   }
   ```

3. **Add health checks**:
   ```typescript
   app.get('/health/webhooks', async (req, res) => {
     const status = {
       rateLimiter: processor.getRateLimitStatus(),
       circuitBreaker: processor.getCircuitBreakerStatus()
     };
     res.json(status);
   });
   ```

## Troubleshooting

### Common Issues

1. **Infinite retries**: Set appropriate `maxAttempts` and `maxDelay`
2. **Thundering herd**: Use `jitter: true` in retry options
3. **Circuit breaker not recovering**: Check `recoveryTimeout` value
4. **Rate limiter too restrictive**: Monitor and adjust rates
5. **Governor limits**: Implement longer backoff periods

### Debug Commands

```bash
# Check webhook processor status
curl http://localhost:3000/health/webhooks

# Monitor retry attempts
grep "webhook.*retry" logs/application.log

# Check circuit breaker state
curl http://localhost:3000/metrics | grep circuit_breaker
```

This comprehensive approach ensures webhook processing is reliable, scalable, and resilient to various failure modes while maintaining optimal performance.