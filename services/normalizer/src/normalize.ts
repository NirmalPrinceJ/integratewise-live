/**
 * IntegrateWise Normalizer Service - Core Normalization Module
 * Handles validation, normalization, deduplication, and version management
 * for all canonical entity types.
 */

import { schemas, entityTypes } from './schemas';
import { runNormalizerAccelerator, type NormalizerContext } from './normalizer-accelerator';
import type {
  EntityType,
  NormalizeResponse,
  ValidateResponse,
  ValidationError,
  VersionInfo,
  Env
} from './types';

// =============================================================================
// VALIDATOR SETUP (Cloudflare Workers compatible)
// =============================================================================

function validateEntity(data: any, schema: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  // Basic validation - check required fields and types
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  if (schema.properties) {
    for (const [field, fieldSchema] of Object.entries(schema.properties as any)) {
      if (field in data) {
        const value = data[field];
        const expectedType = (fieldSchema as any).type;

        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`Field ${field} must be a string`);
        } else if (expectedType === 'number' && typeof value !== 'number') {
          errors.push(`Field ${field} must be a number`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Field ${field} must be a boolean`);
        } else if (expectedType === 'array' && !Array.isArray(value)) {
          errors.push(`Field ${field} must be an array`);
        } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
          errors.push(`Field ${field} must be an object`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

const validators: Record<string, (data: any) => { valid: boolean; errors?: string[] }> = {};
for (const entityType of entityTypes) {
  validators[entityType] = (data: any) => validateEntity(data, schemas[entityType]);
}

/**
 * Trust Layer: Calculate trust score and provenance
 */
function determineTrustMetrics(data: any, source: string, hasR2: boolean): any {
  let score = 80;
  const reasoning = ['Source system identified'];

  if (source === 'hubspot' || source === 'salesforce') {
    score += 10;
    reasoning.push('Verified CRM connector source');
  } else if (source === 'internal') {
    score += 15;
    reasoning.push('First-party internal system');
  }

  if (hasR2) {
    score += 5;
    reasoning.push('Immutable storage verification');
  }

  // Completeness check
  const fieldCount = Object.keys(data).length;
  if (fieldCount > 10) {
    score += 5;
    reasoning.push('High data completeness');
  }

  return {
    score: Math.min(score, 100),
    reasoning,
    provenance: {
      source,
      verified: score > 85,
      hops: hasR2 ? 2 : 1
    }
  };
}

/**
 * Generate a deterministic deduplication key
 */
export function generateDedupKey(
  entityType: string,
  tenantId: string,
  data: Record<string, unknown>
): string {
  const uniqueId = (data.external_id as string) || (data.id as string) || crypto.randomUUID();
  return `${entityType}:${tenantId}:${uniqueId}`;
}

/**
 * Validate data against an entity schema
 */
export function validate(entityType: string, data: Record<string, unknown>): ValidateResponse {
  const validator = validators[entityType];
  if (!validator) return { valid: false, errors: [{ field: 'entity_type', message: 'Unknown type', code: 'schema_not_found' }] };

  const result = validator(data);
  if (result.valid) return { valid: true, errors: [] };

  const errors: ValidationError[] = (result.errors || []).map((err: string) => ({
    field: 'unknown',
    message: err,
    code: 'validation_error'
  }));

  return { valid: false, errors };
}

/**
 * Get or create version for a dedup key using D1
 */
async function getOrCreateVersion(
  dedupKey: string,
  db: D1Database
): Promise<VersionInfo> {
  try {
    const existing = await db.prepare(`SELECT version FROM canonical_versions WHERE dedup_key = ?`)
      .bind(dedupKey)
      .first<{ version: number }>();

    if (existing) {
      const newVersion = existing.version + 1;
      await db.prepare(`UPDATE canonical_versions SET version = ?, updated_at = CURRENT_TIMESTAMP WHERE dedup_key = ?`)
        .bind(newVersion, dedupKey)
        .run();
      return { dedup_key: dedupKey, version: newVersion, updated_at: new Date().toISOString() };
    }

    await db.prepare(`INSERT INTO canonical_versions (dedup_key, version) VALUES (?, 1)`)
      .bind(dedupKey)
      .run();

    return { dedup_key: dedupKey, version: 1, updated_at: new Date().toISOString() };
  } catch (err) {
    console.error("Version management error", err);
    return { dedup_key: dedupKey, version: 1, updated_at: new Date().toISOString() };
  }
}

/**
 * Main normalization function
 */
export async function normalize(
  entityType: string,
  rawData: Record<string, unknown>,
  db: D1Database,
  env?: any,
  context: Partial<NormalizerContext> = {}
): Promise<NormalizeResponse> {
  const tenantId = context.tenant_id || (rawData.tenant_id as string) || (rawData.organization_id as string) || 'default';

  // 0. Resolve R2 Reference if present
  let dataToProcess = rawData;
  if (rawData && rawData._r2_ref && typeof rawData._r2_ref === 'string') {
    if (env && env.FILES) {
      const obj = await env.FILES.get(rawData._r2_ref);
      if (obj) {
        dataToProcess = await obj.json();
      }
    }
  }

  // 1. Validate
  const validation = validate(entityType, dataToProcess);
  if (!validation.valid) {
    return { success: false, entity_type: entityType as EntityType, dedup_key: '', version: 0, errors: validation.errors };
  }

  // 1.5. Golden Path: Run Normalizer Accelerator (NA0-NA5)
  const source = (dataToProcess.source_system as string) || 'unknown';
  const acceleratedData = await runNormalizerAccelerator(dataToProcess, {
    tenant_id: tenantId,
    entity_type: entityType,
    source: source,
    env: env, // Pass env for service URLs
    ...context
  });

  // 2. Dedup & Version
  const dedupKey = generateDedupKey(entityType, tenantId, acceleratedData);
  const versionInfo = await getOrCreateVersion(dedupKey, db);

  const normalizedData = {
    ...acceleratedData,
    _normalized: {
      dedup_key: dedupKey,
      version: versionInfo.version,
      normalized_at: versionInfo.updated_at,
      entity_type: entityType,
      tenant_id: tenantId
    },
  };

  return {
    success: true,
    entity_type: entityType as EntityType,
    dedup_key: dedupKey,
    version: versionInfo.version,
    normalized_data: normalizedData,
    trust_metrics: determineTrustMetrics(dataToProcess, source, !!rawData._r2_ref)
  };
}

export async function normalizeBatch(
  entityType: string,
  items: Record<string, unknown>[],
  db: D1Database,
  env?: any,
  context: Partial<NormalizerContext> = {}
): Promise<NormalizeResponse[]> {
  const results: NormalizeResponse[] = [];
  for (const item of items) {
    results.push(await normalize(entityType, item, db, env, context));
  }
  return results;
}
