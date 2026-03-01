# Growth-Aligned Schema Architecture

**Date**: 2026-02-10  
**Status**: Non-Negotiable Architecture Principle  
**Core Rule**: *"Anything that doesn't track to growth is just a number. Every schema must drill down to Goals, Metrics, and KPIs."*

---

## The Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE GROWTH ALIGNMENT MANDATE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EVERY PIECE OF DATA MUST ANSWER:                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   "How does this contribute to the organization's growth?"          │   │
│  │                                                                     │   │
│  │   OR                                                                │   │
│  │                                                                     │   │
│  │   "How does this help the client succeed?"                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  IF IT DOESN'T → IT'S JUST A MERE NUMBER, NOT REAL TRACKING                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Schema Architecture by Organization Type

### Type 1: Product-Based Organizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              PRODUCT ORGANIZATION SCHEMA HIERARCHY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  L0: REALITY (Raw Data)                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Stripe     │ │  HubSpot    │ │  Mixpanel   │ │  Support    │          │
│  │  Payments   │ │  CRM        │ │  Analytics  │ │  Tickets    │          │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│         │               │               │               │                  │
│         └───────────────┴───────────────┴───────────────┘                  │
│                         │                                                   │
│                         ▼                                                   │
│  L3: TRUTH (SSOT - Views Aware by Department)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │   SALES     │  │  PRODUCT    │  │   SUCCESS   │                 │   │
│  │  │   VIEW      │  │   VIEW      │  │    VIEW     │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ • Accounts  │  │ • Features  │  │ • Health    │                 │   │
│  │  │ • Deals     │  │ • Users     │  │ • Adoption  │                 │   │
│  │  │ • Pipeline  │  │ • Events    │  │ • NRR       │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ ALL LINKED  │  │ ALL LINKED  │  │ ALL LINKED  │                 │   │
│  │  │ TO GROWTH   │  │ TO GROWTH   │  │ TO GROWTH   │                 │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │   │
│  │         │                │                │                         │   │
│  │         └────────────────┼────────────────┘                         │   │
│  │                          ▼                                          │   │
│  │              ┌─────────────────────┐                                │   │
│  │              │  UNIFIED ENTITY     │                                │   │
│  │              │  (Cross-Department) │                                │   │
│  │              │                     │                                │   │
│  │              │  Customer_123:      │                                │   │
│  │              │  - Sales: ARR $50k  │                                │   │
│  │              │  - Product: 10 users│                                │   │
│  │              │  - Success: 85% health│                              │   │
│  │              └──────────┬──────────┘                                │   │
│  │                         ▼                                           │   │
│  │              ┌─────────────────────┐                                │   │
│  │              │  GROWTH DRILL-DOWN  │                                │   │
│  │              │                     │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    GOALS        │ │                                │   │
│  │              │ │ • $1M ARR       │ │                                │   │
│  │              │ │ • 1000 users    │ │                                │   │
│  │              │ │ • 95% retention │ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    METRICS      │ │                                │   │
│  │              │ │ • MRR: $85k     │ │                                │   │
│  │              │ │ • Churn: 2%     │ │                                │   │
│  │              │ │ • NRR: 110%     │ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │     KPIs        │ │                                │   │
│  │              │ │ • New MRR       │ │                                │   │
│  │              │ │ • Expansion     │ │                                │   │
│  │              │ │ • Contraction   │ │                                │   │
│  │              │ │ • Logo churn    │ │                                │   │
│  │              │ └─────────────────┘ │                                │   │
│  │              └─────────────────────┘                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Product Org: Key Growth Metrics

| Department | Primary Metrics | Drill-Down To |
|------------|-----------------|---------------|
| **Sales** | ARR, Pipeline, Win Rate | Goals: $1M ARR → Metrics: MRR $85k → KPIs: New/Expansion/Contraction |
| **Product** | Usage, Feature Adoption, DAU/MAU | Goals: 1000 users → Metrics: Activation 40% → KPIs: Feature adoption by tier |
| **Success** | NRR, Health Score, Time-to-Value | Goals: 110% NRR → Metrics: Health 85% → KPIs: Onboarding completion |
| **Engineering** | Uptime, Velocity, Bug Rate | Goals: 99.9% uptime → Metrics: Deploys/week → KPIs: MTTR, Bug resolution |

