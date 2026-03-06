# IntegrateWise OS — Customizable L1 Workspace

> **Architecture**: Fixed skeleton + Module catalog + Constrained customization

---

## 🎯 The Core Principle

**The winning pattern:**

- **Personal Home is fixed** (non-editable scaffold) → ensures every user instantly understands the product
- **Everything else is "capability modules"** → user can pin/unpin/reorder into their bag (sidebar + home widgets)
- **Drag/drop exists**, but only on layout, not on data contracts

**What we do NOT allow:**

- ❌ Free-form dashboard builder
- ❌ Arbitrary blocks hitting arbitrary data
- ❌ Breaking module boundaries

**What we allow:**

- ✅ Layout customization
- ✅ Module enablement
- ✅ Module ordering
- ✅ Widget pinning from approved widget set

---

## 🏠 Fixed Home Skeleton (Non-Negotiable)

Home always has these 5 blocks, even with zero integrations:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PERSONAL HOME (Fixed Skeleton)                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  1. TODAY STRIP                                                         │ │
│  │     Calendar + Tasks + Meetings for today                               │ │
│  │     (Shows placeholder if no calendar connected)                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  2. SIGNAL FEED                                                         │ │
│  │     Top 5 insights and alerts (even if sparse)                          │ │
│  │     "Connect more tools to get richer signals"                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  3. MY WORK QUEUE                                                       │ │
│  │     Tasks + Approvals + Drafts awaiting action                          │ │
│  │     (Always has something, even if manual tasks)                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  4. RECENT KNOWLEDGE                                                    │ │
│  │     Docs, notes, and chat history                                       │ │
│  │     (Shows getting started docs if empty)                               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  5. CONNECT NEXT TOOL                                                   │ │
│  │     Guided CTA based on data gaps                                       │ │
│  │     "Connect Slack to see team activity"                                │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  6. PINNED WIDGETS (Optional, user-controlled)                          │ │
│  │     Widgets from enabled modules, pinned to Home                        │ │
│  │     [+ Add Widget] opens picker from approved set                       │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Catalog

| # | Module | Category | Default | Unlock Condition |
|---|--------|----------|---------|------------------|
| 1 | **Home** | Core | ✅ Fixed | Always |
| 2 | Projects | Work | ✅ | Always |
| 3 | Accounts | Customers | ✅ | CRM connected |
| 4 | Contacts | Customers | ✅ | CRM or Email |
| 5 | Meetings | Work | ✅ | Calendar connected |
| 6 | Docs | Work | ⬜ | Always |
| 7 | Tasks | Work | ⬜ | Always |
| 8 | Calendar | Work | ⬜ | Calendar connected |
| 9 | Notes | Personal | ⬜ | Always |
| 10 | Knowledge | Intelligence | ⬜ | Data ≥ Growing |
| 11 | Team | Team | ⬜ | 2+ team members |
| 12 | Pipeline | Customers | ⬜ | Has deals |
| 13 | Risks | Intelligence | ⬜ | Data ≥ Healthy |
| 14 | Expansion | Intelligence | ⬜ | Data ≥ Healthy |
| 15 | Analytics | Intelligence | ⬜ | Pro plan + Growing |

---

## 📊 Module Data Contracts

Each module publishes what data it needs:

```typescript
interface ModuleDataContract {
  // Minimum data to show module (even sparse)
  required_data: DataRequirement[];
  
  // Data that enhances the experience
  optional_data: DataRequirement[];
  
  // SSOT anchors this module reads from
  anchors: ('spine' | 'context' | 'knowledge')[];
}

type ModuleCoverageState = 'ready' | 'sparse' | 'missing';
```

### Example Contracts

| Module | Required Data | Optional Data | Coverage Gate |
|--------|--------------|---------------|---------------|
| **Pipeline** | CRM OR spreadsheet OR manual entries | Account + Contact | Shows if any deals exist |
| **Risks** | Accounts to score | Support tickets + Email + Notes | Improves with more signals |
| **Expansion** | Accounts | Billing + Product usage | Improves with revenue data |
| **Knowledge** | Documents to analyze | Multiple tools | Gets richer with more sources |

