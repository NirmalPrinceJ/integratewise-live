/**
 * IntegrateWise V11.11 - Loader Types
 * 
 * LOOP B: Ingestion Pipeline
 * The Loader captures raw data from external tools.
 * Data flows: Tool API/Webhook → Loader → Normalizer → Spine (Truth)
 */

// =============================================================================
// CONNECTOR CONFIGURATION
// =============================================================================

export interface Connector {
  connector_id: string;
  workspace_id: string;
  
  // Connector info
  name: string;
  connector_type: ConnectorType;
  
  // Auth
  auth_type: 'oauth2' | 'api_key' | 'basic';
  credentials?: ConnectorCredentials; // Encrypted
  
  // Sync config
  sync_enabled: boolean;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  last_sync_at?: string;
  next_sync_at?: string;
  
  // Status
  status: 'active' | 'paused' | 'error' | 'disconnected';
  error_message?: string;
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  created_at: string;
  updated_at: string;
}

export type ConnectorType = 
  // CRM
  | 'salesforce'
  | 'hubspot'
  | 'zoho'
  | 'pipedrive'
  // Support
  | 'zendesk'
  | 'intercom'
  | 'freshdesk'
  // Billing
  | 'stripe'
  | 'chargebee'
  | 'razorpay'
  // Communications
  | 'slack'
  | 'gmail'
  | 'outlook'
  | 'discord'
  // Files
  | 'box'
  | 'google_drive'
  | 'dropbox'
  | 'notion'
  // Project Management
  | 'asana'
  | 'jira'
  | 'linear'
  | 'monday'
  // Analytics
  | 'segment'
  | 'mixpanel'
  | 'amplitude';

export interface ConnectorCredentials {
  // OAuth2
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  
  // API Key
  api_key?: string;
  
  // Basic Auth
  username?: string;
  password?: string;
  
  // Additional (varies by connector)
  instance_url?: string;
  organization_id?: string;
}

// =============================================================================
// RAW EVENTS
// =============================================================================

export interface RawEvent {
  event_id: string;
  workspace_id: string;
  connector_id?: string;
  
  // Source
  source_type: 'webhook' | 'api_pull' | 'import';
  source_system: ConnectorType;
  
  // Event data
  event_type: string; // e.g., 'account.created', 'deal.updated'
  external_id?: string;
  payload: Record<string, unknown>;
  
  // Processing status
  status: RawEventStatus;
  processed_at?: string;
  error_message?: string;
  
  // Normalization result
  spine_entity_type?: string;
  spine_entity_id?: string;
  
  // Audit
  received_at: string;
  created_at: string;
}

export type RawEventStatus = 
  | 'pending'
  | 'processing'
  | 'normalized'
  | 'failed'
  | 'skipped';

// =============================================================================
// SYNC LOG
// =============================================================================

export interface SyncLog {
  sync_id: string;
  workspace_id: string;
  connector_id?: string;
  
  // Sync info
  sync_type: 'full' | 'incremental' | 'webhook';
  
  // Stats
  records_fetched: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  records_skipped: number;
  
  // Timing
  started_at: string;
  completed_at?: string;
  
  // Status
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
  error_details?: Record<string, unknown>;
  
  // Metadata
  metadata?: Record<string, unknown>;
}

// =============================================================================
// NORMALIZER MAPPINGS
// =============================================================================

/**
 * Field mapping from source system to Spine schema
 */
export interface FieldMapping {
  source_field: string;
  spine_field: string;
  transform?: FieldTransform;
}

export type FieldTransform = 
  | { type: 'direct' }
  | { type: 'lowercase' }
  | { type: 'uppercase' }
  | { type: 'date_format'; from: string; to: string }
  | { type: 'map_value'; mappings: Record<string, string> }
  | { type: 'extract_domain' }
  | { type: 'concatenate'; fields: string[]; separator: string }
  | { type: 'custom'; function_name: string };

/**
 * Entity mapping configuration for a connector
 */
export interface EntityMapping {
  source_entity: string; // e.g., 'Account', 'Contact', 'Opportunity'
  spine_entity: string;  // e.g., 'organization', 'person', 'deal'
  
  // Field mappings
  field_mappings: FieldMapping[];
  
  // Identity resolution
  external_id_field: string;
  
  // Deduplication
  dedupe_fields?: string[];
  
  // Filters
  sync_filter?: {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
    value: unknown;
  };
}

// =============================================================================
// CONNECTOR CONFIGS (Built-in mappings)
// =============================================================================