---

### Type 2: Service-Based Organizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SERVICE ORGANIZATION SCHEMA HIERARCHY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  L0: REALITY (Raw Data)                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Stripe     │ │  HubSpot    │ │   Asana     │ │   Harvest   │          │
│  │  Invoices   │ │  CRM        │ │  Projects   │ │  Time       │          │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│         │               │               │               │                  │
│         └───────────────┴───────────────┴───────────────┘                  │
│                         │                                                   │
│                         ▼                                                   │
│  L3: TRUTH (SSOT - Views Aware by Department)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │   CLIENT    │  │  DELIVERY   │  │  FINANCE    │                 │   │
│  │  │   VIEW      │  │   VIEW      │  │   VIEW      │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ • Clients   │  │ • Projects  │  │ • Invoices  │                 │   │
│  │  │ • Contracts │  │ • Tasks     │  │ • Revenue   │                 │   │
│  │  │ • Contacts  │  │ • Timesheets│  │ • Margins   │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ ALL LINKED  │  │ ALL LINKED  │  │ ALL LINKED  │                 │   │
│  │  │ TO SERVICES │  │ TO SERVICES │  │ TO SERVICES │                 │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │   │
│  │         │                │                │                         │   │
│  │         └────────────────┼────────────────┘                         │   │
│  │                          ▼                                          │   │
│  │              ┌─────────────────────┐                                │   │
│  │              │  SERVICE ENTITY     │                                │   │
│  │              │  (Project-Centric)  │                                │   │
│  │              │                     │                                │   │
│  │              │  Project_Alpha:     │                                │   │
│  │              │  - Client: Acme     │                                │   │
│  │              │  - Budget: $50k     │                                │   │
│  │              │  - Hours: 320/400   │                                │   │
│  │              │  - Margin: 35%      │                                │   │
│  │              └──────────┬──────────┘                                │   │
│  │                         ▼                                           │   │
│  │              ┌─────────────────────┐                                │   │
│  │              │  GROWTH DRILL-DOWN  │                                │   │
│  │              │                     │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    GOALS        │ │                                │   │
│  │              │ │ • $2M Revenue   │ │                                │   │
│  │              │ │ • 40% Margin    │ │                                │   │
│  │              │ │ • 95% Utilization│ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    METRICS      │ │                                │   │
│  │              │ │ • Utilization   │ │                                │   │
│  │              │ │ • Project Margin│ │                                │   │
│  │              │ │ • Client NRR    │ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │     KPIs        │ │                                │   │
│  │              │ │ • Billable hrs  │ │                                │   │
│  │              │ │ • Rate realization│ │                              │   │
│  │              │ │ • Project health│ │                                │   │
│  │              │ └─────────────────┘ │                                │   │
│  │              └─────────────────────┘                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Service Org: Key Growth Metrics

| Department | Primary Metrics | Drill-Down To |
|------------|-----------------|---------------|
| **Client** | Client NRR, Contract Value, Satisfaction | Goals: $2M revenue → Metrics: NRR 120% → KPIs: Upsells, Renewals |
| **Delivery** | Utilization, On-Time %, Quality Score | Goals: 95% utilization → Metrics: 85% billable → KPIs: Project health |
| **Finance** | Revenue, Margin, Cash Flow | Goals: 40% margin → Metrics: Project margin 35% → KPIs: Rate realization |
| **Talent** | Retention, Skills Growth, Satisfaction | Goals: 90% retention → Metrics: Utilization 85% → KPIs: Training hours |

---

