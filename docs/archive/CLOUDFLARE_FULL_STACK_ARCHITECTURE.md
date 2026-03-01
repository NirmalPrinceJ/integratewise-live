# IntegrateWise OS - Cloudflare Full Stack Architecture

> **Version**: 1.0  
> **Last Updated**: 31 January 2026  
> **Status**: Architecture Blueprint  
> **Goal**: 100% Cloudflare-Native Cognitive Knowledge Workspace

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cloudflare Services Mapping](#cloudflare-services-mapping)
3. [Architecture Overview](#architecture-overview)
4. [Data Layer (SPINE)](#data-layer-spine)
5. [Intelligence Layer (THINK)](#intelligence-layer-think)
6. [Real-time Layer](#real-time-layer)
7. [Storage Layer](#storage-layer)
8. [Security & Access](#security--access)
9. [Development Workflow](#development-workflow)
10. [Service-by-Service Implementation](#service-by-service-implementation)
11. [Cost Estimation](#cost-estimation)
12. [Migration Roadmap](#migration-roadmap)

---

## Executive Summary

This document outlines how to build IntegrateWise OS as a **100% Cloudflare-native** platform, leveraging the full Cloudflare developer platform for:

- **Compute**: Workers, Durable Objects, Workflows
- **AI/ML**: Workers AI, AI Gateway, Vectorize
- **Data**: D1, Hyperdrive, KV, R2
- **Real-time**: Durable Objects WebSockets, Queues, Pub/Sub
- **Security**: Access, Turnstile, WAF
- **Observability**: Analytics Engine, Logs, Traces

**Benefits**:
- Global edge deployment (300+ locations)
- Zero cold starts with Smart Placement
- Unified billing and management
- Built-in DDoS protection
- Consistent dev/prod environment with Miniflare

---

## Cloudflare Services Mapping

### Services Required for Cognitive Knowledge Workspace

| Capability | Cloudflare Service | Use Case |
|------------|-------------------|----------|
| **Compute** | Workers | API endpoints, business logic |
| **Stateful Compute** | Durable Objects | Real-time collaboration, WebSockets, rate limiting |
| **Long-running Tasks** | Workflows | ETL jobs, AI pipelines, data sync |
| **SQL Database** | D1 | Transactional data, accounts, contracts |
| **External DB** | Hyperdrive | Connect to Neon/Supabase with connection pooling |
| **Key-Value Store** | KV | Session storage, feature flags, cache |
| **Vector Database** | Vectorize | Semantic search, embeddings, RAG |
| **Object Storage** | R2 | Documents, attachments, exports |
| **AI Inference** | Workers AI | Signal detection, embeddings, summarization |
| **AI Management** | AI Gateway | Multi-LLM routing, caching, rate limiting |
| **Message Queue** | Queues | Async processing, webhook handling |
| **Real-time Events** | Pub/Sub | Live signals, notifications |
| **Analytics** | Analytics Engine | Custom telemetry, usage tracking |
| **Static Hosting** | Pages | Next.js frontend |
| **Authentication** | Access | Zero-trust security, SSO |
| **Bot Protection** | Turnstile | Form protection |
| **Media** | Images, Stream | Document previews, video |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE GLOBAL NETWORK                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ Presentation Layer ──────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │  │
│  │  │ Pages (SSR)  │   │   Access     │   │  Turnstile   │             │  │
│  │  │ Next.js App  │   │ Zero-Trust   │   │ Bot Protect  │             │  │
│  │  └──────────────┘   └──────────────┘   └──────────────┘             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ API Gateway Layer ───────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │  │
│  │  │   Gateway    │   │  AI Gateway  │   │ Rate Limiter │             │  │
│  │  │   Worker     │   │ LLM Routing  │   │  (D.Object)  │             │  │
│  │  └──────────────┘   └──────────────┘   └──────────────┘             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ Service Layer (Workers) ─────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │  │
│  │  │ Spine  │ │ Think  │ │  Act   │ │ Govern │ │Loader  │ │ Store  │  │  │
│  │  │        │ │        │ │        │ │        │ │        │ │        │  │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │  │
│  │  │IQ Hub  │ │Knowledge│ │ Admin  │ │Billing │ │Normaliz│ │Orchestr│  │  │
│  │  │        │ │        │ │        │ │        │ │        │ │        │  │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ Intelligence Layer ──────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │  │
│  │  │  Workers AI  │   │  Vectorize   │   │  Workflows   │             │  │
│  │  │ Inference    │   │ Embeddings   │   │ ETL Pipelines│             │  │
│  │  └──────────────┘   └──────────────┘   └──────────────┘             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ Data Layer ──────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │  │
│  │  │      D1      │   │  Hyperdrive  │   │      KV      │             │  │
│  │  │ Transactional│   │ Neon Pooling │   │ Cache/Config │             │  │
│  │  └──────────────┘   └──────────────┘   └──────────────┘             │  │
│  │                                                                       │  │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │  │
│  │  │      R2      │   │    Queues    │   │   Pub/Sub    │             │  │
│  │  │ Object Store │   │ Async Tasks  │   │ Real-time    │             │  │
│  │  └──────────────┘   └──────────────┘   └──────────────┘             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ Observability ───────────────────────────────────────────────────────┐  │
│  │  Analytics Engine │ Workers Logs │ Traces │ Real-time Metrics        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Layer (SPINE)

### D1 - Primary Transactional Database

Use D1 for core business data that needs ACID compliance:

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "integratewise-core"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Tables in D1**:
- `tenants` - Multi-tenant organizations
- `users` - User accounts
- `accounts` - Customer accounts (Account 360)
- `contracts` - Commercial agreements
- `stakeholders` - Relationship graph
- `risk_registry` - Risk scoring
- `signals` - Detected signals
- `audit_log` - Governance trail

**Schema Example**:
```sql
-- D1 Schema for Account 360
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  arr REAL,
  renewal_date TEXT,
  health_score INTEGER,
  churn_risk REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account_signals (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL,
  payload TEXT, -- JSON
  confidence REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE risk_registry (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  risk_category TEXT NOT NULL,
  impact INTEGER CHECK(impact BETWEEN 1 AND 5),
  probability INTEGER CHECK(probability BETWEEN 1 AND 5),
  risk_score INTEGER GENERATED ALWAYS AS (impact * probability) STORED,
  mitigation_status TEXT,
  owner TEXT,
  target_resolution TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Hyperdrive - External Database Connection Pooling

For complex queries and existing Neon/Supabase data:

```toml
# wrangler.toml
[[hyperdrive]]
binding = "NEON_DB"
id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Usage**:
```typescript
// Connect to Neon with connection pooling
import { Client } from 'pg';

export default {
  async fetch(request: Request, env: Env) {
    const client = new Client(env.NEON_DB.connectionString);
    await client.connect();
    
    const result = await client.query(`
      SELECT a.*, 
             COUNT(s.id) as signal_count,
             AVG(s.confidence) as avg_confidence
      FROM accounts a
      LEFT JOIN signals s ON s.account_id = a.id
      WHERE a.tenant_id = $1
      GROUP BY a.id
    `, [tenantId]);
    
    return Response.json(result.rows);
  }
};
```

### KV - Configuration & Cache

Fast key-value access for:
- Feature flags
- Tenant configuration
- Session data
- API response cache

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "CONFIG"
id = "xxxxxxxx"

[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxx"
```

**Usage**:
```typescript
// Feature flags
const features = await env.CONFIG.get(`tenant:${tenantId}:features`, 'json');
if (features?.ai_copilot) {
  // Enable AI features
}

// Response cache
const cacheKey = `account:${accountId}:360`;
let data = await env.CACHE.get(cacheKey, 'json');
if (!data) {
  data = await fetchAccount360(accountId);
  await env.CACHE.put(cacheKey, JSON.stringify(data), { expirationTtl: 300 });
}
```

### R2 - Object Storage

For documents, attachments, exports:

```toml
# wrangler.toml
[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "integratewise-documents"

[[r2_buckets]]
binding = "EXPORTS"
bucket_name = "integratewise-exports"
```

**Usage**:
```typescript
// Store evidence document
await env.DOCUMENTS.put(
  `tenants/${tenantId}/evidence/${evidenceId}/document.pdf`,
  documentBuffer,
  {
    httpMetadata: { contentType: 'application/pdf' },
    customMetadata: { 
      accountId, 
      uploadedBy: userId,
      classification: 'confidential'
    }
  }
);

// Generate presigned URL for download
const signedUrl = await env.DOCUMENTS.createSignedUrl(key, {
  expiresIn: 3600
});
```

---

## Intelligence Layer (THINK)

### Workers AI - Edge Inference

Run AI models directly on Cloudflare's edge:

```toml
# wrangler.toml
[ai]
binding = "AI"
```

**Available Models**:
| Task | Model | Use Case |
|------|-------|----------|
| Embeddings | `@cf/baai/bge-base-en-v1.5` | Semantic search |
| Text Generation | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | Summaries, insights |
| Classification | `@cf/huggingface/distilbert-sst-2-int8` | Sentiment analysis |
| NER | `@cf/huggingface/bert-base-ner` | Entity extraction |

**Signal Detection Example**:
```typescript
// Analyze customer communication for signals
export async function detectSignals(env: Env, text: string) {
  // 1. Generate embeddings for semantic analysis
  const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [text]
  });

  // 2. Classify sentiment
  const sentiment = await env.AI.run('@cf/huggingface/distilbert-sst-2-int8', {
    text
  });

  // 3. Extract entities (competitors, products)
  const entities = await env.AI.run('@cf/huggingface/bert-base-ner', {
    text
  });

  // 4. Generate risk assessment
  const analysis = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [
      {
        role: 'system',
        content: `You are a customer success analyst. Analyze this communication and identify:
1. Churn risk signals (0-1 score)
2. Expansion opportunities
3. Competitor mentions
4. Sentiment shift
5. Urgency level
Return as JSON.`
      },
      { role: 'user', content: text }
    ]
  });

  return {
    embeddings: embeddings.data[0],
    sentiment: sentiment[0],
    entities,
    analysis: JSON.parse(analysis.response)
  };
}
```

### Vectorize - Semantic Search

Store embeddings for RAG and similarity search:

```toml
# wrangler.toml
[[vectorize]]
binding = "VECTORS"
index_name = "integratewise-knowledge"
```

**Usage**:
```typescript
// Index a document
const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: [document.content]
});

await env.VECTORS.upsert([{
  id: document.id,
  values: embedding.data[0],
  metadata: {
    tenantId,
    accountId,
    type: 'meeting_notes',
    date: document.date
  }
}]);

// Semantic search
const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: ['churn risk payment delays']
});

const results = await env.VECTORS.query(queryEmbedding.data[0], {
  topK: 10,
  filter: { tenantId: { $eq: tenantId } },
  returnMetadata: true
});
```

### AI Gateway - Multi-LLM Management

Route AI requests through gateway for:
- Caching (reduce costs)
- Rate limiting
- Fallback providers
- Analytics

```typescript
// AI Gateway configuration
const AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/{account_id}/integratewise';

// Use gateway for external LLMs
async function queryLLM(prompt: string, provider: 'openai' | 'anthropic' | 'workers-ai') {
  const response = await fetch(`${AI_GATEWAY_URL}/${provider}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.AI_GATEWAY_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: provider === 'openai' ? 'gpt-4-turbo' : 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  return response.json();
}
```

### Workflows - Long-Running Tasks

For ETL pipelines, data sync, scheduled jobs:

```typescript
// workflows/sync-crm.ts
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

export class CRMSyncWorkflow extends WorkflowEntrypoint {
  async run(event: WorkflowEvent, step: WorkflowStep) {
    const { tenantId, crmType } = event.payload;

    // Step 1: Fetch data from CRM
    const crmData = await step.do('fetch-crm-data', async () => {
      const connector = getCRMConnector(crmType);
      return await connector.fetchAccounts(tenantId);
    });

    // Step 2: Transform and enrich
    const enrichedData = await step.do('enrich-data', async () => {
      return await Promise.all(crmData.map(async (account) => {
        const signals = await detectSignals(env, account.notes);
        return { ...account, signals };
      }));
    });

    // Step 3: Generate embeddings
    const withEmbeddings = await step.do('generate-embeddings', async () => {
      return await Promise.all(enrichedData.map(async (account) => {
        const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: [JSON.stringify(account)]
        });
        return { ...account, embedding: embedding.data[0] };
      }));
    });

    // Step 4: Store in D1 + Vectorize
    await step.do('store-data', async () => {
      await Promise.all([
        storeInD1(env.DB, withEmbeddings),
        storeInVectorize(env.VECTORS, withEmbeddings)
      ]);
    });

    // Step 5: Detect cross-account signals
    await step.do('detect-signals', async () => {
      await detectCrossAccountSignals(tenantId);
    });

    return { synced: enrichedData.length, timestamp: new Date().toISOString() };
  }
}
```

---

## Real-time Layer

### Durable Objects - Stateful WebSockets

For real-time collaboration, live signals, presence:

```typescript
// durable-objects/signal-stream.ts
export class SignalStreamDO {
  state: DurableObjectState;
  sessions: Map<WebSocket, { tenantId: string; userId: string }> = new Map();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }
    
    // HTTP endpoint for broadcasting signals
    if (request.method === 'POST') {
      const signal = await request.json();
      await this.broadcast(signal);
      return new Response('OK');
    }
    
    return new Response('Expected WebSocket', { status: 400 });
  }

  async handleWebSocket(request: Request) {
    const { 0: client, 1: server } = new WebSocketPair();
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const userId = url.searchParams.get('userId');

    server.accept();
    this.sessions.set(server, { tenantId, userId });

    server.addEventListener('close', () => {
      this.sessions.delete(server);
    });

    // Send recent signals on connect
    const recentSignals = await this.state.storage.get('recentSignals') || [];
    server.send(JSON.stringify({ type: 'init', signals: recentSignals }));

    return new Response(null, { status: 101, webSocket: client });
  }

  async broadcast(signal: Signal) {
    // Store in recent signals
    const recent = await this.state.storage.get('recentSignals') || [];
    recent.unshift(signal);
    if (recent.length > 100) recent.pop();
    await this.state.storage.put('recentSignals', recent);

    // Broadcast to matching sessions
    for (const [ws, session] of this.sessions) {
      if (session.tenantId === signal.tenantId) {
        ws.send(JSON.stringify({ type: 'signal', data: signal }));
      }
    }
  }
}
```

```toml
# wrangler.toml
[durable_objects]
bindings = [
  { name = "SIGNAL_STREAM", class_name = "SignalStreamDO" }
]

[[migrations]]
tag = "v1"
new_classes = ["SignalStreamDO"]
```

### Queues - Async Processing

For webhook processing, email sending, report generation:

```toml
# wrangler.toml
[[queues.producers]]
queue = "webhook-ingress"
binding = "WEBHOOK_QUEUE"

[[queues.producers]]
queue = "signal-processing"
binding = "SIGNAL_QUEUE"

[[queues.consumers]]
queue = "webhook-ingress"
max_batch_size = 10
max_batch_timeout = 30
```

```typescript
// Webhook producer
export default {
  async fetch(request: Request, env: Env) {
    const webhook = await request.json();
    
    // Enqueue for async processing
    await env.WEBHOOK_QUEUE.send({
      source: webhook.source,
      event: webhook.event,
      payload: webhook.payload,
      receivedAt: new Date().toISOString()
    });
    
    return new Response('Accepted', { status: 202 });
  }
};

// Queue consumer
export default {
  async queue(batch: MessageBatch, env: Env) {
    for (const message of batch.messages) {
      try {
        const webhook = message.body;
        
        // Process based on source
        switch (webhook.source) {
          case 'hubspot':
            await processHubSpotWebhook(env, webhook);
            break;
          case 'stripe':
            await processStripeWebhook(env, webhook);
            break;
          // ...
        }
        
        message.ack();
      } catch (error) {
        message.retry();
      }
    }
  }
};
```

---

## Security & Access

### Cloudflare Access - Zero Trust

Protect admin routes and sensitive APIs:

```typescript
// Verify Access JWT
async function verifyAccessJWT(request: Request, env: Env) {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;

  // Verify with Access
  const response = await fetch(
    `https://${env.CF_TEAM_DOMAIN}/cdn-cgi/access/get-identity`,
    { headers: { Cookie: `CF_Authorization=${jwt}` } }
  );

  if (!response.ok) return null;
  return await response.json();
}

// Middleware
export async function authMiddleware(c: Context, next: Next) {
  const identity = await verifyAccessJWT(c.req.raw, c.env);
  
  if (!identity) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('user', identity);
  await next();
}
```

### Turnstile - Bot Protection

```typescript
// Verify Turnstile token
async function verifyTurnstile(token: string, env: Env) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token
      })
    }
  );
  
  const result = await response.json();
  return result.success;
}
```

---

## Development Workflow

### Local Development with Miniflare

```bash
# Run local dev server with full Cloudflare emulation
pnpm wrangler dev --local --persist

