# Layer 1 & Layer 2 Implementation Plan

## Overview

This document provides step-by-step instructions to implement the dual-layer architecture:
- **Layer 1 (L1)**: Context-aware workspace surface
- **Layer 2 (L2)**: Universal cognitive intelligence layer

Start with **Personal View** (simplest context) before expanding to Business, CS, Sales, Marketing, Operations.

---

## Phase 1: Personal View (L1) - 15 Modules

### Module 1: Home Dashboard

**File**: `src/app/(app)/personal/home/page.tsx`

**Features**:
- Today's timeline (meetings, tasks, deadlines)
- Proactive signal feed (from accelerators)
- Active situations (from Think layer)
- Quick actions (create task, schedule meeting)
- Recent activity (last 10 items)
- Context health metrics

**Components to create**:
```tsx
// src/components/personal/home/TodaysTimeline.tsx
// src/components/personal/home/ProactiveSignalFeed.tsx
// src/components/personal/home/ActiveSituations.tsx
// src/components/personal/home/QuickActions.tsx
// src/components/personal/home/RecentActivity.tsx
// src/components/personal/home/HealthMetrics.tsx
```

**API calls**:
```typescript
GET /api/analytics/personal/dashboard
GET /api/ai/insights/signals?context=personal&scope={owner_id}
GET /api/ai/insights/situations?context=personal&scope={owner_id}
GET /api/audit/recent?context=personal&scope={owner_id}&limit=10
```

**L2 triggers**:
- Click signal → opens Evidence Drawer
- Click situation → opens Think Panel
- Click "Why this metric?" → opens Evidence Drawer

---

### Module 2: Projects

**File**: `src/app/(app)/personal/projects/page.tsx`

**Features**:
- Project list (grid + table views)
- Filter by status (active, on-hold, completed)
- Project health scores
- Milestones timeline
- Team members
- Risk indicators

**Components to create**:
```tsx
// src/components/personal/projects/ProjectList.tsx
// src/components/personal/projects/ProjectCard.tsx
// src/components/personal/projects/ProjectTable.tsx
// src/components/personal/projects/MilestonesTimeline.tsx
// src/components/personal/projects/ProjectFilters.tsx
```

**API calls**:
```typescript
GET /api/projects?context=personal&scope={owner_id}
GET /api/projects/:id
POST /api/projects (create)
PATCH /api/projects/:id (update)
DELETE /api/projects/:id
```

**L2 triggers**:
- Click health score → opens Evidence Drawer with score breakdown
- Click risk indicator → opens Think Panel with risk analysis

---

### Module 3: Accounts

**File**: `src/app/(app)/personal/accounts/page.tsx`

**Features**:
- Account list (personal accounts assigned to user)
- Account health scores (from CustomerHealthScore accelerator)
- Filter by segment, region, health
- Quick stats (ARR, renewal date, tickets)
- Recent activity
- Churn risk indicators

**Components to create**:
```tsx
// src/components/personal/accounts/AccountList.tsx
// src/components/personal/accounts/AccountCard.tsx
// src/components/personal/accounts/AccountFilters.tsx
// src/components/personal/accounts/HealthScoreBadge.tsx
// src/components/personal/accounts/ChurnRiskIndicator.tsx
```

**API calls**:
```typescript
GET /api/accounts?context=personal&scope={owner_id}
GET /api/accounts/:id
GET /api/ai/insights/health/:accountId (from accelerator)
```

**L2 triggers**:
- Click account health → Evidence Drawer (shows Spine + Context + Knowledge sources)
- Click churn risk → Think Panel (shows reasoning graph)

---

### Module 4: Contacts

**File**: `src/app/(app)/personal/contacts/page.tsx`

**Features**:
- Contact list (grid + table views)
- Org chart view (hierarchical)
- Filter by account, role, engagement
- Last interaction timestamp
- Contact health (engagement score)
- Communication history

**Components to create**:
```tsx
// src/components/personal/contacts/ContactList.tsx
// src/components/personal/contacts/ContactCard.tsx
// src/components/personal/contacts/OrgChartView.tsx
// src/components/personal/contacts/ContactFilters.tsx
// src/components/personal/contacts/EngagementScore.tsx
```

**API calls**:
```typescript
GET /api/contacts?context=personal&scope={owner_id}
GET /api/contacts/:id
GET /api/contacts/:id/org-chart
GET /api/contacts/:id/history
```

**L2 triggers**:
- Click engagement score → Evidence Drawer (meeting history, email cadence, support tickets)

---

### Module 5: Meetings

**File**: `src/app/(app)/personal/meetings/page.tsx`

