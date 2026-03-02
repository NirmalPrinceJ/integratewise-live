# Supabase Migration Summary

**Date**: January 29, 2026

## Migration Overview

Successfully migrated from Vercel-linked Supabase to a dedicated IntegrateWise Supabase project.

---

## New Supabase Project Details

| Property | Value |
|----------|-------|
| **Project URL** | `https://hrrbciljsqxnmuwwnrnt.supabase.co` |
| **Database Host** | `db.hrrbciljsqxnmuwwnrnt.supabase.co` |
| **Region** | US East 1 |
| **Database** | `postgres` |
| **Tables Migrated** | 45 public tables |
| **Publishable Key** | `sb_publishable_IfMEifOGpVltNPMiu_6ZNw_3cCVZgEK` |

---

## Database Architecture

### Primary: Supabase (45 tables)
**Use**: Frontend + Most Backend Services

Tables include:
- `leads`, `deals`, `clients`, `campaigns`
- `chat_*`, `calendar_events`, `activities`
- `revenue`, `projects`, `subscriptions`
- `webhooks`, `tools_registry`, `metrics`

**Connection String**:
```
postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
```

---

### Secondary: Neon Spine (22 tables)
**Use**: AI/Knowledge Services Only (knowledge, think, iq-hub)

Tables include:
- `embeddings`, `documents`, `topics`
- `ai_conversations`, `ai_messages`, `ai_providers`
- `knowledge_items`, `notion_knowledge`

**Connection String**:
```
postgresql://neondb_owner:<PASSWORD>@ep-plain-bird-<ID>-pooler.eu-west-2.aws.neon.tech/Spine?sslmode=require
```

---

## Updated Services

All 10 Cloudflare Workers updated with new Supabase credentials:

✅ **spine** - https://integratewise-spine-staging.connect-a1b.workers.dev  
✅ **gateway** - https://integratewise-gateway-staging.connect-a1b.workers.dev  
✅ **loader** - https://integratewise-loader-staging.connect-a1b.workers.dev  
✅ **store** - https://integratewise-store-staging.connect-a1b.workers.dev  
✅ **knowledge** - https://integratewise-knowledge-staging.connect-a1b.workers.dev  
✅ **think** - https://integratewise-think-staging.connect-a1b.workers.dev  
✅ **govern** - https://integratewise-govern-staging.connect-a1b.workers.dev  
✅ **act** - https://integratewise-act-staging.connect-a1b.workers.dev  
✅ **iq-hub** - https://integratewise-iq-hub-staging.connect-a1b.workers.dev  
✅ **admin** - https://integratewise-admin-staging.connect-a1b.workers.dev  

---

## Updated Configuration Files

### Frontend
- ✅ `apps/integratewise-os/.env.local`
- ✅ `apps/integratewise-os/.env.staging`

### Secrets Updated (All Services)
```bash
SUPABASE_URL=https://hrrbciljsqxnmuwwnrnt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<REDACTED — use Doppler>
```

---

## Migration Process

1. **Exported** old Supabase schema + data (4,201 lines SQL)
2. **Created** new dedicated Supabase project
3. **Imported** 45 tables with data
4. **Updated** frontend `.env.local` and `.env.staging`
5. **Deployed** new secrets to all 10 Cloudflare Workers
6. **Verified** service health endpoints

---

## Next Steps

- [ ] Test frontend with new Supabase
- [ ] Run E2E tests
- [ ] Monitor service health
- [ ] Consider migrating Neon `neondb` tables to Supabase (future)

---

## Rollback Plan

If issues arise, revert to old Supabase:

```bash
# Old Supabase (Vercel-linked)
NEXT_PUBLIC_SUPABASE_URL=https://vjeuzreomitbstwfkqbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZXV6cmVvbWl0YnN0d2ZrcWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDMxNjMsImV4cCI6MjA4MTU3OTE2M30.xA1hCJyIqkcw-vEBacSKp9Qoh3TdlTJ8BcJSHrSRpuY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZXV6cmVvbWl0YnN0d2ZrcWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjAwMzE2MywiZXhwIjoyMDgxNTc5MTYzfQ.CeiCA3LBMceIC_85idve8oQVbF-ebGFi9K8enYGSMR8
```

Re-deploy these to all services using the same wrangler commands.
