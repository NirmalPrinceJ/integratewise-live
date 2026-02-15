# IntegrateWise OS - UI Design & Workspace Architecture

> **Last Updated**: 31 January 2026  
> **Version**: 3.0 (Enhanced Production Review)  
> **Framework**: Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS 4.x
> **Databases**: Neon (Postgres), Cloudflare D1 (SQLite), Cloudflare Vectorize, Redis (Upstash), Supabase
> **Review Level**: Cognitive-OS-Grade Architecture

---

## 📖 Table of Contents

1. [Overall Architecture](#-overall-architecture)
2. [Context Providers & Performance](#-context-providers--performance)
3. [View System](#-view-system)
4. [Design System](#-design-system)
5. [Page Layouts](#-page-layouts)
6. [Component Standards](#-component-standards)
7. [Special Features](#-special-features)
8. [Navigation Structure](#-navigation-structure)
9. [Data Architecture Layers](#-data-architecture-layers)
10. [Responsive & Mobile Design](#-responsive--mobile-design)
11. [Performance Standards](#-performance-standards)
12. [Telemetry & Analytics](#-telemetry--analytics)
13. [Governance & Compliance](#-governance--compliance)
14. [Future Roadmap](#-future-roadmap)
15. [Anti-Patterns Checklist](#-anti-patterns-checklist)

---

## 🏗️ Overall Architecture

IntegrateWise OS follows a **"Workspace-First, Intelligence-Woven"** design philosophy built on Next.js 16 with the App Router pattern. The UI is inspired by Linear's minimal aesthetic with enterprise-grade functionality.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          OS Shell (Root Layout)                     │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                    Top Header                         │
│   Left       │  ┌─ Search ─────────────────────┬── Quick Actions ─┐ │
│   Sidebar    │  │ ⌘K Search Spine, Context...  │ Spine | Context  │ │
│              │  └──────────────────────────────┴── 🔔 ⏱ 👁 ⚙ ────┘ │
│  ┌────────┐  │  ┌─ Department Navigation Strip ─────────────────────┐│
│  │ IW     │  │  │ Overview │ Ops │ Sales │ Marketing │ CS │ ...    ││
│  │ Brand  │  │  └─────────────────────────── Branches | Sectors ───┘│
│  ├────────┤  ├──────────────────────────────────────────────────────┤
│  │ IQ Hub │  │                                                       │
│  │ Status │  │                   Main Content Area                   │
│  ├────────┤  │                                                       │
│  │ Core   │  │    (Page-specific content rendered via children)      │
│  │ Dept   │  │                                                       │
│  │ Intel  │  │    ┌─────────────────────────────────────────────┐   │
│  │ Think  │  │    │  DashboardLayout / GridLayout / ListLayout  │   │
│  │ Act    │  │    │  (Standardized page containers)             │   │
│  │ Govern │  │    └─────────────────────────────────────────────┘   │
│  ├────────┤  │                                                       │
│  │ User   │  ├──────────────────────────────────────────────────────┤
│  │ Profile│  │                   Action Bar (Fixed Bottom)           │
│  └────────┘  └──────────────────────────────────────────────────────┘
└──────────────┴───────────────────────────────────────────────────────┘
                          ↑
              Slide-over Panels (Evidence Drawer, Knowledge Panel)
```

---

## 🎯 Key Design Concepts

### 1. Context Providers (Wrapped Layers)

The app layout (`src/app/(app)/layout.tsx`) wraps all pages with four essential providers:

```tsx
<WorldScopeProvider>     // Controls: personal | work | accounts | admin
  <TenantProvider>       // Multi-tenant context (plan, features, limits)
    <EvidenceProvider>   // Global evidence/audit state
      <OsShell>          // The actual UI shell
        {children}
      </OsShell>
    </EvidenceProvider>
  </TenantProvider>
</WorldScopeProvider>
```

#### ⚡ Performance Optimization Guidelines

**Provider Hydration & Re-render Prevention**:

```tsx
// ❌ ANTI-PATTERN: Inline objects cause re-renders on every parent render
<TenantProvider value={{ tenant, features, plan }}>

// ✅ PATTERN: Memoize context values
const contextValue = useMemo(() => ({ tenant, features, plan }), [tenant, features, plan])
<TenantProvider value={contextValue}>
```

**Recommended Context Structure**:

| Provider | Selectors Available | Update Frequency |
|----------|---------------------|------------------|
| WorldScopeProvider | `useWorldScope()`, `useCurrentDepartment()` | User action only |
| TenantProvider | `useTenant()`, `usePlan()`, `useFeatureFlags()` | Session init |
| EvidenceProvider | `useEvidence()`, `useEvidenceDrawer()` | Real-time |

**Performance Rules**:

1. Split large contexts into smaller, focused providers
2. Use selector hooks (`useCurrentDepartment`) instead of full context consumption
3. Memoize expensive computed values with `useMemo`
4. Debounce high-frequency updates (signals, real-time data)

### 2. View System (World Scopes)

The OS organizes work around **8 primary views**, each with its own scope:

| World Scope | Views | Purpose | Status |
|-------------|-------|---------|--------|
| **Personal** | Personal | Individual user workspace | Stable |
| **Work** | Ops, Sales, Marketing, CS, Projects | Department-specific work | Stable |
| **Accounts** | Accounts | Account intelligence | Stable |
| **Admin** | Admin | System configuration | Stable |

#### Feature-Flagged & Experimental Views

Support for beta/experimental views that can be hidden or shown based on feature flags:

```tsx
// View item with feature flag support
interface ViewItem {
  id: string
  label: string
  icon: LucideIcon
  status?: 'stable' | 'beta' | 'experimental' | 'deprecated'
  featureFlag?: string        // e.g., 'enable_ai_copilot_view'
  minPlan?: 'starter' | 'pro' | 'enterprise'
  releaseDate?: string        // For "Coming Soon" displays
}

// Usage in navigation
const filteredViews = views.filter(view => {
  if (view.featureFlag && !featureFlags[view.featureFlag]) return false
  if (view.minPlan && !planIncludes(currentPlan, view.minPlan)) return false
  return true
})
```

**View Status Badges**:

| Status | Badge | Color | Behavior |
|--------|-------|-------|----------|
| stable | None | — | Normal display |
| beta | "Beta" | `bg-amber-100 text-amber-700` | Show with warning |
| experimental | "Lab" | `bg-purple-100 text-purple-700` | Hidden by default |
| deprecated | "Sunset" | `bg-red-100 text-red-700` | Show migration notice |

#### Deep Linking & State Persistence

All views support deep-linkable URLs with state preservation:

```tsx
// URL structure
/sales/pipeline?stage=negotiation&owner=me&sort=value

// State restoration
const [filters, setFilters] = useURLState({
  stage: 'all',
  owner: 'all', 
  sort: 'created'
})
```

### 3. Department-Adaptive Navigation

The left sidebar dynamically adapts based on the active department:

```tsx
const leftNavItems = getLeftNavItems(activeDepartment)

// Returns sections:
{
  core: [Dashboard, Today, Tasks, Goals],
  department: [...department-specific items],
  intelligence: [Spine, Context, Knowledge, IQ Hub],
  think: [Signals, Predictions, AI Agent],
  act: [Workflows, Automations, Approvals],
  govern: [Audit, Evidence, Policies]
}
```

---

## 🎨 Design System

### Color Palette

| Purpose | Color | Tailwind Class | Usage |
|---------|-------|----------------|-------|
| Brand Primary | `#2D7A3E` | `bg-[#2D7A3E]` | Buttons, primary actions |
| Brand Hover | `#236B31` | `bg-[#236B31]` | Hover states |
| Department: Sales | Blue | `bg-blue-600` | Sales-specific accents |
| Department: Marketing | Purple | `bg-purple-600` | Marketing accents |
| Department: CS | Amber | `bg-amber-600` | Customer Success accents |
| Department: Ops | Emerald | `bg-emerald-600` | Operations accents |
| Department: Engineering | Indigo | `bg-indigo-600` | Engineering accents |
| Department: Finance | Green | `bg-green-600` | Finance accents |
| Department: HR | Rose | `bg-rose-600` | People/HR accents |
| Department: Projects | Cyan | `bg-cyan-600` | Project accents |

### Semantic Colors

| State | Background | Text | Usage |
|-------|------------|------|-------|
| Success | `bg-green-100` | `text-green-700` | Active, completed, on-track |
| Warning | `bg-yellow-100` | `text-yellow-700` | At risk, needs attention |
| Error | `bg-red-100` | `text-red-700` | Failed, blocked, behind |
| Info | `bg-blue-100` | `text-blue-700` | In progress, informational |
| Neutral | `bg-gray-100` | `text-gray-600` | Inactive, archived |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Gray 50 | `#F9FAFB` | Page backgrounds |
| Gray 100 | `#F3F4F6` | Card backgrounds |
| Gray 200 | `#E5E7EB` | Borders |
| Gray 400 | `#9CA3AF` | Muted text |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 600 | `#4B5563` | Labels |
| Gray 900 | `#111827` | Headings, primary text |

---

## 📝 Typography

### Headings

| Level | Class | Usage |
|-------|-------|-------|
| H1 (Page Title) | `text-2xl font-bold text-gray-900` | Page titles |
| H2 (Section) | `text-xl font-semibold text-gray-900` | Section headers |
| H3 (Card Title) | `text-lg font-semibold text-gray-900` | Card titles |
| H4 (Subsection) | `text-base font-medium text-gray-900` | Subsection headers |

### Body Text

| Type | Class | Usage |
|------|-------|-------|
| Primary | `text-gray-900` | Main content |
| Secondary | `text-gray-600` | Supporting text |
| Muted | `text-gray-500` | Timestamps, metadata |
| Caption | `text-sm text-gray-400` | Small labels |

### Special

| Type | Class | Usage |
|------|-------|-------|
| Stage ID | `text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono` | Tracking IDs |
| Badge | `text-xs px-2 py-1 rounded font-medium` | Status indicators |
| Metric | `text-3xl font-bold text-gray-900` | KPI values |

---

## 📐 Standardized Page Layouts

All pages use one of 4 layout components from `src/components/layouts/page-layouts.tsx`:

### 1. DashboardLayout

For metrics & overview pages:

```tsx
<DashboardLayout 
  title="Operations Dashboard" 
  description="Real-time operational metrics"
  stageId="OPS-001"
>
  <MetricCard title="MRR" value="$45,000" icon={DollarSign} />
  <Section title="Active Processes">...</Section>
</DashboardLayout>
```

**Use for**: Today, Spine, Metrics, Goals, Strategy

### 2. GridLayout

For card-based collections:

```tsx
<GridLayout 
  title="Integrations" 
  description="Connected services"
  stageId="INT-001"
  columns={3}
>
  <Card>Stripe</Card>
  <Card>HubSpot</Card>
</GridLayout>
```

**Use for**: Clients, Products, Services, Campaigns, Integrations

### 3. ListLayout

For table/list views:

```tsx
<ListLayout 
  title="Tasks" 
  description="All active tasks"
  stageId="TSK-001"
>
  <Table>...</Table>
</ListLayout>
```

**Use for**: Tasks, Leads, Deals, Pipeline, Users, Audit Logs

### 4. PageContainer

For custom layouts:

```tsx
<PageContainer 
  title="Settings" 
  description="Configure your workspace"
  stageId="SET-001"
>
  {/* Custom content */}
</PageContainer>
```

**Use for**: Settings, Think, Act, Knowledge, Context

---

## 📦 Component Standards

### Card Component

```tsx
<Card hover={true} className="...">
  {/* Card content */}
</Card>
```

| Property | Value |
|----------|-------|
| Padding | `p-5` (20px) |
| Border | `border border-gray-200` |
| Radius | `rounded-xl` |
| Hover | `hover:shadow-lg hover:border-gray-300` |

### Button Variants

| Variant | Classes |
|---------|---------|
| Primary | `bg-[#2D7A3E] hover:bg-[#236B31] text-white` |
| Secondary | `bg-white border border-gray-200 text-gray-700 hover:bg-gray-50` |
| Danger | `bg-red-500 hover:bg-red-600 text-white` |
| Ghost | `text-gray-600 hover:bg-gray-100` |

### Empty State

```tsx
<StandardEmptyState 
  icon={<FolderIcon className="w-12 h-12 text-gray-300" />}
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button>Create Project</Button>}
/>
```

### Status Badges

```tsx
<span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
  Active
</span>
```

---

## 📏 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| Page padding | `p-6` (24px) | Outer page margin |
| Section gap | `space-y-6` (24px) | Between sections |
| Card gap | `gap-4` (16px) | Grid gaps |
| Element gap | `gap-2` / `gap-3` | Inner element spacing |
| Tight spacing | `space-y-2` (8px) | Compact lists |

---

## ⚡ Special Features

### 1. IQ Hub - Converged Intelligence Layer

The IQ Hub status is always visible in the sidebar, showing:

- Active data sources count
- Real-time sync status
- Quick access to intelligence layers

```
┌─────────────────────────────┐
│ 🧠 IQ Hub Active  ● 12 src │
└─────────────────────────────┘
```

#### IQ Hub Health Indicators

| Status | Indicator | Color | Meaning |
|--------|-----------|-------|---------|
| Healthy | ● | `text-green-500` | All sources synced < 5min ago |
| Syncing | ◐ (animated) | `text-amber-500` | Sync in progress |
| Stale | ◯ | `text-yellow-500` | Data > 30min old |
| Error | ✕ | `text-red-500` | Connection failed |

**Expanded IQ Hub Panel**:

```tsx
<IQHubPanel>
  <SourceList>
    <Source name="HubSpot" lastSync="2m ago" status="healthy" />
    <Source name="Stripe" lastSync="5m ago" status="healthy" />
    <Source name="Slack" lastSync="syncing" status="syncing" />
  </SourceList>
  <QuickActions>
    <Button>Force Sync All</Button>
    <Button>View Sync History</Button>
  </QuickActions>
</IQHubPanel>
```

### 2. Command Palette (⌘K)

Global search across all data layers:

| Layer | Icon | Description |
|-------|------|-------------|
| Spine | Database | Structured data from integrations |
| Context | FileText | Documents, emails, meetings |
| Knowledge | MessageCircle | AI conversations & insights |
| Actions | Zap | Workflows, automations |
| Navigation | Globe | Quick department switching |

**Keyboard Shortcuts**:

- `⌘K` - Open command palette
- `⌘1` - Search Spine
- `⌘2` - Search Context
- `⌘3` - Search AI Conversations
- `⌘A` - View Audit Trail
- `⌘E` or `E` - Toggle Evidence Drawer

#### Command Palette Enhancements

**Fuzzy Search with Highlighting**:

```tsx
// Uses fuzzy matching library (e.g., fuse.js)
const results = fuse.search(query)

// Display with match highlighting
<CommandItem>
  <HighlightedText text={result.item.name} matches={result.matches} />
</CommandItem>
```

**Create Actions from Palette**:

| Command | Action | Description |
|---------|--------|-------------|
| `/task` | Create Task | Quick task creation inline |
| `/note` | Create Note | Add to knowledge bank |
| `/signal` | Flag Signal | Mark an insight for review |
| `/workflow` | Create Workflow | Start automation builder |

**Recent & Frecency Sorting**:

- Track recent commands per user
- Weight by frequency + recency (frecency)
- Show "Recent" section at top of results

### 3. Evidence Drawer

A slide-over panel that shows the "why" behind any insight or decision:

```tsx
<EvidenceDrawer
  situationId={selectedSituationId}
  evidence={{
    truth: [...],      // Spine data
    context: [...],    // Knowledge artifacts
    ai_chats: [...],   // AI conversation history
    think: [...],      // Predictions/signals
    act: [...],        // Decisions made
    governance: [...], // Policies applied
    audit: [...]       // Audit trail
  }}
/>
```

**Tabs Available**:

- Lineage - Data flow visualization
- Spine - Structured source data
- Context - Document references
- Knowledge - AI insights
- Think - Predictions/signals
- Governance - Applied policies
- Act - Decision records

#### Evidence Drawer Performance & Scalability

Evidence sets can grow large. Implement these optimizations:

```tsx
// Virtualized list for large evidence sets
import { VirtualizedList } from '@tanstack/react-virtual'

<EvidenceTab>
  <VirtualizedList
    items={evidenceItems}
    estimateSize={() => 80}
    overscan={5}
  >
    {(item) => <EvidenceItem key={item.id} {...item} />}
  </VirtualizedList>
</EvidenceTab>
```

**Chunked Loading**:

- Initial load: First 50 items
- On scroll: Load next 50 (infinite scroll)
- Background prefetch for adjacent tabs

#### Evidence Drawer Plugin Architecture

Allow dynamic tab registration for extensibility:

```tsx
// Plugin registration
registerEvidencePlugin({
  id: 'compliance',
  label: 'Compliance',
  icon: Shield,
  order: 8,
  render: ({ situationId }) => <ComplianceEvidence situationId={situationId} />,
  // Optional: Only show for certain contexts
  shouldShow: (context) => context.tenant.plan === 'enterprise'
})

// Dynamic tab generation
const tabs = [...coreEvidenceTabs, ...registeredPlugins]
```

#### User Actions on Evidence

| Action | Icon | Description |
|--------|------|-------------|
| Pin | 📌 | Pin evidence to situation summary |
| Annotate | 💬 | Add notes/comments to evidence |
| Share | 🔗 | Generate shareable link |
| Export | 📤 | Export as PDF/JSON |
| Link | 🔗 | Link to another situation |

### 4. Live Signals Strip

Real-time event stream from connected tools:

```tsx
<SignalStrip scope={apiScope} />
```

**Source Indicators**:

| Source | Color |
|--------|-------|
| Stripe | 🔴 Red |
| HubSpot | 🟠 Amber |
| Calendar | 🟢 Emerald |
| Slack | 🟣 Violet |

#### Signal Strip Enhancements

**Filtering & Actionability**:

```tsx
<SignalStrip
  scope={apiScope}
  filters={{
    sources: ['stripe', 'hubspot'],
    severity: ['high', 'critical'],
    timeRange: '24h'
  }}
  onSignalClick={(signal) => {
    // Open evidence drawer with signal context
    openEvidence(signal.situationId)
  }}
  onSignalAction={(signal, action) => {
    // Handle inline actions: acknowledge, snooze, escalate
  }}
/>
```

**Signal Actions**:

| Action | Icon | Description |
|--------|------|-------------|
| Acknowledge | ✓ | Mark as seen |
| Snooze | ⏰ | Snooze for 1h/4h/24h |
| Escalate | ⬆️ | Escalate to team lead |
| Investigate | 🔍 | Open full evidence |

**Signal Severity Styling**:

| Severity | Border | Background | Icon |
|----------|--------|------------|------|
| Critical | `border-l-4 border-red-500` | `bg-red-50` | AlertTriangle |
| High | `border-l-4 border-amber-500` | `bg-amber-50` | AlertCircle |
| Medium | `border-l-4 border-yellow-500` | `bg-yellow-50` | Info |
| Low | `border-l-4 border-blue-500` | `bg-blue-50` | Bell |

### 5. Quick Access Panels

Three searchable slide-over panels in the header:

| Panel | Icon | Purpose |
|-------|------|---------|
| Spine | Database (blue) | Search structured data |
| Context | FileText (emerald) | Search documents/knowledge |
| Knowledge | MessageCircle (indigo) | Search AI conversations |

### 6. Branch & Sector Filters

Enterprise-grade filtering for multi-org deployments:

```
[All Branches ▾]    [All Sectors ▾]
├─ North America    ├─ Enterprise
├─ Europe           ├─ SMB
├─ APAC             ├─ Startup
└─ LATAM            └─ Government
```

### 7. Plan Gating & RBAC

Views and features are gated based on:

- **Subscription plan** (Starter, Pro, Enterprise)
- **Feature flags** (tenant-specific toggles)
- **Role permissions** (Admin, Member, Viewer)

```tsx
const { allowed, reason } = useViewAccess(item.id)
// Returns: { allowed: false, reason: "Upgrade to Pro to access..." }
```

Locked items display:

- Grayed-out appearance
- "Locked" badge
- Tooltip with upgrade reason

#### Centralized Feature Registry

All gating logic lives in a centralized registry:

```tsx
// src/config/feature-registry.ts
export const featureRegistry: FeatureRegistry = {
  'spine-advanced': {
    minPlan: 'pro',
    featureFlag: null,
    roles: ['admin', 'member'],
    description: 'Advanced Spine queries',
    upsellMessage: 'Upgrade to Pro for advanced data queries'
  },
  'ai-copilot': {
    minPlan: 'enterprise',
    featureFlag: 'enable_ai_copilot',
    roles: ['admin'],
    description: 'AI Copilot assistant',
    upsellMessage: 'AI Copilot is available on Enterprise plans'
  },
  'custom-workflows': {
    minPlan: 'pro',
    featureFlag: 'workflows_v2',
    roles: ['admin', 'member'],
    description: 'Custom automation workflows',
    upsellMessage: 'Create custom workflows with Pro'
  }
}

// Hook usage
const { canAccess, upsellMessage } = useFeature('ai-copilot')
```

**Benefits of Centralized Registry**:

- Single source of truth for all gating logic
- Easy to audit which features require which plans
- Consistent upsell messaging
- Type-safe feature checks
- Easy to add new features

### 8. Action Bar

Context-aware action bar fixed at the bottom:

- Appears when an action is selected
- Shows available operations for current context
- Quick access to workflows and automations

---

## 🗂️ Navigation Structure

### Department Navigation (Top Strip)

| ID | Label | Icon | Color |
|----|-------|------|-------|
| overview | Overview | Building2 | `bg-slate-900` |
| ops | Operations | Zap | `bg-emerald-600` |
| sales | Sales | Briefcase | `bg-blue-600` |
| marketing | Marketing | Megaphone | `bg-purple-600` |
| cs | Customer Success | Headphones | `bg-amber-600` |
| engineering | Engineering | Code | `bg-indigo-600` |
| finance | Finance | DollarSign | `bg-green-600` |
| hr | People | Users | `bg-rose-600` |
| projects | Projects | FolderKanban | `bg-cyan-600` |

### Left Sidebar Sections

#### Core (All Departments)

- Dashboard
- Today
- Tasks
- Goals & OKRs

#### Department-Specific

Varies by active department (e.g., Sales gets Pipeline, Deals, Accounts)

#### Intelligence

- Spine (Structured data)
- Context (Knowledge from docs)
- Knowledge Bank (AI conversations)
- IQ Hub (Converged intelligence)

#### Think

- Signals
- Predictions
- AI Agent

#### Act

- Workflows
- Automations
- Approvals

#### Governance

- Audit Trail
- Evidence Log
- Policies

---

## 🔗 Data Architecture Layers

The UI reflects a 3-layer data model:

| Layer | Component | Icon | Data Type |
|-------|-----------|------|-----------|
| **Spine** | Database | Database | CRM, ERP, ticketing systems |
| **Context** | FileText | FileText | Docs, emails, meeting notes |
| **IQ Hub** | Brain | Brain | AI-generated insights, predictions |

Each layer is:

- Searchable via Command Palette
- Accessible via dedicated nav items
- Integrated into the Evidence Drawer
- Connected to the Live Signals strip

---

## 📱 Responsive & Mobile Design

The shell adapts across breakpoints:

| Breakpoint | Behavior |
|------------|----------|
| Desktop (xl+) | Full sidebar + all header labels visible |
| Tablet (lg) | Collapsed department labels, icon-only quick actions |
| Mobile (md-) | Collapsible sidebar, stacked navigation |

### Mobile-First Considerations

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Always visible, 240px | Slide-out drawer |
| Dept Strip | Horizontal scroll | 2-row grid |
| Evidence Drawer | 400px slide-over | Full-screen modal |
| Command Palette | Centered modal | Full-screen overlay |
| Signal Strip | Inline scroll | Collapsed, expandable |
| Quick Actions | Icon row | Hamburger menu |

### Touch Optimization

```tsx
// Swipe gestures
<SwipeContainer
  onSwipeLeft={() => openEvidence()}
  onSwipeRight={() => closeSidebar()}
>
  <PageContent />
</SwipeContainer>

// Touch targets: minimum 44x44px
<TouchableItem className="min-h-[44px] min-w-[44px]">
  <Icon />
</TouchableItem>
```

### Progressive Enhancement

| Network | Behavior |
|---------|----------|
| Fast (4G+) | Full real-time signals, live updates |
| Slow (3G) | Reduced signal frequency, batch updates |
| Offline | Cached views, queue actions for sync |

---

## 🚀 Performance Standards

- **First Paint**: < 1s
- **Interactive**: < 2s
- **Route transitions**: < 300ms
- **Skeleton loading**: For all async data
- **Optimistic updates**: For user actions

---

## � Telemetry & Analytics

### UI Interaction Metrics

Track user behavior to optimize the cognitive workspace:

```tsx
// Telemetry hook
const { track } = useTelemetry()

// Usage
track('evidence_drawer_opened', {
  situationId: '123',
  tab: 'spine',
  source: 'signal_click'
})
```

**Core Metrics to Collect**:

| Event | Properties | Purpose |
|-------|------------|---------|
| `evidence_drawer_opened` | situationId, tab, source | Understand evidence exploration |
| `command_palette_search` | query, resultsCount, selectedIndex | Optimize search relevance |
| `signal_strip_click` | signalId, severity, source | Measure signal engagement |
| `department_switch` | from, to, method | Track navigation patterns |
| `feature_blocked` | featureId, plan, reason | Identify upsell opportunities |
| `iq_hub_expand` | sourcesCount, staleCount | Monitor data freshness awareness |

**Aggregated Insights**:

- Most used evidence tabs per department
- Command palette search patterns
- Signal response times
- Feature adoption by plan tier

### Performance Monitoring

```tsx
// Web Vitals tracking
import { onCLS, onFID, onLCP } from 'web-vitals'

onLCP((metric) => track('web_vital', { name: 'LCP', value: metric.value }))
onFID((metric) => track('web_vital', { name: 'FID', value: metric.value }))
onCLS((metric) => track('web_vital', { name: 'CLS', value: metric.value }))
```

---

## 🛡️ Governance & Compliance

### Audit Trail Integration

Every UI action can be linked to the audit trail:

```tsx
// Audit-aware action
const handleApproval = async (itemId: string) => {
  await auditedAction({
    action: 'workflow_approved',
    entityType: 'workflow',
    entityId: itemId,
    metadata: { approver: currentUser.id }
  })
}
```

### Data Residency Indicators

For multi-region deployments:

```tsx
<DataResidencyBadge region="eu-west-1">
  <SensitiveDataSection />
</DataResidencyBadge>
```

| Region | Badge | Color |
|--------|-------|-------|
| US | 🇺🇸 US | `bg-blue-100` |
| EU | 🇪🇺 EU | `bg-green-100` |
| APAC | 🌏 APAC | `bg-purple-100` |

### Compliance Notices

```tsx
// SOC2/GDPR compliance indicators
<ComplianceFooter>
  <ComplianceBadge type="soc2" />
  <ComplianceBadge type="gdpr" />
  <ComplianceBadge type="hipaa" /> {/* Enterprise only */}
</ComplianceFooter>
```

---

## 🚀 Future Roadmap

### Theme System (Planned)

```tsx
// Theme configuration
const themes = {
  default: { primary: '#2D7A3E', mode: 'light' },
  dark: { primary: '#4ADE80', mode: 'dark' },
  'high-contrast': { primary: '#FFFFFF', mode: 'high-contrast' }
}

<ThemeProvider theme={userPreference}>
  <OsShell />
</ThemeProvider>
```

### AI-Driven UX (Planned)

- **Predictive Navigation**: Suggest next likely destination based on patterns
- **Auto-Surface Signals**: Proactively show relevant signals without user action
- **Smart Evidence**: Pre-fetch likely evidence based on context
- **Adaptive Layouts**: Adjust layout density based on user behavior

### Plugin Framework (Planned)

```tsx
// Third-party widget registration
registerWidget({
  id: 'salesforce-widget',
  label: 'Salesforce Quick View',
  position: 'sidebar',
  render: () => <SalesforceWidget />,
  permissions: ['salesforce:read']
})
```

### Multi-Tenancy Enhancements (Planned)

- Tenant-specific branding (logo, colors)
- White-label support
- Per-tenant feature flags
- Tenant admin dashboards

---

## 📁 Key File Locations

| Component | Path |
|-----------|------|
| OS Shell | `src/components/layouts/os-shell.tsx` |
| Page Layouts | `src/components/layouts/page-layouts.tsx` |
| Evidence Drawer | `src/components/os/evidence-drawer.tsx` |
| Signal Strip | `src/components/os/signal-strip.tsx` |
| Action Bar | `src/components/os/action-bar.tsx` |
| Knowledge Panel | `src/components/os/knowledge-panel.tsx` |
| App Layout | `src/app/(app)/layout.tsx` |
| Shell Registry | `src/config/os-shell-registry.ts` |
| Feature Registry | `src/config/feature-registry.ts` |
| Telemetry | `src/lib/telemetry.ts` |

---

## ❌ Anti-Patterns Checklist

Avoid these common mistakes:

### Context & State

| ❌ Don't | ✅ Do |
|---------|-------|
| Inline context values | Memoize with `useMemo` |
| One giant provider | Split into focused providers |
| Full context consumption | Use selector hooks |
| Prop drilling 5+ levels | Use context or composition |

### Performance

| ❌ Don't | ✅ Do |
|---------|-------|
| Load all evidence at once | Virtualize + chunk load |
| Sync WebSocket for every signal | Batch + debounce updates |
| Re-render entire tree | Use `React.memo` boundaries |
| Block UI on data fetch | Skeleton + optimistic updates |

### Accessibility

| ❌ Don't | ✅ Do |
|---------|-------|
| Tiny touch targets | Min 44x44px touch areas |
| Color-only indicators | Use icons + text + color |
| Skip focus management | Trap focus in modals |
| Missing ARIA labels | Label all interactive elements |

### Feature Gating

| ❌ Don't | ✅ Do |
|---------|-------|
| Scatter gating logic | Centralize in feature registry |
| Hard-code plan checks | Use `useFeature` hook |
| Silent feature hiding | Show locked state + upsell |
| Duplicate gating code | Single `FeatureGate` component |

---

## ✅ Page Checklist

Every page should include:

1. ☐ Appropriate layout component (Dashboard/Grid/List/PageContainer)
2. ☐ PageHeader with title, description, stageId
3. ☐ Loading skeleton state
4. ☐ Empty state with CTA
5. ☐ Error boundary
6. ☐ Responsive design
7. ☐ Department-appropriate accent color
8. ☐ Evidence integration (where applicable)
9. ☐ Telemetry events for key actions
10. ☐ Feature gating via registry
11. ☐ Accessibility audit (ARIA, focus, contrast)
12. ☐ Mobile/touch optimizations

---

## 🎯 Summary

IntegrateWise OS is designed as a **Cognitive Twin Workspace** that:

1. **Adapts per department** - Navigation, metrics, and workflows change based on context
2. **Weaves intelligence throughout** - IQ Hub, signals, and evidence are always accessible
3. **Maintains audit trails** - Every insight links back to source evidence
4. **Scales with enterprise needs** - Multi-branch, multi-sector, plan-gated access
5. **Follows Linear's minimal aesthetic** - Clean, professional, efficient UI patterns
6. **Optimizes for performance** - Memoized contexts, virtualized lists, chunked loading
7. **Enables extensibility** - Plugin architecture, feature registry, dynamic tabs
8. **Tracks usage patterns** - Telemetry for continuous improvement
9. **Supports compliance** - Audit integration, data residency, governance

---

## 📚 Related Documentation

- [Route Map](../ROUTE_MAP.md) - Complete route listing
- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md) - System architecture
- [Multi-Vendor Connectivity](./MULTI_VENDOR_CONNECTIVITY_AUDIT.md) - Integration patterns
- [Completion Summary](../COMPLETION_SUMMARY.md) - Implementation status
- [Operations Runbook](./OPERATIONS_RUNBOOK.md) - Production operations
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues
