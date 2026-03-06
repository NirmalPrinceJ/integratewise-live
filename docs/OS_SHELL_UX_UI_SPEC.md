# IntegrateWise OS Shell - Complete UX/UI Specification

> **Status**: Complete & Aligned  
> **Version**: 1.0  
> **Last Updated**: 2026-01-28

---

## Table of Contents

1. [Shell Principles](#0-shell-principles)
2. [Global Shell Layout](#1-global-shell-layout-always-visible)
3. [Universal Embedded OS Panels](#2-universal-embedded-os-panels-used-across-all-pages)
4. [Standard Page States](#3-standard-page-states-required-everywhere)
5. [RBAC + Paywall Model](#4-rbac--paywall-model-admin-first-enablement)
6. [View-by-View UX Spec](#5-view-by-view-ux-spec-top-nav)
7. [Knowledge Bank](#6-knowledge-bank-as-both-destination--embedded)
8. [Admin View](#7-admin-view-master-enablement-surface)
9. [View Registry](#8-view-registry-how-admin-enables-everything)
10. [Implementation Sequence](#9-implementation-sequence-ui-first-stable)
11. [Deliverable Checklist](#deliverable-checklist-what-done-means-for-the-shell)

---

## 0) Shell Principles

### 0.1 Navigation hierarchy

**Views (Top Nav) → Hubs (Left Nav sections) → Pages (Left Nav items) → Panels (embedded OS layer)**

| Level | Definition | Examples |
|-------|------------|----------|
| **Views** | Operating mode (never buried) | Sales, Marketing, CS, Finance, Operations, Projects, Admin |
| **Hubs** | Grouped pages inside a view | Work, Pipeline, Accounts, Insights, System |
| **Pages** | Actual routes/screens | Home, Today, Tasks, Goals, Deals, Customers |
| **Panels** | OS components embedded in pages | Signals, Situations, Evidence, Knowledge, Actions |

### 0.2 "OS Layer" is embedded, not separate

Spine / Context / Knowledge / Think / Evidence / Act are **capabilities**, surfaced in:

- **entity pages** (Client/Deal/Task/Invoice/etc.)
- **dashboards** (Home/Today)
- **lists** (pipeline, tasks, campaigns)
- **detail views** (situation detail, execution run detail)

> Admin can still have "destination pages" for these capabilities (for auditing/config), but day-to-day work should not require jumping to them.

---

## 1) Global Shell Layout (always visible)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GLOBAL FRAME (Always Present)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  TOP BAR                                                              │  │
│  │  [Logo + Workspace] [Global Search (Cmd+K)] [Notifications]           │  │
│  │  [Tenant Badge] [Profile Menu]                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  TOP NAV: VIEW SWITCHER (Primary Switcher)                            │  │
│  │                                                                       │  │
│  │  [Sales] [Marketing] [Customer Success] [Finance] [Operations]        │  │
│  │  [Projects] [Admin]                                                   │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  LEFT NAV                   │  │         MAIN CANVAS                 │  │
│  │  (Hub Navigation)           │  │  (Dashboards + Lists + Panels)      │  │
│  │                             │  │                                     │  │
│  │  Core                       │  │  ┌───────────────────────────────┐  │  │
│  │  ├── Home                   │  │  │  PAGE CONTENT                 │  │  │
│  │  ├── Today                  │  │  │                               │  │  │
│  │  ├── Goals & Milestones     │  │  │  + EMBEDDED OS PANELS          │  │  │
│  │  └── Tasks                  │  │  │  + KPI TILES                    │  │  │
│  │                             │  │  │  + SITUATION CARDS              │  │  │
│  │  Pipeline                   │  │  │  + WORK WIDGETS                 │  │  │
│  │  ├── Deals                  │  │  │                               │  │  │
│  │  ├── Pipeline               │  │  └───────────────────────────────┘  │  │
│  │  ├── Leads                  │  │                                     │  │
│  │  └── Accounts               │  │                                     │  │
│  │                             │  │                                     │  │
│  │  Insights                   │  │                                     │  │
│  │  ├── Sales Insights         │  │                                     │  │
│  │  └── Situations             │  │                                     │  │
│  │                             │  │                                     │  │
│  │  System                     │  │                                     │  │
│  │  ├── Context                │  │                                     │  │
│  │  ├── Knowledge              │  │                                     │  │
│  │  └── IQ Hub                 │  │                                     │  │
│  │                             │  │                                     │  │
│  │  Profile                    │  │                                     │  │
│  │                             │  │                                     │  │
│  └─────────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Top Bar (global)

| Element | Description |
|---------|-------------|
| **Logo + Workspace** | Brand identity + current workspace/tenant |
| **Global Search (Cmd+K)** | Unified search across all scopes |
| **Notifications** | Activity alerts, action required, system |
| **Tenant/Workspace badge** | Current context indicator |
| **Profile menu** | User settings, logout, switch workspace |

#### Global Search modes (single box)

- Search **Entities** (Spine)
- Search **Evidence** (Context)
- Search **AI Session Summaries** (Knowledge Bank)
- Search **Situations** (Think output)
- Search **Executions** (Act runs)

**BFF Contract:**
```
GET /api/search?q=&scope=
```

### 1.2 Top Nav = Views (primary switcher)

| View | Access | Description |
|------|--------|-------------|
| **Sales** | All roles | Pipeline, deals, accounts, leads |
| **Marketing** | All roles | Campaigns, content, analytics |
| **Customer Success** | All roles | Health, customers, engagements |
| **Finance** | All roles | MRR, subscriptions, revenue |
| **Operations** | All roles | Projects, tasks, goals |
| **Projects** | All roles | Project delivery, milestones |
| **Admin** | Admin only | Full system configuration |

**Effect of switching Views:**
- Left nav changes (pages/hubs)
- Default filters change (domain scope)
- Default dashboards and situation feed change
- Available actions change (RBAC + paywall + governance)

### 1.3 Left Nav = Hub sections inside the active View

Left nav is **contextual** to the selected View:
- Contains pages for that domain
- May include "Work" pages that are shared (Today, Tasks) but scoped to the current View

---

## 2) Universal Embedded OS Panels (used across ALL pages)

These are **components**, not separate products.

### 2.1 Signal Strip (top-of-canvas)

Small badges representing **recent changes** relevant to the current page scope.

| Feature | Description |
|---------|-------------|
| **Filters** | severity, entity, time range |
| **Interaction** | Click opens Evidence Drawer pinned to that signal |

**BFF Contract:**
```
GET /api/signals?scope=&entity_ref=
```

### 2.2 Situation Cards (Think output)

Inline cards shown on dashboards, lists, and entity detail pages.

| Property | Description |
|----------|-------------|
| **Summary** | Situation description |
| **Confidence** | Think engine confidence score |
| **Impact** | Business impact level |
| **Linked entities** | client/deal/subscription/etc. |
| **Evidence count** | A/B/C breakdown |
| **Actions** | Approve / Reject / Assign / Convert to task |

**BFF Contracts:**
```
GET /api/situations?scope=&entity_ref=
POST /api/actions/propose (draft)
POST /api/actions/execute (approved)
```

### 2.3 Evidence Drawer (the "Why" panel)

Right-side drawer used everywhere. Always shows:

| Evidence Type | Source |
|--------------|--------|
| **A: Structured** | Spine events/metrics/entities |
| **B: Evidence** | Context artifacts + timeline |
| **C: AI Session Memory** | Knowledge Bank session summaries |

**BFF Contract:**
```
POST /api/evidence/resolve { refs[] }
```

### 2.4 Knowledge Panel (contextual retrieval)

Collapsible side panel showing related:

- Session summaries
- Extracted decisions/action candidates
- Linked objectives/topics

**BFF Contract:**
```
POST /api/knowledge/retrieve { context: "entity:client:123" }
```

### 2.5 Action Bar (governed execution)

Sticky inline action bar that can appear on:
- Situation cards
- Entity pages
- Today feed items

| Mode | Description |
|------|-------------|
| **Manual** | Creates approval request |
| **Assisted** | Suggests; needs approval |
| **Autonomous** | Runs within policy |

**BFF Contracts:**
```
POST /api/govern/requests
POST /api/act/execute
GET /api/act/runs?ref=
```

---

## 3) Standard Page States (required everywhere)

### 3.1 Loading State
- Skeletons (cards/table rows)
- "Last updated" timestamp area reserved
- Never blank white

### 3.2 Empty State
- "No records found" message
- 1 primary CTA
- 1 secondary CTA
- Example: "No situations yet → Connect a data source / Run scan"

### 3.3 Error State
- Inline banner
- Retry button
- Link to Integration Health (if applicable)

---

## 4) RBAC + Paywall Model (Admin-first enablement)

### 4.1 Admin-first rule

**Admin View sees every page and every toggle:**
- Page enablement
- Role mapping
- Plan gates
- Action permissions
- Governance modes per domain

Non-admin roles see **only enabled pages** for:
- Their role
- Their plan tier
- Their view access list

### 4.2 Roles (example set; can be edited in Admin)

| Role | Description |
|------|-------------|
| **Owner** | Full access, billing, team management |
| **Admin** | Full system configuration access |
| **Manager** | Team management, approvals |
| **Practitioner** | Day-to-day work execution |
| **Read-only** | View only, no actions |

### 4.3 Entitlements (paywall)

Feature flags controlled by plan:

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Knowledge Search (vector) | ❌ | ✅ | ✅ |
| Context evidence ingestion | Limited | ✅ | ✅ |
| Automated execution mode | ❌ | ❌ | ✅ |
| Advanced audits | ❌ | ❌ | ✅ |
| Multi-team hubs | ❌ | ❌ | ✅ |
| Custom views/hubs | ❌ | ❌ | ✅ |

---

## 5) View-by-View UX Spec (Top Nav)

### 5.1 OPERATIONS View

#### Left Nav hubs (sections)

**Work**
- Home
- Today
- Tasks
- Goals & Milestones
- Calendar (optional)

**Ops Objects**
- Projects
- Sessions (AI sessions + meeting notes index; read-only list)
- Documents (optional, or keep under Knowledge)

**OS Surfaces (optional destinations)**
- Context (timeline/evidence inbox)
- Knowledge Bank (browse/search)
- Integrations (health snapshot)

#### Pages + embedded panels + BFF endpoints

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/operations/home` | KPI cards + Insights list | Signals, Situations, Evidence Drawer | `GET /api/kpis?scope=ops`, `GET /api/situations?scope=ops` |
| `/operations/today` | Prioritized feed | Signals, Situations, Action Bar, Evidence | `GET /api/today?scope=ops`, `GET /api/signals?scope=ops` |
| `/operations/tasks` | Task list + proposals | Situations, Evidence | `GET /api/tasks?scope=ops`, `POST /api/tasks` |
| `/operations/goals` | Goal list + progress | Situations, Evidence | `GET /api/goals`, `GET /api/situations?scope=ops` |
| `/operations/projects` | Projects table | Evidence, Knowledge | `GET /api/projects`, `GET /api/evidence/resolve` |
| `/operations/sessions` | Session index | Knowledge Panel | `GET /api/knowledge/sessions?scope=ops` |

---

### 5.2 SALES View

#### Left Nav hubs

**Pipeline**
- Home
- Deals
- Pipeline
- Leads
- Accounts/Clients
- Contacts

**Work**
- Today
- Tasks

**Insights**
- Sales Insights (situations filtered to sales)

#### Page spec

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/sales/home` | Pipeline KPIs + key deals | Signals, Situations, Evidence | `GET /api/kpis?scope=sales`, `GET /api/situations?scope=sales` |
| `/sales/deals` | Deals list + stages | Evidence Drawer, Knowledge Panel | `GET /api/deals`, `POST /api/deals` |
| `/sales/pipeline` | Stage board | Situations, Action Bar | `GET /api/pipeline`, `GET /api/situations?scope=sales` |
| `/sales/leads` | Leads table | Evidence, Knowledge | `GET /api/leads`, `POST /api/leads` |
| `/sales/clients` | Client list | Evidence, Knowledge | `GET /api/clients` |
| `/sales/clients/:id` | Client 360 | Evidence Drawer (A/B/C), Knowledge, Situations | `GET /api/clients/:id`, `POST /api/knowledge/retrieve` |

---

### 5.3 MARKETING View

#### Left Nav hubs

**Campaigns**
- Home
- Campaigns
- Content
- Website
- Analytics

**Work**
- Today
- Tasks

**Insights**
- Marketing Insights

#### Page spec

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/marketing/home` | Campaign KPIs + highlights | Signals, Situations, Evidence | `GET /api/kpis?scope=marketing`, `GET /api/situations?scope=marketing` |
| `/marketing/campaigns` | Campaigns list | Evidence, Action Bar | `GET /api/campaigns`, `POST /api/campaigns` |
| `/marketing/content` | Content library | Knowledge, Evidence | `GET /api/content`, `POST /api/content` |
| `/marketing/website` | Pages + forms | Evidence | `GET /api/website/pages`, `GET /api/website/forms` |
| `/marketing/analytics` | Metrics dashboard | Signals, Evidence | `GET /api/metrics?scope=marketing` |

---

### 5.4 CUSTOMER SUCCESS View

#### Left Nav hubs

**Accounts**
- Home
- Customers
- Health
- Engagements
- Renewals (optional)

**Work**
- Today
- Tasks

**Insights**
- CS Insights

#### Page spec

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/cs/home` | Health overview | Signals, Situations, Evidence | `GET /api/kpis?scope=cs`, `GET /api/situations?scope=cs` |
| `/cs/customers` | Customer list | Evidence, Knowledge | `GET /api/cs/customers` |
| `/cs/health` | Health score table | Evidence, Situations | `GET /api/cs/health-scores` |
| `/cs/customers/:id` | Customer 360 | Evidence Drawer (A/B/C), Knowledge, Situations, Action Bar | `GET /api/clients/:id`, `POST /api/knowledge/retrieve`, `POST /api/govern/requests` |

---

### 5.5 FINANCE View

#### Left Nav hubs

**Revenue**
- Home
- Subscriptions
- Invoices/Transactions
- Revenue

**Work**
- Today
- Tasks

**System**
- Billing (read-only for non-admin)

#### Page spec

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/finance/home` | MRR/ARR dashboard | Signals, Situations, Evidence | `GET /api/kpis?scope=finance`, `GET /api/situations?scope=finance` |
| `/finance/subscriptions` | Subscriptions table | Evidence, Knowledge | `GET /api/subscriptions` |
| `/finance/transactions` | Transactions ledger | Evidence | `GET /api/revenue/transactions` |
| `/finance/revenue` | Revenue metrics | Signals, Evidence | `GET /api/revenue` |

---

### 5.6 PROJECTS View

#### Left Nav hubs

**Delivery**
- Home
- Projects
- Milestones
- Tasks

**Work**
- Today

#### Page spec

| Page | Primary Content | Embedded Panels | BFF Endpoints |
|------|-----------------|-----------------|---------------|
| `/projects/home` | Delivery KPIs | Signals, Situations, Evidence | `GET /api/kpis?scope=projects`, `GET /api/situations?scope=projects` |
| `/projects/projects` | Projects list | Evidence, Knowledge | `GET /api/projects` |
| `/projects/milestones` | Milestones | Evidence | `GET /api/project-milestones` |
| `/projects/tasks` | Task board | Situations, Action Bar | `GET /api/tasks?scope=projects` |

---

## 6) Knowledge Bank as both Destination + Embedded

Even if Knowledge is embedded everywhere, keep a destination view for exploration.

### Knowledge destination pages (available in Admin; optionally enabled for others)

| Page | Description |
|------|-------------|
| **Browse (Inbox)** | Session summaries list |
| **Search** | Full text + vector search + filters |
| **Topics / Boards** | Grouping layer for operational thinking |
| **Evidence** | Evidence index (read-only timeline) |
| **Bridge** | Ingestion/connector status for AI session capture |

### BFF Contracts

```
GET /api/knowledge/sessions
POST /api/knowledge/search
POST /api/knowledge/retrieve
GET /api/knowledge/bridge/status
```

> **Naming note**: "IQ Hub" stays as the user-facing control plane. If a capture/notes page exists, label it **Capture** in UI (internal codename can remain internal).

---

## 7) Admin View (Master Enablement Surface)

**Admin is the only place that MUST include everything.**
All other views are projections of Admin configuration.

### 7.1 Left Nav hubs (Admin)

**Control Plane**
- IQ Hub (autonomy modes per domain)
- Policies
- Features (View registry + flags)
- Releases
- System Health

**Identity & Access**
- Users
- Roles
- Permissions
- Teams / Hubs

**Tenant & Billing**
- Tenant Settings
- Billing & Usage

**Integrations**
- Integrations
- Data Sources
- Webhooks & Sync Health

**Audit**
- Audit Log
- Execution Log (Act runs)

### 7.2 Admin pages → API endpoints → owning service (canonical table)

| Admin Page | BFF Endpoint (apps/os) | Owning Service |
|------------|------------------------|----------------|
| `/admin/users` | `GET /api/admin/users`, `POST /api/admin/users` | Auth/Admin |
| `/admin/roles` | `GET /api/admin/rbac/roles`, `POST /api/admin/rbac/roles` | Admin/RBAC |
| `/admin/permissions` | `GET /api/admin/rbac/permissions` | Admin/RBAC |
| `/admin/teams` | `GET /api/admin/teams`, `POST /api/admin/teams` | Admin |
| `/admin/features` | `GET /api/admin/features`, `POST /api/admin/features` | Admin/Config |
| `/admin/views` | `GET /api/admin/views`, `POST /api/admin/views` | Admin/Config |
| `/admin/policies` | `GET /api/admin/policies`, `POST /api/admin/policies` | Govern |
| `/admin/iq-hub` | `GET /api/iq/sessions`, `POST /api/iq/memories/confirm` | IQ Hub |
| `/admin/system-health` | `GET /api/system/health` | System |
| `/admin/integrations` | `GET /api/integrations`, `POST /api/integrations/connect` | Gateway/Loader |
| `/admin/data-sources` | `GET /api/data-sources`, `POST /api/data-sources/sync` | Loader |
| `/admin/webhooks` | `GET /api/webhooks`, `POST /api/webhooks/test` | Gateway |
| `/admin/billing` | `GET /api/billing/summary`, `POST /api/billing/plan` | Billing |
| `/admin/usage` | `GET /api/usage` | Metering |
| `/admin/audit` | `GET /api/audit` | Govern |
| `/admin/executions` | `GET /api/act/runs`, `POST /api/act/runs/retry` | Act |
| `/admin/releases` | `GET /api/system/releases` | System |
| `/admin/migrations` | `GET /api/system/migrations` | System |

---

## 8) View Registry (how Admin enables everything)

Admin manages a **View Registry** that drives navigation + gates.

### Registry Schema

```typescript
interface ViewRegistryEntry {
  view: 'sales' | 'marketing' | 'cs' | 'finance' | 'ops' | 'projects' | 'admin';
  hub: string;           // Section name
  route: string;         // Page route
  component: string;     // React component name
  min_role: string;      // Minimum role required
  entitlement_flag: string; // Feature flag for plan gating
  default_on_in_admin: boolean;
  enabled: boolean;
}
```

### BFF Contracts

```
GET /api/admin/views (returns registry)
POST /api/admin/views (enable/disable + assign roles + plan gates)
```

---

## 9) Implementation Sequence (UI-first, stable)

| Phase | Tasks |
|-------|-------|
| **1. Shell Foundation** | Build Top Nav + Left Nav with view registry (static JSON first, then Admin-driven) |
| **2. OS Panels** | Implement Universal OS panels with mock adapters |
| **3. Admin First** | Build Admin View (all pages visible, toggles functional) |
| **4. Domain Skeletons** | Build each domain View skeleton pages (tables/cards/empty states) |
| **5. Wiring** | Only then wire real endpoints behind the BFF contracts |

---

## Deliverable Checklist (what "done" means for the Shell)

| ✅ | Item | Status |
|---|------|--------|
| ✅ | Top Nav view switcher fully working | Required |
| ✅ | Left nav hubs per view rendered from registry | Required |
| ✅ | Admin sees every page + enable/disable toggles | Required |
| ✅ | Embedded panels available on all key pages | Required |
| ✅ | Signals / Situations / Evidence / Knowledge / Actions | Required |
| ✅ | Empty/loading/error states consistent everywhere | Required |
| ✅ | BFF endpoint list locked (even if backed by mock data initially) | Required |

---

## Appendix A: Component Library

### Layout Components

| Component | Path | Purpose |
|-----------|------|---------|
| AppShell | `components/layout/app-shell.tsx` | Main shell wrapper |
| TopBar | `components/layout/top-bar.tsx` | Global top bar |
| Sidebar | `components/layout/sidebar.tsx` | Left navigation |

### OS Components

| Component | Path | Purpose |
|-----------|------|---------|
| SignalStrip | `components/os/signal-strip.tsx` | Top-of-canvas signal badges |
| SituationCards | `components/os/situation-cards.tsx` | Think output cards |
| EvidenceDrawer | `components/os/evidence-drawer.tsx` | Right-side evidence panel |
| OSTabs | `components/os/os-tabs.tsx` | View switcher tabs |

### UI Components (Radix-based)

| Component | Path |
|-----------|------|
| Button | `components/ui/button.tsx` |
| Badge | `components/ui/badge.tsx` |
| Card | `components/ui/card.tsx` |
| ScrollArea | `components/ui/scroll-area.tsx` |
| Tabs | `components/ui/tabs.tsx` |
| Sonner | `components/ui/sonner.tsx` |
| Tooltip | `components/ui/tooltip.tsx` |
| Avatar | `components/ui/avatar.tsx` |
| DropdownMenu | `components/ui/dropdown-menu.tsx` |

---

## Appendix B: Hooks Library

| Hook | Path | Purpose |
|------|------|---------|
| useSpineEvents | `hooks/use-spine-events.ts` | Fetch structured events |
| useDocuments | `hooks/use-documents.ts` | Fetch knowledge documents |
| useAIMemories | `hooks/use-ai-memories.ts` | Fetch AI session memories |
| useSituations | `hooks/use-situations.ts` | Fetch Think engine output |

---

## Appendix C: API Routes (BFF Layer)

### Core Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/signals` | List signals |
| GET | `/api/situations` | List situations |
| GET | `/api/situations/:id` | Get situation detail |
| POST | `/api/evidence/resolve` | Resolve evidence references |
| POST | `/api/knowledge/retrieve` | Contextual knowledge retrieval |

### Admin Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/roles` | List roles |
| POST | `/api/admin/rbac/roles` | Create role |
| GET | `/api/admin/views` | Get view registry |
| POST | `/api/admin/views` | Update view registry |
| GET | `/api/admin/features` | List feature flags |
| POST | `/api/admin/features` | Update feature flags |

### Action Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/actions/propose` | Propose action |
| POST | `/api/actions/execute` | Execute approved action |
| POST | `/api/govern/requests` | Create approval request |
| GET | `/api/act/runs` | List execution runs |
| POST | `/api/act/runs/retry` | Retry failed execution |

---

## Appendix D: Route Map by View

### Operations View Routes

```
/operations
/operations/home
/operations/today
/operations/tasks
/operations/goals
/operations/projects
/operations/sessions
```

### Sales View Routes

```
/sales
/sales/home
/sales/deals
/sales/pipeline
/sales/leads
/sales/clients
/sales/clients/:id
```

### Marketing View Routes

```
/marketing
/marketing/home
/marketing/campaigns
/marketing/content
/marketing/website
/marketing/analytics
```

### Customer Success View Routes

```
/cs
/cs/home
/cs/customers
/cs/health
/cs/customers/:id
```

### Finance View Routes

```
/finance
/finance/home
/finance/subscriptions
/finance/transactions
/finance/revenue
```

### Projects View Routes

```
/projects
/projects/home
/projects/projects
/projects/milestones
/projects/tasks
```

### Admin View Routes

```
/admin
/admin/users
/admin/roles
/admin/permissions
/admin/teams
/admin/features
/admin/views
/admin/policies
/admin/iq-hub
/admin/system-health
/admin/integrations
/admin/data-sources
/admin/webhooks
/admin/billing
/admin/usage
/admin/audit
/admin/executions
/admin/releases
/admin/migrations
```

---

## Document Information

| Field | Value |
|-------|-------|
| **Title** | IntegrateWise OS Shell - Complete UX/UI Specification |
| **Version** | 1.0 |
| **Status** | Complete & Aligned |
| **Created** | 2026-01-28 |
| **Location** | `docs/OS_SHELL_UX_UI_SPEC.md` |

---

*This document represents the complete, agreed-upon specification for the IntegrateWise OS Shell. All stakeholders should reference this document for UX/UI decisions.*

