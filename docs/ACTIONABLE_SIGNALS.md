# Actionable Signals Specification

## Overview

This document defines the **numbers-first, role-aligned signals** that drive IntegrateWise OS.

Each signal has:

- **Metric & Formula** – How to compute
- **Thresholds & Bands** – When to alert
- **Situation Template** – What to say
- **Action Templates** – What to guide

---

## 1. Sales Workspace

### S1: Pipeline Coverage Ratio

| Field | Value |
|-------|-------|
| **Signal ID** | `ic_sales_pipeline_coverage_ratio` |
| **Formula** | `open_pipeline_value_next_90d / quarterly_quota` |
| **Unit** | ratio |

**Thresholds:**

| Band | Range | Meaning |
|------|-------|---------|
| 🔴 Critical | < 1.5× | Severe pipeline gap |
| 🟠 Risk | 1.5× – 2.5× | Below healthy coverage |
| 🟢 Healthy | 2.5× – 3.5× | On track |
| 💪 Strong | > 3.5× | Excellent coverage |

**Situation Template:**
> "Your next-90-day pipeline is at **{coverage_ratio}×** vs target **{target_ratio}×**.  
> At current win rate **{win_rate}%**, you are projected to hit **{projected_attainment}%** of next quarter bookings."

**Guided Actions:**

1. "Book **5 new discovery calls** this week with accounts in segment X where website intent = high."
2. "Revive **3 stalled opps** from [list], prioritize this week."
3. "Ask manager to review prospecting strategy."

---

### S2: Stale Deals (Late Stage)

| Field | Value |
|-------|-------|
| **Signal ID** | `ic_sales_late_stage_stale_count` |
| **Formula** | Deals in Negotiation/Proposal with no activity > 7 days |
| **Unit** | count |

**Thresholds:**

| Band | Range |
|------|-------|
| 🔴 Critical | ≥ 5 deals |
| 🟠 Risk | 3–5 deals |
| 🟢 Healthy | 1–3 deals |
| 💪 Strong | ≤ 1 deal |

**Situation Template:**
> "You have **{stale_count} late-stage deals** worth **{total_value}** with **no activity for {avg_days_stale}+ days**.  
> These represent **{pct_pipeline}%** of your late-stage pipeline and are likely to slip."

**Predictive Call Reasons (per deal):**

- "Prospect opened pricing sheet 4 times in last 3 days, but didn't reply – call about commercial terms."
- "Proposal viewed by 3 decision makers; no calendar activity – schedule multi-stakeholder call."

---

### S3: Meeting-to-Win Rate

| Field | Value |
|-------|-------|
| **Signal ID** | `ic_sales_meetings_to_wins_ratio` |
| **Formula** | `closed_won_last_90d / first_meetings_last_90d` |
| **Trigger** | Drop > 30% vs previous quarter |

**Situation Template:**
> "Your meeting→win rate dropped from **{prev_rate} → {curr_rate}** in 90 days (**{delta_pct}%**).  
> Most losses happen after **{loss_stage}** stage, with reasons: '{top_loss_reasons}'."

**Guided Actions:**

- Review 3 call recordings with manager
- Add explicit ROI slide to all demos this week

---

## 2. Customer Success Workspace

### CS1: Health Score & Trend

| Field | Value |
|-------|-------|
| **Signal ID** | `cs_account_health_score` |
| **Formula** | composite(usage, engagement, support, NPS) |
| **Trigger** | Score < 60 AND trend ≤ −10 in 30 days |

**Thresholds:**

| Band | Range |
|------|-------|
| 🔴 Critical | < 40 |
| 🟠 Risk | 40–60 |
| 🟢 Healthy | 60–80 |
| 💪 Strong | > 80 |

**Situation Template:**
> "[{account_name}] dropped from **{prev_score} → {curr_score}** in the last 30 days.  
> Signals:  
> • Product usage {usage_delta}  
> • {ticket_count} new P1 tickets in 2 weeks  
> • No exec meeting in {days_since_exec} days."

**Guided Actions:**

- "Schedule risk review call with champion and exec in next 7 days."
- "Prepare 2-slide value recap with usage change and roadmap alignment."

---

### CS2: Renewal Risk Timeline

| Field | Value |
|-------|-------|
| **Signal ID** | `cs_renewal_risk_timeline` |
| **Formula** | `renewal_risk_score(days_to_renewal, health, last_exec_touch, qbr_completed)` |

**Dynamic Triggers:**

| Days to Renewal | Condition | Band |
|-----------------|-----------|------|
| 180 | Any | Planning |
| 90 | Health < 70 | Risk |
| 60 | No QBR | Critical |

**Situation Template:**
> "Renewal **{renewal_value}** in **{days_to_renewal} days**.  
> Health = **{health_score}**, {open_escalations} open escalations, last exec touch **{days_since_exec} days** ago.  
> {qbr_status}."

**Guided Actions:**

- Book QBR in next 14 days
- Validate renewal contacts & procurement path

---

### CS3: Expansion Hint

| Field | Value |
|-------|-------|
| **Signal ID** | `cs_expansion_signal` |
| **Signals** | new_active_users, feature_usage_spike, department_sprawl |

**Situation Template:**
> "Usage of [{feature_name}] grew **+{feature_growth}%** in 60 days.  
> New departments active: **{new_depts}**.  
> Current contract covers only **{current_scope}**; logins seen from **{new_scope}**."

