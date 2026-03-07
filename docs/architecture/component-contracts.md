# Component I/O Contracts (Detailed)

Detailed input/output specifications for each IntegrateWise OS component.

## Hub

### Authentication Adapter

**Input:**
```typescript
interface Credentials {
  type: 'oauth2' | 'api_key' | 'service_account';
  token?: string;
  apiKey?: string;
  serviceAccountKey?: string;
  refreshToken?: string;
}
```

**Output:**
```typescript
interface AuthResult {
  authenticated: boolean;
  userId?: string;
  workspaceId?: string;
  scopes?: string[];
  expiresAt?: string; // ISO 8601
  error?: string;
}
```

**Error Codes:**
- `AUTH_INVALID_TOKEN`: Token expired or invalid
- `AUTH_INSUFFICIENT_SCOPES`: Missing required scopes
- `AUTH_WORKSPACE_MISMATCH`: Workspace not authorized

### Policy Engine

**Input:**
```typescript
interface PolicyRequest {
  userId: string;
  workspaceId: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  context?: Record<string, unknown>;
}
```

**Output:**
```typescript
interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  policyId?: string;
  conditions?: Record<string, unknown>;
}
```

**Policy Types:**
- RBAC: Role-based access control
- ABAC: Attribute-based access control
- Workspace isolation
- Resource-level permissions

### Router

**Input:**
```typescript
interface RoutedRequest {
  source: string; // connector identifier
  workspaceId: string;
  operation: 'read' | 'write' | 'webhook';
  mode?: 'full' | 'render_only';
}
```

**Output:**
```typescript
interface RoutingDirective {
  connector: string;
  mode: 'full' | 'render_only';
  scopes: string[];
  endpoint?: string;
  rateLimit?: RateLimit;
}
```

### Audit Sink

**Input:**
```typescript
interface AuditEvent {
  workspace_id: string;
  actor_id: string;
  action_type: 'read' | 'write' | 'delete' | 'approve' | 'deny';
  resource_type: string;
  resource_id?: string;
  timestamp: string; // ISO 8601
  request_id: string;
  policy_id?: string;
  outcome: 'success' | 'failure' | 'denied';
  metadata?: Record<string, unknown>;
}
```

**Output:**
- Stored in audit log (retention: 7 years)
- Queryable via audit API

### Usage Meter

**Input:**
```typescript
interface UsageEvent {
  workspace_id: string;
  resource_type: string;
  operation_type: string;
  count: number;
  timestamp: string; // ISO 8601
}
```

**Output:**
```typescript
interface UsageStats {
  workspace_id: string;
  period: 'daily' | 'weekly' | 'monthly';
  totals: Record<string, number>;
  breakdown: UsageBreakdown[];
}
```

## Spine

### Entity Store

**Input (Create):**
```typescript
interface CreateRequest<T extends SpineEntity> {
  entity: Omit<T, 'id' | 'created_at' | 'updated_at'>;
}
```

**Input (Update):**
```typescript
interface UpdateRequest<T extends SpineEntity> {
  id: string;
  updates: Partial<Omit<T, 'id' | 'created_at'>>;
}
```

**Input (Query):**
```typescript
interface QueryFilters {
  entityType: string;
  filters?: {
    [field: string]: {
      op: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
      value: unknown;
    };
  };
  relationships?: string[];
  limit?: number;
  cursor?: string;
  order?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
```

**Output:**
- Entity or array of entities
- Query metadata (cursor, total count)

**Error Codes:**
- `SPINE_INVALID_SCHEMA`: Entity schema validation failed
- `SPINE_CONSTRAINT_VIOLATION`: Uniqueness or relationship constraint violated
- `SPINE_NOT_FOUND`: Entity not found
- `SPINE_RELATIONSHIP_INVALID`: Relationship reference invalid

### Relationship Manager

**Input:**
```typescript
interface LinkRequest {
  sourceId: string;
  targetId: string;
  relationshipType: string;
  metadata?: Record<string, unknown>;
}
```

