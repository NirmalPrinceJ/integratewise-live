# Dual-Context Growth Architecture

**Date**: 2026-02-10  
**Author**: Based on CSM (Customer Success Manager) Experience  
**Core Principle**: *"Every metric must serve either the product company OR the client company. If it serves neither, it's just a number."*

---

## The Two-Context Reality

From CSM experience, there are **TWO companies** in every B2B relationship:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE DUAL-CONTEXT REALITY                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CONTEXT 1: THE PRODUCT COMPANY (Vendor/Seller)                             │
│  ─────────────────────────────────────────────                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  IntegrateWise (the product)                                        │   │
│  │  └── Manufacturing Company: IntegrateWise Inc.                      │   │
│  │                                                                     │   │
│  │  GOALS:                                                             │   │
│  │  • $10M ARR                                                         │   │
│  │  • 120% Net Revenue Retention (NRR)                                 │   │
│  │  • <5% Logo Churn                                                   │   │
│  │                                                                     │   │
│  │  METRICS:                                                           │   │
│  │  • New ARR: $2M/quarter                                             │   │
│  │  • Expansion ARR: $500k/quarter                                     │   │
│  │  • Churned ARR: $200k/quarter                                       │   │
│  │                                                                     │   │
│  │  KPIs:                                                              │   │
│  │  • Sales cycle length                                               │   │
│  │  • Time-to-value for customers                                      │   │
│  │  • Product adoption scores                                          │   │
│  │                                                                     │   │
│  │  WHO CARES: CEO, CRO, VP Sales, CSMs, Product Team                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                    ◄──────────────────────────►            │
│                                          B2B RELATIONSHIP                   │
│                                    ◄──────────────────────────►            │
│                                                                             │
│  CONTEXT 2: THE CLIENT COMPANY (Customer/User)                              │
│  ─────────────────────────────────────────────                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Acme Corp (using IntegrateWise)                                    │   │
│  │                                                                     │   │
│  │  GOALS:                                                             │   │
│  │  • Reduce customer churn by 20%                                     │   │
│  │  • Improve team productivity by 30%                                 │   │
│  │  • Save 10 hours/week on manual reporting                           │   │
│  │                                                                     │   │
│  │  METRICS:                                                           │   │
│  │  • Customer retention rate: 85% → 90%                               │   │
│  │  • Tasks completed per employee: 20 → 26/week                       │   │
│  │  • Reporting time: 12hrs → 2hrs/week                                │   │
│  │                                                                     │   │
│  │  KPIs:                                                              │   │
│  │  • Time-to-insight (from data to decision)                          │   │
│  │  • Data completeness across tools                                   │   │
│  │  • Cross-tool workflow efficiency                                   │   │
│  │                                                                     │   │
│  │  WHO CARES: CEO, COO, Department Heads, End Users                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The CSM Insight: Why This Matters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE CSM DILEMMA                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AS A CSM, YOU'RE STUCK BETWEEN TWO WORLDS:                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  YOUR COMPANY SAYS:                                                 │   │
│  │  "This account is at risk. They haven't logged in for 30 days.      │   │
│  │   Their renewal is in 60 days. We need to save this $50k ARR."      │   │
│  │                                                                     │   │
│  │  → Internal metric: Login frequency                                 │   │
│  │  → Internal goal: Prevent churn, save ARR                           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  THE CLIENT SAYS:                                                   │   │
│  │  "We haven't logged in because we don't see value yet.              │   │
│  │   We need to see how this helps OUR customer retention,             │   │
│  │   not just your product features."                                  │   │
│  │                                                                     │   │
│  │  → Client metric: Their customer retention                          │   │
│  │  → Client goal: Improve their business                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  THE PROBLEM:                                                               │
│  Most tools track ONLY the vendor's perspective (logins, feature usage).    │
│  They don't track the CLIENT'S outcomes (did their retention improve?).     │
│                                                                             │
│  THE INTEGRATEWISE SOLUTION:                                                │
│  Track BOTH contexts and show the connection:                               │
│                                                                             │
│  "Acme Corp used IntegrateWise to identify at-risk customers →             │
│   Intervened with personalized outreach →                                  │
│   THEIR customer retention improved 15% →                                  │
│   THEY renew and expand (OUR NRR improves)"                                │
│                                                                             │
│  BOTH SIDES WIN.                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Dual-Context Schema Design

