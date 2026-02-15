
export interface ContextPackModule {
    name: string;
    requiredFields?: Record<string, string[]>; // collection -> fields
    description?: string;
}

export const PACK_MODULES: Record<string, ContextPackModule> = {
    // CSM Modules
    commercial: {
        name: 'Commercial / Renewal',
        requiredFields: {
            account: ['contract_type', 'arr', 'renewal_date', 'account_status'],
            ownership: ['csm_id', 'ae_id']
        }
    },
    stakeholder: {
        name: 'Stakeholder & Relationship',
        requiredFields: {
            account: ['sentiment', 'relationship_depth'],
            contact: ['role', 'seniority']
        }
    },
    success_plan: {
        name: 'Success Plan',
        requiredFields: {
            account: ['success_plan_status', 'next_qbr_date']
        }
    },
    outcomes: {
        name: 'Outcomes',
        requiredFields: {
            objective: ['outcome_statement', 'success_metric', 'target_value']
        }
    },
    engagement: {
        name: 'Engagement Log',
        requiredFields: {
            event: ['engagement_type', 'attendees_count']
        }
    },

    // TAM Modules
    api_portfolio: {
        name: 'API Portfolio',
        requiredFields: {
            account: ['api_count', 'integration_strategy'],
            document: ['api_type', 'criticality']
        }
    },
    platform_metrics: {
        name: 'Platform Health Metrics',
        requiredFields: {
            account: ['uptime_pct', 'error_rate_pct'],
            metric: ['threshold_warning', 'threshold_critical']
        }
    },
    tech_risk: {
        name: 'Technical Debt & Risk',
        requiredFields: {
            risk: ['affected_capability', 'impact_score', 'probability_score']
        }
    },
    capability_maturity: {
        name: 'Capability & Maturity',
        requiredFields: {
            account: ['digital_maturity_score'],
            objective: ['target_maturity']
        }
    },
    value_stream: {
        name: 'Value Stream',
        requiredFields: {
            account: ['business_process_owner'],
            task: ['cycle_time_target']
        }
    }
};

export const CONTEXT_REGISTRY: Record<string, string[]> = {
    personal: [], // Core only
    csm: ['commercial', 'stakeholder', 'success_plan', 'outcomes', 'engagement'],
    tam: ['api_portfolio', 'platform_metrics', 'tech_risk', 'capability_maturity', 'value_stream'],
    business: ['commercial', 'outcomes'],
    team: ['engagement', 'success_plan']
};

/**
 * Get all required fields for a context and entity type
 */
export function getRequiredFields(context: string, entityType: string): string[] {
    const packs = CONTEXT_REGISTRY[context] || [];
    const fields = new Set<string>();

    // Always add core (could define core pack too)

    for (const packKey of packs) {
        const pack = PACK_MODULES[packKey];
        if (pack?.requiredFields?.[entityType]) {
            pack.requiredFields[entityType].forEach(f => fields.add(f));
        }
    }

    return Array.from(fields);
}
