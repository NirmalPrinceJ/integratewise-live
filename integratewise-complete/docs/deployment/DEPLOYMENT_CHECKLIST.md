# Deployment Checklist: Adaptive Spine Implementation (L3 Layer)

## IntegrateWise OS Architecture

**L0 (Reality)** → **L3 (Truth & Learning)** ← You are deploying this → **L2 (Intelligence)** → **L1 (Work)**

This deployment focuses on **L3 (Adaptive Spine)**: the truth & learning layer that normalizes L0 reality into SSOT, observes schema, computes readiness, and signals L1 module unlock.

---

## ✅ Completed
- [x] SQL migrations created (032-035: Department streams, Accounts Intelligence, Progressive, Adaptive registry)
- [x] Loader service (loader-service.ts) wired with adaptive field observation
- [x] Connector manager service configured (connector-manager-service.ts)
- [x] Wrangler configurations created (wrangler.loader.toml, wrangler.connector.toml)
- [x] File upload UI wired to loader endpoint (add-bucket-modal.tsx)
- [x] ModuleGuard access control implemented

## 🔄 Current Task: Deploy & Test End-to-End

### Phase 1: Database Migrations
**Status**: Ready to execute
**Command**:
```bash
cd /Users/nirmal/Github/brainstroming

# Using Neon connection
export DATABASE_URL="postgresql://neondb_owner:npg_lPt4jLcO5dei@ep-broad-waterfall-ahejsgy6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run individual migrations (if psql available)
psql "$DATABASE_URL" -f sql-migrations/032_spine_department_streams.sql
psql "$DATABASE_URL" -f sql-migrations/033_spine_accounts_intelligence.sql
psql "$DATABASE_URL" -f sql-migrations/034_spine_progressive_universal.sql
psql "$DATABASE_URL" -f sql-migrations/035_spine_adaptive_registry.sql

# Or use Node.js script
node run-new-migrations.mjs
```

**Expected Result**: 4 new migration files applied, ~35+ new tables created in Neon

---

### Phase 2: Deploy Cloudflare Workers

#### Step 1: Authenticate Wrangler
```bash
cd /Users/nirmal/Github/brainstroming/services/cloudflare-workers

# Login to Cloudflare (opens browser)
wrangler login
```

#### Step 2: Set Secrets for Loader Worker
```bash
# Navigate to loader worker directory
cd /Users/nirmal/Github/brainstroming/services/cloudflare-workers

# Set database connection
wrangler secret put NEON_DB_URL --config wrangler.loader.toml
# Paste: postgresql://neondb_owner:npg_lPt4jLcO5dei@ep-broad-waterfall-ahejsgy6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Set bucket signing secret (for security)
wrangler secret put BUCKET_SIGNING_SECRET --config wrangler.loader.toml
# Paste: (generate a random string, e.g., openssl rand -hex 32)
```

#### Step 3: Deploy Loader Worker
```bash
wrangler deploy --config wrangler.loader.toml
# Output will show: ✨ Uploaded integratewise-loader (0.00 MiB)
#                  ✨ Published integratewise-loader
#                  🔗 https://integratewise-loader.YOUR_ACCOUNT.workers.dev
```

#### Step 4: Set Secrets for Connector Manager
```bash
wrangler secret put NEON_DB_URL --config wrangler.connector.toml
# Same as above

wrangler secret put CONNECTOR_ENCRYPTION_KEY --config wrangler.connector.toml
# Generate: openssl rand -hex 32

wrangler secret put CONNECTOR_CALLBACK_URL --config wrangler.connector.toml
# Paste: https://your-domain.com/api/connectors/callback

# OAuth secrets (get from provider dashboards)
wrangler secret put SALESFORCE_CLIENT_ID --config wrangler.connector.toml
wrangler secret put SALESFORCE_CLIENT_SECRET --config wrangler.connector.toml
# ... (repeat for Google, Slack, HubSpot)
```

#### Step 5: Deploy Connector Manager
```bash
wrangler deploy --config wrangler.connector.toml
# Output will show deployed URL
```

---

### Phase 3: Configure Frontend Environment

Update `/Users/nirmal/Github/brainstroming/.env.local`:
```
# Add these (replace with actual worker URLs)
NEXT_PUBLIC_LOADER_URL=https://integratewise-loader.YOUR_ACCOUNT.workers.dev
NEXT_PUBLIC_CONNECTOR_URL=https://integratewise-connector-manager.YOUR_ACCOUNT.workers.dev
```

---

### Phase 4: Populate Expected Fields (Completeness Scoring)

