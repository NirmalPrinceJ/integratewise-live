# Spine Schema Analysis: Data Type-Based Categorization

**Date:** 2026-01-18  
**Key Insight:** Categorization by DATA TYPE, not tool. Tools are just connectors.

---

## CRITICAL ARCHITECTURAL PRINCIPLE

**✅ CORRECT APPROACH:**
- **Categorize by DATA TYPE** (Task, Note, Conversation, Plan)
- **Tool is just connectivity** (Slack, Asana, Stripe, etc.)

**❌ WRONG APPROACH:**
- Categorize by tool (Slack workflow, Asana workflow, etc.)
- Each tool has different schema

---

## SPINE SCHEMA DEFINITION

### Core Spine Entity Types (4 Types)

Based on `spine-types.ts`, Spine defines **4 universal entity types**:

1. **Task** - Actionable work items
2. **Note** - Documentation, knowledge
3. **Conversation** - Communications, discussions
4. **Plan** - Projects, deals, initiatives

### Spine Event Format

```typescript
interface SpineEvent {
  id: string
  source: "stripe" | "slack" | "discord" | "notion" | "attio" | "github" | "custom"
  type: string  // Event type from source
  timestamp: string
  payload: Record<string, unknown>  // Normalized payload
  metadata?: {
    raw_event_id?: string
    workspace_id?: string
    user_id?: string
  }
}
```

**Key Point:** `source` identifies the tool, but `payload` contains normalized data that maps to Spine entity types.

---

## DATA TYPE CATEGORIZATION

### Category 1: TASK Data Type

**Definition:** Actionable work items with status, priority, due dates, assignees.

**Spine Task Schema:**
```typescript
{
  id: string
  workspace_id: string
  source_id: string        // Original ID from source
  source_type: string      // Tool name (asana, slack, etc.)
  title: string
  description?: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  due_date?: string
  assignee_id?: string
  assignee_name?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}
```

**Tools That Produce TASK Data:**
1. **Asana** → Tasks
2. **Slack** → todo: lines, action items
3. **Notion** → Task databases
4. **GitHub** → Issues
5. **HubSpot** → Tickets
6. **Jira** → Issues
7. **Linear** → Issues
8. **ClickUp** → Tasks
9. **Monday.com** → Tasks
10. **Trello** → Cards

**Normalization Pattern:**
```javascript
// All tools → Same Task schema
{
  source_type: "asana" | "slack" | "notion" | "github" | ...,
  source_id: original_id,
  title: extractTitle(rawData),
  status: mapStatus(rawData.status),  // Normalize to Spine status
  priority: mapPriority(rawData.priority),  // Normalize to Spine priority
  due_date: extractDate(rawData),
  assignee_id: extractAssignee(rawData),
  // ... all map to same schema
}
```

---

### Category 2: CONVERSATION Data Type

**Definition:** Communications, discussions, messages with participants.

**Spine Conversation Schema:**
```typescript
{
  id: string
  workspace_id: string
  source_id: string
  source_type: string
  title?: string
  channel_id?: string
  channel_name?: string
  participants: Participant[]
  messages: Message[]
  message_count: number
  metadata?: Record<string, unknown>
}
```

**Tools That Produce CONVERSATION Data:**
1. **Slack** → Messages, threads
2. **Discord** → Messages, threads
3. **Gmail** → Email threads
4. **Microsoft Teams** → Chat messages
5. **WhatsApp Business** → Messages
6. **Telegram** → Messages
7. **Intercom** → Conversations
8. **Zendesk** → Tickets (as conversations)
9. **Front** → Email threads
10. **Crisp** → Chat conversations

**Normalization Pattern:**
```javascript
// All tools → Same Conversation schema
{
  source_type: "slack" | "discord" | "gmail" | ...,
  source_id: thread_id,
  channel_name: extractChannel(rawData),
  participants: extractParticipants(rawData),  // Normalize to Participant[]
  messages: extractMessages(rawData),  // Normalize to Message[]
  message_count: countMessages(rawData)
}
```

---

### Category 3: NOTE Data Type

**Definition:** Documentation, knowledge, content without action items.

**Spine Note Schema:**
```typescript
{
  id: string
  workspace_id: string
  source_id: string
  source_type: string
  title: string
  content: string
  content_type: "text" | "markdown" | "html"
  author_id?: string
  author_name?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}
```

