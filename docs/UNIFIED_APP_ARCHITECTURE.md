# Unified App Architecture

## Goal
Bring all domain-specific components together into a single **Universal Hub Shell**.

**Ignore**: Landing pages (Webflow handles marketing)  
**Focus**: App UI components from all domains

---

## Current Domain Inventory

### Domains Available (5)

| Domain | Location | Views/Components |
|--------|----------|------------------|
| **Account Success** | `domains/account-success/` | 17 specialized views |
| **RevOps** | `domains/revops/` | Dashboard + views |
| **SalesOps** | `domains/salesops/` | Dashboard + views |
| **Personal** | `domains/personal/` | Dashboard + views |
| **IntegrateWise APAC** | Console view | Admin console |

### L1 Module Components (Non-Domain)

| Module | Location | Components |
|--------|----------|------------|
| **Business Ops** | `business-ops/` | Dashboard, Accounts, Tasks, Calendar, Docs, Workflows, Integrations |
| **Marketing** | `marketing/` | Dashboard, Campaigns, Attribution, Forms, Email Studio, Social |
| **Sales** | `sales/` | Dashboard, Pipeline, Deals, Contacts, Activities, Quotes, Forecasting |

### Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Sidebar** | `sidebar.tsx` | Main navigation (256px) |
| **TopBar** | `top-bar.tsx` | Header with search, notifications |
| **CommandPalette** | `command-palette.tsx` | CMD+K search |
| **IntelligenceDrawer** | `intelligence-drawer.tsx` | L2 AI overlay |
| **WorkspaceShell** | `workspace-shell.tsx` | App container |
| **DashboardShell** | `DashboardShell.tsx` | Alternative shell |

---

## Unified Architecture

### Single-Shell Design

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                  │
│  [Toggle] [Breadcrumb: Domain > View]  [Search] [🔔] [👤]        │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ SIDEBAR  │           CONTENT AREA (Dynamic)                     │
│ (240px)  │                                                      │
│          │  ┌────────────────────────────────────────────────┐  │
│ • Logo   │  │                                                │  │
│ • Home   │  │  Domain-Specific View                         │  │
│ • Domain │  │  (17 Account Success views OR                 │  │
│ • L2 AI  │  │   Marketing Dashboard OR                      │  │
│ • Admin  │  │   Sales Pipeline, etc.)                       │  │
│          │  │                                                │  │
│ [⚙️]     │  └────────────────────────────────────────────────┘  │
│ [👤]     │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
                           │
              ┌────────────┘
              │
    ┌─────────▼─────────┐
    │ INTELLIGENCE      │
    │ DRAWER (400px)    │
    │ (L2 Cognitive)    │
    └───────────────────┘
```

---

## Domain Unification Strategy

### Option 1: Domain Deep Dive (V2 Approach)

**Best for**: Complex domains with many specialized views

**Structure**:
```
app/(app)/
├── [domain]/
│   ├── page.tsx              # Domain dashboard
│   └── [view]/
│       └── page.tsx          # Specific views
```

**URL Pattern**:
- `app.integratewise.ai/account-success` → Dashboard
- `app.integratewise.ai/account-success/account-master` → Account Master View
- `app.integratewise.ai/account-success/risk-register` → Risk Register

**Used By**: Account Success (17 views), RevOps, SalesOps

---

### Option 2: Module-Based (L1 Modules)

**Best for**: Standard modules across all domains

**Structure**:
```
app/(app)/
├── [domain]/
│   ├── page.tsx              # Domain home
│   ├── tasks/page.tsx        # Tasks (unified)
│   ├── calendar/page.tsx     # Calendar (unified)
│   ├── docs/page.tsx         # Docs (unified)
│   └── ...
```

**URL Pattern**:
- `app.integratewise.ai/personal` → Personal Home
- `app.integratewise.ai/personal/tasks` → Personal Tasks
- `app.integratewise.ai/cs/tasks` → CS Tasks (filtered)

**Used By**: Personal, Business Ops

---

### Option 3: Hybrid (Recommended)

**Combine both approaches**:

```
app/(app)/
├── page.tsx                  # Universal Hub Home
│
├── personal/
│   ├── page.tsx              # Personal Dashboard
│   ├── tasks/page.tsx        # Unified Tasks
│   ├── calendar/page.tsx     # Unified Calendar
│   └── notes/page.tsx        # Personal Notes
│
├── cs/                       # Customer Success
│   ├── page.tsx              # CS Dashboard
│   ├── customers/page.tsx    # Customer List
│   ├── health/page.tsx       # Health Scores
│   ├── tickets/page.tsx      # Support Tickets
│   └── deep/                 # Deep Dive Views
│       ├── account-master/page.tsx
│       ├── risk-register/page.tsx
│       └── ... (15 more)
│
├── sales/                    # Sales
│   ├── page.tsx              # Sales Dashboard
│   ├── pipeline/page.tsx     # Pipeline
│   ├── deals/page.tsx        # Deals
│   └── deep/                 # Deep Dive
│       ├── deal-rooms/page.tsx
│       └── ...
│
├── marketing/                # Marketing
│   ├── page.tsx              # Marketing Dashboard
│   ├── campaigns/page.tsx    # Campaigns
│   └── deep/
│       └── attribution/page.tsx
│
├── revops/                   # Revenue Ops
│   ├── page.tsx              # RevOps Dashboard
│   └── deep/
│       ├── forecasting/page.tsx
│       └── quota/page.tsx
│
└── admin/                    # Admin Console
    ├── users/page.tsx
    ├── roles/page.tsx
    ├── connectors/page.tsx
    └── ...
