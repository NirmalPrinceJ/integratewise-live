# RBAC-Based Unified Shell

## Core Principle

**One Shell + Role-Based View Assignment**

User sees ONLY what their role allows:
- **Personal View**: Individual contributors
- **Work View**: Determined by domain/industry category from RBAC

No manual switching. No multiple contexts. Role dictates view.

---

## User Journey

```
Login
  ↓
RBAC Check: What role?
  ↓
┌─────────────────┬─────────────────┐
│ Personal Role   │ Work Role       │
│ (Developer,     │ (CS, Sales,     │
│  Student, etc.) │  RevOps, etc.)  │
└────────┬────────┴────────┬────────┘
         ↓                 ↓
   Personal Shell    Work Shell
   (self-focused)    (domain-focused)
         ↓                 ↓
   Tasks, Calendar   Account Success
   Notes, Goals      Sales Pipeline
                     RevOps Forecast
```

---

## RBAC Role → View Mapping

| Role Category | Domain/Industry | View Assignment | Shell Injected |
|--------------|-----------------|-----------------|----------------|
| **Personal** | Personal Productivity | Personal | `PersonalShell` |
| **CS / CSM** | Customer Success | Work - CS | `AccountSuccessShell` |
| **Sales / AE** | Sales Operations | Work - Sales | `SalesOpsShell` |
| **RevOps** | Revenue Operations | Work - RevOps | `RevOpsShell` |
| **Marketing** | Marketing Ops | Work - Marketing | `MarketingShell` |
| **Finance** | Financial Ops | Work - Finance | `FinanceShell` |
| **Engineering** | Product/Engineering | Work - Engineering | `EngineeringShell` |
| **Admin** | Platform Admin | Work - Admin | `AdminShell` |

---

## Shell Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  UNIFIED SHELL (Single Container)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┬────────────────────────────────────────────┐ │
│  │          │  TOP BAR                                    │ │
│  │          │  [Logo] [Workspace Label]      [🔔] [👤]   │ │
│  │          │                                             │ │
│  │   MAIN   ├────────────────────────────────────────────┤ │
│  │  NAV     │                                             │ │
│  │          │    PLUGGABLE DOMAIN SHELL                   │ │
│  │ • Home   │                                             │ │
│  │ • Today  │    ┌─────────────────────────────────┐     │ │
│  │ • Tasks  │    │                                 │     │ │
│  │          │    │  IF role=cs:                    │     │ │
│  │ • Module1│    │    AccountSuccessShell          │     │ │
│  │ • Module2│    │    - Accounts view              │     │ │
│  │ • Module3│    │    - Health scores              │     │ │
│  │          │    │    - Risk register (deep)       │     │ │
│  │ • L2 AI  │    │                                 │     │ │
│  │          │    │  IF role=sales:                 │     │ │
│  │ • Settings│    │    SalesOpsShell                │     │ │
│  │          │    │    - Pipeline kanban            │     │ │
│  │          │    │    - Deal rooms                 │     │ │
│  │          │    │                                 │     │ │
│  │          │    │  IF role=personal:              │     │ │
│  │          │    │    PersonalShell                │     │ │
│  │          │    │    - My tasks                   │     │ │
│  │          │    │    - My calendar                │     │ │
│  │          │    │                                 │     │ │
│  │          │    └─────────────────────────────────┘     │ │
│  │          │                                             │ │
│  └──────────┴────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Role-Based Navigation

### Personal Role Navigation
```typescript
const PERSONAL_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'ai', label: 'AI Assistant', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];
```

### CS Role Navigation
```typescript
const CS_NAV = [
  { id: 'home', label: 'CS Home', icon: Home },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'accounts', label: 'Accounts', icon: Building2 },
  { id: 'health', label: 'Health Scores', icon: HeartPulse },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  // Deep Dive Section (only visible if role permits)
  { 
    id: 'deep-dive', 
    label: 'Deep Dive', 
    icon: Layers,
    children: [
      { id: 'account-master', label: 'Account Master' },
      { id: 'risk-register', label: 'Risk Register' },
      { id: 'success-plans', label: 'Success Plans' },
      // ... 14 more deep views
    ]
  },
  { id: 'ai', label: 'AI Assistant', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];
```

### Sales Role Navigation
```typescript
const SALES_NAV = [
  { id: 'home', label: 'Sales Home', icon: Home },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
  { id: 'deals', label: 'Deals', icon: DollarSign },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'activities', label: 'Activities', icon: Phone },
  { id: 'forecasts', label: 'Forecasts', icon: BarChart3 },
  { id: 'ai', label: 'AI Assistant', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];
```

---

## RBAC-Based Routing

### Route Guard
```typescript
// middleware.ts or layout
export default function RBACGuard({ children }) {
  const { user, role } = useAuth();
  const { domain } = useTenant();
  
  // Role determines view
  const assignedView = getViewForRole(role, domain);
  
  // Redirect if trying to access unauthorized view
  if (!canAccess(role, pathname)) {
    return redirect(`/redirect-to-assigned-view`);
  }
  
  return children;
}
```

