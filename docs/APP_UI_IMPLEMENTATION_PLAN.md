# App UI Implementation Plan (app.integratewise.ai)

## Scope
- **NO landing pages** → Webflow handles marketing
- **START from**: app.integratewise.ai (authenticated app)
- **Focus**: L0 Onboarding → L1 Workspace → L2 Cognitive

---

## Phase 1: L0 Onboarding (Days 1-2)

### Current State

**Next.js**: Basic 4-step (Identity → Context → Connect → Spine)
**Vite**: Rich 4-step (Role-Domain → Integration → Upload → Accelerator)

### Target: Unified 5-Step Onboarding

```
Step 1: Identity + AI Insights (from Vite design)
Step 2: Role & Domain Selection (from Vite - 10 domains)
Step 3: Tool Connect (from Next.js backend + Vite UI)
Step 4: Data Upload (from Vite)
Step 5: Accelerator Selection (from Vite)
→ Loader Phase 1 → Workspace
```

### Implementation

#### 1.1 Create Onboarding Structure

```
apps/web/src/app/onboarding/
├── page.tsx                    # Entry point
├── layout.tsx                  # Onboarding layout
└── components/
    ├── OnboardingShell.tsx     # Shell with progress
    ├── steps/
    │   ├── Step1_Identity.tsx      # Name + AI personality
    │   ├── Step2_Domain.tsx        # Role-domain selection
    │   ├── Step3_Connect.tsx       # Tool connectors
    │   ├── Step4_Upload.tsx        # File upload
    │   └── Step5_Accelerator.tsx   # Accelerator selection
    └── shared/
        ├── ProgressBar.tsx
        ├── AIInsightCard.tsx
        └── ToolCard.tsx
```

#### 1.2 Step 1: Identity + AI Insights

```typescript
// Step 1: Name input + AI generates insights
const [userName, setUserName] = useState('');
const [insights, setInsights] = useState(null);

// On name input, call AI API
useEffect(() => {
  if (userName.length > 3) {
    generateInsights(userName).then(setInsights);
  }
}, [userName]);

// Display: "Working Style", "Strengths", "Growth Areas"
```

#### 1.3 Step 2: Role & Domain (from Vite)

