-- ============================================
-- Buckets System - Progressive Activation
-- ============================================

-- 1. Bucket Requirements (Configuration)
CREATE TABLE bucket_requirements (
    bucket_type VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    
    -- Unlock conditions
    min_entities JSONB DEFAULT '{}',  -- { "task": 5, "doc": 3 }
    
    -- Supported seed methods
    seed_methods TEXT[] DEFAULT ARRAY['manual', 'upload', 'connector'],
    
    -- Which L1 modules unlock when SEEDED or LIVE
    unlocks_modules TEXT[] NOT NULL,
    
    -- Optional: required to reach LIVE
    required_connectors TEXT[] DEFAULT ARRAY[]::TEXT[],
    available_connectors TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    is_required BOOLEAN DEFAULT false,
    is_optional BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Buckets (State Tracking)
CREATE TABLE buckets (
    bucket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    bucket_type VARCHAR(50) NOT NULL REFERENCES bucket_requirements(bucket_type),
    
    -- State machine: OFF → ADDING → SEEDED → LIVE
    state VARCHAR(20) DEFAULT 'OFF' CHECK (state IN ('OFF', 'ADDING', 'SEEDED', 'LIVE', 'ERROR', 'PAUSED')),
    
    -- How it was seeded
    seed_method VARCHAR(20) CHECK (seed_method IN ('manual', 'upload', 'connector', 'migration')),
    
    -- Connector info (if seed_method = 'connector')
    connected_source VARCHAR(100),  -- 'salesforce', 'google_calendar', 'notion', etc.
    connector_status VARCHAR(20),    -- 'connected', 'disconnected', 'auth_expired', 'error'
    connector_config JSONB,          -- { "auth_token": "...", "org_id": "...", etc. }
    
    -- Sync tracking
    last_sync_at TIMESTAMP,
    next_sync_at TIMESTAMP,
    sync_frequency VARCHAR(20) DEFAULT 'daily',  -- 'manual', 'hourly', 'daily', 'weekly'
    
    -- Error handling
    error_code VARCHAR(100),
    error_message TEXT,
    error_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    
    UNIQUE(tenant_id, bucket_type)
);

-- 3. Bucket Progress (Computed Counts)
CREATE TABLE bucket_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES buckets(bucket_id) ON DELETE CASCADE,
    
    -- Entity counts
    task_count INTEGER DEFAULT 0,
    doc_count INTEGER DEFAULT 0,
    account_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    event_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    
    -- Overall progress
    progress_percent INTEGER DEFAULT 0,
    is_ready BOOLEAN DEFAULT false,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(bucket_id)
);

-- 4. Bucket Ingestion Log (Track data loads)
CREATE TABLE bucket_ingestion_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES buckets(bucket_id) ON DELETE CASCADE,
    
    -- Ingestion details
    ingestion_type VARCHAR(20) CHECK (ingestion_type IN ('manual', 'upload', 'connector_sync', 'migration')),
    source_type VARCHAR(50),  -- 'csv', 'json', 'pdf', 'api_sync', etc.
    source_url VARCHAR(500),   -- file path or API endpoint
    
    -- Results
    status VARCHAR(20) CHECK (status IN ('started', 'normalizing', 'syncing', 'success', 'partial', 'failed')),
    records_ingested INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    
    -- Error tracking
    error_message TEXT,
    error_details JSONB,
    
    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_buckets_tenant ON buckets(tenant_id);
CREATE INDEX idx_buckets_state ON buckets(state) WHERE state != 'OFF';
CREATE INDEX idx_buckets_connector_status ON buckets(connector_status) WHERE connector_status IS NOT NULL;
CREATE INDEX idx_progress_ready ON bucket_progress(is_ready) WHERE is_ready = true;
CREATE INDEX idx_ingestion_bucket ON bucket_ingestion_logs(bucket_id);
CREATE INDEX idx_ingestion_status ON bucket_ingestion_logs(status) WHERE status IN ('started', 'normalizing', 'syncing');

-- ============================================
-- INITIAL DATA
-- ============================================

