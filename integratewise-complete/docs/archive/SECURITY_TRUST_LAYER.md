# IntegrateWise OS — Security & Trust Layer

> **Version**: 1.0.0  
> **Last Updated**: 2026-02-02

## Overview

The IntegrateWise OS implements a comprehensive **Security & Trust Layer** across all engine services. This document outlines the security primitives, best practices, and trust verification mechanisms.

---

## 🔐 Security Primitives

### 1. Service-to-Service Authentication

All internal service communication uses the `x-service-auth` header with a shared secret.

```typescript
// Example: Act → Govern call
headers: {
  'x-service-auth': c.env.SERVICE_SECRET,
  'x-correlation-id': correlationId,
  'x-tenant-id': tenantId
}
```

**Environment Variable**: `SERVICE_SECRET`

### 2. Secure Headers (All Services)

Every service uses Hono's `secureHeaders()` middleware:

```typescript
import { secureHeaders } from 'hono/secure-headers';
app.use('*', secureHeaders());
```

This sets:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### 3. Rate Limiting (Think Service)

In-memory sliding window rate limiter:

```typescript
const windowMs = 60000; // 1 minute
const maxRequests = 100; // per tenant

// Returns 429 if exceeded:
{ "error": "Rate limit exceeded", "retry_after": 45 }
```

---

## 🛡️ Trust Layer

### 1. Digital Signatures (Audit Logs)

All governance audit entries are signed using **HMAC-SHA256**:

```typescript
async function signData(data: any, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  return btoa(String.fromCharCode(...new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(data)))
  )));
}
```

**Signed Fields**:

- `tenant_id`
- `user_id`
- `decision`
- `correlation_id`
- `action_type`

### 2. Trust Metrics (Normalizer)

Every normalized record includes a `trust_metrics` object:

```typescript
interface TrustMetrics {
  score: number;        // 0-100
  reasoning: string[];
  provenance: {
    source: string;
    verified: boolean;
    hops: number;
  };
}
```

**Score Calculation**:

| Factor | Points |
|--------|--------|
| Source identified | +80 (base) |
| CRM connector (HubSpot/Salesforce) | +10 |
| First-party internal system | +15 |
| R2 immutable storage | +5 |
| High data completeness (>10 fields) | +5 |
| **Maximum** | 100 |

### 3. Correlation ID Tracing

Every request carries an `x-correlation-id` header for end-to-end tracing:

```
User Request → Loader → Normalizer → Store → Think → Act
                ↓          ↓          ↓       ↓       ↓
            [same correlation_id propagated everywhere]
```

---

## 🗄️ Data Protection

### 1. Large Payload Offloading (R2)

Payloads >100KB are automatically stored in R2:

```typescript
if (JSON.stringify(data).length > 100 * 1024) {
  const r2Key = `raw/${tenant_id}/${requestId}`;
  await env.FILES.put(r2Key, JSON.stringify(data), {
    customMetadata: { tenant_id, requestId, entity_type }
  });
  // Replace payload with reference
  finalPayload = { _r2_ref: r2Key };
}
```

### 2. Tenant Isolation

All queries are scoped by `tenant_id`:

```sql
SELECT * FROM signals WHERE tenant_id = ? ORDER BY computed_at DESC
```

---

## 🔑 Required Environment Variables

| Service | Variable | Description |
|---------|----------|-------------|
| All | `ENVIRONMENT` | `development` / `staging` / `production` |
| Govern | `SIGNATURE_KEY` | HMAC signing key for audit logs |
| Govern | `SERVICE_SECRET` | Internal service auth token |
| Act | `SERVICE_SECRET` | Must match Govern's |
| Loader | `FILES` | R2 bucket binding |
| Loader | `THINK_QUEUE` | Queue binding for async processing |

---

## ✅ Security Checklist

- [x] Service-to-service authentication
- [x] Secure HTTP headers on all responses
- [x] Rate limiting on Think service
- [x] Digital signatures on audit logs
- [x] Trust score calculation
- [x] Correlation ID propagation
- [x] Large payload R2 offloading
- [x] Tenant isolation in all queries
- [ ] mTLS between services (future)
- [ ] Secrets rotation automation (future)

---

## 📊 Observability Integration

The trust layer integrates with OpenTelemetry:

```typescript
span.setAttributes({
  'trust.score': trustMetrics.score,
  'trust.source': trustMetrics.provenance.source,
  'trust.verified': trustMetrics.provenance.verified
});
```

---

*For implementation details, see the individual service source files in `/services/*/src/`.*
