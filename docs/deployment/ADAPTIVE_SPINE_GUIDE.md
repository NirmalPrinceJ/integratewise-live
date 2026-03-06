# Adaptive Spine Implementation: Complete Summary

## 🎯 What Is This?

The Adaptive Spine is **L3 (Truth & Learning Layer)** of IntegrateWise OS — a self-discovering schema system that transforms raw reality (L0) into structured, learnable truth.

### It Does Three Things:

1. **Accepts Reality** (from L0)
   - User uploads (CSV, JSON, PDF)
   - External APIs (Salesforce, Google, Slack)
   - Manual entries, webhooks, events

2. **Learns & Structures** (L3 Core)
   - Normalizes to SSOT (Single Source of Truth)
   - Observes fields automatically during ingestion
   - Records metadata (field types, completeness, maturity)
   - Computes readiness signals for L1 unlock

3. **Emits Readiness** (to L2 & L1)
   - Bucket state transitions (OFF → ADDING → SEEDED → LIVE)
   - Completeness scores (e.g., "85% of accounts have email")
   - Schema observations (what fields exist, their types)
   - Access unlock signals (departments can enter L1 workspace)

### Why L3 Matters

**Without L3**: Rigid schemas break when reality is messy. Incomplete data blocks work. AI hallucinates without truth.

**With L3 (Adaptive Spine)**: System learns from your actual data, shows completeness gaps, unlocks work progressively, and gives L2 (AI) a reliable knowledge substrate.

### The Promise

> **L3 unlocks L1 work modules only when your truth is ready — and provides L2 intelligence with structured, observable reality.**

---

## 📊 IntegrateWise OS Architecture (Canonical Model)

> **See [docs/CANONICAL_OS_LAYER_MODEL.md](docs/CANONICAL_OS_LAYER_MODEL.md) for the complete, locked layer specification.**

### The Four Layers

**L0 — Onboarding Layer** (Reality Introduction + Intent Declaration)
- **What**: How reality ENTERS the OS — not runtime work
- **Contains**: Bucket creation (intent), data source onboarding, schema expectation seeding, setup flows
- **Rule**: L0 declares intent and introduces reality, but never learns, stores truth, or executes work
- **Output**: Handoff signals to L3 (ONBOARDING_COMPLETE, SOURCE_CONNECTED, DATA_AVAILABLE)

**L3 — Adaptive Spine** (Truth + Learning + Readiness Physics)
- **What**: Where raw reality becomes SSOT truth + becomes learnable
- **Contains**: Truth Engine, Learning Engine, Readiness Engine, Capability Unlock Engine
- **Rule**: L3 learns and structures — but never renders UI. L3 gates L1 and fuels L2
- **Output**: Structured truth + schema observations + readiness signals (BUCKET_SEEDED, COMPLETENESS_MET)

**L2 — Cognitive Brain** (Reason + Decision + Safe Automation)
- **What**: Where truth becomes meaning + decisions + actions (awaiting approval)
- **Contains**: Evidence Fabric, Signal Engine, Insight Engine, Policy Brain, Agent Colony, Decision Memory, Trust Engine, Simulation Engine
- **Rule**: L2 must always be explainable + evidence-linked + approval-gated. L2 never sees L0 intent, only L3 truth
- **Output**: Insights, recommendations, queued actions, audit-ready reasoning

**L1 — Work Layer** (Bucket-Driven Human Work Execution)
- **What**: Where humans do work — born from buckets, sustained by Adaptive Spine
- **Contains**: Business/CSM/Personal views, operational pages (Accounts, Tasks, Deals, Risks, Docs)
- **Rule**: L1 does not exist until L3 says it can. No empty dashboards, no premature automation
- **Output**: Execution, collaboration, outcomes → creates new L0 events

### The IntegrateWise Loop

```
L0 (Onboard) → L3 (Learn Truth) → L2 (Reason/Decide) → L1 (Execute) → L0 (New Reality)
```

### Core Definitions

| Layer | Formula |
|-------|---------|
| L0 | Onboarding + Reality Introduction + Capability Intent Declaration |
| L3 | Adaptive Spine = Truth + Learning + Readiness Physics |
| L2 | Cognitive Brain = Reason + Decision + Safe Automation |
| L1 | Bucket-Driven Human Work Execution |

### Core Promise

**L0 introduces reality, L3 understands it, L2 reasons about it, and L1 lets humans act on it.**

Powered by Adaptive Spine.

---

## 🔄 Adaptive Spine Data Flow (L0→L3→L2→L1)

