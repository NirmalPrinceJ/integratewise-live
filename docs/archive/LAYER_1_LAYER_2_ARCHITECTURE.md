# Layer 1 & Layer 2 Architecture Unfoldment

## Architecture Overview

IntegrateWise OS has a **dual-layer architecture** where:
- **Layer 1 (L1)** = The **Workspace Surface** (daily operational UI)
- **Layer 2 (L2)** = The **Cognitive Intelligence Layer** (AI/evidence/approval system)

These layers **stack vertically** with L2 sliding up from the bottom when invoked.

---

## Layer 1: Context-Aware Workspace Surface

### Definition
Layer 1 is the **primary workspace** where users perform daily tasks. It's context-aware and adapts based on:
- **Context Enum**: `personal|business|csm|tam|sales|marketing|ops|pm|generic-team`
- **Scope**: `org_id, team_id, owner_id, account_id, region`
- **RBAC**: Row/field permissions, tool access, write rules

### 15 Core Modules (Context-Adaptive)

| Module | Personal View | Business View | CSM View | Purpose |
|--------|--------------|---------------|----------|---------|
| **1. Home** | My Dashboard | Strategic Hub | CS Dashboard | Entry point with metrics |
| **2. Projects** | My Projects | Initiatives | Client Projects | Project/initiative tracking |
| **3. Accounts** | My Accounts | Portfolio | Account 360 | Account master records |
| **4. Contacts** | My Contacts | Stakeholders | Org Chart | Contact/stakeholder management |
| **5. Meetings** | My Meetings | QBRs | Cadence Calls | Meeting management + transcripts |
| **6. Docs** | My Docs | Contracts | Evidence Docs | Document repository + OCR |
| **7. Tasks** | My Tasks | Action Items | Playbooks | Task management + workflows |
| **8. Calendar** | My Calendar | Launches | Renewals Calendar | Event scheduling + sync |
| **9. Notes** | My Notes | Meeting Notes | CS Notes | Note-taking with entity links |
| **10. Knowledge** | Knowledge Hub | Wiki | Topic Spaces | Knowledge base + retrieval |
| **11. Team** | My Team | Directory | Coverage Map | Team/org structure |
| **12. Pipeline** | N/A | Deals | Expansion Opps | Sales/renewal pipeline |
| **13. Risks** | My Risks | Tech Debt | Account Risks | Risk registers |
| **14. Expansion** | N/A | Growth Initiatives | Adoption | Growth tracking |
| **15. Analytics** | Personal Metrics | Business Metrics | CS Analytics | Dashboards + widgets |

### Implementation Pattern (L1)

```tsx
// src/app/(app)/[context]/[module]/page.tsx
// Examples:
// - src/app/(app)/personal/home/page.tsx
// - src/app/(app)/business/dashboard/page.tsx
// - src/app/(app)/cs/accounts/page.tsx

export default function ModulePage() {
  return (
    <div className="workspace-surface">
      {/* L1 Content: Daily workspace UI */}
      <ModuleHeader />
      <ModuleContent />
      <ProactiveSignalFeed />
      
      {/* Trigger to open L2 */}
      <button onClick={openEvidenceDrawer}>
        View Evidence
      </button>
    </div>
  )
}
```

### Key Characteristics (L1)
- ✅ Always visible (top-level navigation)
- ✅ Context-specific projections (same data, different views)
- ✅ Powered by L3 Domain APIs (`/accounts/*`, `/projects/*`, etc.)
- ✅ Can trigger L2 cognitive layer via events
- ✅ CRUD operations with RBAC enforcement

---

## Layer 2: Universal Cognitive Intelligence Layer

### Definition
Layer 2 is the **cognitive brain** of the system. It:
- **Slides up from the bottom** (modal/drawer UI)
- **Same features for all contexts** (universal)
- **Data varies by context/scope** (filtered by RBAC)
- Provides **evidence, reasoning, AI workflows, and approvals**

### 14 Core Components

