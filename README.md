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
