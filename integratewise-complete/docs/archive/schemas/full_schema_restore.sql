-- Interactions table for capturing all AI chats, browser history, webhooks
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'chatgpt', 'claude', 'perplexity', 'browser', 'webhook', 'manual'
  source_url TEXT,
  title TEXT,
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast vector similarity search
CREATE INDEX IF NOT EXISTS interactions_embedding_idx ON interactions 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Index for source filtering
CREATE INDEX IF NOT EXISTS interactions_source_idx ON interactions(source);
CREATE INDEX IF NOT EXISTS interactions_created_at_idx ON interactions(created_at DESC);

-- Full text search index
CREATE INDEX IF NOT EXISTS interactions_content_search_idx ON interactions 
USING gin(to_tsvector('english', content));
-- Documents/Knowledge Base table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'strategy', 'sales', 'marketing', 'operations', 'delivery', 'finance', 'hr', 'product', 'technology'
  description TEXT,
  icon VARCHAR(50) DEFAULT 'FileText',
  embedding vector(1536),
  is_starred BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS documents_content_search_idx ON documents 
USING gin(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(description, '')));
-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
  status VARCHAR(20) DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  due_date DATE,
  assignee TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'meeting', -- 'meeting', 'call', 'focus', 'break', 'reminder'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  attendees TEXT[] DEFAULT '{}',
  color VARCHAR(20) DEFAULT 'teal',
  is_all_day BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- iCal RRULE format
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS calendar_events_start_time_idx ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS calendar_events_event_type_idx ON calendar_events(event_type);
-- Emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  preview TEXT,
  body TEXT,
  folder VARCHAR(50) DEFAULT 'inbox', -- 'inbox', 'sent', 'archive', 'trash'
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  has_attachments BOOLEAN DEFAULT FALSE,
  thread_id UUID,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS emails_folder_idx ON emails(folder);
CREATE INDEX IF NOT EXISTS emails_is_read_idx ON emails(is_read);
CREATE INDEX IF NOT EXISTS emails_received_at_idx ON emails(received_at DESC);
CREATE INDEX IF NOT EXISTS emails_thread_id_idx ON emails(thread_id);
-- Drive/Files table
CREATE TABLE IF NOT EXISTS drive_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'document', 'spreadsheet', 'presentation', 'image', 'pdf', 'folder', 'video', 'audio'
  mime_type TEXT,
  size_bytes BIGINT,
  parent_folder_id UUID REFERENCES drive_files(id),
  file_url TEXT,
  thumbnail_url TEXT,
  is_starred BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  shared_with TEXT[] DEFAULT '{}',
  embedding vector(1536),
  content_preview TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS drive_files_file_type_idx ON drive_files(file_type);
CREATE INDEX IF NOT EXISTS drive_files_parent_folder_idx ON drive_files(parent_folder_id);
CREATE INDEX IF NOT EXISTS drive_files_updated_at_idx ON drive_files(updated_at DESC);
-- Activities/Activity Feed table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type VARCHAR(50) NOT NULL, -- 'task_completed', 'document_updated', 'email_received', 'meeting_scheduled', 'file_uploaded', 'interaction_captured'
  title TEXT NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20) DEFAULT 'teal',
  related_entity_type VARCHAR(50), -- 'task', 'document', 'email', 'calendar_event', 'drive_file', 'interaction'
  related_entity_id UUID,
  actor_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS activities_activity_type_idx ON activities(activity_type);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS activities_related_entity_idx ON activities(related_entity_type, related_entity_id);
-- Metrics/KPIs table for business metrics
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL, -- 'mrr', 'pipeline', 'revenue', 'active_projects', 'leads', 'posts', 'followers'
  metric_value DECIMAL(15, 2) NOT NULL,
  metric_unit VARCHAR(20), -- 'currency', 'count', 'percentage'
  currency VARCHAR(10) DEFAULT 'INR',
  period_start DATE,
  period_end DATE,
  change_percentage DECIMAL(5, 2),
  change_direction VARCHAR(10), -- 'up', 'down', 'neutral'
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS metrics_metric_name_idx ON metrics(metric_name);
CREATE INDEX IF NOT EXISTS metrics_recorded_at_idx ON metrics(recorded_at DESC);
-- IntegrateWise Webhooks Table
-- Matches the structure from integratewise-webhooks repo

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL, -- razorpay, stripe, github, vercel, todoist, notion, ai-relay
  event_type VARCHAR(100) NOT NULL,
  event_id VARCHAR(255), -- Provider's event ID
  payload JSONB NOT NULL,
  signature TEXT, -- Webhook signature for verification
  signature_valid BOOLEAN DEFAULT true,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_webhooks_provider ON webhooks(provider);
