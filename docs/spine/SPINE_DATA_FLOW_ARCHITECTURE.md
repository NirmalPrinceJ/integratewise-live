# Spine Data Flow Architecture: Loader → n8n → Store → Brainstorm

**Date:** 2026-01-18  
**Key Understanding:** Loader analyzes schema, n8n normalizes with AI

---

## CRITICAL ARCHITECTURAL CLARIFICATION

### ✅ Correct Flow:

```
Tool/Integration → Loader (Schema Analysis + JSON) → n8n (Spine Normalization + AI) → Store → Brainstorm
```

### ❌ Wrong Understanding:

- Loader does NOT normalize
- Loader does NOT re-deal with schema
- Loader ONLY analyzes schema and converts to JSON

---

## THE 6 ENGINE STAGES

Based on IntegrateWise architecture:

1. **LOAD** - Loader pulls data from tools
2. **NORMALIZE** - n8n (Spine) normalizes with AI
3. **THINK** - Brainstorm/analysis layer
4. **ACT** - Task generation, actions
5. **GOVERN** - Rules, compliance, approvals
6. **REPEAT** - Continuous loop

---

## STAGE 1: LOAD (Loader's Role)

### What Loader Does:

**1. Schema Analysis:**
```typescript
// Loader analyzes the tool's schema
function analyzeSchema(toolData) {
  return {
    fields: extractFields(toolData),
    types: detectTypes(toolData),
    relationships: detectRelationships(toolData),
    structure: detectStructure(toolData)
  };
}
```

**2. Convert to JSON Schema:**
```typescript
// Loader converts to standardized JSON schema
function convertToJSONSchema(toolData, schema) {
  return {
    source: toolName,
    schema_version: "1.0",
    data: toolData,
    metadata: {
      analyzed_schema: schema,
      timestamp: new Date().toISOString(),
      source_type: toolName
    }
  };
}
```

**3. Send to n8n:**
```typescript
// Loader sends JSON to n8n webhook
POST /n8n/webhook/loader-input
{
  source: "slack",
  schema_analysis: { ... },
  json_data: { ... },
  metadata: { ... }
}
```

### Loader Does NOT:
- ❌ Normalize data
- ❌ Map fields to Spine format
- ❌ Classify workstreams
- ❌ Create Spine entities

### Loader ONLY:
- ✅ Analyzes tool schema
- ✅ Converts to JSON
- ✅ Sends to n8n

---

## STAGE 2: NORMALIZE (n8n Spine Engine)

### What n8n Does:

**1. Receive JSON from Loader:**
```json
{
  "source": "slack",
  "schema_analysis": {
    "fields": ["ts", "text", "user", "channel"],
    "types": { "ts": "string", "text": "string" },
    "structure": "message"
  },
  "json_data": {
    "ts": "1234567890.123456",
    "text": "todo: Complete onboarding",
    "user": "U12345",
    "channel": "C12345"
  }
}
```

**2. Classify Entity Type (with AI):**
```javascript
// n8n uses AI to classify
const entityType = await aiClassify({
  data: json_data,
  schema: schema_analysis,
  source: source
});
// Returns: "task" | "note" | "conversation" | "plan"
```

**3. Normalize to Spine Format:**
```javascript
// n8n normalizes based on entity type
const spineEntity = normalizeToSpine({
  entity_type: entityType,
  source: source,
  data: json_data,
  schema: schema_analysis
});
```

**4. Workstream Classification (with AI):**
```javascript
// n8n uses AI to classify workstream
const workstream = await aiClassifyWorkstream({
  entity: spineEntity,
  context: metadata
});
// Returns: "CSM" | "Startup" | "Personal" | "FlowTrix"
```

**5. Store to Core Engine:**
```javascript
// n8n sends normalized Spine entity to Core Engine
POST /api/events
{
  id: generateUUID(),
  source: source,
  type: entityType,
  timestamp: timestamp,
  payload: spineEntity,
  metadata: {
    workstream: workstream,
    workspace_id: workspace_id
  }
}
```

---

## COMPLETE DATA FLOW

### Phase 1: Initial Connection (Loader)

