# Rate Limiting Configuration

## Overview

Rate limiting is environment-aware:
- **Development (Local)**: DISABLED - No rate limits for testing
- **Staging**: REDUCED - Relaxed limits for integration testing
- **Production**: FULL - Strict limits for DDoS protection

## Middleware Implementation

### Example Rate Limiter (TypeScript)

```typescript
// services/*/src/middleware/rate-limit.ts

interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  enabled: boolean
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  development: {
    requestsPerMinute: Infinity,
    requestsPerHour: Infinity,
    enabled: false, // Disabled in development
  },
  staging: {
    requestsPerMinute: 1000,
    requestsPerHour: 10000,
    enabled: true,
  },
  production: {
    requestsPerMinute: 100,
    requestsPerHour: 1000,
    enabled: true,
  },
}

export async function rateLimitMiddleware(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {
  const environment = env.ENVIRONMENT || 'production'
  const config = RATE_LIMITS[environment] || RATE_LIMITS.production

  // Skip rate limiting in development
  if (!config.enabled) {
    console.log('[Rate Limit] Disabled in development mode')
    return null // Continue to next middleware
  }

  // Implement rate limiting for staging/production
  const clientId = request.headers.get('CF-Connecting-IP') || 'unknown'
  const minuteKey = `rate_limit:minute:${clientId}:${Math.floor(Date.now() / 60000)}`
  const hourKey = `rate_limit:hour:${clientId}:${Math.floor(Date.now() / 3600000)}`

  // Check KV store for rate limit data
  const minuteCount = parseInt(await env.CACHE.get(minuteKey) || '0')
  const hourCount = parseInt(await env.CACHE.get(hourKey) || '0')

  if (minuteCount >= config.requestsPerMinute) {
    return new Response('Rate limit exceeded - too many requests per minute', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': config.requestsPerMinute.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Math.floor(Date.now() / 60000) * 60 + 60).toString(),
      },
    })
  }

  if (hourCount >= config.requestsPerHour) {
    return new Response('Rate limit exceeded - too many requests per hour', {
      status: 429,
      headers: {
        'Retry-After': '3600',
        'X-RateLimit-Limit': config.requestsPerHour.toString(),
        'X-RateLimit-Remaining': '0',
      },
    })
  }

  // Increment counters
  ctx.waitUntil(
    Promise.all([
      env.CACHE.put(minuteKey, (minuteCount + 1).toString(), { expirationTtl: 120 }),
      env.CACHE.put(hourKey, (hourCount + 1).toString(), { expirationTtl: 7200 }),
    ])
  )

  return null // Continue to next middleware
}
```

### Integration with Service

```typescript
// services/gateway/src/index.ts

import { rateLimitMiddleware } from './middleware/rate-limit'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Rate limiting middleware
    const rateLimitResponse = await rateLimitMiddleware(request, env, ctx)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Continue with normal request handling
    return handleRequest(request, env, ctx)
  },
}
```

## Environment Detection

### Wrangler Configuration

```toml
# wrangler.toml

[dev]
port = 8001
local_protocol = "http"

[env.development]
vars = { ENVIRONMENT = "development" }

[env.staging]
vars = { ENVIRONMENT = "staging" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

### Runtime Detection

```typescript
const environment = process.env.ENVIRONMENT || 'production'
const isDevelopment = environment === 'development'
const isProduction = environment === 'production'
```

## Testing Without Rate Limits

### Local Development

When running locally with `pnpm dev:services`, rate limiting is automatically disabled:

```bash
# Start services (rate limiting disabled)
pnpm dev:services

# Make unlimited requests
for i in {1..1000}; do
  curl http://localhost:8001/api/test
done
```

### Integration Tests

Integration tests run against local services without rate limits:

```typescript
// src/__tests__/integration/api.test.ts

describe('API Integration Tests', () => {
  it('should handle 1000 requests without rate limiting', async () => {
    const requests = Array.from({ length: 1000 }, (_, i) =>
      fetch('http://localhost:8001/api/test')
    )

    const responses = await Promise.all(requests)
    const statuses = responses.map(r => r.status)

    // All requests should succeed (no 429 rate limit errors)
    expect(statuses).not.toContain(429)
  })
})
```

## Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

In development, these headers show infinity:

```
X-RateLimit-Limit: ∞
X-RateLimit-Remaining: ∞
X-RateLimit-Reset: N/A
```

## Bypassing Rate Limits (Staging/Testing)

### API Key Bypass

For automated testing in staging:

```typescript
export async function rateLimitMiddleware(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {
  // Check for bypass token
  const apiKey = request.headers.get('X-API-Key')
  if (apiKey && apiKey === env.BYPASS_TOKEN) {
    return null // Skip rate limiting
  }

  // Continue with normal rate limiting...
}
```

Set `BYPASS_TOKEN` in staging environment for CI/CD tests.

## Monitoring Rate Limits

### Cloudflare Analytics

Monitor rate limit hits:
- Dashboard → Analytics → Rate Limiting
- View blocked requests
- Identify abusive IPs

### Custom Metrics

Log rate limit events:

```typescript
if (minuteCount >= config.requestsPerMinute) {
  console.log({
    event: 'rate_limit_exceeded',
    clientId,
    minuteCount,
    limit: config.requestsPerMinute,
  })
}
```

## Adjusting Limits

### Per-User Limits

Implement user-specific limits:

```typescript
const userLimits = {
  free: { requestsPerMinute: 10 },
  pro: { requestsPerMinute: 100 },
  enterprise: { requestsPerMinute: 1000 },
}

const user = await authenticateUser(request)
const config = userLimits[user.plan]
```

### Per-Endpoint Limits

Different limits for different endpoints:

```typescript
const endpointLimits = {
  '/api/search': { requestsPerMinute: 10 },
  '/api/data': { requestsPerMinute: 100 },
  '/api/health': { requestsPerMinute: Infinity },
}

const url = new URL(request.url)
const config = endpointLimits[url.pathname] || defaultLimits
```

## Troubleshooting

### Rate Limit Not Disabled Locally

Check environment variable:

```bash
echo $ENVIRONMENT
# Should be "development"
```

Check wrangler output:

```bash
pnpm dev
# Should show: Environment: development
```

### False Positives in Production

Review rate limit logs:
- Identify legitimate high-traffic users
- Whitelist known IPs
- Increase limits for verified users
