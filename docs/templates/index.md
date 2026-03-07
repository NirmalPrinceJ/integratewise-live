# Templates

Installation-ready templates with explicit variables, contracts, inputs, outputs, triggers, and error handling.

## Overview

Templates are pre-configured workflows that automate common tasks across IntegrateWise OS. Each template specifies:
- Variables (name, type, default, required)
- Inputs (tools, entities)
- Outputs (Notion DB rows, Gmail drafts, etc.)
- Triggers (schedule, event, manual)
- Preconditions/Postconditions
- Error handling/rollback semantics
- Installation steps with verification

## Template Structure

```yaml
template:
  id: string
  name: string
  description: string
  version: string
  
  variables:
    - name: string
      type: string | number | boolean | array | object
      default: any
      required: boolean
      description: string
  
  inputs:
    tools: string[]
    entities: string[]
    scopes: string[]
  
  outputs:
    type: notion | gmail | render | api
    target: string
    schema: object
  
  triggers:
    type: schedule | event | manual
    config: object
  
  preconditions:
    - condition: string
      error: string
  
  postconditions:
    - condition: string
      error: string
  
  error_handling:
    retry: boolean
    rollback: boolean
    dlq: boolean
  
  installation:
    steps: string[]
    verification: string[]
```

## Featured Templates

### Weekly Planning OS

**Purpose**: Automate weekly planning with tasks, priorities, and calendar integration.

**Variables:**
```yaml
variables:
  - name: workspace_id
    type: string
    required: true
    description: Workspace ID
  
  - name: planning_day
    type: string
    default: "monday"
    required: false
    description: Day of week for planning (monday-sunday)
  
  - name: priority_threshold
    type: string
    default: "medium"
    required: false
    description: Minimum priority to include (low, medium, high, urgent)
  
  - name: calendar_id
    type: string
    required: false
    description: Google Calendar ID for blocking time
```

**Inputs:**
- Tools: Notion, Google Calendar, Slack
- Entities: Task, Plan
- Scopes: `notion:read`, `notion:write`, `calendar:read`, `calendar:write`

**Outputs:**
- Notion Database Row: Weekly plan with columns:
  - `date` (date): Planning date
  - `priority` (select): Priority level
  - `owner` (person): Task owner
  - `status` (select): pending | in_progress | completed
  - `next_action_date` (formula): Computed next action date
- Google Calendar Event: Blocked time for planning session

**Triggers:**
- Type: Schedule
- Config: `cron: "0 9 * * 1"` (Every Monday at 9 AM)

**Preconditions:**
- Notion database exists and is accessible
- Google Calendar is connected
- User has write permissions

**Postconditions:**
- Weekly plan created in Notion
- Calendar event created
- Tasks linked to plan

**Error Handling:**
- Retry: Yes (exponential backoff, max 3 attempts)
- Rollback: Yes (delete created entities on failure)
- DLQ: Yes (send to DLQ after retries exhausted)

**Installation Steps:**
1. Connect Notion workspace
2. Create or select Notion database for weekly plans
3. Connect Google Calendar
4. Configure template variables
5. Set schedule trigger
6. Verify: Run test execution

**Verification Checklist:**
- [ ] Notion database accessible
- [ ] Calendar connected
- [ ] Test execution succeeds
- [ ] Weekly plan created correctly
- [ ] Calendar event created
- [ ] Tasks linked properly

### AI Brainstream → Action

**Purpose**: Convert AI conversation streams into actionable tasks and notes.

**Variables:**
```yaml
variables:
  - name: webhook_endpoint
    type: string
    required: true
    description: Webhook endpoint URL
  
  - name: source_tools
    type: array
    default: ["chatgpt", "claude", "gemini"]
    required: false
    description: AI tools to ingest from
  
  - name: dedup_key_strategy
    type: string
    default: "conversation-id-message-id"
    required: false
    description: Deduplication key strategy
  
  - name: generation_rules
    type: object
    default: {}
    required: false
    description: Rules for task/note generation
```

**Inputs:**
- Tools: ChatGPT, Claude, Gemini (webhook-only)
- Entities: Conversation, Task, Note
- Scopes: Webhook ingestion (no write scopes required)

**Outputs:**
- Task: Created from actionable items in conversation
- Note: Created from insights and ideas
- Notion Page: Optional, if Notion connected

**Webhook Endpoint:**
```
POST /webhooks/ai-brainstream
```

**Payload Contract:**
```json
{
  "conversation_id": "conv-123",
  "message_id": "msg-456",
  "source": "chatgpt",
  "content": "Message content",
  "timestamp": "2024-11-01T14:00:00Z",
  "user_id": "user-123"
}
```

**Deduplication Keys:**
- Strategy: `{source}-{conversation-id}-{message-id}`
- Example: `chatgpt-conv-123-msg-456`

