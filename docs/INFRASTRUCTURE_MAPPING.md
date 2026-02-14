# IntegrateWise Infrastructure Mapping

**Last Updated:** 2026-02-14
**Status:** Current Workspace → Proposed L0-L3 Architecture

---

## Executive Summary

This document maps the current IntegrateWise workspace structure to the proposed L0-L3 architecture outlined in the system specification. It provides a clear overview of:
- Current deployment infrastructure
- Frontend/UI components
- Backend services and APIs
- Data flow and storage
- Alignment gaps and migration path

---

## 1. Current Deployment Infrastructure

### Live Services

| Service | URL | Platform | Package/Path |
|---------|-----|----------|--------------|
| **Marketing Site** | https://integratewise.co | Cloudflare Pages | `packages/website/` |
| **Hub Dashboard** | https://integratewise-hub.vercel.app | Vercel | `apps/web/` |
| **Webhook Ingress** | https://webhooks.integratewise.online | Cloudflare Workers | `packages/webhooks/` |
| **Hub API** | https://hub-controller-api.workers.dev | Cloudflare Workers | `packages/api/` |

### Technology Stack

**Frontend:**
- Next.js 16.0.10 with React 19.2.0
- Radix UI component library
- Tailwind CSS for styling
- Supabase Auth with RLS
- Vercel deployment

**Backend:**
- Cloudflare Workers (edge compute)
- Hono framework (lightweight HTTP router)
- Neon PostgreSQL (serverless database)
- Wrangler CLI for deployments

**Build System:**
- pnpm@9.0.0 workspaces
- Turborepo for monorepo management
- TypeScript 5.x across all packages

---

## 2. Frontend/UI Components Mapping

### Current Structure: `apps/web/`

**L0 - Onboarding Layer**
- [x] `app/(auth)/login` - Login page
- [x] `app/(auth)/signup` - Signup page
- [x] `app/onboarding` - Onboarding flow

**L1 - Workspace Modules**

Current implementation in `apps/web/src/`:

| Proposed L1 Module | Current Path | Status |
|-------------------|--------------|--------|
| Home Dashboard | `components/workspace/` | ✅ Exists |
| Projects | `components/workspace/` | ✅ Exists |
| Accounts | `components/workspace/` | ⚠️ Partial |
| Contacts | `components/workspace/` | ⚠️ Partial |
| Meetings | `components/workspace/` | ❌ Missing |
| Docs | `components/workspace/` | ⚠️ Partial |
| Tasks | `components/workspace/` | ✅ Exists |
| Calendar | `components/workspace/` | ❌ Missing |
| Notes | `components/workspace/` | ⚠️ Partial |
| Knowledge Space | `components/knowledge/` | ✅ Exists |
| Team | `components/workspace/` | ⚠️ Partial |
| Pipeline | `components/workspace/` | ❌ Missing |
| Risks | `components/workspace/` | ❌ Missing |
| Expansion | `components/workspace/` | ❌ Missing |
| Analytics | `components/analytics/` | ✅ Exists |

**L2 - Cognitive Brain UI**

Current implementation:

| Proposed L2 Component | Current Path | Status |
|----------------------|--------------|--------|
| SpineUI | `components/spine/` | ✅ Exists |
| ContextUI | `components/cognitive/` | ✅ Exists |
| KnowledgeUI | `components/knowledge/` | ✅ Exists |
| Evidence | `components/evidence/` | ✅ Exists |
| Signals | `components/signals/` | ✅ Exists |
| Think | `components/think/` | ✅ Exists |
| Act | `components/think/` | ⚠️ Partial |
| HITL | `components/cognitive/` | ⚠️ Partial |
| Govern | `components/cognitive/` | ❌ Missing |
| Adjust | `components/cognitive/` | ❌ Missing |
| Repeat | `components/cognitive/` | ❌ Missing |
| AuditUI | `components/analytics/` | ⚠️ Partial |
| AgentConfig | `components/cognitive/` | ⚠️ Partial |
| DigitalTwin | `components/intelligence/` | ⚠️ Partial |

