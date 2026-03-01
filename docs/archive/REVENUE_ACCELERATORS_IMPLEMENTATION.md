# Revenue (MRR) Accelerators Implementation Plan

## Overview

This document outlines the implementation plan for the **Revenue (MRR) Accelerators Pack**. This pack is a sellable add-on that provides deep financial insights on top of the core IntegrateWise OS data.

These accelerators run post-normalization, consuming data from the **Spine DB (SSOT)**, **Context Store**, and **Audit/Evidence Store** to generate financial metrics, signals, and situations.

---

## The 6 Revenue Accelerators

### 1. MRR/ARR Engine

**File**: `packages/accelerators/src/packs/revenue/mrr-arr-engine.ts`

**Purpose**: The foundational engine for all subscription-based financial metrics. It calculates MRR, ARR, NRR, and GRR, and tracks cohort movements.

**Features**:
- **MRR/ARR Calculation**: `sum(active_subscriptions.mrr)`
- **Net Revenue Retention (NRR)**: `(starting_mrr + expansion_mrr - churn_mrr - contraction_mrr) / starting_mrr`
- **Gross Revenue Retention (GRR)**: `(starting_mrr - churn_mrr - contraction_mrr) / starting_mrr`
- **Cohort Analysis**: Group customers by signup month/quarter and track their revenue over time.
- **Revenue Movements**: Classify MRR changes into New, Expansion, Contraction, Churn, and Reactivation.

**Input Data (from Spine DB)**:
- `subscriptions` (entity): `id`, `account_id`, `plan_id`, `mrr`, `start_date`, `end_date`, `status`
- `accounts` (entity): `id`, `signup_date`, `segment`
- `invoices` (entity): `id`, `account_id`, `subscription_id`, `amount`, `due_date`, `status`

**Output**:
- **Metrics**: `mrr`, `arr`, `nrr`, `grr`, `ltv`, `arpa`
- **Signals**: `New MRR`, `Expansion MRR`, `Contraction MRR`, `Churn MRR`
- **Entities**: `mrr_cohort`, `mrr_movement`

**Implementation Steps**:
1. Define `subscription` and `invoice` entities in the SSOT schema.
2. Create the `mrr-arr-engine.ts` accelerator file.
3. Implement logic to query subscriptions and calculate daily/monthly MRR/ARR snapshots.
4. Implement cohort grouping based on `accounts.signup_date`.
5. Implement logic to detect and classify MRR movements between periods.
6. Emit metrics to the Analytics API (`/api/analytics/*`).
7. Emit signals to the L2 Signals layer.

---

### 2. Renewal Risk Engine

**File**: `packages/accelerators/src/packs/revenue/renewal-risk-engine.ts`

**Purpose**: Proactively identify accounts at risk of churning at their renewal date and suggest next-best-actions.

**Features**:
- **Renewal Calendar**: A projected timeline of all upcoming subscription renewals.
- **Risk Factor Analysis**: Combines data from multiple sources to score renewal risk.
  - Low product usage (from Context Store)
  - Low engagement (meetings, emails)
  - Overdue invoices (from Spine DB)
  - High number of support tickets (from Context Store)
  - Key stakeholder churn (from Context Store)
- **Next-Best-Action Suggestions**: Propose actions like "Schedule QBR", "Offer discount", "Engage with exec sponsor".

**Input Data**:
- `subscriptions` (entity): `renewal_date`
- `accounts` (entity): `health_score` (from CustomerHealthScore accelerator)
- `context_store`: `product_usage_events`, `email_events`, `meeting_events`, `support_tickets`

**Output**:
- **Metrics**: `renewal_forecast_amount`, `at_risk_renewal_amount`
- **Signals**: `Upcoming Renewal`, `High Renewal Risk`
- **Situations**: `Account [X] has a high renewal risk due to low usage and stakeholder churn.`