### Every Entity Must Declare Its Context

```typescript
// Universal Dual-Context Growth Fields
interface DualContextEntity {
  // Identity
  id: string;
  entity_type: string;
  
  // Context Declaration (REQUIRED)
  contexts: {
    vendor: boolean;      // Does this serve the product company?
    client: boolean;      // Does this serve the client company?
  };
  
  // If serving VENDOR (Product Company)
  vendor_growth?: {
    metric_type: 'arr' | 'nrr' | 'retention' | 'adoption';
    contribution_to_arr: number;      // e.g., $50,000
    contribution_to_goal: number;     // e.g., 0.05 = 5% of ARR goal
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    expansion_potential: number;      // Upsell opportunity
    renewal_date?: string;            // Critical for CSM
    health_score: number;             // 0-100
  };
  
  // If serving CLIENT (Customer Company)
  client_growth?: {
    metric_type: 'efficiency' | 'revenue' | 'retention' | 'productivity';
    client_goal_id: string;           // Link to client's goal
    client_goal_description: string;  // "Reduce churn by 20%"
    contribution_to_client_goal: number; // e.g., 0.15 = 15% of their goal
    client_outcome: string;           // "Improved retention 15%"
    roi_for_client: number;           // Hours saved, revenue gained
  };
  
  // THE BRIDGE: How vendor success connects to client success
  mutual_success?: {
    vendor_benefit: string;           // "$50k ARR retained"
    client_benefit: string;           // "15% retention improvement"
    causation: string;                // "Client used X feature → achieved Y outcome"
  };
}
```

---

## Context-Aware Views by Role

### View 1: CSM Dashboard (Dual Context)

```typescript
// The CSM needs to see BOTH contexts
interface CSMDashboard {
  // VENDOR CONTEXT (My company's goals)
  my_book_of_business: {
    total_arr: 2500000;           // $2.5M ARR under management
    arr_at_risk: 450000;          // $450k at risk this quarter
    arr_expanding: 300000;        // $300k expansion potential
    nrr_target: 1.20;             // 120% NRR goal
    nrr_current: 1.15;            // 115% NRR current
  };
  
  // CLIENT CONTEXT (My customers' goals)
  client_outcomes: {
    total_clients: 25;
    clients_achieving_goals: 18;  // 72% success rate
    clients_at_risk: 4;           // 16% need intervention
    avg_roi_delivered: 3.5;       // 3.5x ROI on average
  };
  
  // THE CONNECTION: Which clients should I focus on?
  priority_accounts: [{
    name: "Acme Corp";
    
    // Vendor perspective: High risk to OUR revenue
    arr: 150000;
    renewal_in_days: 45;
    risk_level: "high";
    
    // Client perspective: They're not seeing value
    client_goal: "Improve customer retention 20%";
    client_progress: 0.05;        // Only 5% achieved
    last_login: "2026-01-15";     // 25 days ago
    
    // The bridge: Why they're not engaged
    insight: "They're not using the churn prediction feature. 
              Their actual customer retention is dropping (we can see this 
              from their connected tools). If we help them fix this, 
              they renew AND we have a case study.";
    
    // Suggested action
    recommended_action: "Schedule business review. Show them the 
                         15 at-risk customers they're missing.";
  }];
}
```

### View 2: Executive Dashboard (Vendor Context)

```typescript
// CEO/CRO view: Company growth
interface ExecutiveDashboard {
  // Goals
  arr_goal: 10000000;             // $10M ARR
  arr_current: 8500000;           // $8.5M current
  
  // Metrics
  new_arr_this_quarter: 1200000;
  expansion_arr_this_quarter: 400000;
  churned_arr_this_quarter: 200000;
  
  // KPIs
  nrr: 1.18;                      // 118% NRR
  logo_churn_rate: 0.04;          // 4% logo churn
  cac_payback_months: 14;
  
  // But ALSO see client outcomes (why we're growing)
  client_success_rate: 0.72;      // 72% of clients hitting goals
  avg_client_roi: 3.5;            // 3.5x average ROI
  top_success_stories: string[];  // Case studies
}
```

### View 3: Client Dashboard (Client Context)