export const SALESFORCE_MAPPINGS: EntityMapping[] = [
  {
    source_entity: 'Account',
    spine_entity: 'organization',
    external_id_field: 'Id',
    field_mappings: [
      { source_field: 'Name', spine_field: 'name' },
      { source_field: 'Website', spine_field: 'domain', transform: { type: 'extract_domain' } },
      { source_field: 'Industry', spine_field: 'industry' },
      { source_field: 'BillingCountry', spine_field: 'region' },
      { source_field: 'NumberOfEmployees', spine_field: 'employee_count' },
      { source_field: 'AnnualRevenue', spine_field: 'arr' },
      { source_field: 'Type', spine_field: 'segment', transform: { 
        type: 'map_value', 
        mappings: {
          'Enterprise': 'enterprise',
          'Mid-Market': 'mid_market',
          'SMB': 'smb',
          'Startup': 'startup'
        }
      }},
    ],
    dedupe_fields: ['domain', 'name'],
  },
  {
    source_entity: 'Contact',
    spine_entity: 'person',
    external_id_field: 'Id',
    field_mappings: [
      { source_field: 'FirstName', spine_field: 'first_name' },
      { source_field: 'LastName', spine_field: 'last_name' },
      { source_field: 'Email', spine_field: 'email', transform: { type: 'lowercase' } },
      { source_field: 'Phone', spine_field: 'phone' },
      { source_field: 'Title', spine_field: 'job_title' },
      { source_field: 'Department', spine_field: 'department' },
      { source_field: 'AccountId', spine_field: 'organization_id' },
    ],
    dedupe_fields: ['email'],
  },
  {
    source_entity: 'Opportunity',
    spine_entity: 'deal',
    external_id_field: 'Id',
    field_mappings: [
      { source_field: 'Name', spine_field: 'name' },
      { source_field: 'StageName', spine_field: 'stage', transform: {
        type: 'map_value',
        mappings: {
          'Prospecting': 'discovery',
          'Qualification': 'qualification',
          'Proposal/Price Quote': 'proposal',
          'Negotiation/Review': 'negotiation',
          'Closed Won': 'closed_won',
          'Closed Lost': 'closed_lost'
        }
      }},
      { source_field: 'Amount', spine_field: 'amount' },
      { source_field: 'Probability', spine_field: 'probability' },
      { source_field: 'CloseDate', spine_field: 'expected_close_date' },
      { source_field: 'AccountId', spine_field: 'organization_id' },
    ],
  },
];

export const HUBSPOT_MAPPINGS: EntityMapping[] = [
  {
    source_entity: 'company',
    spine_entity: 'organization',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'properties.name', spine_field: 'name' },
      { source_field: 'properties.domain', spine_field: 'domain' },
      { source_field: 'properties.industry', spine_field: 'industry' },
      { source_field: 'properties.numberofemployees', spine_field: 'employee_count' },
      { source_field: 'properties.annualrevenue', spine_field: 'arr' },
    ],
    dedupe_fields: ['domain'],
  },
  {
    source_entity: 'contact',
    spine_entity: 'person',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'properties.firstname', spine_field: 'first_name' },
      { source_field: 'properties.lastname', spine_field: 'last_name' },
      { source_field: 'properties.email', spine_field: 'email', transform: { type: 'lowercase' } },
      { source_field: 'properties.phone', spine_field: 'phone' },
      { source_field: 'properties.jobtitle', spine_field: 'job_title' },
    ],
    dedupe_fields: ['email'],
  },
  {
    source_entity: 'deal',
    spine_entity: 'deal',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'properties.dealname', spine_field: 'name' },
      { source_field: 'properties.dealstage', spine_field: 'stage' },
      { source_field: 'properties.amount', spine_field: 'amount' },
      { source_field: 'properties.closedate', spine_field: 'expected_close_date' },
    ],
  },
];

export const ZENDESK_MAPPINGS: EntityMapping[] = [
  {
    source_entity: 'organization',
    spine_entity: 'organization',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'name', spine_field: 'name' },
      { source_field: 'domain_names[0]', spine_field: 'domain' },
    ],
    dedupe_fields: ['domain'],
  },
  {
    source_entity: 'user',
    spine_entity: 'person',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'name', spine_field: 'full_name' },
      { source_field: 'email', spine_field: 'email', transform: { type: 'lowercase' } },
      { source_field: 'phone', spine_field: 'phone' },
    ],
    dedupe_fields: ['email'],
    sync_filter: { field: 'role', operator: 'ne', value: 'agent' },
  },
  {
    source_entity: 'ticket',
    spine_entity: 'ticket',
    external_id_field: 'id',
    field_mappings: [
      { source_field: 'subject', spine_field: 'subject' },
      { source_field: 'description', spine_field: 'description' },
      { source_field: 'status', spine_field: 'status', transform: {
        type: 'map_value',
        mappings: {
          'new': 'open',
          'open': 'in_progress',
          'pending': 'pending',
          'solved': 'resolved',
          'closed': 'closed'
        }
      }},
      { source_field: 'priority', spine_field: 'priority' },
    ],
  },
];

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

export interface WebhookPayload {
  source: ConnectorType;
  event_type: string;
  timestamp: string;
  data: Record<string, unknown>;
  signature?: string;
}

export interface WebhookValidation {
  valid: boolean;
  error?: string;
}

export interface ProcessedWebhook {
  event_id: string;
  source: ConnectorType;
  event_type: string;
  action: 'create' | 'update' | 'delete' | 'skip';
  spine_entity?: string;
  spine_id?: string;
  external_id?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}
