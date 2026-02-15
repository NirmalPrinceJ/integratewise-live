/**
 * IntegrateWise OS - Progressive Hydration Buckets
 * 
 * Maps the 8-bucket system (B0-B7) from the architecture flowchart
 * to module gating and feature enablement.
 * 
 * BUCKET HIERARCHY:
 * B0: Identity + Workspace → Basic nav, preferences
 * B1: Manual Core Objects → Projects, Tasks, Notes, Docs metadata
 * B2: Document Context → Uploads to R2 + metadata in D1
 * B3: Knowledge Index → Chunking + embeddings + topics
 * B4: External Tool Sync → CRM/Support/Calendar/Slack entities
 * B5: Health Metrics Packs → Account health scaffolds
 * B6: Governance Readiness → Approvals config + audit trails
 * B7: Automation Readiness → Workflows + agents allowed
 */

import type { DataStrengthLevel } from './data-strength';

// =============================================================================
// BUCKET DEFINITIONS
// =============================================================================

export type HydrationBucket = 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7';

export interface BucketDefinition {
  id: HydrationBucket;
  name: string;
  description: string;
  requiredSources: BucketRequirement[];
  enablesModules: string[];
  enablesFeatures: string[];
}

export interface BucketRequirement {
  type: 'entity_count' | 'tool_connected' | 'document_count' | 'knowledge_count' | 'feature_enabled';
  key: string;
  minValue: number;
}

export const HYDRATION_BUCKETS: BucketDefinition[] = [
  {
    id: 'B0',
    name: 'Identity + Workspace',
    description: 'Tenant/user/roles, basic nav + preferences',
    requiredSources: [
      { type: 'entity_count', key: 'users', minValue: 1 },
    ],
    enablesModules: ['home', 'profile', 'settings'],
    enablesFeatures: ['basic_nav', 'user_preferences', 'theme_customization']
  },
  {
    id: 'B1',
    name: 'Manual Core Objects',
    description: 'Projects, Tasks, Notes, Docs metadata, Accounts minimal (manual)',
    requiredSources: [
      { type: 'entity_count', key: 'entities', minValue: 5 },
    ],
    enablesModules: ['projects', 'tasks', 'notes', 'docs'],
    enablesFeatures: ['manual_entry', 'basic_crud', 'entity_views']
  },
  {
    id: 'B2',
    name: 'Document Context',
    description: 'Uploads to R2 + metadata in D1, Context facts extracted (light)',
    requiredSources: [
      { type: 'document_count', key: 'documents', minValue: 5 },
    ],
    enablesModules: ['context', 'documents'],
    enablesFeatures: ['file_upload', 'document_preview', 'basic_extraction']
  },
  {
    id: 'B3',
    name: 'Knowledge Index',
    description: 'Chunking + embeddings, topics + retrieval working',
    requiredSources: [
      { type: 'knowledge_count', key: 'embeddings', minValue: 10 },
    ],
    enablesModules: ['knowledge', 'search'],
    enablesFeatures: ['semantic_search', 'topic_browsing', 'knowledge_retrieval']
  },
  {
    id: 'B4',
    name: 'External Tool Sync',
    description: 'CRM/Support/Calendar/Slack entities + relations stronger',
    requiredSources: [
      { type: 'tool_connected', key: 'tools', minValue: 1 },
      { type: 'entity_count', key: 'synced_entities', minValue: 50 },
    ],
    enablesModules: ['accounts', 'contacts', 'meetings', 'calendar', 'pipeline', 'team'],
    enablesFeatures: ['tool_sync', 'entity_relationships', 'cross_platform_views']
  },
  {
    id: 'B5',
    name: 'Health Metrics Packs',
    description: 'Account health scaffolds, basic computed metrics (no Think)',
    requiredSources: [
      { type: 'entity_count', key: 'accounts', minValue: 10 },
      { type: 'tool_connected', key: 'tools', minValue: 2 },
    ],
    enablesModules: ['analytics', 'expansion'], // Removed 'risks', 'signals' (L2 only)
    enablesFeatures: ['health_scores', 'basic_analytics', 'metric_packs']
  },
  {
    id: 'B6',
    name: 'Governance Readiness',
    description: 'Approvals config + audit trails, action gating available',
    requiredSources: [
      { type: 'feature_enabled', key: 'governance', minValue: 1 },
      { type: 'entity_count', key: 'policies', minValue: 1 },
    ],
    enablesModules: ['governance', 'audit', 'approvals'],
    enablesFeatures: ['policy_engine', 'approval_workflows', 'audit_logging', 'action_gating']
  },
  {
    id: 'B7',
    name: 'Automation Readiness',
    description: 'Workflows + agents allowed, Think/Act phased in',
    requiredSources: [
      { type: 'feature_enabled', key: 'automation', minValue: 1 },
      { type: 'tool_connected', key: 'tools', minValue: 3 },
    ],
    enablesModules: ['workflow-builder'], // Removed 'agents', 'act' (L2 only)
    enablesFeatures: ['workflow_automation', 'think_engine', 'act_engine']
  }
];

