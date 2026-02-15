# Universal 8-Stage Ingestion Pipeline

The IntegrateWise OS uses a deterministic, universal 8-stage ingestion pipeline to process all data from connectors into the appropriate data stores. This architecture ensures consistency, traceability, and proper routing of data.

## Architecture Overview

```
┌─────────────┐
│ Raw Payload │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                    8-STAGE PIPELINE                       │
├──────────────────────────────────────────────────────────┤
│ Stage 1: ANALYZER       → Fingerprint, envelope          │
│ Stage 2: CLASSIFIER     → data_kind, domain, sensitivity │
│ Stage 3: FILTER         → RBAC, dedup, quota            │
│ Stage 4: REFINER        → Split units, extract IDs      │
│ Stage 5: EXTRACTOR      → Triple stream extraction      │
│ Stage 6: VALIDATOR      → Schema, cross-ref, evidence   │
│ Stage 7: SPLIT ROUTER   → Routing decisions             │
│ Stage 8: WRITERS        → Persist to stores             │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│            DATA STORES (Layer 3)            │
├─────────────────────────────────────────────┤
│ • Spine DB (structured entities)            │
│ • Context Store (unstructured text)         │
│ • Vector Index (knowledge embeddings)       │
│ • Memory DB (AI chat sessions)              │
│ • Object Store (files)                      │
│ • Audit Store (immutable logs)              │
│ • Event Bus (downstream events)             │
└─────────────────────────────────────────────┘
```

## Tool Mappings

Each connector (Salesforce, HubSpot, Slack, etc.) has a deterministic mapping in `tool-mappings.ts` that defines:

- **Classification defaults**: data_kind, domain, sensitivity
- **Entity hints**: Expected entity types (Account, Contact, etc.)
- **Payload classifiers**: Rules to detect specific object types
- **Extraction configs**: Field paths for structured/unstructured data
- **Filter configs**: Deduplication keys, rate limits, required fields

### Supported Tools (25+ connectors)

- **CRM**: Salesforce, HubSpot
- **Communication**: Slack, Gmail, Outlook, Microsoft Teams
- **Productivity**: Notion, Google Drive, Dropbox, Asana, Monday.com
- **Support**: Zendesk, Intercom
- **Finance**: Stripe, QuickBooks
- **Dev Tools**: GitHub, GitLab, Jira, Linear
- **Analytics**: Segment, Mixpanel, Google Analytics
- **AI**: OpenAI, Anthropic, Perplexity

## Pipeline Stages

### Stage 1: Analyzer

**Purpose**: Generate fingerprint and create canonical envelope

**Input**: `RawPayload` (raw webhook/API data)

**Output**: `AnalyzerOutput` (fingerprint_hash, envelope)

**Operations**:
- Generate content fingerprint for deduplication
- Detect MIME type if applicable
- Create canonical envelope with metadata

### Stage 2: Classifier

**Purpose**: Classify data using tool mappings

**Input**: `AnalyzerOutput`

**Output**: `ClassifierOutput` (data_kind, domain, sensitivity, entity_hints)

**Operations**:
- Look up tool mapping from `tool-mappings.ts`
- Detect payload type (e.g., 'Account', 'message')
- Apply specific classifier rules or use defaults
- Tag with entity hints

**Data Kinds**:
- `record` - Structured entities (CRM, tasks)
- `message` - Communication content
- `document` - Files, notes
- `telemetry` - Analytics events
- `chat` - AI conversations

**Domains**:
- `csm` - Customer success/CRM
- `support` - Support tickets
- `finance` - Financial records
- `personal` - Personal productivity
- `team` - Team collaboration
- `engineering` - Development tools
- `analytics` - Usage data

### Stage 3: Filter

**Purpose**: Apply RBAC, deduplication, and quotas

**Input**: `ClassifierOutput`

**Output**: `FilterOutput` (allowed, redactions, dedup_key, quota_ok)

**Operations**:
- Check RBAC policies (tenant/user permissions)
- Apply field redactions based on sensitivity
- Check deduplication using tool-specific key patterns
- Validate rate limits and quotas

### Stage 4: Refiner

**Purpose**: Split into processing units and extract IDs

**Input**: `FilterOutput`

**Output**: `RefinerOutput` (units[], ref_candidates)

**Operations**:
- Sanity checks on payload structure
- Split batch payloads into individual processing units
- Extract ID candidates for relationship linking
- Prepare for parallel extraction

### Stage 5: Extractor

**Purpose**: Extract data into triple stream (structured, unstructured, files)

**Input**: `RefinerOutput`

