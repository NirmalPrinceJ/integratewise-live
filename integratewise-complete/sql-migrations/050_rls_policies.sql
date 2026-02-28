-- IntegrateWise Row Level Security (RLS) Policies
-- CRITICAL: Run this before going to production!
-- This migration enables RLS and creates policies for all tables

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spine_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS knowledge_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spine_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE WORKSPACE_MEMBERS TABLE (if missing)
-- ============================================

CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WORKSPACES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read member workspaces" ON workspaces;
CREATE POLICY "Users can read member workspaces"
  ON workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update workspace" ON workspaces;
CREATE POLICY "Admins can update workspace"
  ON workspaces FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- ============================================
-- WORKSPACE_MEMBERS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read workspace members" ON workspace_members;
CREATE POLICY "Users can read workspace members"
  ON workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members AS my_memberships
      WHERE my_memberships.workspace_id = workspace_members.workspace_id
      AND my_memberships.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can insert members" ON workspace_members;
CREATE POLICY "Admins can insert members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_members.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete members" ON workspace_members;
CREATE POLICY "Admins can delete members"
  ON workspace_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_members.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- ============================================
-- SPINE_ENTITIES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant entities" ON spine_entities;
CREATE POLICY "Users can read tenant entities"
  ON spine_entities FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant entities" ON spine_entities;
CREATE POLICY "Users can create tenant entities"
  ON spine_entities FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tenant entities" ON spine_entities;
CREATE POLICY "Users can update tenant entities"
  ON spine_entities FOR UPDATE
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tenant entities" ON spine_entities;
CREATE POLICY "Users can delete tenant entities"
  ON spine_entities FOR DELETE
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- KNOWLEDGE_INSIGHTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant insights" ON knowledge_insights;
CREATE POLICY "Users can read tenant insights"
  ON knowledge_insights FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant insights" ON knowledge_insights;
CREATE POLICY "Users can create tenant insights"
  ON knowledge_insights FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- KNOWLEDGE_DOCUMENTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant documents" ON knowledge_documents;
CREATE POLICY "Users can read tenant documents"
  ON knowledge_documents FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant documents" ON knowledge_documents;
CREATE POLICY "Users can create tenant documents"
  ON knowledge_documents FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- ACTIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant actions" ON actions;
CREATE POLICY "Users can read tenant actions"
  ON actions FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant actions" ON actions;
CREATE POLICY "Users can create tenant actions"
  ON actions FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tenant actions" ON actions;
CREATE POLICY "Users can update tenant actions"
  ON actions FOR UPDATE
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- SPINE_TASKS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant tasks" ON spine_tasks;
CREATE POLICY "Users can read tenant tasks"
  ON spine_tasks FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant tasks" ON spine_tasks;
CREATE POLICY "Users can create tenant tasks"
  ON spine_tasks FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tenant tasks" ON spine_tasks;
CREATE POLICY "Users can update tenant tasks"
  ON spine_tasks FOR UPDATE
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- SPINE_EVENTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant events" ON spine_events;
CREATE POLICY "Users can read tenant events"
  ON spine_events FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tenant events" ON spine_events;
CREATE POLICY "Users can create tenant events"
  ON spine_events FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tenant events" ON spine_events;
CREATE POLICY "Users can update tenant events"
  ON spine_events FOR UPDATE
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- USER_SETTINGS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read own settings" ON user_settings;
CREATE POLICY "Users can read own settings"
  ON user_settings FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own settings" ON user_settings;
CREATE POLICY "Users can create own settings"
  ON user_settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- WORKSPACE_SETTINGS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read workspace settings" ON workspace_settings;
CREATE POLICY "Users can read workspace settings"
  ON workspace_settings FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update workspace settings" ON workspace_settings;
CREATE POLICY "Admins can update workspace settings"
  ON workspace_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_settings.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- ============================================
-- INTEGRATIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read workspace integrations" ON integrations;
CREATE POLICY "Users can read workspace integrations"
  ON integrations FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage integrations" ON integrations;
CREATE POLICY "Admins can manage integrations"
  ON integrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = integrations.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- ============================================
-- AUDIT_LOGS POLICIES (Read-only for users)
-- ============================================

DROP POLICY IF EXISTS "Users can read tenant audit logs" ON audit_logs;
CREATE POLICY "Users can read tenant audit logs"
  ON audit_logs FOR SELECT
  USING (
    tenant_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON workspace_members(role);
CREATE INDEX IF NOT EXISTS idx_spine_entities_tenant ON spine_entities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_spine_entities_type ON spine_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_insights_tenant ON knowledge_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_actions_tenant ON actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_spine_tasks_tenant ON spine_tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_spine_events_tenant ON spine_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- AUTO-UPDATE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspace_members_updated_at ON workspace_members;
CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_spine_entities_updated_at ON spine_entities;
CREATE TRIGGER update_spine_entities_updated_at BEFORE UPDATE ON spine_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspace_settings_updated_at ON workspace_settings;
CREATE TRIGGER update_workspace_settings_updated_at BEFORE UPDATE ON workspace_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================

-- Output summary of RLS status
SELECT 
  'RLS Enabled Tables' as check_name,
  COUNT(*) as count
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true

UNION ALL

SELECT 
  'Total Policies Created' as check_name,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public';