**Tools That Produce NOTE Data:**
1. **Notion** → Pages, documents
2. **GitHub** → README, wiki pages
3. **Confluence** → Pages
4. **Google Docs** → Documents
5. **Dropbox Paper** → Documents
6. **Obsidian** → Notes
7. **Roam Research** → Notes
8. **LogSeq** → Notes
9. **Coda** → Pages
10. **Airtable** → Long text fields (as notes)

**Normalization Pattern:**
```javascript
// All tools → Same Note schema
{
  source_type: "notion" | "github" | "confluence" | ...,
  source_id: page_id,
  title: extractTitle(rawData),
  content: extractContent(rawData),
  content_type: detectContentType(rawData),  // text, markdown, html
  author_id: extractAuthor(rawData)
}
```

---

### Category 4: PLAN Data Type

**Definition:** Projects, deals, initiatives with goals and timelines.

**Spine Plan Schema:**
```typescript
{
  id: string
  workspace_id: string
  source_id: string
  source_type: string
  title: string
  description?: string
  status: "draft" | "active" | "completed" | "archived"
  start_date?: string
  end_date?: string
  goals: Goal[]
  owner_id?: string
  owner_name?: string
  metadata?: Record<string, unknown>
}
```

**Tools That Produce PLAN Data:**
1. **HubSpot** → Deals (as plans)
2. **Notion** → Project databases
3. **Asana** → Projects
4. **Monday.com** → Boards
5. **Jira** → Projects
6. **Linear** → Projects
7. **ClickUp** → Projects
8. **Airtable** → Project tables
9. **Smartsheet** → Projects
10. **Basecamp** → Projects

**Normalization Pattern:**
```javascript
// All tools → Same Plan schema
{
  source_type: "hubspot" | "notion" | "asana" | ...,
  source_id: project_id,
  title: extractTitle(rawData),
  status: mapStatus(rawData.status),  // Normalize to Plan status
  start_date: extractStartDate(rawData),
  end_date: extractEndDate(rawData),
  goals: extractGoals(rawData)  // Normalize to Goal[]
}
```

---

## UNIFIED SPINE INPUT SCHEMA

### All Tools → Same Spine Format

**The key insight:** Regardless of source tool, data normalizes to one of 4 Spine entity types.

**Spine Event Structure (Universal):**
```typescript
{
  // Event metadata
  id: string                    // Generated UUID
  source: string               // Tool name (slack, asana, etc.)
  type: string                 // Original event type
  timestamp: string            // ISO timestamp
  
  // Normalized payload (maps to Spine entity)
  payload: {
    // Common fields
    entity_type: "task" | "note" | "conversation" | "plan"
    workspace_id: string
    source_id: string
    source_type: string
    
    // Entity-specific fields (based on entity_type)
    // If entity_type === "task":
    title: string
    status: "open" | "in_progress" | "completed" | "cancelled"
    priority: "low" | "medium" | "high" | "critical"
    due_date?: string
    assignee_id?: string
    
    // If entity_type === "conversation":
    channel_name?: string
    participants: Participant[]
    messages: Message[]
    
    // If entity_type === "note":
    content: string
    content_type: "text" | "markdown" | "html"
    author_id?: string
    
    // If entity_type === "plan":
    description?: string
    start_date?: string
    end_date?: string
    goals: Goal[]
    
    // Workstream classification
    workstream: "CSM" | "Startup" | "Personal" | "FlowTrix"
    
    // Relationships
    linked_entities?: string[]  // Entity IDs
    linked_tasks?: string[]     // Task IDs
    linked_artifacts?: string[] // Artifact IDs
    
    // Context
    client_id?: string
    project_id?: string
    account_id?: string
  },
  
  // Metadata
  metadata: {
    raw_event_id: string
    workspace_id: string
    user_id?: string
    original_payload: Record<string, unknown>  // Keep original for reference
  }
}
```

---

## DATA FLOW: TOOL → SPINE ENTITY

### Example 1: Task from Multiple Tools

**Asana Task:**
```json
{
  "gid": "123456789",
  "name": "Complete onboarding",
  "completed": false,
  "due_on": "2026-01-20",
  "assignee": { "gid": "user_123", "name": "John" }
}
```

