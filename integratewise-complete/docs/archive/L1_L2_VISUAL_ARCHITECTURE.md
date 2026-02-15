# Layer 1 & Layer 2 Visual Architecture

## The Dual-Layer Model

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  L1: WORKSPACE SURFACE (Context-Aware)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │   Home    │  │ Accounts  │  │ Projects  │  │  Tasks    │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Contacts  │  │ Meetings  │  │   Docs    │  │ Calendar  │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Notes    │  │ Knowledge │  │   Team    │  │ Pipeline  │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │
│  │  Risks    │  │ Expansion │  │ Analytics │                  │
│  └───────────┘  └───────────┘  └───────────┘                  │
│                                                                 │
│  User clicks: [View Evidence] or [Why this metric?]           │
│                       ↓                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        │ (slides up)
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  L2: COGNITIVE INTELLIGENCE LAYER (Universal)                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ [Evidence] [Think] [Act] [Approve] [Audit]  [Close ✕]  │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  📊 Evidence Timeline                                   │  │
│  │  ────────────────────────────────────────────────────   │  │
│  │                                                         │  │
│  │  🟢 Spine (Structured)                                  │  │
│  │  • Last login: 30 days ago                             │  │
│  │  • ARR: $50,000                                        │  │
│  │  • Renewal: 45 days                                    │  │
│  │                                                         │  │
│  │  🟡 Context (Unstructured)                              │  │
│  │  • Support tickets: +40% this month                    │  │
│  │  • Meeting cancellations: 2 in last 2 weeks           │  │
│  │                                                         │  │
│  │  🔵 Knowledge (AI Chat)                                 │  │
│  │  • Executive champion left company (LinkedIn)          │  │
│  │  • Competitor mention in Slack                         │  │
│  │                                                         │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │                                                         │  │
│  │  🧠 Think: Reasoning Graph                              │  │
│  │                                                         │  │
│  │  Low Engagement (30d) + Exec Churn + Ticket Spike      │  │
│  │           ↓                                             │  │
│  │  Health Score: 65/100 (High Churn Risk)               │  │
│  │           ↓                                             │  │
│  │  Recommendation: Schedule QBR + Escalate to TAM        │  │
│  │                                                         │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │                                                         │  │
│  │  ⚡ Act: Proposed Actions                               │  │
│  │                                                         │  │
│  │  1. Schedule QBR with stakeholders                     │  │
│  │     Impact: High | Urgency: 7 days                     │  │
│  │     [Approve] [Modify] [Reject]                        │  │
│  │                                                         │  │
│  │  2. Notify TAM: Escalation required                    │  │
│  │     Impact: Medium | Urgency: Immediate                │  │
│  │     [Approve] [Modify] [Reject]                        │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Context Switching

### Same L1 Modules, Different Projections

```
┌─────────────────────────────────────────────────────────────┐
│  Context Selector: [Personal ▼] [Business] [CS] [Sales]    │
└─────────────────────────────────────────────────────────────┘

Personal Context                  CS Context
──────────────────                ──────────────────
📁 Home                           📁 Dashboard
   My Dashboard                      CS Dashboard
   My Tasks                          Team Dashboard
   My Metrics                        Account Health

📁 Accounts                       📁 Accounts
   My Accounts                       Account 360
   (owner_id filter)                 CS Portfolio
                                     (team_id filter)

📁 Projects                       📁 Projects
   My Projects                       Client Projects
   Personal Initiatives              Delivery Roadmap

📁 Tasks                          📁 Tasks
   My Tasks                          Playbook Tasks
   Personal Actions                  CS Actions

📁 Pipeline                       📁 Pipeline
   My Deals                          Renewal Pipeline
                                     Expansion Opps
```

---

## Data Flow: L1 → L3 → Accelerators → L2 → L1

