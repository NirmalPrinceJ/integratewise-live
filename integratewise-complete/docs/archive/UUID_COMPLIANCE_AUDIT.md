# UUID Compliance Audit Report & Correction Plan

> **Generated**: 31 January 2026  
> **Auditor**: GitHub Copilot  
> **Status**: 🔴 VIOLATIONS DETECTED

---

## Executive Summary

The codebase has **partial UUID compliance**. Most database schemas correctly use `UUID PRIMARY KEY DEFAULT gen_random_uuid()`, but there are significant gaps in:

1. **TypeScript type definitions** - Missing branded UUID types
2. **UI component types** - Using `id: string` without UUID validation
3. **Billing plans table** - Uses `id TEXT PRIMARY KEY` instead of UUID
4. **Circuit breaker state** - Uses `id TEXT PRIMARY KEY` instead of UUID
5. **shortId utility function** - Still exists and could be misused
6. **Some schemas** - Use `id TEXT PRIMARY KEY` for lookup tables

---

## 🔴 Critical Violations (P0)

### V001: `packages/lib/src/utils.ts` - shortId function exists

**Location**: [packages/lib/src/utils.ts#L45-L51](packages/lib/src/utils.ts)
**Severity**: 🔴 CRITICAL
**Issue**: `shortId()` function generates non-UUID IDs
**Risk**: Could be used for entity IDs, breaking UUID compliance

```typescript
// VIOLATION
export function shortId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // ...
}
```

**Fix**: Deprecate and add UUID generator

---

### V002: Missing Branded UUID Types

**Location**: No file currently defines branded UUID types
**Severity**: 🔴 CRITICAL
**Issue**: All UUIDs are typed as plain `string`, allowing any string to be passed
**Risk**: No compile-time validation of UUID format

**Fix**: Add branded UUID types to `packages/types/src/common.ts`

---

### V003: `sql-migrations/024_enterprise_resilience.sql` - TEXT PKs

**Location**: [sql-migrations/024_enterprise_resilience.sql#L150,L236](sql-migrations/024_enterprise_resilience.sql)
**Severity**: 🔴 CRITICAL
**Issue**: `plans` and `circuit_breaker_state` tables use `id TEXT PRIMARY KEY`

```sql
-- VIOLATION
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,  -- Should be UUID
  ...
);

CREATE TABLE IF NOT EXISTS circuit_breaker_state (
  id TEXT PRIMARY KEY,  -- Should be UUID
  ...
);
```

**Fix**: Migrate to UUID with slug as separate indexed field

---

## 🟠 High Violations (P1)

### V004: `src/types/admin.ts` - Missing UUID validation

**Location**: [src/types/admin.ts](src/types/admin.ts)
**Severity**: 🟠 HIGH
**Issue**: All `id: string` fields lack UUID type branding

```typescript
// VIOLATION - untyped IDs
export type Tenant = {
  id: string  // Should be UUID branded type
  ...
}
```

---

### V005: `types.ts` (root) - Missing UUID validation

**Location**: [types.ts](types.ts)
**Severity**: 🟠 HIGH  
**Issue**: Session, Topic interfaces use plain `id: string`

```typescript
// VIOLATION
export interface Session {
  id: string;  // Should be SessionId (branded UUID)
  tenant_id: string;  // Should be TenantId (branded UUID)
}
```

---

### V006: UI Components - Missing UUID Context Types

**Location**: Multiple files
- `src/components/os/evidence-drawer.tsx`
- `src/components/os/signal-strip.tsx`
- `src/contexts/world-scope.tsx`
- `src/contexts/tenant-context.tsx`

**Severity**: 🟠 HIGH
**Issue**: All use `id: string` without UUID branding

---

## 🟡 Medium Violations (P2)

### V007: No execution_id in all retry/signal logs

**Location**: Service workers
**Severity**: 🟡 MEDIUM
**Issue**: Some retry mechanisms don't track `execution_id` for each attempt

---

### V008: Spine ID format inconsistent

**Location**: `services/orchestrator/lib/stage2-full.ts`, `services/orchestrator/lib/identity-mapper.ts`
**Severity**: 🟡 MEDIUM
**Issue**: Uses `SPN-${crypto.randomUUID()}` prefix instead of pure UUID

```typescript
// CURRENT
const spineId = `SPN-${crypto.randomUUID()}`

// SHOULD BE
const spineId = crypto.randomUUID()
// Store type separately in a `spine_type` field
```

---

## ✅ Compliant Areas

| Area | Status | Notes |
|------|--------|-------|
| SQL Migrations (majority) | ✅ | Use `UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Zod Schemas in services | ✅ | Use `z.string().uuid()` validation |
| Signal/Action schemas | ✅ | Properly UUID typed |
| Core service workers | ✅ | Use `crypto.randomUUID()` |
| D1 proposed schemas | ✅ | Use `TEXT` for UUID storage (correct for D1) |

---

## Correction Plan

### Phase 1: Foundation Types (IMMEDIATE)

| Task | File | Description |
|------|------|-------------|
| 1.1 | `packages/types/src/uuid.ts` | Create branded UUID types |
| 1.2 | `packages/lib/src/utils.ts` | Add UUID generator, deprecate shortId |
| 1.3 | `packages/types/src/common.ts` | Update schemas with UUID types |

### Phase 2: Type Updates (TODAY)

| Task | File | Description |
|------|------|-------------|
| 2.1 | `src/types/admin.ts` | Apply branded UUID types |
| 2.2 | `types.ts` (root) | Apply branded UUID types |
| 2.3 | `src/contexts/*.tsx` | Update context types |

### Phase 3: SQL Migrations (THIS WEEK)

| Task | File | Description |
|------|------|-------------|
| 3.1 | `sql-migrations/030_uuid_compliance.sql` | Migrate plans, circuit_breaker to UUID |
| 3.2 | D1 schemas | Ensure all TEXT PKs are for UUIDs |

### Phase 4: Service Layer (THIS WEEK)

| Task | File | Description |
|------|------|-------------|
| 4.1 | `services/orchestrator/*` | Remove SPN- prefix pattern |
| 4.2 | All services | Add execution_id to all retry logs |

---

## UUID Enablement Standard

### TypeScript Types

```typescript
// packages/types/src/uuid.ts
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

export type UUID = Brand<string, 'UUID'>;
export type TenantId = Brand<string, 'TenantId'>;
export type UserId = Brand<string, 'UserId'>;
export type AccountId = Brand<string, 'AccountId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type SignalId = Brand<string, 'SignalId'>;
export type ExecutionId = Brand<string, 'ExecutionId'>;
export type ProposalId = Brand<string, 'ProposalId'>;
export type SpineEntityId = Brand<string, 'SpineEntityId'>;

// Validation
export function isUUID(value: string): value is UUID {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Casting with validation
export function toUUID(value: string): UUID {
  if (!isUUID(value)) throw new Error(`Invalid UUID: ${value}`);
  return value as UUID;
}

// Generator
export function generateUUID(): UUID {
  return crypto.randomUUID() as UUID;
}

// UUIDv7 generator (time-sortable)
export function generateUUIDv7(): UUID {
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16).padStart(12, '0');
  const random = crypto.getRandomValues(new Uint8Array(10));
  const randomHex = Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-7${randomHex.slice(0, 3)}-${(0x80 | (random[4] & 0x3f)).toString(16)}${randomHex.slice(5, 7)}-${randomHex.slice(7, 19)}` as UUID;
}
```

### Database Schema Standard

```sql
-- PostgreSQL/Neon
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  ...
);

-- D1 (SQLite) - Use TEXT for UUID storage
CREATE TABLE entities (
  id TEXT PRIMARY KEY, -- UUID stored as TEXT
  tenant_id TEXT NOT NULL,
  ...
);
```

### API Contract Standard

```typescript
// All API endpoints must use UUID params
app.get('/api/accounts/:accountId', async (c) => {
  const accountId = toUUID(c.req.param('accountId')); // Validate
  // ...
});
```

### UI Routing Standard

```typescript
// pages/accounts/[id]/page.tsx
export default function AccountPage({ params }: { params: { id: string } }) {
  const accountId = toUUID(params.id); // Validate at boundary
  // Use typed accountId throughout
}
```

---

## Execution Order

```
┌──────────────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation Types                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  1.1 Create packages/types/src/uuid.ts                     │ │
│  │  1.2 Update packages/lib/src/utils.ts                      │ │
│  │  1.3 Update packages/types/src/common.ts                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  PHASE 2: Type Updates                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  2.1 Update src/types/admin.ts                             │ │
│  │  2.2 Update root types.ts                                  │ │
│  │  2.3 Update src/contexts/*.tsx                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  PHASE 3: SQL Migrations                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  3.1 Create 030_uuid_compliance.sql migration              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  PHASE 4: Service Layer                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  4.1 Update services/orchestrator for pure UUIDs           │ │
│  │  4.2 Add execution_id to all retry mechanisms              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

**Next Step**: Begin auto-correction starting with Phase 1.1 - Create branded UUID types