```
L0: User Action
├─ Upload CSV/JSON/PDF to bucket
├─ OAuth connect (Salesforce, Google, etc.)
└─ Manual entry

    ↓

L3: Loader Service (CloudflareWorker)
├─ Extract records from file/API
├─ Normalize to SSOT schema
└─ Observe fields (TYPE, value sample)

    ↓

L3: Adaptive Registry (PostgreSQL/Neon)
├─ spine_schema_registry ← field observations
├─ spine_expected_fields ← completeness templates
├─ spine_entity_completeness ← computed scores
└─ Functions: record_spine_field_observation(), compute_spine_completeness()

    ↓

L3: Bucket State Update + Readiness Signals
├─ ADDING → SEEDED (at least 1 entity)
├─ SEEDED → LIVE (if continuous sync)
└─ Emit: Readiness signals for L2 + L1

    ↓

L2: Cognitive Intelligence (when invoked via ⌘J)
├─ Evidence Drawer shows context from L3
├─ Think analyzes structured truth
├─ Governance validates policies
└─ Output: Insights + recommended actions (approval-gated)

    ↓

L1: Module Unlock + Work Surfaces
├─ ModuleGuard checks L3 bucket state
├─ Departments unlock when requirements met
└─ Display: Pure work views with L2 insights on-demand
```

---

## 📁 Project Structure

```
sql-migrations/
├─ 032_spine_department_streams.sql ... Department-specific entities
├─ 033_spine_accounts_intelligence.sql ... Complex business entities
├─ 034_spine_progressive_universal.sql ... Progressive L1/L2/L3 layers
└─ 035_spine_adaptive_registry.sql ... Field observation + completeness

services/cloudflare-workers/
├─ loader-service.ts ... File extraction + normalization + observation
├─ connector-manager-service.ts ... OAuth + data sync
├─ wrangler.loader.toml ... Worker config (prod: Cloudflare)
└─ wrangler.connector.toml ... Worker config (prod: Cloudflare)

src/
├─ components/buckets/add-bucket-modal.tsx ... File upload UI
├─ hooks/useBucketAccess.ts ... ModuleGuard access control
└─ lib/tenant-context.ts ... Database operations

Root Scripts
├─ deploy.sh ... Automated deployment (interactive)
├─ run-new-migrations.mjs ... Run migrations programmatically
└─ verify-deployment.mjs ... Check all components healthy
```

---

## 🚀 Deployment Steps

### Quick Start (5 minutes)

**Option A: Automated**
```bash
cd /Users/nirmal/Github/brainstroming
./deploy.sh
# Follow prompts for secrets
```

**Option B: Manual**

#### 1. Get Neon Connection String
From Neon console: Project → Connections → Connection String
```
postgresql://neondb_owner:<PASSWORD>@ep-broad-waterfall.<REGION>.aws.neon.tech/neondb?sslmode=require
```

#### 2. Run Migrations
```bash
# Using Node.js migration runner
node run-new-migrations.mjs

# Or using psql directly
export DATABASE_URL="postgresql://..."
psql "$DATABASE_URL" -f sql-migrations/032_spine_department_streams.sql
psql "$DATABASE_URL" -f sql-migrations/033_spine_accounts_intelligence.sql
psql "$DATABASE_URL" -f sql-migrations/034_spine_progressive_universal.sql
psql "$DATABASE_URL" -f sql-migrations/035_spine_adaptive_registry.sql
```

#### 3. Deploy Workers
```bash
cd services/cloudflare-workers

# Authenticate
wrangler login

# Set Neon secrets
wrangler secret put NEON_DB_URL --config wrangler.loader.toml
# Paste: postgresql://...

# Deploy
wrangler deploy --config wrangler.loader.toml
wrangler deploy --config wrangler.connector.toml
```

#### 4. Update Frontend
Edit `.env.local`:
```bash
NEXT_PUBLIC_LOADER_URL=https://integratewise-loader.YOUR_ACCOUNT.workers.dev
NEXT_PUBLIC_CONNECTOR_URL=https://integratewise-connector-manager.YOUR_ACCOUNT.workers.dev
```

#### 5. Verify
```bash
node verify-deployment.mjs
```

---

## 🧪 End-to-End Testing

### Scenario: Upload CSV to Organize Customer Accounts

**Setup**:
- Neon DB running with migrations applied
- Loader + Connector workers deployed
- `.env.local` configured with worker URLs

**Test Steps**:

