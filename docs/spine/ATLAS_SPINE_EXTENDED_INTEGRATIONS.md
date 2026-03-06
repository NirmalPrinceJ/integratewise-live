# Atlas Spine: Extended Input Streams & Integration Architecture

**Date:** 2026-01-18  
**System:** Complete IntegrateWise Input Stream Architecture  
**Purpose:** Map all external sources, integrations, and connectors to Atlas Spine

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INPUT STREAMS                        │
│  (Stripe, Slack, HubSpot, Notion, Asana, GitHub, etc.)          │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Raw Events/Webhooks
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              INTEGRATEWISE WEBHOOK WORKER                        │
│         (Cloudflare Workers - 30+ Endpoints)                     │
│  - Receives webhooks from all sources                            │
│  - Validates signatures                                          │
│  - Idempotency checks                                            │
│  - Fire-and-forget to n8n                                        │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Raw Events (with metadata)
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    n8n WORKFLOWS (SPINE)                         │
│              Normalization & Transformation Layer                │
│  - Receives raw events from webhook worker                       │
│  - Normalizes to Spine format                                    │
│  - Maps fields to standard schema                                │
│  - Creates Spine entities (Task, Note, Conversation, Plan)      │
│  - Routes to appropriate workstream                              │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Normalized Spine Events/Entities
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              INTEGRATEWISE CORE ENGINE                          │
│         (Node.js/Hono - Event Processing)                        │
│  - Receives normalized Spine events                             │
│  - Stores to Neon Postgres (spine_events table)                  │
│  - Routes to AI for task generation                             │
│  - Creates actionable tasks                                     │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Spine Events + Tasks
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ATLAS SPINE (AIRTABLE)                        │
│              Master Relationship Registry                        │
│  - MASTER_SPINE: Central relationship tracking                  │
│  - TASKS_SPINE: Task-specific relationships                     │
│  - CONVERSATIONS: Communication tracking                        │
│  - All operational tables (Accounts, Projects, etc.)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPLETE INPUT STREAM INVENTORY

### Category 1: Payment & Financial (3 sources)

#### 1.1 Stripe
**Webhook Endpoint:** `/webhooks/stripe`  
**Loader:** N/A (webhook-only)  
**n8n Workflow:** `stripe-to-spine.json` (to be created)

**Input Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `charge.refunded`

**Spine Normalization:**
```javascript
// n8n Normalization Pattern
{
  entity_id: `ent_stripe_${event.id}`,
  source_type: "stripe",
  source_id: event.id,
  workstream: "Startup", // or "CSM" based on customer metadata
  type: event.type,
  payload: {
    amount: event.data.object.amount,
    currency: event.data.object.currency,
    customer_id: event.data.object.customer,
    subscription_id: event.data.object.subscription,
    status: event.data.object.status
  },
  metadata: {
    raw_event_id: event.id,
    timestamp: event.created
  }
}
```

**Atlas Spine Mapping:**
- Creates **11_MRR** records (recurring revenue)
- Creates **10_INVOICES** records (billing)
- Links to **05_CLIENTS** or **02_ACCOUNTS** via customer_id
- Updates **13_CONTRACTS** subscription status

**Box Integration:**
- Invoice PDFs → `345543338128` (02_Financial_Models)
- Receipts → `345606632937` (01_Finance - Personal)

---

#### 1.2 Gmail (Email)
**Webhook Endpoint:** N/A (polling-based)  
**Loader:** `/webhooks/loader/gmail`  
**n8n Workflow:** `gmail-to-spine.json` (to be created)

**Input Events:**
- Email received
- Email sent
- Email thread updates
- Attachment downloads

**Spine Normalization:**
```javascript
{
  entity_id: `ent_gmail_${email.id}`,
  source_type: "gmail",
  source_id: email.id,
  workstream: classifyByContent(email), // AI classification
  type: "email",
  payload: {
    subject: email.subject,
    from: email.from,
    to: email.to,
    body: email.body,
    thread_id: email.threadId,
    attachments: email.attachments
  }
}
```

**Atlas Spine Mapping:**
- Creates **CONVERSATIONS** records (email threads)
- Creates **06_ARTIFACTS** (email attachments)
- Links to **04_CONTACTS** (from/to email addresses)
- May create **07_TASKS** if action items detected

**Box Integration:**
- Email attachments → Workstream-specific folders
- Thread archives → `345545248271` (02_Client_Communications)

