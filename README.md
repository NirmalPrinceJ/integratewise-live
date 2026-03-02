# IntegrateWise OS

Universal Cognitive Operating System — Normalize once. Render anywhere.

**Architecture v3.6** | **Infrastructure:** Supabase · Cloudflare Workers · Doppler

## Live Services

| Service | URL | Platform |
|---------|-----|----------|
| Marketing Site | https://integratewise.co | Cloudflare Pages |
| Web App | https://app.integratewise.ai | Cloudflare Pages |
| API Gateway | https://gateway.integratewise.ai | Cloudflare Workers |

## Monorepo Structure

```
integratewise/
├── apps/
│   ├── web/                 # Vite + React 18 SPA (main frontend)
│   └── marketing/           # Landing page (Vite + React 18 + Tailwind v4)
├── services/                # 6 Consolidated Cloudflare Workers
│   ├── gateway/             # ① Gateway (+ admin + billing + tenants)
│   ├── connector/           # ② Connector (loader + mcp-connector + store)
│   ├── pipeline/            # ③ Pipeline (normalizer + spine-v2)
│   ├── intelligence/        # ④ Intelligence (think + act + govern + agents)
│   ├── knowledge/           # ⑤ Knowledge Service
│   └── workflow/            # ⑥ BFF (workflow + Durable Objects)
├── packages/                # Shared TypeScript packages
│   ├── types/               # Shared type definitions
│   ├── db/                  # Database utilities
│   ├── rbac/                # Role-based access control
│   └── connectors/          # Connector adapters
├── sql-migrations/          # Supabase PostgreSQL + D1 edge cache migrations
├── docs/                    # Architecture & operational documentation
├── scripts/                 # Deployment & utility scripts
├── doppler.yaml             # Secret management
├── pnpm-workspace.yaml      # Monorepo workspace definition
└── turbo.json               # Turborepo pipeline config
```

## Architecture (v3.6)

**Four Layers:** L0 (Onboarding) → L1 (15 Workspace Modules) → L2 (14 Cognitive Components) → L3 (Backend Engine)

**Engine Loop:** LOAD → NORMALIZE → STORE → THINK → REVIEW & APPROVE (GOVERN) → ACT → REPEAT

**Three Data Flows:**
- **Flow A** — Structured Tool Data (CRM, ticketing, etc.)
- **Flow B** — Unstructured Documents (files, PDFs, knowledge)
- **Flow C** — AI Chat via MCP (always Human-in-the-Loop)

**Govern is a HARD GATE:** No approval token = No execution. No exceptions.

## 6 Consolidated Workers

| Worker | Contains | Key Bindings |
|--------|----------|--------------|
| `integratewise-gateway` | gateway + admin + billing + tenants | KV (rate limits, sessions), Queue (connector.inbound) |
| `integratewise-connector` | loader + mcp-connector + store | R2, D1, KV, Cron (*/5 min), Queue producers |
| `integratewise-pipeline` | normalizer + spine-v2 | D1 cache, KV, Queue consumers/producers |
| `integratewise-intelligence` | think + act + govern + agents | Queue consumers (3), Queue producer (pipeline.process) |
| `integratewise-knowledge` | knowledge + iq-hub | R2, Queue consumer (knowledge.ingest) |
| `integratewise-bff` | workflow (BFF) | Durable Objects (StreamSession), Queue producer |

## API Route Map

All routes go through Gateway → downstream Worker via Service Bindings:

| Route | Worker |
|-------|--------|
| `/api/v1/connector/*` | integratewise-connector |
| `/api/v1/pipeline/*` | integratewise-pipeline |
| `/api/v1/intelligence/*` | integratewise-intelligence |
| `/api/v1/cognitive/*` | integratewise-intelligence |
| `/api/v1/brainstorm` | integratewise-intelligence |
| `/api/v1/knowledge/*` | integratewise-knowledge |
| `/api/v1/workspace/*` | integratewise-bff |
| `/stream/*` | integratewise-bff |
| `/admin/*` | internal (gateway) |
| `/webhooks/*` | integratewise-connector |

## Development

```bash
# Install dependencies
pnpm install

# Dev (frontend only — runs with mock data)
pnpm --filter @integratewise/web dev

# Dev with live backend (requires Doppler secrets)
doppler run --config dev_web -- pnpm --filter @integratewise/web dev

# Build all
pnpm build

# Typecheck
pnpm typecheck

# Run tests
pnpm test
```

## Deployment

```bash
# Deploy a specific Worker
doppler run --config prd_<service> -- wrangler deploy -c services/<service>/wrangler.toml

# Deploy all Workers (CI/CD handles this via .github/workflows/deploy-workers.yml)
# Order: pipeline → connector → intelligence → knowledge → workflow → gateway (LAST)
```

## Infrastructure

- **Database:** Supabase PostgreSQL (SSOT) + pgVector (semantic search)
- **Edge Cache:** Cloudflare D1 (hot reads) + KV (sessions, rate limits)
- **File Storage:** Cloudflare R2
- **Message Queues:** Cloudflare Queues (7 queues)
- **Secrets:** Doppler (189+ managed secrets)
- **Auth:** Supabase PKCE (Google SSO, GitHub SSO)
