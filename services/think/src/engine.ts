import { fuseSources, persistEvidenceRefs, type FusedSources } from './fusion';
import { createProposedActions, type ProposedAction } from './actions';
import { generateNarrative, type Narrative } from './narrative';

// Helper to generate UUID for correlation
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Structured logging with correlation context
function logWithContext(
    correlationId: string,
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
): void {
    const log = {
        timestamp: new Date().toISOString(),
        level,
        correlation_id: correlationId,
        service: 'think-engine',
        message,
        ...data,
    };
    console[level](JSON.stringify(log));
}

export interface ProcessEventResult {
    status: 'success' | 'no_match' | 'error';
    signals?: any[];
    situations?: any[];
    actions?: ProposedAction[];
    narrative?: Narrative;
    correlation_id?: string;
}

export interface ProcessEventOptions {
    correlationId?: string;
}

export class SignalEngine {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    /**
     * Entry point: Process a single event through the Signal Engine (D1).
     */
    async processEvent(event: {
        id: string;
        tenant_id: string;
        event_type: string;
        entity_type: string;
        entity_id: string;
    }, options: ProcessEventOptions = {}): Promise<ProcessEventResult> {
        const correlationId = options.correlationId || generateUUID();

        logWithContext(correlationId, 'info', 'Processing event (D1)', {
            event_id: event.id,
            event_type: event.event_type,
            entity_type: event.entity_type,
            entity_id: event.entity_id,
        });

        // 1. Find matching Signal Rules
        const rulesResult = await this.db.prepare(`
            SELECT * FROM signal_rules 
            WHERE (tenant_id IS NULL OR tenant_id = ?)
            AND event_type_match = ?
            AND is_active = 1
        `).bind(event.tenant_id, event.event_type).all();

        const rules = rulesResult.results || [];

        if (rules.length === 0) {
            logWithContext(correlationId, 'info', 'No matching rules found');
            return { status: 'no_match', correlation_id: correlationId };
        }

        const signalsCreated = [];
        const situationsCreated = [];
        let allActions: ProposedAction[] = [];
        let lastNarrative: Narrative | undefined;

        for (const rule of rules) {
            const r = rule as any;
            const signalId = crypto.randomUUID();
            const band = rule.severity_score > 70 ? 'critical' : rule.severity_score > 40 ? 'warning' : 'good';
            const evidenceRefs = JSON.stringify([event.id]);

            // 2. Create Signal (Structured Intelligence) - SQLite compatible
            const signalResult = await this.db.prepare(`
                INSERT INTO signals (
                    id, tenant_id, signal_key, entity_type, entity_id, 
                    metric_value, band, evidence_ref_ids, computed_at, correlation_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
                RETURNING id, signal_key
            `).bind(
                signalId,
                event.tenant_id,
                rule.signal_key,
                event.entity_type,
                event.entity_id,
                rule.severity_score,
                band,
                evidenceRefs,
                correlationId
            ).first();

            if (signalResult) {
                signalsCreated.push(signalResult);
                logWithContext(correlationId, 'info', 'Signal created', {
                    signal_id: signalId,
                    signal_key: rule.signal_key,
                });

                // 3. Attempt Situation Escalation
                const escalationResult = await this.checkEscalation(
                    event.tenant_id,
                    event.entity_type,
                    event.entity_id,
                    signalResult,
                    correlationId
                );

                if (escalationResult) {
                    situationsCreated.push(escalationResult.situation);
                    if (escalationResult.actions) {
                        allActions = allActions.concat(escalationResult.actions);
                    }
                    if (escalationResult.narrative) {
                        lastNarrative = escalationResult.narrative;
                    }
                }
            }
        }

        return {
            status: 'success',
            signals: signalsCreated,
            situations: situationsCreated,
            actions: allActions,
            narrative: lastNarrative,
            correlation_id: correlationId
        };
    }