---

## 🎒 User Workspace Bag

```typescript
interface UserWorkspaceBag {
  user_id: string;
  
  // Modules in sidebar (ordered)
  active_modules: string[];
  
  // Widgets pinned to Home (from approved set)
  pinned_widgets: PinnedWidget[];
  
  // Per-module settings (filters, layout, columns)
  module_settings: Record<string, ModuleSettings>;
  
  // Layout preferences
  sidebar_collapsed: boolean;
}
```

---

## 🧩 Widget System

Widgets are small views from modules that can be pinned to Home:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    WIDGET PICKER (Add to Home)                               │
│                                                                              │
│  Only shows widgets from ENABLED modules with SUFFICIENT data:              │
│                                                                              │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                      │
│  │ 📊 Accounts   │ │ 📈 Pipeline   │ │ ⚠️ Risks     │                      │
│  │               │ │               │ │               │                      │
│  │ • Health Dist │ │ • Overview    │ │ • Critical    │                      │
│  │ • At Risk     │ │ • Closing Soon│ │   [locked]    │                      │
│  └───────────────┘ └───────────────┘ └───────────────┘                      │
│                                                                              │
│  Widgets have min coverage requirements:                                     │
│  • "sparse" = shows even with partial data                                   │
│  • "ready" = needs good data to be useful                                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖱️ Sidebar UX

```
┌─────────────────────┐
│  🏠 Home           │  ← Always first, cannot move
├─────────────────────┤
│  ═══ My Bag ═══════ │
│  📊 Accounts       │  ← Drag to reorder
│  👥 Contacts       │  ← Right-click to remove
│  📈 Pipeline       │
│  🗓️ Meetings       │
├─────────────────────┤
│  + Add Module      │  ← Opens catalog
└─────────────────────┘
```

**Rules:**

- `Home` always first, cannot be removed or moved
- Other modules can be reordered via drag/drop
- Right-click or swipe to remove from bag
- `+ Add Module` opens the catalog picker

---

## 📋 Default Bags by Role

| Role | Default Modules |
|------|-----------------|
| **CSM** | Home, Projects, Accounts, Contacts, Meetings, Pipeline, Risks |
| **Sales** | Home, Projects, Accounts, Contacts, Pipeline, Calendar, Meetings |
| **Founder** | Home, Projects, Accounts, Analytics, Team, Pipeline |
| **Ops/RevOps** | Home, Projects, Tasks, Docs, Calendar, Analytics |
| **Personal** | Home, Projects, Tasks, Notes, Calendar |

---

## 🔒 What We Control vs What User Controls

| Aspect | Controlled By | Notes |
|--------|---------------|-------|
| Module definitions | Us | Icons, routes, data contracts |
| Widget definitions | Us | What widgets exist, what data they need |
| Permission boundaries | Us | Who can see what data |
| Evidence model | Us | What explains each insight |
| Home skeleton | Us | 5 fixed blocks, always present |
| Module enablement | User | Add/remove from bag |
| Module ordering | User | Drag/drop in sidebar |
| Widget pinning | User | Pin from approved set |
| Per-module settings | User | Filters, layout, columns |

---

## 🚫 Anti-Patterns We Avoid

1. **Free-form dashboard builder** → Kills vision, creates support nightmare
2. **Arbitrary data queries** → Security risk, performance disaster
3. **Blank pages** → Always show sparse state + "what to connect next"
4. **Modules without contracts** → Every module must declare its data needs

---

## ✅ Summary

| Principle | Implementation |
|-----------|----------------|
| **Fixed skeleton** | Home always has 5 blocks |
| **Module catalog** | 14 capability modules shipped by us |
| **User bag** | User picks which modules to enable |
| **Constrained widgets** | Only pin from approved widget set |
| **Coverage gates** | Modules show sparse/ready based on data |
| **Role defaults** | Sensible starting bag per role |
| **Progressive unlock** | Intelligence modules unlock with data |

This gives users the **feeling of control** while keeping the **OS coherent**. 🎯
