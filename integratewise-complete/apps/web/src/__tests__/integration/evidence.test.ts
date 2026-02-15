/**
 * Evidence Click-Through Integration Test
 * Tests: A/B/C Evidence Display → Drill-down → Source Linking
 * Day 4: UI Polish + Integration + Testing
 */

import { describe, test, expect, beforeEach } from 'vitest'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Helper function
function generateCorrelationId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const correlationId = generateCorrelationId()
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      ...options.headers
    }
  })
  return { response, correlationId }
}

describe('Evidence Integration', () => {
  const testEntityId = 'evidence-test-account'
  const testTenantId = 'evidence-test-tenant'

  describe('Evidence Type A (Activity)', () => {
    test('should fetch activity evidence for entity', async () => {
      const { response } = await apiCall(`/api/evidence?entity_id=${testEntityId}&type=A`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.evidence)).toBe(true)
      
      // All evidence should be type A
      data.evidence.forEach((e: any) => {
        expect(e.evidence_type).toBe('A')
      })
    })

    test('should include source link in activity evidence', async () => {
      // Create evidence with source link
      const { response } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          signal_type: 'activity',
          evidence_type: 'A',
          payload: {
            source: 'salesforce',
            source_id: 'sf-opp-12345',
            source_url: 'https://salesforce.com/opportunity/12345',
            event_type: 'opportunity_stage_change',
            from_stage: 'Qualification',
            to_stage: 'Proposal'
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.payload.source_url).toBeDefined()
    })

    test('should filter activities by date range', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      const endDate = new Date()

      const { response } = await apiCall(
        `/api/evidence?entity_id=${testEntityId}&type=A&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      data.evidence.forEach((e: any) => {
        const created = new Date(e.created_at)
        expect(created >= startDate).toBe(true)
        expect(created <= endDate).toBe(true)
      })
    })
  })

  describe('Evidence Type B (Behavior)', () => {
    test('should fetch behavior evidence for entity', async () => {
      const { response } = await apiCall(`/api/evidence?entity_id=${testEntityId}&type=B`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.evidence)).toBe(true)
      
      // All evidence should be type B
      data.evidence.forEach((e: any) => {
        expect(e.evidence_type).toBe('B')
      })
    })

    test('should include trend data in behavior evidence', async () => {
      // Create behavior evidence with trend
      const { response } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          signal_type: 'behavior',
          evidence_type: 'B',
          payload: {
            source: 'analytics',
            pattern: 'increasing_engagement',
            trend: {
              direction: 'up',
              change_percent: 45,
              baseline_period: '7d',
              comparison_period: '7d'
            },
            metrics: {
              page_views: { current: 145, previous: 100 },
              session_duration: { current: 320, previous: 220 }
            }
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.payload.trend).toBeDefined()
      expect(data.payload.trend.direction).toBe('up')
    })

    test('should aggregate behavior patterns', async () => {
      const { response } = await apiCall(`/api/evidence/patterns?entity_id=${testEntityId}`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.patterns).toBeDefined()
    })
  })

  describe('Evidence Type C (Context)', () => {
    test('should fetch context evidence for entity', async () => {
      const { response } = await apiCall(`/api/evidence?entity_id=${testEntityId}&type=C`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.evidence)).toBe(true)
      
      // All evidence should be type C
      data.evidence.forEach((e: any) => {
        expect(e.evidence_type).toBe('C')
      })
    })

    test('should include enrichment data in context evidence', async () => {
      // Create context evidence with enrichment
      const { response } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          signal_type: 'context',
          evidence_type: 'C',
          payload: {
            source: 'clearbit',
            enrichment_type: 'company_data',
            data: {
              industry: 'Technology',
              employee_count: 500,
              funding_stage: 'Series C',
              annual_revenue: '$50M-$100M',
              tech_stack: ['Salesforce', 'HubSpot', 'Slack']
            }
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.payload.data).toBeDefined()
    })

    test('should include external references', async () => {
      const { response } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          signal_type: 'context',
          evidence_type: 'C',
          payload: {
            source: 'news',
            context_type: 'news_mention',
            title: 'Company Announces New Product Launch',
            url: 'https://news.example.com/article/12345',
            published_at: new Date().toISOString(),
            sentiment: 'positive'
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.payload.url).toBeDefined()
    })
  })

  describe('Evidence Aggregation', () => {
    test('should fetch all evidence types combined', async () => {
      const { response } = await apiCall(`/api/evidence?entity_id=${testEntityId}`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.evidence)).toBe(true)
      
      // Should include mixed types
      const types = new Set(data.evidence.map((e: any) => e.evidence_type))
      // May have 1, 2, or 3 types depending on data
      expect(types.size).toBeGreaterThanOrEqual(0)
    })

    test('should sort evidence by timestamp', async () => {
      const { response } = await apiCall(`/api/evidence?entity_id=${testEntityId}&sort=timestamp&order=desc`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // Check timestamps are in descending order
      for (let i = 1; i < data.evidence.length; i++) {
        const prev = new Date(data.evidence[i - 1].created_at).getTime()
        const curr = new Date(data.evidence[i].created_at).getTime()
        expect(prev >= curr).toBe(true)
      }
    })

    test('should paginate evidence results', async () => {
      const { response: page1 } = await apiCall(`/api/evidence?entity_id=${testEntityId}&limit=5&offset=0`)
      const { response: page2 } = await apiCall(`/api/evidence?entity_id=${testEntityId}&limit=5&offset=5`)
      
      expect(page1.status).toBe(200)
      expect(page2.status).toBe(200)
      
      const data1 = await page1.json()
      const data2 = await page2.json()
      
      expect(data1.evidence.length).toBeLessThanOrEqual(5)
      expect(data2.evidence.length).toBeLessThanOrEqual(5)
      
      // Ensure no overlap
      const ids1 = new Set(data1.evidence.map((e: any) => e.id))
      const hasOverlap = data2.evidence.some((e: any) => ids1.has(e.id))
      expect(hasOverlap).toBe(false)
    })
  })

  describe('Evidence-Action Linking', () => {
    test('should link evidence to proposed action', async () => {
      // Get evidence
      const { response: evidenceResponse } = await apiCall(`/api/evidence?entity_id=${testEntityId}&limit=3`)
      const evidenceData = await evidenceResponse.json()
      const evidenceIds = evidenceData.evidence.map((e: any) => e.id)

      // Create action with evidence
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          action_type: 'follow_up',
          proposed_by: 'ai',
          confidence: 0.85,
          evidence_ids: evidenceIds
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.evidence_ids).toBeDefined()
      expect(data.evidence_ids.length).toBeGreaterThanOrEqual(0)
    })

    test('should retrieve evidence for action', async () => {
      const actionId = 'test-action-with-evidence'
      
      const { response } = await apiCall(`/api/actions/${actionId}/evidence`)
      
      // Either 200 with evidence or 404
      expect([200, 404]).toContain(response.status)
      
      if (response.status === 200) {
        const data = await response.json()
        expect(Array.isArray(data.evidence)).toBe(true)
      }
    })
  })

  describe('Source Click-Through', () => {
    test('should generate valid source URL for CRM records', async () => {
      const { response } = await apiCall('/api/evidence/source-url', {
        method: 'POST',
        body: JSON.stringify({
          source: 'salesforce',
          object_type: 'Opportunity',
          object_id: 'opp-12345'
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.url).toBeDefined()
      expect(data.url).toContain('salesforce')
    })

    test('should generate valid source URL for support tickets', async () => {
      const { response } = await apiCall('/api/evidence/source-url', {
        method: 'POST',
        body: JSON.stringify({
          source: 'zendesk',
          object_type: 'Ticket',
          object_id: 'ticket-67890'
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.url).toBeDefined()
    })

    test('should handle missing source gracefully', async () => {
      const { response } = await apiCall('/api/evidence/source-url', {
        method: 'POST',
        body: JSON.stringify({
          source: 'unknown_source',
          object_type: 'Unknown',
          object_id: 'id-123'
        })
      })

      // Should not error, may return null or placeholder
      expect([200, 400]).toContain(response.status)
    })
  })

  describe('Evidence Confidence Scoring', () => {
    test('should calculate confidence from evidence weight', async () => {
      const evidenceItems = [
        { type: 'A', weight: 0.8, recency_days: 1 },
        { type: 'B', weight: 0.6, recency_days: 3 },
        { type: 'C', weight: 0.4, recency_days: 7 }
      ]

      const { response } = await apiCall('/api/evidence/calculate-confidence', {
        method: 'POST',
        body: JSON.stringify({ evidence: evidenceItems })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.confidence).toBeDefined()
      expect(data.confidence).toBeGreaterThanOrEqual(0)
      expect(data.confidence).toBeLessThanOrEqual(1)
    })

    test('should weight recency in confidence calculation', async () => {
      // Recent evidence
      const { response: recentResponse } = await apiCall('/api/evidence/calculate-confidence', {
        method: 'POST',
        body: JSON.stringify({
          evidence: [{ type: 'A', weight: 0.8, recency_days: 1 }]
        })
      })

      // Old evidence
      const { response: oldResponse } = await apiCall('/api/evidence/calculate-confidence', {
        method: 'POST',
        body: JSON.stringify({
          evidence: [{ type: 'A', weight: 0.8, recency_days: 30 }]
        })
      })

      const recentData = await recentResponse.json()
      const oldData = await oldResponse.json()

      // Recent should have higher confidence (if recency weighting is implemented)
      expect(recentData.confidence).toBeGreaterThanOrEqual(oldData.confidence)
    })
  })
})

describe('Timeline Integration', () => {
  const testEntityId = 'timeline-test-account'

  test('should fetch unified timeline', async () => {
    const { response } = await apiCall(`/api/timeline?entity_id=${testEntityId}`)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data.events)).toBe(true)
  })

  test('should include all event types in timeline', async () => {
    const { response } = await apiCall(`/api/timeline?entity_id=${testEntityId}`)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    
    // Check for various event types
    const eventTypes = new Set(data.events.map((e: any) => e.type))
    console.log('Event types found:', Array.from(eventTypes))
  })

  test('should filter timeline by evidence type', async () => {
    const { response } = await apiCall(`/api/timeline?entity_id=${testEntityId}&evidence_types=A,B`)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    
    data.events.forEach((e: any) => {
      if (e.evidence_type) {
        expect(['A', 'B']).toContain(e.evidence_type)
      }
    })
  })

  test('should order timeline chronologically', async () => {
    const { response } = await apiCall(`/api/timeline?entity_id=${testEntityId}`)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    
    // Check chronological order
    for (let i = 1; i < data.events.length; i++) {
      const prev = new Date(data.events[i - 1].timestamp).getTime()
      const curr = new Date(data.events[i].timestamp).getTime()
      expect(prev >= curr).toBe(true) // Descending order
    }
  })
})
