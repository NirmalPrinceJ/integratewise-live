# Cross-Department Signal Model

## Overview

The Signal Model provides a unified framework for tracking performance metrics across all personas (individual, team, manager, freelancer) and departments (Sales, CS, Marketing, Product, Finance, Ops).

**Architecture:**

- **ResourceTypes** - Canonical entity types (account, person, task, etc.)
- **Traits** - Typed attributes attached to resources
- **ToolTypes** - Classification of external tools
- **Signals** - Derived metrics computed from resources

---

## ResourceType / Trait / ToolType Model

### ResourceTypes (Canonical Entities)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CANONICAL ENTITIES                           │
├─────────────────────────────────────────────────────────────────────┤
│  account        │  Customer organization or client                   │
│  person         │  Any human contact (internal/external)             │
│  opportunity    │  Sales opportunity or deal                         │
│  subscription   │  Recurring revenue contract                        │
│  ticket         │  Support issue or request                          │
│  task           │  Unit of work (project/ops/CS)                     │
│  event          │  Meeting, call, or timeline event                  │
│  document       │  Doc, page, email, transcript                      │
│  campaign       │  Marketing or CS motion                            │
│  initiative     │  Project or program                                │
│  invoice        │  Billing event                                     │
│  metric_point   │  Time-series metric (health, usage)                │
└─────────────────────────────────────────────────────────────────────┘
```

### ToolTypes → ResourceTypes Mapping

| Tool Type | Display Name | Typical Resources |
|-----------|--------------|-------------------|
| `crm` | CRM | account, person, opportunity |
| `support` | Support | ticket, person, event |
| `billing` | Billing/Finance | subscription, invoice, account |
| `marketing_auto` | Marketing Automation | campaign, person, event |
| `analytics` | Product Analytics | metric_point, event |
| `pm` | Project/Work Management | task, initiative, person |
| `calendar` | Calendar | event |
| `comm` | Communication | event, document |
| `docs` | Doc/Knowledge | document |
| `freelance_billing` | Freelance Billing | invoice, initiative, account |

### Trait Categories

| Category | Traits | Purpose |
|----------|--------|---------|
| **Identity** | external_id, tool_id, tool_type, source_system | Link to source systems |
| **Ownership** | owner_person_id, team, department | Who owns this entity |
| **Time** | created_at, updated_at, status_changed_at, due_at | Temporal tracking |
| **Value** | amount, currency, count, score, band | Quantitative values |
| **Context** | workspace, segment, vertical, region | Business context |
| **Links** | related_entities, parent_id | Entity relationships |

---

## Signals by Persona

### Individual (IC / Knowledge Worker)

#### Core Signals (Any Department)

| Signal | Category | Description | Unit | Direction |
|--------|----------|-------------|------|-----------|
| Tasks Created (Daily) | focus | Tasks created per day | count | neutral |
| Tasks Completed (Daily) | focus | Tasks completed per day | count | ↑ better |
| Task Completion Rate | focus | Completed / Created ratio | % | ↑ better |
| Context Switches | focus | Tool hops per hour | count/hr | ↓ better |
| Calendar Fragmentation | focus | % day in fragmented meetings | % | ↓ better |
| Meeting Load | health | Hours in meetings per day | hours | ↓ better |
| After-Hours Work | health | Work outside business hours | count | ↓ better |

#### Sales IC Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Sales Activities | Calls, emails, meetings, demos | count | ↑ better |
| Opportunities Created | New opps created | count | ↑ better |
| Opportunities Progressed | Opps moved forward | count | ↑ better |
| Opportunities Stalled | Opps with no activity | count | ↓ better |
| Demo Conversion | Opp → Demo rate | % | ↑ better |
| ACV Booked | Annual contract value | currency | ↑ better |
| Quota Attainment | Bookings vs quota | % | ↑ better |

#### CS IC Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Accounts Owned | Number of accounts | count | neutral |
| Health Score Movement | Net health change | score | ↑ better |
| Tickets Handled | Tickets/escalations | count | ↑ better |
| Time to First Response | Avg TTFR | hours | ↓ better |
| Time to Resolution | Avg TTR | hours | ↓ better |
| QBRs Completed | QBRs done vs planned | % | ↑ better |

#### Marketing IC Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Assets Produced | Content/campaigns made | count | ↑ better |
| Asset Performance | Views, CTR, conversion | score | ↑ better |
| Deadlines Hit | On-time delivery | % | ↑ better |
| Experiments Launched | Tests with learnings | count | ↑ better |

#### Product/Eng IC Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Issues Completed | Stories done vs assigned | % | ↑ better |
| Cycle Time | Avg time per ticket | hours | ↓ better |
| Bugs Introduced | Bugs caused | count | ↓ better |
| Bugs Resolved | Bugs fixed | count | ↑ better |
| Incidents Handled | On-call incidents | count | neutral |

---

### Team Level

#### Core Team Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Throughput | Tasks closed vs opened | ratio | ↑ better |
| Cycle Time | Average cycle time | hours | ↓ better |
| Lead Time | Average lead time | hours | ↓ better |
| Bug/Reopen Rate | Quality issues | % | ↓ better |
| Cross-Team Dependencies | Dependencies resolved | % | ↑ better |
| Workload Distribution | Variance across team | score | ↓ better |

#### Sales Team Signals

| Signal | Description | Unit |
|--------|-------------|------|
| Pipeline Coverage | Pipeline / Quota ratio | ratio |
| Win Rate | Closed won / total closed | % |
| Average Deal Size | Avg ACV per deal | currency |
| Sales Cycle Length | Avg days to close | days |
| Forecast Accuracy | Forecast vs actual | % |

#### CS Team Signals

| Signal | Description | Unit |
|--------|-------------|------|
| Logo Retention | Customer retention | % |
| Net Revenue Retention (NRR) | Revenue retention | % |
| Gross Revenue Retention (GRR) | GRR | % |
| SLA Attainment | Tickets meeting SLA | % |
| Health Trajectory | Accounts moving bands | count |

#### Product Team Signals

| Signal | Description | Unit |
|--------|-------------|------|
| Deploy Frequency | Deployments per period | count |
| Change Failure Rate | Failed deployments | % |
| MTTR | Mean time to recovery | hours |
| MTTD | Mean time to detect | hours |

---

### Manager Signals

| Signal | Description | Unit |
|--------|-------------|------|
| 1:1s Completed | 1:1s done vs scheduled | % |
| Feedback Artifacts | Notes, reviews created | count |
| Attrition Rate | Team turnover | % |
| Time to Fill | Hiring speed | days |
| Escalation Resolution | Time to resolve | hours |

---

### Freelancer Signals

| Signal | Description | Unit | Direction |
|--------|-------------|------|-----------|
| Projects Won | Won vs proposed | % | ↑ better |
| Projects Delivered | On-time delivery | % | ↑ better |
| Effective Hourly Rate | Revenue / hours | currency | ↑ better |
| Unpaid Invoices | Count overdue | count | ↓ better |
| Invoice Aging | Avg days overdue | days | ↓ better |
| Revision Rate | Revisions per project | ratio | ↓ better |
| Client Satisfaction | Satisfaction score | score | ↑ better |
| Repeat Business | Repeat clients | % | ↑ better |

---

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  External Tools │────▶│ Generic Connector│────▶│  ResourceTypes  │
│  (CRM, Support, │     │     Engine       │     │  (Canonical)    │
│   Billing, etc) │     │                  │     │                  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                         ┌───────────────────────────────┼───────────────────────────────┐
                         ▼                               ▼                               ▼
               ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
               │  EntityTraits   │             │ Signal Instances│             │ Generated       │
               │ (Custom attrs)  │             │ (Computed daily)│             │ Insights        │
               └─────────────────┘             └─────────────────┘             └─────────────────┘
```

