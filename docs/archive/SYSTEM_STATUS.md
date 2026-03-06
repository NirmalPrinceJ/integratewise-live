# IntegrateWise OS — System Status & Architecture Reference

**Last Updated**: 3 February 2026

---

## 📊 Executive Summary

IntegrateWise OS is a **Workspace-First Agentic Operating System** built on Cloudflare's edge infrastructure. The system implements a **dual-layer UI architecture** (L1 Workspace + L2 Cognitive slide-up) with a microservices backend.

### Current State
- **15 Backend Services**: All deployed to Cloudflare Workers
- **16 Connectors**: Implemented (CRM, Support, Accounting, etc.)
- **6 Accelerators**: Domain-specific intelligence packs
- **D1 Database**: Primary storage (integratewise-spine-prod)
- **UI**: Next.js 16 with Layer 1/Layer 2 slide-up pattern

---

## 🏗️ Architecture Layers

### Layer 1: Workspace Surface (Daily Operations)
The primary user interface for daily work. Context-aware and adapts to role.

**15 Core Modules** (adapt by context: personal | business | csm | tam):
| Module | Purpose |
|--------|---------|
| Home | Entry point with metrics |
| Projects | Project/initiative tracking |
| Accounts | Account master records (360 view) |
| Contacts | Contact/stakeholder management |
| Meetings | Meeting management + transcripts |
| Docs | Document repository + OCR |
| Tasks | Task management + workflows |
| Calendar | Event scheduling + sync |
| Notes | Note-taking with entity links |
| Knowledge | Knowledge base + retrieval |
| Team | Team/org structure |
| Pipeline | Sales/renewal pipeline |
| Risks | Risk registers |
| Expansion | Growth tracking |
| Analytics | Dashboards + widgets |

### Layer 2: Cognitive Intelligence (Slides Up from Bottom)
Universal cognitive layer that slides up from L1. Same UI for all contexts, data filtered by RBAC.

**14 Components**:
| Component | Purpose |
|-----------|---------|
| Spine UI | SSOT projection (canonical entities) |
| Context UI | Unstructured data + extracted facts |
| Knowledge UI | Chunks + retrieval + summaries |
| Evidence Drawer | Timeline + provenance + evidence_refs |
| Signals/Situations | Materialized signals + situations |
| Think | Scoring + reasoning + context graph |
| Act | Agent workflows propose/execute |
| Human-in-Loop (HITL) | Approve/reject/redo controls |
| Govern | User configuration - write rules |
| Adjust | Corrections + self-heal |
| Repeat | Feedback loop from actions |
| Audit Trail | Immutable logs + exports |
| Agent Config | Registry + tools + limits |
| Digital Twin | Proactive context + memory |

### Layer 3: Backend Services (Cloudflare Workers)
Edge-deployed microservices handling all business logic.

---

## 🚀 Deployed Services Status

All services deployed to `*.connect-a1b.workers.dev` (verified 3 Feb 2026)

| Service | URL | Health | Lines | Purpose |
|---------|-----|--------|-------|---------|
| **Gateway** | integratewise-gateway | ✅ `/` 200 | 145 | API routing, rate limiting, auth |
| **IQ-Hub** | integratewise-iq-hub | ✅ `/` 200 | 600 | AI conversations, memories, cognitive intel |
| **Store** | integratewise-store | ✅ `/` 200 | 194 | Generic CRUD, R2 file storage |
| **Normalizer** | integratewise-normalizer | ✅ `/` 200 | 101 | Data transformation pipeline |
| **Loader** | integratewise-loader | ✅ `/` 200 | 190 | Data ingestion from connectors |
| **MCP Tool Server** | integratewise-mcp-tool-server | ✅ `/` 200 | 507 | Model Context Protocol tools |
| **Spine** | integratewise-spine | ✅ CF Access | 222 | System of Record (D1) |
| **Knowledge** | integratewise-knowledge | ✅ `/health` 200 | 600 | RAG, embeddings, semantic search |
| **Think** | integratewise-think | ✅ `/health` 200 | 184 | Signals, situations, analysis |
| **Act** | integratewise-act | ✅ `/health` 200 | 120 | Action execution with governance |
| **Govern** | integratewise-govern | ✅ `/health` 200 | 545 | User config, write rules, policies |
| **Agents** | integratewise-agents | ✅ `/health` 200 | 528 | Autonomous agent runtime |
| **Tenants** | integratewise-tenants | ✅ `/health` 200 | 55 | Multi-tenancy management |
| **Workflow** | integratewise-workflow | ✅ `/health` 200 | 298 | Visual workflow builder |
| **Admin** | integratewise-admin | ✅ `/` 200 | 21 | Admin dashboard backend |