**Client Libraries** (`apps/web/src/lib/`):
- ✅ `agents/` - AI agent configuration
- ✅ `analytics/` - Analytics tracking
- ✅ `ingestion/` - Data ingestion client
- ✅ `monitoring/` - System monitoring
- ✅ `orchestration/` - Workflow orchestration

---

## 3. Backend Services Mapping

### Current Services: `services/`

**L2 - Cognitive Brain Services**

| Service Name | Package | Purpose | Alignment with L2 |
|-------------|---------|---------|-------------------|
| `cognitive-brain` | `services/cognitive-brain/` | Core reasoning engine | ✅ Think, Act, Evidence |
| `think` | `services/think/` | Analysis & decision making | ✅ Think Component |
| `act` | `services/act/` | Action execution | ✅ Act Component |
| `knowledge` | `services/knowledge/` | Knowledge management | ✅ KnowledgeUI |
| `agents` | `services/agents/` | AI agent orchestration | ✅ AgentConfig |
| `govern` | `services/govern/` | Governance & HITL | ✅ Govern, HITL |

**L3 - Adaptive Spine Services**

| Service Name | Package | Purpose | Alignment with L3 |
|-------------|---------|---------|-------------------|
| `spine` | `services/spine/` | Single Source of Truth | ✅ Spine Data Store |
| `spine-v2` | `services/spine-v2/` | Spine v2 (experimental) | ⚠️ Migration in progress |
| `normalizer` | `services/normalizer/` | Data normalization | ✅ 8-Stage Pipeline Stage 1-7 |
| `memory-consolidator` | `services/memory-consolidator/` | Memory consolidation | ✅ Hot Memory consolidation |
| `loader` | `services/loader/` | Data loading | ✅ Context Store ingestion |

**Infrastructure Services**

| Service Name | Package | Purpose |
|-------------|---------|---------|
| `gateway` | `services/gateway/` | API Gateway & routing |
| `stream-gateway` | `services/stream-gateway/` | Real-time streaming |
| `admin` | `services/admin/` | Admin operations |
| `tenants` | `services/tenants/` | Multi-tenancy management |
| `workflow` | `services/workflow/` | Workflow orchestration |
| `views` | `services/views/` | View layer management |
| `cloudflare-workers` | `services/cloudflare-workers/` | Cloudflare Workers utilities |
| `mcp-connector` | `services/mcp-connector/` | MCP (Model Context Protocol) integration |

### Current Packages: `packages/`

**Shared Libraries**

| Package | Purpose | Alignment |
|---------|---------|-----------|
| `accelerators` | Pre-built connectors & workflows | ✅ L3 Accelerators |
| `analytics` | Analytics utilities | ✅ Analytics Module |
| `api` | Hub Controller API | ✅ Central API |
| `connectors` | External system connectors | ✅ L3 Connectors |
| `connector-contracts` | Connector type definitions | ✅ Connector framework |
| `connector-utils` | Connector utilities | ✅ Connector helpers |
| `db` | Database utilities | ✅ Data layer |
| `lib` | Shared libraries | ✅ Common utilities |
| `rbac` | Role-based access control | ✅ Security layer |
| `tenancy` | Multi-tenancy support | ✅ Tenant isolation |
| `types` | TypeScript type definitions | ✅ Type safety |
| `supabase` | Supabase client | ✅ Auth & storage |
| `webhooks` | Webhook ingress (15 providers) | ✅ External integrations |
| `integratewise-mcp-tool-connector` | MCP tool integration | ✅ AI session capture |

---

## 4. Data Flow & Storage Mapping

### Current Database: Neon PostgreSQL

**Primary Database:**
- Connection managed via `@neondatabase/serverless`
- Used by: spine, cognitive-brain, think, act, knowledge, gateway, webhooks
- Schema: Not yet documented in codebase

**Proposed L3 Data Stores → Current Implementation:**

| Proposed Store | Current Implementation | Status |
|----------------|----------------------|--------|
| **Spine (SSOT)** | `spine` service + Neon DB | ✅ Exists |
| **Context Store** | `cognitive-brain` service + Neon DB | ⚠️ Partial |
| **AI Chats Store** | `mcp-connector` service | ⚠️ Partial |
| **Audit Store** | `admin` service + Neon DB | ❌ Missing |
| **Hot Memory** | `memory-consolidator` service | ✅ Exists |
| **DLQ (Dead Letter Queue)** | Not implemented | ❌ Missing |