| Component | Purpose | UI Pattern |
|-----------|---------|------------|
| **L2.1 Spine UI** | SSOT projection (canonical entities) | Drawer/Panel |
| **L2.2 Context UI** | Unstructured data + extracted facts | Drawer/Panel |
| **L2.3 Knowledge UI** | Chunks + retrieval + summaries | Drawer/Panel |
| **L2.4 Evidence Drawer** | Timeline + provenance + evidence_refs | Bottom Sheet |
| **L2.5 Signals/Situations** | Materialized signals + situations | Overlay Panel |
| **L2.6 Think** | Scoring + reasoning + context graph | Cognitive Panel |
| **L2.7 Act** | Agent workflows propose/execute | Action Panel |
| **L2.8 Human-in-Loop (HITL)** | Approve/reject/redo controls | Modal Dialog |
| **L2.9 Govern** | RBAC + policy + write rules | Settings Panel |
| **L2.10 Adjust** | Corrections + self-heal | Feedback Panel |
| **L2.11 Repeat** | Feedback loop from actions | Background |
| **L2.12 Audit Trail UI** | Immutable logs + exports | Drawer/Panel |
| **L2.13 Agent Config** | Registry + tools + limits | Settings Panel |
| **L2.14 Digital Twin** | Proactive context + memory | AI Panel |

### Implementation Pattern (L2)

```tsx
// src/components/cognitive/EvidenceDrawer.tsx (already exists)
// src/components/cognitive/ThinkPanel.tsx
// src/components/cognitive/ActPanel.tsx
// src/components/cognitive/HITLModal.tsx

export function CognitiveLayer() {
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    // Listen for L1 trigger events
    const handler = (e: CustomEvent) => {
      setIsOpen(true)
      setContext(e.detail)
    }
    window.addEventListener('iw:evidence:open', handler)
    return () => window.removeEventListener('iw:evidence:open', handler)
  }, [])
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} side="bottom">
      <SheetContent className="h-[80vh] rounded-t-xl">
        {/* L2 Cognitive Interface */}
        <TabGroup>
          <Tab>Evidence</Tab>
          <Tab>Think</Tab>
          <Tab>Act</Tab>
          <Tab>Approve</Tab>
        </TabGroup>
        
        <EvidenceTimeline />
        <ThinkReasoning />
        <ActProposals />
        <HITLControls />
      </SheetContent>
    </Sheet>
  )
}
```

### Key Characteristics (L2)
- ✅ **Slides up from bottom** (overlays L1)
- ✅ **Closable** (user returns to L1)
- ✅ **Universal** (same UI for all contexts)
- ✅ **Context-filtered** (data scoped by RBAC)
- ✅ Powered by L3 Cognitive APIs (`/ai/chats/*`, `/agent/*`, `/evidence/*`)
- ✅ **Human approval gate** for AI actions

---

## How L1 and L2 Interact

### Invocation Flow

```
User in L1 (e.g., Accounts view)
    ↓
Sees "High Churn Risk" signal
    ↓
Clicks "View Evidence"
    ↓
L2 Evidence Drawer slides up from bottom
    ↓
Shows timeline: Spine + Context + Knowledge sources
    ↓
User clicks "Think" tab
    ↓
L2 Think Panel shows AI reasoning graph
    ↓
User clicks "Act" tab
    ↓
L2 Act Panel shows proposed workflow actions
    ↓
User approves/rejects in L2 HITL Modal
    ↓
L2 closes, returns to L1 with updated data
```

### Event-Driven Communication

```tsx
// L1 triggers L2 (from any workspace view)
window.dispatchEvent(new CustomEvent('iw:evidence:open', {
  detail: {
    entityId: 'account_123',
    entityType: 'account',
    context: 'csm',
    scope: { org_id, team_id, owner_id, account_id }
  }
}))

// L2 updates L1 (after AI action completes)
window.dispatchEvent(new CustomEvent('iw:workspace:refresh', {
  detail: { entityId: 'account_123' }
}))
```

### Visual Hierarchy

