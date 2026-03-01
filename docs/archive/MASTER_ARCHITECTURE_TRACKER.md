# IntegrateWise OS — Master Architecture Implementation Tracker

> Based on: **L0–L1–L2–L3 Master Architecture + 8-Stage Pipeline + Accelerators**
> Last Updated: 2026-02-02

---

## 🎯 Architecture Layers Overview

| Layer | Purpose | Status |
|-------|---------|--------|
| **L0: Onboarding** | Signup, Context Questions, Tool Connect, First Hydration | 🟡 Partial |
| **L1: Workspace** | Context-aware UI shell (15 views) | 🟡 Partial |
| **L2: Cognitive** | Universal cognitive layer (14 surfaces) | 🟡 Partial |
| **L3: Backend** | Cloudflare Workers + D1 + R2 | ✅ Implemented |

---

## 📦 L3: Universal Backend Services

### Core Services

| Service | Route | Status | Notes |
|---------|-------|--------|-------|
| API Gateway / BFF | `/gateway` | ✅ | Exists in `/services/gateway` |
| Auth | `/auth/*` | ✅ | Exists in `/src/app/api/auth` |
| User | `/user/*` | 🟡 | Partial in `/src/app/api/session` |
| Onboard | `/onboard/*` | ✅ | Exists in `/src/app/api/onboarding` |
| Connectors | `/connectors/*` | ✅ | `/packages/connectors` complete |
| Ingest | `/ingest/*` | ✅ | `/services/loader` |
| Sync | `/sync/*` | 🟡 | Partial in orchestrator |
| Orchestrator | `/orchestrator/*` | ✅ | `/services/orchestrator` |
| Event Bus | Queue bindings | ✅ | Cloudflare Queues |

### Data Stores

| Store | Purpose | Status | Location |
|-------|---------|--------|----------|
| Spine DB | SSOT entities | ✅ | `/services/spine` + Neon |
| Context Store | Unstructured + embeddings | ✅ | `/services/knowledge` |
| Files (R2) | Raw files + versions | ✅ | R2 bindings |
| Audit Store | Immutable logs | ✅ | `/services/govern` |

### Domain APIs

| API | Route | Status | Location |
|-----|-------|--------|----------|
| Accounts | `/accounts/*` | ✅ | `/src/app/api/admin/accounts` |
| Projects | `/projects/*` | ✅ | `/src/app/(app)/projects` |
| Contacts | `/contacts/*` | 🟡 | `/src/app/(app)/personal/contacts` |
| Meetings | `/meetings/*` | ✅ | `/src/app/(app)/personal/meetings` |
| Docs | `/docs/*` | ✅ | `/src/app/(app)/personal/docs` |
| Tasks | `/tasks/*` | ✅ | `/src/app/(app)/tasks` |
| Calendar | `/calendar/*` | 🟡 | `/src/app/(app)/personal/calendar` |
| Notes | `/notes/*` | ✅ | `/src/app/(app)/personal/notes` |
| Knowledge | `/knowledge/*` | ✅ | `/services/knowledge` |
| Team | `/team/*` | 🟡 | `/src/app/(app)/personal/team` |
| Pipeline | `/pipeline/*` | ✅ | `/src/app/(app)/pipeline` |
| Risks | `/risks/*` | ✅ | `/src/app/(app)/personal/risks` |
| Expansion | `/expansion/*` | ✅ | `/src/app/(app)/personal/expansion` |
| Analytics | `/analytics/*` | 🟡 | `/src/app/(app)/analytics` |
| Evidence | `/evidence/*` | ✅ | `/src/app/api/evidence` |
| Audit | `/audit/*` | ✅ | `/src/app/api/audit` |

### AI / Governance APIs

| API | Route | Status | Location |
|-----|-------|--------|----------|
| AI Chats | `/ai/chats/*` | ✅ | `/src/app/api/ai` |
| MCP | `/mcp/*` | ✅ | `/src/app/api/mcp` + `/services/mcp-connector` |
| Insights | `/ai/insights/*` | 🟡 | `/src/app/api/insights` |
| Agent | `/agent/*` | ✅ | `/services/act` |
| Approval | `/approval/*` | ✅ | `/src/app/api/govern` |
| Governance | `/governance/*` | ✅ | `/services/govern` |
| Billing | `/billing/*` | ✅ | `/services/billing` |
| Observability | `/observability/*` | 🟡 | `/src/app/api/health` |
| Security | `/security/*` | ✅ | Implemented in all services |

---

## 🔄 8-Stage Pipeline