CREATE INDEX IF NOT EXISTS idx_webhooks_event_type ON webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_webhooks_created_at ON webhooks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);

-- Enable RLS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Policy for reading webhooks (allow all for now, can be restricted later)
CREATE POLICY "Allow all access to webhooks" ON webhooks FOR ALL USING (true);

-- Add comment
COMMENT ON TABLE webhooks IS 'Stores incoming webhooks from various providers (Razorpay, Stripe, GitHub, Vercel, Todoist, Notion, AI Relay)';
-- IntegrateWise LLP Services Schema
-- Supports all 6 tiers of business services

-- Services/Products catalog
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 6),
  tier_name VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pricing_type VARCHAR(50) NOT NULL, -- 'fixed', 'monthly', 'yearly', 'one-time', 'usage'
  price_min DECIMAL(12, 2),
  price_max DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  modules JSONB DEFAULT '[]', -- For SaaS modules
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  industry VARCHAR(100),
  company_size VARCHAR(50), -- 'startup', 'smb', 'mid-market', 'enterprise'
  status VARCHAR(50) DEFAULT 'prospect', -- 'prospect', 'active', 'churned', 'paused'
  source VARCHAR(100), -- 'referral', 'linkedin', 'website', 'conference'
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects / Engagements
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'discovery', -- 'discovery', 'proposal', 'negotiation', 'active', 'completed', 'cancelled'
  stage VARCHAR(50), -- 'audit', 'implementation', 'support', 'optimization'
  start_date DATE,
  end_date DATE,
  contract_value DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  billing_type VARCHAR(50), -- 'fixed', 'monthly', 'milestone', 'hourly'
  health_score INTEGER CHECK (health_score BETWEEN 1 AND 10),
  owner VARCHAR(255),
  tags TEXT[] DEFAULT ARRAY[]::text[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (for recurring services)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  plan_name VARCHAR(100),
  modules TEXT[] DEFAULT ARRAY[]::text[], -- For SaaS: ['template_forge', 'normalize_ai', 'cs_hub']
  mrr DECIMAL(12, 2) NOT NULL,
  arr DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'active', -- 'trial', 'active', 'paused', 'cancelled'
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'quarterly', 'yearly'
  start_date DATE NOT NULL,
  renewal_date DATE,
  cancellation_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  tier INTEGER,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  type VARCHAR(50) NOT NULL, -- 'service', 'subscription', 'product', 'workshop', 'certification'
  invoice_number VARCHAR(100),
  invoice_date DATE,
  payment_date DATE,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline / Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  stage VARCHAR(50) DEFAULT 'discovery', -- 'discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  probability INTEGER DEFAULT 10 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  owner VARCHAR(255),
  source VARCHAR(100),
  notes TEXT,
  lost_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_tier ON services(tier);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_revenue_client ON revenue(client_id);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(invoice_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Allow all access policies (update with proper auth later)
DROP POLICY IF EXISTS "Allow all access to services" ON services;
CREATE POLICY "Allow all access to services" ON services FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to clients" ON clients;
CREATE POLICY "Allow all access to clients" ON clients FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to projects" ON projects;
CREATE POLICY "Allow all access to projects" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to subscriptions" ON subscriptions;
CREATE POLICY "Allow all access to subscriptions" ON subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to revenue" ON revenue;
CREATE POLICY "Allow all access to revenue" ON revenue FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to opportunities" ON opportunities;
CREATE POLICY "Allow all access to opportunities" ON opportunities FOR ALL USING (true);
-- IntegrateWise Products Table
-- Covers all 5 tiers: Professional Services, Recurring Revenue, Scalable, Digital Products + SaaS, Community

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 5),
  tier_name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  pricing_model VARCHAR(50) NOT NULL, -- 'fixed', 'monthly', 'yearly', 'custom', 'free'
  price_min DECIMAL(12, 2),
  price_max DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  icon VARCHAR(50),
  color VARCHAR(50),
  features JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  ideal_for TEXT,
  external_url TEXT,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_tier ON products(tier);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to products" ON products;
CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true);
-- IntegrateWise CRM Schema
-- Tables for Leads, Campaigns, Activities, and Data Source Sync

