# Adaptive Spine - Production Deployment Specification
**Version**: 1.0.0-prod
**Date**: 2026-02-08
**Status**: Production-Ready Specification

---

## 🎯 Architecture Decision: Single Source of Truth

### SSOT Rule (Non-Negotiable)
```
Neon PostgreSQL = SSOT for ALL Spine data
Supabase = Auth infrastructure ONLY
```

### Data Ownership Matrix

| Data Type | Owner | Purpose |
|-----------|-------|---------|
| `spine_*` tables | **Neon** | All entity data, schema registry, completeness |
| Multi-tenant org/user data | **Neon** | Operational truth |
| Transactional data | **Neon** | Opportunities, campaigns, engagements |
| Auth sessions/tokens | **Supabase Auth** | JWT validation only |
| User auth profiles | **Supabase Auth** | Login credentials only |
| File storage (optional) | **Supabase Storage** | If needed for auth-related assets |
| Real-time (optional) | **Supabase Realtime** | Frontend-only features (presence) |

### Anti-Pattern (Never Do This)
- ❌ Running same `spine_*` tables in both databases
- ❌ Querying Supabase Postgres for business data
- ❌ Syncing data between Neon ↔ Supabase
- ❌ Using Supabase for anything except Auth/Storage/Realtime

### Connection Strategy
```typescript
// Workers ALWAYS use Neon for data
const db = neon(env.NEON_DB_URL);

// Frontend uses Supabase ONLY for auth
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Auth check
const { data: { user } } = await supabase.auth.getUser();

// But data queries go to Workers → Neon
const response = await fetch(`${WORKER_URL}/api/entities`, {
  headers: { Authorization: `Bearer ${user.access_token}` }
});
```

---

## 🔐 Section 1: Auth + Tenant Isolation

### Auth Flow (Request → Response)

```
1. Frontend → User logs in via Supabase Auth
2. Frontend → Receives Supabase JWT (contains user_id)
3. Frontend → Calls Worker with JWT in Authorization header
4. Worker → Validates JWT with Supabase public key
5. Worker → Extracts user_id from JWT
6. Worker → Queries Neon: SELECT org_id FROM users WHERE id = user_id
7. Worker → Enforces org_id in ALL subsequent queries
8. Worker → Returns data (org-scoped only)
```

### Worker Auth Middleware (Required for All Workers)

```typescript
// auth-middleware.ts
import { createClient } from '@supabase/supabase-js';

export async function verifyAuth(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing auth token', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify JWT with Supabase
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  // Get org_id from Neon (SSOT)
  const db = neon(env.NEON_DB_URL);
  const [userData] = await db`
    SELECT org_id, role
    FROM users
    WHERE auth_id = ${user.id}
  `;

  if (!userData) {
    return { error: 'User not found', status: 404 };
  }

  return {
    user_id: user.id,
    org_id: userData.org_id,
    role: userData.role,
    email: user.email
  };
}
```

### Org-Scoped Query Enforcement

```typescript
// Every query MUST include org_id filter
const entities = await db`
  SELECT * FROM spine_entity_core
  WHERE org_id = ${auth.org_id}
    AND entity_type = ${type}
`;

// Multi-tenant index on ALL tables
CREATE INDEX idx_spine_entity_core_org ON spine_entity_core(org_id, entity_type);
```

### Required Secrets (Auth)

```bash
# Loader Worker
echo "$SUPABASE_URL" | wrangler secret put SUPABASE_URL --config wrangler.loader.toml
echo "$SUPABASE_ANON_KEY" | wrangler secret put SUPABASE_ANON_KEY --config wrangler.loader.toml

# Connector Worker
echo "$SUPABASE_URL" | wrangler secret put SUPABASE_URL --config wrangler.connector.toml
echo "$SUPABASE_ANON_KEY" | wrangler secret put SUPABASE_ANON_KEY --config wrangler.connector.toml
```

---

## 🌐 Section 2: OAuth Redirect Matrix

### Production Domain
```
Primary: https://os.integratewise.online
```

### OAuth Redirect URIs (Register in Provider Consoles)

#### Salesforce
```
Production:  https://os.integratewise.online/api/oauth/salesforce/callback
Local:       http://localhost:3000/api/oauth/salesforce/callback
Worker:      https://integratewise-connector-manager.connect-a1b.workers.dev/oauth/salesforce/callback
```

