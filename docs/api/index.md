# API Reference

Complete API documentation for IntegrateWise OS, including query parameters, error models, agent invocation contracts, and SDK examples.

## Base URL

- **Production**: `https://api.integratewise.co/v1`
- **Preview**: `https://preview-api.integratewise.co/v1`

## Authentication

All API requests require authentication via:

- **OAuth2 Bearer Token**: `Authorization: Bearer <token>`
- **API Key**: `X-API-Key: <api-key>`

## Query Parameters

### Standard Query Parameters

All list endpoints support:

- **limit**: Number of results (default: 20, max: 100)
- **cursor**: Pagination cursor (from previous response)
- **order**: Sort order (`asc` or `desc`)
- **filter[field][op]**: Filter by field with operator

### Filter Operators

- **eq**: Equal
- **ne**: Not equal
- **gt**: Greater than
- **gte**: Greater than or equal
- **lt**: Less than
- **lte**: Less than or equal
- **in**: In array
- **contains**: Contains substring

### Example Query

```
GET /v1/tasks?limit=50&order=desc&filter[status][eq]=in_progress&filter[priority][in]=high,urgent
```

## Error Model

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    },
    "request_id": "req_1234567890"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `AUTH_INVALID_TOKEN` | 401 | Invalid or expired token |
| `AUTH_INSUFFICIENT_SCOPES` | 403 | Missing required scopes |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Endpoints

### Tasks

#### List Tasks

```
GET /v1/tasks
```

**Query Parameters:**
- `limit`, `cursor`, `order`
- `filter[status][eq]`: Filter by status
- `filter[priority][in]`: Filter by priority
- `filter[assignee_id][eq]`: Filter by assignee
- `filter[due_date][gte]`: Filter by due date

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Review Q4 budget",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2024-12-15T00:00:00Z",
      "assignee_id": "user-123",
      "source_tool": "notion",
      "external_ref": "notion-page-abc",
      "created_at": "2024-11-01T10:00:00Z",
      "updated_at": "2024-11-05T14:30:00Z"
    }
  ],
  "pagination": {
    "next_cursor": "cursor_abc123",
    "has_more": true
  }
}
```

#### Get Task

```
GET /v1/tasks/{id}
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Review Q4 budget",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-12-15T00:00:00Z",
    "assignee_id": "user-123",
    "source_tool": "notion",
    "external_ref": "notion-page-abc",
    "created_at": "2024-11-01T10:00:00Z",
    "updated_at": "2024-11-05T14:30:00Z"
  }
}
```

#### Create Task

```
POST /v1/tasks
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "due_date": "2024-12-31T00:00:00Z",
  "assignee_id": "user-123",
  "source_tool": "api",
  "external_ref": "api-ref-123"
}
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "New task",
    "status": "pending",
    "priority": "medium",
    "created_at": "2024-11-01T10:00:00Z",
    "updated_at": "2024-11-01T10:00:00Z"
  }
}
```

#### Update Task

```
PATCH /v1/tasks/{id}
```

**Request Body:**
```json
{
  "status": "completed",
  "priority": "high"
}
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "priority": "high",
    "updated_at": "2024-11-05T15:00:00Z"
  }
}
```

### Notes

#### List Notes

```
GET /v1/notes
```

**Query Parameters:**
- `filter[tags][contains]`: Filter by tags
- `filter[source_tool][eq]`: Filter by source tool
- `filter[linked_entity_ids][contains]`: Filter by linked entities

#### Get Note

```
GET /v1/notes/{id}
```

#### Create Note

```
POST /v1/notes
```

**Request Body:**
```json
{
  "title": "Note title",
  "body_md": "# Markdown content",
  "tags": ["tag1", "tag2"],
  "source_tool": "api",
  "external_ref": "api-ref-123",
  "linked_entity_ids": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

### Conversations

#### List Conversations

```
GET /v1/conversations
```

**Query Parameters:**
- `filter[source][eq]`: Filter by source (slack, gmail, chatgpt, etc.)
- `filter[participants][contains]`: Filter by participants
- `filter[linkage_score][gte]`: Filter by linkage score

### Plans

#### List Plans

```
GET /v1/plans
```

**Query Parameters:**
- `filter[status][eq]`: Filter by status
- `filter[owner_id][eq]`: Filter by owner

#### Get Plan with Milestones

```
GET /v1/plans/{id}?include=milestones
```

**Response:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "objective": "Launch product feature",
    "milestones": [
      {
        "id": "milestone-1",
        "title": "Design phase",
        "status": "completed",
        "target_date": "2024-12-01T00:00:00Z",
        "task_ids": ["550e8400-e29b-41d4-a716-446655440000"]
      }
    ],
    "status": "active",
    "created_at": "2024-10-20T09:00:00Z",
    "updated_at": "2024-11-05T15:00:00Z"
  }
}
```

### Spine Traversal

#### Get Entity with Relationships

```
GET /v1/entities/{id}?include=relationships
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "task",
    "attributes": {
      "title": "Review Q4 budget",
      "status": "in_progress"
    },
    "relationships": {
      "assignee": {
        "id": "user-123",
        "type": "user"
      },
      "linked_notes": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "type": "note"
        }
      ]
    }
  }
}
```

#### Traverse Relationships

```
GET /v1/entities/{id}/relationships?type=linked_notes&depth=2
```

**Query Parameters:**
- `type`: Relationship type to traverse
- `depth`: Traversal depth (default: 1, max: 3)

**Example: Accounts → Subscriptions → Invoices**

```
GET /v1/entities/account-123/relationships?type=subscriptions&depth=2
GET /v1/entities/subscription-456/relationships?type=invoices&depth=1
```

## Agent Invocation

### Invoke Agent

```
POST /v1/agents/{agent_id}/invoke
```

**Request Body:**
```json
{
  "input": {
    "query": "Create a plan for Q4 product launch",
    "context_entity_ids": ["550e8400-e29b-41d4-a716-446655440000"],
    "parameters": {
      "template": "product-launch-plan"
    }
  },
  "options": {
    "timeout": 300,
    "retry": true,
    "approval_required": true
  }
}
```

**Response:**
```json
{
  "data": {
    "invocation_id": "inv_1234567890",
    "status": "pending",
    "agent_id": "planning-agent",
    "created_at": "2024-11-01T10:00:00Z"
  }
}
```

### Get Invocation Status

```
GET /v1/agents/invocations/{invocation_id}
```

**Response:**
```json
{
  "data": {
    "invocation_id": "inv_1234567890",
    "status": "completed",
    "agent_id": "planning-agent",
    "result": {
      "type": "plan",
      "entity_id": "880e8400-e29b-41d4-a716-446655440003"
    },
    "created_at": "2024-11-01T10:00:00Z",
    "completed_at": "2024-11-01T10:05:00Z"
  }
}
```

### Agent Context Resolution

Agents automatically resolve context from:

1. **Input entity IDs**: Entities provided in `context_entity_ids`
2. **Brain search**: Semantic search for relevant entities
3. **Relationship traversal**: Related entities via Spine relationships
4. **User workspace**: Entities in user's workspace

### Agent Output Types

- **tasks**: Created or updated tasks
- **docs**: Generated documents (via Render)
- **render**: Rendered outputs (emails, dashboards, reports)
- **plan**: Created plan with milestones

### Agent Timeout & Retry

- **Default timeout**: 300 seconds (5 minutes)
- **Retry**: Exponential backoff (1s, 2s, 4s, 8s, 16s), max 3 attempts
- **DLQ**: Failed invocations sent to DLQ after retries exhausted

## SDK Examples

### JavaScript/TypeScript

```typescript
import { IntegrateWiseClient } from '@integratewise/sdk';