**Implementation Steps**:
1. Create the `renewal-risk-engine.ts` accelerator file.
2. Implement logic to generate a renewal calendar from `subscriptions`.
3. Define risk factor weights (configurable).
4. Implement scoring logic that aggregates risk factors.
5. Implement a rules engine for next-best-action suggestions.
6. Emit risk scores and renewal forecasts to the Spine DB and Analytics API.
7. Emit `High Renewal Risk` situations to L2.

---

### 3. Expansion Engine

**File**: `packages/accelerators/src/packs/revenue/expansion-engine.ts`

**Purpose**: Identify upsell and cross-sell opportunities within the existing customer base.

**Features**:
- **Upsell Signals**: Detect when a customer is hitting usage limits (e.g., seats, API calls, storage).
- **Cross-sell Signals**: Identify customers who fit the profile for another product or service.
- **White-space Mapping**: For a given account, show which products they have vs. which they don't.
- **Feature Adoption Analysis**: Track adoption of key features to recommend premium tiers.

**Input Data**:
- `product_usage_events` (from Context Store): `user_id`, `feature_id`, `count`
- `subscriptions` (entity): `plan_id`, `limits`
- `accounts` (entity): `segment`, `industry`
- `ideal_customer_profile` (config): Defines which segments buy which products.

**Output**:
- **Metrics**: `expansion_mrr_pipeline`, `white_space_opportunity`
- **Signals**: `Upsell Opportunity`, `Cross-sell Opportunity`
- **Situations**: `Account [X] is a good candidate for Product [Y] based on their usage patterns.`

**Implementation Steps**:
1. Create the `expansion-engine.ts` accelerator file.
2. Implement logic to compare `product_usage_events` against `subscriptions.limits`.
3. Implement white-space analysis by comparing an account's current subscriptions to the full product catalog.
4. Implement a lookalike model to find cross-sell opportunities based on ICP.
5. Emit opportunities to the `expansion` domain and L1 Expansion view.

---

### 4. Pricing & Discount Guard

**File**: `packages/accelerators/src/packs/revenue/pricing-discount-guard.ts`

**Purpose**: Prevent margin leakage by enforcing pricing policies and flagging non-standard discounts for approval.

**Features**:
- **Discount Monitoring**: Scan all deals and subscriptions for discounts that exceed predefined thresholds.
- **Approval Workflows**: If a discount is too high, automatically trigger an approval workflow (using L2 HITL).
- **Margin Leakage Analysis**: Calculate the total revenue lost to non-standard discounts.
- **Policy-driven Thresholds**: Discount thresholds can be configured per product, region, and sales team.

**Input Data**:
- `deals` or `opportunities` (entity): `amount`, `discount_percentage`
- `quotes` (entity): `line_items`, `discounts`
- `pricing_policy` (config): `max_discount_standard`, `max_discount_manager`, `max_discount_vp`

**Output**:
- **Metrics**: `total_discount_given`, `margin_leakage_amount`
- **Signals**: `Non-standard Discount Applied`
- **Actions**: Trigger L2 approval workflow.

**Implementation Steps**:
1. Create the `pricing-discount-guard.ts` accelerator file.
2. Define `pricing_policy` as a configurable object.
3. Implement logic to scan new/updated deals and quotes.
4. Compare `discount_percentage` against the policy thresholds.
5. If a threshold is breached, call the `/api/approval/*` endpoint to create a HITL request.
6. The approval request should be routed to the appropriate manager based on the sales hierarchy in the `team` domain.

---

### 5. Collections Forecast Engine

**File**: `packages/accelerators/src/packs/revenue/collections-forecast-engine.ts`

**Purpose**: Improve cash flow predictability by forecasting collections and identifying overdue payment risks.

**Features**:
- **Cashflow Forecasting**: Project incoming cash based on invoice due dates and historical payment behavior.
- **Overdue Risk Scoring**: Score invoices based on the customer's payment history, current account health, and invoice age.
- **Invoice & Payment Sync**: Relies on data from accounting systems (e.g., Stripe, NetSuite, QuickBooks) via connectors.
- **Dunning Automation Suggestions**: Propose actions for overdue invoices (e.g., "Send reminder email", "Notify account owner").