**Generation Rules:**
- Extract actionable items (verbs: create, update, review, etc.)
- Extract insights (questions, ideas, summaries)
- Link to existing entities via Brain search
- Set priority based on keywords (urgent, important, etc.)

**Safety Rails:**
- Max tasks per conversation: 10
- Max notes per conversation: 5
- Content filtering: Block sensitive keywords
- Approval required: For high-priority tasks (configurable)

**Triggers:**
- Type: Event (webhook)
- Config: Webhook endpoint receives AI conversation events

**Preconditions:**
- Webhook endpoint accessible
- Webhook secret configured
- Brain agent enabled

**Postconditions:**
- Conversation indexed in Brain
- Tasks/notes created
- Entities linked

**Error Handling:**
- Retry: Yes (exponential backoff, max 3 attempts)
- Rollback: Yes (delete created entities on failure)
- DLQ: Yes (send to DLQ after retries exhausted)

**Installation Steps:**
1. Configure webhook endpoint
2. Set webhook secret
3. Connect AI tools (ChatGPT, Claude, Gemini)
4. Configure generation rules
5. Set safety rails
6. Verify: Send test webhook

**Verification Checklist:**
- [ ] Webhook endpoint accessible
- [ ] Signature verification works
- [ ] Test webhook processed
- [ ] Tasks created correctly
- [ ] Notes created correctly
- [ ] Entities linked properly

### CS Health Pulse

**Purpose**: Generate customer success health reports with playbook recommendations.

**Variables:**
```yaml
variables:
  - name: cs_lens_required
    type: boolean
    default: true
    required: true
    description: Require CS Lens for data sources
  
  - name: data_sources
    type: array
    default: ["hubspot", "stripe", "zendesk"]
    required: false
    description: Data sources for health metrics
  
  - name: health_score_thresholds
    type: object
    default:
      green: 70
      amber: 40
      red: 0
    required: false
    description: Health score thresholds
  
  - name: report_frequency
    type: string
    default: "weekly"
    required: false
    description: Report frequency (daily, weekly, monthly)
```

**Inputs:**
- Tools: HubSpot, Stripe, Zendesk (CS Lens required)
- Entities: HealthMetric, Account
- Scopes: `hubspot:read`, `stripe:read`, `zendesk:read`

**Outputs:**
- Render Report: PDF/HTML health report
- Gmail Draft: Executive summary email
- Notion Page: Detailed health dashboard

**Data Sources & Contracts:**
- **HubSpot**: Account data, deal pipeline, engagement metrics
- **Stripe**: Subscription data, MRR, churn signals
- **Zendesk**: Ticket data, severity, resolution time

**Health Score Formula:**
```
health_score = weighted_sum(
  normalize(usage) * 0.3,
  normalize(nps) * 0.2,
  normalize(ticket_severity_inverse) * 0.2,
  normalize(renewal_proximity_inverse) * 0.15,
  normalize(engagement) * 0.15
)
```

**Playbook Mapping:**
- Green (≥70): No action required
- Amber (40-69): Renewal deck, exec update
- Red (<40): Intervention plan, escalation

**Triggers:**
- Type: Schedule
- Config: `cron: "0 9 * * 1"` (Every Monday at 9 AM)

**Preconditions:**
- CS Lens enabled
- Data sources connected
- Health metrics computed

**Postconditions:**
- Health report generated
- Playbook recommendations included
- Report delivered to stakeholders

**Error Handling:**
- Retry: Yes (exponential backoff, max 3 attempts)
- Rollback: No (read-only operations)
- DLQ: Yes (send to DLQ after retries exhausted)

**Installation Steps:**
1. Enable CS Lens
2. Connect data sources (HubSpot, Stripe, Zendesk)
3. Configure health score thresholds
4. Set report frequency
5. Configure report recipients
6. Verify: Run test report generation

**Verification Checklist:**
- [ ] CS Lens enabled
- [ ] Data sources connected
- [ ] Health metrics computed
- [ ] Test report generated
- [ ] Playbook recommendations included
- [ ] Report delivered successfully

## Template Installation

### Installation Process

1. **Select Template**: Choose template from catalog
2. **Configure Variables**: Set required and optional variables
3. **Connect Tools**: Authorize required integrations
4. **Set Triggers**: Configure schedule or event triggers
5. **Verify**: Run test execution
6. **Activate**: Enable template

### Verification

Each template includes a verification checklist:
- Preconditions met
- Tools connected
- Test execution succeeds
- Outputs created correctly
- Error handling tested

## See Also

- [API Reference](../api/index.md) - Template API endpoints
- [Lenses & CS Intelligence](../lenses/index.md) - CS Lens details
- [Webhooks Documentation](../webhooks/index.md) - Webhook setup