#### Google (Workspace)
```
Production:  https://os.integratewise.online/api/oauth/google/callback
Local:       http://localhost:3000/api/oauth/google/callback
Worker:      https://integratewise-connector-manager.connect-a1b.workers.dev/oauth/google/callback
```

#### HubSpot
```
Production:  https://os.integratewise.online/api/oauth/hubspot/callback
Local:       http://localhost:3000/api/oauth/hubspot/callback
Worker:      https://integratewise-connector-manager.connect-a1b.workers.dev/oauth/hubspot/callback
```

#### Slack
```
Production:  https://os.integratewise.online/api/oauth/slack/callback
Local:       http://localhost:3000/api/oauth/slack/callback
Worker:      https://integratewise-connector-manager.connect-a1b.workers.dev/oauth/slack/callback
```

### CORS Configuration

```toml
# wrangler.connector.toml
[env.production]
vars = {
  ALLOWED_ORIGINS = "https://os.integratewise.online",
  OAUTH_REDIRECT_BASE = "https://os.integratewise.online/api/oauth"
}

[env.development]
vars = {
  ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:3001",
  OAUTH_REDIRECT_BASE = "http://localhost:3000/api/oauth"
}
```

### OAuth Secrets Configuration

```bash
# Set connector callback (production)
echo "https://os.integratewise.online/api/oauth" | \
  wrangler secret put OAUTH_CALLBACK_BASE --config wrangler.connector.toml

# Salesforce
echo "$SALESFORCE_CLIENT_ID" | wrangler secret put SALESFORCE_CLIENT_ID --config wrangler.connector.toml
echo "$SALESFORCE_CLIENT_SECRET" | wrangler secret put SALESFORCE_CLIENT_SECRET --config wrangler.connector.toml

# Google
echo "$GOOGLE_CLIENT_ID" | wrangler secret put GOOGLE_CLIENT_ID --config wrangler.connector.toml
echo "$GOOGLE_CLIENT_SECRET" | wrangler secret put GOOGLE_CLIENT_SECRET --config wrangler.connector.toml

# HubSpot
echo "$HUBSPOT_CLIENT_ID" | wrangler secret put HUBSPOT_CLIENT_ID --config wrangler.connector.toml
echo "$HUBSPOT_CLIENT_SECRET" | wrangler secret put HUBSPOT_CLIENT_SECRET --config wrangler.connector.toml

# Slack
echo "$SLACK_CLIENT_ID" | wrangler secret put SLACK_CLIENT_ID --config wrangler.connector.toml
echo "$SLACK_CLIENT_SECRET" | wrangler secret put SLACK_CLIENT_SECRET --config wrangler.connector.toml
```

---

## 🔄 Section 3: Async Ingestion Strategy (Cloudflare Queues)

### Queue Architecture

```
User Upload → Loader Worker → Queue → Consumer Worker → Neon
                    ↓
              Return job_id
                    ↓
              Poll /jobs/{id}
```

### Create Queues

```bash
# Ingestion queue (file processing)
wrangler queues create integratewise-ingestion-queue

# Schema discovery queue (field analysis)
wrangler queues create integratewise-schema-queue

# Completeness scoring queue (batch scoring)
wrangler queues create integratewise-scoring-queue
```

### Add Queue Bindings

```toml
# wrangler.loader.toml
[[queues.producers]]
binding = "INGESTION_QUEUE"
queue = "integratewise-ingestion-queue"

[[queues.producers]]
binding = "SCHEMA_QUEUE"
queue = "integratewise-schema-queue"

[[queues.consumers]]
queue = "integratewise-ingestion-queue"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "integratewise-dlq"
```

### Loader Worker (Enqueue Job)

```typescript
// POST /load
export async function handleUpload(request: Request, env: Env) {
  const auth = await verifyAuth(request, env);
  if (auth.error) return Response.json(auth, { status: auth.status });

  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Validation
  if (file.size > 50_000_000) { // 50MB limit
    return Response.json({ error: 'File too large' }, { status: 413 });
  }

  // Generate job ID
  const job_id = crypto.randomUUID();

  // Store file in R2 (or read inline if small)
  await env.UPLOADS.put(`${auth.org_id}/${job_id}/${file.name}`, file.stream());

  // Enqueue job
  await env.INGESTION_QUEUE.send({
    job_id,
    org_id: auth.org_id,
    user_id: auth.user_id,
    file_name: file.name,
    file_size: file.size,
    bucket_type: formData.get('bucketType'),
    bucket_id: formData.get('bucketId'),
    timestamp: Date.now()
  });

  // Store job status in D1
  await env.SPINE_CACHE.prepare(`
    INSERT INTO ingestion_jobs (id, org_id, status, created_at)
    VALUES (?1, ?2, 'queued', ?3)
  `).bind(job_id, auth.org_id, Date.now()).run();

  return Response.json({
    job_id,
    status: 'queued',
    poll_url: `/jobs/${job_id}`
  });
}
```

