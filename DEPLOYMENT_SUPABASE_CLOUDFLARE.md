# IntegrateWise OS - Supabase + Cloudflare Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js 14+ (Frontend)                    │   │
│  │              Deployed to: Vercel / Cloudflare Pages          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SUPABASE (Core Platform)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │    Auth     │  │  PostgreSQL │  │   Storage   │  │  Realtime  │ │
│  │  (GoTrue)   │  │   (Spine)   │  │    (S3)     │  │  (WebSocket)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE (Edge Compute)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Workers (27 Microservices)                │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │   │
│  │  │  Groq  │ │ Think  │ │   Act  │ │Govern  │ │ Loader │    │   │
│  │  │  AI    │ │Engine  │ │Engine  │ │Engine  │ │Engine  │    │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │   │
│  │  │Normalize│ │ Spine  │ │Context │ │ Audit  │ │ n8n    │    │   │
│  │  │ Engine  │ │ Read   │ │ Store  │ │ Store  │ │ Webhook│    │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  R2 Storage (Document Blobs)  │  KV (Rate Limiting/Cache)  │   │
│  │  D1 (Edge SQLite)             │  Durable Objects (State)   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Why This Architecture?

| Component | Purpose | Why This Choice |
|-----------|---------|-----------------|
| **Supabase** | Auth + Database + Storage | Single platform for core data, built-in RLS, excellent DX |
| **Cloudflare Workers** | Edge computing, AI inference | 300+ locations, <50ms cold start, perfect for AI workloads |
| **R2** | File storage | S3-compatible, zero egress fees, integrates with Workers |

## Migration Checklist: Neon → Supabase

### 1. Pre-Migration (Before touching production)

```bash
# Backup current Neon data
pg_dump $NEON_DATABASE_URL > backup_neon_$(date +%Y%m%d).sql

# Verify Supabase project is ready
# Go to: https://app.supabase.com/project/_/settings/database
```

### 2. Database Migration

```bash
# 1. Get your Supabase connection strings from:
# Dashboard → Project Settings → Database → Connection Pooling

# 2. Update environment variables
cp .env.supabase-only .env.local
# Edit .env.local with your Supabase values

# 3. Run existing migrations on Supabase
# Supabase migrations are already in: sql-migrations/
supabase migration up

# 4. Import data from Neon (if needed)
psql $SUPABASE_DIRECT_URL < backup_neon_$(date +%Y%m%d).sql
```

### 3. Code Changes Required

#### Files to Update

| File | Change |
|------|--------|
| `apps/web/src/lib/db/index.ts` | Remove Neon import, use Supabase |
| `apps/web/src/lib/supabase/client.ts` | Already configured ✓ |
| `apps/web/src/middleware.ts` | Already uses Supabase ✓ |
| `packages/database/*` | Replace with Supabase client |

#### Connection Pattern Change

**Before (Neon):**
```typescript
import { Pool } from '@neondatabase/serverless'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

**After (Supabase):**
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 4. Workers Configuration Update

Each Cloudflare Worker needs these environment variables:

```bash
# Set in Cloudflare Dashboard → Workers → [Worker] → Settings → Variables

# Required for ALL workers
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Worker-specific
GROQ_API_KEY=gsk-...
OPENROUTER_API_KEY=sk-or-v1-...
```

### 5. Vercel Deployment

```bash
# Required environment variables in Vercel:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                    # Supabase pooled connection
DIRECT_URL=                      # Supabase direct connection

# Remove these (Neon):
# NEON_CONNECTION_STRING
# NEON_DATABASE_URL
```

## Environment Variable Mapping

| Old (Neon) | New (Supabase) | Notes |
|------------|----------------|-------|
| `NEON_CONNECTION_STRING` | `DATABASE_URL` | Use Supabase pooler URL |
| `NEON_DATABASE_URL` | `DIRECT_URL` | Use Supabase direct URL |
| `SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` | Unchanged |
| `SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Unchanged |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SERVICE_ROLE_KEY` | Unchanged |

## Testing After Migration

```bash
# 1. Test database connection
npm run test:db

# 2. Test authentication
npm run test:auth

# 3. Test RBAC
npm run test:rbac

# 4. Full integration test
npm run test:integration
```

## Rollback Plan

If issues occur:

```bash
# 1. Revert to Neon
# Change DATABASE_URL back to Neon connection string
# Deploy previous version

# 2. Data sync (if data was written to Supabase)
# pg_dump $SUPABASE_DIRECT_URL > backup_supabase.sql
# psql $NEON_DATABASE_URL < backup_supabase.sql
```

## Cost Comparison

| Service | Neon (Before) | Supabase (After) | Savings |
|---------|---------------|------------------|---------|
| Database | $19/mo (Pro) | $25/mo (Pro) | -$6 |
| Auth | Supabase ($0) | Included | $0 |
| Storage | R2 ($0) | Included (100GB) | $0 |
| **Total** | **$19/mo** | **$25/mo** | **-$6** |

*Note: Supabase Pro includes more features (RLS, Realtime, Storage). Cloudflare Workers costs remain separate (~$5/mo for low traffic).*

## Next Steps

1. ✅ Create Supabase project
2. ✅ Run migrations
3. ⬜ Update environment variables
4. ⬜ Deploy to staging
5. ⬜ Run tests
6. ⬜ Production deploy
7. ⬜ Monitor for 24 hours
8. ⬜ Decommission Neon (after 7 days)