---

#### 1.3 Google Sheets
**Webhook Endpoint:** N/A (polling-based)  
**Loader:** `/webhooks/loader/sheets`  
**n8n Workflow:** `sheets-to-spine.json` (to be created)

**Input Events:**
- Sheet updates
- Row additions/modifications
- Formula recalculations

**Spine Normalization:**
```javascript
{
  entity_id: `ent_sheets_${sheetId}_${rowId}`,
  source_type: "sheets",
  source_id: `${sheetId}_${rowId}`,
  workstream: determineFromSheetName(sheetName),
  type: "data_update",
  payload: {
    sheet_name: sheetName,
    row_data: rowData,
    updated_fields: changedFields
  }
}
```

**Atlas Spine Mapping:**
- Creates **01_ENTITIES** for tracked rows
- Updates **14_CSM_METRICS** (if metrics sheet)
- Updates **11_MRR** (if revenue sheet)
- Creates **07_TASKS** (if task tracking sheet)

---

### Category 2: Communication & Collaboration (4 sources)

#### 2.1 Slack
**Webhook Endpoint:** `/webhooks/slack`  
**Loader:** `/webhooks/loader/slack`  
**n8n Workflow:** `slack-to-spine.json` (to be created)

**Input Events:**
- `app_mention` - Bot mentions
- `message` - Channel messages
- `reaction_added` - Reactions
- `file_shared` - File uploads
- `thread_broadcast` - Thread replies

**Spine Normalization:**
```javascript
{
  entity_id: `ent_slack_${message.ts}`,
  source_type: "slack",
  source_id: message.ts,
  workstream: classifyByChannel(message.channel),
  type: "conversation",
  payload: {
    channel_id: message.channel,
    channel_name: channel.name,
    user_id: message.user,
    text: message.text,
    thread_ts: message.thread_ts,
    reactions: message.reactions,
    files: message.files
  }
}
```

**Atlas Spine Mapping:**
- Creates **CONVERSATIONS** records (Slack threads)
- Creates **07_TASKS** (from todo: lines or action items)
- Links to **04_CONTACTS** (Slack users)
- Creates **06_ARTIFACTS** (shared files)
- May link to **02_ACCOUNTS** or **03_PROJECTS** (channel-based)

**Box Integration:**
- Shared files → `345496549341` (02_Shared_Resources)
- Meeting notes → `345546633109` (04_Meeting_Notes)

---

#### 2.2 Discord
**Webhook Endpoint:** `/webhooks/discord`  
**Loader:** N/A (webhook-only)  
**n8n Workflow:** `discord-to-spine.json` (to be created)

**Input Events:**
- Message created
- Message updated
- Message deleted
- Reaction added
- Member joined/left

**Spine Normalization:**
```javascript
{
  entity_id: `ent_discord_${message.id}`,
  source_type: "discord",
  source_id: message.id,
  workstream: "FlowTrix", // or classify by server/channel
  type: "conversation",
  payload: {
    channel_id: message.channel_id,
    guild_id: message.guild_id,
    author_id: message.author.id,
    content: message.content,
    attachments: message.attachments
  }
}
```

**Atlas Spine Mapping:**
- Creates **CONVERSATIONS** records
- Links to **04_CONTACTS** (Discord users)
- Creates **06_ARTIFACTS** (attachments)

---

#### 2.3 Notion
**Webhook Endpoint:** `/webhooks/notion`  
**Loader:** `/webhooks/loader/notion`  
**n8n Workflow:** `notion-to-spine.json` (to be created)

**Input Events:**
- Page created
- Page updated
- Database row added
- Database row updated
- Comment added

**Spine Normalization:**
```javascript
{
  entity_id: `ent_notion_${page.id}`,
  source_type: "notion",
  source_id: page.id,
  workstream: classifyByDatabase(page.parent.database_id),
  type: page.object === "page" ? "note" : "task",
  payload: {
    title: page.properties.title,
    content: page.content,
    database_id: page.parent.database_id,
    properties: page.properties,
    url: page.url
  }
}
```

**Atlas Spine Mapping:**
- Creates **06_ARTIFACTS** (Notion pages as documents)
- Creates **07_TASKS** (if task database)
- Creates **08_MILESTONES** (if project database)
- Creates **03_PROJECTS** (if project database)
- Links to **01_ENTITIES** (universal entity registry)