Run these SQL inserts to enable completeness scoring:
```sql
-- Insert expected fields for each bucket type
INSERT INTO spine_expected_fields (entity_type, scope_level, required_fields, expected_fields)
VALUES
  ('task', 'L1', ARRAY['task_id', 'title', 'status'], ARRAY['task_id', 'title', 'description', 'status', 'priority', 'assigned_to', 'due_date']),
  ('meeting', 'L1', ARRAY['event_id', 'title', 'start_time'], ARRAY['event_id', 'title', 'start_time', 'end_time', 'participants', 'location']),
  ('document', 'L1', ARRAY['doc_id', 'title'], ARRAY['doc_id', 'title', 'content', 'category', 'owner']),
  ('account', 'L1', ARRAY['account_id', 'name'], ARRAY['account_id', 'name', 'industry', 'website', 'annual_revenue']),
  ('contact', 'L1', ARRAY['contact_id', 'name'], ARRAY['contact_id', 'name', 'email', 'phone', 'title']),
  ('opportunity', 'L2', ARRAY['opp_id', 'account_id', 'amount'], ARRAY['opp_id', 'account_id', 'amount', 'stage', 'close_date']),
  ('renewal', 'L2', ARRAY['renewal_id', 'account_id'], ARRAY['renewal_id', 'account_id', 'contract_value', 'renewal_date']),
  ('risk', 'L2', ARRAY['risk_id', 'account_id'], ARRAY['risk_id', 'account_id', 'risk_type', 'probability', 'impact']);
-- ... continue for other entities
```

---

### Phase 5: End-to-End Test

**Scenario: Upload CSV to Bucket B3 (Documents)**

1. **Navigate to**: `/setup/buckets`
2. **Click**: "Add" on B3 bucket (or any bucket)
3. **Select**: "Upload CSV"
4. **Upload**: Sample CSV with document records
   ```csv
   doc_id,title,content,category,owner,is_public
   doc-001,Q1 Review,Review of Q1 performance,strategy,alice@integratewise.com,true
   doc-002,API Spec,REST API documentation,technical,bob@integratewise.com,false
   ```
5. **Expected Flow**:
   - POST to `NEXT_PUBLIC_LOADER_URL/loader/ingest` with tenant_id, bucket_type
   - Loader extracts CSV → normalizes to SSOT schema → observes fields
   - `record_spine_field_observation()` calls populate `spine_schema_registry`
   - B3 state transitions: OFF → ADDING → SEEDED
   - Check: `SELECT * FROM spine_schema_registry WHERE entity_type = 'document'`
   - Verify: field names/types recorded (title: 'string', content: 'text', etc.)

6. **Verify Completeness**:
   ```sql
   SELECT entity_type, completeness_score, missing_fields 
   FROM spine_entity_completeness
   WHERE entity_type = 'document';
   -- Should show: completeness_score = 85-100% (depending on matched fields)
   ```

7. **Unlock L1**: Once bucket SEEDED, ModuleGuard allows access
   - Navigate to `/documents` or relevant L1 page
   - Verify data displays correctly

---

## 📋 Implementation Details

### New Tables Created by Migrations

**032_spine_department_streams.sql**:
- spine_opportunities, spine_renewals, spine_risks, spine_incidents, spine_changes, spine_campaigns, spine_content, spine_invoices, spine_expenses, spine_approvals, spine_contracts, spine_vendors, spine_requests

**033_spine_accounts_intelligence.sql**:
- spine_people, spine_business_context, spine_strategic_objectives, spine_capabilities, spine_value_streams, spine_api_portfolio, spine_platform_metrics, spine_initiatives, spine_technical_debt, spine_stakeholder_outcomes, spine_engagements, spine_success_plans, spine_insights

**034_spine_progressive_universal.sql**:
- spine_entity_core, spine_entity_layers, spine_entity_attributes, spine_entity_links, spine_entity_metrics, v_spine_universal_progressive

**035_spine_adaptive_registry.sql**:
- spine_schema_registry, spine_expected_fields, spine_entity_completeness
- Functions: record_spine_field_observation(), compute_spine_completeness()

### Key Functions

**Adaptive Observation** (in loader-service.ts):
```typescript
// Samples 25 records from upload
// For each field, records: field_name, data_type, sample_value
// Called during POST /loader/ingest after normalization
// Non-blocking: wrapper in try/catch prevents failures from blocking upload
```

**Completeness Scoring** (in SQL functions):
```sql
-- Compares observed fields against expected_fields template
-- Calculates: (matching_fields / expected_fields) * 100
-- Identifies: missing_fields for user awareness
```

---

## ⚠️ Notes

- **Network Issue**: Current machine has DNS issues connecting to Neon directly
  - Workaround: Run migrations from CI/CD or directly in Neon console
  
- **Secrets Management**: 
  - Never commit secrets to Git
  - Use Wrangler's `secret put` command (stored securely in Cloudflare)
  
- **Testing**: 
  - Use `npm run dev` to test Loader locally before deploying
  - Use `F5` debugging in VS Code with agent-inspector for tracing

- **Monitoring**:
  - Check `/tracing` endpoint for field observation details
  - View completeness scores in Neon console

---

## 🚀 Next Steps

1. **[If migrations haven't run]**: Execute Phase 1 from Cloudflare console or CI/CD
2. **[Do Phase 2-5]**: Deploy workers, configure secrets, test end-to-end
3. **[Post-test]**: Populate spine_expected_fields with your specific data model
4. **[Integration]**: Connect to n8n for recurring sync jobs

---

**Last Updated**: 2026-02-08
**Status**: Ready for deployment (migrations pending DB connectivity)
