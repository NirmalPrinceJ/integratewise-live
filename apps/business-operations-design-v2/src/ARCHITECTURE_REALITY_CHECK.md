# IntegrateWise Architecture - CORRECTED Understanding

> **Based on actual codebase analysis - February 13, 2026**

---

## ✅ **ACTUAL ARCHITECTURE (From Code)**

### **🎯 Core Principle: Org-DNA-First**

Every metric, view, and entity traces to **organizational growth model:**

```typescript
// From onboarding-flow.tsx and types.ts
type OrgType = "PRODUCT" | "SERVICES" | "HYBRID"

PRODUCT:   Product-Led Growth (ARR, NRR, Feature Adoption, DAU/MAU)
SERVICES:  Service Delivery Excellence (Revenue/Engagement, Utilization, Client Outcomes)
HYBRID:    Balanced Growth & Delivery (Blended ARR, Service Margin, Product Adoption)
```

**Two Measurement Lenses (Non-Negotiable):**
1. **Provider Lens**: How is YOUR org growing?
2. **Client Lens**: Is the CLIENT getting value?

---

## 🔢 **10 Operating Contexts (CTX) - NOT Domains**

```typescript
// From spine/types.ts - line 10-20
export type CTXEnum = 
  | "CTX_CS"          // Customer Success
  | "CTX_SALES"       // Sales Operations
  | "CTX_SUPPORT"     // Customer Support
  | "CTX_PM"          // Project Management
  | "CTX_MARKETING"   // Marketing
  | "CTX_BIZOPS"      // Business Operations (DEFAULT)
  | "CTX_TECH"        // Engineering
  | "CTX_HR"          // People & Culture
  | "CTX_FINANCE"     // Finance
  | "CTX_LEGAL";      // Legal
```

**These are NOT separate workspaces.** They are **contexts** - lenses through which you view the unified Spine data.

### **Context = Filter + Module Set**

Each context shows different L1 Modules:

```typescript
// From workspace-shell.tsx - line 27-38
CTX_BIZOPS: ["Home", "Projects", "Accounts", "Contacts", "Meetings", "Docs", 
             "Tasks", "Calendar", "Notes", "Knowledge Space", "Team", "Pipeline",
             "Risks", "Expansion", "Analytics", "Workflows", "Deals", "Forecasting",
             "Campaigns", "Website", "RBAC", "Approvals", "Admin"]
             // 23 modules - Most comprehensive

CTX_CS: ["Home", "Accounts", "Contacts", "Meetings", "Docs", "Tasks", "Calendar", 
         "Risks", "Expansion", "Analytics", "Workflows", "Projects"]
         // 12 modules - CS-focused

CTX_MARKETING: ["Home", "Campaigns", "Email Studio", "Social", "Attribution", "Forms",
                "Blog", "SEO", "Pages", "Media Library", "Theme", "Website", "Analytics",
                "Contacts", "Docs", "Calendar"]
                // 16 modules - Marketing-focused
```

---

## 🏗️ **4 Deep Dive Domains (Specialized Shells)**

```typescript
// From sidebar.tsx - line 65-70
const DEEP_DIVE_DOMAINS = [
  { id: "account-success", label: "Account Success", icon: "💚" },
  { id: "personal", label: "Personal", icon: "👤" },
  { id: "revops", label: "RevOps", icon: "📈" },
  { id: "salesops", label: "SalesOps", icon: "🎯" },
];
```

**Deep Dive ≠ Context**

- **Contexts**: High-level operational lenses (10 available)
- **Deep Dives**: Specialized multi-view shells for specific domains

### **Account Success Domain: 17 Views**

```typescript
// From account-success/shell.tsx - line 42-67
Navigation Structure:
├── Executive (2 views)
│   ├── Product Intelligence
│   └── Company Growth
├── Core (2 views)
│   ├── Account Master (8 accounts)
│   └── People & Team
├── Strategy (4 views)
│   ├── Business Context
│   ├── Objectives (5 active)
│   ├── Outcomes
│   └── Success Plans
├── Capabilities (3 views)
│   ├── Capabilities
│   ├── Value Streams
│   └── API Portfolio (7 APIs)
├── Operations (3 views)
│   ├── Health Metrics
│   ├── Initiatives
│   └── Tasks (3 active)
└── Risk & Insights (3 views)
    ├── Risk Register (2 risks)
    ├── Engagement Log
    └── Insights (3 insights)
```

---

## 🚀 **Onboarding Flow (5 Steps)**

```typescript
// From onboarding-flow.tsx - line 36-42
const STEPS = [
  { id: "identity", label: "Identity" },      // Name + Role
  { id: "orgtype", label: "Org DNA" },        // PRODUCT/SERVICES/HYBRID
  { id: "context", label: "Context" },        // Choose operating context
  { id: "connect", label: "Connect" },        // Select integrations
  { id: "spine", label: "Spine" },            // Ignite Spine (demo mode)
];
```