**Output**: `ExtractorOutput` (structured_entities, unstructured_blobs, files, ai_sessions)

**Operations**:
- Extract structured fields using extraction config paths
- Extract unstructured text for context store
- Extract file references for object store
- Extract AI chat sessions for memory store

**Triple Stream**:
1. **Structured**: Entities with typed fields → Spine DB
2. **Unstructured**: Text blobs for RAG → Context Store + Vector Index
3. **Files**: Binary content → Object Store
4. **AI Sessions**: Chat turns → Memory DB

### Stage 6: Validator

**Purpose**: Validate schema, cross-references, and evidence

**Input**: `ExtractorOutput`

**Output**: `ValidatorOutput` (validation_errors, confidence_score, trust_score, evidence_refs)

**Operations**:
- Schema validation against required fields
- Cross-reference validation (check relationships exist)
- Evidence chain creation (source → extraction → transformation)
- Calculate confidence score (extraction quality)
- Calculate trust score (source reliability)

### Stage 7: Split Router

**Purpose**: Determine write destinations

**Input**: `ValidatorOutput`

**Output**: `SplitRouterOutput` (write_plan, routing_reasons)

**Operations**:
- Analyze extracted content
- Decide which stores to write to:
  - `spine`: true if structured_entities exist
  - `context`: true if unstructured_blobs exist
  - `knowledge`: true if files exist
  - `memory`: true if ai_sessions exist
- Document routing reasoning

### Stage 8: Writers

**Purpose**: Persist to data stores and publish events

**Input**: `SplitRouterOutput`

**Output**: `WritersOutput` (spine_entity_ids, context_ids, chunk_ids, memory_ids, audit_log_id, events_published)

**Operations**:
- Write structured entities to Spine DB
- Write unstructured blobs to Context Store
- Write file chunks to Vector Index / Object Store
- Write AI sessions to Memory DB
- Write immutable audit log
- Publish events to Event Bus for downstream processing

## Usage

### Basic Usage

```typescript
import { IngestionPipeline, RawPayload } from './services/ingestion/pipeline-stages';
import { ObservabilityService } from './services/monitoring/observability-service';

// Initialize
const observability = new ObservabilityService({
  serviceName: 'my-service',
  enableMetrics: true,
  enableTracing: true,
});
const pipeline = new IngestionPipeline(observability);

// Create raw payload
const payload: RawPayload = {
  source_tool: 'salesforce',
  tenant_id: 'tenant_123',
  user_id: 'user_456',
  connector_id: 'connector_sf_123',
  received_at: Date.now(),
  raw_data: {
    Id: 'acc_001',
    Name: 'Acme Corp',
    Industry: 'Technology',
    // ... more fields
  },
  metadata: {
    object_type: 'Account',
    webhook_event: 'created',
  },
};

// Process through pipeline
const result = await pipeline.process(payload);

console.log('Pipeline result:', {
  spine_entities: result.spine_entity_ids,
  context_blobs: result.context_ids,
  knowledge_chunks: result.chunk_ids,
  memory_sessions: result.memory_ids,
  audit_log: result.audit_log_id,
  events: result.events_published,
});
```

### Queue Consumer Integration

The `sync-queue-consumer.ts` automatically uses the pipeline for all incoming events:

```typescript
// Events are automatically processed through the 8-stage pipeline
{
  type: 'data_ingest',
  source: 'salesforce',
  entity_type: 'Account',
  data: { /* raw data */ },
  context: {
    tenant_id: 'tenant_123',
    user_id: 'user_456',
  }
}
```

### Adding New Connectors

To add a new connector, add a mapping to `tool-mappings.ts`:

```typescript
export const TOOL_MAPPINGS: Record<string, ToolMapping> = {
  // ... existing mappings
  
  'new-tool': {
    tool_name: 'new-tool',
    default_data_kind: 'record',
    default_domain: ['csm'],
    default_sensitivity: 'business',
    entity_hints: [
      {
        type: 'Entity',
        spine_entity_type: 'entity',
        required_fields: ['id', 'name'],
        field_mappings: {
          'external_id': 'id',
          'display_name': 'name',
        },
      },
    ],
    payload_classifiers: [
      {
        object_type: 'Entity',
        data_kind: 'record',
        domain: 'csm',
        entity_hints: ['Entity'],
      },
    ],
    extraction_config: {
      structured_paths: ['id', 'name', 'email'],
      unstructured_fields: ['description', 'notes'],
      relationship_fields: ['owner_id', 'account_id'],
    },
    filter_config: {
      dedup_key_pattern: 'new-tool:{object_type}:{id}',
      rate_limit: { requests: 1000, window: 60000 },
      required_fields: ['id'],
    },
  },
};
```

