# Accounts Intelligence OS - Schema Documentation

## Overview

The **Accounts Intelligence OS** is a department-agnostic schema designed to serve as the universal data layer for Sales, Customer Success, Marketing, Product, Finance, and Operations teams.

**Design Principles:**

- **Account-centric:** Everything hangs off `account_master`
- **Person-centric:** Re-usable `people_team` linked to accounts & roles
- **Context-first:** Business context and narratives live alongside metrics
- **No tool bias:** Columns map well from Salesforce, HubSpot, Zendesk, Jira, Stripe, etc.
- **Flow-ready:** Easy mapping to Spine + Knowledge layers

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ACCOUNTS INTELLIGENCE OS                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │   people_team    │
                              │  (all humans)    │
                              └────────┬─────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐     ┌──────────────────┐    ┌───────────────────┐
    │ account_master  │◄────│account_people    │    │ All owner_person  │
    │ (customers)     │     │  _roles (link)   │    │ FK references     │
    └────────┬────────┘     └──────────────────┘    └───────────────────┘
             │
    ┌────────┴────────────────────────────────────────────────────┐
    │                                                              │
    ▼                        ▼                        ▼            ▼
┌────────────┐     ┌─────────────────┐     ┌────────────┐   ┌───────────┐
│ business   │     │  strategic      │     │ platform   │   │ value     │
│ _context   │     │  _objectives    │     │ _health    │   │ _streams  │
└────────────┘     └─────────────────┘     │ _metrics   │   └───────────┘
                                           └────────────┘
    ▼                        ▼                        ▼            ▼
┌────────────┐     ┌─────────────────┐     ┌────────────┐   ┌───────────┐
│ initiatives│     │  risk_register  │     │ engagement │   │ success   │
│            │     │                 │     │ _log       │   │ _plan     │
└────────────┘     └─────────────────┘     └────────────┘   │ _tracker  │
                                                            └───────────┘
    ▼                        ▼                        ▼
