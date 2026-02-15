/**
 * Adaptive Spine v2 (Beta)
 *
 * Features:
 * - Adaptive schema discovery
 * - Completeness scoring
 * - Progressive field tracking
 * - Department stream routing
 *
 * Runs in parallel with old spine (v1)
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';
import type { Context } from 'hono';

type Env = {
  NEON_DB_URL: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  CACHE: D1Database;
  KV: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// ============================================================================
// Health & Info
// ============================================================================

app.get('/v2/spine', (c) => {
  return c.json({
    service: 'Adaptive Spine v2',
    version: '2.0.0-beta',
    status: 'operational',
    features: [
      'adaptive-schema-discovery',
      'completeness-scoring',
      'progressive-fields',
      'department-streams'
    ],
    endpoints: {
      ingest: 'POST /v2/spine/ingest',
      entities: 'GET /v2/spine/entities/:id',
      schema: 'GET /v2/spine/schema',
      completeness: 'GET /v2/spine/completeness/:id',
      streams: 'GET /v2/spine/streams'
    }
  });
});

app.get('/v2/spine/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// Schema Registry - Adaptive Discovery
// ============================================================================

app.get('/v2/spine/schema', async (c) => {
  const entity_type = c.req.query('entity_type');
  const tenant_id = c.req.query('tenant_id');

  if (!entity_type) {
    return c.json({ error: 'entity_type required' }, 400);
  }

  const sql = neon(c.env.NEON_DB_URL);

  try {
    const fields = await sql`
      SELECT
        field_key,
        field_path,
        data_type,
        status,
        occurrence_count,
        sample_value,
        first_seen_at,
        last_seen_at
      FROM spine_schema_registry
      WHERE entity_type = ${entity_type}
        ${tenant_id ? sql`AND tenant_id = ${tenant_id}::uuid` : sql``}
      ORDER BY occurrence_count DESC, field_key
    `;

    return c.json({
      entity_type,
      fields_discovered: fields.length,
      fields
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// Completeness Scoring
// ============================================================================

app.get('/v2/spine/completeness/:entity_id', async (c) => {
  const entity_id = c.req.param('entity_id');
  const sql = neon(c.env.NEON_DB_URL);

  try {
    const [completeness] = await sql`
      SELECT
        entity_id,
        entity_type,
        layer_level,
        fields_present,
        fields_expected,
        completeness_score,
        missing_required,
        missing_expected,
        last_calculated_at
      FROM spine_entity_completeness
      WHERE entity_id = ${entity_id}::uuid
    `;

    if (!completeness) {
      return c.json({ error: 'Entity not found' }, 404);
    }

    return c.json(completeness);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// Department Streams
// ============================================================================

app.get('/v2/spine/streams', async (c) => {
  const tenant_id = c.req.query('tenant_id') || '00000000-0000-0000-0000-000000000000';
  const sql = neon(c.env.NEON_DB_URL);

  try {
    const streams = await sql`
      SELECT
        stream_key,
        display_name,
        description,
        category,
        scope
      FROM spine_streams
      WHERE tenant_id = ${tenant_id}::uuid
      ORDER BY category, display_name
    `;

    return c.json({
      tenant_id,
      streams_count: streams.length,
      streams
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// Entity CRUD
// ============================================================================

app.get('/v2/spine/entities/:id', async (c) => {
  const id = c.req.param('id');
  const sql = neon(c.env.NEON_DB_URL);

  try {
    const [entity] = await sql`
      SELECT
        e.id,
        e.tenant_id,
        e.entity_type,
        e.category,
        e.scope,
        e.source,
        e.created_at,
        e.updated_at,
        c.completeness_score,
        c.fields_present,
        c.fields_expected
      FROM spine_entity_core e
      LEFT JOIN spine_entity_completeness c ON e.id = c.entity_id
      WHERE e.id = ${id}::uuid
    `;

    if (!entity) {
      return c.json({ error: 'Entity not found' }, 404);
    }

    // Get attributes
    const attributes = await sql`
      SELECT attr_key, attr_value, attr_numeric, attr_bool, attr_date
      FROM spine_entity_attributes
      WHERE entity_id = ${id}::uuid
    `;

    // Build data object from attributes
    const data: Record<string, any> = {};
    for (const attr of attributes) {
      if (attr.attr_numeric !== null) data[attr.attr_key] = attr.attr_numeric;
      else if (attr.attr_bool !== null) data[attr.attr_key] = attr.attr_bool;
      else if (attr.attr_date !== null) data[attr.attr_key] = attr.attr_date;
      else data[attr.attr_key] = attr.attr_value;
    }

    return c.json({ ...entity, data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/v2/spine/entities', async (c) => {
  const entity_type = c.req.query('entity_type');
  const tenant_id = c.req.query('tenant_id');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  if (!tenant_id) {
    return c.json({ error: 'tenant_id required' }, 400);
  }

  const sql = neon(c.env.NEON_DB_URL);

  try {
    const entities = await sql`
      SELECT
        e.id,
        e.entity_type,
        e.category,
        e.created_at,
        c.completeness_score
      FROM spine_entity_core e
      LEFT JOIN spine_entity_completeness c ON e.id = c.entity_id
      WHERE e.tenant_id = ${tenant_id}::uuid
        ${entity_type ? sql`AND e.entity_type = ${entity_type}` : sql``}
      ORDER BY e.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // For list view, optionally fetch attributes (lightweight)
    // Skip for now to keep response fast

    return c.json({
      entities,
      count: entities.length,
      limit,
      offset
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// Ingestion - Write to spine_entity_core + Observe Fields
// ============================================================================

app.post('/v2/spine/ingest', async (c) => {
  const body = await c.req.json<{
    tenant_id: string;
    entity_type: string;
    category?: string;
    data: Record<string, any>;
    source_system?: string;
    layer_level?: number;
  }>();

  if (!body.tenant_id || !body.entity_type || !body.data) {
    return c.json({ error: 'Missing required fields: tenant_id, entity_type, data' }, 400);
  }

  const sql = neon(c.env.NEON_DB_URL);

  try {
    // 1. Insert entity core
    const category = body.category || 'business';
    const [entity] = await sql`
      INSERT INTO spine_entity_core (
        tenant_id,
        entity_type,
        category,
        scope,
        source
      ) VALUES (
        ${body.tenant_id}::uuid,
        ${body.entity_type},
        ${category},
        '{}'::jsonb,
        ${JSON.stringify({ system: body.source_system || 'api', timestamp: Date.now() })}::jsonb
      )
      RETURNING id, created_at
    `;

    // 2. Insert attributes into spine_entity_attributes
    const attributeInserts = [];
    for (const [attr_key, value] of Object.entries(body.data)) {
      if (value === null || value === undefined) continue;

      // Determine value type and column
      let attr_value = null;
      let attr_numeric = null;
      let attr_bool = null;
      let attr_date = null;

      if (typeof value === 'number') {
        attr_numeric = value;
      } else if (typeof value === 'boolean') {
        attr_bool = value;
      } else if (value instanceof Date || (!isNaN(Date.parse(value)) && typeof value === 'string' && value.includes('-'))) {
        attr_date = value;
      } else {
        attr_value = typeof value === 'string' ? value : JSON.stringify(value);
      }

      attributeInserts.push(sql`
        INSERT INTO spine_entity_attributes (
          entity_id,
          tenant_id,
          attr_key,
          attr_value,
          attr_numeric,
          attr_bool,
          attr_date,
          source_system
        ) VALUES (
          ${entity.id}::uuid,
          ${body.tenant_id}::uuid,
          ${attr_key},
          ${attr_value},
          ${attr_numeric},
          ${attr_bool},
          ${attr_date},
          ${body.source_system || 'api'}
        )
      `);
    }

    await Promise.all(attributeInserts);

    // 3. Insert layer classification
    const layer_level = body.layer_level || 2; // Default to L2
    await sql`
      INSERT INTO spine_entity_layers (
        entity_id,
        tenant_id,
        layer_level,
        layer_name,
        layer_boundary,
        is_active
      ) VALUES (
        ${entity.id}::uuid,
        ${body.tenant_id}::uuid,
        ${layer_level},
        ${layer_level === 1 ? 'workspace' : layer_level === 2 ? 'cognitive' : 'spine'},
        ${layer_level === 1 ? 'pure_ui' : layer_level === 2 ? 'intelligence' : 'truth'},
        true
      )
    `;

    // 4. Observe fields for schema discovery
    const fieldObservations = [];
    for (const [field_key, value] of Object.entries(body.data)) {
      if (value === null || value === undefined) continue;

      const data_type = Array.isArray(value) ? 'array' : typeof value;
      const sample_value = typeof value === 'string' ? value.slice(0, 100) : JSON.stringify(value).slice(0, 100);

      try {
        await sql`
          INSERT INTO spine_schema_registry (
            tenant_id,
            entity_type,
            field_key,
            field_path,
            data_type,
            sample_value,
            source_system,
            status,
            occurrence_count
          ) VALUES (
            ${body.tenant_id}::uuid,
            ${body.entity_type},
            ${field_key},
            ${field_key},
            ${data_type},
            ${sample_value},
            ${body.source_system || 'api'},
            'observed',
            1
          )
          ON CONFLICT (tenant_id, entity_type, field_path)
          DO UPDATE SET
            occurrence_count = spine_schema_registry.occurrence_count + 1,
            last_seen_at = NOW(),
            sample_value = EXCLUDED.sample_value
        `;

        fieldObservations.push(field_key);
      } catch (err) {
        console.error(`Field observation failed for ${field_key}:`, err);
      }
    }

    // 5. Calculate completeness score (async)
    calculateCompleteness(c.env, entity.id, body.tenant_id, body.entity_type).catch(console.error);

    // Track analytics
    c.env.ANALYTICS?.writeDataPoint({
      blobs: [body.tenant_id, body.entity_type, 'ingestion_success'],
      doubles: [1, fieldObservations.length],
      indexes: ['spine-v2']
    });

    return c.json({
      success: true,
      entity_id: entity.id,
      created_at: entity.created_at,
      fields_observed: fieldObservations.length,
      fields: fieldObservations
    });
  } catch (error: any) {
    c.env.ANALYTICS?.writeDataPoint({
      blobs: [body.tenant_id || 'unknown', body.entity_type || 'unknown', 'ingestion_failed'],
      doubles: [1],
      indexes: ['spine-v2']
    });

    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// Helper: Calculate Completeness Score
// ============================================================================

async function calculateCompleteness(
  env: Env,
  entity_id: string,
  tenant_id: string,
  entity_type: string
): Promise<void> {
  const sql = neon(env.NEON_DB_URL);

  try {
    // Get entity attributes
    const attributes = await sql`
      SELECT attr_key
      FROM spine_entity_attributes
      WHERE entity_id = ${entity_id}::uuid
        AND (attr_value IS NOT NULL OR attr_numeric IS NOT NULL OR attr_bool IS NOT NULL OR attr_date IS NOT NULL)
    `;

    if (!attributes || attributes.length === 0) return;

    const presentFields = attributes.map(a => a.attr_key);

    // Get expected fields for this entity type
    const [expectedDef] = await sql`
      SELECT required_fields, expected_fields
      FROM spine_expected_fields
      WHERE entity_type = ${entity_type}
      ORDER BY layer_level DESC
      LIMIT 1
    `;

    if (!expectedDef) {
      console.log(`No expected fields definition for ${entity_type}`);
      return;
    }

    const requiredFields = expectedDef.required_fields as string[];
    const expectedFields = expectedDef.expected_fields as string[];

    const missingRequired = requiredFields.filter(f => !presentFields.includes(f));
    const missingExpected = expectedFields.filter(f => !presentFields.includes(f));

    const completenessScore = Math.round(
      (presentFields.length / expectedFields.length) * 100
    );

    // Upsert completeness record
    await sql`
      INSERT INTO spine_entity_completeness (
        entity_id,
        tenant_id,
        entity_type,
        layer_level,
        fields_present,
        fields_expected,
        completeness_score,
        missing_required,
        missing_expected,
        last_calculated_at
      ) VALUES (
        ${entity_id}::uuid,
        ${tenant_id}::uuid,
        ${entity_type},
        2,
        ${presentFields.length},
        ${expectedFields.length},
        ${completenessScore},
        ${JSON.stringify(missingRequired)}::jsonb,
        ${JSON.stringify(missingExpected)}::jsonb,
        NOW()
      )
      ON CONFLICT (entity_id)
      DO UPDATE SET
        fields_present = EXCLUDED.fields_present,
        fields_expected = EXCLUDED.fields_expected,
        completeness_score = EXCLUDED.completeness_score,
        missing_required = EXCLUDED.missing_required,
        missing_expected = EXCLUDED.missing_expected,
        last_calculated_at = NOW()
    `;

    console.log(`Completeness calculated for ${entity_id}: ${completenessScore}%`);
  } catch (error) {
    console.error('Completeness calculation failed:', error);
  }
}

export default app;
