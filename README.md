# IntegrateWise InfraStructure for Modern Era

**Universal Cognitive Operating System**
**AI That Thinks in Context, Waits for Approvals.**

IntegrateWise is a context-aware operating system that connects your tools, AI, data, documents, and memory into a single **Spine** — then reasons over it with governed AI. Not another integration tool. Not another AI wrapper. The **Context Layer**.

- **Live Landing:** https://integratewise.ai
- **App (Workspace):** https://app.integratewise.ai
- **MCP Server:** https://n8n.integratewise.online/mcp
- **Architecture:** v3.7 (27 sections, LOCKED)

---

## 1. Journey Overview (Value in 60 Seconds)

1. **Landing** → Understand IntegrateWise, click "Get Started Free".
2. **Sign Up / Login (Auth)** → Supabase Auth issues `user_id` + JWT.
3. **Onboarding** → We discover your world (role, industry, tools, focus).
4. **Adaptive Spine & Workspace Decisions** → Schema chosen, modules selected.
5. **Connectors Based on Domain** → Suggest and connect 1–2 critical tools.
6. **Kick Off Loader + Pipeline Phase 1** → Data flows through 8-stage pipeline into Spine.
7. **Value in 60 Seconds** → Workspace loads with real data from your tools (B2+).
8. **Cognitive Layer (14 Surfaces)** → Think / Act / Govern / HITL run on your graph; accelerators enrich over time.

You never land in an empty product. The workspace is complete and personalized on first load; intelligence deepens as more data and connectors arrive.

---

## 2. Pre-Entry: Landing (Marketing)

**Location:** `apps/landing/`
**Stack:** Vite + React 18 + TypeScript + Tailwind CSS 4 + GSAP ScrollTrigger + Lucide React

The landing page is a **public, pre-entry marketing surface**. It has no auth, no user state, and is intentionally **not part of L0** — many visitors will never sign up.

**Orchestrator:** `LandingPage.tsx` — coordinates 14 sections with GSAP scroll animations.

**14 Sections:** Navigation → Hero ("Stop being the cable between your own tools") → Problem ($4.2T Disconnection Tax) → Solution (Connect categories, not just apps) → Flows (Structured / Unstructured / AI Sessions) → Adaptive Schema (Manufacturing, Healthcare, Retail, Marine, Freelance) → Spaces → Hydration (B0–B7) → Governance (Think → Govern → Act → Audit) → Pricing (Free / ₹2,999 / Enterprise) → Use Cases (Loom, Fishery, SaaS, Auto, Freelancer) → Competitive (vs Zapier/Make, vs ERP) → Closing CTA → Footer.

**CTA Wiring:** All "Get Started Free" buttons → `https://app.integratewise.ai/auth/*` (L0 Entry).

---

## 3. L0 — Entry (Signup / Login / Auth)

L0 is the **identity boundary** where a visitor becomes an individual user.

**Flow:**

1. Landing CTA → `/auth/signup` or `/auth/signin` at `app.integratewise.ai`.
2. Supabase Auth handles Google SSO / GitHub SSO / Email-password.
3. JWT issued (held in memory on the SPA — not localStorage).
4. `user_id` created in `auth.users`.
5. RLS becomes enforceable: every DB query scopes to `auth.uid()`.
6. Routing: First-time user → L0.5 Onboarding. Returning user → L1 Workspace.

**Implementation:** `apps/web/src/lib/api.ts` with `@supabase/supabase-js` for auth and API calls.

---

## 4. L0.5 — Onboarding (Schema Discovery + First Hydration)

Onboarding is where we **understand the user, choose an adaptive schema, surface the right connectors, and start loading data into the Spine** — before the user ever sees the workspace.

### 4.1 Schema Discovery — "What's Your World?"

A small set of high-leverage questions:

- Role and department (Sales, CS, Operations, Healthcare, Manufacturing).
- Industry / vertical (Manufacturing, Healthcare, Retail, Marine, Freelance).
- Primary tools in use (HubSpot, Salesforce, Notion, Jira).
- Primary focus (reduce churn, ship faster, manage pipeline).

From this, the system decides for **this one user**:

