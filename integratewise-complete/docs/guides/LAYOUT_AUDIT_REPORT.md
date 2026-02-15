# IntegrateWise OS - Layout Alignment Audit Report

## Executive Summary

Audited **24 internal pages** across the IntegrateWise OS and standardized layouts into **3 unified templates** to ensure consistency.

---

## Audit Findings

### Pages Audited

1. **User Journey (10 pages)**
   - Today, Goals, Metrics, Tasks, IQ Hub, Spine, Shadow, Insights, Integrations, Knowledge

2. **Business Domain (7 pages)**
   - Clients, Products, Services, CRM/Leads, Pipeline, Website, Marketing/Content

3. **Customer Success (1 page)**
   - Health

4. **Admin (6 pages)**
   - Users, RBAC, Billing, Feature Flags, System Health, Audit Logs

---

## Layout Inconsistencies Found

### 1. **Container Padding**
- **Issue**: Mixed `p-6`, `p-8`, `p-12`
- **Fix**: Standardized to `p-6` for all pages

### 2. **Content Spacing**
- **Issue**: Inconsistent gaps (`mb-4`, `mb-6`, `mb-8`, `space-y-4`, `space-y-6`)
- **Fix**: Standardized to `space-y-6` for page-level, `gap-4` for grids

### 3. **Card Styling**
- **Issue**: Repeated `bg-white rounded-xl border border-gray-200 p-5`
- **Fix**: Created reusable `<Card>` and `<Section>` components

### 4. **Grid Columns**
- **Issue**: Mixed `grid-cols-2`, `grid-cols-3`, `grid-cols-4` without pattern
- **Fix**: Defined semantic grid layouts:
  - **2 columns**: Large cards with details (Clients, Goals)
  - **3 columns**: Medium cards (Products, Services)  
  - **4 columns**: Small metric cards (Stats)

### 5. **Empty States**
- **Issue**: Inconsistent centering, padding, and icon sizes
- **Fix**: Created `<StandardEmptyState>` component

### 6. **Header Actions**
- **Issue**: Mixed button colors, sizes, and icon placements
- **Fix**: Standardized primary action button style

---

## Standardized Layout System

### 3 Core Layout Templates

#### 1. **DashboardLayout** 
For metric-heavy pages with charts and cards.

**Used by:**
- Today (TODAY-011)
- Metrics (METRICS-016)

**Structure:**
```
<DashboardLayout>
  <div className="grid grid-cols-4 gap-4"> {/* Metric Cards */}
  <div className="grid grid-cols-3 gap-4"> {/* Charts */}
  <Section> {/* Content Sections */}
</DashboardLayout>
```

#### 2. **GridLayout**
For card-based views (clients, products, goals).

**Used by:**
- Clients (BUSINESS-018)
- Products (BUSINESS-018)
- Services (BUSINESS-018)
- Goals (GOALS-015)

**Structure:**
```
<GridLayout columns={2|3|4}>
  <Card> {/* Individual items */}
</GridLayout>
```

#### 3. **ListLayout**
For table/list views (tasks, users, pipeline).

**Used by:**
- Tasks (TASKS-012)
- User Management (USERADMIN-021)
- Audit Logs (AUDIT-029)
- CRM/Leads
- Pipeline

**Structure:**
```
<ListLayout>
  <table> or <div className="divide-y">
</ListLayout>
```

---

## Standardized Components

### 1. **Card**
```tsx
<Card hover> // Reusable white card with border
  {children}
</Card>
```

### 2. **Section**
```tsx
<Section title="Optional Title">
  {children}
</Section>
```

### 3. **StatCard**
```tsx
<StatCard 
  label="Total Tasks" 
  value={42} 
  color="green"
/>
```

### 4. **StandardEmptyState**
```tsx
<StandardEmptyState
  icon={<Icon />}
  title="No items yet"
  description="Add your first..."
  action={<Button />}
/>
```

---

## Design Tokens

### Spacing Scale
- **Page padding**: `p-6`
- **Section gaps**: `space-y-6`
- **Card gaps**: `gap-4`
- **Content margins**: `mb-4` (small), `mb-6` (medium)

### Grid Breakpoints
- **4 columns**: Stats, small metrics
- **3 columns**: Products, services, medium cards
- **2 columns**: Clients, goals, large cards

### Border Radius
- **Cards**: `rounded-xl` (0.75rem)
- **Buttons**: `rounded-lg` (0.5rem)
- **Badges**: `rounded` (0.25rem)

### Card Padding
- **Standard**: `p-5` (1.25rem)
- **Compact**: `p-4` (1rem)
- **Large**: `p-6` (1.5rem)

---

## Implementation Status

### ✅ Completed
1. Created layout template components (`components/layouts/page-layouts.tsx`)
2. Standardized Today page (TODAY-011)

### ⏳ In Progress
- Applying templates to remaining 23 pages

### 📋 Next Steps
1. Update all pages to use new layout templates
2. Remove duplicate styling code
3. Test responsive behavior
4. Verify accessibility compliance

---

## Benefits

1. **Consistency**: All pages follow same visual patterns
2. **Maintainability**: Single source of truth for layouts
3. **Faster Development**: Reusable templates speed up new page creation
4. **Smaller Bundle**: Less CSS duplication
5. **Easier Updates**: Change layout once, affects all pages

---

## Layout Decision Tree

```
New Page?
├─ Has metrics/charts? → DashboardLayout
├─ Has cards in grid? → GridLayout (choose columns)
├─ Has table/list? → ListLayout
└─ Custom layout? → PageContainer (base template)
```

---

**Report Generated**: January 19, 2026  
**Status**: Layout system created, rollout in progress