1. **Navigate to Dashboard**
   ```
   http://localhost:3000/setup/buckets
   ```

2. **Click "Add" on B5 (CRM bucket)**
   - Select: "Upload CSV"

3. **Create & Upload Sample CSV**
   ```
   account_id,account_name,industry,website,annual_revenue,contact_email,contact_phone
   ACC-001,Acme Corp,Technology,acme.com,5000000,alice@acme.com,555-1234
   ACC-002,TechStart Inc,SaaS,techstart.io,2000000,bob@techstart.io,555-5678
   ACC-003,Global Solutions,Consulting,,1500000,carol@global.com,
   ```

4. **Loader processes file**
   - Request: `POST /loader/ingest`
     ```json
     {
       "tenantId": "your-tenant",
       "bucketType": "B5",
       "fileType": "csv",
       "records": [...]
     }
     ```
   - Loader runs:
     1. Extract CSV → 3 records
     2. Normalize to B5 schema
     3. **Observe fields**: account_id (uuid), account_name (string), industry (string), etc.
     4. Store in spine_account table
     5. Update bucket: ADDING → SEEDED

5. **Check Registry**
   ```sql
   SELECT field_name, data_type, sample_value, observed_count
   FROM spine_schema_registry
   WHERE entity_type = 'account'
   ORDER BY last_observed DESC;
   ```
   **Expected output**:
   ```
   field_name         | data_type | sample_value      | observed_count
   account_id         | uuid      | ACC-001           | 3
   account_name       | text      | Acme Corp         | 3
   industry           | text      | Technology        | 2
   annual_revenue     | numeric   | 5000000           | 3
   website            | text      | acme.com          | 2
   contact_email      | email     | alice@acme.com    | 3
   contact_phone      | text      | 555-1234          | 1
   ```

6. **Check Completeness**
   ```sql
   SELECT entity_type, completeness_score, missing_fields
   FROM spine_entity_completeness
   WHERE entity_type = 'account';
   ```
   **Expected output**:
   ```
   entity_type | completeness_score | missing_fields
   account     | 85                 | {website, contact_phone}
   ```

7. **Unlock L1 Module**
   - Check: `useDepartmentAccess('sales')` → isUnlocked: true
   - Navigate: `/sales/accounts`
   - Display: 3 accounts with completeness indicators

---

## 🔑 Key Features Implemented

### 1. **Automatic Field Discovery**
- During upload, system scans all fields in each record
- Detects: field name, data type (string, number, date, uuid, email, array, object)
- Records sample value for preview

### 2. **Completeness Scoring**
```sql
-- Called after observations
SELECT compute_spine_completeness();
-- Result: Compares observed vs. expected fields
-- Output: completeness_score (0-100), missing_fields array
```

### 3. **Progressive Access Control**
```typescript
// In L1 module page
<ModuleGuard requiredBuckets={['B1', 'B5']} moduleName="Accounts">
  <AccountsGrid />
</ModuleGuard>

// ModuleGuard:
// - Checks if B1 + B5 are SEEDED
// - If not: Shows locked UI with "Complete Setup" CTA
// - If yes: Renders component
```

### 4. **Adaptive Observations**
```typescript
// In loader-service.ts
async function observeAdaptiveFields(dbUrl, tenantId, bucketType, records) {
  // Sample 25 records (or all if < 25)
  const sample = records.slice(0, 25);
  
  // For each field in each record
  for (const record of sample) {
    for (const [fieldName, value] of Object.entries(record)) {
      const dataType = getFieldType(value); // 'string', 'number', 'date', etc.
      const sampleValue = getSampleValue(value);
      
      // Record observation
      await sql`
        SELECT record_spine_field_observation(
          ${tenantId},
          ${bucketType},
          ${fieldName},
          ${dataType},
          ${sampleValue}
        )
      `;
    }
  }
}
```

### 5. **Department Requirements**
```javascript
// Defined in useBucketAccess hook
{
  sales: { requires: ['B1', 'B5'], unlocks: ['accounts', 'contacts', 'opportunities'] },
  csm: { requires: ['B1', 'B5', 'B2'], unlocks: ['renewals', 'risks', 'stakeholders'] },
  // ... more departments
}
```

---

## 💾 Database Schema

### spine_schema_registry
Tracks all observed fields:
```sql
CREATE TABLE spine_schema_registry (
  id SERIAL PRIMARY KEY,
  tenant_id UUID,
  entity_type TEXT,
  field_name TEXT,
  data_type TEXT, -- 'string', 'number', 'date', 'uuid', 'email', 'array', 'object'
  sample_value TEXT,
  observed_count INT,
  last_observed TIMESTAMP
);
```