const client = new IntegrateWiseClient({
  apiKey: process.env.INTEGRATEWISE_API_KEY,
  baseURL: 'https://api.integratewise.co/v1'
});

// List tasks
const tasks = await client.tasks.list({
  limit: 50,
  filter: {
    status: { eq: 'in_progress' },
    priority: { in: ['high', 'urgent'] }
  },
  order: 'desc'
});

// Get task with relationships
const task = await client.tasks.get('550e8400-e29b-41d4-a716-446655440000', {
  include: ['relationships']
});

// Create task
const newTask = await client.tasks.create({
  title: 'New task',
  status: 'pending',
  priority: 'medium',
  source_tool: 'api',
  external_ref: 'api-ref-123'
});

// Invoke agent
const invocation = await client.agents.invoke('planning-agent', {
  input: {
    query: 'Create a plan for Q4 product launch',
    context_entity_ids: [task.id]
  },
  options: {
    timeout: 300,
    approval_required: true
  }
});

// Check invocation status
const status = await client.agents.getInvocationStatus(invocation.invocation_id);
```

### Python

```python
from integratewise import IntegrateWiseClient

client = IntegrateWiseClient(
    api_key=os.environ.get('INTEGRATEWISE_API_KEY'),
    base_url='https://api.integratewise.co/v1'
)

# List tasks
tasks = client.tasks.list(
    limit=50,
    filter={
        'status': {'eq': 'in_progress'},
        'priority': {'in': ['high', 'urgent']}
    },
    order='desc'
)

# Get task with relationships
task = client.tasks.get(
    '550e8400-e29b-41d4-a716-446655440000',
    include=['relationships']
)

# Create task
new_task = client.tasks.create({
    'title': 'New task',
    'status': 'pending',
    'priority': 'medium',
    'source_tool': 'api',
    'external_ref': 'api-ref-123'
})

# Invoke agent
invocation = client.agents.invoke('planning-agent', {
    'input': {
        'query': 'Create a plan for Q4 product launch',
        'context_entity_ids': [task.id]
    },
    'options': {
        'timeout': 300,
        'approval_required': True
    }
})

# Check invocation status
status = client.agents.get_invocation_status(invocation.invocation_id)
```

### cURL Examples

```bash
# List tasks
curl -X GET "https://api.integratewise.co/v1/tasks?limit=50&filter[status][eq]=in_progress" \
  -H "Authorization: Bearer $TOKEN"

# Get task
curl -X GET "https://api.integratewise.co/v1/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer $TOKEN"

# Create task
curl -X POST "https://api.integratewise.co/v1/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New task",
    "status": "pending",
    "priority": "medium",
    "source_tool": "api",
    "external_ref": "api-ref-123"
  }'

# Invoke agent
curl -X POST "https://api.integratewise.co/v1/agents/planning-agent/invoke" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "query": "Create a plan for Q4 product launch",
      "context_entity_ids": ["550e8400-e29b-41d4-a716-446655440000"]
    },
    "options": {
      "timeout": 300,
      "approval_required": true
    }
  }'
```

## Rate Limits

- **Default**: 100 requests per minute per API key
- **Burst**: Up to 200 requests in short bursts
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## See Also

- [Spine Schemas](../spine/schemas.md) - Entity definitions
- [Webhooks Documentation](../webhooks/index.md) - Webhook endpoints
- [Security Documentation](../security/index.md) - Authentication and authorization
