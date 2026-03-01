import { z } from 'zod';

/**
 * IntegrateWise V11.11 - Universal Contracts
 * Frozen in code for absolute cross-domain reliability.
 */

// --- Flow A: Structured Truth ---

export const ResourceTypeSchema = z.enum([
    'contact', 'company', 'deal', 'opportunity',
    'ticket', 'conversation', 'task', 'project',
    'campaign', 'asset', 'event', 'invoice',
    'subscription', 'payment', 'user', 'note',
    'feature', 'usage_event'
]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

export const NormalizedResourceSchema = z.object({
    resourceType: ResourceTypeSchema,
    tenantId: z.string().uuid(),

    external: z.object({
        tool: z.string(),
        rawResourceType: z.string(),
        externalId: z.string(),
        raw: z.record(z.any()).optional()
    }),

    canonical: z.record(z.any()), // Domain-specific fields (e.g., name, amount, status)

    traits: z.array(z.object({
        traitType: z.string(),
        tool: z.string(),
        externalId: z.string(),
        metadata: z.record(z.any())
    })),

    knowledgePointer: z.object({
        location: z.string().default('knowledge-base'),
        id: z.string()
    })
});

export type NormalizedResource = z.infer<typeof NormalizedResourceSchema>;

export const NormalizedEventSchema = z.object({
    tenantId: z.string().uuid(),
    resourceType: ResourceTypeSchema,
    resourceKey: z.object({
        lookupType: z.enum(['externalId', 'spineId']),
        value: z.string()
    }),
    sourceSystem: z.string(),
    canonicalEventType: z.string(), // e.g., 'created', 'updated', 'status_changed'
    severity: z.enum(['info', 'warning', 'error', 'critical']).default('info'),
    occurredAt: z.string().datetime(),
    traits: z.array(z.record(z.any())).optional(),
    knowledgePointer: z.object({
        location: z.string().default('knowledge-base'),
        id: z.string()
    })
});

export type NormalizedEvent = z.infer<typeof NormalizedEventSchema>;

// --- Layer 3: Think - Situations ---

export const DomainSchema = z.enum([
    'sales', 'marketing', 'product', 'support', 'finance', 'operations', 'generic'
]);

export type Domain = z.infer<typeof DomainSchema>;

export const SituationProposalSchema = z.object({
    proposal_id: z.string(),
    action_type: z.string(),
    tool: z.string(),
    description: z.string(),
    payload_summary: z.record(z.any()),
    autonomy_mode: z.enum(['manual', 'assisted', 'autonomous']).default('assisted')
});

export type SituationProposal = z.infer<typeof SituationProposalSchema>;

export const SituationSchema = z.object({
    id: z.string().uuid(),
    tenant_id: z.string().uuid(),
    label: z.string(), // e.g., "High-Value Pricing Friction"
    domain: DomainSchema,
    confidence: z.number().min(0).max(1),
    analysis: z.string(),
    evidence: z.object({
        flow_a_pointers: z.array(z.string()), // IDs or keys to Spine entities
        flow_b_pointers: z.array(z.string())  // IDs to Knowledge docs
    }),
    proposals: z.array(SituationProposalSchema),
    created_at: z.string().datetime().default(() => new Date().toISOString()),
    resolved_at: z.string().datetime().optional(),
    resolved_by: z.string().optional() // 'human' | 'policy' | userId
});

export type Situation = z.infer<typeof SituationSchema>;
