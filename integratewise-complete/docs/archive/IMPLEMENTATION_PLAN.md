# IntegrateWise OS: Implementation Plan

> Created: 2026-01-27 | Status: Active

---

## Overall System Health: 🟡 65% Complete

The **architecture is sound** and the **foundation is solid**. The gaps are well-defined and addressable in a structured manner.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTEGRATEWISE OS                             │
├─────────────────────────────────────────────────────────────────────┤
│  INTERFACE (Shell)         │  DATA (SSOT)        │  ENGINE (Brain) │
│  ────────────────          │  ─────────          │  ────────────── │
│  ✅ Spine UI               │  ✅ Spine DB        │  ✅ Loader      │
│  ✅ Context UI             │  ✅ 57+ Tables      │  🔴 Normalizer  │
│  ✅ IQ Hub UI              │  🟡 Entity Links    │  🟡 Think       │
│  ✅ Think UI               │  🟡 Evidence Refs   │  🟡 Govern      │
│  ✅ Act UI                 │  🔴 Action Runs     │  ✅ Act         │
│  ✅ Evidence Drawer        │                     │                 │
│  🟡 Today (approvals)      │                     │                 │
└─────────────────────────────────────────────────────────────────────┘
```

### What's Working (Green Path)

- **Shell renders Views** from Supabase correctly
- **Act executes** approved decisions with retry/idempotency
- **Loader ingests** from external sources
- **MCP Connector** captures AI sessions
- **Evidence Drawer** displays A/B/C grounding

### What's Broken (Red Path)

- **Normalizer** is empty → raw events bypass validation
- **Think** doesn't fuse A/B/C → situations lack evidence
- **Govern** has no policies → approval is implicit only
- **Today** doesn't show pending approvals

---

## Implementation Phases

### Phase 0: Foundation Fixes (Week 1)

**Goal**: Close critical gaps blocking the core loop

| Task | Effort | Owner | Deliverable |
|------|--------|-------|-------------|
| 0.1 Apply Think Engine SQL | 1h | DB | `situations`, `actions`, `evidence_refs` tables live |
| 0.2 Add missing tables | 2h | DB | `action_runs`, `support_tickets`, `usage_metrics` |
| 0.3 Fix TypeScript types | 2h | FE | `@types/react` installed, lint errors resolved |
| 0.4 Verify Act → SSOT loop | 2h | BE | Integration test: decision → execute → event writeback |

**Exit Criteria**: `SELECT * FROM situations` returns rows. Act writes events back to Spine.

---

### Phase 1: Normalizer Service (Week 2)

**Goal**: No raw event reaches Spine without validation

#### Architecture

```
┌──────────┐     ┌─────────────┐     ┌──────────┐
│  Loader  │ ──▶ │ Normalizer  │ ──▶ │  Store   │
│  (raw)   │     │ (validate)  │     │  (SSOT)  │
└──────────┘     └─────────────┘     └──────────┘
                       │
                       ▼
                 ┌─────────────┐
                 │ DLQ/Errors  │
                 └─────────────┘