---

## Implementation Notes

### Connecting Tools

Each tool connection specifies:

1. `tool_type` - Classification
2. `resource_mappings` - Source path → ResourceType.Trait

Example HubSpot mapping:

```json
{
  "tool_type": "crm",
  "tool_name": "HubSpot",
  "resource_mappings": [
    { "source_path": "$.companies[*].name", "target_resource": "account", "target_trait": "name" },
    { "source_path": "$.companies[*].hubspot_owner_id", "target_resource": "account", "target_trait": "owner_person_id" },
    { "source_path": "$.deals[*].amount", "target_resource": "opportunity", "target_trait": "amount" }
  ]
}
```

### Computing Signals

Signals are computed by the Context Engine:

1. Query relevant ResourceTypes
2. Apply computation (count, ratio, delta, etc.)
3. Store SignalInstance with period and band
4. Generate insights if thresholds breached

### Integration with Think Engine

The Think Engine reads signals to:

- Detect anomalies (sudden drops/spikes)
- Identify patterns (correlations across signals)
- Generate Situations for review
- Propose actions via Bridge

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `resource_type_registry` | Canonical entity definitions |
| `tool_type_registry` | Tool classifications |
| `trait_definitions` | Trait schema |
| `entity_traits` | Custom trait values |
| `signal_definitions` | Signal configurations |
| `signal_instances` | Computed signal values |
| `tool_connections` | External tool configs |

---

## Usage Examples

### Get Signals for a Sales IC

```typescript
const signals = getSignalsForPersona('individual', 'sales');
// Returns: core IC signals + sales-specific signals
```

### Compute Signal Band

```typescript
const band = computeSignalBand(75, { good: 80, warning: 50, critical: 20 }, 'higher_is_better');
// Returns: 'warning' (75 is between 50 and 80)
```

### Track Trend

```typescript
const trend = computeTrend(85, 80);
// Returns: 'up' (85 is >5% higher than 80)
```
