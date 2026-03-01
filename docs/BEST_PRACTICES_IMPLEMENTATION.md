# Best Practices Implementation Summary

**Status:** ✅ Day 1 Guardrails Complete  
**Last Updated:** Day 1 of 4-Day Plan

---

## Overview

This document tracks the implementation of the 6 best-practice guardrails from `best-practice.md`.

| # | Guardrail | Day | Status |
|---|-----------|-----|--------|
| 1 | Correlation ID Propagation | 1 | ✅ Complete |
| 2 | Idempotency Keys | 1 | ✅ Complete |
| 3 | Missing-Plane Evidence Markers | 1 | ✅ Complete |
| 4 | Structured Error Envelopes | 2 | ⏳ Planned |
| 5 | Signal Dedup Window | 2 | ⏳ Planned |
| 6 | Governance Audit Trail | 1 | ✅ Complete (correlation_id added) |

---

## Guardrail #1: Correlation ID Propagation

**Goal:** Every request that touches the pipeline should carry a correlation_id that flows through all services.

### Database Changes
- [sql-migrations/021_best_practice_guardrails.sql](../sql-migrations/021_best_practice_guardrails.sql)
  - Added `correlation_id TEXT` to: `situations`, `actions`, `action_runs`, `governance_audit_log`, `events`, `signals`
  - Created `v_correlation_trace` view for observability

### Service Updates

| Service | File | Changes |
|---------|------|---------|
| Shared | `packages/lib/src/correlation.ts` | NEW: `generateCorrelationId()`, `getOrCreateCorrelationId()`, `createCorrelationContext()` |
| Normalizer | `services/normalizer/src/index.ts` | Added `getCorrelationId()`, `logWithContext()`, correlation in all endpoints |
| Think | `services/think/src/engine.ts` | Added `ProcessEventOptions.correlationId`, propagates to signals/situations |
| Think | `services/think/src/fusion.ts` | Added `correlationId` option to `fuseSources()` |
| Act | `services/act/src/index.ts` | Added correlation tracking, passes to governance + events |
| Govern | `services/govern/src/index.ts` | Added correlation to `/v1/check`, logged in audit |
| Govern | `services/govern/src/audit.ts` | `logDecision()` now accepts `correlation_id` |

### Usage Pattern
```typescript
// Extract or generate correlation ID
const correlationId = c.req.header('x-correlation-id') || generateUUID();

// Log with context
logWithContext(correlationId, 'info', 'Processing request', { ... });

// Pass to downstream services
fetch(url, {
  headers: { 'x-correlation-id': correlationId }
});

// Store in database
INSERT INTO situations (..., correlation_id) VALUES (..., ${correlationId});
```

---

## Guardrail #2: Idempotency Keys

**Goal:** Prevent duplicate canonical writes when events are replayed.

### Database Changes
- [sql-migrations/021_best_practice_guardrails.sql](../sql-migrations/021_best_practice_guardrails.sql)
  - Created `idempotency_keys` table with TTL (7 days)
  - Created `check_idempotency()` function for atomic duplicate detection

### Service Updates

| Service | File | Changes |
|---------|------|---------|
| Normalizer | `services/normalizer/src/idempotency.ts` | NEW: `generateIdempotencyKey()`, `checkIdempotency()`, `registerIdempotencyKey()` |
| Normalizer | `services/normalizer/src/index.ts` | POST `/normalize` checks idempotency before processing |
| Normalizer | `services/normalizer/src/types.ts` | Added `is_duplicate?: boolean` to response |

### Key Format
```
{source_system}:{external_id}:{tenant_id}
```
- Falls back to content hash when no external_id

### Response When Duplicate
```json
{
  "success": true,
  "is_duplicate": true,
  "existing_entity_id": "abc123",
  "first_processed_at": "2024-01-15T10:30:00Z",
  "correlation_id": "xyz789"
}
```

---

## Guardrail #3: Missing-Plane Evidence Markers

**Goal:** Fusion always returns ≥1 evidence ref per plane (even if empty).

### Database Changes
- [sql-migrations/021_best_practice_guardrails.sql](../sql-migrations/021_best_practice_guardrails.sql)
  - Added `is_missing_marker BOOLEAN DEFAULT FALSE` to `evidence_refs`
  - Added `plane_status JSONB` to `situations`

### Service Updates

| Service | File | Changes |
|---------|------|---------|
| Think | `services/think/src/fusion.ts` | Added `PlaneStatus` interface, `createMissingPlaneMarker()` function |
| Think | `services/think/src/fusion.ts` | `buildEvidenceRefs()` returns `{ refs, planeStatus }` |
| Think | `services/think/src/fusion.ts` | `FusedSources` includes `plane_status` |
| Think | `services/think/src/engine.ts` | Stores `plane_status` in situations table |

### PlaneStatus Interface
```typescript
interface PlaneStatus {
  A: 'available' | 'empty' | 'error';  // Spine/Context
  B: 'available' | 'empty' | 'error';  // AI Memory
  C: 'available' | 'empty' | 'error';  // External/Real-time
}
```

### Missing Marker Evidence Ref
```typescript
{
  plane: 'B',
  source_type: 'ai_memory',
  ref_id: 'missing-B-abc123',
  weight: 0,
  context: 'No AI memory data available',
  is_missing_marker: true
}
```

---

## Guardrail #6: Governance Audit Trail

Already existed, enhanced with correlation_id:

| Service | File | Changes |
|---------|------|---------|
| Govern | `services/govern/src/audit.ts` | `logDecision()` now includes `correlation_id` |
| Govern | `services/govern/src/index.ts` | Passes `correlation_id` to all audit entries |

---

## Observability Views

Created in `021_best_practice_guardrails.sql`:

### v_correlation_trace
Trace a request through the entire pipeline:
```sql
SELECT * FROM v_correlation_trace WHERE correlation_id = 'xyz789';
```

### v_idempotency_status
Monitor idempotency key usage:
```sql
SELECT * FROM v_idempotency_status WHERE tenant_id = '...';
```

---

## Day 2+ Planned

### Guardrail #4: Structured Error Envelopes
- Consistent error response format across all services
- Include `correlation_id`, `error_code`, `message`, `details`

### Guardrail #5: Signal Dedup Window
- Time-based deduplication for signals
- Prevent duplicate signals within configurable window

---

## Testing Checklist

- [ ] Send request without `x-correlation-id` → should auto-generate
- [ ] Send request with `x-correlation-id` → should preserve
- [ ] Submit duplicate data to normalizer → should return `is_duplicate: true`
- [ ] Trigger situation with empty AI memory → should have plane_status.B = 'empty'
- [ ] Query `v_correlation_trace` → should show full pipeline