**Box Integration:**
- Exported pages → `345494999692` (06_System_Documentation)
- Project docs → `345542214914` (04_Product_Development)

---

#### 2.4 Asana
**Webhook Endpoint:** `/webhooks/asana`  
**Loader:** N/A (webhook-only)  
**n8n Workflow:** `04-asana-sync.json` ✅ (EXISTS)

**Input Events:**
- Task created
- Task updated
- Task completed
- Project updated
- Custom field changes

**Spine Normalization:**
```javascript
// Existing pattern from 04-asana-sync.json
{
  entity_id: `ent_asana_${task.gid}`,
  source_type: "asana",
  source_id: task.gid,
  workstream: extractFromCustomFields(task.custom_fields),
  type: "task",
  payload: {
    task_name: task.name,
    completed: task.completed,
    due_date: task.due_on,
    assignee: task.assignee,
    project_gid: task.projects[0].gid,
    custom_fields: extractedFields
  }
}
```

**Atlas Spine Mapping:**
- Creates **07_TASKS** records
- Links to **03_PROJECTS** (via project_gid)
- Links to **02_ACCOUNTS** (via custom fields)
- Updates **14_CSM_METRICS** (if health score field)

**Box Integration:**
- Project files → `345542214914` (04_Product_Development)
- Account docs → `345499234929` (01_Accounts)

---

### Category 3: CRM & Sales (2 sources)

#### 3.1 HubSpot
**Webhook Endpoint:** `/webhooks/hubspot`  
**Loader:** `/webhooks/loader/hubspot`  
**n8n Workflow:** `hubspot-to-spine.json` (to be created)

**Input Events:**
- Contact created/updated
- Deal created/updated
- Company created/updated
- Ticket created/updated
- Email sent/received

**Spine Normalization:**
```javascript
{
  entity_id: `ent_hubspot_${object.id}`,
  source_type: "hubspot",
  source_id: object.id,
  workstream: object.objectType === "deal" ? "Startup" : "CSM",
  type: object.objectType, // contact, deal, company, ticket
  payload: {
    properties: object.properties,
    associations: object.associations,
    created_at: object.createdAt,
    updated_at: object.updatedAt
  }
}
```

**Atlas Spine Mapping:**
- Creates **04_CONTACTS** (HubSpot contacts)
- Creates **09_DEALS** (HubSpot deals)
- Creates **05_CLIENTS** (HubSpot companies)
- Links to **02_ACCOUNTS** (via company association)
- Creates **07_TASKS** (from tickets)

**Box Integration:**
- Deal documents → `345543107955` (06_Fundraising)
- Company files → `345499234929` (01_Accounts)

---

#### 3.2 Attio (via Custom Integration)
**Webhook Endpoint:** `/webhooks/attio` (custom)  
**Loader:** N/A  
**n8n Workflow:** `attio-to-spine.json` (to be created)

**Input Events:**
- Person created/updated
- Company created/updated
- Note created
- Task created

**Spine Normalization:**
```javascript
{
  entity_id: `ent_attio_${record.id}`,
  source_type: "attio",
  source_id: record.id,
  workstream: classifyByWorkspace(record.workspace_id),
  type: record.type, // person, company, note, task
  payload: {
    properties: record.properties,
    relationships: record.relationships
  }
}
```

**Atlas Spine Mapping:**
- Creates **04_CONTACTS** (Attio people)
- Creates **05_CLIENTS** (Attio companies)
- Creates **07_TASKS** (Attio tasks)
- Creates **06_ARTIFACTS** (Attio notes)

---

### Category 4: Development & Code (1 source)

#### 4.1 GitHub
**Webhook Endpoint:** `/webhooks/github`  
**Loader:** N/A (webhook-only)  
**n8n Workflow:** `github-to-spine.json` (to be created)

**Input Events:**
- `push` - Code pushes
- `pull_request` - PR opened/closed
- `issues` - Issue created/closed
- `release` - Releases published
- `workflow_run` - CI/CD runs

**Spine Normalization:**
```javascript
{
  entity_id: `ent_github_${event.id}`,
  source_type: "github",
  source_id: event.id,
  workstream: "FlowTrix", // technical workstream
  type: event.type,
  payload: {
    repository: event.repository.full_name,
    action: event.action,
    sender: event.sender.login,
    ref: event.ref,
    commits: event.commits
  }
}
```

