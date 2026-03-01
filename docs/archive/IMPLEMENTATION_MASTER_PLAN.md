# IntegrateWise OS — Complete Implementation Master Plan

**Document Version:** 1.0  
**Created:** 2026-01-31  
**Status:** Active Implementation  

---

## System Context

IntegrateWise OS is a **Workspace-First Agentic Operating System** composed of:

- **Flow A** — Truth & Signal Plane (operational events → Spine)
- **Flow B** — Knowledge & Context Plane (documents → embeddings)
- **Flow C** — AI Session Memory Plane (reasoning → memory objects)
- **Think Layer** — Insight & Proposal Engine (read-only cognition)
- **Act Layer** — Governed Execution Engine (controlled writes)
- **Adjust Layer** — Correction & Learning Loop (feedback → improvement)
- **Workspace Layer** — User Operating Surface
- **Governance Layer** — Identity, Guardrails, Vault
- **Summary Aggregation** — Session → Daily → Topic → Domain

---

## Implementation Philosophy

1. **No stubs** — Every page fully functional with real data models
2. **UUID compliance** — All primary keys are UUIDs
3. **Schema-first** — Tables defined before UI
4. **Audit-safe** — Every mutation traceable
5. **Flow-isolated** — Flows converge but never collapse

---

# SPRINT 1 — Adjust Layer (Complete)

## Objective
Build the complete correction and learning feedback loop.

---

### 1.1 Database Schema