# With D1, KV, R2, Vectorize emulation
pnpm wrangler dev --local --persist-to=.wrangler/state
```

### Project Structure

```
services/
├── gateway/           # API Gateway Worker
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   └── middleware/
│   └── wrangler.toml
├── spine/             # Data Layer Worker
│   ├── src/
│   │   ├── index.ts
│   │   ├── queries/
│   │   └── schema.sql
│   └── wrangler.toml
├── think/             # Intelligence Worker
│   ├── src/
│   │   ├── index.ts
│   │   ├── signals/
│   │   └── predictions/
│   └── wrangler.toml
├── durable-objects/   # Stateful Objects
│   ├── signal-stream.ts
│   └── rate-limiter.ts
├── workflows/         # Long-running Jobs
│   ├── crm-sync.ts
│   ├── report-generator.ts
│   └── signal-aggregator.ts
└── shared/            # Shared Types & Utils
    ├── types/
    └── utils/
```

### wrangler.toml Template (Full Stack)

```toml
name = "integratewise-{service}"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# Smart Placement for lowest latency
[placement]
mode = "smart"

# Environment variables
[vars]
ENVIRONMENT = "development"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "integratewise-core"
database_id = "local"

# KV Namespaces
[[kv_namespaces]]
binding = "CONFIG"
id = "config-ns-id"

