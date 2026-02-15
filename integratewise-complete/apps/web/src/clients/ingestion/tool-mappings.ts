// src/services/ingestion/tool-mappings.ts
// Universal Tool Mappings for 8-Stage Ingestion Pipeline
// Defines data_kind, domain, entity_hints, and classification rules for each connector

export type DataKind = 'record' | 'message' | 'document' | 'telemetry' | 'chat' | 'mixed';
export type Domain = 'sales' | 'cs' | 'support' | 'product' | 'finance' | 'ops' | 'engineering' | 'marketing' | 'personal' | 'team';
export type Sensitivity = 'pii' | 'contract' | 'financial' | 'security' | 'none';

export interface EntityHint {
  type: string; // account, contact, ticket, deal, meeting, task, project, etc.
  confidence: number; // 0-1
  required_fields?: string[]; // Fields that must be present to confirm this entity
}

export interface ToolMapping {
  tool_name: string;
  display_name: string;
  category: 'crm' | 'communication' | 'productivity' | 'finance' | 'support' | 'dev_tools' | 'analytics' | 'ai';

  // Stage 2: Classifier defaults
  default_data_kind: DataKind;
  default_domain: Domain[];
  default_sensitivity: Sensitivity;

  // Entity extraction hints
  entity_hints: EntityHint[];

  // Classification rules per payload type
  payload_classifiers: {
    [key: string]: {
      data_kind: DataKind;
      domain: Domain;
      entity_hints: string[];
      sensitivity?: Sensitivity;
    };
  };

  // Extraction patterns
  extraction_config: {
    structured_paths?: string[]; // JSON paths to extract for structured data
    unstructured_fields?: string[]; // Fields containing free text
    relationship_fields?: string[]; // Fields that link to other entities
    timestamp_fields?: string[]; // Fields containing timestamps
  };

  // Filter rules
  filter_config: {
    required_scopes?: string[]; // OAuth scopes needed
    rate_limit?: { requests: number; per_seconds: number };
    dedup_key_pattern?: string; // Template for generating dedup keys
  };
}

