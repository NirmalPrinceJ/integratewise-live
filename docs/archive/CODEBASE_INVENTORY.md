# IntegrateWise OS — Complete Codebase Inventory

> **Generated**: 2026-02-02  
> **Repository**: `integratewise/brainstroming`

---

## 🏗️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATEWISE OS                              │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)  │  Backend Services (Cloudflare Workers)   │
│  /src                │  /services                                │
├──────────────────────┼──────────────────────────────────────────┤
│  Shared Packages     │  Documentation                            │
│  /packages           │  /docs                                    │
└──────────────────────┴──────────────────────────────────────────┘
```

---

## 📦 Services (`/services`) — Cloudflare Workers

### Core Engine Services

| Service | Purpose | Status |
| ------- | ------- | ------ |
| **loader** | Ingestion gateway, 8-stage pipeline, webhook receiver | ✅ Production |
| **normalizer** | Schema validation, dedup, version control, trust scoring | ✅ Production |
| **store** | R2 storage, file uploads, version management | ✅ Production |
| **think** | Signals, situations, AI reasoning, cognitive layer | ✅ Production |
| **govern** | Policy engine, approval workflows, audit logging | ✅ Production |
| **act** | Action execution, connector dispatch | ✅ Production |
| **spine** | SSOT database, entity queries, timeline | ✅ Production |

### Supporting Services

| Service | Purpose | Status |
| ------- | ------- | ------ |
| **knowledge** | Document processing, RAG, embeddings | ✅ Production |
| **iq-hub** | Intelligence hub, AI chat, insights | ✅ Production |
| **orchestrator** | Workflow orchestration, job scheduling | ✅ Production |
| **gateway** | API gateway, routing | ✅ Production |
| **billing** | Usage tracking, metering, Stripe integration | ✅ Production |
| **tenants** | Multi-tenancy, onboarding | ✅ Production |
| **admin** | Admin dashboard backend | ✅ Production |
| **mcp-connector** | MCP protocol connector | ✅ Production |
| **integratewise-knowledge-bank** | Knowledge base service | ✅ Production |
| **os-ui** | OS UI backend | 🚧 In Progress |

---

## 📚 Packages (`/packages`) — Shared Libraries

### Core Packages

| Package | Purpose |
| ------- | ------- |
| **lib** | Utils, cache, circuit-breaker, error-handling, pagination |
| **types** | Shared TypeScript types |
| **api** | API client utilities |
| **db** | Database utilities, Neon/Supabase clients |
| **config** | Shared configuration |
| **rbac** | Role-based access control |
| **tenancy** | Multi-tenant utilities |

### Integration Packages

| Package | Purpose |
| ------- | ------- |
| **connectors** | All external integrations (see below) |
| **connector-contracts** | Connector interface definitions |
| **connector-utils** | Common connector utilities |
| **webhooks** | Webhook processing |
| **accelerators** | Revenue accelerators, value packs |

### Connector Catalog (`/packages/connectors/src`)

| Category | Connectors |
| -------- | ---------- |
| **CRM** | HubSpot, Salesforce |
| **Communication** | Slack, Email |
| **Project Management** | Jira, Asana, Linear |
| **Support** | Zendesk, Freshdesk |
| **Accounting** | QuickBooks, Xero |
| **Analytics** | Google Analytics |
| **Marketing** | Mailchimp, SFMC |
| **Compliance** | GDPR tools |
| **E-commerce** | Shopify |

---

## 🖥️ Frontend (`/src`) — Next.js Application

### App Routes (`/src/app/(app)`)

| Category | Routes |
| -------- | ------ |
| **Personal Workspace** | `/personal/*` - home, accounts, calendar, contacts, docs, meetings, notes, pipeline, projects, risks, team, analytics, expansion, knowledge |
| **Business Workspace** | `/business/*` - accounts, metrics, goals |
| **CS Workspace** | `/cs/*` - accounts, health, risks, renewals |
| **Sales Workspace** | `/sales/*` - pipeline, deals, forecasting |
| **Marketing Workspace** | `/marketing/*` - campaigns, leads |
| **Operations** | `/operations/*`, `/ops/*` - dashboards, workflows |
| **Admin** | `/admin/*` - users, tenants, settings, billing |
| **Engine Surfaces** | `/spine`, `/context`, `/knowledge`, `/think`, `/act`, `/govern`, `/loader`, `/iq-hub` |
| **Other** | `/signals`, `/insights`, `/sessions`, `/brainstorming`, `/workflow-builder` |

### API Routes (`/src/app/api`)

| Category | Endpoints |
| -------- | --------- |
| **Engine** | `/api/act`, `/api/adjust`, `/api/govern`, `/api/spine`, `/api/iq`, `/api/signals` |
| **Data** | `/api/entities`, `/api/documents`, `/api/evidence`, `/api/webhook-events` |
| **Integrations** | `/api/connectors`, `/api/hubspot`, `/api/webhooks/*`, `/api/mcp` |
| **AI** | `/api/ai`, `/api/brainstorm`, `/api/insights` |
| **Admin** | `/api/admin/*`, `/api/rbac/*`, `/api/tenant`, `/api/billing` |
| **Auth** | `/api/auth/*`, `/api/session` |
| **System** | `/api/health`, `/api/cron`, `/api/system` |

### Components (`/src/components`)

- **196+ components** across:
  - `cognitive/` - Cognitive layer UI
  - `personal/` - Personal workspace views
  - `views/` - View stubs
  - `engine/` - Engine surface components
  - `dashboard/` - Dashboard widgets
  - `ui/` - Design system components

### Hooks (`/src/hooks`)

- 9 custom hooks for state management and data fetching

### Services (`/src/services`)

- 24 service modules for API communication

---

## 📄 Documentation (`/docs`)

### Architecture & Design

- `ARCHITECTURE_DIAGRAM.md` - System architecture
- `ARCHITECTURE_OVERVIEW.md` - High-level overview
- `CLOUDFLARE_FULL_STACK_ARCHITECTURE.md` - Cloudflare stack details
- `LAYER_1_LAYER_2_ARCHITECTURE.md` - L1/L2 cognitive layers
- `L1_L2_VISUAL_ARCHITECTURE.md` - Visual diagrams
- `OS_SHELL_UX_UI_SPEC.md` - UI/UX specifications
- `UI_DESIGN_SYSTEM.md` - Design system

### Implementation Guides

- `IMPLEMENTATION_MASTER_PLAN.md` - Master implementation plan
- `IMPLEMENTATION_PHASES.md` - Phase breakdown
- `IMPLEMENTATION_GAP_ANALYSIS.md` - Gap analysis
- `8_STAGE_PIPELINE_IMPLEMENTATION.md` - Pipeline details
- `SIGNAL_MODEL.md` - Signal architecture
- `ACCOUNTS_INTELLIGENCE_SCHEMA.md` - Account intelligence

### Operations

- `SECURITY_TRUST_LAYER.md` - Security & trust layer
- `MONITORING_ALERTING.md` - Monitoring setup
- `WEBHOOK_RESILIENCE.md` - Webhook handling
- `BEST_PRACTICES_IMPLEMENTATION.md` - Best practices
- `TROUBLESHOOTING.md` - Troubleshooting guide

### Runbooks (`/docs/runbooks`)

- 5 operational runbooks

---

## 🗃️ Database Migrations (`/sql-migrations`)

| Migration | Purpose |
| --------- | ------- |
| `002_accounts_intelligence_os.sql` | Account intelligence schema |
| `003_signal_model.sql` | Signal engine tables |
| `004_canonical_artifacts.sql` | Artifact storage |
| `018_governance.sql` | Governance policies |
| `021_best_practice_guardrails.sql` | Guardrails |
| `025_layer2_cognitive_complete.sql` | L2 cognitive schema |
| `026_universal_spine_schema.sql` | Universal Spine SSOT |
| `031_rbac_system.sql` | RBAC tables |

**Total**: 34 SQL migration files

---

## 🚀 Apps (`/apps`)

| App | Purpose | Status |
| --- | ------- | ------ |
| **integratewise-os** | Main OS application | ✅ Active |
| **integratewise-core-engine** | Core engine app | ✅ Active |
| **integratewise-webhooks** | Webhook handlers | ✅ Active |
| **integratewise-os-internal** | Internal tools | 🚧 In Progress |
| **integratewise-os-new** | New OS version | 🚧 In Progress |

---

## 📊 Summary Statistics

| Category | Count |
| -------- | ----- |
| Services (Workers) | 17 |
| Packages | 16 |
| Connectors | 15+ |
| Frontend Routes | 42+ |
| API Routes | 47+ |
| Components | 196+ |
| Documentation Files | 50+ |
| SQL Migrations | 34 |
| Apps | 6 |

---

## 🔧 Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers, Hono.js, D1, R2, KV, Queues
- **Database**: Neon (PostgreSQL), Supabase, D1 (SQLite)
- **AI/ML**: OpenRouter, OpenAI, Embeddings
- **Auth**: Custom RBAC, JWT
- **Observability**: OpenTelemetry, structured logging
- **Deployment**: Cloudflare, Bitbucket Pipelines

---

*For detailed implementation guides, see individual documentation files in `/docs`.*
