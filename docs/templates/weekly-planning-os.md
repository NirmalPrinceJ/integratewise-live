# Weekly Planning OS Template

Deep-dive documentation for the Weekly Planning OS template.

## Overview

The Weekly Planning OS template automates weekly planning workflows by:
- Aggregating tasks from multiple sources
- Prioritizing based on due dates and importance
- Creating structured weekly plans in Notion
- Blocking calendar time for planning sessions
- Linking tasks to weekly plans

## Variables

### Required Variables

| Variable | Type | Description |
|----------|------|-------------|
| `workspace_id` | string | Workspace ID for planning |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `planning_day` | string | "monday" | Day of week for planning (monday-sunday) |
| `priority_threshold` | string | "medium" | Minimum priority to include |
| `calendar_id` | string | null | Google Calendar ID for blocking time |
| `notion_database_id` | string | null | Notion database ID (auto-created if null) |

## Inputs

### Tools Required

- **Notion**: Read tasks, write weekly plans
- **Google Calendar**: Block planning time
- **Slack**: Optional notifications

### Entities

- **Task**: Source tasks from Spine
- **Plan**: Weekly plan entity

### Scopes

- `notion:read`
- `notion:write`
- `calendar:read`
- `calendar:write`

## Outputs

### Notion Database Row

**Database Schema:**
```json
{
  "columns": {
    "date": {
      "type": "date",
      "name": "Date"
    },
    "priority": {
      "type": "select",
      "name": "Priority",
      "options": ["low", "medium", "high", "urgent"]
    },
    "owner": {
      "type": "person",
      "name": "Owner"
    },
    "status": {
      "type": "select",
      "name": "Status",
      "options": ["pending", "in_progress", "completed"]
    },
    "next_action_date": {
      "type": "formula",
      "name": "Next Action Date",
      "formula": "date + 7 days"
    }
  }
}
```

**Computed Fields:**
- `next_action_date`: Formula that adds 7 days to `date`

### Google Calendar Event

**Event Properties:**
- Title: "Weekly Planning Session"
- Duration: 1 hour
- Recurrence: Weekly on planning day
- Description: Link to Notion weekly plan

**Calendar Link Logic:**
- If `calendar_id` provided: Use specified calendar
- Otherwise: Use user's primary calendar
- Block time: 9 AM - 10 AM (configurable)

## Triggers

### Schedule Trigger

**Cron Expression:** `0 9 * * 1` (Every Monday at 9 AM)

**Timezone:** User's workspace timezone

**Manual Trigger:** Available via API

## Preconditions

1. Notion database exists and is accessible
2. Google Calendar is connected
3. User has write permissions for Notion and Calendar
4. Tasks exist in Spine for the week

## Postconditions

1. Weekly plan created in Notion database
2. Calendar event created for planning session
3. Tasks linked to weekly plan via `Plan.milestones[].task_ids`
4. Notifications sent (if Slack connected)

## Error Handling

### Retry Strategy

- **Retry**: Yes
- **Backoff**: Exponential (1s, 2s, 4s)
- **Max Attempts**: 3

### Rollback

- **Rollback**: Yes
- **Actions**: Delete created Notion row, delete calendar event, unlink tasks

### DLQ

- **DLQ**: Yes
- **Persistence**: 7 days
- **Alerts**: On DLQ items

## Installation Steps

1. **Connect Notion**
   - Authorize Notion workspace
   - Grant read/write permissions
   - Select or create database

2. **Connect Google Calendar**
   - Authorize Google Calendar
   - Grant read/write permissions
   - Select calendar (or use primary)

3. **Configure Variables**
   - Set `workspace_id`
   - Set `planning_day` (default: Monday)
   - Set `priority_threshold` (default: medium)
   - Set `calendar_id` (optional)

4. **Set Schedule Trigger**
   - Configure cron expression
   - Set timezone
   - Enable trigger

5. **Verify**
   - Run test execution
   - Check Notion database
   - Check calendar event
   - Verify task linking

## Verification Checklist

- [ ] Notion database accessible
- [ ] Calendar connected
- [ ] Test execution succeeds
- [ ] Weekly plan created in Notion
- [ ] Calendar event created
- [ ] Tasks linked to plan
- [ ] Computed fields work (`next_action_date`)
- [ ] Rollback tested
- [ ] Error handling tested

## Example Execution

**Input:**
```json
{
  "workspace_id": "workspace-123",
  "planning_day": "monday",
  "priority_threshold": "medium",
  "calendar_id": "calendar-abc"
}
```

**Output:**
```json
{
  "notion_row_id": "notion-row-xyz",
  "calendar_event_id": "event-123",
  "plan_id": "plan-456",
  "tasks_linked": 15,
  "execution_time": "2024-11-04T09:00:00Z"
}
```

## See Also

- [Templates Overview](./index.md) - Template documentation
- [API Reference](../api/index.md) - Template API
- [Spine Schemas](../spine/schemas.md) - Plan entity schema
