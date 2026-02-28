-- Migration 028: Entity 360° View + L2 Intelligence Support
-- Completes L3 → L2 → L1 wiring

-- ============================================
-- 1. CORE ENTITY TABLES (if not exists)
-- ============================================

-- Spine entities (SSOT)
CREATE TABLE IF NOT EXISTS spine_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    entity_type TEXT NOT NULL, -- 'account', 'contact', 'deal', etc.
    source TEXT NOT NULL, -- 'hubspot', 'stripe', 'manual'
    source_id TEXT, -- ID in source system
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    data JSONB NOT NULL DEFAULT '{}',
    completeness_score INTEGER DEFAULT 0, -- 0-100
    health_score INTEGER DEFAULT 50, -- 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Entity relationships
CREATE TABLE IF NOT EXISTS entity_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    from_entity_id UUID REFERENCES spine_entities(id) ON DELETE CASCADE,
    to_entity_id UUID REFERENCES spine_entities(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- 'belongs_to', 'works_at', 'related_to'
    confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge documents (unstructured)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title TEXT,
    content TEXT,
    source TEXT, -- 'email', 'slack', 'note'
    source_url TEXT,
    entity_ids UUID[] DEFAULT '{}',
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI insights/signals
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    entity_id UUID REFERENCES spine_entities(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL, -- 'risk', 'opportunity', 'anomaly'
    title TEXT NOT NULL,
    description TEXT,
    confidence INTEGER DEFAULT 80, -- 0-100
    evidence JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active', -- 'active', 'dismissed', 'actioned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence fabric (provenance tracking)
CREATE TABLE IF NOT EXISTS evidence_fabric (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    entity_id UUID REFERENCES spine_entities(id) ON DELETE CASCADE,
    insight_id UUID REFERENCES ai_insights(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL, -- 'data_point', 'correlation', 'change'
    source TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actions (HITL approval queue)
CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    entity_id UUID REFERENCES spine_entities(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'send_email', 'update_field', 'create_task'
    title TEXT NOT NULL,
    description TEXT,
    proposed_changes JSONB,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'executed'
    requested_by TEXT DEFAULT 'system',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. ENTITY 360° VIEW (The Magic)
-- ============================================

CREATE OR REPLACE VIEW entity_360 AS
SELECT 
    e.id,
    e.tenant_id,
    e.entity_type,
    e.name,
    e.status,
    e.data,
    e.completeness_score,
    e.health_score,
    e.created_at,
    e.updated_at,
    
    -- Completeness badges (🟢🟡🔴)
    CASE 
        WHEN e.completeness_score >= 80 THEN 'complete'
        WHEN e.completeness_score >= 50 THEN 'partial'
        ELSE 'incomplete'
    END as completeness_status,
    
    -- Health badges
    CASE 
        WHEN e.health_score >= 70 THEN 'healthy'
        WHEN e.health_score >= 40 THEN 'at-risk'
        ELSE 'critical'
    END as health_status,
    
    -- Related entities count
    (SELECT COUNT(*) FROM entity_relationships er 
     WHERE er.from_entity_id = e.id OR er.to_entity_id = e.id) as related_count,
    
    -- Knowledge documents count
    (SELECT COUNT(*) FROM knowledge_documents kd 
     WHERE e.id = ANY(kd.entity_ids)) as knowledge_count,
    
    -- Active insights count
    (SELECT COUNT(*) FROM ai_insights ai 
     WHERE ai.entity_id = e.id AND ai.status = 'active') as insights_count,
    
    -- Pending actions count
    (SELECT COUNT(*) FROM actions a 
     WHERE a.entity_id = e.id AND a.status = 'pending') as pending_actions_count

FROM spine_entities e
WHERE e.status = 'active';

-- ============================================
-- 3. INDICES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_spine_entities_tenant ON spine_entities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_spine_entities_type ON spine_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_spine_entities_health ON spine_entities(health_score);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_from ON entity_relationships(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_relationships_to ON entity_relationships(to_entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_entity_ids ON knowledge_documents USING GIN(entity_ids);
CREATE INDEX IF NOT EXISTS idx_ai_insights_entity ON ai_insights(entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_actions_entity ON actions(entity_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);

-- ============================================
-- 4. RLS POLICIES
-- ============================================

ALTER TABLE spine_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_fabric ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY "Tenant isolation - spine_entities" ON spine_entities
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY "Tenant isolation - entity_relationships" ON entity_relationships
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY "Tenant isolation - knowledge_documents" ON knowledge_documents
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY "Tenant isolation - ai_insights" ON ai_insights
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY "Tenant isolation - evidence_fabric" ON evidence_fabric
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY "Tenant isolation - actions" ON actions
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- ============================================
-- 5. FUNCTIONS FOR API
-- ============================================

-- Get entity with full 360 context
CREATE OR REPLACE FUNCTION get_entity_360(entity_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'entity', to_jsonb(e.*),
        'relationships', (
            SELECT jsonb_agg(jsonb_build_object(
                'id', er.id,
                'type', er.relationship_type,
                'entity', jsonb_build_object(
                    'id', e2.id,
                    'name', e2.name,
                    'type', e2.entity_type
                )
            ))
            FROM entity_relationships er
            JOIN spine_entities e2 ON 
                (er.from_entity_id = e.id AND er.to_entity_id = e2.id) OR
                (er.to_entity_id = e.id AND er.from_entity_id = e2.id)
            WHERE er.from_entity_id = e.id OR er.to_entity_id = e.id
        ),
        'knowledge', (
            SELECT jsonb_agg(to_jsonb(kd.*))
            FROM knowledge_documents kd
            WHERE e.id = ANY(kd.entity_ids)
        ),
        'insights', (
            SELECT jsonb_agg(to_jsonb(ai.*))
            FROM ai_insights ai
            WHERE ai.entity_id = e.id AND ai.status = 'active'
        ),
        'actions', (
            SELECT jsonb_agg(to_jsonb(a.*))
            FROM actions a
            WHERE a.entity_id = e.id AND a.status = 'pending'
        )
    ) INTO result
    FROM spine_entities e
    WHERE e.id = entity_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Search entities by name/type
CREATE OR REPLACE FUNCTION search_entities(
    tenant_uuid UUID,
    search_query TEXT,
    entity_type_filter TEXT DEFAULT NULL
)
RETURNS SETOF entity_360 AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM entity_360 e
    WHERE e.tenant_id = tenant_uuid
      AND (
          e.name ILIKE '%' || search_query || '%'
          OR e.data::text ILIKE '%' || search_query || '%'
      )
      AND (entity_type_filter IS NULL OR e.entity_type = entity_type_filter)
    ORDER BY e.health_score DESC, e.completeness_score DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. TASKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    entity_id UUID REFERENCES spine_entities(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    due_date TIMESTAMP WITH TIME ZONE,
    source TEXT DEFAULT 'manual', -- 'manual', 'hubspot', 'slack', 'email'
    assigned_to UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_entity ON tasks(entity_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation - tasks" ON tasks
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- ============================================
-- 7. CALENDAR EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    attendees TEXT[] DEFAULT '{}',
    location TEXT,
    source TEXT DEFAULT 'manual', -- 'google', 'outlook', 'manual'
    entity_ids UUID[] DEFAULT '{}',
    is_all_day BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_tenant ON calendar_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_entity_ids ON calendar_events USING GIN(entity_ids);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation - calendar_events" ON calendar_events
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- ============================================
-- 8. SEED DATA (Sample)
-- ============================================

-- Sample entity
INSERT INTO spine_entities (tenant_id, entity_type, source, name, data, completeness_score, health_score)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'account', 'hubspot', 'Acme Corporation', 
     '{"industry": "Technology", "arr": 45000, "employees": 250}'::jsonb, 85, 92),
    ('00000000-0000-0000-0000-000000000001', 'account', 'hubspot', 'TechStart Inc', 
     '{"industry": "SaaS", "arr": 32000, "employees": 45}'::jsonb, 70, 64),
    ('00000000-0000-0000-0000-000000000001', 'contact', 'hubspot', 'John Smith', 
     '{"email": "john@acme.com", "title": "CTO"}'::jsonb, 90, 88)
ON CONFLICT DO NOTHING;

-- Sample insights
INSERT INTO ai_insights (tenant_id, entity_id, insight_type, title, description, confidence)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    id,
    'growth',
    'Expansion Opportunity',
    'Usage increased 34% in last 30 days',
    87
FROM spine_entities 
WHERE name = 'TechStart Inc'
ON CONFLICT DO NOTHING;

-- Sample action
INSERT INTO actions (tenant_id, entity_id, action_type, title, description, proposed_changes)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    id,
    'send_email',
    'Follow up on expansion interest',
    'Send personalized expansion proposal',
    '{"template": "expansion_proposal", "delay": 0}'::jsonb
FROM spine_entities 
WHERE name = 'TechStart Inc'
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE: L3 → L2 → L1 Wiring Complete
-- ============================================