**Input Data**:
- `invoices` (entity): `due_date`, `amount`, `status`
- `payments` (entity): `invoice_id`, `payment_date`, `amount`
- `accounts` (entity): `avg_days_to_pay`

**Output**:
- **Metrics**: `30_day_collections_forecast`, `dso` (Days Sales Outstanding)
- **Signals**: `Invoice Overdue`, `High Overdue Risk`
- **Actions**: Propose dunning actions via L2 Act.

**Implementation Steps**:
1. Create the `collections-forecast-engine.ts` accelerator file.
2. Ensure connectors for Stripe, NetSuite, etc., are normalizing data into `invoices` and `payments` entities.
3. Implement cashflow projection logic based on open invoices.
4. Implement overdue risk scoring based on payment history and other factors.
5. Emit metrics to a finance-specific dashboard in L1.

---

### 6. Commission & Quota Engine

**File**: `packages/accelerators/src/packs/revenue/commission-quota-engine.ts`

**Purpose**: Automate commission calculations and provide real-time visibility into quota attainment for sales teams.

**Features**:
- **Quota Attainment Tracking**: Real-time calculation of individual, team, and company-level quota attainment.
- **Commission Calculation**: Flexible rules engine to calculate commissions based on deal type, product, and accelerators.
- **Pipeline Coverage Analysis**: `(closed_won + open_pipeline) / quota`
- **Rep & Team Rollups**: Aggregate data for manager and executive dashboards.

**Input Data**:
- `deals` or `opportunities` (entity): `owner_id`, `amount`, `close_date`, `status`
- `team` (entity): `user_id`, `manager_id`
- `quotas` (config): `user_id`, `period`, `target_amount`
- `commission_rules` (config): `plan_id`, `rate`, `accelerators`

**Output**:
- **Metrics**: `quota_attainment_percentage`, `total_commissions_payable`, `pipeline_coverage`
- **Dashboards**: Leaderboards for sales reps and teams.

**Implementation Steps**:
1. Create the `commission-quota-engine.ts` accelerator file.
2. Define `quotas` and `commission_rules` as configurable objects.
3. Implement logic to join `deals` with `quotas` and `commission_rules`.
4. Calculate attainment and commissions, storing the results in new `attainment` and `commission_payout` entities in the Spine DB.
5. Create a dedicated L1 view for Sales (`/sales/performance`) to display leaderboards and attainment charts.

---

## Integration with Architecture

### Registration
All 6 accelerators will be registered in a new file `packages/accelerators/src/packs/revenue.ts` and imported into the main `packages/accelerators/src/index.ts`.

### Billing
The execution of these accelerators will be metered and billed. This requires adding metering hooks to each accelerator and wiring them to the `/billing/*` API.

```typescript
// Example: mrr-arr-engine.ts
import { meter } from '@/lib/billing';

export async function runMrrEngine(tenantId: string) {
  // ... calculation logic ...

  await meter({
    tenantId,
    accelerator: 'mrr-arr-engine',
    units: 1, // or based on computation
  });
}
```

### L1 UI
The output of these accelerators will surface in multiple L1 views:
- **Business View**: MRR/ARR, NRR, GRR, Cohorts
- **Sales View**: Quota Attainment, Pipeline Coverage, Commissions
- **CS View**: Renewal Risk, Expansion Opportunities
- **Finance View (New)**: A new context may be needed for finance teams to view Collections Forecasts and Margin Analysis.

### L2 Cognitive Layer
- **Signals**: All accelerators will emit signals (e.g., `High Renewal Risk`, `Upsell Opportunity`).
- **Situations**: Complex outputs will be framed as situations for L2 to handle.
- **Act**: The engines can propose actions for the L2 Act layer (e.g., "Trigger dunning workflow", "Request discount approval").