**Slack Todo:**
```json
{
  "ts": "1234567890.123456",
  "text": "todo: Complete onboarding by Jan 20",
  "user": "U12345",
  "channel": "C12345"
}
```

**Both Normalize to Same Spine Task:**
```json
{
  "entity_type": "task",
  "source_type": "asana" | "slack",
  "source_id": "123456789" | "1234567890.123456",
  "title": "Complete onboarding",
  "status": "open",
  "priority": "medium",
  "due_date": "2026-01-20",
  "assignee_id": "user_123" | "U12345"
}
```

**Key Point:** Same schema, different `source_type` and `source_id`.

---

### Example 2: Conversation from Multiple Tools

**Slack Message:**
```json
{
  "ts": "1234567890.123456",
  "text": "Let's discuss the project",
  "user": "U12345",
  "channel": "C12345",
  "thread_ts": "1234567890.123456"
}
```

**Gmail Email:**
```json
{
  "id": "msg_123",
  "subject": "Project Discussion",
  "from": "john@example.com",
  "to": ["team@example.com"],
  "body": "Let's discuss the project",
  "threadId": "thread_123"
}
```

**Both Normalize to Same Spine Conversation:**
```json
{
  "entity_type": "conversation",
  "source_type": "slack" | "gmail",
  "source_id": "1234567890.123456" | "msg_123",
  "channel_name": "#general" | "john@example.com",
  "participants": [
    { "id": "U12345", "name": "John", "email": "john@example.com" }
  ],
  "messages": [
    {
      "id": "1234567890.123456" | "msg_123",
      "author_id": "U12345" | "john@example.com",
      "content": "Let's discuss the project",
      "timestamp": "2026-01-18T10:00:00Z"
    }
  ]
}
```

---

## WORKFLOW ARCHITECTURE: DATA TYPE-BASED

### Instead of Tool-Based Workflows:

❌ **Wrong:**
- `slack-to-spine.json`
- `asana-to-spine.json`
- `notion-to-spine.json`

### Use Data Type-Based Workflows:

✅ **Correct:**
- `task-normalizer.json` (handles all task sources)
- `conversation-normalizer.json` (handles all conversation sources)
- `note-normalizer.json` (handles all note sources)
- `plan-normalizer.json` (handles all plan sources)

### Router Workflow Pattern:

```
┌─────────────────┐
│  Webhook Source │ (Any tool)
└────────┬────────┘
         │ Raw Event
         ↓
┌─────────────────┐
│  Router Workflow│ ← Determines entity_type
│  (Classify)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌─────────┐ ┌──────────────┐
│  Task   │ │ Conversation │
│Normalizer│ │  Normalizer  │
└─────────┘ └──────────────┘
    │         │
    └────┬────┘
         │
         ↓
┌─────────────────┐
│  Spine Entity   │
│  (Unified)      │
└─────────────────┘
```

---

## INITIAL TOOLS SUPPORT (20 Tools)

### Categorized by Data Type They Produce:

#### Tools That Produce TASK:
1. **Asana** - Tasks, subtasks
2. **Slack** - todo: lines, action items
3. **Notion** - Task databases
4. **GitHub** - Issues
5. **Linear** - Issues
6. **Jira** - Issues
7. **ClickUp** - Tasks
8. **Monday.com** - Tasks
9. **Trello** - Cards
10. **HubSpot** - Tickets

#### Tools That Produce CONVERSATION:
11. **Slack** - Messages, threads
12. **Discord** - Messages
13. **Gmail** - Email threads
14. **Microsoft Teams** - Chat
15. **Intercom** - Conversations

#### Tools That Produce NOTE:
16. **Notion** - Pages, documents
17. **GitHub** - README, wiki
18. **Confluence** - Pages
19. **Google Docs** - Documents

#### Tools That Produce PLAN:
20. **HubSpot** - Deals (as plans)
21. **Asana** - Projects
22. **Notion** - Project databases
23. **Monday.com** - Boards

#### Tools That Produce MULTIPLE Types:
- **Slack** → Task + Conversation
- **Notion** → Task + Note + Plan
- **Asana** → Task + Plan
- **HubSpot** → Task + Plan

---

## NORMALIZATION LOGIC

### Step 1: Classify Entity Type