### Route Structure
```typescript
// app/(app)/layout.tsx
export default function AppLayout({ children }) {
  const { role } = useRBAC();
  
  // Single shell, injects appropriate domain
  return (
    <UnifiedShell role={role}>
      {children}
    </UnifiedShell>
  );
}

// app/(app)/page.tsx (Home)
export default function HomePage() {
  const { role } = useRBAC();
  
  // Redirect to role-appropriate home
  switch(role) {
    case 'personal': return <PersonalDashboard />;
    case 'cs': return <CSDashboard />;
    case 'sales': return <SalesDashboard />;
    case 'revops': return <RevOpsDashboard />;
    default: return <GenericDashboard />;
  }
}
```

---

## RBAC Permission Matrix

| Feature | Personal | CS | Sales | RevOps | Admin |
|---------|----------|-----|-------|--------|-------|
| **Personal Views** | | | | | |
| My Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| My Calendar | ✅ | ✅ | ✅ | ✅ | ✅ |
| My Notes | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Domain Views** | | | | | |
| Accounts List | ❌ | ✅ | ❌ | ✅ | ✅ |
| Health Scores | ❌ | ✅ | ❌ | ✅ | ✅ |
| Pipeline | ❌ | ❌ | ✅ | ✅ | ✅ |
| Deals | ❌ | ❌ | ✅ | ❌ | ✅ |
| Forecasting | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Deep Dive Views** | | | | | |
| Risk Register | ❌ | ✅ | ❌ | ❌ | ✅ |
| Account Master | ❌ | ✅ | ❌ | ❌ | ✅ |
| Deal Rooms | ❌ | ❌ | ✅ | ❌ | ✅ |
| Cohort Analysis | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Admin Views** | | | | | |
| User Management | ❌ | ❌ | ❌ | ❌ | ✅ |
| RBAC Config | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tenant Settings | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Component Architecture

### UnifiedShell (Single Container)
```typescript
interface UnifiedShellProps {
  role: Role;           // 'personal' | 'cs' | 'sales' | 'revops' | 'admin'
  children: ReactNode;
}

export function UnifiedShell({ role, children }: UnifiedShellProps) {
  const navItems = getNavForRole(role);
  const DomainShell = getDomainShell(role);
  
  return (
    <div className="h-screen flex">
      {/* Main Nav - Role-based */}
      <MainSidebar items={navItems} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar role={role} />
        
        {/* Content - Domain Shell Injected */}
        <main className="flex-1 overflow-auto">
          <DomainShell>
            {children}
          </DomainShell>
        </main>
      </div>
      
      {/* L2 Intelligence */}
      <IntelligencePanel role={role} />
    </div>
  );
}
```

### Domain Shell Selector
```typescript
function getDomainShell(role: Role) {
  switch(role) {
    case 'personal': return PersonalShell;
    case 'cs': return AccountSuccessShell;
    case 'sales': return SalesOpsShell;
    case 'revops': return RevOpsShell;
    case 'marketing': return MarketingShell;
    case 'admin': return AdminShell;
    default: return GenericShell;
  }
}
```

---

## Data Flow

```
User logs in
  ↓
Auth service validates
  ↓
RBAC service fetches role
  ↓
Tenant service gets domain
  ↓
View Resolver: role + domain = assigned view
  ↓
UnifiedShell renders with:
  - Role-based navigation
  - Domain shell injected
  - Permissions enforced
  ↓
User sees ONLY what they should see
```

---

## Implementation Checklist

### 1. RBAC Setup
- [ ] Define roles in database
- [ ] Role-to-domain mapping
- [ ] Permission matrix
- [ ] Middleware guard

### 2. Unified Shell
- [ ] Single shell component
- [ ] Role-based nav generator
- [ ] Domain shell injector
- [ ] Permission-based rendering

### 3. Domain Shells (V2 Integration)
- [ ] PersonalShell
- [ ] AccountSuccessShell (17 views)
- [ ] SalesOpsShell (7 views)
- [ ] RevOpsShell (8 views)
- [ ] MarketingShell
- [ ] AdminShell

### 4. Routing
- [ ] Role-based redirects
- [ ] Protected routes
- [ ] Deep view routing
- [ ] 403 handling

### 5. Testing
- [ ] Test each role
- [ ] Verify navigation
- [ ] Check permissions
- [ ] Validate deep views

---

## Summary

| Aspect | Implementation |
|--------|----------------|
| **Shell Count** | ONE UnifiedShell |
| **Views per User** | Personal OR Work (assigned) |
| **Work View Source** | RBAC role + domain category |
| **Navigation** | Role-based, auto-generated |
| **Permissions** | Enforced at shell level |
| **Deep Views** | Role determines access |

**NOT**: Multiple shells, manual switching, all domains accessible  
**YES**: One shell, role-assigned, permission-enforced
