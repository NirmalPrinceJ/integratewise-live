# IntegrateWise OS — Agent Navigation Guide

> **Architecture v3.6 LOCKED** — February 28, 2026
> **Founder & CEO:** Nirmal Prince J | IntegrateWise LLP | Bengaluru, India

## Repository Overview

This is the **IntegrateWise OS** unified monorepo — the world's first Universal Cognitive Operating System. All directories have been consolidated into a single structure.

**Infrastructure (LOCKED):** Supabase (Auth + PostgreSQL + pgVector) | Cloudflare (Workers + Pages + Queues + D1 + R2) | Doppler (189+ secrets)

## Codebase Structure

```
integratewise/
├── apps/
│   ├── web/                 # Vite + React 18 SPA (THE frontend)
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   │   ├── auth/          # Supabase PKCE auth (Google SSO, GitHub SSO)
│   │   │   │   ├── domains/       # Domain shells (CS, Sales, RevOps, Marketing, etc.)
│   │   │   │   ├── workspace/     # Workspace shell + L1 modules
│   │   │   │   ├── hydration/     # Hydration Fabric (5 providers)
│   │   │   │   ├── onboarding/    # L0 onboarding flow
│   │   │   │   ├── spine/         # Spine SSOT client
│   │   │   │   ├── goal-framework/# Goal/Metric/Outcome objects
│   │   │   │   └── ui/            # Radix UI component library
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts  # Unified v3.5 API client (all routes)
│   │   │   │   └── stream-client.ts # WebSocket/SSE real-time client
│   │   │   └── AppShell.tsx       # Root: AuthProvider → SpineProvider → WorkspaceApp
│   │   └── .env.example
│   ├── marketing/           # Landing page (Vite + React 18 + Tailwind v4)
│   ├── desktop/             # Placeholder
│   └── mobile/              # Placeholder
├── services/                # 25 Cloudflare Workers (consolidating to 6 → 3)
│   ├── gateway/             # Service ① — API Gateway (routes ALL requests)
│   ├── mcp-connector/       # Service ② — Connector Service
│   ├── spine-v2/            # Service ③ — Pipeline (Supabase PostgreSQL)
│   ├── cognitive-brain/     # Service ④ — Intelligence Engine
│   ├── knowledge/           # Service ⑤ — Knowledge Service
│   ├── stream-gateway/      # Service ⑥ — BFF + WebSocket
│   ├── govern/              # Approval gate (HARD GATE)
│   ├── act/                 # Execution engine
│   ├── think/               # Reasoning engine
│   └── ...                  # Additional services
├── packages/                # 18 shared packages
│   ├── types/               # Shared TypeScript types
│   ├── db/                  # Database utilities
│   ├── rbac/                # Role-based access control
│   ├── connectors/          # Connector adapters
│   └── ...
├── docs/                    # All documentation (100+ files)
├── scripts/                 # Deployment & utility scripts
├── sql-migrations/          # Supabase PostgreSQL migrations
├── public/                  # Static assets + No-Hallucination Library
├── configs/                 # Build configs (turbo, pnpm)
├── doppler.yaml             # Secret management config
├── pnpm-workspace.yaml      # Monorepo workspace definition
├── turbo.json               # Turborepo pipeline config
└── package.json             # Root package
```

## Architecture (v3.6)

**Four Layers:** L0 (Onboarding) → L1 (15 Workspace Modules) → L2 (14 Cognitive Components) → L3 (Backend Engine)

**Engine Loop:** LOAD → NORMALIZE → STORE → THINK → REVIEW & APPROVE (GOVERN) → ACT → REPEAT

**Three Data Flows:** Flow A (Structured Tool Data) | Flow B (Unstructured Docs) | Flow C (AI Chat via MCP — always HITL)

**8-Stage Pipeline:** Analyzer → Classifier → Filter → Refiner → Extractor → Validator → Sanity Scan → Sectorizer

**Govern is a HARD GATE:** No token = No execution. No exceptions.

## Key Files for Agents

### Frontend
- `apps/web/src/AppShell.tsx` — App lifecycle (Auth → Onboarding → Loader → Workspace)
- `apps/web/src/lib/api-client.ts` — ALL API routes (v3.5 contract)
- `apps/web/src/lib/stream-client.ts` — Real-time WebSocket/SSE
- `apps/web/src/components/spine/spine-client.tsx` — Spine SSOT consumer
- `apps/web/src/components/hydration/fabric-engine.tsx` — Hydration Fabric v3.5

### Backend
- `services/gateway/src/index.ts` — Gateway router (Hono) with JWT + RBAC
- `services/gateway/wrangler.toml` — Service bindings to all Workers

### Infrastructure
- `doppler.yaml` — All environment configs
- `scripts/sync-doppler-to-workers.sh` — Secret sync
- `.github/workflows/` — CI/CD pipelines

## API Route Map (v3.5 Section 22.1)

All routes go through Gateway → downstream Worker via Service Bindings:

| Route                    | Worker                         |
|--------------------------|--------------------------------|
| /api/v1/connector/*      | integratewise-mcp-connector    |
| /api/v1/pipeline/*       | integratewise-spine-v2         |
| /api/v1/intelligence/*   | integratewise-cognitive-brain  |
| /api/v1/knowledge/*      | integratewise-knowledge        |
| /api/v1/workspace/*      | integratewise-stream-gateway   |
| /api/v1/brainstorm       | integratewise-cognitive-brain  |
| /api/v1/cognitive/*      | Split across multiple Workers  |
| /stream/*                | integratewise-stream-gateway   |
| /admin/*                 | integratewise-admin            |

## Auth Headers (v3.5 Section 22.3)

| Header              | Required | Purpose                    |
|---------------------|----------|----------------------------|
| Authorization       | Yes      | Bearer JWT (Supabase PKCE) |
| x-tenant-id         | Yes      | Tenant isolation           |
| x-view-context      | No       | Domain context (CTX_CS...) |
| x-idempotency-key   | Writes   | Prevent duplicates         |
| x-approval-token    | Actions  | Govern gate token          |

## Quick Start

```bash
# Install dependencies
pnpm install

# Dev (frontend only — no backend needed, runs in mock mode)
pnpm --filter @integratewise/web dev

# Dev with live backend
doppler run --config dev_web -- pnpm --filter @integratewise/web dev

# Build
pnpm build

# Deploy Gateway Worker
doppler run --config prd_gateway -- wrangler deploy -c services/gateway/wrangler.toml
```

---
**Last Updated:** February 28, 2026
**Architecture Version:** 3.6 (LOCKED)