### Data Ingestion Planes

**Proposed 3 Planes → Current Implementation:**

| Plane | Proposed Source | Current Implementation | Status |
|-------|----------------|----------------------|--------|
| **Structured Data** | ERPs, CRMs, Accounting | `webhooks` (15 providers) | ✅ Partial |
| **Unstructured Data** | Docs, emails, notes | `loader` service | ⚠️ Partial |
| **AI Chat Sessions** | MCP protocol | `mcp-connector` | ⚠️ Partial |

**Current Webhook Providers (15 total):**
- CRM: HubSpot, Salesforce, Pipedrive
- Marketing: LinkedIn, Canva, Google Ads, Meta
- Communication: WhatsApp
- Payments: Razorpay, Stripe
- Dev: GitHub, Vercel
- Productivity: Todoist, Notion
- Internal: AI Relay

### 8-Stage Mandatory Pipeline

**Proposed Pipeline → Current Services:**

| Stage | Proposed Function | Current Service | Status |
|-------|------------------|----------------|--------|
| 1. Analyzer | Initial analysis | `normalizer` | ⚠️ Partial |
| 2. Classifier | Data classification | `normalizer` | ⚠️ Partial |
| 3. Filter | Noise removal | `normalizer` | ⚠️ Partial |
| 4. Refiner | Data refinement | `normalizer` | ⚠️ Partial |
| 5. Extractor | Entity extraction | `normalizer` | ⚠️ Partial |
| 6. Validator | Validation rules | `normalizer` | ⚠️ Partial |
| 7. Sanity Scan | Final checks | `normalizer` | ⚠️ Partial |
| 8. Sectorizer | Sectoring/routing | `gateway` | ⚠️ Partial |

---

## 5. Infrastructure Gaps & Migration Path

### Critical Gaps

**L1 Workspace Modules - Missing:**
- ❌ Meetings module
- ❌ Calendar module
- ❌ Pipeline management
- ❌ Risk tracking
- ❌ Expansion planning

**L2 Cognitive Components - Missing:**
- ❌ Govern component (governance workflows)
- ❌ Adjust component (feedback loop)
- ❌ Repeat component (continuous improvement)

**L3 Backend - Missing:**
- ❌ Audit Store (compliance tracking)
- ❌ DLQ (Dead Letter Queue for failed events)
- ❌ Complete 8-stage pipeline implementation
- ❌ Dual-loop architecture (Context-to-Truth & Tool-to-Truth)
- ❌ pgvector integration for embeddings
- ❌ Cloudflare Queues for async processing
- ❌ Cloudflare Durable Objects for stateful logic

### Partial Implementations

**Needs Completion:**
- ⚠️ Context Store (cognitive-brain service exists but incomplete)
- ⚠️ AI Chats Store (mcp-connector exists but not fully integrated)
- ⚠️ 8-Stage Pipeline (normalizer service exists but stages not fully implemented)
- ⚠️ HITL component (partial UI exists, backend governance missing)

### Migration Priorities

**Phase 1: Complete L3 Foundation**
1. Implement complete 8-stage pipeline in `normalizer` service
2. Add Audit Store to track all data transformations
3. Implement DLQ for failed webhook/event processing
4. Add pgvector to Neon DB for embeddings
5. Integrate Cloudflare Queues for async pipeline stages

**Phase 2: Complete L2 Cognitive Brain**
1. Implement Govern service for HITL workflows
2. Add Adjust service for feedback loops
3. Add Repeat service for continuous improvement
4. Fully integrate Context Store with dual-loop architecture

**Phase 3: Complete L1 Workspace**
1. Build missing modules: Meetings, Calendar, Pipeline, Risks, Expansion
2. Enhance partial modules: Accounts, Contacts, Docs, Notes, Team
3. Implement goal-linking across all modules