    /**
     * Check if a new signal triggers a Situation Escalation.
     */
    private async checkEscalation(
        tenant_id: string,
        entity_type: string,
        entity_id: string,
        newSignal: any,
        correlationId: string
    ): Promise<{ situation: any; actions: ProposedAction[]; narrative: Narrative; sources: FusedSources } | null> {

        // Find rules that require this signal
        // Note: required_signal_keys is a JSON array in SQLite/D1
        const escalationRulesResult = await this.db.prepare(`
            SELECT * FROM situation_escalation_rules
            WHERE json_each_text(required_signal_keys) = ?
            AND (tenant_id IS NULL OR tenant_id = ?)
        `).bind(newSignal.signal_key, tenant_id).all();

        const escalationRules = escalationRulesResult.results || [];

        for (const rule of escalationRules) {
            const r = rule as any;
            const requiredKeys = typeof rule.required_signal_keys === 'string'
                ? JSON.parse(rule.required_signal_keys)
                : rule.required_signal_keys;

            // Check if ALL required signals exist for this entity recently (last 48h)
            const placeholders = requiredKeys.map(() => '?').join(',');
            const activeSignalsResult = await this.db.prepare(`
                SELECT id, signal_key FROM signals
                WHERE tenant_id = ?
                AND entity_type = ?
                AND entity_id = ?
                AND signal_key IN (${placeholders})
                AND computed_at > datetime('now', '-48 hours')
            `).bind(tenant_id, entity_type, entity_id, ...requiredKeys).all();

            const activeSignals = activeSignalsResult.results || [];
            const foundKeys = new Set(activeSignals.map(s => s.signal_key));
            const allFound = requiredKeys.every((key: string) => foundKeys.has(key));

            if (allFound) {
                logWithContext(correlationId, 'info', 'Escalation triggered', {
                    situation_key: rule.situation_key,
                    required_signals: requiredKeys,
                });

                // ====== A/B/C FUSION ======
                const sources = await fuseSources(
                    this.db,
                    entity_type,
                    entity_id,
                    tenant_id,
                    { lookbackHours: 72, correlationId }
                );

                const evidenceRefIds = await persistEvidenceRefs(
                    this.db,
                    tenant_id,
                    sources.evidence_refs
                );

                const signalIds = JSON.stringify(activeSignals.map(s => s.id));
                const situationId = crypto.randomUUID();

                // Escalate to SITUATION
                const situation = await this.db.prepare(`
                    INSERT INTO situations (
                        id, tenant_id, situation_key, title, summary, 
                        severity, signal_ids, evidence_ref_ids, entity_type, entity_id, 
                        status, created_at, correlation_id, plane_status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP, ?, ?)
                    RETURNING *
                `).bind(
                    situationId,
                    tenant_id,
                    rule.situation_key,
                    'Alert: ' + rule.situation_key.replace('.', ' '),
                    'Detected complex signal pattern',
                    rule.min_severity_threshold > 80 ? 'critical' : 'high',
                    signalIds,
                    JSON.stringify(evidenceRefIds),
                    entity_type,
                    entity_id,
                    correlationId,
                    JSON.stringify(sources.plane_status)
                ).first();

                if (situation) {
                    const narrative = generateNarrative(
                        { id: situation.id as string, situation_key: rule.situation_key, entity_type, entity_id, tenant_id },
                        sources
                    );

                    const actions = await createProposedActions(this.db, {
                        id: situation.id as string,
                        situation_key: rule.situation_key,
                        entity_type, entity_id, tenant_id
                    }, sources, evidenceRefIds);

                    await this.db.prepare(`
                        UPDATE situations 
                        SET summary = ?,
                            metadata = ?
                        WHERE id = ?
                    `).bind(
                        narrative.summary,
                        JSON.stringify({
                            why_it_matters: narrative.why_it_matters,
                            recommended_focus: narrative.recommended_focus,
                            urgency_indicator: narrative.urgency_indicator
                        }),
                        situation.id
                    ).run();

                    return { situation, actions, narrative, sources };
                }
            }
        }

        return null;
    }

    /**
     * On-demand analysis
     */
    async analyzeEntity(
        tenant_id: string,
        entity_type: string,
        entity_id: string
    ): Promise<{ sources: FusedSources; narrative: Narrative }> {
        const sources = await fuseSources(
            this.db,
            entity_type,
            entity_id,
            tenant_id,
            { lookbackHours: 168 }
        );

        const narrative = generateNarrative(
            { id: 'analysis', situation_key: 'manual.analysis', entity_type, entity_id, tenant_id },
            sources
        );

        return { sources, narrative };
    }
}
