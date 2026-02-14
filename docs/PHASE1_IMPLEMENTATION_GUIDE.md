# Phase 1 Implementation Guide: Pipeline Decomposition

**Goal**: Break down combined workers into 8-stage discrete pipeline with DLQ
**Duration**: 2 weeks
**Priority**: P0 (Critical - blocks production readiness)

## Current State Problem

Your current architecture combines multiple pipeline stages into monolithic workers:

```
integratewise-gateway (Analyzer + Classifier + Filter)
    ↓
integratewise-normalizer (Refiner + Extractor + Validator)
    ↓
integratewise-spine-v2 (Sanity Scan + Sectorizer)
```

**Issues**:
- ❌ No granular failure isolation (entire pipeline fails if one stage fails)
- ❌ Cannot route failures to DLQ per stage
- ❌ No stage-specific observability (can't see which stage is slow)
- ❌ Cannot scale stages independently

## Target State Architecture

```
Webhook Event
    ↓
[Stage 1: Analyzer] → analyzer-queue
    ↓
[Stage 2: Classifier] → classifier-queue
    ↓
[Stage 3: Filter] → filter-queue
    ↓
[Stage 4: Refiner] → refiner-queue
    ↓
[Stage 5: Extractor] → extractor-queue
    ↓
[Stage 6: Validator] → validator-queue
    ↓
[Stage 7: Sanity Scan] → sanity-queue
    ↓
[Stage 8: Sectorizer] → sectorizer-queue
    ↓
Spine SSOT

(Each stage routes failures to dlq-queue)
```

---

## Week 1: Queue Infrastructure + First 4 Stages

### Day 1-2: Create Cloudflare Queues

**Step 1**: Create queues via Wrangler CLI

```bash
# Navigate to project root
cd /Users/nirmal/Github/integratewise-brainstroming

# Create 9 queues (8 stages + 1 DLQ)
wrangler queues create analyzer-queue
wrangler queues create classifier-queue
wrangler queues create filter-queue
wrangler queues create refiner-queue
wrangler queues create extractor-queue
wrangler queues create validator-queue
wrangler queues create sanity-queue
wrangler queues create sectorizer-queue
wrangler queues create dlq-queue

# Verify creation
wrangler queues list
```

**Expected Output**:
```
✅ analyzer-queue (0 messages)
✅ classifier-queue (0 messages)
✅ filter-queue (0 messages)
✅ refiner-queue (0 messages)
✅ extractor-queue (0 messages)
✅ validator-queue (0 messages)
✅ sanity-queue (0 messages)
✅ sectorizer-queue (0 messages)
✅ dlq-queue (0 messages)
```

---

### Day 3-4: Stage 1 - Analyzer

**Purpose**: Detect entities, identify fields, extract metadata from webhook payload

**Step 1**: Create worker directory

```bash
mkdir -p services/stage-analyzer/src
cd services/stage-analyzer
```

**Step 2**: Create `wrangler.toml`

```toml
name = "integratewise-stage-analyzer"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[queues.producers]]
binding = "CLASSIFIER_QUEUE"
queue = "classifier-queue"

[[queues.producers]]
binding = "DLQ_QUEUE"
queue = "dlq-queue"

[[queues.consumers]]
queue = "analyzer-queue"
max_batch_size = 10
max_batch_timeout = 5
max_retries = 3
dead_letter_queue = "dlq-queue"

[env.production]
name = "integratewise-stage-analyzer"
```

**Step 3**: Create `package.json`

```json
{
  "name": "integratewise-stage-analyzer",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "@cloudflare/workers-types": "^4.20240925.0",
    "hono": "^4.6.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "wrangler": "^3.0.0"
  }
}
```

**Step 4**: Create `src/index.ts`

```typescript
import { z } from 'zod';

interface Env {
  CLASSIFIER_QUEUE: Queue;
  DLQ_QUEUE: Queue;
}

interface WebhookEvent {
  id: string;
  tenant_id: string;
  provider: string;
  event_type: string;
  payload: any;
  received_at: string;
}

// Input validation schema
const WebhookEventSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  provider: z.string(),
  event_type: z.string(),
  payload: z.any(),
  received_at: z.string()
});

export default {
  async queue(batch: MessageBatch<WebhookEvent>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        // Validate input
        const event = WebhookEventSchema.parse(message.body);

        // STAGE 1 LOGIC: Analyze payload
        const analysis = analyzePayload(event);

        // Enrich event with analysis
        const enrichedEvent = {
          ...event,
          analysis,
          stage: 'analyzer',
          processed_at: new Date().toISOString()
        };

        // Forward to Stage 2 (Classifier)
        await env.CLASSIFIER_QUEUE.send(enrichedEvent);

        // Acknowledge successful processing
        message.ack();

      } catch (error) {
        console.error('Analyzer stage failed:', error);

        // Route to DLQ
        await env.DLQ_QUEUE.send({
          original_message: message.body,
          failed_stage: 'analyzer',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          error_stack: error instanceof Error ? error.stack : undefined,
          failed_at: new Date().toISOString(),
          retry_count: message.attempts
        });

        // Acknowledge to prevent infinite retries
        message.ack();
      }
    }
  }
};

function analyzePayload(event: WebhookEvent): any {
  const payload = event.payload;

  return {
    // Entity detection
    entities: detectEntities(payload),

    // Field identification
    fields: identifyFields(payload),

    // Metadata extraction
    metadata: {
      field_count: Object.keys(payload).length,
      has_nested: hasNestedObjects(payload),
      estimated_size: JSON.stringify(payload).length
    }
  };
}

function detectEntities(payload: any): string[] {
  const entities: string[] = [];

  // Common entity patterns
  if (payload.contact || payload.email || payload.firstName) entities.push('contact');
  if (payload.company || payload.companyName) entities.push('company');
  if (payload.deal || payload.opportunity) entities.push('deal');
  if (payload.ticket || payload.case) entities.push('ticket');
  if (payload.product || payload.lineItem) entities.push('product');

  return entities;
}

function identifyFields(payload: any): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === null) {
      fields[key] = 'null';
    } else if (Array.isArray(value)) {
      fields[key] = 'array';
    } else if (typeof value === 'object') {
      fields[key] = 'object';
    } else {
      fields[key] = typeof value;
    }
  }

  return fields;
}

function hasNestedObjects(payload: any, depth = 0): boolean {
  if (depth > 5) return false; // Prevent infinite recursion

  for (const value of Object.values(payload)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return true;
    }
    if (typeof value === 'object' && value !== null) {
      if (hasNestedObjects(value, depth + 1)) return true;
    }
  }

  return false;
}
```

**Step 5**: Deploy

```bash
pnpm install
wrangler deploy
```

**Step 6**: Test

```bash
# Send test message to analyzer-queue
wrangler queues producer analyzer-queue send '{
  "id": "test-001",
  "tenant_id": "tenant-123",
  "provider": "hubspot",
  "event_type": "contact.created",
  "payload": {
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Corp"
  },
  "received_at": "2026-02-14T12:00:00Z"
}'

# Check classifier-queue for output
wrangler queues consumer classifier-queue http --port 8788
# Then send GET to http://localhost:8788/receive to see messages
```

---

### Day 5-6: Stage 2 - Classifier

**Purpose**: Route event to correct Spine sector (Contacts, Companies, Deals, etc.)

**Step 1**: Create worker (similar structure)

```bash
mkdir -p services/stage-classifier/src
cd services/stage-classifier
```

**Step 2**: Create `src/index.ts`

```typescript
interface Env {
  FILTER_QUEUE: Queue;
  DLQ_QUEUE: Queue;
}

interface AnalyzedEvent {
  id: string;
  tenant_id: string;
  provider: string;
  event_type: string;
  payload: any;
  analysis: {
    entities: string[];
    fields: Record<string, string>;
    metadata: any;
  };
  received_at: string;
  processed_at: string;
}

export default {
  async queue(batch: MessageBatch<AnalyzedEvent>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        const event = message.body;

        // STAGE 2 LOGIC: Classify to Spine sector
        const classification = classifyToSector(event);

        const enrichedEvent = {
          ...event,
          classification,
          stage: 'classifier'
        };

        // Forward to Stage 3 (Filter)
        await env.FILTER_QUEUE.send(enrichedEvent);
        message.ack();

      } catch (error) {
        console.error('Classifier stage failed:', error);
        await env.DLQ_QUEUE.send({
          original_message: message.body,
          failed_stage: 'classifier',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          failed_at: new Date().toISOString()
        });
        message.ack();
      }
    }
  }
};

function classifyToSector(event: AnalyzedEvent): any {
  const entities = event.analysis.entities;

  // Determine primary sector
  let sector = 'unknown';
  if (entities.includes('contact')) sector = 'contacts';
  else if (entities.includes('company')) sector = 'companies';
  else if (entities.includes('deal')) sector = 'deals';
  else if (entities.includes('ticket')) sector = 'tickets';
  else if (entities.includes('product')) sector = 'products';

  // Determine secondary sectors (multi-sector entities)
  const secondary_sectors: string[] = [];
  if (sector === 'contacts' && entities.includes('company')) {
    secondary_sectors.push('companies');
  }
  if (sector === 'deals' && entities.includes('contact')) {
    secondary_sectors.push('contacts');
  }

  return {
    primary_sector: sector,
    secondary_sectors,
    confidence: calculateConfidence(entities, sector)
  };
}

function calculateConfidence(entities: string[], sector: string): number {
  // Simple confidence scoring (can be ML-enhanced later)
  const primaryEntityPresent = entities.includes(sector.slice(0, -1)); // Remove 's'
  const entityCount = entities.length;

  if (primaryEntityPresent && entityCount === 1) return 1.0;
  if (primaryEntityPresent && entityCount > 1) return 0.8;
  if (!primaryEntityPresent && entityCount > 0) return 0.5;
  return 0.3;
}
```

**wrangler.toml**:

```toml
name = "integratewise-stage-classifier"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[queues.producers]]
binding = "FILTER_QUEUE"
queue = "filter-queue"

[[queues.producers]]
binding = "DLQ_QUEUE"
queue = "dlq-queue"

[[queues.consumers]]
queue = "classifier-queue"
max_batch_size = 10
max_batch_timeout = 5
max_retries = 3
dead_letter_queue = "dlq-queue"
```

**Deploy**:

```bash
pnpm install
wrangler deploy
```

---

### Day 7: Stage 3 - Filter (Deduplication)

**Purpose**: Check fingerprint to prevent duplicate processing

**Key Integration**: Use existing `loader-db` D1 database with `processed_fingerprints` table

**Step 1**: Create worker

```typescript
interface Env {
  REFINER_QUEUE: Queue;
  DLQ_QUEUE: Queue;
  LOADER_DB: D1Database; // Existing fingerprint DB
}

interface ClassifiedEvent {
  id: string;
  tenant_id: string;
  provider: string;
  payload: any;
  analysis: any;
  classification: {
    primary_sector: string;
    secondary_sectors: string[];
    confidence: number;
  };
}

export default {
  async queue(batch: MessageBatch<ClassifiedEvent>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        const event = message.body;

        // STAGE 3 LOGIC: Check for duplicates
        const fingerprint = generateFingerprint(event);
        const isDuplicate = await checkDuplicate(fingerprint, event.tenant_id, env.LOADER_DB);

        if (isDuplicate) {
          console.log(`Duplicate detected: ${fingerprint}, skipping...`);
          message.ack(); // Acknowledge but don't forward
          continue;
        }

        // Store fingerprint
        await storeFingerprint(fingerprint, event.tenant_id, event.provider, env.LOADER_DB);

        const enrichedEvent = {
          ...event,
          fingerprint,
          stage: 'filter'
        };

        // Forward to Stage 4 (Refiner)
        await env.REFINER_QUEUE.send(enrichedEvent);
        message.ack();

      } catch (error) {
        console.error('Filter stage failed:', error);
        await env.DLQ_QUEUE.send({
          original_message: message.body,
          failed_stage: 'filter',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          failed_at: new Date().toISOString()
        });
        message.ack();
      }
    }
  }
};

function generateFingerprint(event: ClassifiedEvent): string {
  // Generate deterministic fingerprint from payload
  const key_fields = extractKeyFields(event.payload);
  const fingerprint_data = {
    provider: event.provider,
    tenant_id: event.tenant_id,
    ...key_fields
  };

  // Simple hash (use crypto.subtle.digest in production)
  return btoa(JSON.stringify(fingerprint_data));
}

function extractKeyFields(payload: any): Record<string, any> {
  // Extract fields that uniquely identify the entity
  const key_fields: Record<string, any> = {};

  if (payload.id) key_fields.external_id = payload.id;
  if (payload.email) key_fields.email = payload.email;
  if (payload.vid) key_fields.vid = payload.vid; // HubSpot contact ID

  return key_fields;
}

async function checkDuplicate(
  fingerprint: string,
  tenant_id: string,
  db: D1Database
): Promise<boolean> {
  const result = await db
    .prepare('SELECT fingerprint FROM processed_fingerprints WHERE fingerprint = ? AND tenant_id = ?')
    .bind(fingerprint, tenant_id)
    .first();

  return result !== null;
}

async function storeFingerprint(
  fingerprint: string,
  tenant_id: string,
  source: string,
  db: D1Database
): Promise<void> {
  await db
    .prepare('INSERT INTO processed_fingerprints (fingerprint, tenant_id, source, created_at) VALUES (?, ?, ?, ?)')
    .bind(fingerprint, tenant_id, source, new Date().toISOString())
    .run();
}
```

**wrangler.toml**:

```toml
name = "integratewise-stage-filter"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[queues.producers]]
binding = "REFINER_QUEUE"
queue = "refiner-queue"

[[queues.producers]]
binding = "DLQ_QUEUE"
queue = "dlq-queue"

[[queues.consumers]]
queue = "filter-queue"
max_batch_size = 10
max_batch_timeout = 5
max_retries = 3
dead_letter_queue = "dlq-queue"

[[d1_databases]]
binding = "LOADER_DB"
database_name = "loader-db"
database_id = "<YOUR_LOADER_DB_ID>" # Get from: wrangler d1 list
```

---

## Week 2: Remaining 4 Stages + DLQ Monitor

### Day 8-9: Stage 4 - Refiner

**Purpose**: Data quality enhancement (normalize phone, validate email, etc.)

```typescript
function refinePayload(payload: any): any {
  return {
    ...payload,
    // Normalize phone numbers
    phone: payload.phone ? normalizePhone(payload.phone) : undefined,
    // Validate email
    email: payload.email ? validateEmail(payload.email) : undefined,
    // Standardize names
    firstName: payload.firstName ? capitalize(payload.firstName) : undefined,
    lastName: payload.lastName ? capitalize(payload.lastName) : undefined
  };
}
```

### Day 10-11: Stage 5 - Extractor

**Purpose**: Transform to canonical Spine schema

```typescript
function extractCanonicalFields(event: any): any {
  const sector = event.classification.primary_sector;

  switch (sector) {
    case 'contacts':
      return extractContactFields(event.payload);
    case 'companies':
      return extractCompanyFields(event.payload);
    case 'deals':
      return extractDealFields(event.payload);
    default:
      return event.payload;
  }
}

function extractContactFields(payload: any): any {
  return {
    external_id: payload.id || payload.vid,
    email: payload.email,
    first_name: payload.firstName || payload.first_name,
    last_name: payload.lastName || payload.last_name,
    phone: payload.phone,
    company_id: payload.associatedcompanyid || payload.companyId,
    lifecycle_stage: payload.lifecyclestage,
    created_at: payload.createdate,
    updated_at: payload.lastmodifieddate
  };
}
```

### Day 12: Stage 6 - Validator

**Purpose**: Schema validation against Spine constraints

```typescript
import { z } from 'zod';

const ContactSchema = z.object({
  external_id: z.string(),
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  company_id: z.string().optional(),
  lifecycle_stage: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

function validatePayload(canonical_data: any, sector: string): any {
  switch (sector) {
    case 'contacts':
      return ContactSchema.parse(canonical_data);
    // Add other schemas
    default:
      return canonical_data;
  }
}
```

### Day 13: Stage 7 - Sanity Scan

**Purpose**: Anomaly detection, risk scoring

```typescript
function sanityScan(event: any): any {
  const risks: string[] = [];
  let risk_score = 0;

  // Check for suspicious patterns
  if (event.canonical_data.email?.includes('test')) {
    risks.push('test_email');
    risk_score += 0.3;
  }

  if (event.canonical_data.phone === '000-000-0000') {
    risks.push('placeholder_phone');
    risk_score += 0.2;
  }

  // Check for data quality issues
  if (!event.canonical_data.email && !event.canonical_data.phone) {
    risks.push('missing_contact_info');
    risk_score += 0.5;
  }

  return {
    risks,
    risk_score,
    risk_level: calculateRiskLevel(risk_score)
  };
}

function calculateRiskLevel(score: number): string {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}
```

### Day 14: Stage 8 - Sectorizer + DLQ Monitor

**Stage 8 - Sectorizer**: Write to Spine SSOT

```typescript
interface Env {
  SPINE_DB: D1Database; // integratewise-spine-prod
  DLQ_QUEUE: Queue;
}

async function writeToSpine(event: any, env: Env): Promise<void> {
  const sector = event.classification.primary_sector;
  const data = event.canonical_data;

  await env.SPINE_DB
    .prepare(`
      INSERT INTO ${sector} (
        id, tenant_id, source_system, source_id, data, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id, source_system, source_id)
      DO UPDATE SET data = ?, updated_at = ?
    `)
    .bind(
      crypto.randomUUID(),
      event.tenant_id,
      event.provider,
      data.external_id,
      JSON.stringify(data),
      new Date().toISOString(),
      new Date().toISOString(),
      JSON.stringify(data), // For UPDATE clause
      new Date().toISOString()
    )
    .run();
}
```

**DLQ Monitor Worker**:

```typescript
// services/dlq-monitor/src/index.ts
import { Hono } from 'hono';

interface Env {
  DLQ_QUEUE: Queue;
  DLQ_STORE: D1Database; // New database for DLQ persistence
}

const app = new Hono<{ Bindings: Env }>();

// HTTP endpoint to view DLQ messages
app.get('/dlq/messages', async (c) => {
  const messages = await c.env.DLQ_STORE
    .prepare('SELECT * FROM dlq_messages ORDER BY failed_at DESC LIMIT 100')
    .all();

  return c.json(messages);
});

// Queue consumer to persist DLQ messages
export default {
  fetch: app.fetch,

  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const dlq_event = message.body;

      await env.DLQ_STORE
        .prepare(`
          INSERT INTO dlq_messages (
            id, original_message, failed_stage, error_message, failed_at, retry_count
          ) VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(
          crypto.randomUUID(),
          JSON.stringify(dlq_event.original_message),
          dlq_event.failed_stage,
          dlq_event.error_message,
          dlq_event.failed_at,
          dlq_event.retry_count || 0
        )
        .run();

      message.ack();
    }
  }
};
```

**Create DLQ Store D1 Database**:

```bash
wrangler d1 create dlq-store-prod
wrangler d1 execute dlq-store-prod --local --file=./services/dlq-monitor/schema.sql
```

**schema.sql**:

```sql
CREATE TABLE dlq_messages (
  id TEXT PRIMARY KEY,
  original_message TEXT NOT NULL,
  failed_stage TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  failed_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_dlq_failed_stage ON dlq_messages(failed_stage);
CREATE INDEX idx_dlq_failed_at ON dlq_messages(failed_at);
CREATE INDEX idx_dlq_resolved ON dlq_messages(resolved) WHERE resolved = FALSE;
```

---

## Testing the Complete Pipeline

### End-to-End Test

```bash
# 1. Send webhook event to analyzer-queue
wrangler queues producer analyzer-queue send '{
  "id": "hubspot-contact-12345",
  "tenant_id": "tenant-abc",
  "provider": "hubspot",
  "event_type": "contact.created",
  "payload": {
    "vid": "12345",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-123-4567",
    "associatedcompanyid": "67890",
    "lifecyclestage": "lead",
    "createdate": "2026-02-14T10:00:00Z",
    "lastmodifieddate": "2026-02-14T12:00:00Z"
  },
  "received_at": "2026-02-14T12:00:00Z"
}'