**Atlas Spine Mapping:**
- Creates **06_ARTIFACTS** (code artifacts)
- Creates **07_TASKS** (from issues)
- Links to **03_PROJECTS** (via repository mapping)
- Creates **08_MILESTONES** (from releases)

**Box Integration:**
- Release docs → `345494999692` (06_System_Documentation)
- Project docs → `345542214914` (04_Product_Development)

---

### Category 5: AI & Automation (2 sources)

#### 5.1 AI-Relay
**Webhook Endpoint:** `/webhooks/ai-relay`  
**Loader:** N/A  
**n8n Workflow:** `ai-relay-to-spine.json` (to be created)

**Input Events:**
- AI conversation completed
- Task generated
- Analysis completed
- Summary generated

**Spine Normalization:**
```javascript
{
  entity_id: `ent_ai_${conversation.id}`,
  source_type: "ai-relay",
  source_id: conversation.id,
  workstream: classifyByModel(conversation.model),
  type: "conversation",
  payload: {
    model: conversation.model,
    prompt: conversation.prompt,
    response: conversation.response,
    tokens_used: conversation.usage,
    tasks_generated: conversation.tasks
  }
}
```

**Atlas Spine Mapping:**
- Creates **CONVERSATIONS** records (AI interactions)
- Creates **07_TASKS** (AI-generated tasks)
- Creates **06_ARTIFACTS** (AI summaries/analyses)

---

#### 5.2 ChatGPT/Claude (via Conversations Table)
**Webhook Endpoint:** N/A (captured via TASKS_SPINE)  
**Loader:** N/A  
**n8n Workflow:** N/A (handled in TASKS_SPINE)

**Input Events:**
- Conversation messages
- Task extraction
- Workstream classification

**Spine Normalization:**
- Handled directly in **TASKS_SPINE** table
- See `ATLAS_SPINE_TABLE_RELATIONSHIPS.md` for details

**Atlas Spine Mapping:**
- Creates **CONVERSATIONS** records
- Creates **TASKS_SPINE** entries
- Creates **07_TASKS** (when action items found)
- Auto-creates **01_ENTITIES** (ent_[conversation_UUID])

---

### Category 6: Marketing & Web (1 source)

#### 6.1 Webflow
**Webhook Endpoint:** `/webhooks/webflow`  
**Loader:** N/A (webhook-only)  
**n8n Workflow:** `webflow-to-spine.json` (to be created)

**Input Events:**
- Form submission
- CMS item published
- E-commerce order
- Site publish

**Spine Normalization:**
```javascript
{
  entity_id: `ent_webflow_${event.id}`,
  source_type: "webflow",
  source_id: event.id,
  workstream: "Startup", // marketing workstream
  type: event.type, // form_submission, cms_publish, order
  payload: {
    form_id: event.formId,
    data: event.data,
    site_id: event.siteId
  }
}
```

**Atlas Spine Mapping:**
- Creates **04_CONTACTS** (from form submissions)
- Creates **09_DEALS** (from lead forms)
- Creates **07_TASKS** (follow-up tasks)
- Links to **01_ENTITIES** (universal registry)

---

### Category 7: Scheduled & Internal (6 sources)

#### 7.1 Daily Insights Cron
**Webhook Endpoint:** `/webhooks/cron/daily-insights`  
**n8n Workflow:** `daily-insights.json` (to be created)

**Purpose:** Generate daily business insights

**Spine Normalization:**
```javascript
{
  entity_id: `ent_cron_daily_${date}`,
  source_type: "cron",
  source_id: `daily_${date}`,
  workstream: "Common",
  type: "insight",
  payload: {
    date: date,
    metrics: aggregatedMetrics,
    insights: generatedInsights
  }
}
```

**Atlas Spine Mapping:**
- Updates **14_CSM_METRICS** (daily snapshots)
- Creates **06_ARTIFACTS** (insight reports)

---

#### 7.2 Hourly Insights Cron
**Webhook Endpoint:** `/webhooks/cron/hourly-insights`  
**n8n Workflow:** `hourly-insights.json` (to be created)

**Purpose:** Real-time monitoring and alerts

---

#### 7.3 Spend Insights Cron
**Webhook Endpoint:** `/webhooks/cron/spend-insights`  
**n8n Workflow:** `spend-insights.json` (to be created)

**Purpose:** Financial spend analysis

**Atlas Spine Mapping:**
- Updates **15_PERSONAL_FINANCE** (spend tracking)
- Updates **11_MRR** (revenue analysis)

---

