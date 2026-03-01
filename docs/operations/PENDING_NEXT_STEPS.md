# Adaptive Spine v2 - Pending Work

**Current Status**: Deployed but not fully functional
**Priority**: Fix critical issues → Enable frontend → Launch beta

---

## 🚨 CRITICAL (Blocks Usage)

### 1. Fix Entity Ingestion Schema Mismatch
**Problem**:
```typescript
// Code currently does:
INSERT INTO spine_entity_core (org_id, data) VALUES (...)

// But table actually has:
spine_entity_core (tenant_id, entity_type, category, scope, source)
// Data goes in separate tables: spine_entity_attributes, spine_entity_layers
```

**Fix Required**:
- Update `services/spine-v2/src/index.ts` line 172-195
- Change `org_id` → `tenant_id`
- Remove direct `data` column insertion
- Use proper multi-table pattern:
  - Insert into `spine_entity_core` (core fields)
  - Insert into `spine_entity_attributes` (key-value pairs)
  - Insert into `spine_entity_layers` (L1/L2/L3 classification)

**Test**:
```bash
curl -X POST https://api.integratewise.ai/v2/spine/ingest \
  -H "Content-Type: application/json" \
  -d '{"org_id": "test", "entity_type": "account", "data": {"name": "Test"}}'
```

**ETA**: 30 minutes

---

### 2. Add Auth Middleware (Tenant Isolation)
**Problem**: No authentication - any request can access any tenant's data

**Fix Required**:
- Add Supabase JWT verification
- Extract user_id → tenant_id mapping
- Add tenant_id filter to ALL queries
- Add to all endpoints: `/v2/spine/entities`, `/v2/spine/ingest`, etc.

**Code Needed**:
```typescript
// services/spine-v2/src/auth.ts
export async function verifyAuth(request: Request, env: Env) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  // Verify with Supabase
  // Get tenant_id from user
  // Return { user_id, tenant_id, role }
}

// Add to every route:
const auth = await verifyAuth(c.req, c.env);
if (auth.error) return c.json(auth, 401);

// Enforce in queries:
WHERE tenant_id = ${auth.tenant_id}::uuid
```

**ETA**: 1 hour

---

### 3. Frontend Beta Toggle
**Problem**: No way for users to enable v2

**Fix Required**:
1. Add feature flag system:
```typescript
// src/lib/features.ts
export function useSpineVersion() {
  const user = useUser();
  return user?.features?.includes('adaptive-spine-beta') ? 'v2' : 'v1';
}
```

2. Add settings UI:
```typescript
// src/components/settings/beta-features.tsx
<Switch
  label="Adaptive Spine (Beta)"
  description="Enhanced schema discovery and completeness scoring"
  checked={hasFeature('adaptive-spine-beta')}
  onChange={toggleFeature}
/>
```

3. Update API calls:
```typescript
// src/lib/api.ts
const version = useSpineVersion();
const endpoint = version === 'v2'
  ? '/v2/spine/entities'
  : '/api/entities';
```

**ETA**: 2 hours

---

## ⚠️ HIGH PRIORITY (Blocks Beta Launch)

### 4. File Upload Support (CSV Parsing)
**Problem**: No file upload endpoint - only raw JSON

**Fix Required**:
- Add multipart form handler
- Parse CSV files (use papaparse)
- Batch insert entities
- Return upload summary

```typescript
app.post('/v2/spine/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const entity_type = formData.get('entity_type') as string;

  // Parse CSV
  // For each row → insert entity + observe fields
  // Return summary
});
```

**ETA**: 1 hour

---

### 5. Completeness Scoring (Fix Async Issue)
**Problem**: `calculateCompleteness()` called but might fail silently

**Fix Required**:
- Add error handling
- Log failures
- Add retry logic
- Return status in API response

```typescript
const completenessResult = await calculateCompleteness(...);
return c.json({
  entity_id,
  completeness: completenessResult
});
```

**ETA**: 30 minutes

---

### 6. Schema Discovery Testing
**Problem**: Not verified with real data

**Test Needed**:
1. Upload 100-row CSV with mixed fields
2. Verify `spine_schema_registry` populated
3. Check occurrence counts incremented
4. Confirm field types detected correctly

**ETA**: 1 hour testing