**Guided Action:**

- "Call with: 'We see adoption of [Feature X] expanding to [Dept/Region]; let's formalize this and avoid overage risk + unlock better pricing.'"

---

### CS4: Red Accounts Cluster (Manager)

| Field | Value |
|-------|-------|
| **Signal ID** | `cs_red_accounts_cluster` |
| **Trigger** | ≥ 3 red accounts OR ≥ 20% ARR at risk |

**Situation Template:**
> "You have **{red_count} red accounts** representing **{arr_pct}%** of managed ARR.  
> {common_issues}."

**Guided Action:**

- "Run 90-minute workshop with CSMs + Sales to co-design exec narratives."

---

## 3. Marketing Workspace

### M1: Funnel Performance

| Field | Value |
|-------|-------|
| **Signal ID** | `mkt_funnel_performance` |
| **Metrics** | lead_volume, CPL, MQL→SQL, SQL→win, ROAS |

**Thresholds (ROI):**

| Band | Range |
|------|-------|
| 🔴 Critical | < 2× |
| 🟠 Risk | 2× – 5× |
| 🟢 Healthy | 5× – 10× |
| 💪 Strong | > 10× |

**Situation Template:**
> "Campaign '{campaign_name}' spent **{spend}** last month:  
> • CPL = **{cpl}** ({cpl_status})  
> • MQL→SQL = **{mql_sql_rate}%** (below target {target_rate}%)  
> • Contribution to pipeline = **{pipeline_value}** only."

**Guided Action:**

- "Pause this ad set or tighten targeting; shift budget to better-performing campaign."

---

### M2: Content Blind Spots

| Field | Value |
|-------|-------|
| **Signal ID** | `mkt_content_blind_spots` |
| **Metric** | queries_with_no_results |

**Situation Template:**
> "Your '{top_content}' deck was reused **{reuse_count} times** in last quarter and linked to **{influenced_pipeline}** in influenced pipeline.  
> Meanwhile, search term **'{missing_topic}'** had **{search_count} searches** and **0 matching content**."

**Guided Action:**

- "Create 1 flagship asset for '{missing_topic}' and 2 derivative blog posts."

---

## 4. Product/Ops Workspace

### P1: Incident/Quality Risk

| Field | Value |
|-------|-------|
| **Signal ID** | `prod_incident_quality_risk` |
| **Trigger** | Repeat incident on same component > 3 times in 30d |

**Situation Template:**
> "Component '{component}' had **{incident_count} incidents** in 30 days (MTTR: **{mttr} hours**).  
> {affected_customers} affected Tier-1 customers; change failure rate on {component} releases is **{cfr}%** (threshold {threshold}%)."

**Guided Action:**

- "Propose Architectural Health Review + freeze risky changes for 2 sprints."

---

## 5. Finance Workspace

### F1: Cash & Runway

| Field | Value |
|-------|-------|
| **Signal ID** | `fin_cash_runway` |
| **Formula** | `cash_balance / monthly_burn_rate` |

**Thresholds:**

| Band | Range |
|------|-------|
| 🔴 Critical | ≤ 9 months |
| 🟠 Risk | 9–12 months |
| 🟢 Healthy | 12–18 months |
| 💪 Strong | > 18 months |

**Situation Template:**
> "Runway is **{runway_months} months** at current burn.  
> MRR grew **+{mrr_growth}% MoM**, but Opex grew **+{opex_growth}%**.  
> If trend continues, runway will drop to **{projected_runway} months** in 3 months."

**Guided Action:**

- "Flag 2 cost centers with fastest growth; generate contract renegotiation list."

---

## 6. Freelancer Workspace

### FR1: Cash Flow & Risk

| Field | Value |
|-------|-------|
| **Signal ID** | `freelance_cash_flow_risk` |
| **Metrics** | unpaid_invoices, client_concentration |

**Triggers:**

- Unpaid invoices > 30 days
- Top client > 60% revenue

**Situation Template:**
> "You have **{unpaid_amount}** unpaid across {invoice_count} invoices (oldest: **{oldest_days} days**).  
> **{concentration}%** of your last 3 months revenue came from 1 client."

**Guided Actions:**

- "Call that client re: payment."
- "Shift next 2 weeks prospecting to diversify base."

---

## How Signals Drive Think/Bridge/Act

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   Data Layer   │────▶│ Signal Engine  │────▶│    Situation   │
│ (CRM, Support) │     │ (Compute)      │     │   (Think)      │
└────────────────┘     └────────────────┘     └───────┬────────┘
                                                      │
                              ┌────────────────────────┴────────────────────────┐
                              ▼                                                  ▼
                    ┌────────────────┐                                ┌────────────────┐
                    │ Action Proposals│                                │ Evidence Log   │
                    │   (Bridge)     │                                │   (Audit)      │
                    └───────┬────────┘                                └────────────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │   Execution    │
                    │     (Act)      │
                    └────────────────┘
```

**Flow:**

1. **Detection** – Signal Engine computes metrics, compares to thresholds
2. **Situation** – When threshold breached, create Situation with numbers + reasoning
3. **Proposals** – Generate 2-5 ActionProposals with explicit call reasons
4. **Execution** – When approved, Act posts to Slack/email/CRM
5. **Evidence** – Log all decisions for audit trail