┌────────────┐     ┌─────────────────┐     ┌────────────┐
│ task       │     │  stakeholder    │     │ generated  │
│ _manager   │     │  _outcomes      │     │ _insights  │
└────────────┘     └─────────────────┘     └────────────┘
```

---

## Tables Reference

### 1. Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `account_master` | One row per customer | account_id, status, health_score, arr_current |
| `people_team` | All humans (internal + external) | person_id, email, department, persona_type |
| `account_people_roles` | Links people to accounts | account_id, person_id, account_role |

### 2. Context & Strategy

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `business_context` | Macro framing per account | business_model, revenue_profile, change_drivers |
| `strategic_objectives` | High-level goals | objective_type, target_metric, status |

### 3. Platform & Health

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `platform_health_metrics` | Time-series health data | metric_name, metric_value, metric_date |
| `value_streams` | Business value streams | priority, status, business_owner_id |
| `api_portfolio` | APIs/projects per account | lifecycle_status, criticality |

### 4. Delivery & Risk

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `initiatives` | Projects, plays, success plans | type, status, risk_level |
| `risk_register` | Combined tech & business risks | category, severity, likelihood |

### 5. Engagement & Outcomes

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `engagement_log` | Timeline of interactions | type, channel, summary |
| `stakeholder_outcomes` | Per-person success criteria | outcome_statement, current_status |
| `success_plan_tracker` | Active success plans | status, health_impact |
| `task_manager` | Account-scoped tasks | priority, due_date, source |
| `generated_insights` | Engine outputs | insight_type, confidence, status |

---

## Department Views

### Sales View

```typescript
interface SalesAccountView {
  account: AccountMaster;
  objectives: StrategicObjective[];
  initiatives: Initiative[];
  engagements: EngagementLogEntry[];
  insights: GeneratedInsight[];
}
```

**Key Tables:** `account_master`, `initiatives`, `engagement_log`, `generated_insights`

### Customer Success View

```typescript
interface CSAccountView {
  account: AccountMaster;
  health_metrics: PlatformHealthMetric[];
  risks: RiskRegisterItem[];
  success_plans: SuccessPlan[];
  stakeholder_outcomes: StakeholderOutcome[];
  tasks: AccountTask[];
  insights: GeneratedInsight[];
}
```

**Key Tables:** `platform_health_metrics`, `risk_register`, `success_plan_tracker`, `stakeholder_outcomes`

### Product View

```typescript
interface ProductAccountView {
  account: AccountMaster;
  value_streams: ValueStream[];
  api_portfolio: ApiPortfolioItem[];
  health_metrics: PlatformHealthMetric[];
  initiatives: Initiative[];
}
```

**Key Tables:** `value_streams`, `api_portfolio`, `platform_health_metrics`

### Ops View

```typescript
interface OpsAccountView {
  account: AccountMaster;
  health_metrics: PlatformHealthMetric[];
  risks: RiskRegisterItem[];
  initiatives: Initiative[];
  tasks: AccountTask[];
}
```

**Key Tables:** `platform_health_metrics`, `risk_register`, `task_manager`

---

## Mapping from External Tools

| Source Tool | Target Table(s) | Key Mappings |
|-------------|-----------------|--------------|
| **Salesforce** | `account_master`, `engagement_log` | Account → account_master, Opportunity → initiatives |
| **HubSpot** | `account_master`, `people_team`, `engagement_log` | Company → account_master, Contact → people_team |
| **Stripe** | `account_master`, `platform_health_metrics` | Subscription → arr/mrr, Invoice → metrics |
| **Zendesk** | `engagement_log`, `risk_register` | Ticket → engagement_log, Escalation → risk_register |
| **Jira** | `initiatives`, `task_manager`, `risk_register` | Epic → initiatives, Issue → task_manager |
| **Intercom** | `engagement_log`, `people_team` | Conversation → engagement_log, User → people_team |
| **Slack** | `engagement_log` | Message/Thread → engagement_log (summary) |

---

## Usage Examples

### Fetch Account with Full Context

```typescript
const fullView = await fetchAccountFullView('acme_123');
// Returns: account + all related data (people, metrics, tasks, insights, etc.)
```

### Create a New Engagement

```typescript
await createEngagement({
  account_id: 'acme_123',
  date: new Date().toISOString(),
  type: 'QBR',
  channel: 'Zoom',
  summary: 'Quarterly business review with VP Eng',
  participants: '["person_1", "person_2"]',
  owner_person_id: 'csm_jane',
  source_system: 'manual'
});
```

### Generate an Insight

```typescript
await createInsight({
  account_id: 'acme_123',
  workspace: 'CS',
  title: 'Churn Risk Detected',
  insight_type: 'Risk',
  context_summary: 'Usage dropped 40% in last week',
  why_it_matters: 'Account renews in 30 days',
  recommended_action: 'Schedule immediate check-in',
  confidence: 85,
  source: 'think_engine',
  status: 'New'
});
```

---

## Migration Instructions

### Apply Schema

```bash
psql $DATABASE_URL < sql-migrations/002_accounts_intelligence_os.sql
```

### Verify Tables

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'account_master', 'people_team', 'account_people_roles',
  'business_context', 'strategic_objectives', 'platform_health_metrics',
  'value_streams', 'api_portfolio', 'initiatives', 'risk_register',
  'engagement_log', 'stakeholder_outcomes', 'success_plan_tracker',
  'task_manager', 'generated_insights'
);
```

---

## Integration with IntegrateWise OS

This schema integrates with the broader system:

1. **Spine View** → Uses `account_master`, `people_team`, `initiatives`
2. **Think Engine** → Reads from all tables, writes to `generated_insights`
3. **Act Engine** → Creates `engagement_log`, `task_manager` entries
4. **Context View** → Shows `business_context`, `strategic_objectives`

The schema is designed to be the **canonical truth** (Flow A) that feeds the entire system.
