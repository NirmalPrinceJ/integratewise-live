-- Migration: Create agent_colony_runs table
-- Stores results from multi-agent workflow executions

CREATE TABLE IF NOT EXISTS agent_colony_runs (
  id TEXT PRIMARY KEY,
  instance_id TEXT NOT NULL UNIQUE,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  
  -- Task details
  task_objective TEXT NOT NULL,
  task_context TEXT,  -- JSON
  priority TEXT DEFAULT 'medium',
  
  -- Execution results
  plan TEXT,          -- JSON: orchestrator's plan
  results TEXT,       -- JSON: all agent results
  
  -- Status
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  
  -- Metrics
  total_tokens_used INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_colony_tenant ON agent_colony_runs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_colony_status ON agent_colony_runs(status);
CREATE INDEX IF NOT EXISTS idx_colony_created ON agent_colony_runs(created_at DESC);