```
┌─────────────────┐
│  Tool/Integration│ (Slack, Asana, etc.)
└────────┬────────┘
         │ Raw Data
         ↓
┌─────────────────┐
│     LOADER      │ ← Stage 1: LOAD
│                 │
│ 1. Analyze      │
│    Schema       │
│                 │
│ 2. Convert to    │
│    JSON Schema  │
│                 │
│ 3. Send to n8n  │
└────────┬────────┘
         │ JSON Schema
         ↓
```

### Phase 2: Normalization (n8n Spine)

```
┌─────────────────┐
│   n8n WORKFLOW  │ ← Stage 2: NORMALIZE
│  (Spine Engine) │
│                 │
│ 1. Receive JSON │
│    from Loader  │
│                 │
│ 2. AI Classify  │
│    Entity Type  │
│                 │
│ 3. Normalize to │
│    Spine Format │
│                 │
│ 4. AI Classify  │
│    Workstream   │
│                 │
│ 5. Send to      │
│    Core Engine  │
└────────┬────────┘
         │ Normalized Spine Entity
         ↓
```

### Phase 3: Storage (Core Engine)

```
┌─────────────────┐
│  CORE ENGINE    │ ← Stage 3: STORE
│                 │
│ 1. Receive      │
│    Spine Entity │
│                 │
│ 2. Validate      │
│    Schema        │
│                 │
│ 3. Store to DB   │
│    (Neon Postgres)│
│                 │
│ 4. Trigger       │
│    Brainstorm    │
└────────┬────────┘
         │ Stored Entity
         ↓
```

### Phase 4: Brainstorm (Think Stage)

```
┌─────────────────┐
│   BRAINSTORM    │ ← Stage 3: THINK
│     LAYER       │
│                 │
│ 1. Analyze      │
│    Stored Data  │
│                 │
│ 2. Extract      │
│    Insights     │
│                 │
│ 3. Generate     │
│    Tasks        │
│                 │
│ 4. Create       │
│    Relationships│
└─────────────────┘
```

---

## LOADER IMPLEMENTATION PATTERN

### Loader Responsibilities:

**1. Schema Discovery:**
```typescript
async function discoverSchema(toolConnection) {
  // Connect to tool
  const connection = await connectToTool(toolConnection);
  
  // Fetch sample data
  const sampleData = await fetchSample(connection);
  
  // Analyze schema
  const schema = {
    fields: Object.keys(sampleData),
    types: inferTypes(sampleData),
    structure: detectStructure(sampleData),
    relationships: detectRelationships(sampleData)
  };
  
  return schema;
}
```

**2. Data Extraction:**
```typescript
async function extractData(toolConnection, schema) {
  // Fetch data using schema knowledge
  const rawData = await fetchData(toolConnection);
  
  // Convert to JSON (no normalization)
  const jsonData = {
    source: toolConnection.name,
    schema_version: "1.0",
    data: rawData,
    metadata: {
      schema: schema,
      extracted_at: new Date().toISOString()
    }
  };
  
  return jsonData;
}
```

**3. Send to n8n:**
```typescript
async function sendToN8N(jsonData) {
  await fetch(`${N8N_WEBHOOK_URL}/webhook/loader-input`, {
    method: 'POST',
    body: JSON.stringify(jsonData)
  });
}
```

---

## n8n NORMALIZATION PATTERN

### n8n Workflow Structure:

**Node 1: Webhook Trigger (Receive from Loader)**
```json
{
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "loader-input",
    "httpMethod": "POST"
  }
}
```

**Node 2: Extract Schema & Data**
```javascript
// Extract from loader JSON
const loaderData = $input.first().json;
const schema = loaderData.metadata.schema;
const rawData = loaderData.data;
const source = loaderData.source;
```

**Node 3: AI Classify Entity Type**
```javascript
// Use Open Router to classify
const classificationPrompt = `
Analyze this data and classify the entity type:
- Task: Has status, priority, due_date, assignee
- Conversation: Has participants, messages, channel
- Note: Has content, title, author
- Plan: Has goals, start_date, end_date

Data: ${JSON.stringify(rawData)}
Schema: ${JSON.stringify(schema)}
Source: ${source}

Return: "task" | "note" | "conversation" | "plan"
`;

const entityType = await callOpenRouter(classificationPrompt);
```

**Node 4: Normalize to Spine Format**
```javascript
// Normalize based on entity type
const spineEntity = normalize({
  entity_type: entityType,
  source: source,
  source_id: extractId(rawData, schema),
  workspace_id: extractWorkspace(rawData),
  
  // Map fields based on schema analysis
  ...mapFields(rawData, schema, entityType)
});
```

