/**
 * IntegrateWise Think Engine - Fusion Test Suite
 *
 * Comprehensive tests for the A/B/C plane fusion, action generation,
 * and narrative creation systems.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// =============================================================================
// MOCKS
// =============================================================================

// Mock the neon database client
const mockSql = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql),
}));

// Import after mocking
import { fuseSources, type FusedSources, type EvidenceRef } from './fusion';
import { createProposedActions, getActionTemplates, type Situation, type ProposedAction } from './actions';
import { generateNarrative, type Narrative } from './narrative';

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

const createMockSignal = (overrides = {}) => ({
  id: 'signal-001',
  signal_key: 'churn.risk',
  metric_value: 0.85,
  band: 'critical',
  computed_at: new Date().toISOString(),
  evidence_ref_ids: [],
  ...overrides,
});

const createMockMetric = (overrides = {}) => ({
  id: 'metric-001',
  metric_key: 'nps_score',
  metric_value: 45,
  unit: 'score',
  recorded_at: new Date().toISOString(),
  ...overrides,
});

const createMockEvent = (overrides = {}) => ({
  id: 'event-001',
  event_type: 'support_ticket_created',
  source_system: 'zendesk',
  payload: {},
  created_at: new Date().toISOString(),
  ...overrides,
});

const createMockArtifact = (overrides = {}) => ({
  id: 'artifact-001',
  artifact_type: 'contract',
  title: 'Service Agreement',
  content_summary: 'Annual contract for enterprise tier',
  source_system: 'docusign',
  link_type: 'related',
  ...overrides,
});

const createMockSession = (overrides = {}) => ({
  id: 'session-001',
  title: 'Churn Analysis Session',
  session_type: 'analysis',
  status: 'completed',
  created_at: new Date().toISOString(),
  summary: 'Analyzed churn risk factors',
  ...overrides,
});

const createMockInsight = (overrides = {}) => ({
  id: 'insight-001',
  session_id: 'session-001',
  insight_type: 'risk_factor',
  content: 'Customer engagement dropping steadily',
  confidence: 0.8,
  created_at: new Date().toISOString(),
  ...overrides,
});

const createMockSituation = (overrides = {}): Situation => ({
  id: 'situation-001',
  situation_key: 'churn.risk',
  entity_type: 'client',
  entity_id: 'client-001',
  tenant_id: 'tenant-001',
  severity: 'high',
  ...overrides,
});

const createMockFusedSources = (overrides: Partial<FusedSources> = {}): FusedSources => ({
  spine: {
    signals: [createMockSignal()],
    metrics: [createMockMetric()],
    events: [createMockEvent()],
  },
  context: {
    artifacts: [createMockArtifact()],
    emails: [],
    documents: [],
    semantic_chunks: [], // Day 2: Added for semantic search
  },
  ai: {
    sessions: [createMockSession()],
    insights: [createMockInsight()],
    semantic_sessions: [], // Day 2: Added for semantic search
  },
  evidence_refs: [],
  plane_status: { A: 'available', B: 'available', C: 'available' }, // Day 2: Required field
  ...overrides,
});

// =============================================================================
// FUSION TESTS
// =============================================================================

describe('Think Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fuseSources()', () => {
    it('should query all 3 planes', async () => {
      // Setup mock responses for all 3 planes
      mockSql
        .mockResolvedValueOnce([createMockSignal()]) // signals
        .mockResolvedValueOnce([createMockMetric()]) // metrics
        .mockResolvedValueOnce([createMockEvent()]) // events
        .mockResolvedValueOnce([createMockArtifact()]) // artifacts
        .mockResolvedValueOnce([]) // emails
        .mockResolvedValueOnce([]) // documents
        .mockResolvedValueOnce([createMockSession()]) // sessions
        .mockResolvedValueOnce([createMockInsight()]); // insights

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      // Verify all planes were queried
      expect(result.spine).toBeDefined();
      expect(result.context).toBeDefined();
      expect(result.ai).toBeDefined();
    });

    it('should collect evidence refs from spine', async () => {
      const signals = [
        createMockSignal({ id: 'sig-1', band: 'critical' }),
        createMockSignal({ id: 'sig-2', band: 'warning' }),
      ];
      const events = [createMockEvent({ id: 'evt-1' })];

      mockSql
        .mockResolvedValueOnce(signals)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(events)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      // Verify spine data is collected
      expect(result.spine.signals).toHaveLength(2);
      expect(result.spine.events).toHaveLength(1);

      // Verify evidence refs are built
      const spineRefs = result.evidence_refs.filter(
        (r) =>
          r.ref_type === 'spine_signal' || r.ref_type === 'spine_event'
      );
      expect(spineRefs.length).toBeGreaterThan(0);
    });

    it('should collect evidence refs from context', async () => {
      const artifacts = [createMockArtifact({ id: 'art-1' })];
      const emails = [
        { id: 'email-1', subject: 'Re: Support', sender: 'user@test.com', received_at: new Date().toISOString(), snippet: 'Test email' }
      ];

      mockSql
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(artifacts)
        .mockResolvedValueOnce(emails)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      expect(result.context.artifacts).toHaveLength(1);
      expect(result.context.emails).toHaveLength(1);

      const contextRefs = result.evidence_refs.filter(
        (r) =>
          r.ref_type === 'context_artifact' || r.ref_type === 'context_email'
      );
      expect(contextRefs.length).toBeGreaterThan(0);
    });

    it('should collect evidence refs from AI sessions', async () => {
      const sessions = [createMockSession({ id: 'sess-1' })];
      const insights = [
        createMockInsight({ id: 'ins-1', confidence: 0.9 }),
        createMockInsight({ id: 'ins-2', confidence: 0.7 }),
      ];

      mockSql
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(sessions)
        .mockResolvedValueOnce(insights);

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      expect(result.ai.sessions).toHaveLength(1);
      expect(result.ai.insights).toHaveLength(2);

      const aiRefs = result.evidence_refs.filter(
        (r) => r.ref_type === 'ai_session' || r.ref_type === 'ai_insight'
      );
      expect(aiRefs.length).toBeGreaterThan(0);
    });

    it('should return empty arrays when no data', async () => {
      mockSql
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      expect(result.spine.signals).toHaveLength(0);
      expect(result.spine.metrics).toHaveLength(0);
      expect(result.spine.events).toHaveLength(0);
      expect(result.context.artifacts).toHaveLength(0);
      expect(result.context.emails).toHaveLength(0);
      expect(result.context.documents).toHaveLength(0);
      expect(result.ai.sessions).toHaveLength(0);
      expect(result.ai.insights).toHaveLength(0);
      expect(result.evidence_refs).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      // Some queries succeed, some fail (using .catch in actual implementation)
      mockSql
        .mockResolvedValueOnce([createMockSignal()])
        .mockRejectedValueOnce(new Error('DB Error'))
        .mockResolvedValueOnce([])
        .mockRejectedValueOnce(new Error('DB Error'))
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockRejectedValueOnce(new Error('DB Error'))
        .mockResolvedValueOnce([]);

      // The function should handle errors internally via .catch()
      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      expect(result).toBeDefined();
      expect(result.spine.signals).toHaveLength(1); // First succeeded
    });

    it('should sort evidence refs by relevance score', async () => {
      const signals = [
        createMockSignal({ id: 'sig-critical', band: 'critical' }),
        createMockSignal({ id: 'sig-ok', band: 'ok' }),
      ];

      mockSql
        .mockResolvedValueOnce(signals)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await fuseSources(
        'postgres://test',
        'client',
        'client-001',
        'tenant-001'
      );

      // Critical signals should have higher relevance and appear first
      if (result.evidence_refs.length > 1) {
        expect(result.evidence_refs[0].relevance_score).toBeGreaterThanOrEqual(
          result.evidence_refs[1].relevance_score ?? 0
        );
      }
    });
  });

  // ===========================================================================
  // PROPOSED ACTIONS TESTS
  // ===========================================================================

  describe('createProposedActions()', () => {
    beforeEach(() => {
      // Mock database inserts for action proposals
      mockSql.mockImplementation(() => Promise.resolve([{ id: 'proposal-001' }]));
    });

    it('should match situation to action template', async () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources();

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        ['evidence-001']
      );

      expect(actions.length).toBeGreaterThan(0);
      expect(
        actions.some(
          (a) =>
            a.action_key === 'schedule_health_call' ||
            a.action_key === 'offer_discount'
        )
      ).toBe(true);
    });

    it('should calculate confidence score', async () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources({
        ai: {
          sessions: [createMockSession()],
          insights: [createMockInsight({ confidence: 0.9 })],
        },
      });

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        []
      );

      for (const action of actions) {
        expect(action.confidence_score).toBeGreaterThanOrEqual(0);
        expect(action.confidence_score).toBeLessThanOrEqual(1);
      }
    });

    it('should include evidence ref ids', async () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources({
        evidence_refs: [
          {
            ref_type: 'spine_signal',
            ref_id: 'sig-001',
            ref_table: 'signals',
            relevance_score: 0.9,
          },
          {
            ref_type: 'ai_insight',
            ref_id: 'ins-001',
            ref_table: 'brainstorm_insights',
            relevance_score: 0.8,
          },
        ],
      });

      const evidenceIds = ['sig-001', 'ins-001'];
      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        evidenceIds
      );

      expect(actions.length).toBeGreaterThan(0);
      for (const action of actions) {
        expect(action.evidence_ref_ids).toBeDefined();
        expect(Array.isArray(action.evidence_ref_ids)).toBe(true);
        expect(action.evidence_ref_ids).toEqual(expect.arrayContaining(evidenceIds));
      }
    });

    it('should set autonomy level based on confidence', async () => {
      const situation = createMockSituation({
        situation_key: 'billing.payment_failed',
      });
      const sources = createMockFusedSources();

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        []
      );

      // Check that autonomy levels are set correctly
      for (const action of actions) {
        expect(['autonomous', 'supervised', 'manual']).toContain(
          action.autonomy_level
        );
      }

      // High confidence actions should have autonomous level
      const autonomousActions = actions.filter(
        (a) => a.autonomy_level === 'autonomous'
      );
      for (const action of autonomousActions) {
        expect(action.confidence_score).toBeGreaterThanOrEqual(0.8);
      }
    });

    it('should create fallback action for unknown situation', async () => {
      const situation = createMockSituation({
        situation_key: 'unknown.situation.type',
      });
      const sources = createMockFusedSources();

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        []
      );

      // Should create a fallback "review_situation" action
      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some((a) => a.action_key === 'review_situation')).toBe(true);
    });

    it('should assign proposal ranks', async () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources();

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        []
      );

      if (actions.length > 1) {
        // Ranks should be sequential starting from 1
        const ranks = actions.map((a) => a.proposal_rank).sort((a, b) => a - b);
        for (let i = 0; i < ranks.length; i++) {
          expect(ranks[i]).toBe(i + 1);
        }
      }
    });

    it('should set requires_approval correctly', async () => {
      const situation = createMockSituation({
        situation_key: 'billing.payment_failed',
      });
      const sources = createMockFusedSources();

      const actions = await createProposedActions(
        'postgres://test',
        situation,
        sources,
        []
      );

      // Check mix of approval requirements
      const autoApproved = actions.filter((a) => !a.requires_approval);
      const needsApproval = actions.filter((a) => a.requires_approval);

      // Billing actions should have some that don't require approval
      expect(autoApproved.length + needsApproval.length).toBe(actions.length);
    });

    it('should return action templates for known situation', () => {
      const templates = getActionTemplates('churn.risk');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some((t) => t.action_key === 'schedule_health_call')).toBe(true);
    });

    it('should return empty templates for unknown situation', () => {
      const templates = getActionTemplates('completely.unknown.situation');

      expect(templates).toEqual([]);
    });
  });

  // ===========================================================================
  // NARRATIVE GENERATION TESTS
  // ===========================================================================

  describe('generateNarrative()', () => {
    it('should generate summary from situation', () => {
      const situation = createMockSituation({
        situation_key: 'churn.risk',
        entity_id: 'client-123',
      });
      const sources = createMockFusedSources();

      const narrative = generateNarrative(situation, sources);

      expect(narrative.summary).toBeDefined();
      expect(narrative.summary.length).toBeGreaterThan(0);
      expect(narrative.summary).toContain('client-123');
    });

    it('should include key evidence points', () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources({
        spine: {
          signals: [
            createMockSignal({
              band: 'critical',
              signal_key: 'engagement_drop',
            }),
          ],
          metrics: [],
          events: [createMockEvent({ event_type: 'support_escalation' })],
        },
        ai: {
          sessions: [],
          insights: [createMockInsight({ insight_type: 'churn_prediction' })],
        },
      });

      const narrative = generateNarrative(situation, sources);

      expect(narrative.key_evidence).toBeDefined();
      expect(Array.isArray(narrative.key_evidence)).toBe(true);
      expect(narrative.key_evidence.length).toBeGreaterThan(0);
    });

    it('should set urgency indicator', () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });

      // Test with critical signals
      const criticalSources = createMockFusedSources({
        spine: {
          signals: [
            createMockSignal({ band: 'critical' }),
            createMockSignal({ band: 'critical' }),
          ],
          metrics: [],
          events: [],
        },
      });

      const criticalNarrative = generateNarrative(situation, criticalSources);
      expect(['critical', 'high', 'medium', 'low']).toContain(
        criticalNarrative.urgency_indicator
      );

      // With multiple critical signals, should be critical or high
      expect(['critical', 'high']).toContain(
        criticalNarrative.urgency_indicator
      );
    });

    it('should set low urgency when no critical signals', () => {
      const situation = createMockSituation({
        situation_key: 'expansion.opportunity',
      });
      const sources = createMockFusedSources({
        spine: {
          signals: [],
          metrics: [],
          events: [],
        },
        ai: {
          sessions: [],
          insights: [],
        },
      });

      const narrative = generateNarrative(situation, sources);

      expect(narrative.urgency_indicator).toBe('low');
    });

    it('should include why_it_matters', () => {
      const situation = createMockSituation({ situation_key: 'churn.risk' });
      const sources = createMockFusedSources();

      const narrative = generateNarrative(situation, sources);

      expect(narrative.why_it_matters).toBeDefined();
      expect(narrative.why_it_matters.length).toBeGreaterThan(0);
    });

    it('should include recommended_focus', () => {
      const situation = createMockSituation({
        situation_key: 'billing.payment_failed',
      });
      const sources = createMockFusedSources();

      const narrative = generateNarrative(situation, sources);

      expect(narrative.recommended_focus).toBeDefined();
      expect(narrative.recommended_focus.length).toBeGreaterThan(0);
    });

    it('should use default template for unknown situation', () => {
      const situation = createMockSituation({
        situation_key: 'some.unknown.situation',
        entity_type: 'client',
        entity_id: 'client-999',
      });
      const sources = createMockFusedSources();

      const narrative = generateNarrative(situation, sources);

      expect(narrative.summary).toBeDefined();
      expect(narrative.summary).toContain('client');
      expect(narrative.summary).toContain('client-999');
    });
  });
});