| Stage | Purpose | Status | Location |
|-------|---------|--------|----------|
| 1. Analyzer | Payload framing + file type detect | ✅ | `/services/loader/src/pipeline.ts` |
| 2. Classifier | Structured/unstructured + object candidates | ✅ | `/services/loader/src/pipeline-stages.ts` |
| 3. Filter | PII scrub + dedupe + scope gate | ✅ | `/services/loader/src/pipeline-stages.ts` |
| 4. Refiner | Cleanup + normalization pre-pass | ✅ | `/services/loader/src/pipeline-stages.ts` |
| 5. Extractor | OCR/parse + field extraction | ✅ | `/services/loader/src/pipeline-stages.ts` |
| 6. Validator | Schema checks + constraints | ✅ | `/services/normalizer/src/normalize.ts` |
| 7. Sanity Check | AI+rules, anomaly/quality | ✅ | `/services/normalizer/src/normalize.ts` |
| 8. Sectorizer | Partition by tool+object+pattern | ✅ | `/services/loader/src/pipeline-stages.ts` |

---

## ⚡ Accelerators

### Plumbing Accelerators (Mandatory)

| Accelerator | Purpose | Status | Location |
|-------------|---------|--------|----------|
| Extraction Accelerator | Complete pull + preserve structure | ✅ | `/packages/connectors` |
| Schema Registry | Context → SSOT schema preset | ✅ | `/services/normalizer` |
| Normalization Accelerator | Tool→domain mapping | ✅ | `/services/normalizer/src/normalizer-accelerator.ts` |

### Domain Accelerators

| Accelerator | Status | Location |
|-------------|--------|----------|
| Customer Health Score | ✅ | `/packages/accelerators/src/index.ts` |
| Churn Prediction | ✅ | `/packages/accelerators/src/index.ts` |
| Revenue Forecaster | ✅ | `/packages/accelerators/src/index.ts` |
| Pipeline Velocity | ✅ | `/packages/accelerators/src/index.ts` |
| Support Health | ✅ | `/packages/accelerators/src/packs/support-marketing.ts` |
| Marketing Attribution | ✅ | `/packages/accelerators/src/packs/support-marketing.ts` |

### Revenue/MRR Accelerators (Add-on Pack)

| Accelerator | Status | Location |
|-------------|--------|----------|
| MRR/ARR Engine | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |
| Renewal Risk Engine | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |
| Expansion Engine | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |
| Pricing & Discount Guard | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |
| Collections Forecast Engine | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |
| Commission & Quota Engine | ✅ | `/packages/accelerators/src/packs/revenue-pack.ts` |

---

## 🔌 Connectors Available

| Category | Connectors | Status |
|----------|------------|--------|
| CRM | HubSpot, Salesforce | ✅ |
| Communication | Slack, Email | ✅ |
| Project Management | Jira, Asana, Linear | ✅ |
| Support | Zendesk, Freshdesk | ✅ |
| Accounting | QuickBooks, Xero, Tally, Zoho Books | ✅ |
| Compliance | GST Portal, IndiaFilings | ✅ |
| E-commerce | Shopify | ✅ |
| Marketing | Mailchimp, SFMC | ✅ |
| Analytics | Google Analytics | ✅ |

---

## 🖼️ L1: Context-Aware Workspace Views

| # | View | Routes | Status |
|---|------|--------|--------|
| 1 | Home | `/personal`, `/business`, `/cs` | ✅ |
| 2 | Projects | `/projects`, `/personal/projects` | ✅ |
| 3 | Accounts | `/accounts`, `/personal/accounts` | ✅ |
| 4 | Contacts | `/personal/contacts` | ✅ |
| 5 | Meetings | `/personal/meetings` | ✅ |
| 6 | Docs | `/personal/docs` | ✅ |
| 7 | Tasks | `/tasks` | ✅ |
| 8 | Calendar | `/personal/calendar` | ✅ |
| 9 | Notes | `/personal/notes` | ✅ |
| 10 | Knowledge Space | `/knowledge` | ✅ |
| 11 | Team | `/personal/team` | ✅ |
| 12 | Pipeline | `/pipeline`, `/personal/pipeline` | ✅ |
| 13 | Risks | `/personal/risks` | ✅ |
| 14 | Expansion | `/personal/expansion` | ✅ |
| 15 | Analytics Widgets | `/analytics`, `/personal/analytics` | ✅ |

---

## 🧠 L2: Universal Cognitive Layer