### spine_expected_fields
Templates for completeness scoring:
```sql
CREATE TABLE spine_expected_fields (
  id SERIAL PRIMARY KEY,
  tenant_id UUID,
  entity_type TEXT,
  layer_level TEXT, -- 'L1', 'L2', 'L3'
  required_fields TEXT[], -- Must-have fields
  expected_fields TEXT[], -- Nice-to-have fields
  created_at TIMESTAMP
);
```

### spine_entity_completeness
Computed completeness scores:
```sql
CREATE TABLE spine_entity_completeness (
  id SERIAL PRIMARY KEY,
  tenant_id UUID,
  entity_type TEXT,
  completeness_score INT, -- 0-100
  missing_fields TEXT[],
  last_computed TIMESTAMP
);
```

---

## 🔄 Data Flow Example

**User uploads CSV → Complete Flow**

```
1. User: Uploads "accounts.csv" to B5 bucket
   POST /setup/buckets → AddBucketModal
   
2. Frontend: Extracts tenant_id from session
   tenant_id = "550e8400-e29b-41d4-a716-446655440000"
   
3. Frontend: POSTs to loader
   POST NEXT_PUBLIC_LOADER_URL/loader/ingest {
     tenantId: "550e8400...",
     bucketType: "B5",
     fileType: "csv",
     fileName: "accounts.csv",
     file: <File object>
   }
   
4. Loader Worker (Cloudflare):
   a) Extract: Parse CSV → 150 records
   b) Normalize: Map to { account_id, account_name, ... }
   c) Observe: Call record_spine_field_observation() for first 25 records
   d) Store: INSERT INTO spine_account (...)
   e) Update: PATCH /api/buckets/B5 { state: "SEEDED" }
   
5. Adaptive Registry (Neon):
   - Fields recorded: account_id (uuid), account_name (text), ...
   - Observations stored: 150 records scanned, 7-10 field variants
   
6. Completeness Calculated:
   - Expected: [account_id, account_name, industry, revenue, email]
   - Observed: [account_id, account_name, industry, email] (missing revenue)
   - Score: 80%
   
7. Frontend: B5 bucket now shows:
   - State: SEEDED
   - Progress: 100%
   - Entity count: 150
   - Completeness: 80% average
   
8. Access Unlock: If department requires B5, now Sales gets access:
   - /sales/accounts page unlocks
   - Display data from spine_account
```

---

## 🛠 Troubleshooting

### Problem: "Module not found: @neondatabase/serverless"
**Solution**: Run `pnpm install`
```bash
cd /Users/nirmal/Github/brainstroming
pnpm install
```

### Problem: Loader worker not responding
**Solution**: Check it's deployed and secrets are set
```bash
wrangler deployments list --config wrangler.loader.toml
wrangler secret list --config wrangler.loader.toml
```

### Problem: No field observations in registry
**Solution**: Ensure migrations ran successfully
```sql
SELECT COUNT(*) FROM spine_schema_registry;
-- Should be > 0 after first upload
```

### Problem: ModuleGuard still shows locked
**Solution**: Bucket must be in SEEDED state
```sql
SELECT bucket_type, state FROM base_buckets WHERE bucket_type = 'B5';
-- Should show state = 'SEEDED'
```

---

## 📚 Related Documentation

- **DEPLOYMENT_CHECKLIST.md** — Step-by-step deployment guide
- **BUCKETS_IMPLEMENTATION.md** — Bucket system details
- **docs/ARCHITECTURE_OVERVIEW.md** — Full architecture
- **SQL Migrations** — See comments in sql-migrations/03*.sql

---

## 🎓 Learning Outcomes

After implementing this, you'll understand:

1. **Adaptive Schemas** — How to build systems that learn from data
2. **Observability** — Tracking what fields exist without rigid schemas
3. **Progressive Unlocking** — Gating features based on data readiness
4. **Field Type Detection** — Inferring data types from values
5. **Completeness Scoring** — Measuring data quality systematically
6. **Serverless Architecture** — Using Cloudflare Workers for ETL

---

## 📞 Support

For issues or questions:
1. Check DEPLOYMENT_CHECKLIST.md
2. Review SQL migration comments
3. Check loader-service.ts observeAdaptiveFields() logic
4. Enable tracing via `/tracing` endpoint

---

**Last Updated**: 2026-02-08
**Status**: 🟢 Ready for deployment