```
┌─────────────────────────────────────────────────────────────┐
│  L1: User in CS Dashboard                                   │
│  Views Account "Acme Corp"                                  │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ GET /api/accounts/acme?context=csm&scope={...}
                ↓
┌─────────────────────────────────────────────────────────────┐
│  L3: API Gateway                                            │
│  • Apply context: csm                                       │
│  • Apply scope: team_id, owner_id, account_id              │
│  • Check RBAC: user has read access                        │
│  • Route to Domain API: /accounts/*                        │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Fetch from Spine DB (filtered by scope)
                ↓
┌─────────────────────────────────────────────────────────────┐
│  L3: Spine DB (SSOT)                                        │
│  • Account record: Acme Corp                                │
│  • Health score: 65/100                                     │
│  • Last updated: 2 hours ago (by accelerator)              │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ (Background: Accelerator runs every 1 hour)
                ↓
┌─────────────────────────────────────────────────────────────┐
│  Domain Accelerators                                        │
│  • CustomerHealthScore → score: 65                          │
│  • ChurnPrediction → risk: HIGH                            │
│  • PipelineVelocity → velocity: 0.7x                       │
│  Writes to Spine DB + emits signals                        │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ User clicks [View Evidence]
                ↓
┌─────────────────────────────────────────────────────────────┐
│  L2: Evidence Drawer opens                                  │
│  Fetches: GET /api/evidence/acme?context=csm                │
│  Shows: Spine + Context + Knowledge sources                 │
│                                                             │
│  User clicks [Think] tab                                    │
│  Fetches: POST /api/ai/insights/explain                     │
│  Shows: Reasoning graph + scoring logic                     │
│                                                             │
│  User clicks [Act] tab                                      │
│  Fetches: POST /api/agent/propose                           │
│  Shows: Proposed actions (Schedule QBR, Notify TAM)        │
│                                                             │
│  User clicks [Approve]                                      │
│  Submits: POST /api/approval/submit                         │
│  Agent executes: Creates QBR task, sends Slack notification│
└───────────────┬─────────────────────────────────────────────┘
                │
                │ L2 dispatches: iw:workspace:refresh
                ↓
┌─────────────────────────────────────────────────────────────┐
│  L1: CS Dashboard refreshes                                 │
│  • New task appears: "QBR with Acme Corp"                  │
│  • Account status: "Action Taken"                          │
│  • L2 closes, user continues working                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Evidence Chain

```
Tool → 8-Stage Pipeline → Normalization → Spine DB
                                              ↓
                                          Accelerators
                                        (compute metrics)
                                              ↓
                                          Signals/Situations
                                              ↓
                                          Think (AI reasoning)
                                              ↓
                                          Act (propose workflows)
                                              ↓
                                          HITL (human approval)
                                              ↓
                                          Execute (agent actions)
                                              ↓
                                          Audit Trail (immutable log)

Every step has evidence_refs pointing back to sources.
```

---

## Component Hierarchy

```
src/
├── app/
│   └── (app)/
│       ├── personal/          ← L1 Personal Context
│       │   ├── home/
│       │   ├── accounts/
│       │   ├── projects/
│       │   ├── contacts/
│       │   ├── meetings/
│       │   ├── docs/
│       │   ├── tasks/
│       │   ├── calendar/
│       │   ├── notes/
│       │   ├── knowledge/
│       │   ├── team/
│       │   ├── pipeline/
│       │   ├── risks/
│       │   ├── expansion/
│       │   └── analytics/
│       │
│       ├── business/          ← L1 Business Context
│       │   ├── dashboard/
│       │   ├── strategic-hub/
│       │   ├── portfolio/
│       │   ├── initiatives/
│       │   └── metrics/
│       │
│       ├── cs/                ← L1 CS Context
│       │   ├── dashboard/
│       │   ├── accounts/
│       │   ├── health/
│       │   ├── playbooks/
│       │   └── risks/
│       │
│       ├── sales/             ← L1 Sales Context
│       │   ├── dashboard/
│       │   ├── pipeline/
│       │   ├── forecast/
│       │   └── accounts/
│       │
│       ├── marketing/         ← L1 Marketing Context
│       │   ├── dashboard/
│       │   ├── campaigns/
│       │   ├── attribution/
│       │   └── analytics/
│       │
│       └── operations/        ← L1 Operations Context
│           ├── dashboard/
│           ├── tasks/
│           ├── risks/
│           └── metrics/
│
├── components/
│   ├── cognitive/             ← L2 Components (Universal)
│   │   ├── CognitiveLayer.tsx
│   │   ├── EvidencePanel.tsx
│   │   ├── ThinkPanel.tsx
│   │   ├── ActPanel.tsx
│   │   ├── HITLModal.tsx
│   │   ├── AuditPanel.tsx
│   │   ├── SpinePanel.tsx
│   │   ├── ContextPanel.tsx
│   │   ├── KnowledgePanel.tsx
│   │   ├── GovernPanel.tsx
│   │   ├── AdjustPanel.tsx
│   │   └── AgentConfigPanel.tsx
│   │
│   ├── personal/              ← L1 Personal View Components
│   │   ├── home/
│   │   ├── accounts/
│   │   └── ...
│   │
│   ├── cs/                    ← L1 CS View Components
│   │   ├── dashboard/
│   │   ├── health/
│   │   └── ...
│   │
│   └── shared/                ← Shared UI Components
│       ├── EvidenceDrawer.tsx
│       ├── SignalFeed.tsx
│       └── ...
```

---

## API Structure

```
L3 Backend APIs
───────────────