---

## 📊 MEDIUM PRIORITY (Nice to Have)

### 7. Analytics Tracking
**Problem**: Disabled (Analytics Engine not enabled)

**Fix Options**:
- Option A: Enable Analytics Engine in dashboard
- Option B: Use alternative (KV-based tracking)
- Option C: Skip for now, add later

**ETA**: 15 minutes (if enabling) or skip

---

### 8. Error Handling & Logging
**Problem**: Generic error messages, no structured logging

**Fix Required**:
- Add request IDs
- Structure error responses
- Log to external service (optional)

```typescript
const requestId = crypto.randomUUID();
console.log(JSON.stringify({
  requestId,
  endpoint: c.req.path,
  method: c.req.method,
  error: error.message,
  timestamp: Date.now()
}));
```

**ETA**: 30 minutes

---

### 9. Documentation
**Problem**: No user-facing docs

**Docs Needed**:
- API reference (OpenAPI spec)
- Beta user guide
- Migration guide (v1 → v2)
- Completeness scoring explained

**ETA**: 2-3 hours

---

### 10. Monitoring Dashboard
**Problem**: No visibility into beta performance

**Setup Needed**:
- Cloudflare Analytics queries
- Custom dashboard (Grafana/Datadog)
- Alert rules configured

**ETA**: 2 hours

---

## 🧪 LOW PRIORITY (Post-Launch)

### 11. Load Testing
- Test concurrent uploads
- Measure schema discovery performance
- Validate completeness calculation speed

**ETA**: 2 hours

---

### 12. Migration Script (v1 → v2)
- Export entities from old system
- Transform to spine_entity_core format
- Bulk import with schema observation

**ETA**: 3 hours

---

### 13. Advanced Features
- Field promotion (observed → required)
- Custom completeness definitions per tenant
- Schema versioning
- Field deprecation workflow

**ETA**: 5+ hours

---

## 📋 Suggested Order of Execution

### TODAY (Critical Path)
```
1. Fix entity ingestion (30 min)          → Enables basic usage
2. Add auth middleware (1 hour)           → Secures API
3. Test with sample data (30 min)         → Validates it works
```

### THIS WEEK (Beta Launch)
```
4. Add frontend toggle (2 hours)          → Enables user access
5. File upload support (1 hour)           → Real-world usage
6. Completeness fixes (30 min)            → Core feature works
7. Schema discovery test (1 hour)         → Verify adaptive behavior
```

### NEXT WEEK (Polish)
```
8. Documentation (3 hours)                → User onboarding
9. Monitoring setup (2 hours)             → Visibility
10. Error handling (30 min)               → Better UX
```

### LATER (Optional)
```
11. Load testing
12. Migration script
13. Advanced features
```

---

## Time Estimates

| Phase | Tasks | Time | Blocker? |
|-------|-------|------|----------|
| **Critical** | 1-3 | 2 hours | ✅ YES |
| **High** | 4-6 | 3 hours | ⚠️ For beta |
| **Medium** | 7-10 | 5 hours | ❌ No |
| **Low** | 11-13 | 10+ hours | ❌ No |

**Total to Beta Launch**: ~5 hours
**Total to Production Ready**: ~20 hours

---

## Recommended Next Action

**Start with Task #1**: Fix entity ingestion schema

```bash
# 1. Update services/spine-v2/src/index.ts
# 2. Change org_id → tenant_id
# 3. Use multi-table insert pattern
# 4. Re-deploy
# 5. Test with curl

# Then immediately do Task #2 (auth) to secure it
```

**After those 2, you can start beta testing safely.**

---

## Current Blockers

| Blocker | Impact | Can Launch Beta? |
|---------|--------|------------------|
| Ingestion broken | 🚨 Critical | ❌ NO |
| No auth | 🚨 Critical | ❌ NO |
| No frontend toggle | ⚠️ High | ⚠️ Internal only |
| No file upload | ⚠️ High | ⚠️ JSON only |

**Fix 1 + 2 → Can start internal testing**
**Fix 1-4 → Can launch public beta**

---

**Status**: ~40% done (infrastructure) + 60% pending (implementation)
**Next**: Fix ingestion → Add auth → Test → Launch

Want me to start with #1 (fix ingestion)?
