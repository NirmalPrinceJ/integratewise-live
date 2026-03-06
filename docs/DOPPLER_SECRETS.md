# Doppler Secret Management — IntegrateWise OS

> **Single source of truth** for all secrets across the IntegrateWise stack.
> Every env var lives in Doppler. Zero `.env` files in production.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DOPPLER                               │
│  Project: integratewise                                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     dev_*     │  │     stg_*     │  │     prd_*     │     │
│  │  Development  │  │   Staging     │  │  Production   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │               │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │  Local Dev   │   │  Preview     │   │  Production  │
   │  doppler run │   │  CI branch   │   │  main branch │
   └─────────────┘   └─────────────┘   └─────────────┘
```

## Config Naming Convention

Each config follows the pattern: `{env}_{service}`

| Environment | Prefix | Example Config        |
|------------|--------|-----------------------|
| Development | `dev_` | `dev_web-unified`    |
| Staging     | `stg_` | `stg_spine-v2`       |
| Production  | `prd_` | `prd_cognitive-brain` |

## Services & Their Configs

### Frontend — `web-unified` (Cloudflare Pages)

Secrets are injected at **build time** via `doppler run -- npm run build`.
All keys must be prefixed with `VITE_` to be exposed to client-side code.

| Secret | Required | Description |
|--------|----------|-------------|
| `VITE_SUPABASE_URL` | No* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No* | Supabase public anon key |
| `VITE_API_BASE_URL` | Yes | Gateway Worker URL (empty = mock mode) |
| `VITE_POSTHOG_KEY` | No | PostHog analytics key |
| `VITE_POSTHOG_HOST` | No | PostHog host URL |
| `VITE_SENTRY_DSN` | No | Sentry error tracking DSN |
| `VITE_ENABLE_ADMIN_PANEL` | No | Feature flag: admin panel |
| `VITE_ENABLE_AI_CHAT` | No | Feature flag: AI chat |

> \* Supabase URL and anon key have hardcoded fallbacks from the Figma app setup.
> They only need to be in Doppler if you want to override them per environment.

### Backend Workers (Cloudflare Workers)

Secrets are synced via `scripts/sync-doppler-to-workers.sh` → `wrangler secret put`.
Non-secret config values go in `wrangler.toml [vars]`.

#### Core Secrets (shared across most Workers)

| Secret | Services | Description |
|--------|----------|-------------|
| `SUPABASE_URL` | All | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | All | Supabase service-role key (server-side) |
| `SUPABASE_ANON_KEY` | spine-v2, stream-gateway | Public anon key |
| `JWT_SECRET` | spine-v2, stream-gateway | Supabase JWT secret |
| `NEON_DB_URL` | spine-v2, loader | Direct Postgres connection string |

#### AI Secrets

| Secret | Services | Description |
|--------|----------|-------------|
| `OPENAI_API_KEY` | cognitive-brain, agents, think | OpenAI API key |
| `ANTHROPIC_API_KEY` | cognitive-brain, agents, think | Anthropic (Claude) API key |

#### Observability

| Secret | Services | Description |
|--------|----------|-------------|
| `SENTRY_DSN` | All (optional) | Sentry error tracking |
| `POSTHOG_API_KEY` | spine-v2, stream-gateway | PostHog server-side analytics |

#### Service-Specific

| Secret | Service | Description |
|--------|---------|-------------|
| `N8N_WEBHOOK_URL` | workflow | n8n webhook endpoint |
| `N8N_API_KEY` | workflow | n8n API key |
| `R2_ACCESS_KEY_ID` | loader, knowledge | R2 storage credentials |
| `R2_SECRET_ACCESS_KEY` | loader, knowledge | R2 storage credentials |
| `STRIPE_SECRET_KEY` | billing | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | billing | Stripe webhook signing secret |

## Worker Service Matrix

| Service | Doppler Config | Route | Key Secrets |
|---------|---------------|-------|-------------|
| spine-v2 | `{env}_spine-v2` | `api.integratewise.ai/v2/spine/*` | SUPABASE_*, JWT_SECRET, NEON_DB_URL |
| loader | `{env}_loader` | — (queue consumer) | SUPABASE_*, NEON_DB_URL, R2_* |
| normalizer | `{env}_normalizer` | — (queue consumer) | SUPABASE_* |
| cognitive-brain | `{env}_cognitive-brain` | `cognitive.integratewise.ai/*` | SUPABASE_*, OPENAI_API_KEY, ANTHROPIC_API_KEY |
| stream-gateway | `{env}_stream-gateway` | `stream.integratewise.ai/*` | SUPABASE_*, JWT_SECRET |
| memory-consolidator | `{env}_memory-consolidator` | — (cron) | SUPABASE_* |
| workflow | `{env}_workflow` | — (internal) | SUPABASE_*, N8N_* |
| agents | `{env}_agents` | — (internal) | SUPABASE_*, OPENAI_API_KEY, ANTHROPIC_API_KEY |
| knowledge | `{env}_knowledge` | — (internal) | SUPABASE_*, R2_* |
| tenants | `{env}_tenants` | — (internal) | SUPABASE_* |
| admin | `{env}_admin` | — (internal) | SUPABASE_* |
| billing | `{env}_billing` | — (internal) | SUPABASE_*, STRIPE_* |
| govern | `{env}_govern` | — (internal) | SUPABASE_* |
| act | `{env}_act` | — (internal) | SUPABASE_* |
| think | `{env}_think` | — (internal) | SUPABASE_*, OPENAI_API_KEY, ANTHROPIC_API_KEY |
| views | `{env}_views` | — (internal) | SUPABASE_* |
| mcp-connector | `{env}_mcp-connector` | — (internal) | SUPABASE_*, tool-specific OAuth tokens |

## Commands

### Local Development

```bash
# Run frontend with dev secrets
doppler run --config dev_web-unified -- npm run dev

# Run a specific worker locally
doppler run --config dev_spine-v2 -- wrangler dev

# View secrets for a config
doppler secrets --config prd_web-unified

# Set a secret
doppler secrets set OPENAI_API_KEY sk-xxx --config prd_cognitive-brain
```

### Deploying

```bash
# Deploy frontend (build-time injection)
./scripts/deploy-with-doppler.sh web-unified production

# Deploy a specific worker
./scripts/deploy-with-doppler.sh spine-v2 production

# Deploy everything
./scripts/deploy-with-doppler.sh all production

# Sync secrets to Workers (after rotating a key)
./scripts/sync-doppler-to-workers.sh production          # All workers
./scripts/sync-doppler-to-workers.sh production spine-v2  # Just spine-v2
```

### CI/CD (GitHub Actions)

Required GitHub Secrets:

| GitHub Secret | Value |
|---------------|-------|
| `DOPPLER_TOKEN_WEB_UNIFIED` | Doppler service token for `prd_web-unified` |
| `DOPPLER_TOKEN_SPINE_V2` | Doppler service token for `prd_spine-v2` |
| `DOPPLER_TOKEN_COGNITIVE_BRAIN` | Doppler service token for `prd_cognitive-brain` |
| ... | One per deployed Worker |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (Pages + Workers) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

Generate service tokens:
```bash
doppler configs tokens create deploy-ci \
  --project integratewise \
  --config prd_web-unified
```

### First-Time Setup

```bash
# 1. Install Doppler CLI
brew install dopplerhq/cli/doppler  # macOS
# or: curl -Ls https://cli.doppler.com/install.sh | sh

# 2. Authenticate
doppler login

# 3. Set up web-unified configs (creates dev/stg/prd)
./scripts/doppler-setup-web-unified.sh

# 4. Set real secrets in Doppler dashboard or CLI
doppler secrets set VITE_API_BASE_URL https://gateway.integratewise.workers.dev \
  --config prd_web-unified

# 5. Verify
doppler run --config dev_web-unified -- npm run dev
```

## Secret Rotation Checklist

When rotating a secret:

1. Update the secret in Doppler: `doppler secrets set KEY new_value --config prd_{service}`
2. Sync to Cloudflare Workers: `./scripts/sync-doppler-to-workers.sh production`
3. Redeploy frontend if it's a `VITE_*` key: `./scripts/deploy-with-doppler.sh web-unified production`
4. Verify the service is healthy

## Security Notes

- **Never commit `.env` files** — use `.env.example` as documentation only
- **VITE_* keys are PUBLIC** — they're embedded in the frontend JavaScript bundle
- **SUPABASE_SERVICE_KEY is server-side only** — never expose it via VITE_* prefix
- **Doppler service tokens are scoped** — each CI job gets a token for exactly one config
- **Worker secrets are encrypted at rest** by Cloudflare

---

*Last updated: February 28, 2026*