**Node 5: AI Classify Workstream**
```javascript
// Use Open Router to classify workstream
const workstreamPrompt = `
Classify the workstream for this entity:
- CSM: Customer success, accounts, health scores
- Startup: Business operations, fundraising, growth
- Personal: Personal finance, health, learning
- FlowTrix: Technical, development, infrastructure

Entity: ${JSON.stringify(spineEntity)}

Return: "CSM" | "Startup" | "Personal" | "FlowTrix"
`;

const workstream = await callOpenRouter(workstreamPrompt);
```

**Node 6: Send to Core Engine**
```javascript
// POST to Core Engine
await fetch(`${CORE_ENGINE_URL}/api/events`, {
  method: 'POST',
  body: JSON.stringify({
    id: generateUUID(),
    source: source,
    type: entityType,
    timestamp: new Date().toISOString(),
    payload: spineEntity,
    metadata: {
      workstream: workstream,
      workspace_id: workspace_id,
      schema_analysis: schema
    }
  })
});
```

---

## KEY DIFFERENCES: LOADER vs n8n

| Aspect | Loader | n8n (Spine) |
|--------|--------|-------------|
| **Purpose** | Schema analysis + JSON conversion | Normalization + AI classification |
| **Input** | Raw tool data | JSON from loader |
| **Output** | JSON schema | Normalized Spine entity |
| **AI Usage** | None | Entity type + workstream classification |
| **Schema Handling** | Analyzes, doesn't change | Normalizes to Spine format |
| **Field Mapping** | None | Maps to Spine fields |
| **When Used** | Initial connection, periodic sync | Every event |

---

## UPDATED WORKFLOW ARCHITECTURE

### Layer 1: Loaders (20 loaders)
- Purpose: Schema analysis + JSON conversion
- Files: `loader-slack.ts`, `loader-asana.ts`, etc.
- Output: JSON schema sent to n8n

### Layer 2: n8n Router (1 workflow)
- Purpose: Receive from loaders, route to normalizers
- File: `00-spine-router.json`

### Layer 3: n8n Normalizers (4 workflows)
- Purpose: Normalize to Spine format with AI
- Files:
  - `01-task-normalizer.json`
  - `02-conversation-normalizer.json`
  - `03-note-normalizer.json`
  - `04-plan-normalizer.json`

### Layer 4: n8n Orchestrators (4 workflows)
- Purpose: Coordinate by workstream
- Files:
  - `20-csm-orchestrator.json`
  - `21-startup-orchestrator.json`
  - `22-personal-orchestrator.json`
  - `23-flowtrix-orchestrator.json`

### Layer 5: n8n Operator Agents (10 workflows)
- Purpose: Domain-specific processing
- Files: `30-research-agent.json` through `39-support-agent.json`

---

## LOADER → n8n INTEGRATION

### Loader Code Pattern:

```typescript
// apps/integrationwise-os/lib/loaders/slack.ts
export async function loadSlackData(connection) {
  // 1. Analyze schema
  const schema = await analyzeSlackSchema(connection);
  
  // 2. Extract data
  const rawData = await fetchSlackData(connection);
  
  // 3. Convert to JSON schema
  const jsonSchema = {
    source: "slack",
    schema_version: "1.0",
    data: rawData,
    metadata: {
      schema: schema,
      extracted_at: new Date().toISOString(),
      workspace_id: connection.workspace_id
    }
  };
  
  // 4. Send to n8n
  await sendToN8N(jsonSchema);
  
  return {
    success: true,
    records_processed: rawData.length,
    schema: schema
  };
}
```

### n8n Webhook Endpoint:

```json
{
  "name": "Loader Input Handler",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "loader-input",
        "httpMethod": "POST"
      }
    },
    {
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Extract loader data\nconst loaderData = $input.first().json;\nconst schema = loaderData.metadata.schema;\nconst rawData = loaderData.data;\nconst source = loaderData.source;\n\n// Route to appropriate normalizer\nreturn [{\n  json: {\n    source: source,\n    schema: schema,\n    data: rawData,\n    metadata: loaderData.metadata\n  }\n}];"
      }
    }
  ]
}
```

---

## BRAINSTORM STAGE INTEGRATION

### After Storage:

