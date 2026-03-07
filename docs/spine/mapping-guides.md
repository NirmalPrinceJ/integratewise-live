# Spine Mapping Guides

This document provides mapping examples for common source tools to Spine canonical entities.

## Overview

Each connector implements a mapping function that transforms source tool data into Spine entities. Mappings preserve:
- Core semantic meaning
- Relationships and context
- Temporal information
- Tool-specific metadata (in `metadata` field)

## Notion → Spine

### Notion Page → Note

**Source (Notion API):**
```json
{
  "id": "abc123",
  "properties": {
    "title": {"title": [{"plain_text": "Product Strategy"}]},
    "tags": {"multi_select": [{"name": "strategy"}, {"name": "product"}]}
  },
  "created_time": "2024-10-15T09:00:00Z",
  "last_edited_time": "2024-11-01T16:20:00Z"
}
```

**Spine (Note):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Product Strategy",
  "body_md": "[Notion content converted to markdown]",
  "tags": ["strategy", "product"],
  "source_tool": "notion",
  "external_ref": "abc123",
  "linked_entity_ids": [],
  "created_at": "2024-10-15T09:00:00Z",
  "updated_at": "2024-11-01T16:20:00Z",
  "metadata": {
    "notion_page_id": "abc123",
    "notion_database_id": "db-xyz"
  }
}
```

### Notion Database Row → Task

**Source (Notion API):**
```json
{
  "id": "row-456",
  "properties": {
    "Name": {"title": [{"plain_text": "Review budget"}]},
    "Status": {"select": {"name": "In Progress"}},
    "Priority": {"select": {"name": "High"}},
    "Due Date": {"date": {"start": "2024-12-15"}},
    "Assignee": {"people": [{"id": "user-123"}]}
  }
}
```

**Spine (Task):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review budget",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2024-12-15T00:00:00Z",
  "assignee_id": "user-123",
  "source_tool": "notion",
  "external_ref": "row-456",
  "created_at": "2024-11-01T10:00:00Z",
  "updated_at": "2024-11-05T14:30:00Z",
  "metadata": {
    "notion_database_id": "db-xyz"
  }
}
```

## Slack → Spine

### Slack Message Thread → Conversation

**Source (Slack API):**
```json
{
  "channel": "C01234ABCD",
  "ts": "1698840000.123456",
  "thread_ts": "1698840000.123456",
  "text": "Q4 Planning Discussion",
  "user": "U01234ABCD",
  "replies": 12
}
```

**Spine (Conversation):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "source": "slack",
  "message_count": 12,
  "topic": "Q4 Planning Discussion",
  "participants": ["U01234ABCD", "U05678EFGH"],
  "created_at": "2024-11-01T08:00:00Z",
  "updated_at": "2024-11-01T10:30:00Z",
  "metadata": {
    "channel_id": "C01234ABCD",
    "thread_ts": "1698840000.123456",
    "slack_workspace_id": "T01234ABCD"
  }
}
```

## HubSpot → Spine

### HubSpot Deal → Task (Business Ops Lens)

**Source (HubSpot API):**
```json
{
  "id": "deal-123",
  "properties": {
    "dealname": "Enterprise Contract Q4",
    "dealstage": "negotiation",
    "amount": "50000",
    "closedate": "2024-12-31T00:00:00Z",
    "hubspot_owner_id": "owner-456"
  }
}
```

**Spine (Task):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Enterprise Contract Q4",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2024-12-31T00:00:00Z",
  "assignee_id": "owner-456",
  "source_tool": "hubspot",
  "external_ref": "deal-123",
  "created_at": "2024-10-01T00:00:00Z",
  "updated_at": "2024-11-05T14:30:00Z",
  "metadata": {
    "deal_id": "deal-123",
    "stage": "negotiation",
    "amount": 50000,
    "owner_id": "owner-456"
  }
}
```

