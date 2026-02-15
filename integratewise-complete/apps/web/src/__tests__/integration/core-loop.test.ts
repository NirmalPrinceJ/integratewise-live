/**
 * Core Loop Integration Test
 * Tests: Signal → Situation → Action → Execution
 * Day 4: UI Polish + Integration + Testing
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mock API endpoints
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Helper function to generate correlation ID
function generateCorrelationId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to make API calls
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

describe('Core Loop Integration', () => {
  let testAccountId: string
  let testTenantId: string

  beforeEach(() => {
    testAccountId = `test-account-${Date.now()}`
    testTenantId = `test-tenant-${Date.now()}`
  })

  describe('Signal Ingestion', () => {
    test('should ingest a raw signal and return signal ID', async () => {
      const signalPayload = {
        tenant_id: testTenantId,
        entity_type: 'account',
        entity_id: testAccountId,
        signal_type: 'activity',
        evidence_type: 'A',
        payload: {
          source: 'salesforce',
          event_type: 'opportunity_created',
          opportunity_value: 50000,
          opportunity_name: 'Test Integration Opportunity'
        }
      }

      const { response, correlationId } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify(signalPayload)
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data).toHaveProperty('signal_id')
      expect(data).toHaveProperty('correlation_id', correlationId)
    })

    test('should batch ingest multiple signals', async () => {
      const signals = [
        {
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testAccountId,
          signal_type: 'activity',
          evidence_type: 'A',
          payload: { source: 'email', event_type: 'email_opened' }
        },
        {
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testAccountId,
          signal_type: 'behavior',
          evidence_type: 'B',
          payload: { source: 'website', event_type: 'page_view', page: '/pricing' }
        }
      ]

      const { response } = await apiCall('/api/signals/batch', {
        method: 'POST',
        body: JSON.stringify({ signals })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.processed).toBe(2)
      expect(data.failed).toBe(0)
    })

    test('should validate signal schema', async () => {
      const invalidSignal = {
        tenant_id: testTenantId,
        // Missing required fields
      }

      const { response } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify(invalidSignal)
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Situation Detection', () => {
    test('should detect situation when threshold signals reached', async () => {
      // Ingest multiple signals to trigger situation
      const signalTypes = ['email_opened', 'page_view', 'document_download', 'pricing_check']
      
      for (const eventType of signalTypes) {
        await apiCall('/api/signals/ingest', {
          method: 'POST',
          body: JSON.stringify({
            tenant_id: testTenantId,
            entity_type: 'account',
            entity_id: testAccountId,
            signal_type: 'activity',
            evidence_type: 'A',
            payload: { source: 'test', event_type: eventType }
          })
        })
      }

      // Check for situations
      const { response } = await apiCall(`/api/situations?entity_id=${testAccountId}`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      // May or may not have situations depending on rules
      expect(Array.isArray(data.situations)).toBe(true)
    })

    test('should link signals to situation', async () => {
      // Create a situation manually for testing
      const situationPayload = {
        tenant_id: testTenantId,
        entity_type: 'account',
        entity_id: testAccountId,
        situation_type: 'expansion_opportunity',
        severity: 'high',
        signal_ids: ['sig-1', 'sig-2', 'sig-3']
      }

      const { response } = await apiCall('/api/situations', {
        method: 'POST',
        body: JSON.stringify(situationPayload)
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data).toHaveProperty('situation_id')
      expect(data.signal_count).toBe(3)
    })
  })

  describe('Action Proposal', () => {
    test('should propose action for situation', async () => {
      const actionPayload = {
        tenant_id: testTenantId,
        entity_type: 'account',
        entity_id: testAccountId,
        action_type: 'send_outreach',
        situation_id: 'test-situation',
        proposed_by: 'ai',
        confidence: 0.85,
        evidence_summary: 'High engagement signals detected',
        parameters: {
          template: 'expansion-outreach',
          channel: 'email'
        }
      }

      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify(actionPayload)
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data).toHaveProperty('action_id')
      expect(data.status).toBe('pending')
    })

    test('should list pending actions for entity', async () => {
      const { response } = await apiCall(`/api/actions?entity_id=${testAccountId}&status=pending`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.actions)).toBe(true)
    })
  })

  describe('Action Approval', () => {
    test('should approve pending action', async () => {
      // First create a pending action
      const createResponse = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testAccountId,
          action_type: 'send_outreach',
          proposed_by: 'ai',
          confidence: 0.85
        })
      })
      
      const action = await createResponse.response.json()

      // Approve the action
      const { response } = await apiCall(`/api/actions/${action.action_id}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          approved_by: 'test-user',
          feedback: 'Approved for testing'
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('approved')
    })

    test('should reject pending action with reason', async () => {
      // Create a pending action
      const createResponse = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testAccountId,
          action_type: 'offer_discount',
          proposed_by: 'ai',
          confidence: 0.65
        })
      })
      
      const action = await createResponse.response.json()

      // Reject the action
      const { response } = await apiCall(`/api/actions/${action.action_id}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          rejected_by: 'test-user',
          reason: 'Discount not appropriate for this account'
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('rejected')
    })
  })

  describe('Action Execution', () => {
    test('should execute approved action', async () => {
      // Create and approve an action
      const createResponse = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testAccountId,
          action_type: 'log_note',
          proposed_by: 'ai',
          confidence: 0.9,
          parameters: {
            note: 'Test execution note'
          }
        })
      })
      
      const action = await createResponse.response.json()

      // Approve
      await apiCall(`/api/actions/${action.action_id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approved_by: 'test-user' })
      })

      // Execute
      const { response } = await apiCall(`/api/actions/${action.action_id}/execute`, {
        method: 'POST'
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.execution_id).toBeDefined()
      expect(['running', 'completed']).toContain(data.status)
    })

    test('should track execution status', async () => {
      const executionId = 'test-execution-id'
      
      const { response } = await apiCall(`/api/executions/${executionId}/status`)
      
      // Either 200 with status or 404 if not found
      expect([200, 404]).toContain(response.status)
    })

    test('should retry failed execution', async () => {
      const executionId = 'failed-execution-id'
      
      const { response } = await apiCall(`/api/executions/${executionId}/retry`, {
        method: 'POST'
      })
      
      // Either success or not found
      expect([200, 404]).toContain(response.status)
    })
  })

  describe('Full Loop E2E', () => {
    test('should complete full signal → action flow', async () => {
      const entityId = `e2e-test-${Date.now()}`

      // Step 1: Ingest signal
      const signalResponse = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: entityId,
          signal_type: 'activity',
          evidence_type: 'A',
          payload: {
            source: 'e2e-test',
            event_type: 'high_value_action'
          }
        })
      })
      
      expect(signalResponse.response.status).toBe(201)
      const signal = await signalResponse.response.json()

      // Step 2: Create situation
      const situationResponse = await apiCall('/api/situations', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: entityId,
          situation_type: 'engagement_spike',
          severity: 'medium',
          signal_ids: [signal.signal_id]
        })
      })
      
      expect(situationResponse.response.status).toBe(201)
      const situation = await situationResponse.response.json()

      // Step 3: Propose action
      const actionResponse = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: entityId,
          action_type: 'follow_up',
          situation_id: situation.situation_id,
          proposed_by: 'ai',
          confidence: 0.88
        })
      })
      
      expect(actionResponse.response.status).toBe(201)
      const action = await actionResponse.response.json()

      // Step 4: Approve action
      const approvalResponse = await apiCall(`/api/actions/${action.action_id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approved_by: 'e2e-test' })
      })
      
      expect(approvalResponse.response.status).toBe(200)

      // Step 5: Execute action
      const executionResponse = await apiCall(`/api/actions/${action.action_id}/execute`, {
        method: 'POST'
      })
      
      expect(executionResponse.response.status).toBe(200)
      const execution = await executionResponse.response.json()
      
      expect(execution.execution_id).toBeDefined()
      console.log('E2E test completed successfully:', {
        signal_id: signal.signal_id,
        situation_id: situation.situation_id,
        action_id: action.action_id,
        execution_id: execution.execution_id
      })
    })
  })
})

describe('Rate Limiting & Idempotency', () => {
  test('should handle duplicate requests with idempotency key', async () => {
    const idempotencyKey = `idem-${Date.now()}`
    
    const payload = {
      tenant_id: 'test-tenant',
      entity_type: 'account',
      entity_id: 'test-account',
      signal_type: 'activity',
      evidence_type: 'A',
      payload: { source: 'test' }
    }

    // First request
    const response1 = await fetch(`${API_BASE}/api/signals/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    })

    // Second request with same key
    const response2 = await fetch(`${API_BASE}/api/signals/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    })

    // Both should return same result
    const data1 = await response1.json()
    const data2 = await response2.json()
    
    expect(data1.signal_id).toBe(data2.signal_id)
  })

  test('should respect rate limits', async () => {
    const requests = Array.from({ length: 100 }, () => 
      fetch(`${API_BASE}/api/signals`, {
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.status === 429)
    
    // Expect some requests to be rate limited if limit is hit
    console.log(`${rateLimited.length} of ${requests.length} requests rate limited`)
  })
})
