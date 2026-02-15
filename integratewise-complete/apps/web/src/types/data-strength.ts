// ═══════════════════════════════════════════════════════════════
// DATA STRENGTH TYPES - Progressive Hydration System
// ═══════════════════════════════════════════════════════════════

export type DataStrengthLevel = 'seed' | 'growing' | 'healthy' | 'rich';

export interface DataStrength {
    score: number;                    // 0-100
    level: DataStrengthLevel;
    sources: string[];                // Connected tools
    gaps: DataGap[];                  // Missing data
    suggestions: EnrichmentSuggestion[];
}

export interface DataGap {
    type: 'tool' | 'entity' | 'document';
    name: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
}

export interface EnrichmentSuggestion {
    type: 'connect_tool' | 'upload_data' | 'enable_feature';
    priority: 'high' | 'medium' | 'low';
    message: string;
    action_url: string;
}

export interface TenantHydrationStatus {
    tenant_id: string;

    // Connection status
    connected_tools: ConnectedTool[];

    // Data density per store
    spine_density: SpineDensity;
    context_density: ContextDensity;
    knowledge_density: KnowledgeDensity;

    // Overall strength
    data_strength: DataStrength;

    // Timestamps
    created_at: string;
    last_sync_at: string;
    last_updated: string;
}

export interface ConnectedTool {
    tool_id: string;
    tool_name: string;
    connected_at: string;
    last_sync: string;
    sync_status: 'pending' | 'syncing' | 'complete' | 'error';
    records_synced: number;
    error_message?: string;
}

export interface SpineDensity {
    accounts: number;
    contacts: number;
    deals: number;
    meetings: number;
    tasks: number;
    projects: number;
    notes: number;
    total: number;
}

export interface ContextDensity {
    documents: number;
    emails: number;
    transcripts: number;
    extracted_facts: number;
    files_in_r2: number;
    total_bytes: number;
}

export interface KnowledgeDensity {
    summaries: number;
    topics: number;
    chunks: number;
    ai_insights: number;
    embeddings_count: number;
}

// ═══════════════════════════════════════════════════════════════
// HYDRATION STATE FOR L1 VIEWS
// ═══════════════════════════════════════════════════════════════

export type HydrationState = 'empty' | 'seeding' | 'growing' | 'rich';

export interface ViewHydrationContext {
    state: HydrationState;
    missing_sources: string[];
    enrichment_prompt?: {
        message: string;
        action: string;
    };
    data_completeness: number;  // 0-100
}

// ═══════════════════════════════════════════════════════════════
// SYNC EVENTS
// ═══════════════════════════════════════════════════════════════

export interface SyncCompleteEvent {
    tenant_id: string;
    tool: string;
    entities_synced: number;
    documents_synced: number;
    sync_duration_ms: number;
    errors?: string[];
}

export interface DataStrengthUpdatedEvent {
    type: 'data_strength_updated';
    tenant_id: string;
    old_score: number;
    new_score: number;
    old_level: DataStrengthLevel;
    new_level: DataStrengthLevel;
    trigger: string;
    entities_added: number;
    documents_added: number;
    timestamp: string;
}

// ═══════════════════════════════════════════════════════════════
// HYDRATION JOBS
// ═══════════════════════════════════════════════════════════════

export type HydrationJob =
    | { type: 'INITIAL_SYNC'; tool_id: string; tenant_id: string; }
    | { type: 'FILE_PROCESS'; file_id: string; tenant_id: string; file_type: string; }
    | { type: 'INCREMENTAL_SYNC'; tool_id: string; tenant_id: string; webhook_payload: unknown; }
    | { type: 'AI_ENRICH'; entity_type: string; entity_id: string; tenant_id: string; }
    | { type: 'BULK_IMPORT'; import_id: string; tenant_id: string; }
    | { type: 'STRENGTH_THRESHOLD_CROSSED'; tenant_id: string; new_level: DataStrengthLevel; };

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function calculateDataStrength(input: {
    connected_tools: number;
    entity_count: number;
    document_count: number;
    knowledge_count?: number;
}): DataStrength {
    let score = 0;

    // Tools contribute significantly (max ~75 for 5 tools)
    score += input.connected_tools * 15;

    // Entities (max 25)
    if (input.entity_count > 0) score += 10;
    if (input.entity_count > 50) score += 10;
    if (input.entity_count > 200) score += 5;

    // Documents (max 10)
    if (input.document_count > 0) score += 5;
    if (input.document_count > 20) score += 5;

    // Knowledge (max 10)
    if (input.knowledge_count && input.knowledge_count > 0) score += 5;
    if (input.knowledge_count && input.knowledge_count > 10) score += 5;

    score = Math.min(score, 100);

    const level = scoreToLevel(score);

    // Calculate gaps
    const gaps: DataGap[] = [];
    if (input.connected_tools < 2) {
        gaps.push({
            type: 'tool',
            name: 'CRM or Email',
            impact: 'high',
            description: 'Connect more tools to unlock cross-platform insights'
        });
    }
    if (input.document_count === 0) {
        gaps.push({
            type: 'document',
            name: 'Documents',
            impact: 'medium',
            description: 'Upload files or connect document storage for AI summaries'
        });
    }

    // Calculate suggestions
    const suggestions: EnrichmentSuggestion[] = [];
    if (score < 50) {
        suggestions.push({
            type: 'connect_tool',
            priority: 'high',
            message: 'Connect your CRM to import accounts and contacts',
            action_url: '/settings/integrations'
        });
    }
    if (input.document_count === 0) {
        suggestions.push({
            type: 'upload_data',
            priority: 'medium',
            message: 'Upload documents to enable AI summaries',
            action_url: '/import'
        });
    }

    return {
        score,
        level,
        sources: [],  // Populated by caller
        gaps,
        suggestions
    };
}

export function scoreToLevel(score: number): DataStrengthLevel {
    if (score < 25) return 'seed';
    if (score < 50) return 'growing';
    if (score < 75) return 'healthy';
    return 'rich';
}

export function levelToHydrationState(level: DataStrengthLevel): HydrationState {
    switch (level) {
        case 'seed': return 'seeding';
        case 'growing': return 'growing';
        case 'healthy': return 'growing';
        case 'rich': return 'rich';
    }
}

export function getUnlockedFeatures(level: DataStrengthLevel): string[] {
    const features: string[] = [
        'Basic workspace',
        'Manual data entry',
        'Entity views'
    ];

    if (level !== 'seed') {
        features.push(
            'Search functional',
            'Basic relationships',
            'Data import'
        );
    }

    if (level === 'healthy' || level === 'rich') {
        features.push(
            'AI summaries',
            'Health scores',
            'Risk signals',
            'Cross-tool insights'
        );
    }

    if (level === 'rich') {
        features.push(
            'Predictive intelligence',
            'Proactive recommendations',
            'Automated workflows',
            'Digital Twin'
        );
    }

    return features;
}