// =============================================================================
// BUCKET STATUS CALCULATION
// =============================================================================

export interface TenantBucketStatus {
  tenant_id: string;
  buckets: BucketStatus[];
  highest_bucket: HydrationBucket;
  completion_percentage: number;
  next_unlock: BucketUnlockInfo | null;
}

export interface BucketStatus {
  bucket: HydrationBucket;
  name: string;
  unlocked: boolean;
  requirements_met: RequirementStatus[];
  unlocked_at?: string;
}

export interface RequirementStatus {
  requirement: BucketRequirement;
  current_value: number;
  met: boolean;
}

export interface BucketUnlockInfo {
  bucket: HydrationBucket;
  missing_requirements: RequirementStatus[];
  suggested_actions: string[];
}

export interface TenantHydrationMetrics {
  users: number;
  entities: number;
  documents: number;
  embeddings: number;
  tools: number;
  synced_entities: number;
  accounts: number;
  policies: number;
  governance_enabled: boolean;
  automation_enabled: boolean;
}

/**
 * Calculate bucket status for a tenant based on their hydration metrics
 */
export function calculateBucketStatus(
  tenantId: string,
  metrics: TenantHydrationMetrics
): TenantBucketStatus {
  const bucketStatuses: BucketStatus[] = [];
  let highestBucket: HydrationBucket = 'B0';
  let unlockedCount = 0;

  for (const bucket of HYDRATION_BUCKETS) {
    const requirementStatuses: RequirementStatus[] = bucket.requiredSources.map(req => {
      const currentValue = getMetricValue(metrics, req);
      return {
        requirement: req,
        current_value: currentValue,
        met: currentValue >= req.minValue
      };
    });

    const unlocked = requirementStatuses.every(r => r.met);

    if (unlocked) {
      highestBucket = bucket.id;
      unlockedCount++;
    }

    bucketStatuses.push({
      bucket: bucket.id,
      name: bucket.name,
      unlocked,
      requirements_met: requirementStatuses,
      unlocked_at: unlocked ? new Date().toISOString() : undefined
    });
  }

  // Find next unlock
  const nextLockedBucket = bucketStatuses.find(b => !b.unlocked);
  let nextUnlock: BucketUnlockInfo | null = null;

  if (nextLockedBucket) {
    const bucketDef = HYDRATION_BUCKETS.find(b => b.id === nextLockedBucket.bucket)!;
    nextUnlock = {
      bucket: nextLockedBucket.bucket,
      missing_requirements: nextLockedBucket.requirements_met.filter(r => !r.met),
      suggested_actions: getSuggestedActions(nextLockedBucket.bucket, nextLockedBucket.requirements_met)
    };
  }

  return {
    tenant_id: tenantId,
    buckets: bucketStatuses,
    highest_bucket: highestBucket,
    completion_percentage: (unlockedCount / HYDRATION_BUCKETS.length) * 100,
    next_unlock: nextUnlock
  };
}