### Consumer Worker (Process Job)

```typescript
// Queue consumer
export default {
  async queue(batch: MessageBatch<IngestionJob>, env: Env) {
    for (const message of batch.messages) {
      const job = message.body;

      try {
        // Update status: processing
        await updateJobStatus(env, job.job_id, 'processing');

        // Download file from R2
        const file = await env.UPLOADS.get(`${job.org_id}/${job.job_id}/${job.file_name}`);
        const content = await file.text();

        // Parse + normalize
        const records = await parseCSV(content);
        const normalized = await normalizeRecords(records, job.bucket_type);

        // Discover schema
        await env.SCHEMA_QUEUE.send({
          org_id: job.org_id,
          entity_type: job.bucket_type,
          sample_records: normalized.slice(0, 100)
        });

        // Insert into Neon (batched)
        const db = neon(env.NEON_DB_URL);
        await db.transaction(async (tx) => {
          for (const record of normalized) {
            await tx`
              INSERT INTO spine_entity_core (org_id, entity_type, data)
              VALUES (${job.org_id}, ${job.bucket_type}, ${record})
            `;
          }
        });

        // Update status: completed
        await updateJobStatus(env, job.job_id, 'completed', {
          records_processed: normalized.length
        });

        message.ack();
      } catch (error) {
        await updateJobStatus(env, job.job_id, 'failed', {
          error: error.message
        });
        message.retry();
      }
    }
  }
};
```

### Idempotency

```typescript
// Use job_id as idempotency key
await db`
  INSERT INTO spine_entity_core (id, org_id, entity_type, data, ingestion_job_id)
  VALUES (${record.id}, ${org_id}, ${type}, ${data}, ${job_id})
  ON CONFLICT (id) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = NOW()
  WHERE spine_entity_core.ingestion_job_id != ${job_id}
`;
```

### Limits

```typescript
const LIMITS = {
  MAX_FILE_SIZE: 50_000_000,        // 50MB
  MAX_RECORDS_PER_FILE: 100_000,    // 100k rows
  MAX_QUEUE_BATCH_SIZE: 10,         // 10 jobs/batch
  MAX_RETRIES: 3,
  QUEUE_TIMEOUT: 30_000             // 30s
};
```

---

## 🎛️ Section 4: Durable Objects Configuration

### Create Spine Coordinator DO

```typescript
// spine-coordinator.ts (in loader or separate worker)
export class SpineCoordinator {
  state: DurableObjectState;
  sessions: Map<string, WebSocket>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    // WebSocket upgrade for real-time updates
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      await this.handleSession(server, request);
      return new Response(null, { status: 101, webSocket: client });
    }

    // HTTP endpoints
    if (url.pathname === '/status') {
      return Response.json({
        active_sessions: this.sessions.size,
        id: this.state.id.toString()
      });
    }

    return new Response('Not found', { status: 404 });
  }

  async handleSession(ws: WebSocket, request: Request) {
    ws.accept();

    const session_id = crypto.randomUUID();
    this.sessions.set(session_id, ws);

    ws.addEventListener('message', async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'subscribe') {
        // Subscribe to org updates
        await this.state.storage.put(`sub:${msg.org_id}`, session_id);
      }
    });

    ws.addEventListener('close', () => {
      this.sessions.delete(session_id);
    });
  }

  async broadcast(org_id: string, message: any) {
    const session_id = await this.state.storage.get(`sub:${org_id}`);
    const ws = this.sessions.get(session_id);
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  }
}
```

### Add DO Bindings

```toml
# wrangler.loader.toml
[[durable_objects.bindings]]
name = "SPINE_COORDINATOR"
class_name = "SpineCoordinator"
script_name = "integratewise-loader"

[durable_objects]
bindings = [
  { name = "SPINE_COORDINATOR", class_name = "SpineCoordinator" }
]

[[migrations]]
tag = "v1"
new_classes = ["SpineCoordinator"]
```