**Features**:
- Upcoming meetings (next 7 days)
- Past meetings (with transcripts)
- Meeting types (1:1, QBR, standup, etc.)
- Auto-generated summaries
- Action items extracted
- Attendance tracking

**Components to create**:
```tsx
// src/components/personal/meetings/MeetingList.tsx
// src/components/personal/meetings/MeetingCard.tsx
// src/components/personal/meetings/MeetingFilters.tsx
// src/components/personal/meetings/TranscriptViewer.tsx
// src/components/personal/meetings/ActionItemsExtracted.tsx
```

**API calls**:
```typescript
GET /api/meetings?context=personal&scope={owner_id}
GET /api/meetings/:id
GET /api/meetings/:id/transcript
GET /api/meetings/:id/summary
GET /api/meetings/:id/action-items
```

**L2 triggers**:
- Click meeting → Evidence Drawer (transcript + summary + extracted facts)
- Click "How was this summarized?" → Think Panel (shows AI reasoning)

---

### Module 6: Docs

**File**: `src/app/(app)/personal/docs/page.tsx`

**Features**:
- Document library (files + versions)
- Filter by type (PDF, DOCX, TXT, etc.)
- OCR status (processed, pending)
- Full-text search
- Document preview
- Entity linkage (which accounts/projects reference this doc)

**Components to create**:
```tsx
// src/components/personal/docs/DocList.tsx
// src/components/personal/docs/DocCard.tsx
// src/components/personal/docs/DocFilters.tsx
// src/components/personal/docs/DocPreview.tsx
// src/components/personal/docs/EntityLinks.tsx
```

**API calls**:
```typescript
GET /api/docs?context=personal&scope={owner_id}
GET /api/docs/:id
GET /api/docs/:id/preview
GET /api/docs/:id/ocr-status
GET /api/docs/:id/linked-entities
POST /api/docs/upload
```

**L2 triggers**:
- Click doc → Evidence Drawer (extracted entities, OCR results, references)

---

### Module 7: Tasks

**File**: `src/app/(app)/personal/tasks/page.tsx` (already exists)

**Enhance**:
- Task list (today, upcoming, overdue)
- Filter by priority, status, assignee
- Playbook automation (auto-generate tasks from playbooks)
- Dependencies
- Time tracking

**Components to create**:
```tsx
// src/components/personal/tasks/TaskList.tsx
// src/components/personal/tasks/TaskCard.tsx
// src/components/personal/tasks/TaskFilters.tsx
// src/components/personal/tasks/PlaybookTasks.tsx
// src/components/personal/tasks/DependencyGraph.tsx
```

**API calls**:
```typescript
GET /api/tasks?context=personal&scope={owner_id}
GET /api/tasks/:id
POST /api/tasks (create)
PATCH /api/tasks/:id (update status)
DELETE /api/tasks/:id
```

**L2 triggers**:
- Click playbook task → Evidence Drawer (shows playbook definition + trigger conditions)

---

### Module 8: Calendar

**File**: `src/app/(app)/personal/calendar/page.tsx`

**Features**:
- Calendar view (day, week, month)
- Events from connected tools (Google Calendar, Outlook)
- Renewal reminders
- Launch dates
- Sync status

**Components to create**:
```tsx
// src/components/personal/calendar/CalendarView.tsx
// src/components/personal/calendar/DayView.tsx
// src/components/personal/calendar/WeekView.tsx
// src/components/personal/calendar/MonthView.tsx
// src/components/personal/calendar/EventCard.tsx
```

**API calls**:
```typescript
GET /api/calendar?context=personal&scope={owner_id}&start={date}&end={date}
GET /api/calendar/sync-status
POST /api/calendar/sync
```

**L2 triggers**:
- Click event → Evidence Drawer (event details + linked entities)

---

### Module 9: Notes

**File**: `src/app/(app)/personal/notes/page.tsx`

**Features**:
- Note list (grid + table)
- Rich text editor
- Markdown support
- Entity linking (@mention accounts, projects)
- Tags/categories
- Search

**Components to create**:
```tsx
// src/components/personal/notes/NoteList.tsx
// src/components/personal/notes/NoteCard.tsx
// src/components/personal/notes/NoteEditor.tsx
// src/components/personal/notes/EntityMentions.tsx
// src/components/personal/notes/NoteFilters.tsx
```

**API calls**:
```typescript
GET /api/notes?context=personal&scope={owner_id}
GET /api/notes/:id
POST /api/notes (create)
PATCH /api/notes/:id (update)
DELETE /api/notes/:id
```

**L2 triggers**:
- Click note → Evidence Drawer (shows linked entities + references)

