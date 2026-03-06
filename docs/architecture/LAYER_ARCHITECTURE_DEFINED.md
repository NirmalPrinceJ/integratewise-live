# 🏗️ Layer Architecture - What Exists in L0, L1, L2

**Date**: 2026-02-08
**Based on**: Actual codebase analysis

---

## 🎯 L0 - ONBOARDING (Reality Introduction Layer)

**Purpose**: Where new users enter the system. Data acquisition, initial setup, progressive hydration.

### Location:
- `src/app/onboarding/` - Main onboarding flow
- `src/components/onboarding/` - Onboarding UI components
- `src/app/(app)/loader/` - File upload & data ingestion
- `src/app/(app)/welcome/` - Welcome screen

### Components (9):
1. **`template-selector.tsx`** - Choose workspace template
2. **`identity-connect-view.tsx`** - User identity setup
3. **`seamless-connector-view.tsx`** - Connect external tools (Salesforce, Google, HubSpot, Slack, etc.)
4. **`processing-view.tsx`** - Show processing status
5. **`hydration-scorer.tsx`** - L0.5 - Score data completeness
6. **`first-projection-build.tsx`** - L0.6 - Build initial workspace projection
7. **`theme-preview-view.tsx`** - Theme customization
8. **`load-data-view.tsx`** - Data loading interface
9. **`persona-insight-view.tsx`** - Persona configuration

### Flow:
```
Step 1: template →
Step 2: identity →
Step 3: connect (integrations) →
Step 4: processing →
Step 5: hydration (L0.5 - score data) →
Step 6: projection (L0.6 - build workspace) →
Step 7: theme →
Complete: redirect to L1 workspace
```

### Data Stored:
```typescript
sessionStorage.setItem('iw:onboarding:complete', {
  bucketStatus,       // Hydration results
  enabledModules,     // Selected capabilities
  connectedTools,     // Connected integrations
  userData,           // User profile
})
```

### Key Features:
- ✅ Progressive hydration scoring
- ✅ Multi-tool connector (OAuth flows)
- ✅ Bucket status tracking
- ✅ Module selection
- ⚠️ TODO: Real tenant/user IDs from auth

---

## 🖥️ L1 - WORKSPACE (Pure Work Layer)

**Purpose**: Where users work. No AI, no intelligence, only facts and actions.

### Location:
- `src/components/workspace/` - Workspace shell & components
- `src/components/layouts/app-shell.tsx` - Main app navigation
- `lib/l1-registry.ts` - Complete workspace catalog (30+ pages)

### Components (9):
1. **`workspace-shell.tsx`** - Main workspace container
2. **`workspace-sidebar.tsx`** - Left navigation
3. **`workspace-provider.tsx`** - Workspace state management
4. **`home-skeleton-l1.tsx`** - L1 home page skeleton
5. **`feature-bag-sidebar.tsx`** - Capability sidebar
6. **`module-picker.tsx`** - Module selection
7. **`widget-picker.tsx`** - Widget customization
8. **`home-skeleton.tsx`** - Generic skeleton loader
9. **`index.ts`** - Exports

### L1 Page Registry (30+ pages):
```typescript
// lib/l1-registry.ts

Categories:
- core: today, tasks, goals, metrics, settings (5 pages)
- intelligence: iq-hub, spine, shadow, insights, knowledge, brainstorming, loader, integrations (8 pages)
- business: clients, products, services, website, leads, pipeline, content (7 pages)
- cs: health scores (1 page)
- admin: users, billing, audit (3 pages)
- onboarding: welcome, setup (2 pages)

Views (role-based):
- all: Available to everyone
- admin: Admin-only pages
- executive/manager/team/analyst: Role-specific
```

### App Shell Navigation:
```typescript
// components/layouts/app-shell.tsx

User Views:
- Executive: Dashboard, Goals, Reports, Insights
- Manager: Today, Team, Goals, Tasks, Metrics
- Team: Today, Tasks, Knowledge, IQ Hub, Sales, CS
- Analyst: Metrics, Data, Reports, Insights
- Admin: Settings, Users, Billing, Audit
```

### Key Features:
- ✅ 30+ workspace pages defined
- ✅ Role-based navigation
- ✅ Category organization (core, business, intelligence, cs, admin)
- ✅ View-based filtering
- ✅ Stage IDs for each page
- ⚠️ Most pages are skeleton/placeholder (need implementation)

---

## 🧠 L2 - COGNITIVE (Intelligence Layer)

**Purpose**: AI reasoning, analysis, insights, approvals. Opens on-demand via ⌘J.

### Location:
- `components/cognitive/` - Cognitive drawer & surfaces
- `src/components/cognitive/panels/` - Individual cognitive surfaces

### Main Components:
1. **`l2-drawer.tsx`** (845 lines) - Main cognitive drawer
   - State machine: CLOSED → OPENING → OPEN_ACTIVE → SWITCHING → SYNCING → FROZEN → CLOSING
   - Heights: collapsed (32px), standard (68vh), deep (88vh), fullscreen (100vh)
   - Keyboard: ⌘J to open/close, ESC to close
   - Context types: entity, approval, situation, timeline, search
   - Cognitive modes: operator, analyst, architect

2. **`cognitive-triggers.tsx`** - Buttons to trigger L2 drawer
3. **`cognitive-panel-provider.tsx`** - Panel state management
4. **`sliding-panel.tsx`** - Panel animation
5. **`CognitiveLayer.tsx`** - Legacy cognitive layer
6. **`l2-redirect.tsx`** - Redirect logic