### Recently Deployed Services
| Service | URL | Health | Purpose |
|---------|-----|--------|---------|
| **Webhooks** | integratewise-webhooks | ✅ `/` 200 | Webhook ingestion (14 providers) |
| **Billing** | integratewise-billing | ✅ `/` 200 | Subscriptions, usage, Stripe/RazorPay |

### Services Without Wrangler (Not Edge-Deployed)
| Service | Status | Notes |
|---------|--------|-------|
| Orchestrator | ⚠️ No wrangler | Workflow coordination |
| OS-UI | N/A | Frontend component library |
| Knowledge Bank | N/A | Standalone React app |

---

## 🔐 RBAC & Access Control

### RBAC Engine (`packages/rbac/`)
Comprehensive role-based access control with field-level permissions.

**Core Components**:
| Component | Location | Lines | Purpose |
|-----------|----------|-------|---------|
| Engine | `packages/rbac/src/engine.ts` | 473 | Permission evaluation |
| Middleware | `packages/rbac/src/middleware.ts` | - | Express/Hono integration |
| Worker MW | `packages/rbac/src/worker-middleware.ts` | - | Cloudflare Worker integration |
| Service | `src/services/security/rbac-service.ts` | 314 | Application-level RBAC |
| Schema | `sql-migrations/031_rbac_system.sql` | 283 | Database tables & functions |

**Permission Patterns**:
```
*:*           — Super admin (all permissions)
account:*     — All account operations
account:read  — Specific action on resource
*:read        — Read-only across all resources
```

**Database Tables**:
- `roles` — System + tenant-specific role definitions
- `user_roles` — User-to-role assignments with audit
- `permission_audit_log` — Compliance tracking for all checks

**SQL Functions**:
- `user_has_permission(user_id, tenant_id, permission)` — Wildcard-aware permission check

**Pre-configured Policies**:
| Policy | Roles | Permissions |
|--------|-------|-------------|
| `personal-policy` | personal | Own data only |
| `csm-policy` | csm | Assigned accounts |
| `admin-policy` | admin | Full access |

---

## 💰 Billing & Subscriptions

### Billing Service (`services/billing/`)
**URL**: `https://integratewise-billing.connect-a1b.workers.dev`

**Plans**:
| Plan | Monthly | Users | Integrations | AI Queries |
|------|---------|-------|--------------|------------|
| Free | $0 | 1 | 2 | 100/mo |
| Pro | $49 | 5 | 10 | 1,000/mo |
| Business | $199 | 25 | 50 | 10,000/mo |
| Enterprise | Custom | ∞ | ∞ | ∞ |

**Endpoints**:
- `GET /v1/plans` — List available plans
- `GET /v1/subscriptions/:tenantId` — Get subscription
- `POST /v1/subscriptions` — Create subscription
- `POST /v1/usage` — Record usage
- `GET /v1/usage/:tenantId` — Get usage stats
- `GET /v1/entitlements/:tenantId` — Check limits & features
- `POST /webhooks/stripe` — Stripe webhook handler
- `POST /webhooks/razorpay` — RazorPay webhook handler

**Feature Gates** (40+):
| Gate | Min Plan | Description |
|------|----------|-------------|
| `worlds` | Free | Basic workspace |
| `surfaces` | Pro | Multiple surfaces |
| `accelerators` | Pro | Domain accelerators |
| `governance` | Business | Approval workflows |
| `agents` | Business | Autonomous agents |
| `admin.audit` | Enterprise | Audit logs |

---

## 🔔 Webhooks Service

### Webhook Ingress (`packages/webhooks/`)
**URL**: `https://integratewise-webhooks.connect-a1b.workers.dev`

**Supported Providers** (14):
| Provider | Verification | Use Case |
|----------|--------------|----------|
| Stripe | HMAC-SHA256 + timestamp | Billing events |
| RazorPay | HMAC-SHA256 | India payments |
| GitHub | HMAC-SHA256 | Code events |
| Vercel | HMAC-SHA1 | Deployments |
| HubSpot | SHA256(secret+body) | CRM events |
| Salesforce | Security token | CRM events |
| Pipedrive | Webhook token | Sales pipeline |
| LinkedIn | Client secret | Professional network |
| Canva | Webhook secret | Design events |
| Meta | Verify token | Ads & social |
| WhatsApp | Verify token | Messaging |
| Todoist | Header-based | Tasks |
| Notion | Header-based | Docs & DBs |
| AI Relay | Custom secret | AI integrations |

**Features**:
- Signature verification per provider
- Deduplication hashing
- Tenant ID resolution
- Raw body preservation
- Event type extraction

---

## 🔌 Connectors (16 Implemented)

All connectors in `packages/connectors/src/`

### By Category

| Category | Connectors | Files |
|----------|------------|-------|
| **CRM** | Salesforce, HubSpot | `crm/salesforce.ts`, `crm/hubspot.ts` |
| **Accounting** | Zoho Books, QuickBooks | `accounting/zoho-books.ts`, `accounting/quickbooks.ts` |
| **Support** | Zendesk, Freshworks | `support/zendesk.ts`, `support/freshworks.ts` |
| **Communication** | Slack, Intercom | `communication/slack.ts`, `communication/intercom.ts` |
| **Marketing** | Mailchimp | `marketing/mailchimp.ts` |
| **E-commerce** | Shopify | `ecommerce/shopify.ts` |
| **Analytics** | Google Analytics 4 | `analytics/google-analytics.ts` |
| **Compliance** | IndiaFilings, GST Portal | `compliance/indiafilings.ts`, `compliance/gst-portal.ts` |
| **Project Mgmt** | Jira, Linear | `project-management/jira.ts`, `project-management/linear.ts` |

### Connector Infrastructure
| Package | Purpose |
|---------|---------|
| `@integratewise/connector-contracts` | Base classes, interfaces |
| `@integratewise/connector-utils` | Shared utilities |
| `intelligent-manager.ts` | Connector orchestration |
| `resilience.ts` | Circuit breaker, retries |
| `spine-emitter.ts` | Normalized event emission |
| `catalog.ts` | Connector registry |

---

## ⚡ Accelerators (6 Implemented)

Domain-specific intelligence packs in `packages/connectors/src/accelerators/`

| Accelerator | Purpose | Key Metrics |
|-------------|---------|-------------|
| **India Accounting** | GST, TDS, Compliance | GSTIN validation, TDS filing |
| **Subscription** | SaaS Metrics | MRR, ARR, Churn, LTV |
| **Finance** | Financial Analysis | Cash flow, runway, burn |
| **Support Marketing** | CX Metrics | NPS, CSAT, response times |
| **Engineering** | Dev Metrics | Velocity, bugs, deployment freq |
| **HR** | People Analytics | Headcount, attrition, hiring |

---

## 💾 Data Architecture

### Storage Layer
| Store | Technology | Purpose |
|-------|------------|---------|
| **Spine DB** | Cloudflare D1 | Canonical truth (entities, events) |
| **Context Store** | Cloudflare KV/R2 | Unstructured text blobs |
| **Vector Index** | Cloudflare Vectorize | Knowledge embeddings |
| **Memory DB** | Cloudflare D1 | AI conversations, sessions |
| **Object Store** | Cloudflare R2 | Files, attachments |
| **Audit Store** | Cloudflare D1 | Immutable evidence chain |

### D1 Database: `integratewise-spine-prod`
ID: `08d9f306-0f89-435a-8141-45097e3a0769`

**Core Tables**:
- `spine_accounts`, `spine_contacts`, `spine_tasks`, `spine_projects`
- `spine_meetings`, `spine_documents`, `spine_events`, `spine_objectives`
- `signals`, `situations`, `action_proposals`, `agent_decisions`
- `ai_conversations`, `ai_messages`, `ai_memories`, `ai_session_summaries`
- `audit_logs`, `policies`, `pending_actions`

---

## 🔄 Data Flows

### Flow A: Truth & Signals
```
Webhook → Gateway → Normalizer → Spine (D1) → Signals → Think
```

### Flow B: Knowledge & Documents
```
Document → Loader → Chunking → Embedding → Vectorize → Knowledge Bank
```

### Flow C: AI Session Memory
```
AI Chat → IQ-Hub → ai_conversations → Archive → Memory Extraction → ai_memories
```

### Flow D: Action Execution
```
Think (Proposal) → Govern (Check) → Act (Execute) → Audit (Log)
```

---

## 🎨 UI Architecture

### Component Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Dashboard layout
│   │   ├── ai-chat/          # AI Chat interface
│   │   ├── accounts/         # Account views
│   │   └── ...
│   └── api/                  # API routes (proxy to Workers)
├── components/
│   ├── os/                   # OS components
│   │   └── evidence-drawer.tsx  # L2 slide-up (1300+ lines)
│   ├── shared/
│   │   └── EvidenceDrawer.tsx   # Simplified evidence drawer
│   ├── ui/
│   │   └── responsive.tsx       # BottomSheet, mobile components
│   └── providers/            # Context providers
└── lib/
    ├── iq-hub-client.ts      # IQ-Hub API client
    ├── mcp-client.ts         # MCP tools client
    └── tenant-context.ts     # Multi-tenancy
