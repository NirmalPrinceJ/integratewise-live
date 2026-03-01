# Deployment Guide

This document describes the deployment strategy for IntegrateWise OS across all environments.

## Environments

### Development
- **Branch**: `dev`
- **URL**: `https://dev.integratewise.ai`
- **Protocol**: HTTP (local), HTTPS (deployed)
- **Auto-deploy**: On push to `dev`
- **Rate Limiting**: Disabled
- **Tests**: None (fast deployment)

### Staging
- **Branch**: `staging`
- **URL**: `https://staging.integratewise.ai`
- **Protocol**: HTTPS
- **Auto-deploy**: On push to `staging` or PR to `main`
- **Rate Limiting**: Reduced limits
- **Tests**: Unit + E2E tests must pass

### Production
- **Branch**: `main`
- **URL**: `https://integratewise.ai`
- **Protocol**: HTTPS
- **Auto-deploy**: On push to `main` or release
- **Approval**: Manual approval required
- **Rate Limiting**: Full production limits
- **Tests**: Full test suite + coverage checks
- **Rollback**: Automatic on health check failure

## Deployment Strategy

### Incremental Service Deployment

Only changed services are deployed:

```bash
# Detects changed files and deploys only affected services
git diff HEAD~1 --name-only | grep "services/gateway" && deploy gateway
```

### Gradual Rollout (Production)

Services are deployed one at a time in production:
- Deploy service
- Wait 30 seconds
- Verify health
- Deploy next service

### Health Checks

All deployments verify:
- HTTP 200 response from `/health` endpoint
- Service responds within 5 seconds
- 5 retry attempts with exponential backoff

### Automatic Rollback

Production deployments rollback automatically if:
- Health check fails after deployment
- Error rate exceeds 5%
- Response time exceeds 2s p95

Rollback process:
1. Checkout previous git commit
2. Redeploy previous version
3. Create incident issue
4. Notify team

## Required Secrets

Configure these in GitHub repository settings:

```
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

## Deployment Workflows

### Deploy to Development

```bash
git push origin dev
```

- Instant deployment
- No tests required
- Hot reload enabled

### Deploy to Staging

```bash
git push origin staging
```

- Runs unit + E2E tests
- Deploys on test success
- Health checks after deployment
- Rollback on failure

### Deploy to Production

```bash
git push origin main
# or
gh release create v1.0.0
```

- Requires manual approval
- Full test suite runs
- Services deploy one at a time
- Comprehensive health checks
- Automatic rollback on failure
- Incident issue created on failure

## Local Development Deployment

### Start All Services Locally

```bash
# Start all microservices
pnpm dev:services

# Start frontend + services
pnpm dev:all
```

### Deploy Single Service

```bash
cd services/gateway
pnpm wrangler deploy --env development
```

### Test with Local Services

```bash
# Start services and run integration tests
pnpm test:integration:live
```

## Environment Variables

### Development (Local)

Copy `.env.development.example` to `.env.development`:

```bash
cp .env.development.example .env.development
```

Services use HTTP and localhost URLs.

### Staging / Production

Set environment variables in:
- Cloudflare dashboard for Workers
- GitHub secrets for deployment workflows

## Service Configuration

Each service has environment-specific configuration in `wrangler.toml`:

```toml
# Development - HTTP, localhost
[dev]
port = 8001
local_protocol = "http"

[env.development]
vars = { ENVIRONMENT = "development", SERVICE_URL = "http://localhost:8002" }

# Staging - HTTPS, reduced limits
[env.staging]
vars = { ENVIRONMENT = "staging", SERVICE_URL = "https://service-staging.integratewise.ai" }

# Production - HTTPS, full limits
[env.production]
vars = { ENVIRONMENT = "production", SERVICE_URL = "https://service.integratewise.ai" }
```

## Rate Limiting Configuration

### Development (Local)

Rate limiting is **disabled** in development:

```typescript
// services/*/src/middleware/rate-limit.ts
const isDevelopment = process.env.ENVIRONMENT === 'development'
if (isDevelopment) {
  return next() // Skip rate limiting
}
```

### Staging

Reduced rate limits for testing:
- 1000 requests/minute per IP
- 10000 requests/hour per user

### Production

Full production rate limits:
- 100 requests/minute per IP
- 1000 requests/hour per user
- DDoS protection enabled

## Monitoring

### Development

- Local console logging
- OpenTelemetry traces to localhost:4318

### Staging

- Cloudflare Analytics
- Error tracking
- Performance monitoring

### Production

- Full observability stack
- Alerts on high error rates
- Performance degradation alerts
- Anomaly detection

## Rollback Procedures

### Manual Rollback

```bash
# Checkout previous version
git checkout <previous-commit>

# Deploy to environment
pnpm wrangler deploy --env production
```

### Automatic Rollback

Triggered automatically on:
- Failed health checks
- High error rate (>5%)
- Slow response times (>2s p95)

### Rollback Verification

After rollback:
1. Check all services return 200 OK
2. Verify error rates return to normal
3. Check response times
4. Monitor for 15 minutes

## Troubleshooting

### Deployment Fails

Check workflow logs:
```bash
gh run list --workflow=deploy-production.yml
gh run view <run-id> --log
```

### Service Won't Start

Check Wrangler logs:
```bash
wrangler tail <service-name> --env production
```

### Health Check Fails

Test endpoint manually:
```bash
curl -v https://gateway.integratewise.ai/health
```

### Rollback Fails

Manual recovery:
1. Identify last known good version
2. Deploy manually: `pnpm wrangler deploy --env production`
3. Verify all services healthy
4. Update incident issue

## Best Practices

1. **Always test in staging first**
2. **Deploy during low-traffic hours**
3. **Monitor for 15 minutes after deployment**
4. **Keep deployments small and frequent**
5. **Have rollback plan ready**
6. **Communicate deployments to team**