#### 7.4 Outbox Processor
**Webhook Endpoint:** `/webhooks/cron/outbox`  
**n8n Workflow:** `outbox-processor.json` (to be created)

**Purpose:** Process queued actions

---

#### 7.5 Integrity Check
**Webhook Endpoint:** `/webhooks/cron/integrity-check`  
**n8n Workflow:** `integrity-check.json` (to be created)

**Purpose:** Data integrity validation

**Atlas Spine Mapping:**
- Validates **MASTER_SPINE** relationships
- Identifies orphaned records in **01_ENTITIES**

---

#### 7.6 Sync Scheduler
**Webhook Endpoint:** `/webhooks/cron/sync-scheduler`  
**n8n Workflow:** `sync-scheduler.json` (to be created)

**Purpose:** Coordinate data synchronization

---

### Category 8: API & Custom (4 sources)

#### 8.1 Webform
**Webhook Endpoint:** `/webform`  
**n8n Workflow:** `webform-to-spine.json` (to be created)

**Purpose:** Public contact form submissions

**Atlas Spine Mapping:**
- Creates **04_CONTACTS** (form submissions)
- Creates **07_TASKS** (follow-up tasks)

---

#### 8.2 Brainstorm
**Webhook Endpoint:** `/webhooks/brainstorm`  
**n8n Workflow:** `brainstorm-to-spine.json` (to be created)

**Purpose:** AI brainstorming analysis

**Atlas Spine Mapping:**
- Creates **06_ARTIFACTS** (brainstorm notes)
- Creates **07_TASKS** (action items)

---

#### 8.3 Neutron Ingest
**Webhook Endpoint:** `/webhooks/neutron/ingest`  
**n8n Workflow:** `neutron-ingest.json` (to be created)

**Purpose:** Neutron data ingestion

---

#### 8.4 Data Sync
**Webhook Endpoint:** `/webhooks/data-sync`  
**n8n Workflow:** `data-sync.json` (to be created)

**Purpose:** Manual data synchronization trigger

---

## n8n WORKFLOW ARCHITECTURE

### Workflow Pattern (Standard Template)

Every input stream follows this normalization pattern:

```
┌─────────────────┐
│  Webhook Trigger│ ← Receives from IntegrateWise Webhook Worker
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Parse Payload  │ ← Extract raw event data
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Validate Event │ ← Signature verification, idempotency check
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Normalize Data │ ← Map to Spine format (Code Node)
│  (Code Node)    │   - Field mapping
│                 │   - Data transformation
│                 │   - Workstream classification
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Create Entity   │ ← Generate entity_id (ent_[source]_[id])
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Route to Spine  │ ← Determine Spine entity type
│  (Task/Note/     │   - Task: Actionable items
│   Conversation/  │   - Note: Documentation
│   Plan)         │   - Conversation: Communications
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Store to DB    │ ← POST to Core Engine /events endpoint
│  (HTTP Request)  │   OR direct PostgreSQL insert
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Update Airtable│ ← POST to Airtable API (if needed)
│  (HTTP Request)  │   OR webhook to Airtable automation
└─────────────────┘
```

### Normalization Code Template