---

### Module 10: Knowledge Hub

**File**: `src/app/(app)/personal/knowledge/page.tsx`

**Features**:
- Knowledge base articles
- Topic spaces (organized by domain)
- Search (semantic + full-text)
- Chunk retrieval
- Summaries
- References

**Components to create**:
```tsx
// src/components/personal/knowledge/KnowledgeList.tsx
// src/components/personal/knowledge/TopicSpaces.tsx
// src/components/personal/knowledge/SearchBar.tsx
// src/components/personal/knowledge/ArticleViewer.tsx
// src/components/personal/knowledge/ChunkHighlights.tsx
```

**API calls**:
```typescript
GET /api/knowledge?context=personal&scope={owner_id}
GET /api/knowledge/:id
GET /api/knowledge/search?q={query}
GET /api/knowledge/topics
GET /api/knowledge/:id/chunks
```

**L2 triggers**:
- Click article → Evidence Drawer (shows sources + chunk provenance)
- Click search result → Think Panel (shows relevance reasoning)

---

### Module 11: Team

**File**: `src/app/(app)/personal/team/page.tsx`

**Features**:
- Team directory
- Org chart
- Coverage map (who owns which accounts)
- Team health
- Workload distribution

**Components to create**:
```tsx
// src/components/personal/team/TeamDirectory.tsx
// src/components/personal/team/OrgChart.tsx
// src/components/personal/team/CoverageMap.tsx
// src/components/personal/team/TeamHealthMetrics.tsx
// src/components/personal/team/WorkloadChart.tsx
```

**API calls**:
```typescript
GET /api/team?context=personal&scope={team_id}
GET /api/team/org-chart
GET /api/team/coverage
GET /api/team/health
```

**L2 triggers**:
- Click team member → Evidence Drawer (accounts owned, recent activity)

---

### Module 12: Pipeline

**File**: `src/app/(app)/personal/pipeline/page.tsx`

**Features**:
- Deal/opportunity list
- Pipeline stages (qualify, demo, negotiate, close)
- Forecast
- Renewal pipeline
- Velocity metrics (from PipelineVelocity accelerator)

**Components to create**:
```tsx
// src/components/personal/pipeline/PipelineView.tsx
// src/components/personal/pipeline/DealCard.tsx
// src/components/personal/pipeline/StageColumn.tsx
// src/components/personal/pipeline/ForecastChart.tsx
// src/components/personal/pipeline/VelocityMetrics.tsx
```

**API calls**:
```typescript
GET /api/pipeline?context=personal&scope={owner_id}
GET /api/pipeline/:id
GET /api/ai/insights/velocity (from accelerator)
GET /api/pipeline/forecast
```

**L2 triggers**:
- Click deal → Evidence Drawer (deal history, stakeholder meetings, docs)
- Click velocity metric → Think Panel (shows velocity calculation)

---

### Module 13: Risks

**File**: `src/app/(app)/personal/risks/page.tsx`

**Features**:
- Risk register
- Risk score (from accelerators)
- Filter by severity, type (churn, technical, commercial)
- Mitigation actions
- Escalation tracking

**Components to create**:
```tsx
// src/components/personal/risks/RiskList.tsx
// src/components/personal/risks/RiskCard.tsx
// src/components/personal/risks/RiskFilters.tsx
// src/components/personal/risks/SeverityBadge.tsx
// src/components/personal/risks/MitigationActions.tsx
```

**API calls**:
```typescript
GET /api/risks?context=personal&scope={owner_id}
GET /api/risks/:id
GET /api/ai/insights/churn/:accountId (from accelerator)
POST /api/risks/escalate
```

**L2 triggers**:
- Click risk → Evidence Drawer (shows signals contributing to risk)
- Click "Why this score?" → Think Panel (shows risk calculation)

---

### Module 14: Expansion

**File**: `src/app/(app)/personal/expansion/page.tsx`

**Features**:
- Expansion opportunities
- Adoption metrics
- Growth initiatives
- Cross-sell/upsell recommendations
- Engagement trends

**Components to create**:
```tsx
// src/components/personal/expansion/ExpansionList.tsx
// src/components/personal/expansion/OpportunityCard.tsx
// src/components/personal/expansion/AdoptionChart.tsx
// src/components/personal/expansion/GrowthInitiatives.tsx
// src/components/personal/expansion/Recommendations.tsx
```

**API calls**:
```typescript
GET /api/expansion?context=personal&scope={owner_id}
GET /api/expansion/:accountId/opportunities
GET /api/expansion/:accountId/adoption
GET /api/ai/insights/expansion/:accountId
```