```typescript
// The CLIENT sees their own growth, not yours
interface ClientDashboard {
  // Their goals (what they care about)
  my_goals: [{
    description: "Reduce customer churn by 20%";
    target: 0.20;
    current: 0.15;                // 15% reduction achieved
    status: "on_track";
  }, {
    description: "Save 10 hours/week on reporting";
    target: 10;
    current: 8;                   // 8 hours saved so far
    status: "at_risk";
  }];
  
  // Their metrics (their business, not yours)
  my_metrics: {
    customer_retention_rate: 0.90;  // Up from 0.75
    reporting_time_hours_per_week: 4; // Down from 12
    team_productivity_score: 85;    // Up from 65
  };
  
  // Connection: How IntegrateWise helped
  value_delivered: {
    feature_used: "Churn prediction";
    action_taken: "Intervened with 15 at-risk customers";
    outcome: "Retained 12 customers, 15% improvement";
    roi: "$180k revenue retained";
  };
}
```

---

## The Non-Negotiable Validation

### For Every Schema Entity, Ask:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DUAL-CONTEXT VALIDATION CHECKLIST                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FOR THIS ENTITY/FIELD:                                                     │
│                                                                             │
│  □ Does this help THE PRODUCT COMPANY (IntegrateWise)?                      │
│    → Does it track to ARR, NRR, retention, or expansion?                    │
│    → Does it help CSMs prioritize accounts?                                 │
│    → Does it help Sales close deals?                                        │
│                                                                             │
│  OR                                                                         │
│                                                                             │
│  □ Does this help THE CLIENT COMPANY (Acme Corp)?                           │
│    → Does it track to their business goals?                                 │
│    → Does it improve their efficiency/revenue/retention?                    │
│    → Does it deliver measurable ROI for them?                               │
│                                                                             │
│  □ OR BOTH? (Ideal)                                                         │
│    → "Acme improved their retention 15% → They renew → We hit NRR goal"     │
│                                                                             │
│  IF NEITHER → REJECT. THIS IS JUST A NUMBER.                               │
│                                                                             │
│  "As a CSM, I need to show my boss why this account matters (vendor context)│
│   AND show the client why they should renew (client context).               │
│   If the data doesn't serve at least one of these, it's useless to me."     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Real-World Example: Account Entity

```typescript
// Account: Acme Corp (Client of IntegrateWise)
{
  id: "account_acme_001",
  name: "Acme Corp",
  
  contexts: {
    vendor: true,      // Yes, this serves IntegrateWise Inc.
    client: true       // Yes, this serves Acme Corp
  },
  
  // CONTEXT 1: Vendor Perspective (IntegrateWise Inc.)
  vendor_growth: {
    arr: 150000,                    // $150k ARR from this account
    contribution_to_arr_goal: 0.015, // 1.5% of $10M goal
    renewal_date: "2026-03-15",      // Renewal in 45 days
    risk_level: "high",              // Risk: might churn
    expansion_potential: 50000,      // Could expand $50k
    health_score: 62,                // Health: declining
    
    // CSM-specific
    last_engagement: "2026-01-20",
    csm_owner: "sarah@integratewise.com",
    at_risk_reason: "Low feature adoption, no recent logins"
  },
  
  // CONTEXT 2: Client Perspective (Acme Corp)
  client_growth: {
    client_goal_id: "goal_churn_reduction",
    client_goal_description: "Reduce customer churn by 20% in Q1",
    contribution_to_client_goal: 0.15,  // 15% of their goal achieved
    
    client_metrics: {
      customer_retention_before: 0.75,   // 75% retention
      customer_retention_current: 0.90,  // 90% now
      improvement: 0.15                  // 15% improvement
    },
    
    roi_for_client: {
      hours_saved_per_week: 8,
      revenue_retained: 180000,          // $180k customer revenue
      team_productivity_gain: "30%"
    },
    
    client_outcome: "Improved customer retention 15%, on track for 20%"
  },
  
  // THE BRIDGE: Why this matters to BOTH
  mutual_success: {
    vendor_benefit: "$150k ARR retained, expansion opportunity $50k",
    client_benefit: "$180k revenue retained, 15% churn reduction",
    causation: "Acme used IntegrateWise churn prediction → Identified 15 at-risk customers → Personalized outreach → 12 retained → 15% improvement",
    case_study_worthy: true,
    reference_willing: true
  },
  
  // If we lose this account...
  impact_if_lost: {
    vendor_impact: "-$150k ARR, -1.5% of goal, CSM misses quota",
    client_impact: "Loses tool that helped improve retention 15%, may revert to 75% retention, $180k at risk"
  }
}
```

