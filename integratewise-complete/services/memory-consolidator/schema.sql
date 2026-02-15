-- Memory Consolidator D1 Schema
-- Stores consolidated memories from session aggregation

-- Drop tables if exist (for clean deployment)
DROP TABLE IF EXISTS consolidated_memories;
DROP TABLE IF EXISTS consolidation_runs;

-- ============================================================================
-- CONSOLIDATED MEMORIES TABLE
-- ============================================================================

CREATE TABLE consolidated_memories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    consolidation_type TEXT NOT NULL CHECK (consolidation_type IN ('topic', 'user', 'account', 'pattern')),
    
    -- Optional context fields (depends on consolidation_type)
    topic TEXT,
    user_id TEXT,
    account_id TEXT,
    
    -- Consolidated content
    summary TEXT NOT NULL,
    key_insights TEXT NOT NULL DEFAULT '[]',  -- JSON array
    recurring_themes TEXT NOT NULL DEFAULT '[]',  -- JSON array
    action_patterns TEXT NOT NULL DEFAULT '[]',  -- JSON array
    
    -- Metadata
    session_count INTEGER NOT NULL DEFAULT 0,
    time_range_start TEXT NOT NULL,
    time_range_end TEXT NOT NULL,
    
    -- Risk assessment (for account consolidations)
    risk_level TEXT CHECK (risk_level IN ('normal', 'elevated', 'high', 'critical')),
    
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for efficient queries
CREATE INDEX idx_consolidated_memories_tenant ON consolidated_memories(tenant_id);
CREATE INDEX idx_consolidated_memories_type ON consolidated_memories(consolidation_type);
CREATE INDEX idx_consolidated_memories_topic ON consolidated_memories(topic) WHERE topic IS NOT NULL;
CREATE INDEX idx_consolidated_memories_user ON consolidated_memories(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_consolidated_memories_account ON consolidated_memories(account_id) WHERE account_id IS NOT NULL;
CREATE INDEX idx_consolidated_memories_created ON consolidated_memories(created_at);
CREATE INDEX idx_consolidated_memories_risk ON consolidated_memories(risk_level) WHERE risk_level IS NOT NULL;

-- Composite index for time-range queries
CREATE INDEX idx_consolidated_memories_time_range 
    ON consolidated_memories(tenant_id, consolidation_type, created_at);

-- ============================================================================
-- CONSOLIDATION RUNS TABLE (for tracking and debugging)
-- ============================================================================

CREATE TABLE consolidation_runs (
    id TEXT PRIMARY KEY,
    run_type TEXT NOT NULL CHECK (run_type IN ('hourly', 'daily', 'weekly')),
    tenant_id TEXT,  -- NULL for global runs
    
    started_at TEXT NOT NULL,
    completed_at TEXT,
    
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
    
    -- Statistics
    sessions_processed INTEGER DEFAULT 0,
    memories_created INTEGER DEFAULT 0,
    memories_updated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    
    -- Error tracking
    last_error TEXT,
    
    -- Performance
    duration_ms INTEGER,
    
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_consolidation_runs_type ON consolidation_runs(run_type);
CREATE INDEX idx_consolidation_runs_tenant ON consolidation_runs(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX idx_consolidation_runs_status ON consolidation_runs(status);
CREATE INDEX idx_consolidation_runs_started ON consolidation_runs(started_at);

-- ============================================================================
-- MEMORY LINKS TABLE (relationships between memories)
-- ============================================================================

CREATE TABLE memory_links (
    id TEXT PRIMARY KEY,
    source_memory_id TEXT NOT NULL REFERENCES consolidated_memories(id) ON DELETE CASCADE,
    target_memory_id TEXT NOT NULL REFERENCES consolidated_memories(id) ON DELETE CASCADE,
    link_type TEXT NOT NULL CHECK (link_type IN ('related', 'supersedes', 'derives_from', 'contradicts')),
    strength REAL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_memory_links_source ON memory_links(source_memory_id);
CREATE INDEX idx_memory_links_target ON memory_links(target_memory_id);
CREATE INDEX idx_memory_links_type ON memory_links(link_type);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Recent topic memories (last 7 days)
CREATE VIEW recent_topic_memories AS
SELECT 
    cm.*,
    json_array_length(cm.key_insights) as insight_count,
    json_array_length(cm.recurring_themes) as theme_count
FROM consolidated_memories cm
WHERE cm.consolidation_type = 'topic'
  AND cm.created_at >= datetime('now', '-7 days')
ORDER BY cm.created_at DESC;

-- Account health snapshot
CREATE VIEW account_health_snapshot AS
SELECT 
    cm.tenant_id,
    cm.account_id,
    cm.summary as latest_summary,
    cm.risk_level,
    cm.session_count,
    cm.key_insights,
    cm.recurring_themes,
    cm.created_at as last_consolidated_at
FROM consolidated_memories cm
WHERE cm.consolidation_type = 'account'
  AND cm.account_id IS NOT NULL
  AND cm.created_at = (
    SELECT MAX(cm2.created_at) 
    FROM consolidated_memories cm2 
    WHERE cm2.account_id = cm.account_id 
      AND cm2.consolidation_type = 'account'
  )
ORDER BY cm.risk_level DESC NULLS LAST;

-- Weekly patterns summary
CREATE VIEW weekly_patterns AS
SELECT 
    cm.tenant_id,
    cm.summary,
    cm.key_insights as patterns,
    cm.recurring_themes as themes,
    cm.action_patterns as best_practices,
    cm.session_count as memory_count,
    cm.time_range_start,
    cm.time_range_end,
    cm.created_at
FROM consolidated_memories cm
WHERE cm.consolidation_type = 'pattern'
ORDER BY cm.created_at DESC;

-- Consolidation run statistics
CREATE VIEW consolidation_stats AS
SELECT 
    run_type,
    COUNT(*) as total_runs,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_runs,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_runs,
    AVG(duration_ms) as avg_duration_ms,
    SUM(sessions_processed) as total_sessions_processed,
    SUM(memories_created) as total_memories_created,
    MAX(completed_at) as last_run_at
FROM consolidation_runs
GROUP BY run_type;