### **Step 1: Identity**
- User enters name and job role (free text)
- Example: "Arun Kumar", "Operations Lead"

### **Step 2: Org DNA** (THE NON-NEGOTIABLE)
```
User selects organizational type:
├── PRODUCT: Product-Led Growth
│   └── Metrics: ARR/MRR, NRR, Feature Adoption, Time to Value, DAU/MAU
├── SERVICES: Service Delivery Excellence
│   └── Metrics: Revenue/Engagement, Billable Utilization, Client Outcome Score
└── HYBRID: Balanced Growth & Delivery
    └── Metrics: Blended ARR, Service Margin, Product Adoption, Client NPS
```

**Every metric, view, and entity will trace to this org growth model.**

### **Step 3: Operating Context**
User chooses PRIMARY context from 10 options:
- Business Ops (default, most comprehensive)
- Customer Success
- Sales Ops
- Marketing
- Engineering
- etc.

**This determines which L1 modules they see in the workspace.**

### **Step 4: Connect Nodes**
User selects data sources:
```typescript
// From onboarding-flow.tsx - line 44-51
const CONNECTORS = [
  { id: "salesforce", name: "Salesforce", icon: "☁️" },
  { id: "hubspot", name: "HubSpot", icon: "🎯" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "jira", name: "Jira", icon: "🛠️" },
  { id: "stripe", name: "Stripe", icon: "💳" },
  { id: "github", name: "GitHub", icon: "🐙" },
];
```

### **Step 5: Ignite Spine**
- **Demo/Sandbox Mode**: NO production data connected
- Spine loads with mock/sample data
- User lands in workspace with their chosen context
- Can explore safely without real org data

**Production Data Flow**:
- User must explicitly connect production credentials later
- Spine remains in demo mode until real data authorized

---

## 🖼️ **Actual Frame Structure**

### **Frame 1: Marketing Site**
```
Standard landing page: Navbar + Content + Footer
No authentication required
```

### **Frame 2: Auth Pages**
```
Centered card on dark gradient
Login → Signup → Onboarding Flow (5 steps)
```

### **Frame 3: Workspace Shell** (Main Application)

```
┌──────────┬───────────────────────────────────────────────┐
│          │  Top Bar                                      │
│ Sidebar  │  [Context Label] [Search] [Cmd+K] [🔔] [👤]  │
│ (220px)  ├───────────────────────────────────────────────┤
│          │                                               │
│ [Logo]   │         L1 Module Content                     │
│          │         (Based on active context)             │
│ Context  │                                               │
│ Switch   │  Example: Home Module                         │
│ [🌏]     │  • KPI cards (4-column)                       │
│          │  • Charts & visualizations                    │
│ Modules: │  • Data tables                                │
│ • Home   │  • Activity feed                              │
│ • Acc... │                                               │
│ • Cont...│                                               │
│ • ...    │                                               │
│          │                                               │
│ Connect: │                                               │
│ • Integ. │                                               │
│ • AI     │                                               │
│          │                                               │
│ Deep:    │  Intelligence Overlay (Right Side - 400px)    │
│ • Acc... │  ┌─────────────────────────────────┐          │
│ • Pers...│  │ [Agents] [Chat] [Insights]      │          │
│ • RevOps │  │                                 │          │
│ • SalOps │  │ AI Chat Interface               │          │
│          │  │ • ChurnShield                   │          │
│ System:  │  │ • DealPredictor                 │          │
│ • Set... │  │ • LeadScorer                    │          │
│ • Sub... │  └─────────────────────────────────┘          │
│ • Prof...│                                               │
│          │                                               │
│ [AI ⚡]  │                                               │
│ [User]   │                                               │
│ [Logout] │                                               │
└──────────┴───────────────────────────────────────────────┘
```

**Sidebar Sections**:
1. **Brand & Context Switcher** (top)
2. **Workspace** (context-specific modules)
3. **Connect** (Integrations + AI Chat)
4. **Deep Dive** (4 domain shells)
5. **System** (Settings, Subscriptions, Profile)
6. **User & Controls** (bottom)

### **Frame 4: Deep Dive Domain Shell**

