# Complete n8n Workflow Plan: 20 Tools + Orchestrators + Operator Agents

**Date:** 2026-01-18  
**Architecture:** Data Type-Based Normalization

---

## SPINE SCHEMA ANSWER

### ✅ Your Understanding is CORRECT!

**Key Principle:**
- **Categorize by DATA TYPE** (Task, Note, Conversation, Plan)
- **Tool is just connectivity** (source identifier)

### Unified Spine Input Schema

**All tools normalize to ONE of 4 Spine entity types:**

1. **Task** - Actionable work items
2. **Note** - Documentation, knowledge
3. **Conversation** - Communications
4. **Plan** - Projects, deals, initiatives

**Spine Event Format (Universal):**
```typescript
{
  id: string
  source: "slack" | "asana" | "stripe" | ...  // Tool name (just identifier)
  type: string                                 // Original event type
  timestamp: string
  payload: {
    entity_type: "task" | "note" | "conversation" | "plan"  // DATA TYPE
    workspace_id: string
    source_id: string                          // Original ID from tool
    source_type: string                        // Tool name (same as source)
    
    // Entity-specific fields (same schema regardless of tool)
    // Task fields, Conversation fields, Note fields, or Plan fields
  }
}
```

**Example:**
- Asana task → `entity_type: "task"`, `source_type: "asana"`
- Slack todo → `entity_type: "task"`, `source_type: "slack"`
- **Same schema, different source identifiers**

---

## 20 INITIAL TOOLS (Categorized by Data Type)

### Tools That Produce TASK (10 tools):

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

### Tools That Produce CONVERSATION (5 tools):

11. **Slack** - Messages, threads
12. **Discord** - Messages
13. **Gmail** - Email threads
14. **Microsoft Teams** - Chat
15. **Intercom** - Conversations

### Tools That Produce NOTE (3 tools):

16. **Notion** - Pages, documents
17. **GitHub** - README, wiki
18. **Confluence** - Pages

### Tools That Produce PLAN (2 tools):

19. **HubSpot** - Deals (as plans)
20. **Asana** - Projects

**Note:** Some tools produce multiple types (Slack → Task + Conversation, Notion → Task + Note + Plan)

---

## WORKFLOW ARCHITECTURE

### Layer 1: Router Workflow (1 workflow)
- **Purpose:** Classify entity type and route to appropriate normalizer
- **File:** `00-spine-router.json`

### Layer 2: Data Type Normalizers (4 workflows)
- **Purpose:** Normalize to Spine entity schema
- **Files:**
  - `01-task-normalizer.json`
  - `02-conversation-normalizer.json`
  - `03-note-normalizer.json`
  - `04-plan-normalizer.json`

### Layer 3: Tool Connectors (20 workflows)
- **Purpose:** Extract data from tools, send to router
- **Files:**
  - `10-asana-connector.json`
  - `11-slack-connector.json`
  - `12-notion-connector.json`
  - ... (20 total)

### Layer 4: Orchestrators (2+ workflows)
- **Purpose:** Coordinate workflows by workstream
- **Files:**
  - `20-csm-orchestrator.json`
  - `21-startup-orchestrator.json`
  - `22-personal-orchestrator.json`
  - `23-flowtrix-orchestrator.json`

### Layer 5: Operator Agents (10 workflows)
- **Purpose:** Domain-specific processing agents
- **Files:**
  - `30-research-agent.json`
  - `31-development-agent.json`
  - `32-marketing-agent.json`
  - `33-sales-agent.json`
  - `34-finance-agent.json`
  - `35-cs-agent.json`
  - `36-hr-agent.json`
  - `37-legal-agent.json`
  - `38-operations-agent.json`
  - `39-support-agent.json`

**Total: 37 workflows**

---

## WORKFLOW EXECUTION FLOW

```
Tool Event → Tool Connector → Router → Normalizer → Orchestrator → Operator Agent → Core Engine → Atlas Spine
```

---

Now creating all workflow JSONs...
