-- AI Conversations Migration for D1 (SQLite)
-- Stores AI chat sessions with 30-day retention

-- AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT,
  context_type TEXT, -- 'account', 'contact', 'deal', 'general'
  context_id TEXT,   -- ID of the related entity
  model TEXT DEFAULT 'gpt-4o-mini',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  expires_at TEXT DEFAULT (datetime('now', '+30 days')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- AI Messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  conversation_id TEXT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  tool_calls TEXT,
  tool_call_id TEXT,
  tokens INTEGER DEFAULT 0,
  latency_ms INTEGER,
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- AI Memories table (extracted insights)
CREATE TABLE IF NOT EXISTS ai_memories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  conversation_id TEXT REFERENCES ai_conversations(id) ON DELETE SET NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('insight', 'preference', 'fact', 'decision', 'action_item', 'relationship')),
  content TEXT NOT NULL,
  context_type TEXT,
  context_id TEXT,
  importance REAL DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  source TEXT DEFAULT 'auto_extracted' CHECK (source IN ('auto_extracted', 'user_created', 'user_confirmed', 'system')),
  is_confirmed INTEGER DEFAULT 0,
  confirmed_by TEXT,
  confirmed_at TEXT,
  metadata TEXT DEFAULT '{}',
  expires_at TEXT DEFAULT (datetime('now', '+30 days')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- AI Session Summaries (for MCP tool writes)
CREATE TABLE IF NOT EXISTS ai_session_summaries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  conversation_id TEXT REFERENCES ai_conversations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT DEFAULT '[]',
  decisions TEXT DEFAULT '[]',
  action_items TEXT DEFAULT '[]',
  context_type TEXT,
  context_id TEXT,
  created_by TEXT,
  metadata TEXT DEFAULT '{}',
  expires_at TEXT DEFAULT (datetime('now', '+30 days')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_tenant ON ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_context ON ai_conversations(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_expires ON ai_conversations(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON ai_conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_memories_tenant ON ai_memories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_user ON ai_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_conversation ON ai_memories(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_context ON ai_memories(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_type ON ai_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_ai_memories_expires ON ai_memories(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_memories_importance ON ai_memories(importance);

CREATE INDEX IF NOT EXISTS idx_ai_session_summaries_tenant ON ai_session_summaries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_session_summaries_conversation ON ai_session_summaries(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_session_summaries_expires ON ai_session_summaries(expires_at);
