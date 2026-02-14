# IntegrateWise — Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INTEGRATEWISE PLATFORM                              │
│                     Landing → Auth → Onboarding → Workspace                 │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                          📱 LAYER 1: USER INTERFACE
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1️⃣  MARKETING SITE                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  📄 Landing Pages (19 components):                                          │
│     • Hero, Problem, Pillars, Audience, Comparison                          │
│     • Differentiators, Integrations, Pricing                                │
│     • TechnicalPage, ProblemPage, AudiencePage, PricingPage                 │
│     • GenericPage (dynamic routing)                                         │
│                                                                              │
│  🎨 Design:                                                                  │
│     • White background, #F54476 accent                                      │
│     • Hash-based routing (#technical, #pricing, etc.)                       │
│     • Button: "STOP THE PLUMBING" → /#app                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2️⃣  AUTHENTICATION                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔐 Login/SignUp:                                                            │
│     • Google OAuth (captures name, email)                                   │
│     • Email/Password (captures name, email)                                 │
│     • Demo mode: any credentials work                                       │
│                                                                              │
│  💾 Data Captured:                                                           │
│     • userName: From SignUp or extracted from email                         │
│     • userEmail: For persistence                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3️⃣  ONBOARDING (4 Steps) — /components/onboarding/onboarding-flow-new.tsx  │
├─────────────────────────────────────────────────────────────────────────────┤
│  STEP 1: Role & Domain Selection                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ • Name: [Pre-filled from login, don't ask twice]                   │    │
│  │ • Domain: Pick 1 of 12:                                             │    │
│  │   ✓ Customer Success  ✓ Sales          ✓ Revenue Operations        │    │
│  │   ✓ Marketing         ✓ Product/Eng    ✓ Finance                   │    │
│  │   ✓ Service           ✓ Procurement    ✓ IT Admin                  │    │
│  │   ✓ Student/Teacher   ✓ Personal       ✓ BizOps                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 2: Integration (Pick 1 from each category)                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ CRM:       [ Salesforce ] [ HubSpot ] [ Zoho ]                      │    │
│  │ Task:      [ Any.do ] [ Todoist ]                                   │    │
│  │ Workspace: [ Coda ] [ Notion ] [ Airtable ] [ Asana ]               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 3: File Upload (Optional)                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ • Upload 2-10MB files (Markdown, Doc, Txt, CSV)                     │    │
│  │ • AI will extract insights from documents                           │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 4: Accelerator (Payment Gated)                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ • CSM Playbook ($49): Pre-built workflows for onboarding, QBRs      │    │
│  │ • Sales Pipeline ($49): Pipeline stages, email templates            │    │
│  │ • RevOps Analytics ($79): Revenue dashboards, quota tracking        │    │
│  │ • Marketing Campaigns ($49): Campaign templates, attribution        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  💾 Data Captured:                                                           │
│     • domain: Selected domain (locks user into role)                        │
│     • connectors: { crm, task, workspace }                                  │
│     • uploadedFiles: File[] (optional)                                      │
│     • accelerator: string (optional)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4️⃣  LOADER PHASE 1 (60s) — /components/workspace/loader-phase1.tsx         │
├─────────────────────────────────────────────────────────────────────────────┤
│  🎯 Goal: Show value in 60 seconds, no empty dashboard                      │
│                                                                              │
│  Stage 1: Establishing connections (8s)                                     │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Connecting to Salesforce, Todoist, and Notion...                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Stage 2: Extracting creamy layer (15s)                                     │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Pulling recent, high-value entities (last 90 days, max 50 items)    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Stage 3: Normalizing data (12s) — Domain-specific                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ CSM Example:                                                         │    │
│  │   • 15 accounts                                                      │    │
│  │   • 42 contacts                                                      │    │
│  │   • 23 meetings                                                      │    │
│  │ Processing health scores, renewal dates, touchpoints...              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Stage 4: Calculating insights (10s)                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Computing ARR, at-risk accounts, expansion opportunities...          │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Stage 5: Hydrating workspace (15s)                                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Building your personalized dashboard...                             │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  📊 Output: Creamy layer (50 entities max, 90-day window)                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5️⃣  WORKSPACE — /components/workspace/workspace-shell-new.tsx              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │ HEADER:  [Personal | Work] [Search ⌘K] [🔔] [👤 User Menu]        │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌──────────────┬──────────────────────────────────────────────────────┐   │
│  │ LEFT NAV     │ MAIN CONTENT AREA                                    │   │
│  ├──────────────┤                                                      │   │
│  │              │ ┌──────────────────────────────────────────────────┐ │   │
│  │ [Domain]     │ │ 📣 Welcome Banner (first 7 days)                 │ │   │
│  │ CS 💚        │ │ "We've hydrated your dashboard with..."          │ │   │
│  │              │ └──────────────────────────────────────────────────┘ │   │
│  │ CORE         │                                                      │   │
│  │ • Dashboard  │ ┌────────────┬────────────┬────────────┐            │   │
│  │ • Accounts   │ │ Metric 1   │ Metric 2   │ Metric 3   │            │   │
│  │ • Contacts   │ │ $450K ARR  │ 85% Health │ 3 At Risk  │            │   │
│  │ • Health     │ └────────────┴────────────┴────────────┘            │   │
│  │              │                                                      │   │
│  │ ENGAGEMENT   │ ┌──────────────────────────────────────────────────┐ │   │
│  │ • Meetings   │ │ Recent Activity                                  │ │   │
│  │ • Tasks      │ │ • Account "Acme Corp" health dropped to 60%      │ │   │
│  │ • Touchpoints│ │ • Meeting scheduled with John Smith              │ │   │
│  │              │ │ • Task due: QBR prep for Beta Inc                │ │   │
│  │ GROWTH       │ └──────────────────────────────────────────────────┘ │   │
│  │ • Expansion  │                                                      │   │
│  │ • Renewals   │                                                      │   │
│  │ • Risks      │                                                      │   │
│  │              │                                                      │   │
│  │ [Settings]   │                                                      │   │
│  │ [⌘K]         │                                                      │   │
│  └──────────────┴──────────────────────────────────────────────────────┘   │
│                                                                              │
│  🎨 Design:                                                                  │
│     • Dark mode: #0C1222 base, #0EA5E9 primary, #14B8A6 accent             │
│     • 2 views: Personal (same for all) | Work (domain-specific)             │
│     • AI hidden by default (Cmd+K only)                                     │
│     • Left nav changes based on view + domain                               │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                     🧠 LAYER 2: COGNITIVE LAYER (HIDDEN)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🤖 AI Intelligence (Cmd+K Only)                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Proactive monitoring (alerts, anomalies)                                 │
│  • AI insights (recommendations, next actions)                              │
│  • Brainstorming ("Think" mode)                                             │
│  • Context-aware chat (knows user's domain, recent activity)                │
│                                                                              │
│  ⚠️  NOT visible in L1 by default                                            │
│  ⚠️  Accessed via Cmd+K or context menu                                      │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                      💾 LAYER 3: DATA & BACKEND (TODO)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔌 L3 Pipeline (Cloudflare Workers + Neon PostgreSQL)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Connected Apps (CRM, Task, Workspace)                                      │
│         ↓                                                                    │
│  Loader Service (/make-server-e3b03387/loader)                              │
│    • Connects to 3 tools                                                    │
│    • Extracts creamy layer (last 90 days, max 50 entities)                  │
│         ↓                                                                    │
│  Normalizer Service (/make-server-e3b03387/normalizer)                      │
│    • 8-stage normalization                                                  │
│    • Maps to universal schema                                               │
│         ↓                                                                    │
│  Spine (Structured + Unstructured + AI Chats)                               │
│    • Neon PostgreSQL (SSOT with pgvector)                                   │
│    • Cloudflare R2 (file storage)                                           │
│         ↓                                                                    │
│  Workspace API (/make-server-e3b03387/workspace)                            │
│    • GET /dashboard/metrics                                                 │
│    • GET /entities/{type}                                                   │
│    • POST /actions/{action}                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                            📊 DATA MODEL
═══════════════════════════════════════════════════════════════════════════════

Domain: 12 types
  ├─ CUSTOMER_SUCCESS    → Accounts, Contacts, Meetings, Health
  ├─ SALES               → Deals, Pipeline, Activities, Forecasting
  ├─ REVOPS              → Revenue, Quotas, Territories, Reports
  ├─ MARKETING           → Campaigns, Leads, Attribution, ROI
  ├─ PRODUCT_ENGINEERING → Features, Sprints, Bugs, Releases
  ├─ FINANCE             → Revenue, Expenses, Invoices, Budget
  ├─ SERVICE             → Tickets, Customers, CSAT, Knowledge Base
  ├─ PROCUREMENT         → Vendors, Orders, Contracts, Spend
  ├─ IT_ADMIN            → Users, Permissions, Integrations, Compliance
  ├─ STUDENT_TEACHER     → Courses, Assignments, Grades, Projects
  ├─ PERSONAL            → Tasks, Calendar, Notes, Bookmarks
  └─ BIZOPS              → Projects, Workflows, Analytics

User
  ├─ userName: string
  ├─ userEmail: string
  ├─ domain: Domain
  └─ connectors: { crm, task, workspace }

WorkspaceView: "PERSONAL" | "WORK"
  ├─ PERSONAL → Same navigation for everyone (tasks, calendar, notes)
  └─ WORK     → Domain-specific navigation (changes based on domain)

Navigation
  ├─ Sections: string[]  (e.g., "Core", "Engagement", "Growth")
  └─ Items: { id, label, icon, path, badge }[]

DashboardMetrics (5 per domain)
  ├─ id: string
  ├─ label: string
  ├─ type: "number" | "currency" | "percentage" | "trend"
  └─ priority: 1-5

═══════════════════════════════════════════════════════════════════════════════
                            🔑 KEY DECISIONS
═══════════════════════════════════════════════════════════════════════════════

✅ 2 Views Only (Personal, Work) — NOT 10 contexts
✅ Domain selected once in onboarding — locks user into role
✅ Loader Phase 1 ensures non-empty dashboard (60s, creamy layer)
✅ AI hidden by default (Cmd+K only) — NO L2 clutter in L1
✅ Role-based navigation — only show relevant sections
✅ View tabs in header — NOT sidebar dropdown
✅ Don't ask twice — reuse name from login
✅ Progressive hydration — show stages, build confidence

═══════════════════════════════════════════════════════════════════════════════
                         📁 FILE ORGANIZATION
═══════════════════════════════════════════════════════════════════════════════

/components/
├── auth/
│   ├── login-page.tsx              (Email/Password + Google OAuth)
│   └── signup-page.tsx             (Captures name, email)
├── onboarding/
│   ├── onboarding-flow.tsx         (OLD — deprecated)
│   └── onboarding-flow-new.tsx     (NEW — 4 steps)
├── workspace/
│   ├── workspace-config.ts         (12 domain configs)
│   ├── loader-phase1.tsx           (60s progressive hydration)
│   └── workspace-shell-new.tsx     (2-view architecture)
├── landing/                        (19 marketing components)
├── spine/                          (Spine client, types)
└── ui/                             (Shadcn components)

/App.tsx                            (Main app, routing, state management)
/ARCHITECTURE_RESTRUCTURE.md        (This document)
```

---

## **Next Critical Steps**

### **Phase 1: Backend Integration**
1. Wire Loader Phase 1 to `/make-server-e3b03387/loader`
2. Implement creamy layer extraction (L3 pipeline)
3. Store in Neon PostgreSQL + Cloudflare R2

### **Phase 2: Entity Views**
1. Build Accounts list (Customer Success)
2. Build Deals list (Sales)
3. Build Campaigns list (Marketing)

### **Phase 3: Dashboard Hydration**
1. Calculate ARR, pipeline, health scores
2. Replace "---" placeholders with real data
3. Add trend indicators

### **Phase 4: AI Layer**
1. Connect Cmd+K to MCP connector
2. Implement context-aware chat
3. Add AI insights (hidden by default)

---

**Status**: ✅ UI Complete | 🔄 Backend TODO | ⏳ AI TODO
