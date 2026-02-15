import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getRequiredFields, CONTEXT_REGISTRY } from './packs'

type Bindings = {
    DB: D1Database;
    ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/', (c) => c.json({
    service: 'Spine (System of Record)',
    database: 'Cloudflare D1',
    status: 'operational',
    version: 'v1.1-d1'
}))

/**
 * Universal Spine Table Mapping
 */
const SPINE_TABLES: Record<string, string> = {
    task: 'spine_tasks',
    account: 'spine_accounts',
    meeting: 'spine_meetings',
    project: 'spine_projects',
    objective: 'spine_objectives',
    document: 'spine_documents',
    contact: 'spine_contacts',
    event: 'spine_events'
};

/**
 * POST /v1/spine/:entity_type
 * Writes a canonical entity to the Spine.
 */
app.post('/v1/spine/:entity_type', async (c) => {
    const entityType = c.req.param('entity_type');
    const tenantId = c.req.header('x-tenant-id');
    const tableName = SPINE_TABLES[entityType];

    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);
    if (!tableName) return c.json({ error: `Unknown entity type: ${entityType}` }, 400);

    const body = await c.req.json();

    // Context Headers
    const categoryHeader = c.req.header('x-spine-context-category');
    const userIdHeader = c.req.header('x-spine-context-user-id');
    const accountIdHeader = c.req.header('x-spine-context-account-id');
    const teamIdHeader = c.req.header('x-spine-context-team-id');

    try {
        const id = body.id || crypto.randomUUID();
        const category = body.category || categoryHeader || 'business';
        const scope = {
            owner_id: userIdHeader,
            account_id: accountIdHeader,
            team_id: teamIdHeader,
            ...(body.scope || {})
        };

        const data = body.data || {};
        const relationships = body.relationships || {};

        // 1.5. Context Pack Validation
        const requiredFields = getRequiredFields(category, entityType);
        const missingFields = requiredFields.filter(f => data[f] === undefined || data[f] === null);

        if (missingFields.length > 0) {
            console.warn(`[Spine] Context gap: ${category} missing fields: ${missingFields.join(', ')}`);
            relationships._context_gap = missingFields;
        }

        // SQLite / D1 Upsert
        const result = await c.env.DB.prepare(`
            INSERT INTO ${tableName} (id, tenant_id, category, scope, data, relationships)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET
                data = excluded.data,
                scope = excluded.scope,
                relationships = excluded.relationships,
                updated_at = CURRENT_TIMESTAMP
        `).bind(
            id,
            tenantId,
            category,
            JSON.stringify(scope),
            JSON.stringify(data),
            JSON.stringify(relationships)
        ).run();

        return c.json({
            success: true,
            id,
            context_status: missingFields.length === 0 ? 'complete' : 'incomplete'
        });
    } catch (err: any) {
        console.error(`Spine Write Failed: ${err.message}`);
        return c.json({ error: 'Spine Write Failed', message: err.message }, 500);
    }
});

/**
 * GET /v1/spine/entities
 * Context-Aware SSOT Projection.
 */
app.get('/v1/spine/entities', async (c) => {
    const tenantId = c.req.header('x-spine-context-tenant-id');
    const category = c.req.header('x-spine-context-category') || 'personal';
    const userId = c.req.header('x-spine-context-user-id');
    const role = c.req.header('x-spine-context-user-role');
    const entityType = c.req.query('type');
    const accountId = c.req.header('x-spine-context-account-id');
    const teamId = c.req.header('x-spine-context-team-id');

    if (!tenantId) return c.json({ error: 'tenant_id missing' }, 400);
    if (!entityType) return c.json({ error: 'entity type required' }, 400);

    const tableName = SPINE_TABLES[entityType];
    if (!tableName) return c.json({ error: `Unknown entity type: ${entityType}` }, 400);

    try {
        let results;

        if (category === 'personal') {
            results = await c.env.DB.prepare(`
                SELECT * FROM ${tableName}
                WHERE tenant_id = ?
                AND category = 'personal'
                AND json_extract(scope, '$.owner_id') = ?
                ORDER BY created_at DESC
            `).bind(tenantId, userId).all();
        } else if (category === 'csm') {
            if (accountId) {
                results = await c.env.DB.prepare(`
                    SELECT * FROM ${tableName}
                    WHERE tenant_id = ?
                    AND json_extract(scope, '$.account_id') = ?
                    ORDER BY created_at DESC
                `).bind(tenantId, accountId).all();
            } else {
                results = await c.env.DB.prepare(`
                    SELECT * FROM ${tableName}
                    WHERE tenant_id = ?
                    AND json_extract(scope, '$.assigned_csm_id') = ?
                    ORDER BY created_at DESC
                `).bind(tenantId, userId).all();
            }
        } else if (category === 'tam') {
            results = await c.env.DB.prepare(`
                SELECT * FROM ${tableName}
                WHERE tenant_id = ?
                AND (json_extract(scope, '$.account_id') = ? OR json_extract(scope, '$.team_id') = ?)
                ORDER BY created_at DESC
            `).bind(tenantId, accountId, teamId).all();
        } else {
            results = await c.env.DB.prepare(`
                SELECT * FROM ${tableName}
                WHERE tenant_id = ?
                ORDER BY created_at DESC
            `).bind(tenantId).all();
        }

        const rows = results.results || [];

        // 1.5. Lens/Projection Rule Application
        const projectedData = rows.map((item: any) => {
            const dataParsed = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
            const scopeParsed = typeof item.scope === 'string' ? JSON.parse(item.scope) : item.scope;
            const relParsed = typeof item.relationships === 'string' ? JSON.parse(item.relationships) : item.relationships;

            return {
                ...item,
                data: dataParsed,
                scope: scopeParsed,
                relationships: relParsed,
                _lens: {
                    context: category,
                    packs_applied: CONTEXT_REGISTRY[category] || []
                }
            };
        });

        return c.json({ success: true, count: projectedData.length, data: projectedData });
    } catch (err: any) {
        console.error(`Spine Query Failed: ${err.message}`);
        return c.json({ error: 'Spine Query Failed', message: err.message }, 500);
    }
});

/**
 * GET /evidence/:artifact_id
 */
app.get('/evidence/:artifact_id', async (c) => {
    const artifactId = c.req.param('artifact_id')
    const tenantId = c.req.header('x-tenant-id')
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400)

    try {
        const results = await c.env.DB.prepare(`
            SELECT * FROM spine_events 
            WHERE json_extract(data, '$.source_id') = ?
            OR relationships LIKE ?
            ORDER BY created_at DESC
        `).bind(artifactId, `%${artifactId}%`).all();

        const rows = (results.results || []).map((r: any) => ({
            ...r,
            data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
            relationships: typeof r.relationships === 'string' ? JSON.parse(r.relationships) : r.relationships
        }));

        return c.json({ success: true, data: rows })
    } catch (err: any) {
        return c.json({ error: 'Spine query failed', message: err.message }, 500)
    }
})

export default app