```

### L1 → L2 Interaction Pattern
```tsx
// L1 triggers L2 slide-up
window.dispatchEvent(new CustomEvent('iw:evidence:open', {
  detail: { entityId, entityType, context, scope }
}))

// L2 uses Sheet component with side="bottom"
<Sheet open={isOpen} side="bottom">
  <SheetContent className="h-[80vh] rounded-t-xl">
    {/* Evidence, Think, Act, Approve tabs */}
  </SheetContent>
</Sheet>
```

---

## 🔐 Governance Model

### Govern Service (User Configuration)
Controls **what users can write and what they cannot**:

| Feature | Purpose |
|---------|---------|
| Write Rules | Field-level write permissions |
| Action Policies | Approve/auto-execute thresholds |
| HITL Config | Human-in-loop requirements |
| Rate Limits | Per-tenant quotas |

### RBAC Flow
```
User Action → Govern Check → Policy Match → Allow/Deny/Queue for Approval
```

---

## 📦 Packages

| Package | Purpose |
|---------|---------|
| `packages/connector-contracts` | Connector interfaces |
| `packages/connector-utils` | Shared utilities |
| `packages/connectors` | All connector implementations |
| `packages/accelerators` | Domain intelligence packs |
| `packages/types` | Shared TypeScript types |
| `packages/lib` | Shared libraries |
| `packages/rbac` | Role-based access control |
| `packages/tenancy` | Multi-tenant utilities |
| `packages/feature-flags` | Feature flag system |

---

## 🚦 Service Endpoints Reference

### Gateway
- `GET /health` - Health check
- `POST /v1/ingest` - Webhook ingestion

### IQ-Hub
- `GET /` - Service info
- `POST /conversations` - Create conversation
- `GET /conversations` - List conversations
- `POST /conversations/:id/messages` - Add message
- `POST /conversations/:id/archive` - Archive + extract memories
- `GET /memories` - List memories
- `POST /memories/:id/confirm` - Confirm memory

### Spine
- `POST /v1/spine/:entity_type` - Write entity
- `GET /v1/spine/entities?type=` - Query entities
- `GET /evidence/:artifact_id` - Get evidence chain

### Think
- `GET /v1/signals` - Get signals
- `GET /v1/situations` - Get situations
- `POST /v1/think/analyze` - Analyze entity
- `POST /v1/decide` - Record decision

### Act
- `POST /execute` - Execute action proposal (with gov check)

### Govern
- `GET /v1/policies` - List policies
- `POST /v1/policies` - Create policy
- `POST /v1/check` - Check action permission
- `POST /v1/approve/:id` - Approve pending action
- `GET /v1/audit` - Get audit log

### Knowledge
- `POST /v1/chunk` - Chunk document
- `POST /v1/embed` - Generate embeddings
- `GET /v1/search` - Semantic search

### MCP Tool Server
- `GET /tools` - List available tools
- `POST /invoke` - Invoke tool

---

## 🔗 Integration Points

### External Services
| Service | Purpose | Status |
|---------|---------|--------|
| Clerk | Authentication | ✅ Configured |
| OpenRouter | AI routing | ✅ Configured |
| OpenAI | Embeddings, reasoning | ✅ Configured |
| Workers AI | Edge inference | ✅ Available |

### Internal Bindings
Services communicate via Cloudflare Service Bindings:
- Act → Govern (permission check)
- Think → Spine (entity data)
- IQ-Hub → AI (Workers AI binding)

---

## 📈 Next Steps

### Immediate
1. ✅ All 15 services deployed
2. Wire UI to backend services
3. Implement L2 slide-up patterns completely

### Short-term
1. Add Billing service (Stripe)
2. Complete Orchestrator service
3. Integrate Knowledge Bank UI

### Medium-term
1. Multi-agent workflows
2. Real-time sync via Durable Objects
3. Advanced RAG with hierarchical chunking

---

## 📁 Repository Structure

```
brainstroming/
├── src/                      # Next.js frontend
├── services/                 # Cloudflare Workers (15 services)
├── packages/                 # Shared packages (connectors, types)
├── docs/                     # Documentation
├── migrations/               # Database migrations
└── scripts/                  # Deployment & utility scripts
```

---

*This document is the source of truth for IntegrateWise OS architecture and status.*