```

---

## Component Mapping

### Unified Task Component

**Used across**: Personal, CS, Sales, Marketing

```typescript
// components/modules/TaskView.tsx
interface TaskViewProps {
  domain: 'personal' | 'cs' | 'sales' | 'marketing';
  filters?: TaskFilters;
  showAIInsights?: boolean;
}

// Personal: My tasks, no AI
// CS: Account-related tasks, health context
// Sales: Deal-related tasks, pipeline context
// Marketing: Campaign tasks, attribution context
```

### Unified Calendar Component

```typescript
// components/modules/CalendarView.tsx
interface CalendarViewProps {
  domain: 'personal' | 'cs' | 'sales';
  contextData?: any; // Domain-specific context
}
```

### Domain-Specific Views (Account Success)

```typescript
// app/(app)/cs/deep/account-master/page.tsx
import { AccountMasterView } from '@/components/domains/account-success/views/account-master-view';

export default function AccountMasterPage() {
  return <AccountMasterView />;
}
```

---

## Navigation Structure

### Main Sidebar (All Domains)

```typescript
const MAIN_NAV = {
  common: [
    { id: 'home', label: 'Home', icon: Home, href: '/{domain}' },
    { id: 'today', label: 'Today', icon: Calendar, href: '/{domain}/today' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/{domain}/tasks' },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, href: '/{domain}/calendar' },
    { id: 'docs', label: 'Docs', icon: FileText, href: '/{domain}/docs' },
  ],
  cs: [
    { id: 'customers', label: 'Customers', icon: Building2, href: '/cs/customers' },
    { id: 'health', label: 'Health', icon: HeartPulse, href: '/cs/health' },
    { id: 'tickets', label: 'Tickets', icon: Ticket, href: '/cs/tickets' },
    { id: 'deep', label: 'Deep Dive', icon: Layers, href: '/cs/deep' },
  ],
  sales: [
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp, href: '/sales/pipeline' },
    { id: 'deals', label: 'Deals', icon: DollarSign, href: '/sales/deals' },
    { id: 'contacts', label: 'Contacts', icon: Users, href: '/sales/contacts' },
    { id: 'deep', label: 'Deep Dive', icon: Layers, href: '/sales/deep' },
  ],
  marketing: [
    { id: 'campaigns', label: 'Campaigns', icon: Target, href: '/marketing/campaigns' },
    { id: 'attribution', label: 'Attribution', icon: PieChart, href: '/marketing/attribution' },
    { id: 'deep', label: 'Deep Dive', icon: Layers, href: '/marketing/deep' },
  ],
  system: [
    { id: 'ai', label: 'AI Assistant', icon: Brain, href: '/ai', separator: true },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ]
};
```

### Deep Dive Sidebar (Domain-Specific)

```typescript
// Only shows when in /cs/deep/*
const CS_DEEP_NAV = [
  { id: 'account-master', label: 'Account Master', href: '/cs/deep/account-master' },
  { id: 'business-context', label: 'Business Context', href: '/cs/deep/business-context' },
  { id: 'risk-register', label: 'Risk Register', href: '/cs/deep/risk-register' },
  { id: 'success-plans', label: 'Success Plans', href: '/cs/deep/success-plans' },
  { id: 'engagement-log', label: 'Engagement Log', href: '/cs/deep/engagement-log' },
  // ... 12 more
];
```

---

## Data Flow

### Spine Projection per Domain

```typescript
// lib/spine/projections.ts
const PROJECTIONS = {
  personal: {
    entities: ['tasks', 'calendar_events', 'notes', 'docs'],
    filters: { owner_id: 'current_user' }
  },
  cs: {
    entities: ['accounts', 'contacts', 'tickets', 'tasks'],
    filters: { category: 'customer_success' }
  },
  sales: {
    entities: ['deals', 'contacts', 'activities', 'tasks'],
    filters: { category: 'sales' }
  },
  marketing: {
    entities: ['campaigns', 'leads', 'forms', 'tasks'],
    filters: { category: 'marketing' }
  }
};
```

---

## Implementation Plan

### Phase 1: Core Shell (Week 1)

1. **Create Unified Layout**
   ```
   app/(app)/
   ├── layout.tsx              # Universal shell
   ├── page.tsx                # Hub home
   └── [domain]/
       └── layout.tsx          # Domain layout
   ```

2. **Migrate Components**
   - Copy `sidebar.tsx` → `components/navigation/Sidebar.tsx`
   - Copy `top-bar.tsx` → `components/navigation/TopBar.tsx`
   - Copy `workspace-shell.tsx` → `components/shell/WorkspaceShell.tsx`

### Phase 2: Domain Migration (Week 2)

1. **Personal Domain**
   - Migrate `domains/personal/` → `app/(app)/personal/`

2. **CS Domain**
   - Migrate `domains/account-success/` → `app/(app)/cs/`
   - Migrate 17 deep views

3. **Sales Domain**
   - Migrate `domains/salesops/` + `sales/` → `app/(app)/sales/`

4. **Marketing Domain**
   - Migrate `marketing/` → `app/(app)/marketing/`

### Phase 3: Unified Modules (Week 3)

1. **Extract Common Components**
   - `TaskView` (used by all domains)
   - `CalendarView` (used by all domains)
   - `DocViewer` (used by all domains)
   - `AnalyticsChart` (used by all domains)

2. **Create Module Library**
   ```
   components/modules/
   ├── TaskView/
   ├── CalendarView/
   ├── DocViewer/
   └── AnalyticsView/
   ```

### Phase 4: L2 Integration (Week 4)

1. **Intelligence Drawer**
   - Integrate with all domain views
   - Domain-specific signals

2. **HITL Workflow**
   - Approval gates in each domain
   - Domain-specific policies

---

## File Structure (Target)

```
app/(app)/
├── layout.tsx                    # Universal Hub Shell
├── page.tsx                      # Hub Home
├── globals.css                   # Theme variables
│
├── [domain]/                     # Dynamic domain routes
│   ├── layout.tsx                # Domain wrapper
│   ├── page.tsx                  # Domain dashboard
│   ├──
│   ├── tasks/
│   │   └── page.tsx              # Unified Tasks
│   ├── calendar/
│   │   └── page.tsx              # Unified Calendar
│   ├── docs/
│   │   └── page.tsx              # Unified Docs
│   └──
│   └── deep/                     # Deep dive views
│       └── [view]/
│           └── page.tsx          # Domain-specific views
│
├── api/                          # API routes
├── ai/                           # AI assistant page
└── settings/                     # Settings pages