```

#### Deliverables

| Task | Effort | Deliverable |
|------|--------|-------------|
| 1.1 Define entity schemas | 4h | `services/normalizer/src/schemas/*.json` |
| 1.2 Implement normalize() | 4h | Schema validation + dedup + version stamp |
| 1.3 Create DLQ table | 1h | `normalization_errors` table |
| 1.4 Wire Loader → Normalizer | 2h | Loader calls normalizer before store |
| 1.5 Add metrics | 2h | Validation pass/fail counters |

#### Schema Example

```json
// services/normalizer/src/schemas/client.schema.json
{
  "$id": "client",
  "type": "object",
  "required": ["name", "tenant_id"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "tenant_id": { "type": "string", "format": "uuid" },
    "email": { "type": "string", "format": "email" },
    "status": { "enum": ["active", "inactive", "at_risk", "churned"] },
    "health_score": { "type": "number", "minimum": 0, "maximum": 100 }
  }
}
```

#### Core Implementation

```typescript
// services/normalizer/src/index.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { neon } from '@neondatabase/serverless';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export interface NormalizeResult {
  success: boolean;
  canonical_record?: any;
  errors?: string[];
  dedup_key: string;
  version: number;
}

export async function normalize(
  entity_type: string,
  raw_data: any,
  dbUrl: string
): Promise<NormalizeResult> {
  const sql = neon(dbUrl);
  
  // 1. Load schema
  const schema = await import(`./schemas/${entity_type}.schema.json`);
  const validate = ajv.compile(schema);
  
  // 2. Validate
  const valid = validate(raw_data);
  if (!valid) {
    // Write to DLQ
    await sql`
      INSERT INTO normalization_errors (entity_type, raw_data, errors, occurred_at)
      VALUES (${entity_type}, ${JSON.stringify(raw_data)}, ${JSON.stringify(validate.errors)}, NOW())
    `;
    return {
      success: false,
      errors: validate.errors?.map(e => `${e.instancePath} ${e.message}`),
      dedup_key: '',
      version: 0
    };
  }
  
  // 3. Generate dedup key
  const dedup_key = `${entity_type}:${raw_data.id || raw_data.external_id}`;
  
  // 4. Check for existing version
  const [existing] = await sql`
    SELECT version FROM canonical_versions WHERE dedup_key = ${dedup_key}
  `;
  const version = (existing?.version || 0) + 1;
  
  // 5. Upsert version
  await sql`
    INSERT INTO canonical_versions (dedup_key, version, updated_at)
    VALUES (${dedup_key}, ${version}, NOW())
    ON CONFLICT (dedup_key) DO UPDATE SET version = ${version}, updated_at = NOW()
  `;
  
  return {
    success: true,
    canonical_record: { ...raw_data, _version: version, _normalized_at: new Date().toISOString() },
    dedup_key,
    version
  };
}
```

**Exit Criteria**: Loader → Normalizer → Store pipeline runs. Invalid data goes to DLQ.

---

### Phase 2: Think A/B/C Fusion (Week 3)

**Goal**: Every situation and action is grounded in evidence

#### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         THINK ENGINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │ A: SPINE    │   │ B: CONTEXT  │   │ C: AI MEM   │           │
│  │ signals     │   │ artifacts   │   │ sessions    │           │
│  │ metrics     │   │ emails      │   │ decisions   │           │
│  │ events      │   │ docs        │   │ summaries   │           │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘           │
│         │                 │                 │                   │
│         └────────────┬────┴─────────────────┘                   │
│                      ▼                                          │
│               ┌─────────────┐                                   │
│               │   FUSION    │                                   │
│               │  (combine)  │                                   │
│               └──────┬──────┘                                   │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SITUATION { title, summary, severity, evidence_refs[] } │   │
│  │ ACTIONS   { title, description, evidence_refs[] }       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Deliverables

| Task | Effort | Deliverable |
|------|--------|-------------|
| 2.1 Create fusion.ts | 4h | `fuseSources(entity_type, entity_id)` function |
| 2.2 Create actions.ts | 4h | `createProposedAction(situation_id, sources)` |
| 2.3 Update engine.ts | 2h | Integrate fusion into escalation logic |
| 2.4 Write evidence_refs | 2h | Every situation/action gets A/B/C refs |
| 2.5 Add narrative generation | 4h | LLM-based "why it matters" summary |

#### Core Implementation

```typescript
// services/think/src/fusion.ts
import { neon } from '@neondatabase/serverless';

export interface EvidenceRef {
  ref_type: 'spine_metric' | 'spine_event' | 'context_artifact' | 'ai_session';
  ref_id: string;
  ref_table: string;
  relevance_score?: number;
}

export interface FusedSources {
  spine: { signals: any[]; metrics: any[]; events: any[] };
  context: { artifacts: any[]; emails: any[]; documents: any[] };
  ai: { sessions: any[]; insights: any[] };
  evidence_refs: EvidenceRef[];
}

export async function fuseSources(
  dbUrl: string,
  entity_type: string,
  entity_id: string
): Promise<FusedSources> {
  const sql = neon(dbUrl);
  const evidence_refs: EvidenceRef[] = [];
  
  // A: SPINE (Structured Truth)
  const signals = await sql`
    SELECT * FROM signals 
    WHERE entity_type = ${entity_type} AND entity_id = ${entity_id}
    AND computed_at > NOW() - INTERVAL '7 days'
    ORDER BY computed_at DESC LIMIT 10
  `;
  signals.forEach(s => evidence_refs.push({ 
    ref_type: 'spine_metric', ref_id: s.id, ref_table: 'signals' 
  }));
  
  const metrics = await sql`
    SELECT * FROM metrics 
    WHERE metadata->>'entity_id' = ${entity_id}
    ORDER BY recorded_at DESC LIMIT 5
  `;
  
  const events = await sql`
    SELECT * FROM activities 
    WHERE entity_type = ${entity_type} AND entity_id = ${entity_id}
    ORDER BY occurred_at DESC LIMIT 10
  `;
  events.forEach(e => evidence_refs.push({ 
    ref_type: 'spine_event', ref_id: e.id, ref_table: 'activities' 
  }));
  
  // B: CONTEXT (Unstructured Evidence)
  const artifacts = await sql`
    SELECT a.* FROM artifact_links al
    JOIN (
      SELECT id, title, 'document' as type, created_at FROM documents
      UNION ALL
      SELECT id, name as title, 'file' as type, created_at FROM drive_files
      UNION ALL
      SELECT id, subject as title, 'email' as type, received_at as created_at FROM emails
    ) a ON a.id = al.artifact_id
    WHERE al.entity_type = ${entity_type} AND al.entity_id = ${entity_id}
    ORDER BY a.created_at DESC LIMIT 10
  `;
  artifacts.forEach(a => evidence_refs.push({ 
    ref_type: 'context_artifact', ref_id: a.id, ref_table: a.type + 's' 
  }));
  
  // C: AI SESSION MEMORY
  const sessions = await sql`
    SELECT bs.* FROM session_links sl
    JOIN brainstorm_sessions bs ON bs.id = sl.session_id
    WHERE sl.entity_type = ${entity_type} AND sl.entity_id = ${entity_id}
    ORDER BY bs.created_at DESC LIMIT 5
  `;
  sessions.forEach(s => evidence_refs.push({ 
    ref_type: 'ai_session', ref_id: s.id, ref_table: 'brainstorm_sessions' 
  }));
  
  const insights = await sql`
    SELECT bi.* FROM brainstorm_insights bi
    JOIN session_links sl ON sl.session_id = bi.session_id
    WHERE sl.entity_type = ${entity_type} AND sl.entity_id = ${entity_id}
    ORDER BY bi.created_at DESC LIMIT 10
  `;
  
  return {
    spine: { signals, metrics, events },
    context: { artifacts, emails: [], documents: [] },
    ai: { sessions, insights },
    evidence_refs
  };
}
```

```typescript
// services/think/src/actions.ts
import { neon } from '@neondatabase/serverless';
import type { FusedSources } from './fusion';

export interface ProposedAction {
  id: string;
  situation_id: string;
  title: string;
  description: string;
  action_type: string; // 'email.draft', 'task.create', 'workflow.trigger'
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence_refs: any[];
}

const ACTION_TEMPLATES: Record<string, (ctx: any) => Partial<ProposedAction>> = {
  'churn_risk': (ctx) => ({
    title: 'Execute Retention Playbook',
    description: `Reach out to ${ctx.entity_name} with a personalized retention offer`,
    action_type: 'workflow.trigger',
    parameters: { playbook: 'retention_v2', discount_percent: 15 },
    priority: 'high'
  }),
  'expansion_opportunity': (ctx) => ({
    title: 'Generate Expansion Quote',
    description: `Create upgrade proposal for ${ctx.entity_name}`,
    action_type: 'crm.create_quote',
    parameters: { template: 'expansion_standard' },
    priority: 'medium'
  }),
  'payment_failed': (ctx) => ({
    title: 'Apply Grace Period',
    description: `Extend payment deadline for ${ctx.entity_name} by 7 days`,
    action_type: 'billing.apply_grace_period',
    parameters: { days: 7 },
    priority: 'critical'
  })
};

export async function createProposedActions(
  dbUrl: string,
  situation: { id: string; situation_key: string; entity_type: string; entity_id: string },
  sources: FusedSources
): Promise<ProposedAction[]> {
  const sql = neon(dbUrl);
  const actions: ProposedAction[] = [];
  
  // Get entity name for context
  let entity_name = situation.entity_id;
  if (situation.entity_type === 'client') {
    const [client] = await sql`SELECT name FROM clients WHERE id = ${situation.entity_id}::uuid`;
    entity_name = client?.name || entity_name;
  }
  
  // Match situation to action template
  const template = ACTION_TEMPLATES[situation.situation_key];
  if (template) {
    const actionDef = template({ entity_name, ...situation });
    
    const [inserted] = await sql`
      INSERT INTO actions (
        situation_id, title, description, action_type, parameters, 
        priority, status, evidence_refs, created_at
      ) VALUES (
        ${situation.id}::uuid,
        ${actionDef.title},
        ${actionDef.description},
        ${actionDef.action_type},
        ${JSON.stringify(actionDef.parameters)},
        ${actionDef.priority},
        'proposed',
        ${JSON.stringify(sources.evidence_refs.slice(0, 5))}, -- Top 5 evidence refs
        NOW()
      )
      RETURNING *
    `;
    
    actions.push(inserted as ProposedAction);
  }
  
  return actions;
}
```

**Exit Criteria**: `SELECT * FROM actions WHERE evidence_refs IS NOT NULL` returns rows with A/B/C refs.

---

### Phase 3: Governance Layer (Week 4)

**Goal**: Explicit approval policies and audit trail

#### Deliverables

| Task | Effort | Deliverable |
|------|--------|-------------|
| 3.1 Create governance_policies table | 2h | Policy definitions |
| 3.2 Implement policy engine | 4h | `canExecute(user, action)` function |
| 3.3 Add approval workflow | 4h | Status transitions: proposed → pending_approval → approved/rejected |
| 3.4 Create action_runs table | 2h | Execution history tracking |
| 3.5 Audit logging | 2h | Who approved, when, with what evidence |

#### SQL

```sql
-- sql-migrations/flow-a/044_governance.sql
CREATE TABLE governance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  policy_name VARCHAR(100) NOT NULL,
  action_type_pattern VARCHAR(100), -- 'billing.*', 'crm.create_task', etc.
  min_severity VARCHAR(20), -- Actions must meet severity threshold
  required_roles TEXT[], -- ['admin', 'cs_manager']
  auto_approve BOOLEAN DEFAULT false,
  max_auto_amount DECIMAL(15,2), -- Auto-approve up to this $ value
  require_evidence_count INT DEFAULT 1, -- Min evidence refs required
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE action_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES actions(id),
  decision_id UUID REFERENCES agent_decisions(id),
  tenant_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'pending', 'running', 'success', 'failed', 'cancelled'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB,
  error_details JSONB,
  retry_count INT DEFAULT 0,
  idempotency_key VARCHAR(255),
  UNIQUE(tenant_id, idempotency_key)
);

CREATE TABLE governance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  action_id UUID REFERENCES actions(id),
  decision_type VARCHAR(20), -- 'approve', 'reject', 'delegate', 'auto_approve'
  decided_by UUID, -- user_id
  decided_at TIMESTAMP DEFAULT NOW(),
  reason TEXT,
  evidence_snapshot JSONB, -- Snapshot of evidence at decision time
  policy_applied UUID REFERENCES governance_policies(id)
);
```

**Exit Criteria**: Actions cannot execute without matching policy. All approvals logged.

---

### Phase 4: UI Completion (Week 5)

**Goal**: Today view shows pending approvals, full governance workflow

#### Deliverables

| Task | Effort | Deliverable |
|------|--------|-------------|
| 4.1 Today pending approvals | 4h | Card showing proposed actions needing decision |
| 4.2 Approval UI | 4h | Approve/Reject buttons with feedback field |
| 4.3 Act execution history | 4h | `/act/history` route with run logs |
| 4.4 Evidence in approval | 2h | Show A/B/C evidence during approval decision |
| 4.5 Timeline improvements | 4h | Entity 360 shows chronological Context stream |

**Exit Criteria**: User can see pending actions in Today, click to review evidence, approve/reject, see execution result.

---

### Phase 5: Semantic Retrieval (Week 6-7)

**Goal**: AI-powered evidence discovery

#### Deliverables

| Task | Effort | Deliverable |
|------|--------|-------------|
| 5.1 Chunking pipeline | 8h | Split documents into chunks with embeddings |
| 5.2 Session embeddings | 4h | Embed AI session summaries |
| 5.3 Semantic search API | 4h | `/search?q=...` returns relevant evidence |
| 5.4 Think semantic lookup | 4h | Think uses semantic search to find related evidence |
| 5.5 IQ Hub search | 4h | Search across sessions by content |

**Exit Criteria**: "Find evidence about churn" returns relevant documents, emails, and AI sessions.

---

## Effort Summary

| Phase | Duration | Total Hours | Priority |
|-------|----------|-------------|----------|
| Phase 0: Foundation | Week 1 | 7h | 🔴 Critical |
| Phase 1: Normalizer | Week 2 | 13h | 🔴 Critical |
| Phase 2: Think Fusion | Week 3 | 16h | 🔴 Critical |
| Phase 3: Governance | Week 4 | 14h | 🟡 High |
| Phase 4: UI Complete | Week 5 | 18h | 🟡 High |
| Phase 5: Semantic | Week 6-7 | 24h | 🟢 Medium |

**Total: ~92 hours (6-7 weeks)**

---

## Success Metrics

### Core Loop Test

```
[Stripe Event] → [Normalize] → [Store] → [Think] → [Situation+Actions] → [Approve] → [Act] → [Event Back]
     ✅              ✅           ✅         ✅             ✅              ✅         ✅         ✅
```

### Evidence Trace Test

- Any situation clicked → Evidence Drawer opens
- Drawer shows: A (2+ Spine refs), B (1+ Context refs), C (1+ AI session ref)
- All refs are clickable and resolve to real records

### Governance Test

- Proposed action with `priority=critical` requires `admin` role
- Auto-approve works for low-value actions matching policy
- All decisions logged with evidence snapshot

---

## File Structure After Implementation

```
services/
├── loader/           # ✅ Exists
├── normalizer/       # 🆕 Phase 1
│   ├── src/
│   │   ├── index.ts
│   │   ├── schemas/
│   │   │   ├── client.schema.json
│   │   │   ├── deal.schema.json
│   │   │   └── ...
│   │   └── dlq.ts
│   └── wrangler.toml
├── think/            # 🔄 Phase 2
│   ├── src/
│   │   ├── index.ts
│   │   ├── engine.ts     # ✅ Exists
│   │   ├── fusion.ts     # 🆕
│   │   ├── actions.ts    # 🆕
│   │   └── narrative.ts  # 🆕
│   └── wrangler.toml
├── govern/           # 🆕 Phase 3
│   ├── src/
│   │   ├── index.ts
│   │   ├── policies.ts
│   │   └── audit.ts
│   └── wrangler.toml
├── act/              # ✅ Exists (robust)
└── store/            # ✅ Exists

apps/integratewise-os/src/
├── app/(app)/
│   ├── today/            # 🔄 Phase 4: add approvals
│   ├── think/            # ✅ Exists
│   ├── act/
│   │   ├── page.tsx      # ✅ Exists
│   │   └── history/      # 🆕 Phase 4
│   │       └── page.tsx
│   ├── govern/           # 🆕 Phase 4
│   │   └── page.tsx
│   └── ...
└── components/
    └── views/
        ├── today-dashboard.tsx    # ✅ Exists
        ├── today-approvals.tsx    # 🆕 Phase 4
        └── ...

sql-migrations/flow-a/
├── 041_create_think_engine.sql    # ✅ Created
├── 042_add_action_runs.sql        # 🆕 Phase 0
├── 043_support_tickets.sql        # 🆕 Phase 0
├── 044_governance.sql             # 🆕 Phase 3
└── 045_semantic_chunks.sql        # 🆕 Phase 5
```

---

## Next Immediate Action

**Run Phase 0.1**: Apply the Think Engine SQL migration to your Supabase instance:

```bash
cd /Users/nirmal/Downloads/New\ Folder\ With\ Items/integratewise-knowledge-bank
psql $DATABASE_URL < sql-migrations/flow-a/041_create_think_engine.sql
```

This creates `situations`, `actions`, `evidence_refs` tables and unblocks Phase 2.

---

*Ready to begin Phase 0?*
