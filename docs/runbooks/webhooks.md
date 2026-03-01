# Webhooks Runbook

## Overview
IntegrateWise uses Cloudflare Workers to receive and process webhooks from Stripe and HubSpot. This runbook covers operations and incident response.

## Architecture
- **Runtime**: Cloudflare Workers
- **Signature Verification**: HMAC-SHA256 (Stripe), HMAC-SHA256 v3 (HubSpot)
- **Idempotency**: KV store with 24h TTL
- **Dead Letter**: Cloudflare Queue

## Key Environment Variables
| Variable | Description | Set Via |
|----------|-------------|---------|
| `STRIPE_WEBHOOK_SECRET` | Stripe signing secret | `wrangler secret put` |
| `HUBSPOT_WEBHOOK_SECRET` | HubSpot signing secret | `wrangler secret put` |
| `CORE_ENGINE_URL` | Backend API URL | `wrangler.toml` |

## Endpoints
| Provider | URL | Method |
|----------|-----|--------|
| Stripe | `/webhooks/stripe` | POST |
| HubSpot | `/webhooks/hubspot` | POST |
| Health | `/health` | GET |

## Common Operations

### Deploy Webhook Worker

```bash
cd apps/integratewise-webhooks
wrangler deploy --env production
```

### Set/Update Secrets

```bash
wrangler secret put STRIPE_WEBHOOK_SECRET --env production
wrangler secret put HUBSPOT_WEBHOOK_SECRET --env production
```

### View Logs

```bash
wrangler tail --env production
```

### Create KV Namespace

```bash
# Create namespace
wrangler kv:namespace create WEBHOOK_IDEMPOTENCY

# Update wrangler.toml with returned ID
```

### Create Dead Letter Queue

```bash
# Create queue
wrangler queues create webhook-dead-letter

# View queue
wrangler queues list
```

### Process Dead Letter Queue

1. List failed events:
   ```bash
   wrangler queues messages webhook-dead-letter
   ```

2. Retry or acknowledge:
   ```bash
   # Create consumer to process
   wrangler queues consumer add webhook-dead-letter webhook-dlq-processor
   ```

## Signature Verification

### Stripe
```typescript
// timestamp.signature format: t=123456789,v1=abc123...
const [timestamp, signature] = parseStripeSignature(header);
const payload = `${timestamp}.${body}`;
const expected = hmacSha256(secret, payload);
```

### HubSpot v3
```typescript
// x-hubspot-signature-v3: base64(hmac-sha256(...))
const payload = method + uri + body + timestamp;
const expected = base64(hmacSha256(secret, payload));
```

## Incident Response

### Webhook Signature Failures

**Symptoms**: 401 responses, "Invalid signature" errors

**Diagnosis**:
1. Check worker logs: `wrangler tail`
2. Verify secret matches provider dashboard
3. Check timestamp tolerance (5 min)

**Resolution**:
1. If secret mismatch:
   ```bash
   wrangler secret put STRIPE_WEBHOOK_SECRET --env production
   # Get new secret from Stripe dashboard
   ```

2. If clock skew:
   - Worker uses Cloudflare's time (accurate)
   - Check if provider has issues

### Events Not Processing

**Symptoms**: Events received but no action taken

**Diagnosis**:
1. Check idempotency KV for event status
2. Check core engine connectivity
3. Review event handler logic

**Resolution**:
1. If duplicate detection false positive:
   ```bash
   wrangler kv:key delete --namespace-id=xxx "stripe:evt_123"
   ```

2. If core engine unreachable:
   - Check `CORE_ENGINE_URL` setting
   - Verify core engine is deployed

### Dead Letter Queue Growing

**Symptoms**: Failed events accumulating

**Diagnosis**:
1. Check queue size:
   ```bash
   wrangler queues info webhook-dead-letter
   ```
2. Review failed events
3. Identify pattern in failures

**Resolution**:
1. If transient error, replay events:
   - Create queue consumer
   - Process with fixed logic

2. If permanent error:
   - Log for investigation
   - Acknowledge to clear queue

### High Latency

**Symptoms**: Webhook timeouts, provider retries

**Diagnosis**:
1. Check worker metrics in CF dashboard
2. Check core engine latency
3. Review event handler performance

**Resolution**:
1. If core engine slow:
   - Make forwarding async
   - Return 200 immediately, process later

2. If handler slow:
   - Use Queues for async processing
   - Return 200, queue for later

## Monitoring

### SLOs
- **Webhook Processing p95**: < 500ms
- **Alert Threshold**: > 1000ms

### Key Metrics
- `webhook.received` - Events received
- `webhook.processed` - Events processed
- `webhook.failed` - Events failed
- `webhook.signature.invalid` - Signature failures
- `webhook.duplicate` - Duplicate events

### Alerts
1. **Signature Failure Rate**: > 5% in 15 minutes
2. **Processing Time**: p95 > 1s
3. **Dead Letter Queue**: > 100 messages
4. **5xx Error Rate**: > 1%

## Testing Webhooks Locally

### Stripe

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks
stripe listen --forward-to localhost:8787/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

### HubSpot

1. Use ngrok:
   ```bash
   ngrok http 8787
   ```

2. Update HubSpot webhook URL to ngrok URL

3. Trigger event in HubSpot

## Security Checklist

- [ ] All secrets set via `wrangler secret put` (not in code)
- [ ] Signature verification enabled for all providers
- [ ] Timestamp validation (5-minute window)
- [ ] Idempotency keys prevent replay attacks
- [ ] CORS restricted appropriately
- [ ] No sensitive data logged
- [ ] Dead letter queue monitored
- [ ] Rate limiting in place