```
Core Engine → Store to DB → Trigger Brainstorm
                                    ↓
                            ┌───────────────┐
                            │  BRAINSTORM   │
                            │     LAYER     │
                            │               │
                            │ 1. Analyze   │
                            │ 2. Extract   │
                            │ 3. Generate  │
                            │ 4. Relate    │
                            └───────────────┘
```

### Brainstorm Workflow:

```javascript
// Triggered after storage
async function brainstorm(spineEntity) {
  // 1. Analyze stored entity
  const analysis = await analyzeEntity(spineEntity);
  
  // 2. Extract insights
  const insights = await extractInsights(spineEntity);
  
  // 3. Generate tasks (if needed)
  const tasks = await generateTasks(spineEntity, insights);
  
  // 4. Create relationships
  const relationships = await inferRelationships(spineEntity);
  
  // 5. Update Atlas Spine
  await updateAtlasSpine(spineEntity, tasks, relationships);
}
```

---

## COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOOL/INTEGRATION                             │
│              (Slack, Asana, Stripe, etc.)                        │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Raw Data
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    LOADER (Stage 1: LOAD)                        │
│                                                                  │
│  1. Connect to Tool                                              │
│  2. Analyze Schema (fields, types, structure)                   │
│  3. Extract Data                                                  │
│  4. Convert to JSON Schema                                       │
│  5. Send to n8n                                                  │
└───────────────────────┬──────────────────────────────────────────┘
                        │ JSON Schema
                        │ { source, schema, data, metadata }
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              n8n ROUTER (Stage 2: NORMALIZE)                    │
│                                                                  │
│  1. Receive JSON from Loader                                     │
│  2. Extract schema & data                                        │
│  3. Route to appropriate normalizer                              │
└───────────────────────┬──────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ↓                               ↓
┌───────────────┐             ┌──────────────────┐
│ Task          │             │ Conversation     │
│ Normalizer    │             │ Normalizer       │
│ (with AI)     │             │ (with AI)        │
└───────┬───────┘             └────────┬─────────┘
        │                               │
        └───────────────┬───────────────┘
                        │ Normalized Spine Entity
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR (Workstream Routing)                  │
│                                                                  │
│  AI Classifies: CSM | Startup | Personal | FlowTrix            │
│  Routes to appropriate orchestrator                             │
└───────────────────────┬──────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ↓                               ↓
┌───────────────┐             ┌──────────────────┐
│ CSM           │             │ Startup           │
│ Orchestrator  │             │ Orchestrator      │
└───────┬───────┘             └────────┬─────────┘
        │                               │
        └───────────────┬───────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              OPERATOR AGENTS (Domain Processing)                │
│                                                                  │
│  Research | Dev | Marketing | Sales | Finance | CS | ...       │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Processed Entity
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              CORE ENGINE (Stage 3: STORE)                       │
│                                                                  │
│  1. Receive Spine Entity                                        │
│  2. Validate Schema                                             │
│  3. Store to Neon Postgres                                      │
│  4. Trigger Brainstorm                                          │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Stored Entity
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              BRAINSTORM LAYER (Stage 3: THINK)                  │
│                                                                  │
│  1. Analyze Stored Data                                         │
│  2. Extract Insights                                            │
│  3. Generate Tasks                                              │
│  4. Create Relationships                                        │
│  5. Update Atlas Spine                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## IMPLEMENTATION CHECKLIST

### Loader Updates Needed:

- [ ] Update loaders to analyze schema (not normalize)
- [ ] Convert to JSON schema format
- [ ] Send to n8n webhook endpoint
- [ ] Remove normalization logic from loaders

### n8n Workflows Needed:

- [ ] Router workflow (receive from loaders)
- [ ] 4 Normalizer workflows (Task, Note, Conversation, Plan)
- [ ] 4 Orchestrator workflows (CSM, Startup, Personal, FlowTrix)
- [ ] 10 Operator agent workflows

### Integration Points:

- [ ] Loader → n8n webhook endpoint
- [ ] n8n → Core Engine API
- [ ] Core Engine → Brainstorm trigger
- [ ] Brainstorm → Atlas Spine update

---

**This architecture ensures:**
1. ✅ Loader only analyzes schema and converts to JSON
2. ✅ n8n does all normalization with AI
3. ✅ Clear separation of concerns
4. ✅ Scalable and maintainable
