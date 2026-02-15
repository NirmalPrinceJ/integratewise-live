/**
 * Universal Spine Services - Index
 * 
 * Core Architecture: ONE Layer 2, ONE Layer 3
 * Context determines what data is returned
 * 
 * Usage:
 * import { 
 *   UniversalEntityService, 
 *   UniversalThinkService,
 *   UniversalAnalyticsService   
 * } from '@/lib/spine'
 */

// Entity Service - CRUD with context-aware filtering
export {
    UniversalEntityService,
    UniversalAnalyticsService,
    UniversalEvidenceService,
    type EntityCategory,
    type EntityScope,
    type SpineEntity,
    type QueryContext,
    type EntityFilters,
    type EntityType
} from './universal-entity-service'

// Think & Act Services - AI with context-aware scoping
export {
    UniversalThinkService,
    UniversalActService,
    type Situation,
    type SignalReference,
    type SuggestedAction,
    type ActionProposal
} from './universal-think-service'

// Context Utilities
export function buildQueryContext(
    userId: string,
    tenantId: string,
    category: 'personal' | 'csm' | 'business' | 'team',
    options: {
        userRole?: 'personal' | 'csm' | 'executive' | 'admin'
        accountId?: string
        teamId?: string
    } = {}
): QueryContext {
    return {
        user_id: userId,
        tenant_id: tenantId,
        category,
        user_role: options.userRole || 'personal',
        account_id: options.accountId,
        team_id: options.teamId
    }
}

/**
 * Context Labels for UI Display
 */
export const CONTEXT_LABELS = {
    personal: {
        name: 'Personal',
        description: 'Your personal workspace',
        dataScope: 'Your own entities only',
        icon: 'user'
    },
    csm: {
        name: 'Customer Success',
        description: 'Account-specific view',
        dataScope: 'Data scoped to specific account',
        icon: 'building'
    },
    business: {
        name: 'Business',
        description: 'Portfolio-wide view',
        dataScope: 'All organizational data',
        icon: 'briefcase'
    },
    team: {
        name: 'Team',
        description: 'Team-scoped view',
        dataScope: 'Data visible to team members',
        icon: 'users'
    }
} as const

import { QueryContext } from './universal-entity-service'
