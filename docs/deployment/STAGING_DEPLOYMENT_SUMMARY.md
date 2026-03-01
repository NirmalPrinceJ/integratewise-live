# Staging Deployment Summary
**Date**: 2026-02-08
**Version**: Spine v2.0.0-beta

---

## Deployed Services

### Production (Stable - Unchanged)
- ✅ All 19 workers operational
- ✅ Frontend: https://integratewise.ai
- ✅ Old spine system running

### Staging (New - Beta)
- ✅ **spine-v2**: https://integratewise-spine-v2-staging.connect-a1b.workers.dev
- ✅ Adaptive schema discovery
- ✅ Department streams (10 seeded)
- ✅ Completeness scoring framework

---

## Endpoints Available

### Staging Base URL
```
https://integratewise-spine-v2-staging.connect-a1b.workers.dev
```

### API Routes
```
GET  /v2/spine                    → Service info
GET  /v2/spine/health             → Health check
GET  /v2/spine/streams            → Department streams (10)
GET  /v2/spine/schema             → Schema registry
GET  /v2/spine/entities/:id       → Get entity
GET  /v2/spine/entities           → List entities
POST /v2/spine/ingest             → Ingest data
GET  /v2/spine/completeness/:id   → Completeness score
```

---

## Test Commands

### 1. Health Check
```bash
curl https://integratewise-spine-v2-staging.connect-a1b.workers.dev/v2/spine/health
```

### 2. View Streams
```bash
curl https://integratewise-spine-v2-staging.connect-a1b.workers.dev/v2/spine/streams
```

### 3. Check Schema (empty initially)
```bash
curl "https://integratewise-spine-v2-staging.connect-a1b.workers.dev/v2/spine/schema?entity_type=account"
```

---

## Database Status

### Neon PostgreSQL
- ✅ Connected
- ✅ 40 spine tables created
- ✅ 10 department streams seeded
- ✅ 13 entity type definitions seeded
- ⚠️ 0 entities (ready for ingestion)

### Tables
```
spine_entity_core          → Universal entities (0 rows)
spine_schema_registry      → Discovered fields (0 rows)
spine_expected_fields      → Completeness defs (13 rows)
spine_entity_completeness  → Scores (0 rows)
spine_streams              → Departments (10 rows)
```

---

## Next Steps

### Week 1: Internal Testing
1. Fix entity ingestion (align with spine_entity_core schema)
2. Test file uploads
3. Verify schema discovery
4. Test completeness scoring
5. Add frontend beta toggle

### Week 2: Beta Launch
1. Enable for 5 pilot users
2. Collect feedback
3. Monitor metrics
4. Fix bugs
5. Document learnings

### Week 3+: Gradual Rollout
1. 10% → 25% → 50% → 100%
2. Compare v1 vs v2 metrics
3. Plan full migration

---

## Rollback Plan

If issues arise:
```bash
# Instant rollback
NEXT_PUBLIC_SPINE_VERSION=v1  # Disable beta
```

Production remains untouched. Zero risk.

---

## Monitoring

### Key Metrics
- Schema discovery rate
- Completeness scores
- API latency (P95 < 500ms)
- Error rate (< 1%)

### Alerts
- spine-v2-high-error-rate
- spine-v2-slow-response
- schema-discovery-lag

---

**Status**: Staging deployed ✅
**Risk**: Low (isolated beta)
**Next**: Internal testing