```javascript
// Standard n8n Code Node Template
const rawEvent = $input.first().json;

// 1. Extract source metadata
const source = rawEvent.source; // stripe, slack, etc.
const eventType = rawEvent.type;
const eventId = rawEvent.id || rawEvent.data?.id;

// 2. Generate entity ID
const entityId = `ent_${source}_${eventId}`;

// 3. Classify workstream
const workstream = classifyWorkstream(rawEvent);

// 4. Map to Spine format
const spineEvent = {
  id: generateUUID(),
  source: source,
  type: eventType,
  timestamp: rawEvent.timestamp || new Date().toISOString(),
  payload: normalizePayload(rawEvent.data || rawEvent),
  metadata: {
    raw_event_id: eventId,
    workspace_id: extractWorkspace(rawEvent),
    user_id: extractUserId(rawEvent)
  }
};

// 5. Determine Spine entity type
const spineEntityType = determineEntityType(rawEvent);

// 6. Create Spine entity (if applicable)
let spineEntity = null;
if (spineEntityType === "task") {
  spineEntity = {
    id: generateUUID(),
    workspace_id: spineEvent.metadata.workspace_id,
    source_id: eventId,
    source_type: source,
    title: extractTaskTitle(rawEvent),
    description: extractTaskDescription(rawEvent),
    status: "open",
    priority: extractPriority(rawEvent),
    // ... more task fields
  };
} else if (spineEntityType === "conversation") {
  spineEntity = {
    id: generateUUID(),
    workspace_id: spineEvent.metadata.workspace_id,
    source_id: eventId,
    source_type: source,
    channel_name: extractChannel(rawEvent),
    participants: extractParticipants(rawEvent),
    messages: extractMessages(rawEvent),
    // ... more conversation fields
  };
}

// 7. Return normalized data
return [{
  json: {
    spine_event: spineEvent,
    spine_entity: spineEntity,
    entity_id: entityId,
    workstream: workstream
  }
}];

// Helper Functions
function classifyWorkstream(event) {
  // AI classification or rule-based
  if (event.source === "stripe") return "Startup";
  if (event.channel?.includes("csm")) return "CSM";
  if (event.channel?.includes("personal")) return "Personal";
  return "FlowTrix";
}

function determineEntityType(event) {
  if (event.type.includes("task") || event.type.includes("todo")) return "task";
  if (event.type.includes("message") || event.type.includes("conversation")) return "conversation";
  if (event.type.includes("note") || event.type.includes("page")) return "note";
  if (event.type.includes("plan") || event.type.includes("project")) return "plan";
  return null;
}
```

---

## INTEGRATION CONNECTOR PATTERNS

### Pattern 1: Webhook → n8n → Core Engine → Airtable

**Flow:**
1. External source sends webhook → IntegrateWise Webhook Worker
2. Webhook Worker validates → Forwards to n8n webhook trigger
3. n8n normalizes → Creates Spine event/entity
4. n8n stores → POST to Core Engine `/events` endpoint
5. Core Engine processes → Stores to Neon Postgres
6. Core Engine triggers → Airtable webhook automation
7. Airtable automation → Creates/updates records

**Use Cases:**
- Stripe payments
- Slack messages
- HubSpot contacts/deals
- GitHub events

---

### Pattern 2: Polling Loader → n8n → Airtable

**Flow:**
1. Cron job triggers → Loader endpoint (`/webhooks/loader/[source]`)
2. Loader fetches data → From external API (Slack, Notion, Gmail, Sheets)
3. Loader transforms → To Spine format
4. Loader sends → To n8n webhook trigger
5. n8n processes → Additional normalization
6. n8n stores → Direct to Airtable API

**Use Cases:**
- Gmail email sync
- Notion page sync
- Google Sheets data sync
- Slack conversation history

---

### Pattern 3: Direct n8n → Airtable (No Core Engine)

**Flow:**
1. External source → Direct n8n webhook trigger
2. n8n normalizes → Creates Spine format
3. n8n stores → Direct POST to Airtable API
4. Airtable automation → Creates MASTER_SPINE relationships

**Use Cases:**
- Asana tasks (existing workflow)
- Simple integrations
- Real-time updates

---

### Pattern 4: AI Processing → Spine → Airtable

**Flow:**
1. Conversation/event → AI analysis endpoint
2. AI extracts → Action items, workstream, entities
3. AI creates → Spine entities (Tasks, Notes)
4. Store → Core Engine or direct Airtable
5. Airtable → Creates TASKS_SPINE entries

**Use Cases:**
- ChatGPT conversations
- AI-Relay processing
- Brainstorm analysis
- Automated task generation

---

## CONNECTOR CONFIGURATION

### Webhook Worker Configuration

**Location:** `apps/integratewise-webhooks/src/lib/tool-registry.ts`

**Example:**
```typescript
{
  id: 'slack',
  enabled: true,
  webhook: {
    path: '/webhooks/slack',
    method: 'POST',
    handler: 'slack'
  },
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_SLACK_URL,
    enabled: true
  },
  health: {
    endpoint: 'https://slack.com/api/api.test',
    method: 'GET'
  }
}
```

### n8n Workflow Configuration

**Environment Variables:**
```env
# Core Engine
CORE_ENGINE_URL=https://core-engine.integratewise.ai
CORE_ENGINE_API_KEY=sk_...

# Airtable
AIRTABLE_API_KEY=pat_...
AIRTABLE_BASE_ID=app_...
AIRTABLE_MASTER_SPINE_TABLE=tbl_...
AIRTABLE_TASKS_SPINE_TABLE=tbl_...

# Database (if direct)
DATABASE_URL=postgresql://...

# Box Integration
BOX_ACCESS_TOKEN=...
BOX_FOLDER_MAPPING={"CSM": "345493389131", "Startup": "345496019345", ...}
```