### Type 3: Hybrid / General Business Organizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              GENERAL BUSINESS SCHEMA HIERARCHY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  L3: TRUTH (SSOT - Views Aware by Business Function)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │  BUSINESS   │  │  OPERATIONS │  │  FINANCIAL  │                 │   │
│  │  │   VIEW      │  │   VIEW      │  │   VIEW      │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ • Customers │  │ • Orders    │  │ • P&L       │                 │   │
│  │  │ • Leads     │  │ • Inventory │  │ • Cash Flow │                 │   │
│  │  │ • Vendors   │  │ • Fulfillment│ │ • Burn Rate │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │   │
│  │         │                │                │                         │   │
│  │         └────────────────┼────────────────┘                         │   │
│  │                          ▼                                          │   │
│  │              ┌─────────────────────┐                                │   │
│  │              │  GROWTH DRILL-DOWN  │                                │   │
│  │              │                     │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    GOALS        │ │                                │   │
│  │              │ │ • Revenue       │ │                                │   │
│  │              │ │ • Profitability │ │                                │   │
│  │              │ │ • Market Share  │ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │    METRICS      │ │                                │   │
│  │              │ │ • Revenue       │ │                                │   │
│  │              │ │ • COGS          │ │                                │   │
│  │              │ │ • Opex          │ │                                │   │
│  │              │ └────────┬────────┘ │                                │   │
│  │              │          ▼          │                                │   │
│  │              │ ┌─────────────────┐ │                                │   │
│  │              │ │     KPIs        │ │                                │   │
│  │              │ │ • Daily Sales   │ │                                │   │
│  │              │ │ • Conversion    │ │                                │   │
│  │              │ │ • Inventory turn│ │                                │   │
│  │              │ └─────────────────┘ │                                │   │
│  │              └─────────────────────┘                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Views-Aware Schema Design

### View Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIEWS-AWARE SCHEMA ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      VIEW REGISTRY                                   │   │
│  │                     (Per Department)                                 │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  VIEW: Sales                                                  │   │   │
│  │  │  ─────────                                                    │   │   │
│  │  │  Entities: accounts, contacts, deals, activities              │   │   │
│  │  │  Growth Focus: ARR, Pipeline, Win Rate                        │   │   │
│  │  │  Drill-Down: Goal → MRR → New/Expansion/Churn                 │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  VIEW: Product                                                │   │   │
│  │  │  ───────────                                                  │   │   │
│  │  │  Entities: features, users, events, feedback                  │   │   │
│  │  │  Growth Focus: Adoption, Retention, Engagement                │   │   │
│  │  │  Drill-Down: Goal → DAU/MAU → Feature usage                   │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  VIEW: Success (CS)                                           │   │   │
│  │  │  ─────────────────                                            │   │   │
│  │  │  Entities: health scores, tickets, onboarding, NPS            │   │   │
│  │  │  Growth Focus: NRR, Health, Time-to-Value                     │   │   │
│  │  │  Drill-Down: Goal → NRR → Expansion/Churn/Loyalty             │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    GROWTH ALIGNMENT ENGINE                           │   │
│  │                                                                      │   │
│  │  For each entity, automatically track:                               │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │ Entity: Account                                              │    │   │
│  │  │                                                              │    │   │
│  │  │ Growth Impact:                                               │    │   │
│  │  │ • ARR Contribution: $50,000                                  │    │   │
│  │  │ • Growth Potential: High (expansion opportunity)             │    │   │
│  │  │ • Risk Factor: Medium (renewal in 60 days)                   │    │   │
│  │  │ • Related Goal: $1M ARR (5% of goal)                         │    │   │
│  │  │                                                              │    │   │
│  │  │ Drill-Down Path:                                             │    │   │
│  │  │ Goal ($1M ARR)                                               │    │   │
│  │  │   └── MRR ($85k)                                             │    │   │
│  │  │         └── This Account ($4.2k MRR)                         │    │   │
│  │  │               └── KPIs: Uptime, Usage, Tickets               │    │   │
│  │  │                                                              │    │   │
│  │  │ IF THIS ENTITY IS LOST: -$4.2k MRR, -5% of goal progress     │    │   │
│  │  │                                                              │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Schema Entity: Growth-Aligned Fields

Every entity in the schema MUST include:

```typescript
// Universal Growth-Alignment Fields (All Entities)
interface GrowthAlignedEntity {
  // Core Identity
  id: string;
  entity_type: string;
  
  // Department View Assignment
  primary_view: 'sales' | 'product' | 'success' | 'delivery' | 'finance';
  secondary_views: string[];
  
  // Growth Alignment
  growth_impact: {
    metric_type: 'revenue' | 'usage' | 'retention' | 'efficiency';
    current_value: number;
    contribution_to_goal: number; // e.g., 0.05 = 5% of department goal
    goal_id: string; // Link to specific goal
  };
  
  // Drill-Down Path
  drill_down: {
    goal: string;       // e.g., "$1M ARR"
    metric: string;     // e.g., "MRR $85k"
    kpi: string;        // e.g., "This account $4.2k"
    health: string;     // e.g., "85% health score"
  };
  
  // Risk/Opportunity
  risk_factor: 'low' | 'medium' | 'high' | 'critical';
  opportunity_score: number; // 0-100
  
  // Related Goals
  related_goals: Array<{
    goal_id: string;
    goal_name: string;
    target: number;
    current: number;
    this_entity_contribution: number;
  }>;
}
```