**L2 triggers**:
- Click opportunity → Evidence Drawer (usage data, feature adoption, stakeholder feedback)
- Click recommendation → Think Panel (shows recommendation reasoning)

---

### Module 15: Analytics

**File**: `src/app/(app)/personal/analytics/page.tsx`

**Features**:
- Personal metrics dashboard
- Configurable widgets
- Time series charts
- KPIs (tasks completed, meetings held, accounts managed)
- Trend analysis

**Components to create**:
```tsx
// src/components/personal/analytics/AnalyticsDashboard.tsx
// src/components/personal/analytics/WidgetGrid.tsx
// src/components/personal/analytics/WidgetCard.tsx
// src/components/personal/analytics/TimeSeriesChart.tsx
// src/components/personal/analytics/KPIMetrics.tsx
```

**API calls**:
```typescript
GET /api/analytics/personal/metrics?context=personal&scope={owner_id}
GET /api/analytics/personal/kpis
GET /api/analytics/personal/trends?start={date}&end={date}
```

**L2 triggers**:
- Click any metric → Evidence Drawer (shows calculation sources)

---

## Phase 2: Cognitive Layer (L2) - 12 Components

### Component 1: Cognitive Layer Container

**File**: `src/components/cognitive/CognitiveLayer.tsx`

**Purpose**: Main container that slides up from bottom, hosts all L2 tabs

**Features**:
- Sheet component (bottom side, 80vh height)
- Tab navigation (Evidence, Think, Act, Approve, Audit)
- Context state management
- Event listener for `iw:evidence:open`
- Global shortcut (Cmd+E to toggle)

**Implementation**:
```tsx
'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { EvidencePanel } from './EvidencePanel'
import { ThinkPanel } from './ThinkPanel'
import { ActPanel } from './ActPanel'
import { HITLModal } from './HITLModal'
import { AuditPanel } from './AuditPanel'

interface CognitiveContext {
  entityId?: string
  entityType?: string
  situationId?: string
  context: string
  scope: Record<string, any>
}

export function CognitiveLayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [ctx, setCtx] = useState<CognitiveContext | null>(null)
  const [activeTab, setActiveTab] = useState('evidence')

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setCtx(e.detail)
      setIsOpen(true)
      setActiveTab('evidence')
    }
    window.addEventListener('iw:evidence:open', handler as EventListener)
    return () => window.removeEventListener('iw:evidence:open', handler as EventListener)
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] rounded-t-2xl bg-slate-950 text-slate-50 border-slate-800"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl">Cognitive Intelligence Layer</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-slate-900">
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="think">Think</TabsTrigger>
            <TabsTrigger value="act">Act</TabsTrigger>
            <TabsTrigger value="approve">Approve</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="evidence" className="h-[60vh]">
            <EvidencePanel context={ctx} />
          </TabsContent>

          <TabsContent value="think" className="h-[60vh]">
            <ThinkPanel context={ctx} />
          </TabsContent>

          <TabsContent value="act" className="h-[60vh]">
            <ActPanel context={ctx} />
          </TabsContent>

          <TabsContent value="approve" className="h-[60vh]">
            <HITLModal context={ctx} />
          </TabsContent>

          <TabsContent value="audit" className="h-[60vh]">
            <AuditPanel context={ctx} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
```

**Add to root layout**:
```tsx
// src/app/layout.tsx or src/app/(app)/layout.tsx
import { CognitiveLayer } from '@/components/cognitive/CognitiveLayer'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <CognitiveLayer />
    </>
  )
}
```

---

### Component 2: Evidence Panel

**File**: `src/components/cognitive/EvidencePanel.tsx`

**Purpose**: Shows timeline of evidence sources (Spine + Context + Knowledge)

**Features**:
- Timeline view
- Grouped by source plane (structured, unstructured, chat)
- Trust level badges
- Source links
- Provenance chain

**API calls**:
```typescript
GET /api/evidence/:entityId?context={context}&scope={scope}
```

---

### Component 3: Think Panel

**File**: `src/components/cognitive/ThinkPanel.tsx`

**Purpose**: Shows AI reasoning graph and scoring logic

**Features**:
- Reasoning chain visualization
- Scoring breakdown
- Context graph
- Signal contributors
- Model confidence

**API calls**:
```typescript
POST /api/ai/insights/explain
{
  "entityId": "account_123",
  "metricType": "health_score",
  "context": "csm",
  "scope": {...}
}
```

---

### Component 4: Act Panel

**File**: `src/components/cognitive/ActPanel.tsx`

**Purpose**: Shows proposed agent workflows and actions