function getMetricValue(metrics: TenantHydrationMetrics, req: BucketRequirement): number {
  switch (req.type) {
    case 'entity_count':
      switch (req.key) {
        case 'users': return metrics.users;
        case 'entities': return metrics.entities;
        case 'synced_entities': return metrics.synced_entities;
        case 'accounts': return metrics.accounts;
        case 'policies': return metrics.policies;
        default: return 0;
      }
    case 'document_count':
      return metrics.documents;
    case 'knowledge_count':
      return metrics.embeddings;
    case 'tool_connected':
      return metrics.tools;
    case 'feature_enabled':
      if (req.key === 'governance') return metrics.governance_enabled ? 1 : 0;
      if (req.key === 'automation') return metrics.automation_enabled ? 1 : 0;
      return 0;
    default:
      return 0;
  }
}

function getSuggestedActions(bucket: HydrationBucket, requirements: RequirementStatus[]): string[] {
  const actions: string[] = [];
  const unmet = requirements.filter(r => !r.met);

  for (const req of unmet) {
    switch (bucket) {
      case 'B1':
        actions.push('Create your first project or task manually');
        actions.push('Add some notes or upload a document');
        break;
      case 'B2':
        actions.push('Upload documents to enable context extraction');
        actions.push('Connect Google Drive or Dropbox for automatic sync');
        break;
      case 'B3':
        actions.push('Wait for knowledge indexing to complete');
        actions.push('Upload more documents to build knowledge base');
        break;
      case 'B4':
        actions.push('Connect your CRM (Salesforce, HubSpot)');
        actions.push('Connect your support tool (Zendesk, Intercom)');
        actions.push('Link your calendar for meeting context');
        break;
      case 'B5':
        actions.push('Connect a second data source for health scoring');
        actions.push('Import at least 10 accounts');
        break;
      case 'B6':
        actions.push('Enable governance in settings');
        actions.push('Create your first approval policy');
        break;
      case 'B7':
        actions.push('Enable automation features');
        actions.push('Connect 3+ tools for full automation');
        break;
    }
  }

  return [...new Set(actions)]; // Dedupe
}

// =============================================================================
// MODULE GATING BY BUCKET
// =============================================================================

/**
 * Check if a module is available based on bucket status
 */
export function isModuleEnabledByBucket(
  moduleId: string,
  bucketStatus: TenantBucketStatus
): boolean {
  // Find which bucket enables this module
  const enablingBucket = HYDRATION_BUCKETS.find(b =>
    b.enablesModules.includes(moduleId)
  );

  if (!enablingBucket) {
    // Module not gated by buckets, always available
    return true;
  }

  // Check if the enabling bucket is unlocked
  const status = bucketStatus.buckets.find(b => b.bucket === enablingBucket.id);
  return status?.unlocked ?? false;
}

/**
 * Get all available modules for a tenant's bucket status
 */
export function getAvailableModules(bucketStatus: TenantBucketStatus): string[] {
  const modules: string[] = [];

  for (const bucket of HYDRATION_BUCKETS) {
    const status = bucketStatus.buckets.find(b => b.bucket === bucket.id);
    if (status?.unlocked) {
      modules.push(...bucket.enablesModules);
    }
  }

  return [...new Set(modules)];
}

/**
 * Get all available features for a tenant's bucket status
 */
export function getAvailableFeatures(bucketStatus: TenantBucketStatus): string[] {
  const features: string[] = [];

  for (const bucket of HYDRATION_BUCKETS) {
    const status = bucketStatus.buckets.find(b => b.bucket === bucket.id);
    if (status?.unlocked) {
      features.push(...bucket.enablesFeatures);
    }
  }

  return [...new Set(features)];
}

// =============================================================================
// BUCKET → DATA STRENGTH LEVEL MAPPING
// =============================================================================

/**
 * Map bucket status to DataStrengthLevel for backwards compatibility
 */
export function bucketToDataStrength(bucket: HydrationBucket): DataStrengthLevel {
  switch (bucket) {
    case 'B0':
    case 'B1':
      return 'seed';
    case 'B2':
    case 'B3':
      return 'growing';
    case 'B4':
    case 'B5':
      return 'healthy';
    case 'B6':
    case 'B7':
      return 'rich';
  }
}

/**
 * Map DataStrengthLevel to approximate bucket
 */
export function dataStrengthToBucket(level: DataStrengthLevel): HydrationBucket {
  switch (level) {
    case 'seed': return 'B1';
    case 'growing': return 'B3';
    case 'healthy': return 'B5';
    case 'rich': return 'B7';
  }
}