---

## The CSM's Daily Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    A DAY IN THE LIFE OF A CSM (With IntegrateWise)          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  9:00 AM - Open IntegrateWise CSM Dashboard                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  PRIORITY 1: Acme Corp (HIGH RISK)                                  │   │
│  │                                                                     │   │
│  │  ⚠️  Vendor Alert: No login 25 days, renewal in 45 days            │   │
│  │                                                                     │   │
│  │  💡 Client Insight: Their actual customer churn is UP 5%           │   │
│  │     (visible from their connected HubSpot)                          │   │
│  │                                                                     │   │
│  │  🔧 The Bridge: They're not using our churn prediction feature     │   │
│  │     If they did → Could identify at-risk customers → Reduce churn   │   │
│  │                                                                     │   │
│  │  📞 Suggested Action: Call them. Show the 15 customers they're     │   │
│  │     about to lose. Demo the intervention workflow.                 │   │
│  │                                                                     │   │
│  │  💰 Outcome if successful:                                         │   │
│  │     • Vendor: $150k ARR retained                                   │   │
│  │     • Client: $180k revenue saved, 15% churn reduction             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  10:30 AM - Call with Acme Corp CEO                                         │
│                                                                             │
│  CSM: "I noticed your customer churn is up 5% this quarter.                │
│        You're trying to reduce it 20%, right?"                              │
│                                                                             │
│  CEO: "Yes, it's our top priority. We're struggling to identify            │
│        which customers are at risk early enough."                           │
│                                                                             │
│  CSM: "Let me show you something. IntegrateWise analyzed your             │
│        connected tools and identified 15 customers showing churn signals:   │
│        • No login 14+ days                                                  │
│        • Support tickets with negative sentiment                            │
│        • Invoice delays                                                     │
│                                                                             │
│        Here's the recommended intervention for each..."                     │
│                                                                             │
│  [Shows AI-generated playbooks for each at-risk customer]                  │
│                                                                             │
│  CEO: "This is exactly what we need! Why didn't we see this in the tool?"  │
│                                                                             │
│  CSM: "The feature is there, but it looks like your team hasn't enabled    │
│        the HubSpot integration. Let me help you set that up now."          │
│                                                                             │
│  [Enables integration, churn prediction activates]                         │
│                                                                             │
│  2:00 PM - Follow-up email to boss (VP Customer Success)                    │
│                                                                             │
│  "Saved Acme Corp today. $150k ARR was at risk because they weren't        │
│  using churn prediction. Showed them the 15 at-risk customers they         │
│  were missing. They're now fully activated. Case study potential."         │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  WITHOUT DUAL-CONTEXT AWARENESS:                                           │
│  • CSM sees: "Acme hasn't logged in 25 days" → Generic "check-in" email   │
│  • Misses: The actual business problem (churn)                             │
│  • Result: Account churns, CSM surprised                                   │
│                                                                             │
│  WITH DUAL-CONTEXT AWARENESS:                                              │
│  • CSM sees: "Acme not using tool → Their churn is up → Bridge the gap"   │
│  • Action: Show value, solve their problem                                 │
│  • Result: Renewal saved, expansion potential, case study                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: The CSM Rule

> **"As a CSM, I need to justify this account's existence to my boss (vendor context) AND prove value to the customer (client context). Every piece of data must serve at least one of these. If it serves neither, it's just noise."**

### The Schema Mandate

```
Every entity MUST answer:

1. "How does this help the PRODUCT COMPANY grow?"
   → ARR, NRR, retention, expansion

2. "How does this help the CLIENT COMPANY succeed?"
   → Their goals, their metrics, their ROI

3. Ideally: "How does helping the client help the vendor?"
   → The mutual success bridge

If an entity answers NONE of these → REJECT IT.
```

---

**This is non-negotiable. Built from real CSM experience.**
