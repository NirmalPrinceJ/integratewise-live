# Parallel Spine Operation - Beta Launch Plan

**Strategy**: Old system (production) + New Adaptive Spine (beta)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION TRAFFIC                        │
│                                                              │
│    Frontend → Gateway → [OLD SERVICES] → D1 + Neon (old)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BETA TRAFFIC                            │
│                                                              │
│    Frontend → /v2/* → [NEW SPINE] → Neon (spine_* tables)  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Route Separation

### Production Routes (Existing - Unchanged)
```
POST /loader/ingest              → Old loader
POST /normalizer/normalize       → Old normalizer
POST /spine/entities             → Old spine
GET  /entities/:id               → Old data
```

### Beta Routes (New Spine)
```
POST /v2/spine/ingest            → New adaptive loader
POST /v2/spine/observe           → Schema discovery
GET  /v2/spine/entities/:id      → New spine_entity_core
GET  /v2/spine/completeness/:id  → Completeness scoring
GET  /v2/spine/schema            → Schema registry
GET  /v2/spine/streams           → Department streams
```

---

## 2. Service Deployment Plan

### Keep Untouched (Production)
- ✅ loader (existing)
- ✅ normalizer (existing)
- ✅ spine (existing)
- ✅ store (existing)
- ✅ All 19 existing workers

### Deploy New (Beta)
- 🆕 **spine-v2** worker
  - Handles /v2/spine/* routes
  - Uses spine_* tables only
  - Adaptive field observation
  - Completeness scoring

---

## 3. Database Isolation

### Production Database (Old Schema)
```sql
-- Existing tables (unchanged)
base_buckets
base_entities
normalized_data_*
...
```

### Beta Database (New Spine Schema)
```sql
-- New tables (spine_*)
spine_entity_core          -- Universal entities
spine_schema_registry      -- Adaptive fields
spine_expected_fields      -- Completeness defs
spine_entity_completeness  -- Scores
spine_streams              -- Departments
...40 tables total
```

**No overlap, no conflicts.**

---

## 4. Frontend Integration

### Add Beta Toggle
```typescript
// src/lib/spine-config.ts
export const SPINE_VERSION = process.env.NEXT_PUBLIC_SPINE_VERSION || 'v1';

export function getSpineEndpoint(entity: string) {
  if (SPINE_VERSION === 'v2') {
    return `/v2/spine/entities/${entity}`;
  }
  return `/entities/${entity}`; // Production
}
```

### Feature Flag
```typescript
// Feature flag for beta users
const useAdaptiveSpine = user.features?.includes('adaptive-spine-beta');

if (useAdaptiveSpine) {
  // Route to /v2/spine/*
} else {
  // Route to old endpoints
}
```

---

## 5. Deployment Steps

### Step 1: Create spine-v2 Worker
```bash
cd services
mkdir spine-v2
cd spine-v2

# Copy from cloudflare-workers template
cp ../cloudflare-workers/loader-service.ts src/index.ts

# Update to use spine_* tables
# Add wrangler.toml
```

### Step 2: Configure Routes
```toml
# wrangler.toml
name = "integratewise-spine-v2"

[[routes]]
pattern = "api.integratewise.ai/v2/spine/*"
zone_name = "integratewise.ai"
```

### Step 3: Deploy Beta Worker
```bash
cd services/spine-v2
wrangler deploy

# URL: https://integratewise-spine-v2.connect-a1b.workers.dev
```

### Step 4: Add Beta Flag to Frontend
```bash
# .env.local
NEXT_PUBLIC_SPINE_VERSION=v1           # Production (default)
NEXT_PUBLIC_SPINE_V2_BETA_ENABLED=true # Show beta toggle
```

---

## 6. Testing Strategy

### Phase 1: Internal Testing (Week 1)
- Beta flag enabled for internal team only
- Test file uploads via /v2/spine/ingest
- Verify schema discovery works
- Check completeness scoring
- Monitor beta worker logs

### Phase 2: Beta Users (Week 2-3)
- Enable beta for 5-10 pilot customers
- Side-by-side comparison: v1 vs v2
- Collect feedback on adaptive features
- Monitor performance and errors

### Phase 3: Gradual Rollout (Week 4+)
- Increase beta % weekly: 10% → 25% → 50%
- Compare metrics: completeness scores, field coverage
- Identify migration blockers

### Phase 4: Full Migration (Month 2+)
- When beta is stable and proven
- Migrate all users to v2
- Deprecate old endpoints
- Archive old schema

---

## 7. Rollback Plan

### If Beta Fails:
```typescript
// Instant rollback via env var
NEXT_PUBLIC_SPINE_VERSION=v1  // Disable beta
NEXT_PUBLIC_SPINE_V2_BETA_ENABLED=false
```

### Data Rollback:
- Beta data is isolated in spine_* tables
- Production data unchanged
- No risk to production system

---

## 8. Monitoring

### Production Metrics (Existing)
```
- Ingestion rate
- Normalization success rate
- Storage usage
```

### Beta Metrics (New)
```
- Schema discovery rate (fields/minute)
- Completeness score distribution
- Adaptive observation latency
- Field coverage improvement over time
```

### Alerts
```yaml
# Beta specific alerts
- name: spine-v2-high-error-rate
  condition: error_rate > 5%
  action: disable beta, alert team

- name: spine-v2-slow-response
  condition: p95_latency > 2s
  action: alert team

- name: schema-discovery-lag
  condition: observation_queue_depth > 1000
  action: scale up
```

---

## 9. Migration Tracker

### Current State
```
Production:  100% traffic → Old system
Beta:        0% traffic → New spine (ready)
```

### Week 1 Target
```
Production:  100% traffic → Old system
Beta:        Internal team (5 users) → New spine
```

### Month 1 Target
```
Production:  90% traffic → Old system
Beta:        10% traffic → New spine
```

### Month 2 Target
```
Production:  50% traffic → Old system
Beta:        50% traffic → New spine
```

### Month 3 Target
```
Production:  Deprecated
Beta:        100% traffic → New spine (promoted to production)
```

---

## 10. Success Criteria for Beta → Production

### Must Have (Before Full Migration)
- ✅ Error rate < 1% for 2 consecutive weeks
- ✅ P95 latency < 500ms
- ✅ Zero data loss incidents
- ✅ 90%+ completeness scores (vs 60% on old system)
- ✅ Positive feedback from 80%+ of beta users
- ✅ Schema discovery working for 95%+ of uploads

### Nice to Have
- Field coverage improvement > 30%
- Adaptive observation adds 5+ new fields per entity type
- Completeness scoring drives action (users filling in gaps)

---

## 11. Code Changes Required

### Minimal Changes (This Week)
```bash
# 1. Create spine-v2 service
services/spine-v2/
  src/
    index.ts           # Hono app with /v2/spine/* routes
    adaptive.ts        # Schema observation logic
    completeness.ts    # Scoring logic
  wrangler.toml

# 2. Add frontend feature flag
src/lib/spine-config.ts

# 3. Add beta toggle UI
src/components/settings/beta-features.tsx
```

### No Changes Required
- All 19 existing services
- All existing database schemas
- All production routes
- All CI/CD pipelines

---

## 12. Documentation Updates

### For Developers
```
- API_REFERENCE.md → Add /v2/spine/* endpoints
- MIGRATION_GUIDE.md → How to adopt adaptive spine
```

### For Users
```
- BETA_FEATURES.md → How to enable adaptive spine
- COMPLETENESS_GUIDE.md → Understanding scores
```

---

## 13. Quick Start Commands

### Deploy Beta Worker
```bash
# Create spine-v2 service
mkdir -p services/spine-v2/src
cd services/spine-v2

# Use the loader-service.ts we have as base
cp ../cloudflare-workers/loader-service.ts src/index.ts

# Update imports to use spine_* tables
# Deploy
wrangler deploy
```

### Enable Beta Locally
```bash
# .env.local
NEXT_PUBLIC_SPINE_VERSION=v2
NEXT_PUBLIC_SPINE_V2_ENDPOINT=http://localhost:8787
```

### Test Beta Endpoint
```bash
# Upload to beta spine
curl -X POST http://localhost:8787/v2/spine/ingest \
  -F "file=@test.csv" \
  -F "tenantId=test-tenant" \
  -F "entity_type=account"

# Check schema registry
curl http://localhost:8787/v2/spine/schema?entity_type=account
```

---

## 14. Next Actions (Priority Order)

### TODAY
1. ✅ Create `services/spine-v2/` directory
2. ✅ Copy loader-service.ts as base
3. ✅ Update to use spine_entity_core table
4. ✅ Add adaptive observation calls
5. ✅ Deploy to Cloudflare

### THIS WEEK
1. Add frontend beta toggle
2. Test internally with sample data
3. Verify schema discovery works
4. Check completeness scoring
5. Document beta API

### NEXT WEEK
1. Enable for 5 pilot users
2. Collect feedback
3. Fix bugs
4. Add monitoring dashboards
5. Write migration guide

---

**Status**: Ready to start. Old system safe. Beta isolated. Zero risk.

**First step**: Create spine-v2 service?
