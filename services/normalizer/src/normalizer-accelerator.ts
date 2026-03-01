/**
 * Section 6 — NORMALIZER ACCELERATOR (Universal Normalizer Pack)
 * Implementation of Truth + Context Linkage
 */

export interface NormalizerContext {
    tenant_id: string;
    entity_type: string;
    source: string;
    category?: string;
    user_id?: string;
    account_id?: string;
    team_id?: string;
    user_role?: string;
    env?: any; // To access service URLs
}

export async function runNormalizerAccelerator(data: any, ctx: NormalizerContext) {
    let current = data;

    // NA0: Schema Detector (Tool -> SSOT Entity)
    current = await stageNA0_SchemaDetector(current, ctx);

    // NA1: Canonical Transformer (Traits mapping)
    current = await stageNA1_CanonicalTransformer(current, ctx);

    // NA2: SSOT Binder (ID registry)
    current = await stageNA2_SSOTBinder(current, ctx);

    // NA3: Lineage Manager (Evidence refs & Correlation)
    current = await stageNA3_LineageManager(current, ctx);

    // NA4: Relation Binder (Canonical Edge mapping)
    current = await stageNA4_RelationBinder(current, ctx);

    // NA5: Spine Publisher (Final Commit - The Linkage Handshake)
    current = await stageNA5_SpinePublisher(current, ctx);

    return current;
}

async function stageNA0_SchemaDetector(data: any, ctx: NormalizerContext) {
    // Detect if source 'hubspot.contact' -> 'contact'
    return data;
}

async function stageNA1_CanonicalTransformer(data: any, ctx: NormalizerContext) {
    // Basic trait mapping: tool_specific_field -> canonical_field
    return data;
}

async function stageNA2_SSOTBinder(data: any, ctx: NormalizerContext) {
    // Ensure stable UUID. If tool has external_id, we map it.
    if (!data.id) {
        data.id = crypto.randomUUID();
    }
    return data;
}

async function stageNA3_LineageManager(data: any, ctx: NormalizerContext) {
    // LINKAGE: Create the lineage metadata
    return {
        ...data,
        _lineage: {
            spine_id: data.id,
            source_system: ctx.source,
            external_id: data.external_id || null,
            sync_at: new Date().toISOString()
        }
    };
}

async function stageNA4_RelationBinder(data: any, ctx: NormalizerContext) {
    // Map relationships from Tool IDs to Canonical IDs
    return data;
}

async function stageNA5_SpinePublisher(data: any, ctx: NormalizerContext) {
    console.log(`[NA5] Publishing Linkage: Truth (Spine) + Context (Knowledge)`);

    const spineUrl = ctx.env?.SPINE_SERVICE_URL || 'http://localhost:8788';
    const knowledgeUrl = ctx.env?.KNOWLEDGE_SERVICE_URL || 'http://localhost:8785';

    // Auto-populate scope if not provided to ensure context-aware storage
    const finalScope = data.scope || {
        owner_id: ctx.user_id,
        account_id: ctx.account_id,
        team_id: ctx.team_id
    };

    // 1. Structured Data (The Truth)
    const spinePromise = fetch(`${spineUrl}/v1/spine/${ctx.entity_type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': ctx.tenant_id,
            'x-spine-context-category': ctx.category || 'business',
            'x-spine-context-user-id': ctx.user_id || '',
            'x-spine-context-account-id': ctx.account_id || '',
            'x-spine-context-team-id': ctx.team_id || ''
        },
        body: JSON.stringify({
            id: data.id,
            category: data.category || ctx.category || 'business',
            scope: finalScope,
            data: data, // The canonical fields
            relationships: data.relationships || {}
        })
    });

    // 2. Unstructured Data (The Context Graph)
    const contextPromise = fetch(`${knowledgeUrl}/knowledge/ingest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': ctx.tenant_id,
            'x-spine-context-category': ctx.category || 'business',
            'x-spine-context-user-id': ctx.user_id || ''
        },
        body: JSON.stringify({
            tenant_id: ctx.tenant_id,
            entity_type: ctx.entity_type,
            entity_id: data.id, // THE LINKAGE KEY
            source_type: 'api',
            source_name: ctx.source,
            content: JSON.stringify({
                original_payload: data._raw || {},
                extracted_graph: data._graph || {},
                lineage: data._lineage
            })
        })
    });

    try {
        await Promise.all([spinePromise, contextPromise]);
    } catch (err) {
        console.error(`Linkage Dispatch Failed: ${err}`);
    }

    return data;
}