export const TOOL_MAPPINGS: Record<string, ToolMapping> = {

  // ==========================================
  // CRM TOOLS
  // ==========================================

  salesforce: {
    tool_name: 'salesforce',
    display_name: 'Salesforce',
    category: 'crm',
    default_data_kind: 'record',
    default_domain: ['sales', 'cs'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'account', confidence: 0.95, required_fields: ['Id', 'Name'] },
      { type: 'contact', confidence: 0.95, required_fields: ['Id', 'Email'] },
      { type: 'opportunity', confidence: 0.9, required_fields: ['Id', 'StageName'] },
      { type: 'lead', confidence: 0.9, required_fields: ['Id', 'Status'] },
      { type: 'case', confidence: 0.85, required_fields: ['Id', 'Subject'] },
    ],
    payload_classifiers: {
      'Account': {
        data_kind: 'record',
        domain: 'cs',
        entity_hints: ['account', 'company'],
        sensitivity: 'pii',
      },
      'Contact': {
        data_kind: 'record',
        domain: 'cs',
        entity_hints: ['contact', 'person'],
        sensitivity: 'pii',
      },
      'Opportunity': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['deal', 'opportunity'],
      },
      'Lead': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['lead', 'prospect'],
      },
      'Case': {
        data_kind: 'record',
        domain: 'support',
        entity_hints: ['ticket', 'case'],
      },
      'Task': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['task', 'activity'],
      },
      'Event': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['meeting', 'event', 'calendar'],
      },
    },
    extraction_config: {
      structured_paths: ['Id', 'Name', 'Email', 'Phone', 'AccountId', 'OwnerId'],
      unstructured_fields: ['Description', 'Comments__c', 'Notes'],
      relationship_fields: ['AccountId', 'ContactId', 'OwnerId', 'WhoId', 'WhatId'],
      timestamp_fields: ['CreatedDate', 'LastModifiedDate', 'CloseDate'],
    },
    filter_config: {
      required_scopes: ['api', 'refresh_token'],
      rate_limit: { requests: 100, per_seconds: 20 },
      dedup_key_pattern: 'sf_{object_type}_{id}',
    },
  },

  hubspot: {
    tool_name: 'hubspot',
    display_name: 'HubSpot',
    category: 'crm',
    default_data_kind: 'record',
    default_domain: ['sales', 'marketing'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'contact', confidence: 0.95, required_fields: ['id', 'properties.email'] },
      { type: 'company', confidence: 0.95, required_fields: ['id', 'properties.name'] },
      { type: 'deal', confidence: 0.9, required_fields: ['id', 'properties.dealname'] },
      { type: 'ticket', confidence: 0.85, required_fields: ['id', 'properties.subject'] },
    ],
    payload_classifiers: {
      'contacts': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['contact', 'person'],
        sensitivity: 'pii',
      },
      'companies': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['account', 'company'],
        sensitivity: 'pii',
      },
      'deals': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['deal', 'opportunity'],
      },
      'tickets': {
        data_kind: 'record',
        domain: 'support',
        entity_hints: ['ticket', 'case'],
      },
      'engagements': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['activity', 'engagement'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'properties.*', 'associations'],
      unstructured_fields: ['properties.notes', 'properties.description'],
      relationship_fields: ['associations.*.id'],
      timestamp_fields: ['createdAt', 'updatedAt', 'properties.closedate'],
    },
    filter_config: {
      required_scopes: ['crm.objects.contacts.read', 'crm.objects.companies.read'],
      rate_limit: { requests: 100, per_seconds: 10 },
      dedup_key_pattern: 'hs_{object_type}_{id}',
    },
  },

  // ==========================================
  // COMMUNICATION TOOLS
  // ==========================================

  slack: {
    tool_name: 'slack',
    display_name: 'Slack',
    category: 'communication',
    default_data_kind: 'message',
    default_domain: ['cs', 'support', 'ops', 'team'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'message', confidence: 0.95, required_fields: ['ts', 'text'] },
      { type: 'thread', confidence: 0.9, required_fields: ['thread_ts'] },
      { type: 'channel', confidence: 0.85, required_fields: ['channel'] },
      { type: 'user', confidence: 0.8, required_fields: ['user'] },
    ],
    payload_classifiers: {
      'message': {
        data_kind: 'message',
        domain: 'team',
        entity_hints: ['message', 'conversation'],
      },
      'channel': {
        data_kind: 'record',
        domain: 'team',
        entity_hints: ['channel', 'conversation_space'],
      },
      'user': {
        data_kind: 'record',
        domain: 'team',
        entity_hints: ['user', 'person'],
        sensitivity: 'pii',
      },
      'file': {
        data_kind: 'document',
        domain: 'team',
        entity_hints: ['file', 'attachment'],
      },
    },
    extraction_config: {
      structured_paths: ['ts', 'user', 'channel', 'thread_ts', 'reactions'],
      unstructured_fields: ['text', 'blocks.*.text.text'],
      relationship_fields: ['user', 'channel', 'thread_ts', 'parent_user_id'],
      timestamp_fields: ['ts', 'thread_ts', 'edited.ts'],
    },
    filter_config: {
      required_scopes: ['channels:history', 'groups:history', 'im:history', 'mpim:history'],
      rate_limit: { requests: 50, per_seconds: 60 },
      dedup_key_pattern: 'slack_{channel}_{ts}',
    },
  },

  gmail: {
    tool_name: 'gmail',
    display_name: 'Gmail',
    category: 'communication',
    default_data_kind: 'message',
    default_domain: ['personal', 'sales', 'cs'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'email', confidence: 0.95, required_fields: ['id', 'threadId'] },
      { type: 'thread', confidence: 0.9, required_fields: ['threadId'] },
      { type: 'contact', confidence: 0.85, required_fields: ['from', 'to'] },
    ],
    payload_classifiers: {
      'message': {
        data_kind: 'message',
        domain: 'personal',
        entity_hints: ['email', 'message'],
        sensitivity: 'pii',
      },
      'thread': {
        data_kind: 'message',
        domain: 'personal',
        entity_hints: ['thread', 'conversation'],
      },
      'draft': {
        data_kind: 'message',
        domain: 'personal',
        entity_hints: ['draft', 'email'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'threadId', 'labelIds', 'from', 'to', 'cc', 'bcc', 'subject'],
      unstructured_fields: ['snippet', 'payload.body.data', 'payload.parts.*.body.data'],
      relationship_fields: ['threadId', 'inReplyTo', 'references'],
      timestamp_fields: ['internalDate', 'date'],
    },
    filter_config: {
      required_scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      rate_limit: { requests: 250, per_seconds: 1 },
      dedup_key_pattern: 'gmail_{id}',
    },
  },

  outlook: {
    tool_name: 'outlook',
    display_name: 'Microsoft Outlook',
    category: 'communication',
    default_data_kind: 'message',
    default_domain: ['personal', 'sales', 'cs'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'email', confidence: 0.95, required_fields: ['id', 'conversationId'] },
      { type: 'meeting', confidence: 0.9, required_fields: ['id', 'start', 'end'] },
      { type: 'contact', confidence: 0.85, required_fields: ['emailAddresses'] },
    ],
    payload_classifiers: {
      'message': {
        data_kind: 'message',
        domain: 'personal',
        entity_hints: ['email', 'message'],
        sensitivity: 'pii',
      },
      'event': {
        data_kind: 'record',
        domain: 'personal',
        entity_hints: ['meeting', 'calendar', 'event'],
      },
      'contact': {
        data_kind: 'record',
        domain: 'personal',
        entity_hints: ['contact', 'person'],
        sensitivity: 'pii',
      },
    },
    extraction_config: {
      structured_paths: ['id', 'conversationId', 'from', 'toRecipients', 'subject'],
      unstructured_fields: ['body.content', 'bodyPreview'],
      relationship_fields: ['conversationId', 'parentFolderId'],
      timestamp_fields: ['receivedDateTime', 'sentDateTime', 'createdDateTime'],
    },
    filter_config: {
      required_scopes: ['Mail.Read', 'Calendars.Read', 'Contacts.Read'],
      rate_limit: { requests: 2000, per_seconds: 60 },
      dedup_key_pattern: 'outlook_{id}',
    },
  },

  // ==========================================
  // PRODUCTIVITY TOOLS
  // ==========================================

  notion: {
    tool_name: 'notion',
    display_name: 'Notion',
    category: 'productivity',
    default_data_kind: 'document',
    default_domain: ['ops', 'engineering', 'personal'],
    default_sensitivity: 'none',
    entity_hints: [
      { type: 'page', confidence: 0.95, required_fields: ['id', 'object'] },
      { type: 'database', confidence: 0.9, required_fields: ['id', 'title'] },
      { type: 'block', confidence: 0.85, required_fields: ['id', 'type'] },
    ],
    payload_classifiers: {
      'page': {
        data_kind: 'document',
        domain: 'ops',
        entity_hints: ['doc', 'page', 'note'],
      },
      'database': {
        data_kind: 'mixed',
        domain: 'ops',
        entity_hints: ['database', 'table', 'collection'],
      },
      'block': {
        data_kind: 'document',
        domain: 'ops',
        entity_hints: ['content', 'block'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'properties.*', 'parent', 'archived'],
      unstructured_fields: ['title', 'description', 'content', 'blocks.*.text'],
      relationship_fields: ['parent.page_id', 'parent.database_id'],
      timestamp_fields: ['created_time', 'last_edited_time'],
    },
    filter_config: {
      required_scopes: ['read_content', 'read_user'],
      rate_limit: { requests: 3, per_seconds: 1 },
      dedup_key_pattern: 'notion_{object}_{id}',
    },
  },

  google_drive: {
    tool_name: 'google_drive',
    display_name: 'Google Drive',
    category: 'productivity',
    default_data_kind: 'document',
    default_domain: ['personal', 'team', 'ops'],
    default_sensitivity: 'none',
    entity_hints: [
      { type: 'file', confidence: 0.95, required_fields: ['id', 'name', 'mimeType'] },
      { type: 'folder', confidence: 0.9, required_fields: ['id', 'mimeType'] },
      { type: 'document', confidence: 0.85, required_fields: ['id'] },
    ],
    payload_classifiers: {
      'file': {
        data_kind: 'document',
        domain: 'personal',
        entity_hints: ['file', 'document'],
      },
      'folder': {
        data_kind: 'record',
        domain: 'personal',
        entity_hints: ['folder', 'directory'],
      },
      'comment': {
        data_kind: 'message',
        domain: 'team',
        entity_hints: ['comment', 'note'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'name', 'mimeType', 'parents', 'owners', 'permissions'],
      unstructured_fields: ['description', 'fullText', 'content'],
      relationship_fields: ['parents', 'owners.*.emailAddress', 'permissions.*.emailAddress'],
      timestamp_fields: ['createdTime', 'modifiedTime', 'viewedByMeTime'],
    },
    filter_config: {
      required_scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      rate_limit: { requests: 1000, per_seconds: 100 },
      dedup_key_pattern: 'gdrive_{id}',
    },
  },

  // ==========================================
  // SUPPORT TOOLS
  // ==========================================

  zendesk: {
    tool_name: 'zendesk',
    display_name: 'Zendesk',
    category: 'support',
    default_data_kind: 'record',
    default_domain: ['support', 'cs'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'ticket', confidence: 0.95, required_fields: ['id', 'subject'] },
      { type: 'user', confidence: 0.9, required_fields: ['id', 'email'] },
      { type: 'organization', confidence: 0.85, required_fields: ['id', 'name'] },
    ],
    payload_classifiers: {
      'ticket': {
        data_kind: 'record',
        domain: 'support',
        entity_hints: ['ticket', 'case', 'issue'],
      },
      'user': {
        data_kind: 'record',
        domain: 'support',
        entity_hints: ['user', 'contact', 'person'],
        sensitivity: 'pii',
      },
      'organization': {
        data_kind: 'record',
        domain: 'cs',
        entity_hints: ['account', 'organization', 'company'],
      },
      'comment': {
        data_kind: 'message',
        domain: 'support',
        entity_hints: ['comment', 'note', 'message'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'subject', 'status', 'priority', 'type', 'requester_id', 'organization_id'],
      unstructured_fields: ['description', 'comments.*.body'],
      relationship_fields: ['requester_id', 'submitter_id', 'assignee_id', 'organization_id'],
      timestamp_fields: ['created_at', 'updated_at', 'due_at'],
    },
    filter_config: {
      required_scopes: ['read', 'write'],
      rate_limit: { requests: 700, per_seconds: 60 },
      dedup_key_pattern: 'zendesk_ticket_{id}',
    },
  },

  intercom: {
    tool_name: 'intercom',
    display_name: 'Intercom',
    category: 'support',
    default_data_kind: 'mixed',
    default_domain: ['support', 'cs', 'sales'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'conversation', confidence: 0.95, required_fields: ['id', 'conversation_parts'] },
      { type: 'user', confidence: 0.9, required_fields: ['id', 'email'] },
      { type: 'company', confidence: 0.85, required_fields: ['id', 'name'] },
    ],
    payload_classifiers: {
      'conversation': {
        data_kind: 'message',
        domain: 'support',
        entity_hints: ['conversation', 'thread', 'chat'],
      },
      'user': {
        data_kind: 'record',
        domain: 'cs',
        entity_hints: ['user', 'contact'],
        sensitivity: 'pii',
      },
      'company': {
        data_kind: 'record',
        domain: 'cs',
        entity_hints: ['account', 'company'],
      },
      'ticket': {
        data_kind: 'record',
        domain: 'support',
        entity_hints: ['ticket', 'case'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'type', 'user', 'contacts', 'teammates', 'custom_attributes'],
      unstructured_fields: ['conversation_parts.*.body', 'notes.*.body'],
      relationship_fields: ['user.id', 'contacts.*.id', 'company_ids'],
      timestamp_fields: ['created_at', 'updated_at', 'waiting_since'],
    },
    filter_config: {
      required_scopes: ['read'],
      rate_limit: { requests: 1000, per_seconds: 60 },
      dedup_key_pattern: 'intercom_{type}_{id}',
    },
  },

  // ==========================================
  // FINANCE TOOLS
  // ==========================================

  stripe: {
    tool_name: 'stripe',
    display_name: 'Stripe',
    category: 'finance',
    default_data_kind: 'record',
    default_domain: ['finance'],
    default_sensitivity: 'financial',
    entity_hints: [
      { type: 'payment', confidence: 0.95, required_fields: ['id', 'amount'] },
      { type: 'customer', confidence: 0.9, required_fields: ['id', 'email'] },
      { type: 'subscription', confidence: 0.9, required_fields: ['id', 'status'] },
      { type: 'invoice', confidence: 0.85, required_fields: ['id', 'total'] },
    ],
    payload_classifiers: {
      'charge': {
        data_kind: 'telemetry',
        domain: 'finance',
        entity_hints: ['payment', 'transaction', 'charge'],
        sensitivity: 'financial',
      },
      'customer': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['customer', 'account'],
        sensitivity: 'pii',
      },
      'subscription': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['subscription', 'recurring'],
        sensitivity: 'financial',
      },
      'invoice': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['invoice', 'bill'],
        sensitivity: 'financial',
      },
      'payment_intent': {
        data_kind: 'telemetry',
        domain: 'finance',
        entity_hints: ['payment_intent', 'transaction'],
        sensitivity: 'financial',
      },
    },
    extraction_config: {
      structured_paths: ['id', 'amount', 'currency', 'customer', 'status', 'metadata'],
      unstructured_fields: ['description', 'statement_descriptor'],
      relationship_fields: ['customer', 'subscription', 'invoice', 'payment_method'],
      timestamp_fields: ['created', 'updated', 'period_start', 'period_end'],
    },
    filter_config: {
      required_scopes: ['read_only'],
      rate_limit: { requests: 100, per_seconds: 1 },
      dedup_key_pattern: 'stripe_{object}_{id}',
    },
  },

  quickbooks: {
    tool_name: 'quickbooks',
    display_name: 'QuickBooks',
    category: 'finance',
    default_data_kind: 'record',
    default_domain: ['finance'],
    default_sensitivity: 'financial',
    entity_hints: [
      { type: 'invoice', confidence: 0.95, required_fields: ['Id', 'TotalAmt'] },
      { type: 'customer', confidence: 0.9, required_fields: ['Id', 'DisplayName'] },
      { type: 'payment', confidence: 0.9, required_fields: ['Id', 'TotalAmt'] },
    ],
    payload_classifiers: {
      'Invoice': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['invoice', 'bill'],
        sensitivity: 'financial',
      },
      'Customer': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['customer', 'account'],
        sensitivity: 'pii',
      },
      'Payment': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['payment', 'transaction'],
        sensitivity: 'financial',
      },
      'Estimate': {
        data_kind: 'record',
        domain: 'finance',
        entity_hints: ['quote', 'estimate'],
      },
    },
    extraction_config: {
      structured_paths: ['Id', 'TotalAmt', 'CustomerRef', 'TxnDate', 'DueDate', 'Balance'],
      unstructured_fields: ['CustomerMemo', 'PrivateNote', 'Line.*.Description'],
      relationship_fields: ['CustomerRef.value', 'SalesTermRef.value'],
      timestamp_fields: ['TxnDate', 'DueDate', 'MetaData.CreateTime', 'MetaData.LastUpdatedTime'],
    },
    filter_config: {
      required_scopes: ['com.intuit.quickbooks.accounting'],
      rate_limit: { requests: 500, per_seconds: 60 },
      dedup_key_pattern: 'qb_{domain}_{Id}',
    },
  },

  // ==========================================
  // DEV TOOLS
  // ==========================================

  github: {
    tool_name: 'github',
    display_name: 'GitHub',
    category: 'dev_tools',
    default_data_kind: 'mixed',
    default_domain: ['engineering', 'product'],
    default_sensitivity: 'none',
    entity_hints: [
      { type: 'repository', confidence: 0.95, required_fields: ['id', 'name'] },
      { type: 'issue', confidence: 0.9, required_fields: ['id', 'title'] },
      { type: 'pull_request', confidence: 0.9, required_fields: ['id', 'title'] },
      { type: 'commit', confidence: 0.85, required_fields: ['sha', 'message'] },
    ],
    payload_classifiers: {
      'repository': {
        data_kind: 'record',
        domain: 'engineering',
        entity_hints: ['repo', 'project'],
      },
      'issue': {
        data_kind: 'record',
        domain: 'product',
        entity_hints: ['issue', 'task', 'ticket'],
      },
      'pull_request': {
        data_kind: 'record',
        domain: 'engineering',
        entity_hints: ['pull_request', 'pr', 'code_review'],
      },
      'commit': {
        data_kind: 'telemetry',
        domain: 'engineering',
        entity_hints: ['commit', 'change'],
      },
      'comment': {
        data_kind: 'message',
        domain: 'engineering',
        entity_hints: ['comment', 'review'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'number', 'state', 'labels', 'assignees', 'milestone'],
      unstructured_fields: ['title', 'body', 'description', 'commit.message'],
      relationship_fields: ['user.id', 'assignees.*.id', 'repository.id', 'pull_request.id'],
      timestamp_fields: ['created_at', 'updated_at', 'closed_at', 'merged_at'],
    },
    filter_config: {
      required_scopes: ['repo', 'read:org'],
      rate_limit: { requests: 5000, per_seconds: 3600 },
      dedup_key_pattern: 'gh_{object}_{id}',
    },
  },

  jira: {
    tool_name: 'jira',
    display_name: 'Jira',
    category: 'dev_tools',
    default_data_kind: 'record',
    default_domain: ['product', 'engineering'],
    default_sensitivity: 'none',
    entity_hints: [
      { type: 'issue', confidence: 0.95, required_fields: ['id', 'key'] },
      { type: 'project', confidence: 0.9, required_fields: ['id', 'key'] },
      { type: 'sprint', confidence: 0.85, required_fields: ['id', 'name'] },
    ],
    payload_classifiers: {
      'issue': {
        data_kind: 'record',
        domain: 'product',
        entity_hints: ['issue', 'task', 'story', 'bug'],
      },
      'project': {
        data_kind: 'record',
        domain: 'engineering',
        entity_hints: ['project', 'workspace'],
      },
      'sprint': {
        data_kind: 'record',
        domain: 'engineering',
        entity_hints: ['sprint', 'iteration'],
      },
      'comment': {
        data_kind: 'message',
        domain: 'product',
        entity_hints: ['comment', 'note'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'key', 'fields.status', 'fields.assignee', 'fields.priority'],
      unstructured_fields: ['fields.summary', 'fields.description', 'fields.comment.comments.*.body'],
      relationship_fields: ['fields.project.id', 'fields.assignee.accountId', 'fields.parent.key'],
      timestamp_fields: ['fields.created', 'fields.updated', 'fields.resolutiondate'],
    },
    filter_config: {
      required_scopes: ['read:jira-work'],
      rate_limit: { requests: 10, per_seconds: 1 },
      dedup_key_pattern: 'jira_{id}',
    },
  },

  // ==========================================
  // ANALYTICS TOOLS
  // ==========================================

  segment: {
    tool_name: 'segment',
    display_name: 'Segment',
    category: 'analytics',
    default_data_kind: 'telemetry',
    default_domain: ['product', 'marketing'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'event', confidence: 0.95, required_fields: ['type', 'userId'] },
      { type: 'user', confidence: 0.9, required_fields: ['userId', 'traits'] },
    ],
    payload_classifiers: {
      'track': {
        data_kind: 'telemetry',
        domain: 'product',
        entity_hints: ['event', 'activity', 'action'],
      },
      'identify': {
        data_kind: 'record',
        domain: 'product',
        entity_hints: ['user', 'profile'],
        sensitivity: 'pii',
      },
      'page': {
        data_kind: 'telemetry',
        domain: 'marketing',
        entity_hints: ['pageview', 'navigation'],
      },
      'screen': {
        data_kind: 'telemetry',
        domain: 'product',
        entity_hints: ['screen', 'view'],
      },
    },
    extraction_config: {
      structured_paths: ['type', 'userId', 'anonymousId', 'event', 'properties', 'traits'],
      unstructured_fields: ['properties.name', 'properties.description'],
      relationship_fields: ['userId', 'anonymousId', 'groupId'],
      timestamp_fields: ['timestamp', 'sentAt', 'receivedAt'],
    },
    filter_config: {
      required_scopes: ['read'],
      rate_limit: { requests: 1000, per_seconds: 1 },
      dedup_key_pattern: 'segment_{type}_{messageId}',
    },
  },

  mixpanel: {
    tool_name: 'mixpanel',
    display_name: 'Mixpanel',
    category: 'analytics',
    default_data_kind: 'telemetry',
    default_domain: ['product', 'marketing'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'event', confidence: 0.95, required_fields: ['event', 'distinct_id'] },
      { type: 'user', confidence: 0.9, required_fields: ['distinct_id', '$properties'] },
    ],
    payload_classifiers: {
      'event': {
        data_kind: 'telemetry',
        domain: 'product',
        entity_hints: ['event', 'action'],
      },
      'user': {
        data_kind: 'record',
        domain: 'product',
        entity_hints: ['user', 'profile'],
        sensitivity: 'pii',
      },
    },
    extraction_config: {
      structured_paths: ['event', 'distinct_id', 'properties', '$properties'],
      unstructured_fields: ['properties.$name', 'properties.description'],
      relationship_fields: ['distinct_id', '$user_id'],
      timestamp_fields: ['time', '$time', 'properties.$created'],
    },
    filter_config: {
      required_scopes: ['read'],
      rate_limit: { requests: 60, per_seconds: 60 },
      dedup_key_pattern: 'mp_{event}_{insert_id}',
    },
  },

  // ==========================================
  // AI TOOLS
  // ==========================================

  openai_api: {
    tool_name: 'openai_api',
    display_name: 'OpenAI API',
    category: 'ai',
    default_data_kind: 'chat',
    default_domain: ['personal', 'product'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'chat', confidence: 0.95, required_fields: ['id', 'messages'] },
      { type: 'completion', confidence: 0.9, required_fields: ['id', 'choices'] },
    ],
    payload_classifiers: {
      'chat.completion': {
        data_kind: 'chat',
        domain: 'personal',
        entity_hints: ['chat', 'conversation', 'ai_session'],
      },
      'completion': {
        data_kind: 'chat',
        domain: 'personal',
        entity_hints: ['completion', 'generation'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'model', 'usage', 'choices.*.finish_reason'],
      unstructured_fields: ['choices.*.message.content', 'messages.*.content'],
      relationship_fields: ['user', 'session_id'],
      timestamp_fields: ['created'],
    },
    filter_config: {
      required_scopes: ['api_key'],
      rate_limit: { requests: 10000, per_seconds: 60 },
      dedup_key_pattern: 'openai_{id}',
    },
  },

  anthropic_api: {
    tool_name: 'anthropic_api',
    display_name: 'Anthropic API',
    category: 'ai',
    default_data_kind: 'chat',
    default_domain: ['personal', 'product'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'chat', confidence: 0.95, required_fields: ['id', 'content'] },
      { type: 'message', confidence: 0.9, required_fields: ['role', 'content'] },
    ],
    payload_classifiers: {
      'message': {
        data_kind: 'chat',
        domain: 'personal',
        entity_hints: ['message', 'chat', 'conversation'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'type', 'role', 'model', 'usage'],
      unstructured_fields: ['content.*.text'],
      relationship_fields: ['conversation_id'],
      timestamp_fields: ['created_at'],
    },
    filter_config: {
      required_scopes: ['api_key'],
      rate_limit: { requests: 50, per_seconds: 60 },
      dedup_key_pattern: 'anthropic_{id}',
    },
  },

  // ==========================================
  // CALENDAR & SCHEDULING
  // ==========================================

  google_calendar: {
    tool_name: 'google_calendar',
    display_name: 'Google Calendar',
    category: 'productivity',
    default_data_kind: 'record',
    default_domain: ['personal', 'cs', 'sales'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'event', confidence: 0.95, required_fields: ['id', 'summary'] },
      { type: 'meeting', confidence: 0.9, required_fields: ['id', 'start', 'end'] },
    ],
    payload_classifiers: {
      'event': {
        data_kind: 'record',
        domain: 'personal',
        entity_hints: ['event', 'meeting', 'calendar'],
      },
    },
    extraction_config: {
      structured_paths: ['id', 'summary', 'start', 'end', 'attendees', 'organizer', 'status'],
      unstructured_fields: ['description', 'location'],
      relationship_fields: ['attendees.*.email', 'organizer.email', 'recurringEventId'],
      timestamp_fields: ['start.dateTime', 'end.dateTime', 'created', 'updated'],
    },
    filter_config: {
      required_scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      rate_limit: { requests: 1000000, per_seconds: 86400 },
      dedup_key_pattern: 'gcal_{id}',
    },
  },

  calendly: {
    tool_name: 'calendly',
    display_name: 'Calendly',
    category: 'productivity',
    default_data_kind: 'record',
    default_domain: ['sales', 'cs'],
    default_sensitivity: 'pii',
    entity_hints: [
      { type: 'event', confidence: 0.95, required_fields: ['uri', 'name'] },
      { type: 'invitee', confidence: 0.9, required_fields: ['email', 'name'] },
    ],
    payload_classifiers: {
      'scheduled_event': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['meeting', 'event', 'booking'],
      },
      'invitee': {
        data_kind: 'record',
        domain: 'sales',
        entity_hints: ['invitee', 'contact'],
        sensitivity: 'pii',
      },
    },
    extraction_config: {
      structured_paths: ['uri', 'name', 'status', 'start_time', 'end_time', 'invitees_counter'],
      unstructured_fields: ['location.location', 'invitees.*.text_reminder_number'],
      relationship_fields: ['event_memberships.*.user', 'invitees.*.uri'],
      timestamp_fields: ['start_time', 'end_time', 'created_at', 'updated_at'],
    },
    filter_config: {
      required_scopes: ['read'],
      rate_limit: { requests: 100000, per_seconds: 86400 },
      dedup_key_pattern: 'calendly_{uri}',
    },
  },
};

// Helper function to get tool mapping
export function getToolMapping(toolName: string): ToolMapping | undefined {
  return TOOL_MAPPINGS[toolName];
}

// Helper function to classify payload
export function classifyPayload(
  toolName: string,
  payloadType: string
): {
  data_kind: DataKind;
  domain: Domain;
  entity_hints: string[];
  sensitivity?: Sensitivity;
} | undefined {
  const mapping = TOOL_MAPPINGS[toolName];
  if (!mapping) return undefined;

  return mapping.payload_classifiers[payloadType] || {
    data_kind: mapping.default_data_kind,
    domain: mapping.default_domain[0],
    entity_hints: mapping.entity_hints.map(h => h.type),
    sensitivity: mapping.default_sensitivity,
  };
}

// Helper function to get all supported tools
export function getSupportedTools(): string[] {
  return Object.keys(TOOL_MAPPINGS);
}

// Helper function to get tools by category
export function getToolsByCategory(category: ToolMapping['category']): ToolMapping[] {
  return Object.values(TOOL_MAPPINGS).filter(m => m.category === category);
}