10 Domains with icons:
- Customer Success (#10B981)
- Sales (#0EA5E9)
- Revenue Operations (#8B5CF6)
- Marketing (#EC4899)
- Product & Engineering (#6366F1)
- Finance (#14B8A6)
- Customer Service (#F59E0B)
- Procurement (#84CC16)
- IT & Admin (#64748B)
- Student / Teacher (#F97316)

#### 1.4 Step 3: Tool Connect

Categories:
- **CRM**: Salesforce, HubSpot, Pipedrive
- **Task**: Jira, Asana, Monday
- **Workspace**: Notion, Slack, Teams

OAuth flow integration from Next.js backend.

#### 1.5 Step 4: File Upload

- Drag & drop zone
- Supported: Markdown, Doc, Txt, CSV (2-10MB)
- Preview before upload
- Progress indicator

#### 1.6 Step 5: Accelerator Selection

Department-specific accelerators:
- Customer Health Score
- Churn Prediction
- Revenue Forecaster
- Pipeline Velocity
- Support Health
- Marketing Attribution

Payment-gated (if applicable).

---

## Phase 2: L1 Workspace Shell (Day 3)

### App Shell Components

```
apps/web/src/components/workspace/
├── WorkspaceShell.tsx          # Main layout
├── Sidebar.tsx                 # Navigation
├── TopBar.tsx                  # Header
├── CommandPalette.tsx          # CMD+K search
├── IntelligenceDrawer.tsx      # L2 slide-out
└── HydrationIndicator.tsx      # Data loading state
```

### Navigation Structure

```typescript
const NAV_ITEMS = {
  personal: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'risks', label: 'Risks', icon: AlertTriangle },
    { id: 'expansion', label: 'Expansion', icon: Rocket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ],
  cs: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'health', label: 'Health', icon: HeartPulse },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'renewals', label: 'Renewals', icon: RefreshCw },
    { id: 'success-plans', label: 'Success Plans', icon: Target },
    // ... + standard items
  ],
  // ... other domains
};
```

### Domain-Based Routing

```typescript
// URL: app.integratewise.ai/cs/home
// URL: app.integratewise.ai/sales/pipeline
// URL: app.integratewise.ai/personal/tasks

const domain = params.domain; // cs, sales, personal, etc.
const module = params.module; // home, tasks, etc.
```

---

## Phase 3: L1 Module Views (Days 4-5)

### Common Module Structure

Each L1 module follows this pattern:

```typescript
interface L1ModuleProps {
  tenantId: string;
  userId: string;
  domain: Domain;
  role: UserRole;
}

// Module layout
<ModuleShell>
  <ModuleHeader title="Tasks" actions={[...]} />
  <ModuleContent>
    <DataGrid />           // Primary data view
    <IntelligencePanel />  // L2 insights
  </ModuleContent>
</ModuleShell>
```

### Module: Home (Dashboard)

Components:
- Welcome header
- Today's priorities
- Pending approvals
- Recent signals
- Quick actions
- Goal progress

### Module: Tasks

Components:
- Task list (Kanban/Table)
- Filters (Due date, Priority, Assignee)
- Create task
- Bulk actions
- L2: Task recommendations

### Module: Accounts (CS)

Components:
- Account list
- Health score badges
- Risk indicators
- Quick filters
- Account detail drawer

### Module: Pipeline (Sales)

Components:
- Deal stages
- Pipeline velocity
- Win rate
- Revenue forecast
- L2: Deal recommendations

---

## Phase 4: L2 Cognitive Layer (Days 6-7)

### L2 Components Integration

```
apps/web/src/components/cognitive/
├── SpineUI/                    # Canonical data view
├── ContextUI/                  # Unstructured content
├── KnowledgeUI/                # Knowledge graph
├── Evidence/                   # Evidence compiler
├── Signals/                    # Signal detector
├── Think/                      # Situation assessor
├── Act/                        # Action executor
├── HITL/                       # Approval gate
├── Govern/                     # Policy enforcement
├── Adjust/                     # Feedback loop
├── Repeat/                     # Cycle driver
├── AuditUI/                    # Audit trail
├── AgentConfig/                # Agent settings
└── DigitalTwin/                # Simulation
```

### Intelligence Drawer (Slide-out)

```typescript
// Slide-out panel for L2 insights
<IntelligenceDrawer>
  <Tabs>
    <Tab id="signals">Signals</Tab>
    <Tab id="think">Think</Tab>
    <Tab id="evidence">Evidence</Tab>
  </Tabs>
  
  <SignalsPanel>
    <SignalCard
      title="Account Risk Detected"
      severity="high"
      evidence={...}
      action={...}
    />
  </SignalsPanel>
</IntelligenceDrawer>
```

### HITL: Human-in-the-Loop

```typescript
// Approval workflow
<HITLGate>
  <ProposalCard
    type="action"
    title="Send renewal reminder"
    description="Acme Corp contract expires in 30 days"
    evidence={evidenceList}
    onApprove={handleApprove}
    onReject={handleReject}
    onModify={handleModify}
  />
</HITLGate>
```

---

## Phase 5: Theme & Polish (Day 8)

### Design System

```css
/* Brand Colors */
--iw-navy: #2D4A7C;
--iw-navy-light: #4A6A9C;
--iw-emerald: #10B981;
--iw-blue: #0EA5E9;

/* Domain Colors */
--cs: #10B981;
--sales: #0EA5E9;
--revops: #8B5CF6;
--marketing: #EC4899;

/* Intelligence Colors */
--signal-critical: #ef4444;
--signal-warning: #f59e0b;
--signal-info: #3b82f6;
--signal-success: #10b981;
```

### Fonts

```typescript
// Plus Jakarta Sans for UI
// JetBrains Mono for code/data
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
```

### Animations

- Page transitions: 0.3s ease-out
- Drawer slide: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
- Toast notifications: 0.4s spring
- Loading states: Skeleton shimmer

---

## Phase 6: Testing & Deployment (Day 9-10)

### Test Checklist

- [ ] Onboarding completes successfully
- [ ] All 10 domains selectable
- [ ] OAuth connectors work
- [ ] File upload works
- [ ] Loader transitions to workspace
- [ ] All 15 L1 modules load
- [ ] L2 drawer opens/closes smoothly
- [ ] HITL approvals work
- [ ] RBAC restricts access
- [ ] Multi-tenant isolation works
- [ ] Dark mode works
- [ ] Mobile responsive

### Deployment

```bash
# Deploy to Cloudflare Pages
pnpm deploy:web

# Or Vercel
vercel --prod
```

---

## File Structure (Target)

```
apps/web/
├── src/
│   ├── app/
│   │   ├── onboarding/           # L0
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/                # L1-L2 (authenticated)
│   │   │   ├── [domain]/
│   │   │   │   ├── home/
│   │   │   │   ├── today/
│   │   │   │   ├── tasks/
│   │   │   │   ├── accounts/
│   │   │   │   ├── contacts/
│   │   │   │   ├── meetings/
│   │   │   │   ├── docs/
│   │   │   │   ├── calendar/
│   │   │   │   ├── notes/
│   │   │   │   ├── knowledge/
│   │   │   │   ├── team/
│   │   │   │   ├── pipeline/
│   │   │   │   ├── risks/
│   │   │   │   ├── expansion/
│   │   │   │   └── analytics/
│   │   │   ├── spine/            # L2
│   │   │   ├── context/          # L2
│   │   │   ├── iq-hub/           # L2
│   │   │   ├── evidence/         # L2
│   │   │   ├── signals/          # L2
│   │   │   ├── think/            # L2
│   │   │   ├── act/              # L2
│   │   │   ├── govern/           # L2
│   │   │   ├── adjust/           # L2
│   │   │   ├── repeat/           # L2
│   │   │   ├── audit/            # L2
│   │   │   └── layout.tsx
│   │   └── api/                  # Backend API
│   ├── components/
│   │   ├── onboarding/           # L0 components
│   │   ├── workspace/            # L1 shell
│   │   ├── modules/              # L1 modules
│   │   ├── cognitive/            # L2 components
│   │   └── ui/                   # shadcn/ui
│   ├── hooks/                    # React hooks
│   ├── lib/                      # Utilities
│   └── types/                    # TypeScript types
```

---

## Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| L0 Onboarding | Days 1-2 | 5-step rich onboarding |
| L1 Shell | Day 3 | App layout, navigation |
| L1 Modules | Days 4-5 | 15 workspace modules |
| L2 Cognitive | Days 6-7 | Intelligence layer |
| Polish | Day 8 | Theme, animations |
| Testing | Days 9-10 | Deploy to production |

**Total: 2 weeks for complete app UI**