**Table: `correction_events`**
```sql
CREATE TABLE correction_events (
  correction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  user_id UUID NOT NULL REFERENCES users(user_id),
  correction_type VARCHAR(50) NOT NULL, -- insight_rejected, proposal_rejected, execution_reversed, agent_override
  source_layer VARCHAR(20) NOT NULL, -- think, act, workspace
  source_entity_type VARCHAR(50) NOT NULL, -- insight, proposal, execution, entity_edit
  source_entity_id UUID NOT NULL,
  original_value JSONB NOT NULL,
  corrected_value JSONB,
  correction_reason TEXT,
  severity VARCHAR(20) DEFAULT 'normal', -- minor, normal, critical
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `adjustment_effects`**
```sql
CREATE TABLE adjustment_effects (
  effect_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_id UUID NOT NULL REFERENCES correction_events(correction_id),
  effect_type VARCHAR(50) NOT NULL, -- proposal_ranking, retrieval_weight, autonomy_score, topic_priority, agent_confidence
  target_scope VARCHAR(50) NOT NULL, -- global, tenant, user, entity, topic
  target_id UUID,
  weight_delta DECIMAL(5,4), -- -1.0000 to +1.0000
  previous_weight DECIMAL(5,4),
  new_weight DECIMAL(5,4),
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `learning_signals`**
```sql
CREATE TABLE learning_signals (
  signal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  signal_type VARCHAR(50) NOT NULL, -- pattern, preference, constraint, behavior
  signal_category VARCHAR(50) NOT NULL, -- retrieval, ranking, autonomy, topic, agent
  signal_key VARCHAR(255) NOT NULL,
  signal_value JSONB NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  sample_count INTEGER DEFAULT 1,
  last_correction_id UUID REFERENCES correction_events(correction_id),
  superseded_by UUID REFERENCES learning_signals(signal_id),
  status VARCHAR(20) DEFAULT 'active', -- active, superseded, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `autonomy_eligibility`**
```sql
CREATE TABLE autonomy_eligibility (
  eligibility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  scope_type VARCHAR(50) NOT NULL, -- action_type, entity_type, user, agent
  scope_id UUID,
  scope_key VARCHAR(255),
  autonomy_level VARCHAR(20) DEFAULT 'assisted', -- manual, assisted, autonomous
  confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
  correction_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  last_evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 1.2 UI Pages

**Route: `/adjust`**
- Adjust Layer dashboard
- Correction event stream (real-time)
- Learning signal summary cards
- Autonomy eligibility overview
- Recent adjustment effects

**Route: `/adjust/corrections`**
- Full correction event log
- Filterable by type, layer, severity
- Correction detail drawer with original vs corrected diff
- Batch processing controls
- Export capability

**Route: `/adjust/feedback`**
- User feedback capture interface
- Feedback categorization (insight, proposal, execution, entity)
- Sentiment analysis display
- Feedback → Correction event wiring
- Feedback patterns visualization

**Route: `/adjust/learning`**
- Learning signal explorer
- Signal confidence trends over time
- Pattern detection results
- Preference inference display
- Signal lifecycle management (active → superseded → archived)

**Route: `/adjust/weights`**
- Retrieval weight tuning interface
- Proposal ranking weight config
- Topic priority weights
- Agent confidence thresholds
- A/B weight comparison

**Route: `/adjust/autonomy`**
- Autonomy eligibility dashboard
- Per-action-type autonomy levels
- Confidence threshold configuration
- Correction-based demotion tracking
- Success-based promotion tracking

---

### 1.3 Service Layer

**Service: `adjust-service`**

Endpoints:
- `POST /adjust/corrections` — Record correction event
- `GET /adjust/corrections` — List corrections with filters
- `POST /adjust/corrections/:id/process` — Process correction → effects
- `GET /adjust/effects` — List adjustment effects
- `POST /adjust/effects/:id/apply` — Apply weight adjustment
- `GET /adjust/signals` — List learning signals
- `POST /adjust/signals/infer` — Infer new signals from corrections
- `GET /adjust/autonomy` — Get autonomy eligibility
- `POST /adjust/autonomy/evaluate` — Re-evaluate autonomy levels

Event Handlers:
- `on_insight_rejected` → create correction_event
- `on_proposal_rejected` → create correction_event
- `on_execution_reversed` → create correction_event
- `on_entity_override` → create correction_event

---

### 1.4 Integration Points

**From Think Layer:**
- Insight rejection → `correction_events`
- Evidence dismissal → `correction_events`

**From Act Layer:**
- Proposal rejection → `correction_events`
- Execution reversal → `correction_events`

**From Workspace Layer:**
- Entity edit override → `correction_events`
- Manual correction → `correction_events`

**To Think Layer:**
- Updated retrieval weights
- Updated proposal ranking
- Learning signal context

**To Act Layer:**
- Updated autonomy eligibility
- Updated confidence thresholds

---

# SPRINT 2 — Act Bridge & Execution Pipeline (Complete)

## Objective
Build the complete governed execution pipeline from proposal to audit.

---

### 2.1 Database Schema

**Table: `act_proposals`**
```sql
CREATE TABLE act_proposals (
  proposal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  origin_context_id UUID NOT NULL, -- links to session/insight that generated this
  proposed_by VARCHAR(50) NOT NULL, -- think_layer, user, agent
  proposer_id UUID, -- user_id or agent_id
  proposal_type VARCHAR(50) NOT NULL, -- tool_call, entity_update, workflow_trigger, communication
  target_type VARCHAR(50) NOT NULL, -- connector, entity, workflow, channel
  target_id UUID,
  target_key VARCHAR(255),
  payload JSONB NOT NULL,
  confidence DECIMAL(3,2),
  reasoning TEXT,
  evidence_refs UUID[], -- links to evidence bundle
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, executing, completed, failed, reversed
  requires_approval BOOLEAN DEFAULT TRUE,
  approval_policy_id UUID REFERENCES guardrail_policies(policy_id),
  approved_by UUID REFERENCES users(user_id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `act_executions`**
```sql
CREATE TABLE act_executions (
  execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES act_proposals(proposal_id),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  execution_mode VARCHAR(20) NOT NULL, -- manual, assisted, autonomous
  executor_type VARCHAR(20) NOT NULL, -- user, agent
  executor_id UUID NOT NULL,
  impersonating_user_id UUID REFERENCES users(user_id), -- if agent acting as user
  tool_id UUID REFERENCES act_tools(tool_id),
  tool_payload JSONB NOT NULL,
  tool_response JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'running', -- running, success, failed, timeout, reversed
  error_message TEXT,
  guardrail_checks JSONB, -- array of check results
  side_effects JSONB, -- mutations caused
  reversible BOOLEAN DEFAULT FALSE,
  reversed_at TIMESTAMPTZ,
  reversed_by UUID REFERENCES users(user_id),
  reversal_reason TEXT
);
```

**Table: `guardrail_policies`**
```sql
CREATE TABLE guardrail_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  policy_name VARCHAR(255) NOT NULL,
  policy_type VARCHAR(50) NOT NULL, -- monetary, scope, frequency, compliance, custom
  policy_scope VARCHAR(50) NOT NULL, -- global, action_type, entity_type, user_role
  scope_filter JSONB, -- conditions for when policy applies
  rules JSONB NOT NULL, -- array of rule definitions
  enforcement VARCHAR(20) DEFAULT 'block', -- block, warn, audit
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `act_tools`**
```sql
CREATE TABLE act_tools (
  tool_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id), -- null = system tool
  tool_key VARCHAR(255) NOT NULL UNIQUE,
  tool_name VARCHAR(255) NOT NULL,
  tool_type VARCHAR(50) NOT NULL, -- connector_action, entity_mutation, workflow_trigger, communication
  connector_id UUID REFERENCES integration_connectors(connector_id),
  input_schema JSONB NOT NULL,
  output_schema JSONB,
  required_permissions VARCHAR(255)[],
  guardrail_policy_ids UUID[],
  reversible BOOLEAN DEFAULT FALSE,
  reversal_tool_id UUID REFERENCES act_tools(tool_id),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `execution_audit_log`**
```sql
CREATE TABLE execution_audit_log (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES act_executions(execution_id),
  event_type VARCHAR(50) NOT NULL, -- started, guardrail_check, permission_check, tool_call, response, error, completed, reversed
  event_data JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.2 UI Pages

**Route: `/act`** (enhance existing)
- Act Layer dashboard with proposal queue
- Execution status overview
- Guardrail policy summary
- Recent executions feed

**Route: `/act/proposals`**
- Full proposal queue with filters
- Proposal detail drawer (payload, evidence, reasoning)
- Approve/Reject with reason
- Batch approval controls
- Proposal → Execution tracking

**Route: `/act/executions`**
- Execution log with real-time status
- Execution detail drawer (timeline, audit events)
- Reversal controls
- Side effect inspector
- Execution replay capability

**Route: `/act/guardrails`**
- Guardrail policy management
- Policy editor (rules builder)
- Policy testing sandbox
- Policy violation log
- Enforcement mode toggle

**Route: `/act/tools`**
- Tool registry browser
- Tool detail with schema
- Tool permission matrix
- Tool usage analytics
- Custom tool registration

**Route: `/admin/executions`** (implement from stub)
- Admin execution overview
- Cross-tenant execution stats
- Execution anomaly detection
- Bulk execution management

---

### 2.3 Service Layer

**Service: `act-bridge`**

Core Flow:
```
Proposal → Permission Check → Impersonation Check → Guardrail Check → Tool Translate → Execute → Audit → Result
```

Endpoints:
- `POST /act/proposals` — Create proposal
- `GET /act/proposals` — List proposals
- `POST /act/proposals/:id/approve` — Approve proposal
- `POST /act/proposals/:id/reject` — Reject proposal
- `POST /act/proposals/:id/execute` — Execute approved proposal
- `GET /act/executions` — List executions
- `GET /act/executions/:id` — Get execution detail with audit
- `POST /act/executions/:id/reverse` — Reverse execution
- `GET /act/tools` — List available tools
- `POST /act/tools/:id/test` — Test tool with payload
- `GET /act/guardrails` — List policies
- `POST /act/guardrails` — Create policy
- `POST /act/guardrails/:id/test` — Test policy against payload

Permission Rule (always enforced):
```
agent_power ≤ initiating_user_power
```

---

### 2.4 Integration Points

**From Think Layer:**
- Proposals generated from insights
- Evidence refs attached to proposals

**From Workspace Layer:**
- Manual proposal creation
- Approval/rejection
- Reversal requests

**To Spine (Flow A):**
- Governed writes via Act Bridge only
- Every mutation carries `origin_context_id`

**To Adjust Layer:**
- Execution reversal → correction_event
- Proposal rejection → correction_event

---

# SPRINT 3 — Summary Aggregation Layer (Complete)

## Objective
Build the complete multi-tier summary system with proper rewrite semantics.

---

### 3.1 Database Schema

**Table: `session_summaries`** (append-only, immutable)
```sql
CREATE TABLE session_summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  session_id UUID NOT NULL, -- MCP session ID
  user_id UUID REFERENCES users(user_id),
  agent_id UUID,
  session_type VARCHAR(50) NOT NULL, -- brainstorm, analysis, planning, execution, review
  focus_entity_type VARCHAR(50),
  focus_entity_id UUID,
  decisions JSONB, -- array of decision objects
  insights JSONB, -- array of insight objects
  risks JSONB, -- array of risk objects
  proposals JSONB, -- array of proposal refs
  evidence_refs UUID[], -- links to evidence bundle
  reasoning_vector VECTOR(1536), -- embedding of reasoning
  confidence DECIMAL(3,2),
  token_count INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- NO updated_at - immutable
);
```

**Table: `daily_summaries`** (rebuildable)
```sql
CREATE TABLE daily_summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  summary_date DATE NOT NULL,
  scope_type VARCHAR(50) NOT NULL, -- tenant, user, entity, topic
  scope_id UUID,
  session_count INTEGER DEFAULT 0,
  session_ids UUID[],
  key_decisions JSONB,
  key_insights JSONB,
  key_risks JSONB,
  proposal_count INTEGER DEFAULT 0,
  execution_count INTEGER DEFAULT 0,
  correction_count INTEGER DEFAULT 0,
  aggregate_confidence DECIMAL(3,2),
  summary_text TEXT,
  summary_vector VECTOR(1536),
  built_at TIMESTAMPTZ DEFAULT NOW(),
  rebuild_count INTEGER DEFAULT 0,
  last_rebuilt_at TIMESTAMPTZ,
  UNIQUE(tenant_id, summary_date, scope_type, scope_id)
);
```

**Table: `topic_summaries`** (versioned rewrite)
```sql
CREATE TABLE topic_summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  topic_key VARCHAR(255) NOT NULL,
  topic_name VARCHAR(255) NOT NULL,
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES topic_summaries(summary_id),
  scope_type VARCHAR(50) NOT NULL, -- tenant, user, entity
  scope_id UUID,
  contributing_session_ids UUID[],
  contributing_daily_ids UUID[],
  core_insights JSONB,
  established_patterns JSONB,
  open_questions JSONB,
  related_topics VARCHAR(255)[],
  summary_text TEXT,
  summary_vector VECTOR(1536),
  confidence DECIMAL(3,2),
  rewrite_trigger VARCHAR(50), -- scheduled, threshold, manual, correction
  status VARCHAR(20) DEFAULT 'active', -- active, superseded, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  superseded_at TIMESTAMPTZ
);
```

**Table: `domain_summaries`** (supersession rewrite)
```sql
CREATE TABLE domain_summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  domain_key VARCHAR(255) NOT NULL, -- sales, marketing, product, operations, etc.
  domain_name VARCHAR(255) NOT NULL,
  supersedes_id UUID REFERENCES domain_summaries(summary_id),
  contributing_topic_ids UUID[],
  strategic_insights JSONB,
  cross_topic_patterns JSONB,
  domain_health_score DECIMAL(3,2),
  key_metrics JSONB,
  recommendations JSONB,
  summary_text TEXT,
  summary_vector VECTOR(1536),
  status VARCHAR(20) DEFAULT 'active', -- active, superseded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  superseded_at TIMESTAMPTZ
);
```

**Table: `summary_rewrite_queue`**
```sql
CREATE TABLE summary_rewrite_queue (
  queue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  summary_type VARCHAR(20) NOT NULL, -- daily, topic, domain
  target_id UUID NOT NULL, -- existing summary to rewrite
  trigger_type VARCHAR(50) NOT NULL, -- scheduled, threshold, manual, correction
  trigger_source_id UUID, -- correction_id or manual user_id
  priority INTEGER DEFAULT 5, -- 1-10
  scheduled_for TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

---

### 3.2 UI Pages

**Route: `/summaries`**
- Summary aggregation dashboard
- Summary layer overview (session → daily → topic → domain)
- Rewrite queue status
- Summary health metrics

**Route: `/summaries/sessions`**
- Session summary browser
- Session detail with full content
- Session → Daily linkage
- Immutability indicator (no edit)

**Route: `/summaries/daily`**
- Daily summary calendar view
- Daily detail with contributing sessions
- Manual rebuild trigger
- Rebuild history

**Route: `/summaries/topics`**
- Topic summary explorer
- Topic version history
- Version comparison (diff view)
- Manual rewrite trigger
- Topic relationship graph

**Route: `/summaries/domains`**
- Domain summary dashboard
- Domain health scores
- Cross-topic pattern view
- Supersession history
- Strategic recommendation display

**Route: `/summaries/queue`**
- Rewrite queue management
- Queue prioritization
- Failed rewrite inspector
- Manual queue injection

---

### 3.3 Service Layer

**Service: `summary-aggregator`**

Rewrite Rules:
```
Session: NEVER rewrite (append-only)
Daily: REBUILD allowed (delete + regenerate)
Topic: VERSIONED rewrite (new version, link to previous)
Domain: SUPERSESSION only (new record supersedes old)
```

Endpoints:
- `POST /summaries/sessions` — Create session summary (from MCP)
- `GET /summaries/sessions` — List session summaries
- `POST /summaries/daily/build` — Build/rebuild daily summary
- `GET /summaries/daily` — List daily summaries
- `POST /summaries/topics/rewrite` — Trigger topic rewrite
- `GET /summaries/topics` — List topic summaries with versions
- `POST /summaries/domains/supersede` — Create superseding domain summary
- `GET /summaries/domains` — List domain summaries
- `GET /summaries/queue` — Get rewrite queue
- `POST /summaries/queue` — Add to rewrite queue

Scheduled Jobs:
- Daily summary build (end of day)
- Topic rewrite evaluation (weekly or threshold)
- Domain supersession evaluation (monthly or significant change)

---

### 3.4 Integration Points

**From Flow C (MCP):**
- Session completion → session_summary creation

**From Adjust Layer:**
- Correction events → topic rewrite trigger
- Learning signals → domain supersession trigger

**To Think Layer:**
- Summary context for decision building
- Topic/domain patterns for insight generation

**To Workspace Layer:**
- Summary display in Evidence Drawer
- Topic/domain health in dashboards

---

# SPRINT 4 — MCP Connector & AI Write Path (Complete)

## Objective
Build the complete MCP bridge for AI → OS actuation.

---

### 4.1 Database Schema

**Table: `mcp_sessions`**
```sql
CREATE TABLE mcp_sessions (
  mcp_session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  user_id UUID REFERENCES users(user_id),
  agent_id UUID,
  model_id VARCHAR(255),
  session_type VARCHAR(50) NOT NULL, -- chat, tool_use, autonomous
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, error, timeout
  token_input INTEGER DEFAULT 0,
  token_output INTEGER DEFAULT 0,
  tool_call_count INTEGER DEFAULT 0,
  write_count INTEGER DEFAULT 0,
  origin_context_id UUID -- generated for this session
);
```

**Table: `mcp_tool_calls`**
```sql
CREATE TABLE mcp_tool_calls (
  call_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcp_session_id UUID NOT NULL REFERENCES mcp_sessions(mcp_session_id),
  tool_name VARCHAR(255) NOT NULL,
  tool_input JSONB NOT NULL,
  tool_output JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, error, rejected
  error_message TEXT,
  capability_check_passed BOOLEAN,
  capability_check_details JSONB
);
```

**Table: `mcp_capabilities`**
```sql
CREATE TABLE mcp_capabilities (
  capability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id), -- null = system capability
  capability_key VARCHAR(255) NOT NULL UNIQUE,
  capability_name VARCHAR(255) NOT NULL,
  capability_type VARCHAR(50) NOT NULL, -- read, write, execute, admin
  target_type VARCHAR(50) NOT NULL, -- session, memory, proposal, annotation, task
  allowed_operations VARCHAR(50)[], -- create, read, update, delete
  requires_user_binding BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `mcp_capability_grants`**
```sql
CREATE TABLE mcp_capability_grants (
  grant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  capability_id UUID NOT NULL REFERENCES mcp_capabilities(capability_id),
  grantee_type VARCHAR(20) NOT NULL, -- user, role, agent
  grantee_id UUID NOT NULL,
  granted_by UUID NOT NULL REFERENCES users(user_id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES users(user_id)
);
```

**Table: `mcp_memory_objects`**
```sql
CREATE TABLE mcp_memory_objects (
  memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  mcp_session_id UUID REFERENCES mcp_sessions(mcp_session_id),
  origin_context_id UUID NOT NULL,
  user_id UUID REFERENCES users(user_id),
  memory_type VARCHAR(50) NOT NULL, -- insight, strategy, assumption, commitment, preference
  memory_key VARCHAR(255),
  memory_content JSONB NOT NULL,
  memory_vector VECTOR(1536),
  confidence DECIMAL(3,2),
  entity_refs JSONB, -- linked entities
  evidence_refs UUID[],
  status VARCHAR(20) DEFAULT 'active', -- active, superseded, archived
  superseded_by UUID REFERENCES mcp_memory_objects(memory_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `mcp_annotations`**
```sql
CREATE TABLE mcp_annotations (
  annotation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  mcp_session_id UUID REFERENCES mcp_sessions(mcp_session_id),
  origin_context_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- entity, document, chunk, insight, proposal
  target_id UUID NOT NULL,
  annotation_type VARCHAR(50) NOT NULL, -- note, highlight, question, risk, opportunity
  annotation_content TEXT NOT NULL,
  created_by_type VARCHAR(20) NOT NULL, -- user, agent
  created_by_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.2 UI Pages

**Route: `/admin/mcp`**
- MCP Connector admin dashboard
- Active session monitor
- Tool call statistics
- Write operation log
- Capability overview

**Route: `/admin/mcp/sessions`**
- MCP session browser
- Session detail with tool calls
- Session → Summary linkage
- Session replay viewer

**Route: `/admin/mcp/tools`**
- MCP tool registry
- Tool schema inspector
- Tool usage analytics
- Tool enable/disable controls

**Route: `/admin/mcp/capabilities`**
- Capability management
- Capability grant interface
- Grant audit log
- Capability testing

**Route: `/admin/mcp/memory`**
- Memory object browser
- Memory lifecycle management
- Memory → Entity linkage
- Memory supersession viewer

---

### 4.3 Service Layer

**Service: `mcp-connector`**

Write Allowlist:
```
✅ Session summaries
✅ Memory objects
✅ Annotations
✅ Proposals (routed to Act)
✅ Follow-up tasks (policy gated)
```

Write Blocklist:
```
❌ Direct Spine mutation
❌ Deletes of any kind
❌ Permission changes
❌ Financial mutations
❌ User management
```

Endpoints:
- `POST /mcp/sessions` — Start MCP session
- `POST /mcp/sessions/:id/end` — End MCP session
- `POST /mcp/sessions/:id/tool-call` — Execute tool call
- `POST /mcp/memory` — Write memory object
- `GET /mcp/memory` — Read memory objects
- `POST /mcp/annotations` — Create annotation
- `GET /mcp/capabilities` — Get available capabilities
- `POST /mcp/capabilities/check` — Check capability for operation

Identity Binding (always resolved):
```
user_id — for permission checks
agent_id — for model scoring
origin_context_id — for audit narrative
impersonation_id — for impersonation enforcement
```

---

### 4.4 Integration Points

**From AI/LLM:**
- Tool calls via MCP protocol
- Session state management

**To Flow C:**
- Session summaries → session_summaries
- Memory objects → mcp_memory_objects

**To Act Layer:**
- Proposals routed through Act Bridge
- Never direct execution

**To Think Layer:**
- Memory context for decision building
- Session history for continuity

---

# SPRINT 5 — Flow B Knowledge Pipeline (Complete)

## Objective
Build the complete document ingestion and semantic retrieval pipeline.

---

### 5.1 Database Schema

**Table: `knowledge_documents`**
```sql
CREATE TABLE knowledge_documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  uploaded_by UUID REFERENCES users(user_id),
  source_type VARCHAR(50) NOT NULL, -- upload, email, connector, scrape
  source_ref VARCHAR(255), -- original location
  file_name VARCHAR(255),
  file_type VARCHAR(50), -- pdf, docx, txt, html, md, email
  file_size_bytes INTEGER,
  storage_path VARCHAR(500),
  mime_type VARCHAR(100),
  parse_status VARCHAR(20) DEFAULT 'pending', -- pending, parsing, parsed, failed
  parsed_at TIMESTAMPTZ,
  embed_status VARCHAR(20) DEFAULT 'pending', -- pending, embedding, embedded, failed
  embedded_at TIMESTAMPTZ,
  chunk_count INTEGER DEFAULT 0,
  page_count INTEGER,
  word_count INTEGER,
  language VARCHAR(10),
  entity_refs JSONB, -- linked entities
  tags VARCHAR(255)[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `knowledge_chunks`**
```sql
CREATE TABLE knowledge_chunks (
  chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(document_id),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  chunk_index INTEGER NOT NULL,
  parent_chunk_id UUID REFERENCES knowledge_chunks(chunk_id),
  chunk_level VARCHAR(20) NOT NULL, -- document, section, paragraph, sentence
  chunk_text TEXT NOT NULL,
  chunk_summary TEXT,
  section_title VARCHAR(255),
  page_number INTEGER,
  start_offset INTEGER,
  end_offset INTEGER,
  token_count INTEGER,
  embedding VECTOR(1536),
  embedding_model VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `knowledge_processing_jobs`**
```sql
CREATE TABLE knowledge_processing_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  document_id UUID NOT NULL REFERENCES knowledge_documents(document_id),
  job_type VARCHAR(50) NOT NULL, -- parse, ocr, chunk, embed, reembed
  job_status VARCHAR(20) DEFAULT 'queued', -- queued, processing, completed, failed
  worker_id VARCHAR(100),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `knowledge_entity_links`**
```sql
CREATE TABLE knowledge_entity_links (
  link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  chunk_id UUID NOT NULL REFERENCES knowledge_chunks(chunk_id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  link_type VARCHAR(50) NOT NULL, -- mention, about, evidence, reference
  confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 5.2 UI Pages

**Route: `/knowledge`** (enhance existing)
- Knowledge dashboard with categories
- Recent documents
- Processing status
- Retrieval stats

**Route: `/knowledge/documents`**
- Document browser with filters
- Document detail drawer
- Upload interface
- Bulk operations

**Route: `/knowledge/documents/[id]`**
- Document viewer
- Chunk explorer
- Entity link display
- Embedding status

**Route: `/knowledge/chunks`**
- Chunk explorer (debug/admin)
- Chunk search
- Chunk → Document navigation
- Embedding inspector

**Route: `/knowledge/search`**
- Semantic search interface
- Search results with highlighting
- Relevance tuning
- Search history

**Route: `/admin/knowledge-processing`**
- Processing pipeline dashboard
- Job queue management
- Worker status
- Error log

---

### 5.3 Service Layer

**Service: `knowledge-processor`**

Processing Pipeline:
```
Upload → Parse → OCR (if needed) → Chunk → Embed → Link Entities
```

Endpoints:
- `POST /knowledge/documents` — Upload document
- `GET /knowledge/documents` — List documents
- `GET /knowledge/documents/:id` — Get document with chunks
- `DELETE /knowledge/documents/:id` — Delete document
- `POST /knowledge/documents/:id/reprocess` — Reprocess document
- `GET /knowledge/chunks` — List chunks
- `POST /knowledge/search` — Semantic search
- `GET /knowledge/jobs` — List processing jobs

Hierarchical Chunking:
```
Document Summary → Section Summaries → Paragraph Chunks
Each chunk stores parent reference for context reconstruction
```

---

### 5.4 Integration Points

**From Loader (Flow A ingress):**
- Data dump documents → knowledge_documents

**From Connectors:**
- Email attachments → knowledge_documents
- Linked documents → knowledge_documents

**To Think Layer:**
- Evidence retrieval
- Context enrichment

**To Workspace Layer:**
- Evidence Drawer display
- Document preview

---

# SPRINT 6 — Think Layer Enhancement (Complete)

## Objective
Build the complete context builder and cognitive twin interface.

---

### 6.1 Database Schema

**Table: `decision_contexts`**
```sql
CREATE TABLE decision_contexts (
  context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  user_id UUID REFERENCES users(user_id),
  context_type VARCHAR(50) NOT NULL, -- entity_focus, situation, planning, review
  focus_entity_type VARCHAR(50),
  focus_entity_id UUID,
  timeline_start TIMESTAMPTZ,
  timeline_end TIMESTAMPTZ,
  signal_refs UUID[], -- from Flow A
  evidence_refs UUID[], -- from Flow B
  memory_refs UUID[], -- from Flow C
  summary_refs UUID[], -- from Summary Layer
  anomaly_markers JSONB,
  context_vector VECTOR(1536),
  built_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

**Table: `cognitive_insights`**
```sql
CREATE TABLE cognitive_insights (
  insight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  context_id UUID REFERENCES decision_contexts(context_id),
  insight_type VARCHAR(50) NOT NULL, -- risk, opportunity, pattern, anomaly, recommendation
  insight_category VARCHAR(50), -- revenue, churn, efficiency, growth
  insight_title VARCHAR(255) NOT NULL,
  insight_content TEXT NOT NULL,
  reasoning TEXT,
  confidence DECIMAL(3,2),
  severity VARCHAR(20), -- info, warning, critical
  evidence_refs UUID[],
  entity_refs JSONB,
  proposed_actions JSONB,
  status VARCHAR(20) DEFAULT 'active', -- active, acknowledged, dismissed, acted
  dismissed_by UUID REFERENCES users(user_id),
  dismissed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `evidence_bundles`**
```sql
CREATE TABLE evidence_bundles (
  bundle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id),
  bundle_type VARCHAR(50) NOT NULL, -- insight, proposal, execution, review
  source_id UUID NOT NULL, -- insight_id, proposal_id, etc.
  items JSONB NOT NULL, -- array of evidence items with type, source, content
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 6.2 UI Pages

**Route: `/think`** (enhance existing)
- Think Layer dashboard
- Active contexts
- Recent insights
- Cognitive twin status

**Route: `/think/context`**
- Decision context builder interface
- Context component selector (signals, evidence, memory)
- Timeline configurator
- Context preview

**Route: `/think/context/[id]`**
- Decision context viewer
- Full context object display
- Component drill-down
- Context → Insight linkage

**Route: `/think/evidence`**
- Evidence bundle inspector
- Evidence source breakdown
- Evidence → Entity mapping
- Evidence quality metrics

**Route: `/think/cognitive-twin`**
- Cognitive twin configuration
- Interpretation rules
- Correlation settings
- Risk/opportunity thresholds
- Reasoning transparency view

---

### 6.3 Service Layer

**Service: `context-builder`**

Context Building Flow:
```
Entity Focus + Timeline → Gather Signals (A) → Gather Evidence (B) → Gather Memory (C) → Build Context Object
```

Endpoints:
- `POST /think/contexts` — Build decision context
- `GET /think/contexts` — List contexts
- `GET /think/contexts/:id` — Get context detail
- `POST /think/insights` — Generate insights from context
- `GET /think/insights` — List insights
- `POST /think/insights/:id/dismiss` — Dismiss insight
- `POST /think/insights/:id/act` — Convert insight to proposal
- `GET /think/evidence/:id` — Get evidence bundle

Cognitive Twin Constraints:
```
READ-ONLY — Never executes
EXPLAINS — Always provides reasoning
PROPOSES — Routes to Act for execution
```

---

# SPRINT 7 — Spine & Entity Work Surfaces (Complete)

## Objective
Build complete entity detail pages and department-scoped spine views.

---

### 7.1 Entity Detail Pages

**Route: `/accounts/[id]`**
- Account 360 view
- Contact list
- Deal pipeline
- Support tickets
- Activity timeline
- Health score
- AI insights strip
- Evidence drawer integration

**Route: `/customers/[id]`**
- Customer profile
- Subscription status
- Usage metrics
- Communication history
- Support history
- Churn risk indicator

**Route: `/pipeline/[id]`**
- Deal detail view
- Stage progression
- Stakeholder map
- Activity log
- Win probability
- Recommended actions

**Route: `/projects/[id]`**
- Project dashboard
- Task board
- Timeline view
- Resource allocation
- Risk register
- Progress metrics

---

### 7.2 Department Spine Views

**Route: `/sales/spine`**
- Sales-specific canonical entities
- Pipeline metrics
- Revenue signals
- Sales activity feed

**Route: `/marketing/spine`**
- Marketing campaign entities
- Lead flow metrics
- Attribution signals
- Campaign performance

**Route: `/cs/spine`**
- Customer success entities
- Health scores
- Churn signals
- Renewal pipeline

**Route: `/ops/spine`**
- Operations entities
- Efficiency metrics
- Process signals
- Resource utilization

**Route: `/projects/spine`**
- Project entities
- Delivery metrics
- Risk signals
- Capacity planning

---

# SPRINT 8 — Governance Completion (Complete)

## Objective
Complete all governance admin stubs with full functionality.

---

### 8.1 Complete Stub Pages

**Route: `/admin/permissions`**
- Permission matrix view
- Permission editor
- Permission inheritance display
- Permission audit log

**Route: `/admin/roles`**
- Role management
- Role → Permission mapping
- Role hierarchy
- Role assignment

**Route: `/admin/policies`**
- Policy editor
- Policy testing
- Policy versioning
- Policy audit

**Route: `/admin/data-sources`**
- Data source registry
- Source health monitoring
- Source configuration
- Sync status

**Route: `/admin/executions`**
- Execution log
- Execution detail
- Execution analytics
- Bulk operations

---

## Cross-Sprint Wiring

After all sprints complete, wire the full flow:

```
External Signals → Flow A → Spine
                          ↓
Documents → Flow B → Knowledge Bank
                          ↓
AI Sessions → MCP → Flow C (Memory)
                          ↓
         A + B + C → Think Layer
                          ↓
              Think → Proposals
                          ↓
           Proposals → Act Bridge
                          ↓
                Act → Execution
                          ↓
            Execution → Audit
                          ↓
         User Overrides → Adjust
                          ↓
              Adjust → Rewrite + Reweight
                          ↓
                 System Improves
```

---

# PARALLEL EXECUTION MODEL

## Execution Philosophy

Instead of sequential sprints, we execute in **4 parallel phases** with **5 concurrent tracks**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: FOUNDATION                                  │
│                    (All Database Schemas - Parallel)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Adjust  │ │   Act   │ │ Summary │ │   MCP   │ │Knowledge│ │  Think  │   │
│  │ Schema  │ │ Schema  │ │ Schema  │ │ Schema  │ │ Schema  │ │ Schema  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 2: UI SURFACES                                 │
│                      (5 Parallel Tracks)                                     │
│                                                                              │
│  TRACK A          TRACK B          TRACK C        TRACK D        TRACK E    │
│  ─────────        ─────────        ─────────      ─────────      ─────────  │
│  Execution        AI Memory        Knowledge      Cognition      Surfaces   │
│  Pipeline         Pipeline         Pipeline       Pipeline       Pipeline   │
│                                                                              │
│  /adjust/*        /summaries/*     /knowledge/*   /think/*       /accounts/*│
│  /act/*           /admin/mcp/*                                   /customers/*
│                                                                  /pipeline/* │
│                                                                  /projects/* │
│                                                                  /admin/*    │
│                                                                  spine views │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 3: SERVICES                                    │
│                    (All Services - Parallel)                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │adjust-svc   │ │ act-bridge  │ │summary-agg  │ │mcp-connector│           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐                                            │
│  │knowledge-proc│ │context-build│                                           │
│  └─────────────┘ └─────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 4: INTEGRATION                                 │
│                    (Wire All Flows Together)                                 │
│                                                                              │
│     Flow A ──→ Spine ──→ Signals ──┐                                        │
│     Flow B ──→ Knowledge ──────────┼──→ Think ──→ Act ──→ Adjust ──→ Loop  │
│     Flow C ──→ MCP ──→ Memory ─────┘                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1 — Foundation (All Schemas)

**Objective:** Create all database tables in a single SQL migration.

**Deliverable:** One migration file with all 26 tables.

### Tables by Domain

| Domain | Tables |
|--------|--------|
| Adjust | `correction_events`, `adjustment_effects`, `learning_signals`, `autonomy_eligibility` |
| Act | `act_proposals`, `act_executions`, `guardrail_policies`, `act_tools`, `execution_audit_log` |
| Summary | `session_summaries`, `daily_summaries`, `topic_summaries`, `domain_summaries`, `summary_rewrite_queue` |
| MCP | `mcp_sessions`, `mcp_tool_calls`, `mcp_capabilities`, `mcp_capability_grants`, `mcp_memory_objects`, `mcp_annotations` |
| Knowledge | `knowledge_documents`, `knowledge_chunks`, `knowledge_processing_jobs`, `knowledge_entity_links` |
| Think | `decision_contexts`, `cognitive_insights`, `evidence_bundles` |

**Execution:** Single migration, single transaction.

---

## PHASE 2 — UI Surfaces (5 Parallel Tracks)

Each track can be assigned to a different session/agent. All tracks execute simultaneously.

### TRACK A: Execution Pipeline (Adjust + Act)

**Pages:** 12 total

| Route | Priority |
|-------|----------|
| `/adjust` | P1 |
| `/adjust/corrections` | P1 |
| `/adjust/feedback` | P2 |
| `/adjust/learning` | P2 |
| `/adjust/weights` | P2 |
| `/adjust/autonomy` | P2 |
| `/act` (enhance) | P1 |
| `/act/proposals` | P1 |
| `/act/executions` | P1 |
| `/act/guardrails` | P2 |
| `/act/tools` | P2 |
| `/admin/executions` | P2 |

---

### TRACK B: AI Memory Pipeline (Summary + MCP)

**Pages:** 11 total

| Route | Priority |
|-------|----------|
| `/summaries` | P1 |
| `/summaries/sessions` | P1 |
| `/summaries/daily` | P1 |
| `/summaries/topics` | P2 |
| `/summaries/domains` | P2 |
| `/summaries/queue` | P2 |
| `/admin/mcp` | P1 |
| `/admin/mcp/sessions` | P1 |
| `/admin/mcp/tools` | P2 |
| `/admin/mcp/capabilities` | P2 |
| `/admin/mcp/memory` | P2 |

---

### TRACK C: Knowledge Pipeline

**Pages:** 6 total

| Route | Priority |
|-------|----------|
| `/knowledge` (enhance) | P1 |
| `/knowledge/documents` | P1 |
| `/knowledge/documents/[id]` | P1 |
| `/knowledge/chunks` | P2 |
| `/knowledge/search` | P1 |
| `/admin/knowledge-processing` | P2 |

---

### TRACK D: Cognition Pipeline

**Pages:** 5 total

| Route | Priority |
|-------|----------|
| `/think` (enhance) | P1 |
| `/think/context` | P1 |
| `/think/context/[id]` | P2 |
| `/think/evidence` | P1 |
| `/think/cognitive-twin` | P2 |

---

### TRACK E: Entity & Governance Surfaces

**Pages:** 14 total

| Route | Priority |
|-------|----------|
| `/accounts/[id]` | P1 |
| `/customers/[id]` | P1 |
| `/pipeline/[id]` | P1 |
| `/projects/[id]` | P1 |
| `/sales/spine` | P2 |
| `/marketing/spine` | P2 |
| `/cs/spine` | P2 |
| `/ops/spine` | P2 |
| `/projects/spine` | P2 |
| `/admin/permissions` | P2 |
| `/admin/roles` | P2 |
| `/admin/policies` | P2 |
| `/admin/data-sources` | P2 |
| `/admin/executions` | P2 |

---

## PHASE 3 — Services (Parallel)

All services can be built in parallel once schemas exist.

| Service | Endpoints | Dependencies |
|---------|-----------|--------------|
| `adjust-service` | 9 | Schema only |
| `act-bridge` | 12 | Schema only |
| `summary-aggregator` | 10 | Schema only |
| `mcp-connector` | 8 | Schema only |
| `knowledge-processor` | 8 | Schema only |
| `context-builder` | 7 | Schema only |

---

## PHASE 4 — Integration Wiring

Wire the complete flow:

1. **Flow A → Think:** Signal refs in decision contexts
2. **Flow B → Think:** Evidence refs in decision contexts
3. **Flow C → Think:** Memory refs in decision contexts
4. **Think → Act:** Proposals routed to Act Bridge
5. **Act → Adjust:** Rejections/reversals create correction events
6. **Adjust → Think:** Updated weights influence proposals
7. **MCP → Summary:** Session end triggers summary creation
8. **Summary → Think:** Summary context in decision building

---

## Parallel Execution Commands

### Start Phase 1 (Foundation)
```
Create all database schemas from IMPLEMENTATION_MASTER_PLAN.md Phase 1.
Execute as single migration file at /sql-migrations/010_complete_layer_schemas.sql
```

### Start Track A (Execution Pipeline)
```
## Track A: Execution Pipeline

Reference: IMPLEMENTATION_MASTER_PLAN.md - TRACK A

Implement all pages in Track A (Adjust + Act).
Start with P1 pages, then P2 pages.
Use mock data until services exist.

Pages:
- /adjust (dashboard)
- /adjust/corrections
- /adjust/feedback
- /adjust/learning
- /adjust/weights
- /adjust/autonomy
- /act (enhance)
- /act/proposals
- /act/executions
- /act/guardrails
- /act/tools
- /admin/executions
```

### Start Track B (AI Memory Pipeline)
```
## Track B: AI Memory Pipeline

Reference: IMPLEMENTATION_MASTER_PLAN.md - TRACK B

Implement all pages in Track B (Summary + MCP).
Start with P1 pages, then P2 pages.
Use mock data until services exist.

Pages:
- /summaries (dashboard)
- /summaries/sessions
- /summaries/daily
- /summaries/topics
- /summaries/domains
- /summaries/queue
- /admin/mcp (dashboard)
- /admin/mcp/sessions
- /admin/mcp/tools
- /admin/mcp/capabilities
- /admin/mcp/memory
```

### Start Track C (Knowledge Pipeline)
```
## Track C: Knowledge Pipeline

Reference: IMPLEMENTATION_MASTER_PLAN.md - TRACK C

Implement all pages in Track C (Knowledge).
Start with P1 pages, then P2 pages.
Use mock data until services exist.

Pages:
- /knowledge (enhance)
- /knowledge/documents
- /knowledge/documents/[id]
- /knowledge/chunks
- /knowledge/search
- /admin/knowledge-processing
```

### Start Track D (Cognition Pipeline)
```
## Track D: Cognition Pipeline

Reference: IMPLEMENTATION_MASTER_PLAN.md - TRACK D

Implement all pages in Track D (Think).
Start with P1 pages, then P2 pages.
Use mock data until services exist.

Pages:
- /think (enhance)
- /think/context
- /think/context/[id]
- /think/evidence
- /think/cognitive-twin
```

### Start Track E (Surfaces)
```
## Track E: Entity & Governance Surfaces

Reference: IMPLEMENTATION_MASTER_PLAN.md - TRACK E

Implement all pages in Track E (Entities + Governance).
Start with P1 pages, then P2 pages.
Use mock data until services exist.

Pages:
- /accounts/[id]
- /customers/[id]
- /pipeline/[id]
- /projects/[id]
- /sales/spine
- /marketing/spine
- /cs/spine
- /ops/spine
- /projects/spine
- /admin/permissions
- /admin/roles
- /admin/policies
- /admin/data-sources
```

---

# CONTINUATION PROMPT

Use the following prompt to resume implementation in a new session:

---

```
## IntegrateWise OS Implementation Continuation

### System Context
IntegrateWise OS is a Workspace-First Agentic Operating System with:
- Flow A (Truth/Signals) → Spine
- Flow B (Knowledge) → Embeddings
- Flow C (Memory) → MCP
- Think Layer (read-only cognition)
- Act Layer (governed execution)
- Adjust Layer (correction learning)
- Summary Aggregation (session → daily → topic → domain)
- Governance Layer (identity, guardrails, vault)

### Parallel Execution Model
We use 4 phases with 5 parallel tracks:
- Phase 1: All schemas (single migration)
- Phase 2: UI surfaces (5 parallel tracks: A, B, C, D, E)
- Phase 3: All services (parallel)
- Phase 4: Integration wiring

### Implementation State
Reference: /docs/IMPLEMENTATION_MASTER_PLAN.md

Current Phase: [1|2|3|4]
Current Track: [A|B|C|D|E|ALL] (if Phase 2)
Current Task: [TASK_DESCRIPTION]

### Phase Completion
- [ ] Phase 1 - All schemas
- [ ] Phase 2 - Track A (Execution)
- [ ] Phase 2 - Track B (AI Memory)
- [ ] Phase 2 - Track C (Knowledge)
- [ ] Phase 2 - Track D (Cognition)
- [ ] Phase 2 - Track E (Surfaces)
- [ ] Phase 3 - All services
- [ ] Phase 4 - Integration

### Active Work
- Currently implementing: [SPECIFIC_PAGE_OR_SERVICE]
- Last file modified: [FILE_PATH]
- Blocked by: [BLOCKER_IF_ANY]

### Key Patterns
- All PKs are UUIDs
- Tables: snake_case
- Routes: kebab-case
- Components: PascalCase
- Use DashboardLayout, Section, Card from /components/layouts/page-layouts.tsx
- Green accent: #2D7A3E
- Slate color palette

### Resume Command
Continue Phase [N], Track [X], starting with [SPECIFIC_TASK].
Follow the spec in IMPLEMENTATION_MASTER_PLAN.md exactly.
Do not create stubs — implement full functionality.
```

---

# Tracking Checklist

## Phase 1 — Foundation (All Schemas)
- [ ] Migration file created: `010_complete_layer_schemas.sql`
- [ ] Adjust tables (4)
- [ ] Act tables (5)
- [ ] Summary tables (5)
- [ ] MCP tables (6)
- [ ] Knowledge tables (4)
- [ ] Think tables (3)
- [ ] Migration executed

## Phase 2 — UI Surfaces

### Track A: Execution Pipeline
- [ ] `/adjust` dashboard
- [ ] `/adjust/corrections`
- [ ] `/adjust/feedback`
- [ ] `/adjust/learning`
- [ ] `/adjust/weights`
- [ ] `/adjust/autonomy`
- [ ] `/act` enhancement
- [ ] `/act/proposals`
- [ ] `/act/executions`
- [ ] `/act/guardrails`
- [ ] `/act/tools`
- [ ] `/admin/executions`

### Track B: AI Memory Pipeline
- [ ] `/summaries` dashboard
- [ ] `/summaries/sessions`
- [ ] `/summaries/daily`
- [ ] `/summaries/topics`
- [ ] `/summaries/domains`
- [ ] `/summaries/queue`
- [ ] `/admin/mcp` dashboard
- [ ] `/admin/mcp/sessions`
- [ ] `/admin/mcp/tools`
- [ ] `/admin/mcp/capabilities`
- [ ] `/admin/mcp/memory`

### Track C: Knowledge Pipeline
- [ ] `/knowledge` enhancement
- [ ] `/knowledge/documents`
- [ ] `/knowledge/documents/[id]`
- [ ] `/knowledge/chunks`
- [ ] `/knowledge/search`
- [ ] `/admin/knowledge-processing`

### Track D: Cognition Pipeline
- [ ] `/think` enhancement
- [ ] `/think/context`
- [ ] `/think/context/[id]`
- [ ] `/think/evidence`
- [ ] `/think/cognitive-twin`

### Track E: Entity & Governance Surfaces
- [ ] `/accounts/[id]`
- [ ] `/customers/[id]`
- [ ] `/pipeline/[id]`
- [ ] `/projects/[id]`
- [ ] `/sales/spine`
- [ ] `/marketing/spine`
- [ ] `/cs/spine`
- [ ] `/ops/spine`
- [ ] `/projects/spine`
- [ ] `/admin/permissions`
- [ ] `/admin/roles`
- [ ] `/admin/policies`
- [ ] `/admin/data-sources`

## Phase 3 — Services
- [ ] `adjust-service` (9 endpoints)
- [ ] `act-bridge` (12 endpoints)
- [ ] `summary-aggregator` (10 endpoints)
- [ ] `mcp-connector` (8 endpoints)
- [ ] `knowledge-processor` (8 endpoints)
- [ ] `context-builder` (7 endpoints)

## Phase 4 — Integration Wiring
- [ ] Flow A → Think (signal refs)
- [ ] Flow B → Think (evidence refs)
- [ ] Flow C → Think (memory refs)
- [ ] Think → Act (proposals)
- [ ] Act → Adjust (rejections)
- [ ] Adjust → Think (weights)
- [ ] MCP → Summary (sessions)
- [ ] Summary → Think (context)

---

**Total: 48 UI pages, 6 services, 26 tables, 8 integration points**

---

**Ready to begin? Choose:**
1. **Phase 1** — Create all schemas (recommended first)
2. **Track A** — Execution Pipeline pages
3. **Track B** — AI Memory Pipeline pages
4. **Track C** — Knowledge Pipeline pages
5. **Track D** — Cognition Pipeline pages
6. **Track E** — Entity & Governance pages