**Mapping Logic:**
- `dealname` → `title`
- `dealstage` → `status` (mapped: negotiation → in_progress)
- `amount` → `metadata.amount`
- `closedate` → `due_date`
- `hubspot_owner_id` → `assignee_id`

## Gmail → Spine

### Gmail Message → Conversation

**Source (Gmail API):**
```json
{
  "id": "msg-789",
  "threadId": "thread-abc",
  "snippet": "Re: Project update",
  "payload": {
    "headers": [
      {"name": "From", "value": "sender@example.com"},
      {"name": "To", "value": "recipient@example.com"},
      {"name": "Subject", "value": "Re: Project update"},
      {"name": "Date", "value": "Mon, 1 Nov 2024 10:00:00 +0000"}
    ]
  }
}
```

**Spine (Conversation):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "source": "gmail",
  "message_count": 1,
  "topic": "Re: Project update",
  "participants": ["sender@example.com", "recipient@example.com"],
  "created_at": "2024-11-01T10:00:00Z",
  "updated_at": "2024-11-01T10:00:00Z",
  "metadata": {
    "message_id": "msg-789",
    "thread_id": "thread-abc",
    "from": "sender@example.com",
    "to": ["recipient@example.com"],
    "subject": "Re: Project update",
    "received_at": "2024-11-01T10:00:00Z"
  }
}
```

**Mapping Logic:**
- `threadId` → `metadata.thread_id`
- `payload.headers[Subject]` → `topic`
- `payload.headers[From/To]` → `participants`
- `payload.headers[Date]` → `created_at` (normalized to ISO 8601)

## Stripe → Spine

### Stripe Subscription → HealthMetric (CS Lens)

**Source (Stripe API):**
```json
{
  "id": "sub_abc123",
  "customer": "cus_xyz789",
  "status": "active",
  "current_period_end": 1733011200,
  "items": {
    "data": [{
      "price": {
        "unit_amount": 10000,
        "currency": "usd"
      }
    }]
  }
}
```

**Spine (HealthMetric):**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "account_id": "cus_xyz789",
  "metric_type": "usage",
  "value": 100.0,
  "weight": 0.3,
  "period": "monthly",
  "computed_at": "2024-11-01T00:00:00Z",
  "metadata": {
    "subscription_id": "sub_abc123",
    "mrr": 10000,
    "currency": "usd",
    "status": "active",
    "renewal_date": "2024-12-01T00:00:00Z"
  }
}
```

## AI Tools (ChatGPT/Claude/Gemini) → Spine

### AI Conversation → Conversation

**Source (Webhook payload):**
```json
{
  "conversation_id": "conv-123",
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Brainstorm product features"},
    {"role": "assistant", "content": "Here are some ideas..."}
  ],
  "timestamp": "2024-11-01T14:00:00Z"
}
```

**Spine (Conversation):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "source": "chatgpt",
  "message_count": 2,
  "topic": "Brainstorm product features",
  "participants": ["user-123"],
  "created_at": "2024-11-01T14:00:00Z",
  "updated_at": "2024-11-01T14:05:00Z",
  "linkage_score": 0,
  "metadata": {
    "conversation_id": "conv-123",
    "model": "gpt-4",
    "messages": "[...]",
    "tool": "chatgpt"
  }
}
```

## Mapping Best Practices

1. **Preserve Relationships**: Use `linked_entity_ids` to maintain cross-tool context
2. **Normalize Timestamps**: Always convert to ISO 8601 UTC
3. **Preserve Metadata**: Store tool-specific fields in `metadata`
4. **Handle Missing Fields**: Use optional fields appropriately
5. **Idempotency**: Use `external_ref` + `source_tool` as unique key
6. **Status Mapping**: Map tool-specific statuses to canonical enums
7. **User Resolution**: Resolve external user IDs to Spine User IDs when possible

## See Also

- [Spine Schemas](./schemas.md) - Canonical entity definitions
- [Integrations Matrix](../integrations/matrix.md) - Connector capabilities
- [How It Works](../architecture/how-it-works.md) - System architecture
