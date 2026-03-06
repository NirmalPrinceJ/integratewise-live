# 🚀 Quick Reference: Adaptive Spine (L3 Truth & Learning Layer)

## IntegrateWise OS — The Four Layers

**L0**: Reality (raw inputs, never mutated)  
**L3**: Truth & Learning (SSOT + adaptive schema + readiness) ← **You are here**  
**L2**: Intelligence (AI insights + approvals + audit)  
**L1**: Work (pure surfaces, unlocked when ready)

**Loop**: L0 → L3 → L2 → L1 → back to L0

---

## Deploy in 5 Steps

```bash
# 1️⃣  Get Neon URL (from Neon console)
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# 2️⃣  Run migrations
node run-new-migrations.mjs

# 3️⃣  Deploy workers
cd services/cloudflare-workers
wrangler login
wrangler secret put NEON_DB_URL --config wrangler.loader.toml
# Paste URL above, then:
wrangler deploy --config wrangler.loader.toml
wrangler deploy --config wrangler.connector.toml

# 4️⃣  Update .env.local
echo "NEXT_PUBLIC_LOADER_URL=https://integratewise-loader.<ID>.workers.dev" >> .env.local

# 5️⃣  Test
node verify-deployment.mjs
```

## Quick Test

1. Go to `/setup/buckets`
2. Click "Add" on any bucket
3. Select "Upload CSV"
4. Upload this sample:
   ```csv
   id,name,email
   1,Alice,alice@test.com
   2,Bob,bob@test.com
   ```
5. Check: `SELECT * FROM spine_schema_registry WHERE field_name = 'email'`
   - Should show: field_name='email', data_type='email', observed_count=2

## Key Files

| File | Purpose |
|------|---------|
| `deploy.sh` | Automated deployment |
| `ADAPTIVE_SPINE_GUIDE.md` | Full guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `services/cloudflare-workers/loader-service.ts` | File processing logic |
| `sql-migrations/035_spine_adaptive_registry.sql` | Schema + functions |

## Environment Variables

```bash
# Required for production
NEXT_PUBLIC_LOADER_URL=https://...workers.dev
NEXT_PUBLIC_CONNECTOR_URL=https://...workers.dev
DATABASE_URL=postgresql://...

# Optional secrets (set via wrangler)
NEON_DB_URL=postgresql://...
BUCKET_SIGNING_SECRET=<random>
CONNECTOR_ENCRYPTION_KEY=<random>
```

## Database Functions

```sql
-- Record field observation
SELECT record_spine_field_observation(
  tenant_id::UUID, 
  entity_type::TEXT, 
  field_name::TEXT, 
  data_type::TEXT, 
  sample_value::TEXT
);

-- Compute completeness
SELECT compute_spine_completeness();

-- Check observations
SELECT * FROM spine_schema_registry 
WHERE entity_type = 'account' 
ORDER BY last_observed DESC;

-- Check completeness score
SELECT entity_type, completeness_score, missing_fields
FROM spine_entity_completeness;
```

## Endpoints

### Loader Service
```
POST /loader/ingest
  Body: { tenantId, bucketType, fileType, records }
  Returns: { success, bucketState, observedFields }

POST /loader/validate
  Body: { tenantId, bucketType, fileType, records }
  Returns: { valid, errors, preview }
```

### Connector Service
```
GET /connector/auth-url/:type
  Returns: { authUrl, state }

POST /connector/callback
  Body: { code, state }
  Returns: { success, refreshToken }

POST /connector/sync/:type
  Returns: { syncId, status, recordsProcessed }

DELETE /connector/:type
  Returns: { success, revoked }
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Module not found | `pnpm install` |
| Wrangler not found | `npm install -g wrangler` |
| Neon connection failed | Check DATABASE_URL format |
| Loader not responding | Check: `wrangler deployments list` |
| No field observations | Ensure migration 035 ran |
| ModuleGuard still locked | Check bucket state: `SELECT state FROM base_buckets` |

## See Also

- 📖 `ADAPTIVE_SPINE_GUIDE.md` — Full documentation
- ✅ `DEPLOYMENT_CHECKLIST.md` — Detailed steps
- 🏗️ `BUCKETS_IMPLEMENTATION.md` — Architecture
- 🔧 `docs/runbooks/database.md` — Database operations

---

**Status**: Ready to deploy
**Last tested**: 2026-02-08
