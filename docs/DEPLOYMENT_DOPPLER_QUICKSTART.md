# 🚀 Doppler Deployment Quickstart

## 1-Minute Deploy

```bash
# 1. Ensure you're logged in
doppler whoami

# 2. Deploy web to production
cd integratewise-complete
./scripts/deploy-with-doppler.sh web production

# 3. Deploy a worker
./scripts/deploy-with-doppler.sh spine-v2 production

# 4. Deploy everything
./scripts/deploy-with-doppler.sh all production
```

---

## Environment Mapping

| Environment | Doppler Config Prefix | Usage |
|-------------|----------------------|-------|
| Development | `dev_` | Local dev, testing |
| Staging | `stg_` | Pre-prod testing |
| Production | `prd_` | Live production |

---

## Service Configs

Each service has 3 configs (dev, stg, prd):

```
web              → Next.js frontend
spine-v2         → Spine service
loader           → Pipeline loader
normalizer       → Data normalizer
connector        → Tool connectors
cognitive-brain  → AI layer
stream-gateway   → API gateway
memory-consolidator
workflow         → n8n workflows
agents           → AI agents
```

**Total**: 10 services × 3 environments = 30 Doppler configs

---

## Common Commands

```bash
# View secrets for a service
doppler secrets --config prd_web

# Set a secret
doppler secrets set KEY value --config prd_web

# Run locally with dev secrets
doppler run --config dev_web -- npm run dev

# Deploy web staging
doppler run --config stg_web -- vercel

# Deploy worker production
doppler run --config prd_spine-v2 -- wrangler deploy
```

---

## Migration: Neon → Supabase

Secrets to update in Doppler:

```bash
# For each environment
for env in dev stg prd; do
  # Update web
  doppler secrets set DATABASE_URL "postgresql://..." --config ${env}_web
  doppler secrets set DIRECT_URL "postgresql://..." --config ${env}_web
  
  # Update workers
  for svc in spine-v2 loader normalizer connector cognitive-brain; do
    doppler secrets set SUPABASE_URL "https://..." --config ${env}_${svc}
    doppler secrets set SUPABASE_SERVICE_ROLE_KEY "..." --config ${env}_${svc}
  done
done
```

---

## Files

| File | Purpose |
|------|---------|
| `doppler.yaml` | Doppler project configuration |
| `scripts/deploy-with-doppler.sh` | Deploy script |
| `DEPLOYMENT_DOPPLER.md` | Full documentation |
| `docs/deployment/DOPPLER_INTEGRATION_COMPLETE.md` | Original integration |
