/**
 * Universal Entity Service
 * Core principle: ONE backend, context determines filtering
 * 
 * Same API, Different Context = Different Results
 * - Personal: owner_id filter
 * - CSM: account_id filter (assigned accounts only)
 * - Business: no filter (sees all, role-gated)
 * - Team: team_id filter
 * 
 * All operations route through the Spine Worker service (L3)
 */
import { spine, views } from '@/lib/db';

// Context categories
export type EntityCategory = 'personal' | 'csm' | 'business' | 'team' | 'tam';

// Universal scope structure
export interface EntityScope {
    owner_id?: string;
    account_id?: string;
    team_id?: string;
    assigned_csm_id?: string;
    visibility?: 'private' | 'team' | 'org';
    region?: string;
}

// Universal entity structure
export interface SpineEntity<T = Record<string, unknown>> {
    id: string;
    tenant_id: string;
    entity_type: string;
    category: EntityCategory;
    scope: EntityScope;
    data: T;
    relationships: Record<string, unknown>;
    created_by?: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
}

// Query context - passed with every request
export interface QueryContext {
    tenant_id: string;
    user_id: string;
    user_role: 'personal' | 'csm' | 'executive' | 'admin';
    category: EntityCategory;
    account_id?: string; // For CSM context
    team_id?: string; // For team context
}

// Filter options
export interface EntityFilters {
    status?: string;
    due_before?: string;
    due_after?: string;
    priority?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

// Entity type definitions
export type EntityType =
    | 'task'
    | 'account'
    | 'meeting'
    | 'project'
    | 'objective'
    | 'document'
    | 'contact'
    | 'event';

/**
 * Build context headers for Spine service requests
 */
function buildContextHeaders(context: QueryContext): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'x-spine-context-tenant-id': context.tenant_id,
        'x-spine-context-category': context.category,
        'x-spine-context-user-id': context.user_id,
        'x-spine-context-user-role': context.user_role,
        'x-spine-context-account-id': context.account_id || '',
        'x-spine-context-team-id': context.team_id || '',
    };
}

/**
 * Universal Entity Service
 * Handles all CRUD operations with context-aware filtering via Spine Worker
 */
export class UniversalEntityService {
    /**
     * Get entities with context-aware filtering
     * Same endpoint, filters based on category context
     */
    static async getEntities<T>(
        entityType: EntityType,
        context: QueryContext,
        filters: EntityFilters = {}
    ): Promise<SpineEntity<T>[]> {
        try {
            const url = new URL('http://dummy/v1/spine/entities');
            url.searchParams.append('type', entityType);
            if (filters.limit) url.searchParams.append('limit', filters.limit.toString());
            if (filters.offset) url.searchParams.append('offset', filters.offset.toString());
            if (filters.status) url.searchParams.append('status', filters.status);
            if (filters.priority) url.searchParams.append('priority', filters.priority);
            const path = `${url.pathname}${url.search}`;

            const result = await spine.get<{ data?: SpineEntity<T>[] }>(path, buildContextHeaders(context));
            return result.data || [];
        } catch (err) {
            console.error(`Spine API fetch failed: ${err}`);
            return [];
        }
    }

    /**
     * Create an entity with proper scoping
     */
    static async createEntity<T>(
        entityType: EntityType,
        context: QueryContext,
        entityData: T,
        relationships: Record<string, unknown> = {}
    ): Promise<SpineEntity<T>> {
        return spine.post<SpineEntity<T>>(
            '/v1/spine/entities',
            {
                entity_type: entityType,
                data: entityData,
                relationships,
            },
            buildContextHeaders(context)
        );
    }

    /**
     * Update an entity with scope validation
     */
    static async updateEntity<T>(
        entityType: EntityType,
        entityId: string,
        context: QueryContext,
        updates: Partial<T>,
        relationshipUpdates?: Record<string, unknown>
    ): Promise<SpineEntity<T>> {
        return spine.put<SpineEntity<T>>(
            `/v1/spine/entities/${entityId}`,
            {
                entity_type: entityType,
                data: updates,
                relationships: relationshipUpdates,
            },
            buildContextHeaders(context)
        );
    }

    /**
     * Get a single entity by ID with access validation
     */
    static async getEntityById<T>(
        entityType: EntityType,
        entityId: string,
        context: QueryContext
    ): Promise<SpineEntity<T> | null> {
        try {
            const path = `/v1/spine/entities/${entityId}?type=${entityType}`;
            return await spine.get<SpineEntity<T>>(path, buildContextHeaders(context));
        } catch (err) {
            console.error(`Error fetching entity: ${err}`);
            return null;
        }
    }

    /**
     * Delete an entity with access validation
     */
    static async deleteEntity(
        entityType: EntityType,
        entityId: string,
        context: QueryContext
    ): Promise<boolean> {
        const path = `/v1/spine/entities/${entityId}?type=${entityType}`;
        await spine.delete(path, buildContextHeaders(context));
        return true;
    }
}

// =============================================================================
// ANALYTICS SERVICE - Same engine, different aggregation scope
// =============================================================================

export class UniversalAnalyticsService {
    /**
     * Calculate metrics with context-aware aggregation
     */
    static async calculateMetrics(
        metricType: string,
        context: QueryContext
    ): Promise<Record<string, unknown>> {
        try {
            return await views.get(`/v1/metrics/${metricType}`, buildContextHeaders(context));
        } catch (err) {
            console.error(`Error calculating metrics: ${err}`);
            return { metric: metricType, value: null, error: String(err) };
        }
    }
}

// =============================================================================
// EVIDENCE SERVICE - Same drawer, different data scope
// =============================================================================

export class UniversalEvidenceService {
    /**
     * Get evidence/timeline with context-aware filtering
     */
    static async getEvidence(
        context: QueryContext,
        entityId?: string,
        entityType?: EntityType,
        limit: number = 50
    ): Promise<SpineEntity[]> {
        try {
            const url = new URL('http://dummy/v1/spine/evidence');
            url.searchParams.append('limit', limit.toString());
            if (entityId) url.searchParams.append('entity_id', entityId);
            if (entityType) url.searchParams.append('entity_type', entityType);
            const path = `${url.pathname}${url.search}`;

            const result = await spine.get<{ data?: SpineEntity[] }>(path, buildContextHeaders(context));
            return result.data || [];
        } catch (err) {
            console.error(`Error fetching evidence: ${err}`);
            return [];
        }
    }
}