- Which **schema** to apply (Spine object types, relationships, metrics).
- Which **workspace modules** to load (not all 15 for everyone).
- Which **connectors** to prioritize in the first connection step.
- What default **views** and dashboards to present first.

### 4.2 Adaptive Spine & Workspace Decisions

The Spine is **adaptive per user**. We don't scatter the user's data across 15 generic domains. We bind data into a coherent per-user graph that matches their world:

| User Type | Spine Focus | Workspace Modules Loaded |
|---|---|---|
| **Sales Rep** | Accounts, Contacts, Deals, Pipeline | Deals, Contacts, Activities, Pipeline, Forecast |
| **CS Manager** | Accounts, Health, Renewals, Risks | Accounts, Health Scores, Renewals, Risks |
| **Manufacturing Ops** | BOM, Inventory, Orders, Suppliers | BOM, Inventory, Orders, Production, Quality |
| **Healthcare Admin** | Patients, Appointments, Billing | Patients, Appointments, Billing, Records |
| **Freelancer** | Clients, Projects, Invoices | Projects, Clients, Invoices, Time Tracking |
| **Marine Logistics** | Vessels, Cargos, Ports, Routes | Vessels, Cargos, Routes, Documentation |

Only schema-relevant modules load into this user's workspace; others **do not exist** for them.

### 4.3 Domain-Aware Connector Selection

Based on schema, we surface a small set of **high-signal connectors**:

- **Sales:** HubSpot, Salesforce, Gmail, Slack.
- **CS:** HubSpot, Salesforce, Gainsight, Intercom.
- **Manufacturing:** ERP/SCM tools, shopfloor systems.
- **Healthcare:** EMR/EHR, scheduling, billing systems.
- **Freelancer:** Notion, Trello, Stripe, Calendly.

The user connects **1–2 tools** during onboarding (not 10+), chosen so that the Spine has enough density to deliver value in ~60 seconds.

### 4.4 Kick Off Loader + Pipeline Phase 1

As soon as connectors are authorized:

1. `services/loader` registers webhooks or schedules initial backfill.
2. Incoming records enter `pipeline-process` queue (stage: `analyze`).
3. `services/normalizer` runs the **8-stage mandatory pipeline** for each object:
   - Stage 1: **Analyzer** — Source detection, object type ID, metadata extraction.
   - Stage 2: **Classifier** — Category assignment, CTX enum, priority scoring.
   - Stage 3: **Filter** — Scope enforcement, PII detection, freshness check.
   - Stage 4: **Refiner** — Normalization, field mapping, entity resolution.
   - Stage 5: **Extractor** — Relationship extraction, embeddings generation.
   - Stage 6: **Validator** — Dedup (fuzzy + exact), business rule enforcement.
   - Stage 7: **Sanity Scan** — AI-powered anomaly detection via OpenRouter.
   - Stage 8: **Sectorizer** — Write to Spine, emit events.
4. Sectorizer writes normalized entities into **Spine SSOT** (Supabase PostgreSQL), tagged with `user_id`.
5. Sectorizer emits events to `intelligence-events` queue → Think Engine is primed with initial data.

This all happens **while the user is still finishing onboarding**.

### 4.5 Value in 60 Seconds

By the time the user clicks "Continue" at the end of onboarding:

- The Spine already holds **real entities** for that user (at least B2 hydration).
- Schema-relevant workspace modules are determined.
- Think Engine has enough data to emit first signals (basic health, activity, or anomalies).

The next screen is not an empty product; it is their **L1 workspace with data**.

---

## 5. L1 — Workspace (Adaptive, Pre-Populated)

**Location:** `apps/web/`
**Stack:** Vite + React 18 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion (antigravity style)

L1 is the **per-user workspace**, driven by the adaptive Spine and the data ingested during onboarding.

### 5.1 Principles