**Phase 4: AI Agents & Governance**
1. Implement 7 AI agents (currently: agents service exists but not 7 distinct agents)
2. Add approval-only execution model (HITL gates)
3. Integrate MCP session capture across all AI interactions

---

## 6. Deployment Architecture

### Current Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (L0 + L1)                       │
│                                                               │
│  apps/web (Next.js)                                          │
│  ├── Onboarding (/login, /signup, /onboarding)              │
│  ├── Workspace Modules (/dashboard, /projects, /tasks...)   │
│  └── Cognitive UI (/spine, /knowledge, /evidence...)        │
│                                                               │
│  Deployed to: Vercel                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (L3)                          │
│                                                               │
│  packages/api (Hono on Cloudflare Workers)                   │
│  └── Hub Controller API                                      │
│                                                               │
│  Deployed to: Cloudflare Workers                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND SERVICES (L2 + L3)                   │
│                                                               │
│  Cognitive Brain (L2):                                       │
│  ├── cognitive-brain (Cloudflare Workers)                    │
│  ├── think (Cloudflare Workers)                              │
│  ├── act (Cloudflare Workers)                                │
│  ├── knowledge (Cloudflare Workers)                          │
│  └── agents (Cloudflare Workers)                             │
│                                                               │
│  Adaptive Spine (L3):                                        │
│  ├── spine (Cloudflare Workers)                              │
│  ├── normalizer (Cloudflare Workers)                         │
│  ├── memory-consolidator (Cloudflare Workers)                │
│  └── gateway (Cloudflare Workers)                            │
│                                                               │
│  All deployed to: Cloudflare Workers                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (L3)                           │
│                                                               │
│  Neon PostgreSQL (Serverless)                                │
│  ├── Spine DB (SSOT)                                         │
│  ├── Context Store                                           │
│  └── Hot Memory                                              │
│                                                               │
│  Missing: Audit Store, DLQ, pgvector                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                EXTERNAL INTEGRATIONS                         │
│                                                               │
│  packages/webhooks (Cloudflare Workers)                      │
│  └── 15 webhook providers (HubSpot, Salesforce, GitHub...)  │
│                                                               │
│  Deployed to: Cloudflare Workers                             │
└─────────────────────────────────────────────────────────────┘
```

### Proposed Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  L0: Onboarding → apps/web/(auth)                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  L1: Workspace (15 Modules) → apps/web/workspace            │
│  All modules with goal-linking & growth alignment            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  L2: Cognitive Brain (14 Components)                        │
│  ├── SpineUI, ContextUI, KnowledgeUI, Evidence, Signals    │
│  ├── Think, Act, HITL, Govern, Adjust, Repeat              │
│  └── AuditUI, AgentConfig, DigitalTwin                      │
│                                                               │
│  Dual-Loop: Context-to-Truth ↔ Tool-to-Truth                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  L3: Adaptive Spine (Backend)                               │
│                                                               │
│  8-Stage Pipeline (ALL data flows through):                 │
│  Analyzer → Classifier → Filter → Refiner → Extractor       │
│  → Validator → Sanity Scan → Sectorizer                     │
│                                                               │
│  4 Accelerators:                                             │
│  ├── Event Mesh Accelerator (webhooks, real-time)          │
│  ├── Workflow Copilot Accelerator (automation)             │
│  ├── SSOT Optimizer Accelerator (data quality)             │
│  └── AI Guardrails Accelerator (safety)                     │
│                                                               │
│  6 Data Stores:                                              │
│  ├── Spine (SSOT) - Neon + pgvector                        │
│  ├── Context Store - Neon                                   │
│  ├── AI Chats Store - Neon (MCP protocol)                  │
│  ├── Audit Store - Neon (compliance)                        │
│  ├── Hot Memory - Redis/KV                                  │
│  └── DLQ - Cloudflare Queues                                │
│                                                               │
│  7 AI Agents (Approval-Only):                               │
│  All agents require HITL approval before execution           │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Technical Debt & Recommendations

### Immediate Actions

1. **Document Database Schema**
   - Create migration files for Neon PostgreSQL
   - Document all tables, relationships, indexes
   - Add schema versioning

2. **Implement Missing L3 Components**
   - Audit Store (critical for compliance)
   - DLQ (critical for reliability)
   - Complete 8-stage pipeline
   - Add pgvector for embeddings

3. **Standardize Service Structure**
   - All services should use consistent patterns
   - Update older services (spine, gateway) to match newer patterns (act, knowledge)
   - Ensure all services have tests

4. **Complete L1 Workspace Modules**
   - Build: Meetings, Calendar, Pipeline, Risks, Expansion
   - These are core to the "growth-aligned" vision

### Medium-Term Improvements

1. **Implement Dual-Loop Architecture**
   - Context-to-Truth loop (data → spine → context)
   - Tool-to-Truth loop (actions → validation → spine)

2. **Add 7 Distinct AI Agents**
   - Currently "agents" service exists but not 7 agents
   - Each agent needs clear purpose, boundaries, approval gates

3. **Enhance HITL Governance**
   - Build complete Govern service
   - Implement approval workflows
   - Add audit trail for all AI actions

4. **Monitoring & Observability**
   - Add comprehensive logging
   - Implement distributed tracing
   - Monitor pipeline stage performance

### Long-Term Vision

1. **Full MCP Integration**
   - Capture all AI sessions
   - Build AI Chats Store with full history
   - Enable "reasoning replay" for debugging

2. **Advanced Analytics**
   - Goal progress tracking
   - Growth metrics dashboard
   - Predictive insights

3. **Multi-Tenancy at Scale**
   - Currently `tenants` service exists
   - Ensure all services respect tenant boundaries
   - Implement tenant-level quotas & limits

---

## 8. Next Steps

### For Development Team

1. **Read this mapping document**
2. **Install dependencies**: `corepack enable && corepack prepare pnpm@9.0.0 && pnpm install`
3. **Document current database schema**
4. **Create migration plan** for gaps identified in Section 5
5. **Prioritize** based on Migration Priorities in Section 5

### For Product/Design Team

1. **Review L1 Workspace module gaps** (Meetings, Calendar, Pipeline, Risks, Expansion)
2. **Design missing UI components** for L2 Cognitive Brain
3. **Define user flows** for HITL approval gates
4. **Document goal-linking** requirements across all modules

### For Architecture Team

1. **Finalize 8-stage pipeline specification**
2. **Design dual-loop architecture**
3. **Define 7 AI agents** (purpose, capabilities, boundaries)
4. **Plan Cloudflare Queues integration** for async processing
5. **Design Audit Store schema** for compliance tracking

---

## Appendix A: File Structure Reference

```
integratewise-brainstroming/
├── apps/
│   └── web/                    # L0+L1 Frontend (Next.js, Vercel)
│       ├── src/
│       │   ├── app/           # App routes
│       │   ├── components/    # UI components (workspace, cognitive, etc.)
│       │   └── lib/           # Client libraries
│       └── package.json
│
├── packages/
│   ├── api/                    # Hub Controller API (Cloudflare Workers)
│   ├── webhooks/               # Webhook Ingress (Cloudflare Workers)
│   ├── accelerators/           # Pre-built connectors
│   ├── connectors/             # External integrations
│   ├── rbac/                   # Role-based access
│   ├── tenancy/                # Multi-tenancy
│   └── types/                  # Shared types
│
├── services/
│   ├── cognitive-brain/        # L2 Core reasoning
│   ├── think/                  # L2 Think component
│   ├── act/                    # L2 Act component
│   ├── knowledge/              # L2 Knowledge management
│   ├── agents/                 # L2 AI agents
│   ├── govern/                 # L2 Governance
│   ├── spine/                  # L3 SSOT
│   ├── normalizer/             # L3 8-stage pipeline
│   ├── memory-consolidator/    # L3 Hot memory
│   ├── gateway/                # L3 API gateway
│   └── ...                     # (20 services total)
│
├── docs/
│   ├── CANONICAL_OS_LAYER_MODEL.md
│   ├── INFRASTRUCTURE_MAPPING.md (this file)
│   └── ...
│
└── configs/                    # Shared configs (symlinked)
```

---

**Document Version:** 1.0
**Author:** IntegrateWise Engineering Team
**Last Review:** 2026-02-14