```
┌──────────┬─────────┬────────────────────────────────────┐
│ Workspace│ Domain  │  Domain Top Bar                    │
│ Sidebar  │ Sidebar │  [Account Success] [← Exit]        │
│ (hidden/ │ (240px) ├────────────────────────────────────┤
│ drawer)  │         │                                    │
│          │ Exec:   │    View Content                    │
│ [Ctx]    │ • Prod  │                                    │
│          │ • Growth│    Example: Account Master View    │
│ ...      │         │    ┌────────────────────────────┐  │
│          │ Core:   │    │ Health Score: 72/100       │  │
│ [Back]   │ • Acc   │    │ [Trend chart]              │  │
│          │ • People│    ├────────────────────────────┤  │
│          │         │    │ Risk Indicators (cards)    │  │
│          │ Strat:  │    ├────────────────────────────┤  │
│          │ • Biz   │    │ Engagement Timeline        │  │
│          │ • Obj   │    └────────────────────────────┘  │
│          │ • Out   │                                    │
│          │ • Plans │                                    │
│          │         │                                    │
│          │ Cap:    │    Intelligence Panel (Domain AI)  │
│          │ • Cap   │    [Domain-specific agents]        │
│          │ • Val   │                                    │
│          │ • API   │                                    │
│          │         │                                    │
│          │ Ops:    │                                    │
│          │ • Health│                                    │
│          │ • Init  │                                    │
│          │ • Tasks │                                    │
│          │         │                                    │
│          │ Risk:   │                                    │
│          │ • Risk  │                                    │
│          │ • Engage│                                    │
│          │ • Insig │                                    │
└──────────┴─────────┴────────────────────────────────────┘
```

---

## ❓ **CLARIFICATIONS NEEDED**

Based on code analysis, I still need to understand:

### **1. The "3 Views Per User" Model**

**From your correction:**
> "Every user will have 3 views only except the admins... Personal view should be common for all and work view and team view based on the role"

**What I see in code:**
- User selects ONE operating context during onboarding
- They see ALL modules for that context (e.g., 23 modules for BIZOPS)
- They can switch contexts freely via sidebar dropdown
- Deep Dive domains are accessed separately

**Question:** Should the architecture be:
```
Option A (Current Code):
User → Selects 1 Context → Sees all modules for that context → Can switch contexts

Option B (Your Description):
User → Gets 3 fixed views:
├── Personal View (common to all)
├── Team View (based on role from onboarding)
└── Work View (based on domain from onboarding)
```

**If Option B is correct, what do Personal/Team/Work views contain?**

### **2. Role-Based Connector Filtering**

**What I see in code:**
```typescript
// integrations-hub.tsx shows ALL connectors to everyone
const INTEGRATIONS = [
  Salesforce, HubSpot, Slack, Zendesk, Stripe, Jira, Mixpanel, 
  Gmail, Notion, Asana, GitHub, Intercom, Google Analytics, Zoom
];
// No filtering by role or context
```

**Question:** Should connectors be filtered?

Example:
```
CSM role sees:
├── Salesforce, HubSpot (CRM)
├── Gainsight, ChurnZero (CS Platform)
├── Zendesk, Intercom (Support)
└── Pendo, Mixpanel (Product Analytics)

Marketing role sees:
├── HubSpot, Marketo (Marketing Automation)
├── Mailchimp, SendGrid (Email)
├── Google Analytics, Segment (Analytics)
└── Facebook Ads, LinkedIn Ads (Paid Media)
```

### **3. Spine Demo vs. Production Mode**

**Question:** When/how does user switch from demo → production data?
- Is there a specific action in the UI?
- Does it happen in Integrations Hub after connecting real OAuth?
- Is Spine ignition a one-time event or ongoing process?

---

## ✅ **CONFIRMED from Code**

1. **10 Operating Contexts** (CTXEnum) - NOT freely switchable "workspaces", but filtered lenses ✅
2. **4 Deep Dive Domains** - Specialized shells with multiple views ✅
3. **Account Success = 17 views** organized in sections ✅
4. **Org DNA (PRODUCT/SERVICES/HYBRID) is non-negotiable** - determines all metrics ✅
5. **Onboarding is 5-step flow** - Identity → Org DNA → Context → Connect → Spine ✅
6. **Spine starts in demo mode** - No production data until explicitly connected ✅
7. **Role-based RBAC exists** (admin/tenant-manager/super-admin/approvals) ✅

---

## 🔄 **Next Steps**

Please confirm:

**A)** Is the "3 views per user" (Personal/Team/Work) model still the goal, or is the current code (context + modules) the intended design?

**B)** Should integration connectors be filtered by role/context? If yes, provide mapping.

**C)** Clarify the Spine ignition → production data flow.

**D)** Are there more Deep Dive domains planned beyond the 4 implemented?

Once confirmed, I will:
1. Update all documentation to match actual architecture
2. Complete the Teal-Blue color migration
3. Ensure PAGE_STRUCTURE and FRAME_DEFINITIONS reflect reality

---

**Version:** 1.0 Corrected  
**Last Updated:** February 13, 2026  
**Status:** 🟡 Awaiting Confirmation on 3-View Model