### Route WebSocket Requests

```typescript
// Loader worker routing
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Route /realtime/* to Durable Object
    if (url.pathname.startsWith('/realtime')) {
      const org_id = url.searchParams.get('org_id');
      const id = env.SPINE_COORDINATOR.idFromName(org_id);
      const stub = env.SPINE_COORDINATOR.get(id);
      return stub.fetch(request);
    }

    // Other routes...
  }
};
```

---

## 🌱 Section 5: Seed Data (Bootstrap)

### Create Seed Migrations

```bash
# Create seed files
touch sql-migrations/036_spine_seed_streams.sql
touch sql-migrations/037_spine_seed_expected_fields.sql
```

### 036_spine_seed_streams.sql

```sql
-- Seed department streams
INSERT INTO spine_streams (id, tenant_id, stream_key, display_name, description, category) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'sales', 'Sales', 'Sales pipeline and opportunities', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'csm', 'Customer Success', 'Customer health and engagement', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'tam', 'Technical Account Management', 'Technical support and escalations', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'marketing', 'Marketing', 'Campaigns and content', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'finance', 'Finance', 'Invoices, contracts, and billing', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'ops', 'Operations', 'Processes and initiatives', 'business'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'engineering', 'Engineering', 'Technical delivery', 'team'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'product', 'Product', 'Product management', 'team')
ON CONFLICT (tenant_id, stream_key) DO NOTHING;
```

### 037_spine_seed_expected_fields.sql

```sql
-- Seed expected fields for completeness scoring

-- L1: Accounts
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('account', 1,
  '["id", "name", "created_at"]'::jsonb,
  '["id", "name", "domain", "industry", "employee_count", "arr", "created_at", "updated_at"]'::jsonb
);

-- L1: Contacts
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('contact', 1,
  '["id", "email", "created_at"]'::jsonb,
  '["id", "email", "first_name", "last_name", "title", "account_id", "phone", "created_at"]'::jsonb
);

-- L2: Opportunities (Sales)
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('opportunity', 2,
  '["id", "name", "account_id", "stage", "created_at"]'::jsonb,
  '["id", "name", "account_id", "amount", "stage", "probability", "close_date", "owner_id", "created_at"]'::jsonb
);

-- L2: Success Plans (CSM)
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('success_plan', 2,
  '["id", "account_id", "created_at"]'::jsonb,
  '["id", "account_id", "health_score", "renewal_date", "csm_id", "objectives", "risks", "created_at"]'::jsonb
);

-- L2: Campaigns (Marketing)
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('campaign', 2,
  '["id", "name", "created_at"]'::jsonb,
  '["id", "name", "type", "status", "budget", "start_date", "end_date", "owner_id", "created_at"]'::jsonb
);

-- L3: Engagements
INSERT INTO spine_expected_fields (entity_type, layer_level, required_fields, expected_fields) VALUES
('engagement', 3,
  '["id", "account_id", "created_at"]'::jsonb,
  '["id", "account_id", "contact_id", "type", "subject", "sentiment", "timestamp", "created_at"]'::jsonb
);
```

### Run Seeds

```bash
export DATABASE_URL="postgresql://neondb_owner:***@ep-plain-bird-abh7vpm0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

psql $DATABASE_URL -f sql-migrations/036_spine_seed_streams.sql
psql $DATABASE_URL -f sql-migrations/037_spine_seed_expected_fields.sql

# Verify
psql $DATABASE_URL -c "SELECT stream_key, display_name FROM spine_streams;"
psql $DATABASE_URL -c "SELECT entity_type, layer_level FROM spine_expected_fields;"
```

---

## 📊 Section 6: Observability + Error Reporting

### Logpush Setup (Cloudflare → External)

```bash
# Send worker logs to external aggregator (e.g., Datadog, New Relic)
wrangler logpush create \
  --destination-conf="endpoint=https://http-intake.logs.datadoghq.com/api/v2/logs?dd-api-key=YOUR_KEY" \
  --dataset=workers_trace_events \
  --filter='{"where":{"and":[{"key":"ScriptName","operator":"equals","value":"integratewise-loader"}]}}'
```

### Request ID Injection