1. **Adaptive, not universal.** Only schema-relevant modules render; others are invisible (not "coming soon" — they don't exist for this user).

2. **Pre-populated.** First view always has real entities from at least one connector. The user never sees a blank dashboard.

3. **Complete from B0 (per schema).** All chosen modules appear from first render. Progressive Hydration (B0–B7) enriches **data**, not **feature availability**.

4. **User-scoped graph.** All data in Spine / Context / Knowledge is bound to `user_id` via RLS (`auth.uid()`). No org/team sharing assumptions at this layer.

### 5.2 Progressive Hydration (B0–B7) — Data Enrichment, Not Feature Gating

Hydration buckets represent **data density**, not screen unlocking:

| Bucket | Data State | Workspace Experience | Cognitive State |
|---|---|---|---|
| **B0** | Skeleton schema | All schema modules visible, structured but empty | L2 ready |
| **B1** | Schema populated | Placeholders, layouts, and filters stabilized | L2 ready |
| **B2** | First entities | Real rows from first connector; tables, cards show data | **ACTIVE** |
| **B3** | Relationships | Cross-module links (Account ↔ Deals ↔ Contacts) | Active — richer signals |
| **B4** | Multi-tool | Cross-tool entity resolution and joined metrics | Active — ChurnShield scoring |
| **B5** | AI connected | MCP sessions enrich Knowledge; AI-backed search | Active — AI context in reasoning |
| **B6** | Patterns | Historical trends, predictive scores | Active — proactive suggestions |
| **B7** | Full context | All flows converged, complete Entity360 view | Full intelligence — Colony available |

Users arrive at **B2+** on first workspace load because onboarding already ran the pipeline.

### 5.3 First Workspace View (Examples)

| Role | First View After Onboarding |
|---|---|
| Sales Rep | Pipeline view + recent deals + contact activity |
| CS Manager | Accounts with health, upcoming renewals, top risks |
| Manufacturing Ops | Inventory levels, open orders, supplier alerts |
| Healthcare Admin | Today's appointments, critical alerts |
| Freelancer | Active projects, unbilled time, invoices |

---

## 6. L2 — Cognitive Layer (14 Surfaces Over L3)

The Cognitive Layer is **how the user experiences** the backbone engines and stores. L3 does the heavy lifting; L2 shows the results and collects human decisions.

**The cognitive layer is ACTIVE from first workspace load** because onboarding already populated the Spine. It does not "activate after first data ingestion" — data ingestion happened during onboarding.

### 6.1 Backing Engines and Stores (L3)

- **Engines:** Think, Act, Govern, Agents, Accelerators, Pipeline.
- **Stores:** Spine SSOT (Supabase PG), Context Store (pgvector), Knowledge Store (Supabase PG), Operations Store (immutable audit), Object Storage (R2), Edge State (D1).

### 6.2 Core Surfaces (Per User)

| # | Surface | What It Shows | Available From |
|---|---|---|---|
| 1 | **SpineUI** | Truth browser — canonical data, entity details, lineage | B2 |
| 2 | **ContextUI** | Embedded documents, contextual information | B3 |
| 3 | **KnowledgeUI** | AI sessions, documents, memories, unified search | B5 |
| 4 | **Evidence Drawer** | 5-tab panel: Spine, Context, Knowledge, Governance, Audit | B2 |
| 5 | **Signals** | Goal-linked alerts with severity and recommendations | B2 |
| 6 | **Think** | AI reasoning viewer — why a signal or suggestion exists | B2 |
| 7 | **Act** | Action execution panel — pending actions, results | B2 |
| 8 | **HITL** | Human-in-the-loop approval (no token = no execution) | B2 |
| 9 | **Govern** | Policy dashboard, approval token log, compliance | B2 |
| 10 | **Adjust** | Feedback incorporation, correction proposals | B3 |
| 11 | **Repeat** | Self-healing, re-evaluation after corrections | B3 |
| 12 | **Audit Trail** | Immutable audit log — filterable, exportable | B2 |
| 13 | **Agent Config** | Agent registry, workflow assignment, monitoring | B4 |
| 14 | **Digital Twin** | Proactive suggestions, learned preferences, patterns | B7 |

### 6.3 12-Stage Cognitive Loop

1. **Ingest** — Loader + connectors pull data from tools.
2. **Normalize** — 8-stage pipeline processes every record.
3. **Bind to Spine** — Sectorizer writes to per-user Spine SSOT.
4. **Enrich with Context** — Documents → Context Store (pgvector).
5. **Enrich with Knowledge** — AI sessions → Knowledge Store.
6. **Compute Signals** — Think Engine + Accelerators evaluate against goals.
7. **Surface Signals** — Signals + Entity360 render in workspace.
8. **Propose Actions** — Think → action proposals with evidence.
9. **Gather Evidence** — Evidence Drawer assembles proof across all stores.
10. **Govern & Approve** — Govern + HITL → approval tokens issued.
11. **Execute** — Act Engine → tool write-back → pipeline re-ingestion.
12. **Learn & Adjust** — Digital Twin, Adjust, Repeat cycles.

On first connection, stages 1–7 are active. Deeper accelerators warm up as more data arrives.

---

## 7. Accelerators (Progressive Intelligence)

Accelerators are **domain engines** that compute higher-order metrics on normalized Spine data.

| Accelerator | Purpose | When Active |
|---|---|---|
| **Extraction** | Preserve tool-native structure during ingestion | B2 |
| **Normalization** | Map to SSOT canonical schema | B2 |
| **Onboarding** | L0.5 domain bootstrap, adaptive schema selection | During onboarding |
| **Customer Health** | Weighted health scoring (adoption, engagement, support, NPS, outcome) | B3+ |
| **Churn Prediction** | 5-signal model (trajectory, decay, escalation, sentiment, expansion) | B4+ |
| **Revenue Forecast** | Pipeline velocity, win rates, forecast accuracy | B4+ |
| **Pipeline Velocity** | Stage-by-stage conversion and time-in-stage | B3+ |
| **Support Health** | Ticket trends, resolution time, escalation patterns | B4+ |
| **Marketing Attribution** | Campaign-to-revenue linkage, channel ROI | B5+ |

The system **does not wait** for all accelerators before showing value. Extraction + Normalization + Onboarding are active immediately. Domain accelerators progressively improve signal quality over time.

---

## 8. User-Scoped Data Binding

Every store is bound to the individual user via RLS. No org-level or team-level abstraction. Every user owns their complete data graph.

```
                         USER IDENTITY
                       (auth.uid() from JWT)
                    ┌──────────┼──────────┐
                    │          │          │
              ┌─────▼────┐ ┌──▼─────┐ ┌──▼──────────┐
              │  SPINE    │ │CONTEXT │ │ KNOWLEDGE   │
              │ (SSOT)   │ │STORE   │ │ STORE       │
              │ entities │ │pgvector│ │ ai_sessions │
              │ goals    │ │chunks  │ │ documents   │
              │ signals  │ │docs    │ │ memories    │
              │ actions  │ │        │ │ search_idx  │
              │connectors│ │        │ │             │
              └──────────┘ └────────┘ └─────────────┘
                    │          │          │
              ┌─────▼──────────▼──────────▼─────┐
              │       OPERATIONS STORE           │
              │    Supabase PG (immutable)       │
              │ audit_log │ tokens │ governance  │
              └─────────────────────────────────┘

  RLS on EVERY table:  USING (user_id = auth.uid())
  Pipeline writes via service_role key → tags user_id on every row
  Supabase Realtime respects RLS → users only receive their own changes
```

---

## 9. Monorepo Structure

```
integratewise-live/
├── apps/
│   ├── landing/              # Pre-Entry: Marketing (14 GSAP sections)
│   │   ├── src/
│   │   │   ├── LandingPage.tsx
│   │   │   └── sections/     # 14 section components
│   │   └── public/           # hero_cables.jpg, assets
│   ├── web/                  # L0.5 + L1 + L2 surfaces
│   │   └── src/
│   │       ├── lib/api.ts    # API client → Gateway
│   │       ├── onboarding/   # Schema discovery wizard
│   │       └── workspace/    # Dynamic module loader
│   ├── desktop/              # Placeholder
│   └── mobile/               # Placeholder
│
├── services/                 # L3 Backend — 15 Cloudflare Workers
│   ├── gateway/              # ① Entry, auth, routing
│   ├── admin/                # ① Tenant CRUD
│   ├── billing/              # ① Stripe/Razorpay
│   ├── tenants/              # ① Provisioning
│   ├── loader/               # ② Ingestion, webhooks, OAuth, polling
│   ├── store/                # ② R2 file operations
│   ├── mcp-connector/        # ② MCP protocol + session capture
│   ├── normalizer/           # ③ 8-stage pipeline engine
│   ├── spine-v2/             # ③ Spine SSOT (only Spine writer)
│   ├── think/                # ④ Reasoning, signals
│   ├── act/                  # ④ Action execution
│   ├── govern/               # ④ Policies, tokens, HITL
│   ├── agents/               # ④ Agent registry
│   ├── knowledge/            # ⑤ Embeddings, search, AI sessions
│   └── workflow/             # ⑥ BFF, views, SSE, HITL UI
│
├── packages/                 # 19 shared packages
│   ├── types/                # Shared TypeScript types
│   ├── db/                   # Supabase client utilities
│   ├── connectors/           # Connector adapters
│   ├── connector-contracts/  # Zod validation schemas
│   ├── connector-utils/      # Shared connector helpers
│   ├── webhooks/             # Webhook handling
│   ├── rbac/                 # Role-based access control
│   ├── supabase/             # Migrations + client
│   ├── accelerators/         # Domain compute engines
│   ├── analytics/            # Analytics utilities
│   ├── api/                  # API route definitions
│   ├── config/               # Shared config
│   ├── lib/                  # Common libraries
│   ├── tenancy/              # Multi-tenancy utilities
│   ├── hub/                  # Legacy hub utilities
│   ├── integratewise-mcp-tool-connector/
│   ├── knowledge-bank-ui/
│   ├── os-ui/
│   └── integration-tests/
│
├── turbo.json
├── pnpm-workspace.yaml
├── doppler.yaml
├── tsconfig.base.json
└── .github/workflows/
    ├── ci.yml
    ├── deploy-frontend.yml
    └── deploy-workers.yml
```

---

## 10. L3 — Backend Engine (15 Services)

### 6 Logical Service Groups

| # | Group | Services | Responsibility |
|---|---|---|---|
| ① | **Gateway** | gateway, admin, billing, tenants | HTTP entry, JWT, rate limiting, CORS, routing |
| ② | **Connector** | loader, store, mcp-connector | Ingestion — webhooks, OAuth, polling, R2 uploads, MCP |
| ③ | **Pipeline** | normalizer, spine-v2 | 8-stage pipeline. **Only service with Spine write credentials** |
| ④ | **Intelligence** | think, act, govern, agents | Reasoning, execution, approval tokens, agent orchestration |
| ⑤ | **Knowledge** | knowledge | Embeddings (pgvector), search, AI sessions, Digital Twin memory |
| ⑥ | **BFF** | workflow | View aggregation, SSE streaming, HITL UI, dashboard assembly |

### End-to-End Data Flow

```
User connects HubSpot during onboarding
  → services/loader → webhook registration + initial backfill
  → Validates, deduplicates (D1 idempotency) → pipeline-process queue
  → services/normalizer → 8 stages → services/spine-v2 writes to Supabase
  → Sectorizer emits to intelligence-events queue
  → services/think → evaluates goals → generates signals
  → Signals → Supabase → Realtime WebSocket → apps/web Dashboard
```

### API Route Map (via Gateway)

| Route | Downstream | Purpose |
|---|---|---|
| `/api/v1/connector/*` | ② Loader | Connections, OAuth, webhooks |
| `/api/v1/pipeline/*` | ③ Normalizer | Pipeline status, entity browse |
| `/api/v1/intelligence/*` | ④ Think | Signals, situations |
| `/api/v1/cognitive/act/*` | ④ Act | Action execution |
| `/api/v1/cognitive/govern/*` | ④ Govern | Policies, tokens |
| `/api/v1/cognitive/hitl/*` | ⑥ Workflow | HITL approvals |
| `/api/v1/brainstorm` | ④ Think | ⌘J brainstorming (SSE) |
| `/api/v1/knowledge/*` | ⑤ Knowledge | Search, upload, AI sessions |
| `/api/v1/workspace/*` | ⑥ Workflow | Dashboard, views |
| `/api/v1/cognitive/twin/*` | ⑤ Knowledge | Digital Twin |
| `/api/v1/cognitive/audit` | ⑥ Workflow | Audit log |
| `/stream/*` | ⑥ Workflow | SSE events |
| `/webhooks/*` | ② Loader | Tool webhooks (no auth) |
| `/webhooks/billing/*` | ① Billing | Stripe/Razorpay |

---

## 11. Verified Infrastructure (Live — March 2026)

All numbers verified via Cloudflare API inspection.

### Cloudflare Workers — 42 Deployed

| Category | Count |
|---|---|
| Production Core | 21 workers |
| Staging Mirrors | 13 workers |
| Legacy (decommission) | 3 workers (hub-*) |
| Platform | 2 workers (marketing, glowing-pancake) |
| Deprecated | 2 workers (old D1 spine) |
| Experimental | 2 workers (agents-starter, integratewis21) |

### R2 Object Storage — ✅ Active

- `integratewise-files-prod` (Jan 29, 2026)
- `integratewise-files-staging` (Jan 29, 2026)

### KV Namespaces — 13 Active

CACHE, CACHE_PROD, CACHE_preview, SESSIONS, SESSIONS_PROD, SECRETS, SECRETS_PROD, RATE_LIMITS_SPINE, MCP_IDEMPOTENCY, MCP_IDEMPOTENCY_preview, CONNECTION_META, VIEW_CACHE, MEMORY_STATE.

### D1 Databases — 7

| Database | Tables | Notes |
|---|---|---|
| integratewise-spine-prod | 7 | ai_conversations, ai_messages, ai_memories, session_summaries, workflow_recommendations, agent_colony_runs |
| hub-controller-db | 12 | 24 seed entities (legacy but has real schema) |
| integratewise-session-store | KV | Ready |
| integratewise-spine-cache | KV | Ready |
| integratewise-spine-staging | KV | Ready |
| test-permission-check-invalid | KV | Cleanup candidate |
| nbh | KV | Cleanup candidate |

### External

| Component | Provider | Status |
|---|---|---|
| Auth + PostgreSQL + pgvector + Realtime | Supabase | ✅ |
| Secrets (189+) | Doppler | ✅ |
| Automation + MCP | n8n | ✅ Live |
| AI Routing | OpenRouter | ✅ |
| Frontend Hosting | Cloudflare Pages | ✅ |

---

## 12. Governance

**"No token = No execution. No exceptions."**

```
Think proposes → Govern evaluates → DENIED (logged) or APPROVED (token issued) or HITL (user decides)
  → Act executes with token → Result re-ingested → Audit records immutably
```

---

## 13. MCP Architecture

**Live:** https://n8n.integratewise.online/mcp | **Transport:** SSE | **Supports:** Claude, ChatGPT, Perplexity

```
AI calls MCP → discovers tools (user-scoped) → reads data (RBAC, no approval)
  → proposes write → BLOCKS (needs Govern token) → HITL or auto-approve
  → executes → pipeline re-ingests → session captured to Knowledge Store
```

---

## 14. No-Hallucination Library

Three grounding files at integratewise.ai via `glowing-pancake`:

- `llm.txt` — Human + AI readable context
- `context.json` — Machine-readable architecture
- `.well-known/ai-context.json` — MCP client discovery

---

## 15. Business Model

**PLG:** Individual → Team → Company → Enterprise
**Three Wedges:** Personal (AI Memory) → CS (Churn Prevention) → Business (Single Truth + Audit)
**Current Revenue:** Templates, Coaching, Automation Consulting. Platform subscriptions post-launch.

---

## Development

```bash
git clone https://github.com/NirmalPrinceJ/integratewise-live.git
cd integratewise-live && pnpm install && doppler setup

cd apps/landing && pnpm dev           # Landing
cd apps/web && pnpm dev               # Workspace
cd services/gateway && npx wrangler dev  # Worker

# Deploy: spine-v2 first, gateway last
```

---

**IntegrateWise LLP**
*"Your tools, your AI, your data — they should know each other. We make them."*
Founder & CEO: Nirmal Prince J | Bengaluru, India