Domain APIs (L1 ← L3)
─────────────────────
/api/accounts/*         → Account master + 360
/api/projects/*         → Projects/initiatives
/api/contacts/*         → Contacts/stakeholders
/api/meetings/*         → Meetings + transcripts
/api/docs/*             → Documents + OCR
/api/tasks/*            → Tasks + playbooks
/api/calendar/*         → Calendar events
/api/notes/*            → Notes + linkage
/api/knowledge/*        → KB/wiki + retrieval
/api/team/*             → Team/org structure
/api/pipeline/*         → Deals/forecast
/api/risks/*            → Risk registers
/api/expansion/*        → Growth/adoption
/api/analytics/*        → Metrics/trends

Cognitive APIs (L2 ← L3)
────────────────────────
/api/evidence/*         → Evidence timeline
/api/audit/*            → Audit trail
/api/ai/chats/*         → AI sessions
/api/ai/insights/*      → Explainability
/api/agent/*            → Agent workflows
/api/approval/*         → HITL approvals
/api/governance/*       → RBAC/policies

Utility APIs
────────────
/api/auth/*             → Auth/sessions
/api/user/*             → User/profile
/api/onboard/*          → Onboarding state
/api/connectors/*       → Connector catalog
/api/sync/*             → Sync schedules
/api/billing/*          → Metering/usage
```

---

## State Management

### Global State (Context)

```typescript
// lib/context.ts
interface AppContext {
  context: 'personal' | 'business' | 'csm' | 'tam' | 'sales' | 'marketing' | 'ops' | 'pm' | 'generic-team'
  scope: {
    org_id: string
    team_id?: string
    owner_id?: string
    account_id?: string
    region?: string
  }
  rbac: {
    role: string
    permissions: string[]
  }
}

// Context Provider wraps entire app
<AppContextProvider>
  <L1Workspace />
  <L2CognitiveLayer />
</AppContextProvider>
```

### L2 State (Cognitive Layer)

```typescript
// components/cognitive/CognitiveLayer.tsx
interface CognitiveState {
  isOpen: boolean
  activeTab: 'evidence' | 'think' | 'act' | 'approve' | 'audit'
  entityId?: string
  entityType?: string
  situationId?: string
  evidenceData?: EvidenceItem[]
  thinkData?: ThinkReasoning
  actData?: ProposedAction[]
}

// L2 listens for events from L1
window.addEventListener('iw:evidence:open', (e) => {
  // Open L2 with context
})

// L2 emits events to L1
window.dispatchEvent(new CustomEvent('iw:workspace:refresh', {
  detail: { entityId }
}))
```

---

## Styling & Theming

### L1 (Light/Workspace Theme)

```css
/* L1 uses standard workspace colors */
background: bg-background (white/light)
text: text-foreground (dark)
cards: bg-card (white) + border
accents: primary/secondary colors
```

### L2 (Dark/Cognitive Theme)

```css
/* L2 uses dark theme to differentiate */
background: bg-slate-950 (dark)
text: text-slate-50 (light)
cards: bg-slate-900 + border-slate-800
accents: blue-400, green-400, yellow-400
rounded-t-2xl (top corners rounded)
```

---

## Performance Considerations

### L1 Optimization
- Server-side rendering (SSR) for initial load
- Incremental Static Regeneration (ISR) for dashboards
- React Query for data fetching + caching
- Virtual scrolling for large lists
- Lazy load modules (code splitting)

### L2 Optimization
- Lazy load L2 components (only mount when opened)
- Stream evidence data (don't wait for all sources)
- Debounce Think/Act API calls (300ms)
- Cache reasoning graphs (10 min TTL)
- Prefetch on hover (evidence drawer)

---

## Security & RBAC

### API Gateway Enforcement

```typescript
// Every API call passes through gateway
Request → API Gateway
  ↓
Apply Context (from session)
  ↓
Apply Scope (from context)
  ↓
Check RBAC (user permissions)
  ↓
Row-level filtering (scope filters)
  ↓
Field-level filtering (hide sensitive)
  ↓
Route to service
  ↓
Response
```

### Write Rules

```typescript
// L1 writes subject to policy
POST /api/accounts/:id/update
  → Gateway checks: user.canWrite('accounts', accountId, scope)
  → If approved: write + audit log
  → If rejected: 403 Forbidden

// L2 writes require approval
POST /api/agent/propose
  → Agent proposes action
  → Human approves in HITL Modal
  → Approval → governance check
  → Execute → audit log
```

---

## Summary

| Aspect | Layer 1 | Layer 2 |
|--------|---------|---------|
| **Purpose** | Daily workspace | AI intelligence |
| **UI** | Full pages | Slide-up drawer |
| **Theme** | Light | Dark |
| **Context** | Specific projections | Universal |
| **APIs** | Domain APIs | Cognitive APIs |
| **CRUD** | Yes (with RBAC) | Read + approvals |
| **Navigation** | Top/side nav | Tabs within drawer |
| **Trigger** | Direct access | Event-driven |
| **Height** | Full viewport | 80vh overlay |

**Next**: Implement [L1_L2_IMPLEMENTATION_PLAN.md](L1_L2_IMPLEMENTATION_PLAN.md)