components/
├── shell/                        # App shell
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── WorkspaceShell.tsx
│   └── IntelligenceDrawer.tsx
│
├── navigation/                   # Nav components
│   ├── DomainSwitcher.tsx
│   ├── CommandPalette.tsx
│   └── Breadcrumbs.tsx
│
├── modules/                      # Shared L1 modules
│   ├── TaskView/
│   ├── CalendarView/
│   ├── DocViewer/
│   └── AnalyticsView/
│
├── domains/                      # Domain-specific
│   ├── account-success/
│   │   └── views/                # 17 views
│   ├── revops/
│   ├── salesops/
│   └── personal/
│
└── ui/                           # shadcn/ui

lib/
├── spine/
│   ├── projections.ts            # Domain projections
│   └── client.ts                 # Spine client
├── domains/
│   └── config.ts                 # Domain configurations
└── hooks/
    ├── use-domain.ts
    └── use-projection.ts
```

---

## Domain Summary

| Domain | Type | Views | Deep Views | Priority |
|--------|------|-------|------------|----------|
| **Personal** | Module-based | 5 | 0 | P1 |
| **CS** | Hybrid | 5 | 17 | P0 |
| **Sales** | Hybrid | 7 | TBD | P1 |
| **Marketing** | Hybrid | 6 | TBD | P2 |
| **RevOps** | Deep-only | 1 | TBD | P2 |
| **Admin** | Module-based | 40+ | 0 | P1 |

---

## Next Steps

1. **Decide**: Hybrid approach (Option 3)
2. **Start**: Core shell components
3. **Migrate**: Account Success domain first (most complete)
4. **Extract**: Common modules after 2-3 domains
5. **Integrate**: L2 cognitive layer