### Airtable Automation Configuration

**Webhook Trigger:**
- URL: `https://hooks.airtable.com/workflows/[workflow_id]/webhooks/[webhook_id]`
- Method: POST
- Payload: Spine event/entity JSON

**Automation Actions:**
1. Create/Update record in target table
2. Create MASTER_SPINE entry
3. Link to 01_ENTITIES
4. Update Box folder references

---

## WORKSTREAM CLASSIFICATION LOGIC

### Classification Rules

```javascript
function classifyWorkstream(event) {
  // Rule 1: Source-based
  if (event.source === "stripe") return "Startup";
  if (event.source === "asana") {
    // Check Asana custom fields
    if (event.custom_fields?.workstream) return event.custom_fields.workstream;
    // Check project name
    if (event.project_name?.includes("CSM")) return "CSM";
    if (event.project_name?.includes("Personal")) return "Personal";
    return "Startup";
  }
  
  // Rule 2: Channel/Context-based
  if (event.channel?.includes("csm") || event.channel?.includes("customer")) return "CSM";
  if (event.channel?.includes("personal") || event.channel?.includes("private")) return "Personal";
  if (event.channel?.includes("startup") || event.channel?.includes("business")) return "Startup";
  
  // Rule 3: Content-based (AI classification)
  const content = event.text || event.content || event.description || "";
  if (content.match(/customer|account|renewal|health score/i)) return "CSM";
  if (content.match(/personal|finance|health|learning/i)) return "Personal";
  if (content.match(/startup|fundraising|investor|business plan/i)) return "Startup";
  
  // Rule 4: Entity-based
  if (event.account_id || event.client_id) {
    // Check entity metadata
    const entity = getEntity(event.account_id || event.client_id);
    if (entity?.workstream) return entity.workstream;
  }
  
  // Default
  return "FlowTrix";
}
```

---

## BOX INTEGRATION MAPPING

### Workstream → Box Folder Mapping

| Workstream | Box Folder | Folder ID | Use Case |
|------------|------------|-----------|----------|
| **CSM** | 01_Accounts | 345499234929 | Account documents |
| **CSM** | 02_Client_Communications | 345545248271 | Email, messages |
| **CSM** | 03_Health_Scores | 345544343798 | Health dashboards |
| **CSM** | 04_Meeting_Notes | 345546633109 | Meeting notes |
| **CSM** | 05_QBRs | 345545303877 | QBR materials |
| **CSM** | 06_Renewals | 345546231796 | Renewal docs |
| **Startup** | 01_Business_Plan | 345542050856 | Business plans |
| **Startup** | 02_Financial_Models | 345543338128 | Financial docs |
| **Startup** | 03_Marketing | 345545785988 | Marketing materials |
| **Startup** | 04_Product_Development | 345542214914 | Product docs |
| **Startup** | 06_Fundraising | 345543107955 | Investor materials |
| **Startup** | 07_Legal_Compliance | 345541657556 | Legal docs |
| **Personal** | 01_Finance | 345606632937 | Personal finance |
| **Personal** | 02_Health_Fitness | 345604350592 | Health docs |
| **Personal** | 03_Learning_Development | 345603988793 | Learning materials |
| **FlowTrix** | 06_System_Documentation | 345494999692 | Technical docs |
| **Common** | 02_Shared_Resources | 345496549341 | Shared files |

### Box Integration in n8n