## Data Flow Example: Salesforce Account

```
1. ANALYZER
   Input: Raw Salesforce webhook
   Output: fingerprint_hash, envelope with metadata

2. CLASSIFIER
   Input: Envelope
   Output: data_kind=record, domain=csm, entity_hints=[Account,Contact]

3. FILTER
   Input: Classified data
   Output: allowed=true, dedup_key=salesforce:Account:acc_001

4. REFINER
   Input: Filtered data
   Output: units=[single unit], ref_candidates={OwnerId: usr_123}

5. EXTRACTOR
   Input: Refined units
   Output: 
     - structured_entities: [{entity_type: Account, data: {...}}]
     - unstructured_blobs: [{text: "Account description..."}]

6. VALIDATOR
   Input: Extracted data
   Output: validation_errors=[], confidence_score=0.95, trust_score=1.0

7. SPLIT ROUTER
   Input: Validated data
   Output: write_plan={spine: true, context: true, knowledge: false, memory: false}

8. WRITERS
   Input: Routing plan
   Output: 
     - spine_entity_ids: [entity_123]
     - context_ids: [blob_456]
     - audit_log_id: audit_789
     - events_published: [entity.created.Account]
```

## Universal Backend Pattern

The pipeline implements the **Universal Backend Architecture**:

- **ONE Layer 2** (Cognitive Intelligence) for all users
- **ONE Layer 3** (Backend Service Mesh) for all users
- **Context-aware presentation** via Spine schema filtering:
  - `category` field: csm, team, personal, engineering
  - `scope` field: tenant_id, user_id, workspace_id

This means:
- All data goes through the SAME pipeline
- All data is stored in the SAME stores
- Filtering happens at query time using category + scope
- No per-tenant silos or duplicated infrastructure

## Observability

Each stage emits metrics and traces:

```typescript
// Metrics
analyzer_processed{source=salesforce}
classifier_processed{source=salesforce, data_kind=record, domain=csm}
filter_processed{source=salesforce, allowed=true}
// ... etc

// Traces
ingestion_pipeline
  ├─ analyzer_stage
  ├─ classifier_stage
  ├─ filter_stage
  ├─ refiner_stage
  ├─ extractor_stage
  ├─ validator_stage
  ├─ split_router_stage
  └─ writers_stage
```

## Testing

```typescript
import { AnalyzerStage } from './pipeline-stages';
import { ObservabilityService } from '../monitoring/observability-service';

const observability = new ObservabilityService({
  serviceName: 'test',
  enableMetrics: true,
  enableTracing: true,
});

const analyzer = new AnalyzerStage(observability);

const result = await analyzer.analyze({
  source_tool: 'salesforce',
  tenant_id: 'test_tenant',
  connector_id: 'test_connector',
  received_at: Date.now(),
  raw_data: { test: 'data' },
});

console.assert(result.fingerprint_hash !== undefined);
console.assert(result.envelope.source === 'salesforce');
```

## Error Handling

The pipeline uses the Circuit Breaker pattern from Layer 2:

```typescript
import { CircuitBreaker } from '../resilience/circuit-breaker';

const breaker = new CircuitBreaker({
  threshold: 5,
  timeout: 60000,
  resetTimeout: 30000,
});

await breaker.execute(async () => {
  return await pipeline.process(payload);
});
```

## Migration from Legacy

Legacy code using `ingestToSpine()` should migrate to the pipeline:

```typescript
// BEFORE (Legacy)
await ingestToSpine(event, env);

// AFTER (Pipeline)
const pipeline = new IngestionPipeline(observability);
await pipeline.process(rawPayload);
```

The legacy `legacyIngestToSpine()` function is still available for backward compatibility but is deprecated.

## Related Documentation

- [Tool Mappings](./tool-mappings.ts) - Connector configurations
- [Layer 2 Services](../README.md) - Security, resilience, monitoring
- [IntegrateWise OS Blueprint](../../docs/INTEGRATEWISE_OS_BLUEPRINT.md) - Complete architecture

## Key Benefits

1. **Deterministic**: Same input always produces same classification
2. **Traceable**: Evidence chain from source to storage
3. **Flexible**: Easy to add new connectors
4. **Universal**: Single pipeline for all data types
5. **Observable**: Metrics and traces at every stage
6. **Resilient**: Built-in error handling and validation
7. **Context-aware**: Automatic routing based on data characteristics