[[kv_namespaces]]
binding = "CACHE"
id = "cache-ns-id"

# R2 Buckets
[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "integratewise-documents"

# Vectorize
[[vectorize]]
binding = "VECTORS"
index_name = "integratewise-knowledge"

# Hyperdrive (Neon connection)
[[hyperdrive]]
binding = "NEON_DB"
id = "hyperdrive-id"

# Workers AI
[ai]
binding = "AI"

# Queues
[[queues.producers]]
queue = "signal-processing"
binding = "SIGNAL_QUEUE"

# Durable Objects
[durable_objects]
bindings = [
  { name = "SIGNAL_STREAM", class_name = "SignalStreamDO" }
]

[[migrations]]
tag = "v1"
new_classes = ["SignalStreamDO"]

# Analytics Engine
[[analytics_engine_datasets]]
binding = "ANALYTICS"
dataset = "integratewise-telemetry"

# Observability
[observability]
enabled = true

[observability.logs]
enabled = true
head_sampling_rate = 1

# Production Environment
[env.production]
name = "integratewise-{service}"
vars = { ENVIRONMENT = "production" }
routes = [
  { pattern = "{service}.integratewise.ai/*", zone_name = "integratewise.ai" }
]

# Staging Environment  
[env.staging]
name = "integratewise-{service}-staging"
vars = { ENVIRONMENT = "staging" }
routes = [
  { pattern = "{service}-staging.integratewise.ai/*", zone_name = "integratewise.ai" }
]
```

---

## Service-by-Service Implementation

### 1. Gateway Worker

**Purpose**: API routing, authentication, rate limiting

```typescript
// services/gateway/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', cors());
app.use('*', rateLimitMiddleware);
app.use('*', authMiddleware);

// Route to services
app.route('/api/spine', spineRouter);
app.route('/api/think', thinkRouter);
app.route('/api/act', actRouter);
app.route('/api/govern', governRouter);

// Health check
app.get('/health', (c) => c.json({ status: 'healthy' }));

export default app;
```

### 2. Spine Worker (Data Layer)

**Purpose**: CRUD operations, data queries, Account 360

```typescript
// services/spine/src/index.ts
import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

// Account 360 endpoint
app.get('/accounts/:id/360', async (c) => {
  const accountId = c.req.param('id');
  const tenantId = c.get('tenantId');

  // Parallel data fetch
  const [
    account,
    signals,
    stakeholders,
    contracts,
    risks
  ] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM accounts WHERE id = ? AND tenant_id = ?')
      .bind(accountId, tenantId).first(),
    c.env.DB.prepare('SELECT * FROM account_signals WHERE account_id = ? ORDER BY created_at DESC LIMIT 50')
      .bind(accountId).all(),
    c.env.DB.prepare('SELECT * FROM stakeholders WHERE account_id = ?')
      .bind(accountId).all(),
    c.env.DB.prepare('SELECT * FROM contracts WHERE account_id = ?')
      .bind(accountId).all(),
    c.env.DB.prepare('SELECT * FROM risk_registry WHERE entity_id = ? AND entity_type = ?')
      .bind(accountId, 'account').all()
  ]);

  return c.json({
    account,
    signals: signals.results,
    stakeholders: stakeholders.results,
    contracts: contracts.results,
    risks: risks.results,
    healthScore: calculateHealthScore(signals.results, risks.results)
  });
});