---

## The Non-Negotiable Check

### Before Any Schema Change

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCHEMA VALIDATION CHECKLIST                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FOR EVERY NEW FIELD/ENTITY:                                                │
│                                                                             │
│  □ Does this track to a department view?                                    │
│    → Sales, Product, Success, Delivery, Finance, etc.                      │
│                                                                             │
│  □ Does this drill down to Goals?                                           │
│    → What's the organization trying to achieve?                            │
│                                                                             │
│  □ Does this connect to Metrics?                                            │
│    → How do we measure progress toward goals?                              │
│                                                                             │
│  □ Does this surface KPIs?                                                  │
│    → What actions drive the metrics?                                       │
│                                                                             │
│  □ If this entity were lost/gained, do we know the impact?                  │
│    → "This account = $50k ARR = 5% of quarterly goal"                      │
│                                                                             │
│  □ Can we answer: "How does this contribute to growth?"                     │
│    → Must have a clear answer                                              │
│                                                                             │
│  IF ANY CHECK FAILS → FIELD/ENTITY REJECTED                                 │
│                                                                             │
│  "It's just a number, not real tracking"                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation: Growth-Aware Views

### Example: Sales View with Growth Drill-Down

```typescript
// View: Sales
// Focus: Revenue Growth

interface SalesView {
  // Department-specific entities
  accounts: Account[];
  deals: Deal[];
  activities: Activity[];
  
  // Growth Alignment
  goals: {
    arr_target: 1000000; // $1M ARR
    arr_current: 850000;  // $850k
    arr_gap: 150000;      // $150k to go
  };
  
  metrics: {
    mrr: 85000;
    new_mrr: 15000;
    expansion_mrr: 5000;
    contraction_mrr: 2000;
    churn_mrr: 1000;
  };
  
  kpis: {
    pipeline_coverage: 3.2; // 3.2x quota
    avg_deal_size: 25000;
    sales_cycle_days: 45;
    win_rate: 0.28; // 28%
  };
  
  // Drill-down: Every account shows its contribution
  accounts: [{
    name: "Acme Corp";
    arr: 50000;
    contribution_to_goal: 0.05; // 5% of $1M
    health: "green";
    risk: "low";
    // If lost: -$50k ARR, -5% goal progress
  }];
}
```

### Example: Product View with Growth Drill-Down

```typescript
// View: Product
// Focus: User Growth & Engagement

interface ProductView {
  // Department-specific entities
  features: Feature[];
  users: User[];
  events: Event[];
  
  // Growth Alignment
  goals: {
    user_target: 1000;
    user_current: 850;
    activation_target: 0.40; // 40%
    activation_current: 0.35;
  };
  
  metrics: {
    dau: 320;
    mau: 680;
    dau_mau_ratio: 0.47; // 47%
    activation_rate: 0.35;
    feature_adoption_avg: 0.62;
  };
  
  kpis: {
    time_to_value_hours: 4.5;
    feature_retention_7d: 0.72;
    nps_score: 42;
    support_tickets_per_user: 0.3;
  };
}
```

---

## Summary

### The Rule

> **"Every schema entity must answer: How does this contribute to growth?"**

### The Drill-Down

```
Organization Type
    ↓
Department View (Sales/Product/Success/Delivery/Finance)
    ↓
Entity (Account/Deal/Feature/Project)
    ↓
Growth Impact (ARR, Usage, Margin)
    ↓
Goal Contribution ($50k = 5% of goal)
    ↓
Drill-Down Path (Goal → Metric → KPI)
```

### The Outcome

**No more "mere numbers." Every data point tracks to growth.**

---

**This is non-negotiable. All schemas must implement this pattern.**