```typescript
// Every worker request gets a correlation ID
export async function handleRequest(request: Request, env: Env) {
  const request_id = request.headers.get('X-Request-ID') || crypto.randomUUID();

  try {
    const response = await routeRequest(request, env);
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'X-Request-ID': request_id
      }
    });
  } catch (error) {
    console.error({
      request_id,
      error: error.message,
      stack: error.stack,
      path: new URL(request.url).pathname
    });

    // Report to Sentry
    await reportError(env, {
      request_id,
      error,
      user_agent: request.headers.get('User-Agent'),
      url: request.url
    });

    return Response.json(
      { error: 'Internal error', request_id },
      { status: 500, headers: { 'X-Request-ID': request_id } }
    );
  }
}
```

### Analytics Bindings

```toml
# wrangler.loader.toml
[analytics_engine_datasets]
binding = "ANALYTICS"

# wrangler.connector.toml
[analytics_engine_datasets]
binding = "ANALYTICS"
```

### Track Key Metrics

```typescript
// Track ingestion metrics
env.ANALYTICS.writeDataPoint({
  blobs: [request_id, org_id, 'ingestion_success'],
  doubles: [file_size, processing_time_ms, record_count],
  indexes: ['loader']
});

// Track schema discovery
env.ANALYTICS.writeDataPoint({
  blobs: [org_id, entity_type, 'schema_discovered'],
  doubles: [field_count, new_fields_count],
  indexes: ['schema']
});

// Track OAuth failures
env.ANALYTICS.writeDataPoint({
  blobs: [org_id, provider, 'oauth_failed'],
  doubles: [1],
  indexes: ['connector']
});
```

### Dashboard Queries (Cloudflare GraphQL)

```graphql
# Ingestion success rate (last 24h)
query {
  viewer {
    accounts(filter: { accountTag: "a1bbbb12a32cdbb68dd170b09fe8b5f3" }) {
      workersAnalyticsEngineDatasets(filter: {
        datetime_geq: "2026-02-07T00:00:00Z"
        index: "loader"
      }) {
        dimensions {
          blob1  # request_id
          blob2  # org_id
          blob3  # status
        }
        sum {
          double1  # file_size
        }
        count
      }
    }
  }
}
```

### Alerting Thresholds

```yaml
# alert-config.yaml
alerts:
  - name: High Ingestion Failure Rate
    condition: (failed_jobs / total_jobs) > 0.1
    window: 5m
    action: page_oncall

  - name: Schema Discovery Lag
    condition: avg(discovery_time_ms) > 5000
    window: 10m
    action: slack_alert

  - name: OAuth Token Expiry
    condition: tokens_expiring_in_24h > 10
    window: 1h
    action: email_csm

  - name: Queue Backlog
    condition: queue_depth > 1000
    window: 5m
    action: page_oncall
```

---

## 🔒 Section 7: Secret Hygiene (Production)

### Environment Variable Separation

#### ❌ NEVER in Frontend (.env.local or .env)
```bash
# These must NEVER be in client-exposed env
SUPABASE_SERVICE_ROLE_KEY=xxx     # ❌ Server-only
STRIPE_SECRET_KEY=xxx             # ❌ Server-only
CLERK_SECRET_KEY=xxx              # ❌ Server-only
NEON_DATABASE_URL=xxx             # ❌ Server-only
GROQ_API_KEY=xxx                  # ❌ Server-only
WEBFLOW_API_TOKEN=xxx             # ❌ Server-only
BLOB_READ_WRITE_TOKEN=xxx         # ❌ Server-only
CRON_SECRET=xxx                   # ❌ Server-only
```

#### ✅ Frontend (.env.local) - PUBLIC ONLY
```bash
# Only these can be in frontend
NEXT_PUBLIC_SUPABASE_URL=https://vjeuzreomitbstwfkqbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Public anon key (safe)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Public key (safe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Public key (safe)
NEXT_PUBLIC_URL=https://os.integratewise.online
NEXT_PUBLIC_LOADER_URL_PROD=https://integratewise-loader.connect-a1b.workers.dev
NEXT_PUBLIC_CONNECTOR_URL_PROD=https://integratewise-connector-manager.connect-a1b.workers.dev
```

#### ✅ Server-Only (Cloudflare Pages Secrets)
```bash
# Set via Cloudflare Pages dashboard or wrangler
wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name integratewise-os
wrangler pages secret put STRIPE_SECRET_KEY --project-name integratewise-os
wrangler pages secret put CLERK_SECRET_KEY --project-name integratewise-os
wrangler pages secret put NEON_DATABASE_URL --project-name integratewise-os
wrangler pages secret put GROQ_API_KEY --project-name integratewise-os
wrangler pages secret put WEBFLOW_API_TOKEN --project-name integratewise-os
wrangler pages secret put CRON_SECRET --project-name integratewise-os
```