```
┌─────────────────────────────────────────────┐
│ L1: Workspace Surface (always visible)      │
│                                             │
│  ┌────────────┐  ┌────────────┐            │
│  │  Accounts  │  │  Projects  │            │
│  └────────────┘  └────────────┘            │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Account: Acme Corp                   │  │
│  │ Health Score: 65 (⚠️ Risk)           │  │
│  │ [View Evidence] ← Trigger L2         │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                      ↓ (slides up)
┌─────────────────────────────────────────────┐
│ L2: Cognitive Layer (modal overlay)         │
│ ┌─────────────────────────────────────────┐ │
│ │ Evidence | Think | Act | Approve        │ │
│ ├─────────────────────────────────────────┤ │
│ │ Timeline:                               │ │
│ │ • Spine: Last login 30 days ago         │ │
│ │ • Context: Support tickets +40%         │ │
│ │ • Knowledge: Exec left company          │ │
│ │                                         │ │
│ │ Think:                                  │ │
│ │ • Reasoning: Low engagement + exec churn│ │
│ │ • Score: 65/100 (High Risk)             │ │
│ │                                         │ │
│ │ Act:                                    │ │
│ │ • Proposed: Schedule QBR                │ │
│ │ • Proposed: Notify CSM                  │ │
│ │                                         │ │
│ │ [Approve] [Reject] [Modify]             │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Wiring to L3 Backend

### L1 → L3 Wiring (Domain APIs)

```
L1 Module          →  L3 API Gateway  →  L3 Domain API
─────────────────────────────────────────────────────────
Home               →  /api/*          →  /analytics/*
Projects           →  /api/*          →  /projects/*
Accounts           →  /api/*          →  /accounts/*
Contacts           →  /api/*          →  /contacts/*
Meetings           →  /api/*          →  /meetings/*
Docs               →  /api/*          →  /docs/*
Tasks              →  /api/*          →  /tasks/*
Calendar           →  /api/*          →  /calendar/*
Notes              →  /api/*          →  /notes/*
Knowledge          →  /api/*          →  /knowledge/*
Team               →  /api/*          →  /team/*
Pipeline           →  /api/*          →  /pipeline/*
Risks              →  /api/*          →  /risks/*
Expansion          →  /api/*          →  /expansion/*
Analytics          →  /api/*          →  /analytics/*
```

### L2 → L3 Wiring (Cognitive APIs)

```
L2 Component       →  L3 API Gateway  →  L3 Cognitive API
─────────────────────────────────────────────────────────
Spine UI           →  /api/*          →  /evidence/*
Context UI         →  /api/*          →  /knowledge/*
Knowledge UI       →  /api/*          →  /ai/chats/*
Evidence Drawer    →  /api/*          →  /evidence/*
Signals            →  /api/*          →  /ai/insights/*
Think              →  /api/*          →  /ai/insights/*
Act                →  /api/*          →  /agent/*
HITL               →  /api/*          →  /approval/*
Govern             →  /api/*          →  /governance/*
Audit Trail        →  /api/*          →  /audit/*
Agent Config       →  /api/*          →  /agent/*
Digital Twin       →  /api/*          →  /ai/chats/*
```

---

## Implementation Checklist

### Current Status
- ✅ **EvidenceDrawer exists** (`src/components/shared/EvidenceDrawer.tsx`)
- ✅ **Event trigger pattern exists** (`iw:evidence:open` in os-home-view.tsx)
- ✅ **L1 routes exist** (personal/, cs/, sales/, marketing/, admin/)
- ⚠️ **L1 pages are stubs** (need full implementation)
- ❌ **L2 components missing** (Think, Act, HITL, Govern, etc.)
- ❌ **L2 slide-up pattern incomplete** (only Evidence Drawer exists)

### Next Steps

#### Phase 1: Complete L1 Personal View
1. **Implement 15 personal view modules**
   - [src/app/(app)/personal/home/page.tsx](src/app/(app)/personal/home/page.tsx) (replace stub)
   - [src/app/(app)/personal/projects/page.tsx](src/app/(app)/personal/projects/page.tsx)
   - [src/app/(app)/personal/accounts/page.tsx](src/app/(app)/personal/accounts/page.tsx)
   - [src/app/(app)/personal/contacts/page.tsx](src/app/(app)/personal/contacts/page.tsx)
   - [src/app/(app)/personal/meetings/page.tsx](src/app/(app)/personal/meetings/page.tsx)
   - [src/app/(app)/personal/docs/page.tsx](src/app/(app)/personal/docs/page.tsx)
   - [src/app/(app)/personal/tasks/page.tsx](src/app/(app)/personal/tasks/page.tsx) (already exists)
   - [src/app/(app)/personal/calendar/page.tsx](src/app/(app)/personal/calendar/page.tsx)
   - [src/app/(app)/personal/notes/page.tsx](src/app/(app)/personal/notes/page.tsx)
   - [src/app/(app)/personal/knowledge/page.tsx](src/app/(app)/personal/knowledge/page.tsx)
   - [src/app/(app)/personal/team/page.tsx](src/app/(app)/personal/team/page.tsx)
   - [src/app/(app)/personal/pipeline/page.tsx](src/app/(app)/personal/pipeline/page.tsx)
   - [src/app/(app)/personal/risks/page.tsx](src/app/(app)/personal/risks/page.tsx)
   - [src/app/(app)/personal/expansion/page.tsx](src/app/(app)/personal/expansion/page.tsx)
   - [src/app/(app)/personal/analytics/page.tsx](src/app/(app)/personal/analytics/page.tsx)

2. **Wire to L3 Domain APIs**
   - Use `fetch('/api/accounts/*')` pattern
   - Apply context/scope from session
   - Handle RBAC permissions

3. **Add L2 triggers**
   - "View Evidence" buttons
   - Signal click handlers
   - Situation detail links

#### Phase 2: Build L2 Cognitive Components
1. **Create core L2 components**
   - `src/components/cognitive/CognitiveLayer.tsx` (main container)
   - `src/components/cognitive/SpinePanel.tsx`
   - `src/components/cognitive/ContextPanel.tsx`
   - `src/components/cognitive/KnowledgePanel.tsx`
   - `src/components/cognitive/ThinkPanel.tsx`
   - `src/components/cognitive/ActPanel.tsx`
   - `src/components/cognitive/HITLModal.tsx`
   - `src/components/cognitive/GovernPanel.tsx`
   - `src/components/cognitive/AdjustPanel.tsx`
   - `src/components/cognitive/AuditTrailPanel.tsx`
   - `src/components/cognitive/AgentConfigPanel.tsx`
   - `src/components/cognitive/DigitalTwinPanel.tsx`

2. **Implement slide-up pattern**
   - Use Shadcn Sheet component with `side="bottom"`
   - 70-80vh height
   - Rounded top corners
   - Dark theme (`bg-slate-950`)
   - Tab navigation between L2 components

3. **Wire to L3 Cognitive APIs**
   - Evidence timeline: `GET /api/evidence/:entityId`
   - Think reasoning: `POST /api/ai/insights/explain`
   - Act proposals: `POST /api/agent/propose`
   - Approvals: `POST /api/approval/submit`
   - Audit logs: `GET /api/audit/:entityId`

#### Phase 3: Implement Context-Specific Views
1. **Business view** (`src/app/(app)/business/*`)
2. **CS view** (`src/app/(app)/cs/*`)
3. **Sales view** (`src/app/(app)/sales/*`)
4. **Marketing view** (`src/app/(app)/marketing/*`)
5. **Operations view** (`src/app/(app)/operations/*`)

#### Phase 4: Connect Evidence Chain
1. **Accelerators → Signals → Think → Act → HITL → Execute**
2. **Evidence refs flow through entire chain**
3. **Audit trail captures everything**

---

## Design Principles

### Layer Separation
- **L1 = What you work on** (entities, tasks, projects)
- **L2 = Why it matters** (evidence, reasoning, actions)
- Never mix L1 and L2 in same component
- L2 always slides up, never embedded in L1

### Context Awareness
- **Same modules** across contexts
- **Different projections** of data
- **Different defaults** (widgets, filters, labels)
- **RBAC enforced** at API Gateway

### Evidence-First
- Every insight has evidence_refs
- Every AI decision has reasoning chain
- Every action has audit trail
- User can always "View Evidence" (L2 Evidence Drawer)

### Human-in-Loop
- AI proposes, human approves
- No autonomous write actions without approval
- L2 HITL Modal is approval gate
- Audit trail logs all decisions

---

## Summary

| Aspect | Layer 1 (Workspace) | Layer 2 (Cognitive) |
|--------|---------------------|---------------------|
| **Purpose** | Daily operations | AI intelligence + approvals |
| **Visibility** | Always visible | Slides up on demand |
| **Context** | Context-specific projections | Universal (data varies) |
| **UI Pattern** | Full page routes | Modal/drawer overlay |
| **APIs** | Domain APIs (L3) | Cognitive APIs (L3) |
| **CRUD** | Yes (with RBAC) | Read-only + approvals |
| **Navigation** | Top nav + side nav | Tab group within drawer |
| **Example** | Accounts list | Evidence timeline for account |

**Next Action**: Implement L1 Personal View pages with L2 Evidence Drawer triggers.