**Code Node Pattern:**
```javascript
// Determine Box folder based on workstream
const BOX_FOLDER_MAP = {
  "CSM": {
    "account": "345499234929",
    "communication": "345545248271",
    "health": "345544343798",
    "meeting": "345546633109",
    "qbr": "345545303877",
    "renewal": "345546231796"
  },
  "Startup": {
    "business": "345542050856",
    "financial": "345543338128",
    "marketing": "345545785988",
    "product": "345542214914",
    "fundraising": "345543107955",
    "legal": "345541657556"
  },
  "Personal": {
    "finance": "345606632937",
    "health": "345604350592",
    "learning": "345603988793"
  },
  "FlowTrix": {
    "documentation": "345494999692"
  }
};

const workstream = $json.workstream;
const documentType = determineDocumentType($json);
const folderId = BOX_FOLDER_MAP[workstream]?.[documentType] || BOX_FOLDER_MAP[workstream]?.default;

return [{
  json: {
    ...$json,
    box_folder_id: folderId,
    box_link: folderId ? `https://app.box.com/folder/${folderId}` : null
  }
}];
```

---

## COMPLETE INTEGRATION MATRIX

| Source | Webhook | Loader | n8n Workflow | Core Engine | Airtable Table | Box Folder |
|--------|---------|--------|--------------|-------------|----------------|------------|
| **Stripe** | ✅ | ❌ | ⚠️ To Create | ✅ | 11_MRR, 10_INVOICES | 345543338128 |
| **Slack** | ✅ | ✅ | ⚠️ To Create | ✅ | CONVERSATIONS, 07_TASKS | 345496549341 |
| **HubSpot** | ✅ | ✅ | ⚠️ To Create | ✅ | 04_CONTACTS, 09_DEALS | 345499234929 |
| **Notion** | ✅ | ✅ | ⚠️ To Create | ✅ | 06_ARTIFACTS, 07_TASKS | 345494999692 |
| **Asana** | ✅ | ❌ | ✅ EXISTS | ⚠️ | 07_TASKS, 03_PROJECTS | 345542214914 |
| **Discord** | ✅ | ❌ | ⚠️ To Create | ✅ | CONVERSATIONS | 345496549341 |
| **GitHub** | ✅ | ❌ | ⚠️ To Create | ✅ | 06_ARTIFACTS, 07_TASKS | 345494999692 |
| **Gmail** | ❌ | ✅ | ⚠️ To Create | ✅ | CONVERSATIONS, 06_ARTIFACTS | 345545248271 |
| **Sheets** | ❌ | ✅ | ⚠️ To Create | ✅ | 01_ENTITIES, 14_CSM_METRICS | Various |
| **Webflow** | ✅ | ❌ | ⚠️ To Create | ✅ | 04_CONTACTS, 09_DEALS | 345545785988 |
| **AI-Relay** | ✅ | ❌ | ⚠️ To Create | ✅ | CONVERSATIONS, 07_TASKS | 345494999692 |
| **ChatGPT** | ❌ | ❌ | N/A (TASKS_SPINE) | ❌ | CONVERSATIONS, TASKS_SPINE | N/A |
| **Cron Jobs** | ✅ | ❌ | ⚠️ To Create | ✅ | Various | Various |

**Legend:**
- ✅ = Implemented
- ⚠️ = Needs Creation
- ❌ = Not Applicable

---

## IMPLEMENTATION ROADMAP

### Phase 1: Core Integrations (Priority 1)
1. ✅ Asana (EXISTS - `04-asana-sync.json`)
2. ⚠️ Slack → Spine workflow
3. ⚠️ Stripe → Spine workflow
4. ⚠️ HubSpot → Spine workflow

### Phase 2: Communication Integrations (Priority 2)
5. ⚠️ Notion → Spine workflow
6. ⚠️ Gmail → Spine workflow
7. ⚠️ Discord → Spine workflow

### Phase 3: Development & Marketing (Priority 3)
8. ⚠️ GitHub → Spine workflow
9. ⚠️ Webflow → Spine workflow

### Phase 4: Automation & AI (Priority 4)
10. ⚠️ AI-Relay → Spine workflow
11. ⚠️ Cron jobs → Spine workflows

### Phase 5: Advanced Features
12. ⚠️ Box folder auto-creation
13. ⚠️ Airtable automation triggers
14. ⚠️ Real-time sync monitoring

---

## MONITORING & OBSERVABILITY

### Key Metrics to Track

1. **Input Stream Health:**
   - Webhook delivery rate
   - Loader success rate
   - n8n workflow execution status

2. **Normalization Quality:**
   - Field mapping accuracy
   - Workstream classification accuracy
   - Entity creation success rate

3. **Spine Integration:**
   - Events stored to Core Engine
   - Airtable record creation rate
   - MASTER_SPINE relationship creation

4. **Box Integration:**
   - Document upload success
   - Folder mapping accuracy
   - Storage utilization

### Monitoring Endpoints

- **Webhook Worker:** `/health`, `/tools/health`
- **Core Engine:** `/health`, `/readiness`
- **n8n:** Workflow execution logs
- **Airtable:** Automation run logs

---

**This extended architecture ensures every input stream flows through the Spine normalization layer, creating a unified, traceable, and analytically rich operational intelligence system.**