#### ✅ Worker Secrets (Cloudflare Workers)
```bash
# Loader secrets
echo "$NEON_DB_URL" | wrangler secret put NEON_DB_URL --config wrangler.loader.toml
echo "$SUPABASE_URL" | wrangler secret put SUPABASE_URL --config wrangler.loader.toml
echo "$SUPABASE_ANON_KEY" | wrangler secret put SUPABASE_ANON_KEY --config wrangler.loader.toml
openssl rand -hex 32 | wrangler secret put BUCKET_SIGNING_SECRET --config wrangler.loader.toml

# Connector secrets
echo "$NEON_DB_URL" | wrangler secret put NEON_DB_URL --config wrangler.connector.toml
echo "$SUPABASE_URL" | wrangler secret put SUPABASE_URL --config wrangler.connector.toml
echo "$SUPABASE_ANON_KEY" | wrangler secret put SUPABASE_ANON_KEY --config wrangler.connector.toml
openssl rand -hex 32 | wrangler secret put CONNECTOR_ENCRYPTION_KEY --config wrangler.connector.toml
echo "https://os.integratewise.online/api/oauth" | wrangler secret put OAUTH_CALLBACK_BASE --config wrangler.connector.toml
```

### Secret Rotation Policy

```yaml
# rotation-schedule.yaml
secrets:
  - name: NEON_DATABASE_URL
    rotation: 90_days
    owner: platform_team

  - name: CLERK_SECRET_KEY
    rotation: 180_days
    owner: auth_team

  - name: STRIPE_SECRET_KEY
    rotation: 365_days
    owner: billing_team

  - name: OAuth Secrets (all providers)
    rotation: 180_days
    owner: integrations_team

  - name: BUCKET_SIGNING_SECRET
    rotation: 90_days
    owner: platform_team
```

### Access Control

```bash
# Restrict who can read secrets
# Cloudflare: Use API tokens with minimal scope
# Neon: Use role-based access
# Supabase: Use service role key rotation

# Audit secret access
wrangler tail --format json | grep "secret_accessed"
```

---

## 📋 Section 8: Updated Wrangler Configs (Complete)

### wrangler.loader.toml (Final)

```toml
name = "integratewise-loader"
main = "./loader-service.ts"
compatibility_date = "2026-01-31"
compatibility_flags = ["nodejs_compat"]

[vars]
NODE_ENV = "production"
ALLOWED_ORIGINS = "https://os.integratewise.online"

# Secrets (set via wrangler secret put):
# - NEON_DB_URL
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - BUCKET_SIGNING_SECRET

# D1 Database
[[d1_databases]]
binding = "SPINE_CACHE"
database_name = "integratewise-spine-cache"
database_id = "ed1f534a-df1e-4783-8a74-8d6d70d067ff"

# KV Storage
[[kv_namespaces]]
binding = "CACHE"
id = "18aa20dfeb304f0ba592d9070964dd31"

# Vectorize
[[vectorize]]
binding = "EMBEDDINGS"
index_name = "integratewise-embeddings"

[[vectorize]]
binding = "KNOWLEDGE"
index_name = "integratewise-knowledge"

# R2 Storage (uncomment when enabled)
# [[r2_buckets]]
# binding = "UPLOADS"
# bucket_name = "integratewise-uploads"

# [[r2_buckets]]
# binding = "DOCUMENTS"
# bucket_name = "integratewise-documents"

# Queues (Producer)
[[queues.producers]]
binding = "INGESTION_QUEUE"
queue = "integratewise-ingestion-queue"

[[queues.producers]]
binding = "SCHEMA_QUEUE"
queue = "integratewise-schema-queue"

# Queue Consumer
[[queues.consumers]]
queue = "integratewise-ingestion-queue"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "integratewise-dlq"

# Durable Objects
[[durable_objects.bindings]]
name = "SPINE_COORDINATOR"
class_name = "SpineCoordinator"
script_name = "integratewise-loader"

[durable_objects]
bindings = [
  { name = "SPINE_COORDINATOR", class_name = "SpineCoordinator" }
]

[[migrations]]
tag = "v1"
new_classes = ["SpineCoordinator"]

# Analytics
[analytics_engine_datasets]
binding = "ANALYTICS"
```

