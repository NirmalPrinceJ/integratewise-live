# Lenses & CS Intelligence

Opinionated views over Spine data with computed fields, aggregations, and CS health scoring.

## Overview

Lenses are opinionated views over Spine data that transform raw entities into domain-specific views. Each lens provides:
- Filtered entity views
- Computed fields
- Aggregations and summaries
- Domain-specific logic

## Lens Types

### Personal Lens

**Purpose**: Personal productivity view with tasks, notes, and context.

**Fields:**
- `title`: Task or note title
- `due_date`: Due date (ISO 8601)
- `priority`: Priority level (low, medium, high, urgent)
- `context_link`: Link to related entities

**Filters:**
- Assigned to user
- Personal tags
- Not archived

**Computed Fields:**
- `days_until_due`: Days until due date
- `overdue`: Boolean (due date < today)
- `context_count`: Number of linked entities

**Example Query:**
```
GET /v1/lenses/personal?user_id=user-123&filter[priority][in]=high,urgent
```

### Work Lens

**Purpose**: Team and work-focused view with SLAs and dependencies.

**Fields:**
- `owner`: Task owner (user ID)
- `SLA_due`: SLA due date (ISO 8601)
- `dependency_id`: Dependent task ID
- `status`: Task status

**Filters:**
- Team workspace
- Active status (not completed/cancelled)
- Within SLA window

**Computed Fields:**
- `sla_status`: on_track | at_risk | breached
- `dependency_count`: Number of dependencies
- `blocked`: Boolean (has uncompleted dependencies)

**Example Query:**
```
GET /v1/lenses/work?workspace_id=workspace-123&filter[sla_status][eq]=at_risk
```

### Business Ops Lens

**Purpose**: Business operations view with revenue, growth, and retention metrics.

**Fields:**
- `arr`: Annual Recurring Revenue
- `churn_risk`: Churn risk score (0-100)
- `cohort_id`: Customer cohort identifier
- `growth_rate`: Growth rate percentage

**Filters:**
- Active accounts
- Within reporting period
- By cohort

**Aggregations:**
- Total ARR
- Churn rate
- Growth rate
- Cohort retention

**Example Query:**
```
GET /v1/lenses/business-ops?period=monthly&cohort_id=2024-Q1&aggregate=arr,churn_rate
```

### CS Intelligence Lens

**Purpose**: Customer success view with health scores, risk flags, and playbooks.

**Fields:**
- `health_score`: Health score (0-100)
- `risk_flag`: Risk flag (green, amber, red)
- `playbook_id`: Recommended playbook ID
- `last_touch`: Last touch date (ISO 8601)

**Filters:**
- By health score range
- By risk flag
- By account segment

**Computed Fields:**
- `health_trend`: improving | stable | declining
- `days_since_touch`: Days since last touch
- `renewal_proximity`: Days until renewal

**Example Query:**
```
GET /v1/lenses/cs-intelligence?filter[risk_flag][eq]=red&filter[health_score][lt]=40
```

## CS Health Score Formula

### Formula

```
health_score = weighted_sum(
  normalize(usage) * 0.3,
  normalize(nps) * 0.2,
  normalize(ticket_severity_inverse) * 0.2,
  normalize(renewal_proximity_inverse) * 0.15,
  normalize(engagement) * 0.15
)
```

### Components

**Usage (30% weight):**
- Normalized usage metric (0-100)
- Based on feature adoption, login frequency, data volume

**NPS (20% weight):**
- Normalized NPS score (0-100)
- Based on customer satisfaction surveys

**Ticket Severity Inverse (20% weight):**
- Inverse of ticket severity (higher = better)
- Based on support ticket severity and volume

**Renewal Proximity Inverse (15% weight):**
- Inverse of days until renewal (closer = higher risk)
- Based on contract renewal dates

**Engagement (15% weight):**
- Normalized engagement score (0-100)
- Based on product usage, communication frequency, meeting attendance

### Normalization

All components are normalized to 0-100 scale:
- **Usage**: `normalize(usage) = (usage / max_usage) * 100`
- **NPS**: `normalize(nps) = ((nps + 100) / 200) * 100`
- **Ticket Severity**: `normalize(severity_inverse) = (1 - (severity / max_severity)) * 100`
- **Renewal Proximity**: `normalize(proximity_inverse) = (1 - (days_until_renewal / max_days)) * 100`
- **Engagement**: `normalize(engagement) = (engagement / max_engagement) * 100`

### Thresholds

| Threshold | Health Score | Risk Flag | Action |
|-----------|--------------|-----------|--------|
| **Green** | ≥ 70 | green | No action required |
| **Amber** | 40-69 | amber | Renewal deck, exec update |
| **Red** | < 40 | red | Intervention plan, escalation |

### Playbook Mapping

**Green (≥70):**
- No playbook required
- Standard renewal process

**Amber (40-69):**
- Playbook: `renewal-deck`
- Playbook: `exec-update`
- Actions: Schedule renewal call, prepare renewal deck

**Red (<40):**
- Playbook: `intervention-plan`
- Playbook: `escalation`
- Actions: Immediate intervention, executive escalation, risk mitigation

## Playbook Outputs

### Renewal Deck

**Contents:**
- Account overview
- Usage metrics
- Value delivered
- Renewal proposal
- Pricing

**Format:** PDF, Notion page

### Exec Update

**Contents:**
- Account status
- Health score trend
- Key metrics
- Risks and opportunities
- Recommendations

**Format:** Email, Slack message

### Intervention Plan

**Contents:**
- Problem statement
- Root cause analysis
- Action items
- Timeline
- Success metrics

**Format:** Notion page, PDF

## See Also

- [Spine Schemas](../spine/schemas.md) - Entity definitions
- [HealthMetric Schema](../spine/schemas.md#healthmetric) - Health metric entity
- [API Reference](../api/index.md) - Lens API endpoints