**Features**:
- Proposed actions list
- Workflow definitions
- Impact preview
- Resource requirements
- Scheduling options

**API calls**:
```typescript
POST /api/agent/propose
{
  "entityId": "account_123",
  "situationId": "sit_456",
  "context": "csm",
  "scope": {...}
}
```

---

### Component 5: HITL Modal

**File**: `src/components/cognitive/HITLModal.tsx`

**Purpose**: Human-in-loop approval interface

**Features**:
- Action preview
- Risk assessment
- Approve/Reject/Modify buttons
- Modification interface
- Reason textarea

**API calls**:
```typescript
POST /api/approval/submit
{
  "workflowId": "wf_789",
  "action": "approve" | "reject" | "modify",
  "reason": "...",
  "modifications": {...}
}
```

---

### Component 6: Audit Panel

**File**: `src/components/cognitive/AuditPanel.tsx`

**Purpose**: Immutable audit trail viewer

**Features**:
- Timeline of all changes
- Who/what/when/why
- Diff view
- Export capability
- Filter by action type

**API calls**:
```typescript
GET /api/audit/:entityId?context={context}&scope={scope}
```

---

### Component 7-12: Additional L2 Components

- **SpinePanel**: SSOT entity viewer
- **ContextPanel**: Unstructured data browser
- **KnowledgePanel**: Knowledge chunk viewer
- **GovernPanel**: Policy/RBAC viewer
- **AdjustPanel**: Correction interface
- **AgentConfigPanel**: Agent registry settings

---

## Phase 3: Context-Specific Views

### Business View (`src/app/(app)/business/*`)

Copy personal view modules, adapt:
- Home → Strategic Hub
- Accounts → Portfolio View
- Projects → Initiatives
- Analytics → Business Metrics

### CS View (`src/app/(app)/cs/*`)

Copy personal view modules, adapt:
- Home → CS Dashboard
- Accounts → Account 360
- Risks → Account Risks + Escalations
- Analytics → CS Analytics

### Sales View (`src/app/(app)/sales/*`)

Focus on pipeline:
- Home → Sales Dashboard
- Pipeline → Deal Flow
- Accounts → Sales Accounts
- Forecast → Revenue Forecast

### Marketing View (`src/app/(app)/marketing/*`)

Focus on campaigns:
- Home → Marketing Dashboard
- Campaigns → Campaign Manager
- Analytics → Attribution (from MarketingAttribution accelerator)
- Expansion → Growth Opportunities

### Operations View (`src/app/(app)/operations/*`)

Focus on execution:
- Home → Ops Dashboard
- Tasks → Ops Tasks
- Risks → Operational Risks
- Analytics → Ops Metrics

---

## Phase 4: Integration Testing

### Test Scenarios

1. **L1 → L2 Flow**:
   - User clicks "View Evidence" in Accounts view
   - L2 Evidence Drawer slides up
   - Shows Spine + Context + Knowledge sources
   - User clicks "Think" tab
   - Shows reasoning graph
   - User closes L2, returns to L1

2. **AI Action Approval**:
   - Accelerator detects churn risk
   - Signal appears in L1 Home
   - User clicks signal
   - L2 opens to Evidence
   - User clicks "Act" tab
   - Proposed action: "Schedule QBR"
   - User clicks "Approve"
   - HITL Modal opens
   - User confirms
   - Action executes
   - L1 refreshes with new task

3. **Context Switch**:
   - User in Personal context
   - Switches to CS context (via context picker)
   - L1 views re-render with CS data
   - L2 maintains same UI, different data

---

## Next Steps

1. **Start with Personal Home** (`src/app/(app)/personal/home/page.tsx`)
2. **Create basic components** (TodaysTimeline, SignalFeed)
3. **Wire to mock API** (static data first)
4. **Add L2 Evidence Drawer trigger**
5. **Test flow**: Signal → Evidence → Think → Act
6. **Repeat for remaining 14 modules**
7. **Build L2 components** (Think, Act, HITL)
8. **Connect to real L3 APIs**
9. **Add context switching**
10. **Implement remaining contexts** (Business, CS, Sales, Marketing, Ops)

---

## Completion Criteria

- ✅ All 15 Personal View modules functional
- ✅ All 12 L2 components functional
- ✅ Evidence chain wired (Accelerators → Signals → Think → Act → HITL)
- ✅ Audit trail captures all actions
- ✅ Context switching works
- ✅ RBAC enforced at API Gateway
- ✅ All views wire to L3 APIs
- ✅ L2 slides up from bottom cleanly
- ✅ Human approval gate functional