-- =====================
-- LEADS TABLE
-- =====================
-- Changed first_name/last_name to single name column to match existing schema
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(255),
  linkedin_url TEXT,
  website TEXT,
  
  -- Lead Qualification
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost')),
  source VARCHAR(100),
  source_detail TEXT,
  score INTEGER DEFAULT 0,
  
  -- Assignment
  assigned_to VARCHAR(255),
  assigned_at TIMESTAMPTZ,
  
  -- Conversion
  converted_to_client_id UUID REFERENCES clients(id),
  converted_at TIMESTAMPTZ,
  
  -- External IDs for sync
  hubspot_id VARCHAR(100),
  pipedrive_id VARCHAR(100),
  external_source VARCHAR(50),
  external_id VARCHAR(255),
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::text[],
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  last_contacted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CAMPAIGNS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Campaign Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) CHECK (type IN ('email', 'linkedin', 'ads', 'content', 'webinar', 'event', 'referral', 'cold_outreach', 'social', 'product_launch', 'outbound', 'community', 'beta')),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'archived')),
  
  -- Targeting
  target_audience TEXT,
  channel VARCHAR(30),
  
  -- Schedule
  start_date DATE,
  end_date DATE,
  
  -- Budget & Goals
  budget DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Performance Metrics
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated DECIMAL(15,2) DEFAULT 0,
  
  -- External IDs
  hubspot_campaign_id VARCHAR(100),
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::text[],
  content JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- LEAD ACTIVITIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Activity Info
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'email_sent', 'email_opened', 'email_clicked', 'email_replied',
    'call_made', 'call_received', 'voicemail',
    'meeting_scheduled', 'meeting_completed', 'meeting_cancelled',
    'linkedin_connection', 'linkedin_message', 'linkedin_viewed',
    'website_visit', 'form_submission', 'document_viewed',
    'note_added', 'task_created', 'status_changed', 'score_changed'
  )),
  
  subject VARCHAR(255),
  description TEXT,
  
  -- Related entities
  campaign_id UUID REFERENCES campaigns(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  performed_by VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- DATA SOURCE SYNC LOG
-- =====================
CREATE TABLE IF NOT EXISTS data_source_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  source VARCHAR(50) NOT NULL CHECK (source IN (
    'hubspot', 'pipedrive', 'stripe', 'google_sheets', 
    'google_analytics', 'asana', 'linkedin', 'razorpay'
  )),
  
  sync_type VARCHAR(50) CHECK (sync_type IN ('full', 'incremental', 'webhook')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  
  -- Sync Stats
  records_fetched INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Error handling
  error_message TEXT,
  error_details JSONB,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- =====================
-- REVENUE TRACKING (for Stripe/Razorpay sync)
-- =====================
CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Transaction Info
  type VARCHAR(50) CHECK (type IN ('payment', 'refund', 'subscription', 'invoice')),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Related entities
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES client_projects(id),
  product_id UUID REFERENCES products(id),
  
  -- External references
  stripe_id VARCHAR(255),
  razorpay_id VARCHAR(255),
  invoice_number VARCHAR(100),
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CONTENT LIBRARY
-- =====================
CREATE TABLE IF NOT EXISTS content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  category VARCHAR(50),
  description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  file_url TEXT,
  platform VARCHAR(30),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- DEALS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lead_id UUID REFERENCES leads(id),
  product_id UUID REFERENCES products(id),
  stage VARCHAR(30) DEFAULT 'discovery',
  value NUMERIC(12,2),
  currency VARCHAR(3) DEFAULT 'INR',
  probability INTEGER DEFAULT 10,
  expected_close_date DATE,
  actual_close_date DATE,
  assigned_to TEXT,
  source VARCHAR(50),
  notes TEXT,
  hubspot_deal_id TEXT,
  pipedrive_deal_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_hubspot_id ON leads(hubspot_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(type);
CREATE INDEX IF NOT EXISTS idx_lead_activities_campaign_id ON lead_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_data_source_sync_source ON data_source_sync(source);
CREATE INDEX IF NOT EXISTS idx_data_source_sync_status ON data_source_sync(status);

CREATE INDEX IF NOT EXISTS idx_revenue_transactions_client ON revenue_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_date ON revenue_transactions(transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_content_library_type ON content_library(type);
CREATE INDEX IF NOT EXISTS idx_content_library_status ON content_library(status);

CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON deals(lead_id);

-- =====================
-- RLS POLICIES
-- =====================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_source_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Allow all for now (update with proper auth later)
CREATE POLICY "Allow all leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all lead_activities" ON lead_activities FOR ALL USING (true);
CREATE POLICY "Allow all data_source_sync" ON data_source_sync FOR ALL USING (true);
CREATE POLICY "Allow all revenue_transactions" ON revenue_transactions FOR ALL USING (true);
CREATE POLICY "Allow all content_library" ON content_library FOR ALL USING (true);
CREATE POLICY "Allow all deals" ON deals FOR ALL USING (true);
-- Brainstorming sessions table for capturing ideation
CREATE TABLE IF NOT EXISTS brainstorm_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  participants TEXT[] DEFAULT '{}',
  session_type VARCHAR(30) DEFAULT 'general', -- 'general', 'product', 'marketing', 'sales', 'strategy'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'implemented'
  context TEXT, -- Full conversation/brainstorm content
  key_insights TEXT[],
  action_items TEXT[],
  embedding vector(1536), -- For semantic similarity
  source VARCHAR(50) DEFAULT 'manual', -- 'webhooks.integratewise.online', 'manual', 'slack', 'notion'
  source_url TEXT,
  metadata JSONB DEFAULT '{}',
  session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated insights from brainstorming
CREATE TABLE IF NOT EXISTS brainstorm_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES brainstorm_sessions(id) ON DELETE CASCADE,
  insight_type VARCHAR(30) NOT NULL, -- 'task', 'blog_post', 'linkedin_post', 'email_campaign', 'pipeline_update', 'knowledge_article'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'scheduled', 'published', 'completed', 'cancelled'
  confidence_score NUMERIC(3,2) DEFAULT 0.75, -- AI confidence 0.00-1.00
  target_date DATE,
  assigned_to TEXT,
  metadata JSONB DEFAULT '{}', -- Extra fields based on insight_type
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_at TIMESTAMP WITH TIME ZONE,
  result_id UUID, -- References the created entity (task_id, blog_post_id, etc.)
  result_type VARCHAR(30) -- 'task', 'document', 'campaign', 'deal'
);

-- Daily AI summaries
CREATE TABLE IF NOT EXISTS daily_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_date DATE NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  key_actions TEXT[] DEFAULT '{}',
  metrics_snapshot JSONB DEFAULT '{}',
  brainstorm_count INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  content_generated INTEGER DEFAULT 0,
  pipeline_updates INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brainstorm_status ON brainstorm_sessions(status);
CREATE INDEX IF NOT EXISTS idx_brainstorm_type ON brainstorm_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_brainstorm_date ON brainstorm_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_brainstorm_source ON brainstorm_sessions(source);
CREATE INDEX IF NOT EXISTS idx_brainstorm_embedding ON brainstorm_sessions 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_insights_session ON brainstorm_insights(session_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON brainstorm_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_status ON brainstorm_insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_priority ON brainstorm_insights(priority);

CREATE INDEX IF NOT EXISTS idx_daily_insights_date ON daily_insights(insight_date DESC);
-- Strategic Layer Tables for Business Intelligence
-- Business Goals - Quarterly/Annual targets linked to revenue
CREATE TABLE IF NOT EXISTS business_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  goal_type VARCHAR(30) NOT NULL, -- revenue, growth, product, operational, customer
  period_type VARCHAR(20) NOT NULL, -- quarterly, annual, monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  target_value NUMERIC(12,2),
  current_value NUMERIC(12,2) DEFAULT 0,
  target_unit VARCHAR(20), -- currency, percentage, number
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'active', -- active, achieved, missed, paused
  progress INTEGER DEFAULT 0, -- 0-100
  parent_goal_id UUID REFERENCES business_goals(id),
  linked_products UUID[] DEFAULT '{}',
  linked_services UUID[] DEFAULT '{}',
  owner TEXT,
  priority VARCHAR(10) DEFAULT 'high',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Values - Core principles
CREATE TABLE IF NOT EXISTS company_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  principles TEXT[], -- Sub-principles
  examples TEXT[], -- How we apply this value
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools Mapping - Integrated tools and their purposes
CREATE TABLE IF NOT EXISTS tools_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category VARCHAR(30) NOT NULL, -- crm, sales, marketing, analytics, productivity, development
  tool_type VARCHAR(30), -- saas, internal, integration
  vendor TEXT,
  url TEXT,
  icon VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, evaluating
  integration_status VARCHAR(20) DEFAULT 'not_connected', -- connected, not_connected, partial
  api_connected BOOLEAN DEFAULT false,
  webhook_url TEXT,
  monthly_cost NUMERIC(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  used_by TEXT[], -- departments/teams
  linked_goals UUID[] DEFAULT '{}',
  features TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROI Tracking - Connect products/services to revenue and goals
CREATE TABLE IF NOT EXISTS roi_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(30) NOT NULL, -- product, service, campaign, tool
  entity_id UUID NOT NULL,
  entity_name TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  investment NUMERIC(12,2) DEFAULT 0, -- Cost/investment
  revenue_generated NUMERIC(12,2) DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  customers_acquired INTEGER DEFAULT 0,
  roi_percentage NUMERIC(8,2), -- Calculated ROI
  notes TEXT,
  linked_goal_id UUID REFERENCES business_goals(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal Progress Log - Track progress over time
CREATE TABLE IF NOT EXISTS goal_progress_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES business_goals(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  progress_value NUMERIC(12,2),
  progress_percentage INTEGER,
  notes TEXT,
  recorded_by TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_goals_type ON business_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_goals_period ON business_goals(period_type);
CREATE INDEX IF NOT EXISTS idx_goals_status ON business_goals(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools_registry(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools_registry(status);
CREATE INDEX IF NOT EXISTS idx_roi_entity ON roi_tracking(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_roi_period ON roi_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_progress_goal ON goal_progress_log(goal_id);
-- Website Pages - Manage website content pages
CREATE TABLE IF NOT EXISTS website_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  page_type VARCHAR(30) DEFAULT 'page', -- page, blog, landing, service
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled, archived
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  template VARCHAR(50) DEFAULT 'default',
  author TEXT,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  bounce_rate NUMERIC(5,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website Forms - Track form submissions
CREATE TABLE IF NOT EXISTS website_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  form_type VARCHAR(30) NOT NULL, -- contact, newsletter, demo, quote, consultation
  page_id UUID REFERENCES website_pages(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active',
  fields JSONB DEFAULT '[]',
  submissions_count INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  connected_to VARCHAR(50), -- hubspot, email, crm
  hubspot_form_id TEXT,
  webhook_url TEXT,
  thank_you_message TEXT,
  redirect_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form Submissions - Individual form entries
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES website_forms(id) ON DELETE CASCADE,
  page_id UUID REFERENCES website_pages(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  visitor_id TEXT,
  session_id TEXT,
  data JSONB NOT NULL,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  synced_to_hubspot BOOLEAN DEFAULT false,
  hubspot_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website Visitors - Track visitor sessions
CREATE TABLE IF NOT EXISTS website_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMPTZ DEFAULT NOW(),
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  total_pageviews INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  email TEXT,
  name TEXT,
  company TEXT,
  country TEXT,
  city TEXT,
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  first_referrer TEXT,
  first_utm_source TEXT,
  first_utm_campaign TEXT,
  lifecycle_stage VARCHAR(30) DEFAULT 'visitor', -- visitor, subscriber, lead, mql, sql, customer
  hubspot_contact_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Views - Individual page view events
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES website_pages(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_id TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  time_on_page INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HubSpot Sync Log - Track all HubSpot syncs
CREATE TABLE IF NOT EXISTS hubspot_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type VARCHAR(30) NOT NULL, -- contacts, deals, companies, campaigns, forms, emails
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  status VARCHAR(20) DEFAULT 'pending',
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  error_details JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website to Revenue Funnel - Track conversion journey
CREATE TABLE IF NOT EXISTS conversion_funnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  stage VARCHAR(30) NOT NULL, -- visit, engaged, form_submit, lead, mql, sql, opportunity, customer
  previous_stage VARCHAR(30),
  page_id UUID REFERENCES website_pages(id) ON DELETE SET NULL,
  form_id UUID REFERENCES website_forms(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  source TEXT,
  campaign TEXT,
  revenue_attributed NUMERIC(12,2) DEFAULT 0,
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_status ON website_pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON website_pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_type ON website_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_forms_status ON website_forms(status);
CREATE INDEX IF NOT EXISTS idx_submissions_form ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_lead ON form_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON website_visitors(email);
CREATE INDEX IF NOT EXISTS idx_visitors_lead ON website_visitors(lead_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_page ON page_views(page_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_funnel_visitor ON conversion_funnel(visitor_id);
CREATE INDEX IF NOT EXISTS idx_funnel_stage ON conversion_funnel(stage);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_type ON hubspot_sync_log(sync_type);
-- Slack/Discord message tracking
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL, -- 'slack' or 'discord'
  platform_id TEXT NOT NULL,
  channel_id TEXT,
  channel_name TEXT,
  guild_id TEXT, -- Discord server ID
  team_id TEXT, -- Slack workspace ID
  user_id TEXT,
  user_name TEXT,
  content TEXT,
  thread_id TEXT,
  is_bot BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  reactions JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slack/Discord channels tracking
CREATE TABLE IF NOT EXISTS chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL,
  platform_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type VARCHAR(20), -- 'public', 'private', 'dm', 'thread'
  guild_id TEXT,
  team_id TEXT,
  topic TEXT,
  member_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_id)
);

-- Slack/Discord users mapping
CREATE TABLE IF NOT EXISTS chat_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL,
  platform_id TEXT NOT NULL,
  username TEXT,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  is_bot BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  status VARCHAR(20),
  timezone TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_id)
);

-- Integration configs for Slack/Discord
CREATE TABLE IF NOT EXISTS chat_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  -- Slack specific
  slack_team_id TEXT,
  slack_team_name TEXT,
  slack_bot_token TEXT,
  slack_signing_secret TEXT,
  -- Discord specific
  discord_guild_id TEXT,
  discord_guild_name TEXT,
  discord_bot_token TEXT,
  discord_public_key TEXT,
  discord_application_id TEXT,
  -- Sync settings
  sync_messages BOOLEAN DEFAULT true,
  sync_channels BOOLEAN DEFAULT true,
  sync_users BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_platform ON chat_messages(platform);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sent ON chat_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_chat_channels_platform ON chat_channels(platform);
CREATE INDEX IF NOT EXISTS idx_chat_users_platform ON chat_users(platform);

-- Insert default integration configs
INSERT INTO chat_integrations (platform, enabled) VALUES
  ('slack', false),
  ('discord', false)
ON CONFLICT (platform) DO NOTHING;
-- Unified connectors table for all OAuth integrations
CREATE TABLE IF NOT EXISTS connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'slack', 'github', 'notion', 'hubspot', 'google', 'stripe'
  
  -- Connection status
  status VARCHAR(20) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'pending'
  
  -- OAuth tokens (encrypted in production)
  access_token TEXT,
  refresh_token TEXT,
  token_type VARCHAR(50),
  expires_at TIMESTAMPTZ,
  
  -- Provider-specific identifiers
  provider_user_id TEXT,
  provider_workspace_id TEXT,
  provider_workspace_name TEXT,
  
  -- Metadata
  scopes TEXT[], -- granted OAuth scopes
  metadata JSONB DEFAULT '{}',
  
  -- Sync settings
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_error TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_connectors_user ON connectors(user_id);
CREATE INDEX IF NOT EXISTS idx_connectors_provider ON connectors(provider);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON connectors(status);

-- Enable RLS
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own connectors" ON connectors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connectors" ON connectors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connectors" ON connectors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connectors" ON connectors
  FOR DELETE USING (auth.uid() = user_id);
-- Admin users and roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'admin', -- admin, super_admin, viewer
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  entity_name TEXT,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) NOT NULL, -- success, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT false,
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy rules
CREATE TABLE IF NOT EXISTS governance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  policy_type VARCHAR(100) NOT NULL, -- data_access, action_approval, compliance
  rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  severity VARCHAR(50), -- low, medium, high, critical
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy violations
CREATE TABLE IF NOT EXISTS policy_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES governance_policies(id),
  user_email TEXT NOT NULL,
  violation_type VARCHAR(100),
  description TEXT,
  entity_type VARCHAR(100),
  entity_id UUID,
  severity VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open', -- open, acknowledged, resolved
  resolved_by TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration health monitoring
CREATE TABLE IF NOT EXISTS integration_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name TEXT NOT NULL,
  integration_type VARCHAR(100),
  status VARCHAR(50) NOT NULL, -- healthy, degraded, down
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_error_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  uptime_percentage NUMERIC(5,2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed admin user (demo)
INSERT INTO admin_users (email, full_name, role, permissions, is_active)
VALUES ('admin@integratewise.online', 'Admin User', 'super_admin', '["all"]'::jsonb, true)
ON CONFLICT (email) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_policy_violations_status ON policy_violations(status);
CREATE INDEX IF NOT EXISTS idx_policy_violations_severity ON policy_violations(severity);
CREATE INDEX IF NOT EXISTS idx_integration_health_status ON integration_health(status);
-- ================================================
-- 029: New Features Schema (Today, IQ Hub, Spine, Shadow, Goals, Insights)
-- ================================================

-- Today Dashboard: Daily tasks and priorities
CREATE TABLE IF NOT EXISTS public.today_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('task', 'meeting', 'deadline', 'goal')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  source TEXT, -- e.g., 'manual', 'hubspot', 'asana'
  source_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_today_items_user_date ON public.today_items(user_id, due_date);
CREATE INDEX idx_today_items_status ON public.today_items(status);

-- IQ Hub: AI Agents Management
CREATE TABLE IF NOT EXISTS public.iq_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('architect', 'deal_desk', 'success_pilot', 'content_engine', 'insight_miner', 'integration_architect')),
  description TEXT,
  capabilities TEXT[],
  status TEXT CHECK (status IN ('active', 'paused', 'training', 'error')) DEFAULT 'active',
  total_interactions INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  avg_response_time INTEGER, -- in milliseconds
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.iq_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.iq_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  status TEXT CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spine: Data Integration Backbone
CREATE TABLE IF NOT EXISTS public.spine_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT CHECK (category IN ('crm', 'project_management', 'communication', 'storage', 'analytics', 'payments')),
  status TEXT CHECK (status IN ('healthy', 'warning', 'error', 'disconnected')) DEFAULT 'disconnected',
  last_sync TIMESTAMPTZ,
  sync_frequency INTEGER DEFAULT 3600, -- seconds
  health_score DECIMAL(5,2),
  error_count INTEGER DEFAULT 0,
  total_syncs INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.spine_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.spine_integrations(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('success', 'partial', 'failed')),
  records_synced INTEGER DEFAULT 0,
  errors JSONB,
  duration INTEGER, -- milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shadow: AI Digital Twin
CREATE TABLE IF NOT EXISTS public.shadow_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE UNIQUE,
  personality_model JSONB DEFAULT '{}'::jsonb,
  communication_style JSONB DEFAULT '{}'::jsonb,
  decision_patterns JSONB DEFAULT '{}'::jsonb,
  learning_progress DECIMAL(5,2) DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  last_trained TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shadow_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.shadow_profiles(id) ON DELETE CASCADE,
  interaction_type TEXT,
  input TEXT,
  output TEXT,
  confidence_score DECIMAL(5,2),
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals: OKRs and Milestones
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('objective', 'key_result', 'milestone')) DEFAULT 'objective',
  parent_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  target_value DECIMAL,
  current_value DECIMAL DEFAULT 0,
  unit TEXT, -- e.g., 'revenue', 'customers', 'percentage'
  status TEXT CHECK (status IN ('not_started', 'on_track', 'at_risk', 'off_track', 'completed')) DEFAULT 'not_started',
  priority INTEGER DEFAULT 0,
  start_date DATE,
  target_date DATE,
  completed_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_status ON public.goals(user_id, status);
CREATE INDEX idx_goals_parent ON public.goals(parent_id);

-- Insights: AI Analysis and Recommendations
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('trend', 'opportunity', 'risk', 'optimization', 'prediction')),
  title TEXT NOT NULL,
  description TEXT,
  confidence_score DECIMAL(5,2),
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  data_sources TEXT[],
  recommendations JSONB DEFAULT '[]'::jsonb,
  status TEXT CHECK (status IN ('new', 'reviewed', 'acted_on', 'dismissed')) DEFAULT 'new',
  metadata JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_user_status ON public.insights(user_id, status);
CREATE INDEX idx_insights_category ON public.insights(category);

-- Enable RLS
ALTER TABLE public.today_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iq_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iq_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spine_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spine_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shadow_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shadow_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies (user-scoped)
CREATE POLICY "Users can manage their own today items" ON public.today_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view IQ agents" ON public.iq_agents
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own conversations" ON public.iq_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view spine integrations" ON public.spine_integrations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view spine logs" ON public.spine_sync_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own shadow profile" ON public.shadow_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own shadow interactions" ON public.shadow_interactions
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.shadow_profiles WHERE id = profile_id));

CREATE POLICY "Users can manage their own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights" ON public.insights
  FOR SELECT USING (auth.uid() = user_id);
-- Billing and Subscription Management Schema for IntegrateWise OS
-- Integrates with Stripe Billing for hybrid pricing (subscription + metered usage)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS billing_events CASCADE;
DROP TABLE IF EXISTS usage_records CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  plan_id TEXT NOT NULL, -- Stripe Price ID
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage records for metered billing
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.user(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  stripe_subscription_item_id TEXT,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('events_processed', 'api_calls', 'connectors_enabled', 'situations_evaluated', 'agents_active')),
  quantity INTEGER NOT NULL DEFAULT 0,
  reported_to_stripe BOOLEAN DEFAULT false,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing events for audit trail
CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.user(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('invoice_paid', 'invoice_payment_failed', 'subscription_created', 'subscription_updated', 'subscription_canceled', 'usage_reported')),
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX idx_usage_records_period ON usage_records(period_start, period_end);
CREATE INDEX idx_usage_records_metric_type ON usage_records(metric_type);
CREATE INDEX idx_billing_events_user_id ON billing_events(user_id);
CREATE INDEX idx_billing_events_type ON billing_events(type);
CREATE INDEX idx_billing_events_created_at ON billing_events(created_at);

-- RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own usage records
CREATE POLICY "Users can view own usage"
  ON usage_records FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own billing events
CREATE POLICY "Users can view own billing events"
  ON billing_events FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all billing data
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage usage"
  ON usage_records FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage billing events"
  ON billing_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Function to calculate MRR (Monthly Recurring Revenue)
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS TABLE(
  total_mrr NUMERIC,
  active_subscriptions INTEGER,
  churned_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE 
      WHEN s.status = 'active' THEN 1000 -- Placeholder: Replace with actual price lookup
      ELSE 0 
    END), 0) as total_mrr,
    COUNT(*) FILTER (WHERE s.status = 'active')::INTEGER as active_subscriptions,
    COUNT(*) FILTER (WHERE s.status = 'canceled' AND s.canceled_at >= NOW() - INTERVAL '30 days')::INTEGER as churned_this_month
  FROM subscriptions s;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for account billing data (exposed to Spine)
CREATE OR REPLACE VIEW account_billing_ext AS
SELECT 
  s.user_id,
  s.status as subscription_status,
  s.plan_id as current_plan,
  s.current_period_end as next_renewal_at,
  s.cancel_at_period_end,
  COALESCE(SUM(u.quantity) FILTER (WHERE u.metric_type = 'events_processed'), 0) as events_this_period,
  COALESCE(SUM(u.quantity) FILTER (WHERE u.metric_type = 'api_calls'), 0) as api_calls_this_period,
  COALESCE(SUM(u.quantity) FILTER (WHERE u.metric_type = 'connectors_enabled'), 0) as connectors_enabled
FROM subscriptions s
LEFT JOIN usage_records u ON s.user_id = u.user_id 
  AND u.period_start >= s.current_period_start 
  AND u.period_end <= s.current_period_end
GROUP BY s.user_id, s.status, s.plan_id, s.current_period_end, s.cancel_at_period_end;

COMMENT ON VIEW account_billing_ext IS 'Billing data exposed to Spine for Think engine analysis';