**Output:**
- Success confirmation
- Relationship object

## AI Loader

### Source Parser

**Input:**
```typescript
interface SourcePayload {
  connector: string;
  eventType: string;
  payload: unknown;
  headers: Record<string, string>;
}
```

**Output:**
```typescript
interface SourceData {
  connector: string;
  eventType: string;
  data: Record<string, unknown>;
  metadata: {
    externalRef: string;
    timestamp: string;
    sourceTool: string;
  };
}
```

### Transform Mapper

**Input:**
```typescript
interface MappingConfig {
  connector: string;
  sourceEntity: string;
  targetEntity: string;
  fieldMappings: FieldMapping[];
  transformations?: Transformation[];
}
```

**Output:**
- Normalized Spine entity

### Conflict Resolver

**Input:**
```typescript
interface Conflict {
  existing: SpineEntity;
  incoming: SpineEntity;
  conflictType: 'duplicate' | 'update' | 'merge';
}
```

**Output:**
```typescript
interface ConflictResolution {
  strategy: 'keep_existing' | 'use_incoming' | 'merge';
  resolved: SpineEntity;
}
```

## Brain

### Memory Store

**Input (Index):**
```typescript
interface IndexRequest {
  entity: SpineEntity;
  embeddings?: number[];
}
```

**Input (Search):**
```typescript
interface SearchQuery {
  query: string;
  entityTypes?: string[];
  filters?: QueryFilters;
  limit?: number;
  threshold?: number; // relevance threshold (0-1)
}
```

**Output:**
```typescript
interface SearchResult {
  entity: SpineEntity;
  relevanceScore: number; // 0-1
  matchedFields: string[];
}
```

### Linker

**Input:**
```typescript
interface LinkRequest {
  entityIds: string[];
  threshold: number; // minimum linkage score (0-100)
}
```

**Output:**
- Linked entity graph
- Linkage scores

## Agents

### Trigger Evaluator

**Input:**
```typescript
interface TriggerEvent {
  type: 'webhook' | 'schedule' | 'manual';
  source: string;
  payload: unknown;
  context: AgentContext;
}
```

**Output:**
```typescript
interface TriggerResult {
  triggered: boolean;
  agentId?: string;
  confidence?: number; // 0-1
}
```

### Approval Flow

**Input:**
```typescript
interface ApprovalRequest {
  agentId: string;
  action: AgentAction;
  requesterId: string;
  workspaceId: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
```

**Output:**
```typescript
interface ApprovalResult {
  approvalId: string;
  status: 'pending' | 'approved' | 'denied';
  approverId?: string;
  approvedAt?: string; // ISO 8601
  reason?: string;
}
```

### Context Retriever

**Input:**
```typescript
interface ContextQuery {
  query: string;
  entityTypes?: string[];
  workspaceId: string;
  userId: string;
  limit?: number;
}
```

**Output:**
```typescript
interface AgentContext {
  entities: SpineEntity[];
  relationships: Relationship[];
  metadata: Record<string, unknown>;
}
```

## Render

### Template Engine

**Input:**
```typescript
interface RenderParams {
  templateId: string;
  version?: string;
  variables: Record<string, unknown>;
  entityIds?: string[];
  options?: RenderOptions;
}
```

**Output:**
```typescript
interface RenderedContent {
  content: string; // markdown, HTML, etc.
  format: 'markdown' | 'html' | 'pdf' | 'json';
  metadata: {
    templateId: string;
    version: string;
    renderedAt: string; // ISO 8601
  };
}
```

### Output Target

**Input:**
```typescript
interface OutputTarget {
  type: 'notion' | 'gmail' | 'file' | 'api';
  destination: string;
  options?: Record<string, unknown>;
}
```

**Output:**
```typescript
interface ExportResult {
  success: boolean;
  targetId?: string;
  url?: string;
  error?: string;
}
```

## See Also

- [How It Works](./how-it-works.md) - High-level overview
- [Sequence Diagram](../diagrams/how-it-works.puml) - PlantUML diagram
