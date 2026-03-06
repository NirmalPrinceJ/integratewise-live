-- IntegrateWise OS — Core Schema (v3.6)
-- Run on Supabase SQL editor (staging first, then production)
-- Architecture: Single workspace per tenant, tenant_id RLS

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT,
  plan TEXT DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  display_name TEXT,
  role TEXT DEFAULT 'member',  -- admin, member, viewer
  domain_role TEXT DEFAULT 'personal',  -- cs, revops, salesops, bizops, personal
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entities (the core of Entity360)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_type TEXT NOT NULL,  -- account, contact, deal, task, project, meeting, document
  name TEXT NOT NULL,
  slug TEXT,
  source TEXT NOT NULL,  -- hubspot, salesforce, manual, csv, mcp
  source_id TEXT,  -- ID in the source system
  data JSONB DEFAULT '{}',  -- all entity fields (normalized)
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  health_score NUMERIC(3,2),  -- 0.00 to 1.00
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_tenant ON entities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(tenant_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_entities_source ON entities(tenant_id, source, source_id);

-- Unique constraint for upsert (spine-v2 uses this)
CREATE UNIQUE INDEX IF NOT EXISTS idx_entities_source_unique
  ON entities(tenant_id, source, source_id);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT DEFAULT 'business',  -- business, personal, team
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  status TEXT DEFAULT 'active',  -- active, achieved, paused, abandoned
  due_date TIMESTAMPTZ,
  entity_refs UUID[] DEFAULT '{}',  -- linked entity IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signals (Think engine outputs)
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  signal_type TEXT NOT NULL,  -- health_change, churn_risk, engagement_drop, anomaly, opportunity
  severity TEXT NOT NULL,  -- critical, high, medium, low, info
  title TEXT NOT NULL,
  description TEXT,
  entity_id UUID REFERENCES entities(id),
  goal_refs UUID[] DEFAULT '{}',
  evidence JSONB DEFAULT '{}',  -- { source: 'spine', data: {...}, confidence: 0.85 }
  agent_id TEXT,  -- AGT-001 etc
  status TEXT DEFAULT 'active',  -- active, acknowledged, resolved, dismissed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signals_tenant ON signals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(tenant_id, status);

-- Actions (Act engine — pending + completed)
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title TEXT NOT NULL,
  action_type TEXT NOT NULL,  -- create_task, update_deal, send_message, custom
  target_tool TEXT,  -- hubspot, salesforce, slack, etc
  payload JSONB DEFAULT '{}',  -- the action parameters
  status TEXT DEFAULT 'pending',  -- pending_approval, approved, executing, completed, failed, denied
  approval_token UUID,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  result JSONB,
  signal_id UUID REFERENCES signals(id),  -- which signal triggered this
  entity_id UUID REFERENCES entities(id),
  goal_refs UUID[] DEFAULT '{}',
  agent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connectors (connected tools)
CREATE TABLE IF NOT EXISTS connectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  tool_name TEXT NOT NULL,  -- hubspot, salesforce, slack, etc
  auth_type TEXT NOT NULL,  -- oauth2, api_key, webhook
  status TEXT DEFAULT 'active',  -- active, paused, error, disconnected
  config JSONB DEFAULT '{}',  -- tool-specific config (NO secrets here — those go to Doppler)
  last_sync_at TIMESTAMPTZ,
  sync_cursor TEXT,  -- last sync position
  entity_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (immutable — Operations Store)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID,
  action TEXT NOT NULL,  -- entity.created, signal.generated, action.approved, connector.synced
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  source TEXT,  -- pipeline, think, act, govern, user, mcp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_log(tenant_id, created_at DESC);

-- Knowledge entries (AI sessions, documents, notes)
CREATE TABLE IF NOT EXISTS knowledge_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES auth.users(id),
  entry_type TEXT NOT NULL,  -- ai_session, document, note, meeting_summary
  title TEXT,
  content TEXT,  -- summary text (never full transcripts for ai_session)
  source TEXT,  -- claude, chatgpt, upload, manual
  entity_refs UUID[] DEFAULT '{}',
  goal_refs UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  embedding vector(1536),  -- for semantic search
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_tenant ON knowledge_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON knowledge_entries
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Pipeline processing log (tracks what's going through the pipeline)
CREATE TABLE IF NOT EXISTS pipeline_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  trace_id UUID NOT NULL,  -- groups all stages for one payload
  stage TEXT NOT NULL,  -- analyze, classify, filter, refine, extract, validate, sanity, sectorize
  status TEXT NOT NULL,  -- processing, completed, failed, filtered, quarantined
  source TEXT,  -- hubspot, csv, mcp, etc
  payload_summary JSONB,  -- minimal info (not full payload)
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (single workspace — tenant_id only)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy template (apply to every table above)
-- The Worker sets: SET LOCAL app.tenant_id = '<tenant_uuid>';
-- This single policy handles all tenant isolation

CREATE POLICY tenant_isolation ON entities
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON goals
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON signals
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON actions
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON connectors
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON audit_log
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON knowledge_entries
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY tenant_isolation ON pipeline_log
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Realtime subscriptions (for frontend live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE entities;
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE actions;
ALTER PUBLICATION supabase_realtime ADD TABLE connectors;