INSERT INTO bucket_requirements (bucket_type, display_name, description, icon, color, unlocks_modules, seed_methods, is_required) VALUES
('B0', 'Identity & Workspace', 'Organization setup, users, RBAC', '👤', 'bg-blue-50', ARRAY[]::TEXT[], ARRAY['manual'], true),
('B1', 'Tasks & Projects', 'Tasks, projects, milestones', '✓', 'bg-green-50', ARRAY['tasks', 'projects'], ARRAY['manual', 'upload', 'connector'], false),
('B2', 'Calendar & Meetings', 'Calendars, meetings, events', '📅', 'bg-purple-50', ARRAY['calendar', 'meetings'], ARRAY['upload', 'connector'], false),
('B3', 'Docs & Knowledge', 'Documents, wiki, knowledge base', '📄', 'bg-orange-50', ARRAY['docs', 'knowledge'], ARRAY['upload', 'connector'], false),
('B4', 'Communications', 'Email, Slack, messages', '💬', 'bg-pink-50', ARRAY['inbox', 'communications'], ARRAY['upload', 'connector'], false),
('B5', 'CRM / Accounts', 'Accounts, contacts, opportunities', '👥', 'bg-cyan-50', ARRAY['accounts', 'contacts', 'deals'], ARRAY['manual', 'upload', 'connector'], false),
('B6', 'Integrations & Automations', 'Webhooks, workflows, automations', '🔗', 'bg-amber-50', ARRAY['integrations', 'automations'], ARRAY['connector'], false),
('B7', 'Governance & Compliance', 'Policies, approvals, audit', '🔐', 'bg-red-50', ARRAY['governance', 'approvals', 'audit'], ARRAY['manual'], false);

-- Update B0 with min entities and connectors
UPDATE bucket_requirements SET
  min_entities = '{}',
  seed_methods = ARRAY['manual'],
  available_connectors = ARRAY[]::TEXT[]
WHERE bucket_type = 'B0';

UPDATE bucket_requirements SET
  min_entities = '{"task": 5}',
  available_connectors = ARRAY['asana', 'monday', 'notion', 'todoist']
WHERE bucket_type = 'B1';

UPDATE bucket_requirements SET
  min_entities = '{"event": 3}',
  available_connectors = ARRAY['google_calendar', 'outlook', 'caldav']
WHERE bucket_type = 'B2';

UPDATE bucket_requirements SET
  min_entities = '{"document": 3}',
  available_connectors = ARRAY['google_drive', 'notion', 'confluence', 'dropbox']
WHERE bucket_type = 'B3';

UPDATE bucket_requirements SET
  min_entities = '{"message": 10}',
  available_connectors = ARRAY['gmail', 'slack', 'microsoft_teams', 'twitter']
WHERE bucket_type = 'B4';

UPDATE bucket_requirements SET
  min_entities = '{"account": 1, "contact": 1}',
  available_connectors = ARRAY['salesforce', 'hubspot', 'pipedrive', 'supabase']
WHERE bucket_type = 'B5';

UPDATE bucket_requirements SET
  available_connectors = ARRAY['zapier', 'n8n', 'make', 'integromat']
WHERE bucket_type = 'B6';

-- ============================================
-- VIEWS
-- ============================================

-- Bucket Status Overview
CREATE OR REPLACE VIEW v_bucket_status AS
SELECT 
    b.bucket_id,
    b.tenant_id,
    b.bucket_type,
    br.display_name,
    br.icon,
    br.color,
    b.state,
    b.seed_method,
    b.connected_source,
    b.connector_status,
    b.last_sync_at,
    b.next_sync_at,
    COALESCE(p.progress_percent, 0) as progress_percent,
    COALESCE(p.is_ready, false) as is_ready,
    COALESCE(p.task_count, 0) as task_count,
    COALESCE(p.doc_count, 0) as doc_count,
    COALESCE(p.account_count, 0) as account_count,
    COALESCE(p.contact_count, 0) as contact_count,
    b.error_code,
    b.error_message,
    br.unlocks_modules
FROM buckets b
LEFT JOIN bucket_requirements br ON b.bucket_type = br.bucket_type
LEFT JOIN bucket_progress p ON b.bucket_id = p.bucket_id;

-- Unlocked Modules View
CREATE OR REPLACE VIEW v_unlocked_modules AS
SELECT DISTINCT
    b.tenant_id,
    br.unlocks_modules[i] as module_id,
    COUNT(*) as bucket_count
FROM buckets b
LEFT JOIN bucket_requirements br ON b.bucket_type = br.bucket_type,
LATERAL unnest(br.unlocks_modules) WITH ORDINALITY t(module, i)
WHERE b.state IN ('SEEDED', 'LIVE')
GROUP BY b.tenant_id, module_id;

-- ============================================
-- END OF MIGRATION
-- ============================================
