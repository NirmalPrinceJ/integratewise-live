import type { FusedSources, EvidenceRef } from './fusion';

// ============================================================================
// TYPES
// ============================================================================

export interface ProposedAction {
    id?: string;
    situation_id: string;
    proposal_rank: number;
    action_type: string;
    action_key: string;
    title: string;
    description: string;
    autonomy_level: 'autonomous' | 'supervised' | 'manual';
    confidence_score: number;
    parameters: Record<string, any>;
    evidence_ref_ids: string[];
    requires_approval: boolean;
    expires_at?: string; // Standardized to string for DB
}

export interface Situation {
    id: string;
    situation_key: string;
    entity_type: string;
    entity_id: string;
    tenant_id?: string;
    severity?: string;
}

// ============================================================================
// ACTION TEMPLATES (Omitted for brevity, assumed same as previously viewed)
// ============================================================================
// [Keeping original template logic...]

const ACTION_TEMPLATES: Record<string, any[]> = {
    'churn.risk': [
        {
            action_key: 'schedule_health_call',
            title: 'Schedule Customer Health Call',
            description: 'Proactively reach out to the customer to understand their concerns and prevent churn.',
            autonomy_level: 'supervised',
            base_confidence: 0.75,
            requires_approval: true,
            parameters_template: { call_type: 'health_check', priority: 'high' },
            evidence_boost_rules: [{ ref_type: 'ai_insight', boost: 0.1 }, { ref_type: 'context_email', signal_pattern: 'negative', boost: 0.05 }]
        }
    ],
    'billing.payment_failed': [
        {
            action_key: 'send_payment_reminder',
            title: 'Send Payment Reminder',
            description: 'Notify customer of failed payment and provide update options.',
            autonomy_level: 'autonomous',
            base_confidence: 0.95,
            requires_approval: false,
            parameters_template: { channel: 'email', urgency: 'medium' },
            evidence_boost_rules: []
        }
    ]
};

function calculateConfidence(template: any, sources: FusedSources): number {
    let confidence = template.base_confidence;
    for (const rule of template.evidence_boost_rules || []) {
        const matchingRefs = sources.evidence_refs.filter(ref => ref.ref_type === rule.ref_type);
        if (matchingRefs.length > 0) {
            const boost = Math.min(rule.boost * matchingRefs.length, rule.boost * 2);
            confidence = Math.min(confidence + boost, 0.99);
        }
    }
    return Math.round(confidence * 100) / 100;
}

/**
 * Create proposed actions (D1).
 */
export async function createProposedActions(
    db: D1Database,
    situation: Situation,
    sources: FusedSources,
    evidenceRefIds: string[] = []
): Promise<ProposedAction[]> {
    const proposals: ProposedAction[] = [];
    const templates = ACTION_TEMPLATES[situation.situation_key] || [];

    if (templates.length === 0) {
        templates.push({
            action_key: 'review_situation',
            title: 'Review Situation Manually',
            description: `Review the ${situation.situation_key} situation.`,
            autonomy_level: 'manual',
            base_confidence: 0.5,
            requires_approval: true,
            parameters_template: {},
            evidence_boost_rules: []
        });
    }

    const statements = [];
    for (let rank = 0; rank < templates.length; rank++) {
        const template = templates[rank];
        const confidence = calculateConfidence(template, sources);
        const id = crypto.randomUUID();

        const p: ProposedAction = {
            id,
            situation_id: situation.id,
            proposal_rank: rank + 1,
            action_type: template.action_key.split('_')[0],
            action_key: template.action_key,
            title: template.title,
            description: template.description,
            autonomy_level: template.autonomy_level,
            confidence_score: confidence,
            parameters: { ...template.parameters_template, entity_type: situation.entity_type, entity_id: situation.entity_id },
            evidence_ref_ids: evidenceRefIds.slice(0, 10),
            requires_approval: template.requires_approval
        };
        proposals.push(p);

        statements.push(db.prepare(`
            INSERT INTO action_proposals (
                id, tenant_id, situation_id, proposal_rank, action_type,
                autonomy_level, confidence_score, parameters, evidence_ref_ids
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            situation.tenant_id,
            situation.id,
            p.proposal_rank,
            p.action_key,
            p.autonomy_level,
            p.confidence_score,
            JSON.stringify({ ...p.parameters, title: p.title, description: p.description }),
            JSON.stringify(p.evidence_ref_ids)
        ));
    }

    if (statements.length > 0) await db.batch(statements);
    return proposals;
}