| # | Surface | Route/Component | Status |
|---|---------|-----------------|--------|
| 1 | Spine UI | `/spine` | ✅ |
| 2 | Context UI | `/context` | ✅ |
| 3 | Knowledge UI | `/knowledge` | ✅ |
| 4 | Evidence Drawer | `EvidenceDrawer` component | ✅ |
| 5 | Signals/Situations | `/signals` | ✅ |
| 6 | Think | `/think` | ✅ |
| 7 | Act | `/act` | ✅ |
| 8 | Human-in-loop | Approval flows | ✅ |
| 9 | Govern | `/govern` | ✅ |
| 10 | Adjust | `/adjust` | ✅ |
| 11 | Repeat | Feedback loops | 🟡 |
| 12 | Audit Trail UI | `/admin/audit` | ✅ |
| 13 | Agent Config | Agent registry | ✅ |
| 14 | Digital Twin | Memory + context | 🟡 |

---

## 💧 Progressive Data Hydration

| Component | Purpose | Status | Location |
|-----------|---------|--------|----------|
| Data Strength Types | TypeScript types for hydration states | ✅ | `/src/types/data-strength.ts` |
| Hydration Context | React context for L1 views | ✅ | `/src/contexts/hydration-context.tsx` |
| Hydration UI Components | Empty states, banners, indicators | ✅ | `/src/components/hydration/` |
| Hydration Status API | Fetch tenant hydration status | ✅ | `/src/app/api/hydration/status/route.ts` |
| Sync Completion Handler | Updates strength after sync | ✅ | Documented in `/docs/PROGRESSIVE_DATA_HYDRATION.md` |
| Strength Threshold Triggers | AI triggers at level crossings | ✅ | Documented |

### Data Strength Levels

| Level | Score | Features Unlocked |
|-------|-------|-------------------|
| 🌱 Seed | 0-25% | Basic workspace, manual entry, sample data |
| 🌿 Growing | 25-50% | Entity views, basic relationships, search |
| 🌳 Healthy | 50-75% | AI summaries, health scores, risk signals |
| 🌲 Rich | 75-100% | Predictions, proactive recommendations, Digital Twin |

---

## 🎒 Customizable L1 Workspace

| Component | Purpose | Status | Location |
|-----------|---------|--------|----------|
| Module Registry Types | L1Module, DataContract, Widget definitions | ✅ | `/src/types/workspace-bag.ts` |
| Workspace Bag Context | React context for module/widget management | ✅ | `/src/contexts/workspace-bag-context.tsx` |
| Workspace Bag API | CRUD for user workspace configuration | ✅ | `/src/app/api/workspace/bag/route.ts` |
| Sidebar UI | Drag-and-drop sortable sidebar | ✅ | `/src/components/workspace/workspace-sidebar.tsx` |
| Module Picker | Dialog to add modules to bag | ✅ | `/src/components/workspace/module-picker.tsx` |
| Widget Picker | Dialog to pin widgets to Home | ✅ | `/src/components/workspace/widget-picker.tsx` |
| Home Skeleton | Fixed 5-block Home scaffold | ✅ | `/src/components/workspace/home-skeleton.tsx` |
| Workspace Shell | Complete shell combining all components | ✅ | `/src/components/workspace/workspace-shell.tsx` |
| Workspace Provider | Combined Hydration + Bag provider | ✅ | `/src/components/workspace/workspace-provider.tsx` |

### Fixed Home Skeleton (5 Non-Negotiable Blocks)

| Block | Purpose |
|-------|---------|
| Today Strip | Calendar + Tasks + Meetings for today |
| Signal Feed | Top 5 insights (even if sparse) |
| Work Queue | Tasks + Approvals + Drafts |
| Recent Knowledge | Docs, notes, chat history |
| Connect Next Tool | Guided CTA based on data gaps |

### Module Catalog (14 Modules)

| Category | Modules |
|----------|---------|
| Core | Home (fixed) |
| Work | Projects, Meetings, Docs, Tasks, Calendar |
| Personal | Notes |
| Customers | Accounts, Contacts, Pipeline |
| Team | Team |
| Intelligence | Knowledge, Risks, Expansion, Analytics |

---

## 🚀 Next Steps

1. **Complete L0 Onboarding Flow** - Finalize context questions wizard
2. **Digital Twin Service** - Implement memory + proactive context
3. **Repeat/Feedback Loops** - Self-healing mechanisms
4. **Enhanced Observability** - Complete metrics dashboard
5. **Deploy All Services** - `pnpm deploy:staging`

---

## 📊 Overall Progress

| Component | Progress |
|-----------|----------|
| L3 Backend | █████████░ 95% |
| L2 Cognitive | ████████░░ 85% |
| L1 Workspace | ████████░░ 85% |
| L0 Onboarding | ██████░░░░ 60% |
| Accelerators | █████████░ 95% |
| Connectors | █████████░ 95% |
| Pipeline | ██████████ 100% |
| Security | █████████░ 95% |

---

*For the full architecture diagram, see the Mermaid flowchart in `/docs/MASTER_ARCHITECTURE_DIAGRAM.md`*