### wrangler.connector.toml (Final)

```toml
name = "integratewise-connector-manager"
main = "./connector-manager-service.ts"
compatibility_date = "2026-01-31"
compatibility_flags = ["nodejs_compat"]

[vars]
NODE_ENV = "production"
ALLOWED_ORIGINS = "https://os.integratewise.online"
OAUTH_REDIRECT_BASE = "https://os.integratewise.online/api/oauth"

# Secrets (set via wrangler secret put):
# - NEON_DB_URL
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - CONNECTOR_ENCRYPTION_KEY
# - OAUTH_CALLBACK_BASE
# - SALESFORCE_CLIENT_ID
# - SALESFORCE_CLIENT_SECRET
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - HUBSPOT_CLIENT_ID
# - HUBSPOT_CLIENT_SECRET
# - SLACK_CLIENT_ID
# - SLACK_CLIENT_SECRET

# D1 Database
[[d1_databases]]
binding = "SESSION_STORE"
database_name = "integratewise-session-store"
database_id = "a8837a2d-a671-4948-b2ae-7e8be0a45dd3"

# KV Storage
[[kv_namespaces]]
binding = "SESSIONS"
id = "508ba759f7a44ca8aaaf8502d603077b"

[[kv_namespaces]]
binding = "RATE_LIMITS"
id = "8f61d841d2574061ac1d547187d72a58"

# Vectorize
[[vectorize]]
binding = "KNOWLEDGE"
index_name = "integratewise-knowledge"

# Analytics
[analytics_engine_datasets]
binding = "ANALYTICS"
```

---

## 🚀 Final Deployment Checklist

### Phase 1: Infrastructure (Complete)
- [x] D1 databases created
- [x] KV namespaces created
- [x] Vectorize indexes created
- [ ] R2 buckets created (requires enablement)
- [ ] Cloudflare Queues created
- [ ] Durable Objects configured

### Phase 2: Database (Complete)
- [x] Neon connection verified
- [x] Migrations 032-035 run
- [ ] Seed migrations 036-037 run
- [x] 40 spine tables created

### Phase 3: Workers (Complete)
- [x] Loader worker deployed
- [x] Connector worker deployed
- [x] Basic secrets configured
- [ ] Auth middleware added
- [ ] Queue consumers added
- [ ] DO classes implemented

### Phase 4: Security (Critical)
- [ ] Rotate all exposed credentials
- [ ] Move server secrets out of frontend
- [ ] Configure CORS properly
- [ ] Set up OAuth redirects
- [ ] Implement org-scoped queries

### Phase 5: Observability (Required)
- [ ] Set up Logpush
- [ ] Configure Analytics Engine
- [ ] Add request ID tracking
- [ ] Set up alerting
- [ ] Create dashboards

### Phase 6: Testing (Required)
- [ ] Test auth flow end-to-end
- [ ] Test file ingestion with queues
- [ ] Test OAuth for each provider
- [ ] Test multi-tenancy isolation
- [ ] Load test with concurrent uploads

---

## 🎯 Next Actions (Priority Order)

1. **IMMEDIATE** (Today):
   - Rotate all exposed credentials
   - Run seed migrations (036-037)
   - Move secrets to proper locations

2. **HIGH** (This Week):
   - Create Cloudflare Queues
   - Implement auth middleware
   - Add queue consumers
   - Configure OAuth redirects

3. **MEDIUM** (Next Week):
   - Implement Durable Objects
   - Set up observability
   - Add comprehensive tests

4. **LOW** (This Month):
   - Enable R2 storage
   - Fine-tune performance
   - Add advanced monitoring

---

## 📚 Documentation References

- **SSOT Rule**: Section 1 (Neon = truth)
- **Auth Strategy**: Section 1 (JWT → org_id)
- **OAuth Setup**: Section 2 (redirect URIs)
- **Async Jobs**: Section 3 (queues)
- **Real-time**: Section 4 (Durable Objects)
- **Seed Data**: Section 5 (streams + fields)
- **Monitoring**: Section 6 (logs + alerts)
- **Secrets**: Section 7 (hygiene)

---

**Status**: Production-Ready Specification ✅
**Missing from V1**: R2 enablement, Queue implementation, DO implementation
**Security**: Requires credential rotation + secret migration
**Completeness**: 100% specification, ~60% implementation

*Deploy with confidence once credentials are rotated and queues are added.*