### L2 Surfaces (14 total):
```typescript
type L2Surface =
  | "spine"      // ← MISSING - Need to create
  | "context"    // ✅ context-panel.tsx
  | "knowledge"  // Context store
  | "evidence"   // Autonomy evidence
  | "signals"    // Real-time signals
  | "think"      // ✅ think-panel.tsx
  | "act"        // Action execution
  | "govern"     // ✅ policy-panel.tsx
  | "adjust"     // Corrections
  | "audit"      // Audit trail
  | "agent"      // AI agent
  | "twin"       // ✅ proactive-twin-panel.tsx
  | "chat"       // Default surface
  | "search"     // Discovery search
```

### Implemented Panels (10):
1. **`context-panel.tsx`** - Context management
2. **`think-panel.tsx`** - Thinking/reasoning
3. **`policy-panel.tsx`** - Governance policies
4. **`proactive-twin-panel.tsx`** - AI twin
5. **`trust-dashboard-panel.tsx`** - Trust metrics
6. **`decision-memory-panel.tsx`** - Decision history
7. **`correct-redo-panel.tsx`** - Corrections
8. **`drift-detection-panel.tsx`** - Drift monitoring
9. **`simulation-panel.tsx`** - What-if scenarios
10. **`workflows-panel.tsx`** - Workflow automation

### Missing Panels (4):
- ❌ **spine-panel.tsx** - Show entity completeness, discovered schema, missing fields
- ❌ **knowledge-panel.tsx** - Knowledge bank
- ❌ **evidence-panel.tsx** - Evidence timeline
- ❌ **signals-panel.tsx** - Real-time signals

### Key Features:
- ✅ State machine with 7 states
- ✅ 4 height modes (32px → 100vh)
- ✅ Keyboard shortcuts (⌘J, ESC)
- ✅ Context-aware opening
- ✅ Frozen mode (during approvals)
- ✅ Surface switching
- ✅ 10/14 surfaces implemented
- ❌ Missing: spine, knowledge, evidence, signals surfaces

---

## 🔗 Layer Connections (Current State)

### L0 → L3 (Spine): ✅ COMPLETE
```
User uploads file in /loader
  ↓
FileUploadHandler parses CSV
  ↓
spineClient.ingestCSV()
  ↓
POST /v2/spine/ingest for each row
  ↓
Spine v2 creates entities + discovers schema
  ↓
Returns success with counts
```

### L3 → L2: ❌ NOT CONNECTED
**Missing**:
- Spine surface in L2 drawer
- Trigger to open L2 after upload
- Display completeness scores
- Show discovered fields
- Suggest enrichment actions

**Proposed Connection**:
```typescript
// In FileUploadHandler.tsx (after upload success)
const { openDrawer } = useL2Drawer()

onUploadComplete={(results) => {
  openDrawer({
    trigger: 'system',
    contextType: 'entity',
    contextId: results.entity_ids[0],
    requestedSurface: 'spine',  // ← Need to create this surface
    userMode: 'operator'
  })
}}
```

### L2 → L1: ❌ NOT CONNECTED
**Missing**:
- Completeness badges on entity cards
- Field coverage indicators
- Data quality scores in dashboards
- Discovered schema display

**Proposed Connection**:
```typescript
// In any L1 workspace page
import { spineClient } from "@/lib/spine-client"

const entity = await spineClient.getEntity(entityId)

// Show badge in L1:
<Badge color={entity.completeness_score > 80 ? 'green' : 'yellow'}>
  {entity.completeness_score}% Complete
</Badge>
```

---

## 📊 Summary Matrix

| Layer | Location | Components | Status | Key Missing |
|-------|----------|------------|--------|-------------|
| **L0** | `/onboarding`, `/loader` | 9 components | ✅ 90% | Real auth, tenant IDs |
| **L1** | `/workspace`, 30+ pages | 9 components + 30 pages | ⚠️ 40% | Most pages are skeletons |
| **L2** | `/cognitive` | 16 components, 10 panels | ⚠️ 70% | spine, knowledge, evidence, signals surfaces |
| **L3** | `spine-v2` API | Backend service | ✅ 100% | Auth middleware |

---

## 🎯 What Works Right Now

### L0 Onboarding:
✅ Full 7-step flow
✅ Tool connectors (OAuth)
✅ Hydration scoring
✅ Projection build
✅ Stores results in sessionStorage

### L1 Workspace:
✅ 30+ pages defined in registry
✅ Role-based navigation (5 views)
✅ App shell with routing
⚠️ Most pages are placeholders (need real implementation)

### L2 Cognitive:
✅ Drawer with state machine
✅ ⌘J keyboard shortcut
✅ 4 height modes
✅ 10/14 surfaces implemented
❌ Missing spine surface (critical for L3→L2)

### L3 Spine:
✅ API deployed and operational
✅ Entity ingestion working
✅ Schema discovery active
✅ Completeness scoring functional
❌ No auth (critical security issue)

---

## 🚨 Critical Gaps

1. **L2 Spine Surface** - MUST CREATE
   - Show completeness scores
   - Display discovered fields
   - Highlight missing required fields
   - Suggest enrichment actions

2. **L3 → L2 Trigger** - MUST WIRE
   - Open L2 drawer after data ingestion
   - Pass entity context
   - Show analysis results

3. **L2 → L1 Display** - MUST WIRE
   - Add completeness badges to entity cards
   - Show field coverage in lists
   - Display data quality scores

4. **Authentication** - CRITICAL
   - Real tenant IDs from Supabase
   - JWT verification in Spine API
   - Tenant isolation on all queries

---

**Next**: Create spine surface in L2, wire L3→L2 trigger, add completeness badges to L1
