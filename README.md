# IntegrateWise v3.6

**Unified Intelligence Platform.** Normalize once. Reason anywhere.

## Architecture Overview

IntegrateWise is a **cognitive integration intelligence platform** built on Cloudflare's global edge network with a modular 4-layer architecture (L0-L3) designed for enterprise-scale operations.

### Core Principles

- **Single Source of Truth (Spine)**: All normalized data flows through one canonical store
- **8-Stage Mandatory Pipeline**: Every data entity undergoes consistent processing
- **Three Data Flows**: Structured tools (A), Documents (B), and AI sessions (C)
- **Cognitive Layer**: L2 surfaces (Think, Act, Govern) for human-AI collaboration
- **Multi-tenant**: Built-in tenant isolation with RLS policies

## System Architecture (v3.6)

### 4-Layer Model

```
L0 → Onboarding (Initial setup, first connections)
L1 → Workspace (15 domain modules: Dashboard, Intelligence, Operations, etc.)
L2 → Cognitive Layer (14 components: SpineUI, Think, Act, Govern, Evidence, etc.)
L3 → Backend Engine (6 consolidated services on Cloudflare Workers)
```

### L3: Backend Services (6 Logical → 15 Physical Workers)

| Service | Workers | Purpose |
|---------|---------|----------|
| **① Gateway** | `gateway`, `admin`, `billing`, `tenants` | HTTP entry, auth, routing, rate limiting |
| **② Connector** | `loader`, `mcp-connector` | Tool webhooks, OAuth, AI sessions (MCP) |
| **③ Pipeline** | `normalizer`, `spine-v2` | 8-stage processing → Spine SSOT write |
| **④ Intelligence** | `think`, `act`, `govern`, `agents` | AI reasoning, policy, approvals, Colony |
| **⑤ Knowledge** | `knowledge`, `store` | Documents, embeddings (pgVector), R2 storage |
| **⑥ BFF** | `workflow` | Dashboard data, HITL queue UI, SSE streaming |

## 8-Stage Mandatory Pipeline

Every data entity flows through:

```
1. Analyze   → Schema validation, annotation
2. Classify  → Context (CTX) assignment
3. Filter    → Scope-based filtering
4. Refine    → Normalization to canonical models
5. Extract   → Relationship extraction + embeddings
6. Validate  → Fuzzy deduplication + business rules
7. Sanity    → AI anomaly detection
8. Sectorize → Route to Spine (SSOT) with transactional guarantees
```

## Data Stores

| Store | Technology | Purpose |
|-------|------------|----------|
| **Spine (SSOT)** | Supabase PostgreSQL | Single source of truth for all entities |
| **Context Store** | pgVector (Supabase) | Semantic embeddings, vector search |
| **Knowledge Store** | Supabase PostgreSQL | MCP session summaries, documents metadata |
| **Operations Store** | Supabase PostgreSQL | Audit logs, approval records |
| **Object Storage** | Cloudflare R2 | Files, PDFs, CSVs, artifacts |
| **Edge State** | Cloudflare D1 | Cursors, idempotency, sync state |

## Three Data Flows

### Flow A: Structured Tool Data (The Business Loop)

```
External Tool (HubSpot/Salesforce/etc)
  ↓ Webhook
Connector → Queue → Pipeline (8 stages) → Spine Write
  ↓
Think Engine → Signal/Situation
  ↓
Govern → Policy Evaluation
  ├─ Auto-approve → Act Engine → Tool Write-back
  └─ HITL → Approval Queue → Human approves → Act Engine
```

### Flow B: Unstructured Documents

```
User uploads PDF/CSV
  ↓
R2 Storage → Document Processor → Embeddings (pgVector)
  ↓
Entity Extraction → Pipeline (stages 5-8) → Spine
```

### Flow C: AI Sessions (MCP Protocol)

```
Claude/GPT (via MCP) → MCP Server
  ↓ Read (governed)
Spine Data → AI Response + Action Proposal
  ↓
Govern (HARD GATE) → HITL Approval → Act → Tool Write
  ↓
Session Summary (compressed, never full transcript) → Knowledge Store
```

## Live Services

### Production

| Service | URL | Platform |
|---------|-----|----------|
| **Marketing** | https://integratewise.co | Cloudflare Pages |
| **App** | https://integratewise.ai | Cloudflare Pages (Vite + React 18) |
| **API Gateway** | https://api.integratewise.ai | Cloudflare Workers |
| **Spine API** | https://spine.integratewise.online | Cloudflare Workers |
| **Files** | https://files.integratewise.ai | Cloudflare Workers (R2) |
| **n8n (MCP)** | https://n8n.integratewise.online | GCP (TCP instance) |

### Staging

All services deployed to `-staging` variants via GitHub Actions.

## Monorepo Structure

```
integratewise-live/
├── apps/
│   ├── web/                 # L1/L2 Workspace (Vite + React 18)
│   └── marketing/           # Landing site
├── services/                # L3 Backend (15 Cloudflare Workers)
│   ├── gateway/
│   ├── loader/
│   ├── normalizer/
│   ├── spine-v2/
│   ├── think/
│   ├── act/
│   ├── govern/
│   ├── agents/
│   ├── knowledge/
│   ├── store/
│   ├── workflow/
│   ├── mcp-connector/
│   ├── admin/
│   ├── billing/
│   └── tenants/
├── packages/                # Shared libraries
│   ├── accelerators/
│   ├── api/
│   ├── connectors/
│   ├── db/
│   ├── os-ui/
│   ├── rbac/
│   └── types/
├── sql-migrations/          # Supabase schema (111+ migrations)
├── docs/                    # Architecture documentation
└── .github/workflows/       # CI/CD pipelines
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Wrangler CLI
- Supabase CLI (optional, for local DB)

### Setup

```bash
# Install dependencies
pnpm install

# Copy env template
cp .env.example .env

# Run locally
pnpm dev  # Starts all services
```

### Individual Service Development

```bash
# Frontend (Vite + React)
cd apps/web && pnpm dev

# Backend Workers
cd services/gateway && pnpm dev
cd services/normalizer && pnpm dev
cd services/spine-v2 && pnpm dev
```

## Deployment

### Automated (GitHub Actions)

All services auto-deploy via GitHub Actions:

- **Staging**: Push to `main` → Deploy to `-staging` workers
- **Production**: Manual workflow dispatch with `environment: production`

Workflow: `.github/workflows/deploy-workers.yml`

### Manual Deployment

```bash
# Deploy all 15 workers to staging
cd services/gateway && wrangler deploy --env staging
cd services/normalizer && wrangler deploy --env staging
# ... repeat for all services

# Deploy to production
wrangler deploy --env production
```

### Secrets Management

Secrets stored in Cloudflare Workers environment variables:

```bash
# Set secrets via Wrangler
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put OPENROUTER_API_KEY
# ... etc
```

## Key Features

### Cognitive Layer (L2)

- **SpineUI**: Unified entity browser with 360° view
- **Think Engine**: AI reasoning for signals & situations
- **Act Engine**: Governed tool write-back with approval tokens
- **HITL (Human-in-the-Loop)**: Approval queue with policy evaluation
- **Digital Twin**: Proactive AI suggestions based on historical patterns
- **Evidence Drawer**: Contextual data for every AI decision

### Intelligence

- **4 Domain Agents**: ChurnShield, SuccessPilot, DataSentinel, ArchitectIQ
- **Colony Orchestrator**: Multi-agent reasoning for complex workflows
- **Signals**: Real-time anomaly detection (churn risk, revenue ops, etc.)
- **Situations**: Multi-signal correlation for actionable insights

### Governance

- **Policy Engine**: Configurable rules (auto-approve vs. HITL)
- **Approval Tokens**: One-time use tokens for governed writes
- **Audit Logs**: Immutable Operations Store for compliance
- **Tenant Isolation**: RLS policies + x-tenant-id header enforcement

## Tech Stack

### Frontend
- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS 4 + Framer Motion
- **State**: Jotai (atomic state management)
- **UI**: Custom `os-ui` component library

### Backend
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Framework**: Hono (lightweight HTTP)
- **Database**: Supabase PostgreSQL + pgVector
- **Storage**: Cloudflare R2 (S3-compatible)
- **Edge DB**: Cloudflare D1 (SQLite at edge)
- **Queues**: Cloudflare Queues (14 queues)
- **AI**: OpenRouter (multi-model routing)

### Infrastructure
- **Deployment**: Cloudflare Pages + Workers
- **CI/CD**: GitHub Actions
- **Monitoring**: Cloudflare Analytics
- **DNS**: Cloudflare

## Security

- **Authentication**: Supabase Auth (JWT)
- **Authorization**: RBAC + RLS policies
- **Tenant Isolation**: `x-tenant-id` header + PostgreSQL RLS
- **Webhook Verification**: HMAC signatures
- **Rate Limiting**: Per-tenant KV counters
- **Secrets**: Cloudflare environment variables (never in code)

## Contributing

This is a private repository for IntegrateWise development.

## Architecture Documentation

Detailed documentation available in `/docs`:

- `CANONICAL_ARCH_SPEC.md` - Complete architecture specification
- `ARCHITECTURE_OVERVIEW.md` - High-level system design
- `WIRING_VERIFICATION.md` - Service interconnection map
- `IMPLEMENTATION_PLAN.md` - 9-week deployment roadmap

## License

Proprietary - © 2024-2026 IntegrateWise

---

**v3.6 Architecture Status**: ✅ Fully implemented and deployed  
**Last Updated**: March 2026