```javascript
function classifyEntityType(rawEvent) {
  const source = rawEvent.source;
  const type = rawEvent.type;
  const data = rawEvent.data;
  
  // Task indicators
  if (type.includes('task') || type.includes('issue') || 
      type.includes('todo') || data.status || data.priority || data.due_date) {
    return 'task';
  }
  
  // Conversation indicators
  if (type.includes('message') || type.includes('email') || 
      type.includes('chat') || data.participants || data.messages) {
    return 'conversation';
  }
  
  // Note indicators
  if (type.includes('page') || type.includes('document') || 
      type.includes('wiki') || data.content || data.body) {
    return 'note';
  }
  
  // Plan indicators
  if (type.includes('project') || type.includes('deal') || 
      type.includes('board') || data.goals || data.start_date) {
    return 'plan';
  }
  
  // Default: Use AI classification
  return aiClassify(rawEvent);
}
```

### Step 2: Normalize to Spine Schema

```javascript
function normalizeToSpine(rawEvent, entityType) {
  const base = {
    id: generateUUID(),
    workspace_id: extractWorkspace(rawEvent),
    source_id: extractSourceId(rawEvent),
    source_type: rawEvent.source,
    timestamp: rawEvent.timestamp || new Date().toISOString()
  };
  
  switch (entityType) {
    case 'task':
      return {
        ...base,
        entity_type: 'task',
        title: extractTitle(rawEvent),
        status: mapStatus(rawEvent.data.status),
        priority: mapPriority(rawEvent.data.priority),
        due_date: extractDate(rawEvent.data.due_date),
        assignee_id: extractAssignee(rawEvent.data),
        // ... more task fields
      };
    
    case 'conversation':
      return {
        ...base,
        entity_type: 'conversation',
        channel_name: extractChannel(rawEvent),
        participants: extractParticipants(rawEvent),
        messages: extractMessages(rawEvent),
        // ... more conversation fields
      };
    
    case 'note':
      return {
        ...base,
        entity_type: 'note',
        title: extractTitle(rawEvent),
        content: extractContent(rawEvent),
        content_type: detectContentType(rawEvent),
        // ... more note fields
      };
    
    case 'plan':
      return {
        ...base,
        entity_type: 'plan',
        title: extractTitle(rawEvent),
        status: mapPlanStatus(rawEvent.data.status),
        start_date: extractStartDate(rawEvent),
        end_date: extractEndDate(rawEvent),
        goals: extractGoals(rawEvent),
        // ... more plan fields
      };
  }
}
```

---

## FIELD MAPPING EXAMPLES

### Status Mapping (All Tools → Spine)

```javascript
const STATUS_MAPPING = {
  // Task statuses
  'asana': {
    'incomplete': 'open',
    'completed': 'completed'
  },
  'slack': {
    'todo': 'open',
    'done': 'completed'
  },
  'notion': {
    'Not started': 'open',
    'In progress': 'in_progress',
    'Done': 'completed'
  },
  'github': {
    'open': 'open',
    'closed': 'completed'
  }
};

function mapStatus(source, sourceStatus) {
  return STATUS_MAPPING[source]?.[sourceStatus] || 'open';
}
```

### Priority Mapping (All Tools → Spine)

```javascript
const PRIORITY_MAPPING = {
  'asana': {
    'low': 'low',
    'medium': 'medium',
    'high': 'high'
  },
  'slack': {
    'normal': 'medium',
    'urgent': 'high'
  },
  'notion': {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Critical': 'critical'
  }
};

function mapPriority(source, sourcePriority) {
  return PRIORITY_MAPPING[source]?.[sourcePriority] || 'medium';
}
```

---

## CONCLUSION

**Key Principles:**

1. ✅ **Categorize by DATA TYPE** (Task, Note, Conversation, Plan)
2. ✅ **Tool is just connectivity** (source identifier)
3. ✅ **Unified Spine schema** for each entity type
4. ✅ **Field mapping** normalizes tool-specific formats to Spine format
5. ✅ **Router workflow** classifies entity type, then routes to appropriate normalizer

**Next Steps:**
1. Create 4 data type normalizer workflows (Task, Note, Conversation, Plan)
2. Create 1 router workflow (classifies and routes)
3. Create tool-specific connector workflows (20 tools)
4. Create orchestrator workflows
5. Create operator agent workflows

---

**This architecture ensures that regardless of which tool data comes from, it all normalizes to the same Spine entity types with consistent schemas.**