export default app;
```

### 3. Think Worker (Intelligence)

**Purpose**: Signal detection, predictions, AI synthesis

```typescript
// services/think/src/index.ts
import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

// Analyze communication
app.post('/analyze', async (c) => {
  const { accountId, content, contentType } = await c.req.json();

  // 1. Generate embedding
  const embedding = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [content]
  });

  // 2. Find similar past signals
  const similar = await c.env.VECTORS.query(embedding.data[0], {
    topK: 5,
    filter: { accountId: { $eq: accountId } }
  });

  // 3. AI analysis
  const analysis = await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [
      {
        role: 'system',
        content: `Analyze this ${contentType} for customer success signals. 
        Previous similar signals: ${JSON.stringify(similar.matches)}
        Return JSON with: churn_risk, expansion_signals, competitor_mentions, urgency, recommended_actions`
      },
      { role: 'user', content }
    ]
  });

  // 4. Store signal
  const signal = {
    id: crypto.randomUUID(),
    accountId,
    content: analysis.response,
    embedding: embedding.data[0],
    confidence: calculateConfidence(analysis),
    source: contentType,
    createdAt: new Date().toISOString()
  };

  // Store in D1
  await c.env.DB.prepare(
    'INSERT INTO account_signals (id, account_id, signal_type, payload, confidence) VALUES (?, ?, ?, ?, ?)'
  ).bind(signal.id, accountId, 'analysis', JSON.stringify(signal), signal.confidence).run();

  // Store embedding in Vectorize
  await c.env.VECTORS.upsert([{
    id: signal.id,
    values: embedding.data[0],
    metadata: { accountId, type: 'signal' }
  }]);

  // Broadcast via Durable Object
  const signalStream = c.env.SIGNAL_STREAM.idFromName(c.get('tenantId'));
  await c.env.SIGNAL_STREAM.get(signalStream).fetch(new Request('http://internal', {
    method: 'POST',
    body: JSON.stringify(signal)
  }));

  return c.json(signal);
});

