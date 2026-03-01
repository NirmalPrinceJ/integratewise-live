# IntegrateWise Deployment Overview

## 🎯 Quick Deploy

```bash
# 1. Login to Doppler
doppler login

# 2. Deploy everything
./scripts/deploy-with-doppler.sh all production
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DOPPLER (Secrets)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                │
│  │   dev    │  │   stg    │  │   prd    │                                │
│  │  (10)    │  │  (10)    │  │  (10)    │  ← 30 configs total            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                                │
└───────┼─────────────┼─────────────┼──────────────────────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌──────────────┬──────────────┬──────────────┐
│  Development │   Staging    │  Production  │
│  localhost   │  staging.    │  app.        │
│              │  integratewise.ai │ integratewise.ai │
└──────┬───────┴──────┬───────┴──────┬───────┘
       │              │              │
       ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE (Platform)                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │    Auth    │  │ PostgreSQL │  │  Storage   │  │  Realtime  │         │
│  │  (GoTrue)  │  │  (Spine)   │  │    (S3)    │  │ (WebSocket)│         │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
       ▲                                              ▲
       │                                              │
       ▼                                              ▼
┌─────────────────────────┐                  ┌─────────────────────────────┐
│  Next.js Frontend       │                  │  Cloudflare Workers (27)    │
│  (Vercel)               │                  │                             │
│                         │                  │  ┌─────────┐ ┌─────────┐   │
│  - Domain Shells        │                  │  │  Groq   │ │  Think  │   │
│  - RBAC (150+ roles)    │                  │  │   AI    │ │ Engine  │   │
│  - 32+ Views            │                  │  └─────────┘ └─────────┘   │
│                         │                  │  ┌─────────┐ ┌─────────┐   │
└─────────────────────────┘                  │  │   Act   │ │Govern   │   │
                                             │  │ Engine  │ │ Engine  │   │
                                             │  └─────────┘ └─────────┘   │
                                             └─────────────────────────────┘
```

---

## 📋 Deployment Matrix

| Component | Platform | Deploy Command |
|-----------|----------|----------------|
| Frontend | Vercel | `doppler run --config prd_web -- vercel --prod` |
| spine-v2 | Cloudflare | `./scripts/deploy-with-doppler.sh spine-v2 production` |
| loader | Cloudflare | `./scripts/deploy-with-doppler.sh loader production` |
| normalizer | Cloudflare | `./scripts/deploy-with-doppler.sh normalizer production` |
| connector | Cloudflare | `./scripts/deploy-with-doppler.sh connector production` |
| cognitive-brain | Cloudflare | `./scripts/deploy-with-doppler.sh cognitive-brain production` |
| All Workers | Cloudflare | `./scripts/deploy-with-doppler.sh all production` |

---

## 🔐 Secrets in Doppler

### Frontend (web)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
OPENROUTER_API_KEY
GROQ_API_KEY
LEMONSQUEEZY_API_KEY
SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_APP_URL
```

### Workers (each)
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GROQ_API_KEY
OPENROUTER_API_KEY
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CRON_SECRET
BUCKET_SIGNING_SECRET
```

---

## 🚀 Deploy Workflow

```bash
# 1. Check Doppler status
doppler whoami
doppler configs --project integratewise

# 2. Verify secrets
doppler secrets --config prd_web

# 3. Deploy frontend
./scripts/deploy-with-doppler.sh web production

# 4. Deploy workers
./scripts/deploy-with-doppler.sh all production

# 5. Verify deployment
./scripts/verify-deployment.sh
```

---

## 🔄 Neon → Supabase Migration

### Pre-Migration
```bash
# Backup Neon
pg_dump $NEON_DATABASE_URL > backup_neon.sql
```

### Update Doppler
```bash
# Update DATABASE_URL to Supabase in all configs
for env in dev stg prd; do
  doppler secrets set DATABASE_URL "postgresql://...pooler.supabase.com..." --config ${env}_web
  doppler secrets set DIRECT_URL "postgresql://...supabase.co..." --config ${env}_web
done
```

### Deploy
```bash
# Deploy with new secrets
./scripts/deploy-with-doppler.sh all production
```

---

## 📚 Docs

| Doc | Use For |
|-----|---------|
| `DEPLOYMENT_DOPPLER_QUICKSTART.md` | Quick 1-minute deploy |
| `DEPLOYMENT_DOPPLER.md` | Full Doppler guide |
| `DEPLOYMENT_READY.md` | Complete deployment checklist |
| `DEPLOYMENT_SUPABASE_CLOUDFLARE.md` | Architecture details |
| `MIGRATION_SUMMARY.md` | Migration technical details |