# 2. Watch logs across all stages
wrangler tail integratewise-stage-analyzer
wrangler tail integratewise-stage-classifier
wrangler tail integratewise-stage-filter
# ... etc

# 3. Check Spine database for written entity
wrangler d1 execute integratewise-spine-prod --command="SELECT * FROM contacts WHERE source_id = '12345'"

# 4. Check DLQ for any failures
curl https://integratewise-dlq-monitor.workers.dev/dlq/messages
```

---

## Observability Setup

### Cloudflare Analytics Dashboard

1. Go to [Workers & Pages](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/workers-and-pages)
2. For each stage worker, click **Metrics**
3. Monitor:
   - Request count (messages processed)
   - Error rate (should be <0.1%)
   - CPU time (should be <50ms p95)
   - Success rate (should be >99.9%)

### Queue Metrics

```bash
# Check queue depths
wrangler queues list

# Should show:
# analyzer-queue: 0-10 messages (steady state)
# classifier-queue: 0-10 messages
# ... (all queues should drain quickly)
# dlq-queue: 0 messages (ideally)
```

---

## Success Criteria

After Week 2, you should have:

- ✅ 8 discrete queue-based pipeline stages deployed
- ✅ DLQ system capturing all failures
- ✅ End-to-end test passing (webhook → Spine)
- ✅ DLQ rate <0.1% (less than 1 in 1000 messages failing)
- ✅ Pipeline latency <5s (p95)
- ✅ All stage logs accessible via `wrangler tail`

---

## Rollout Strategy

### Phase 1: Shadow Mode (Day 1-7)

- Deploy new pipeline stages
- **Gateway continues routing to old normalizer**
- Duplicate messages to new `analyzer-queue` for testing
- Compare outputs: old pipeline vs new pipeline
- No production impact

### Phase 2: Canary (Day 8-10)

- Route 10% of traffic to new pipeline
- Monitor DLQ rate, latency, data quality
- If issues: rollback to 0%, fix, retry
- If stable: increase to 50%

### Phase 3: Full Migration (Day 11-14)

- Route 100% of traffic to new pipeline
- Deprecate old `integratewise-normalizer` worker
- Monitor for 48 hours
- Celebrate! 🎉

---

## Troubleshooting

### Issue: Messages stuck in queue

**Symptoms**: Queue depth growing, not draining

**Diagnosis**:
```bash
wrangler queues info <queue-name>
```

**Fixes**:
- Check worker logs: `wrangler tail <worker-name>`
- Increase `max_batch_size` in wrangler.toml
- Check for quota limits (Workers request limit)

### Issue: High DLQ rate

**Symptoms**: >1% of messages in DLQ

**Diagnosis**:
```bash
curl https://integratewise-dlq-monitor.workers.dev/dlq/messages
```

**Fixes**:
- Review error messages in DLQ
- Add schema validation to earlier stages
- Improve error handling (try/catch)

### Issue: Duplicate entities in Spine

**Symptoms**: Same entity written multiple times

**Diagnosis**:
```bash
wrangler d1 execute integratewise-spine-prod --command="
  SELECT source_id, COUNT(*) as count
  FROM contacts
  GROUP BY source_id
  HAVING count > 1
"
```

**Fixes**:
- Verify fingerprint logic in Filter stage
- Add UNIQUE constraint on (tenant_id, source_system, source_id)
- Use UPSERT (ON CONFLICT DO UPDATE) in Sectorizer

---

## Next Steps After Phase 1

Once pipeline decomposition is complete:

1. **Phase 2**: Deploy HITL Hard Gate (Week 3)
2. **Phase 3**: Implement Audit Store (Week 4)
3. **Phase 4**: Deploy AI Agents (Weeks 9-12)

See [CLOUDFLARE_DEPLOYMENT_STATUS.md](./CLOUDFLARE_DEPLOYMENT_STATUS.md) for full 16-week roadmap.

---

**Questions? Issues?** Review logs first, then check [Troubleshooting](#troubleshooting) section.