// Churn prediction
app.get('/predict/churn/:accountId', async (c) => {
  const accountId = c.req.param('id');
  
  // Gather all signals
  const signals = await c.env.DB.prepare(
    'SELECT * FROM account_signals WHERE account_id = ? ORDER BY created_at DESC LIMIT 100'
  ).bind(accountId).all();

  // Run prediction model
  const prediction = await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [
      {
        role: 'system',
        content: `Based on these signals, predict churn probability (0-1) with factors.
        Return JSON: { probability, factors: [{ name, impact, direction }], recommended_actions }`
      },
      { role: 'user', content: JSON.stringify(signals.results) }
    ]
  });

  return c.json(JSON.parse(prediction.response));
});

export default app;
```

---

## Cost Estimation

### Monthly Cost Breakdown (Growth Stage)

| Service | Unit | Estimated Usage | Cost |
|---------|------|-----------------|------|
| **Workers** | Requests | 50M requests | $25 |
| **D1** | Rows read/written | 100M reads, 10M writes | $25 |
| **KV** | Operations | 100M reads, 10M writes | $5 |
| **R2** | Storage + operations | 100GB, 10M operations | $2 |
| **Vectorize** | Vectors stored | 10M vectors | $50 |
| **Workers AI** | Inference | 10M tokens | $15 |
| **AI Gateway** | Requests | 1M requests | $10 |
| **Durable Objects** | Duration + requests | 10M requests | $15 |
| **Queues** | Messages | 50M messages | $20 |
| **Hyperdrive** | Connections | 10M queries | $20 |
| **Analytics Engine** | Events | 100M events | $25 |
| **Pages** | Builds + bandwidth | 100GB bandwidth | $0 (free tier) |
| **Access** | Users | 50 users | $36 |
| **Total** | | | **~$250/month** |

*Note: Costs scale with usage. Enterprise plans available for higher volumes.*

---

## Migration Roadmap

### Phase 1: Foundation (Week 1-2)

1. Set up D1 databases with schema
2. Configure Hyperdrive for Neon
3. Deploy Gateway worker
4. Set up KV for config/cache
5. Configure R2 buckets

### Phase 2: Intelligence (Week 3-4)

1. Implement Vectorize indexes
2. Deploy Think worker with AI
3. Configure AI Gateway
4. Set up signal detection pipelines

### Phase 3: Real-time (Week 5-6)

1. Implement Durable Objects for WebSockets
2. Deploy Queues for async processing
3. Set up Analytics Engine
4. Implement live Signal Strip

### Phase 4: Security & Polish (Week 7-8)

1. Configure Cloudflare Access
2. Set up Turnstile for forms
3. Implement audit logging
4. Performance optimization

---

## Related Documentation

- [UI Design System](./UI_DESIGN_SYSTEM.md)
- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [Monitoring & Alerting](./MONITORING_ALERTING.md)
- [Department Intelligence Spec](./doc.md)

---

## Commands Reference

```bash
# Development
pnpm wrangler dev --local --persist          # Local dev with emulation
pnpm wrangler d1 execute DB --local --file=schema.sql  # Run D1 migrations

# Deployment
pnpm wrangler deploy                          # Deploy to production
pnpm wrangler deploy --env staging            # Deploy to staging

# Database
pnpm wrangler d1 create integratewise-core    # Create D1 database
pnpm wrangler d1 migrations apply DB          # Apply migrations
pnpm wrangler d1 execute DB --command "SELECT * FROM accounts LIMIT 10"

# KV
pnpm wrangler kv:namespace create CONFIG      # Create namespace
pnpm wrangler kv:key put --binding CONFIG "key" "value"

# R2
pnpm wrangler r2 bucket create integratewise-documents
pnpm wrangler r2 object put documents/test.txt --file=test.txt

# Vectorize
pnpm wrangler vectorize create integratewise-knowledge --dimensions=768 --metric=cosine

# Queues
pnpm wrangler queues create webhook-ingress

# Logs
pnpm wrangler tail                            # Stream live logs
pnpm wrangler tail --env production           # Production logs
```
