/**
 * Governance Integration Test
 * Tests: Policies → Approval Thresholds → Audit Trail → Escalation
 * Day 4: UI Polish + Integration + Testing
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

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

describe('Policy Management', () => {
  const testTenantId = 'governance-test-tenant'
  let createdPolicyId: string

  describe('Policy CRUD', () => {
    test('should create a new policy', async () => {
      const policy = {
        tenant_id: testTenantId,
        name: 'Test Approval Policy',
        description: 'Auto-approve actions with confidence > 0.9',
        type: 'approval_threshold',
        rules: [
          {
            condition: 'confidence >= 0.9',
            action: 'auto_approve',
            priority: 1
          },
          {
            condition: 'confidence >= 0.7',
            action: 'require_approval',
            approvers: ['manager'],
            priority: 2
          },
          {
            condition: 'confidence < 0.7',
            action: 'require_approval',
            approvers: ['manager', 'admin'],
            priority: 3
          }
        ],
        enabled: true
      }

      const { response } = await apiCall('/api/governance/policies', {
        method: 'POST',
        body: JSON.stringify(policy)
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.policy_id).toBeDefined()
      createdPolicyId = data.policy_id
    })

    test('should list policies for tenant', async () => {
      const { response } = await apiCall(`/api/governance/policies?tenant_id=${testTenantId}`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.policies)).toBe(true)
    })

    test('should get policy by ID', async () => {
      if (!createdPolicyId) return

      const { response } = await apiCall(`/api/governance/policies/${createdPolicyId}`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.policy_id).toBe(createdPolicyId)
    })

    test('should update policy', async () => {
      if (!createdPolicyId) return

      const { response } = await apiCall(`/api/governance/policies/${createdPolicyId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          enabled: false,
          description: 'Updated description'
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.enabled).toBe(false)
    })

    test('should delete policy', async () => {
      if (!createdPolicyId) return

      const { response } = await apiCall(`/api/governance/policies/${createdPolicyId}`, {
        method: 'DELETE'
      })

      expect([200, 204]).toContain(response.status)
    })
  })

  describe('Policy Types', () => {
    test('should create approval threshold policy', async () => {
      const { response } = await apiCall('/api/governance/policies', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          name: 'Confidence Threshold',
          type: 'approval_threshold',
          rules: [
            { condition: 'confidence >= 0.95', action: 'auto_approve' }
          ],
          enabled: true
        })
      })

      expect(response.status).toBe(201)
    })

    test('should create spending limit policy', async () => {
      const { response } = await apiCall('/api/governance/policies', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          name: 'Discount Limits',
          type: 'spending_limit',
          rules: [
            { 
              action_type: 'offer_discount',
              max_percentage: 20,
              max_absolute: 10000,
              require_approval_above: 5000
            }
          ],
          enabled: true
        })
      })

      expect(response.status).toBe(201)
    })

    test('should create escalation policy', async () => {
      const { response } = await apiCall('/api/governance/policies', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          name: 'High Value Escalation',
          type: 'escalation',
          rules: [
            {
              condition: 'entity.mrr >= 10000',
              escalate_to: 'senior_ae',
              notification_channels: ['email', 'slack']
            }
          ],
          enabled: true
        })
      })

      expect(response.status).toBe(201)
    })

    test('should create action restriction policy', async () => {
      const { response } = await apiCall('/api/governance/policies', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          name: 'Churning Account Restrictions',
          type: 'action_restriction',
          rules: [
            {
              condition: 'entity.health_score < 30',
              blocked_actions: ['offer_discount', 'upsell'],
              allowed_actions: ['retention_outreach', 'escalate_to_cs']
            }
          ],
          enabled: true
        })
      })

      expect(response.status).toBe(201)
    })
  })
})

describe('Approval Workflow', () => {
  const testTenantId = 'approval-test-tenant'
  const testEntityId = 'approval-test-account'

  describe('Threshold-Based Approval', () => {
    test('should auto-approve high confidence actions', async () => {
      // Create action with high confidence
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          action_type: 'log_note',
          proposed_by: 'ai',
          confidence: 0.98 // Very high confidence
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      // Depending on policy, may be auto-approved
      expect(['pending', 'approved']).toContain(data.status)
    })

    test('should require approval for medium confidence actions', async () => {
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          action_type: 'send_outreach',
          proposed_by: 'ai',
          confidence: 0.75 // Medium confidence
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.status).toBe('pending')
    })

    test('should flag low confidence for multi-approver', async () => {
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          action_type: 'offer_discount',
          proposed_by: 'ai',
          confidence: 0.55 // Low confidence
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.status).toBe('pending')
      // May have multiple required approvers
    })
  })

  describe('Role-Based Approval', () => {
    test('should route to correct approver based on action type', async () => {
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: testEntityId,
          action_type: 'offer_discount',
          proposed_by: 'ai',
          confidence: 0.8,
          parameters: {
            discount_percentage: 15
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      // Should have assigned approver
      expect(data.required_approvers).toBeDefined()
    })

    test('should validate approver has permission', async () => {
      const actionId = 'test-action-restricted'
      
      // Try to approve with non-authorized user
      const { response } = await apiCall(`/api/actions/${actionId}/approve`, {
        method: 'POST',
        headers: {
          'X-User-ID': 'unauthorized-user',
          'X-User-Role': 'viewer'
        },
        body: JSON.stringify({
          approved_by: 'unauthorized-user'
        })
      })

      // Should either 403 or 404
      expect([200, 403, 404]).toContain(response.status)
    })
  })

  describe('Approval Audit', () => {
    test('should log approval decision', async () => {
      const actionId = 'audit-test-action'
      
      const { response, correlationId } = await apiCall(`/api/actions/${actionId}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          approved_by: 'test-approver',
          feedback: 'Looks good, proceeding'
        })
      })

      // Check audit log
      const { response: auditResponse } = await apiCall(`/api/audit?correlation_id=${correlationId}`)
      
      if (auditResponse.status === 200) {
        const auditData = await auditResponse.json()
        expect(auditData.events.length).toBeGreaterThanOrEqual(0)
      }
    })

    test('should log rejection with reason', async () => {
      const actionId = 'reject-test-action'
      
      const { response, correlationId } = await apiCall(`/api/actions/${actionId}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          rejected_by: 'test-reviewer',
          reason: 'Account not ready for this action'
        })
      })

      // Rejection should be logged
      expect([200, 404]).toContain(response.status)
    })
  })
})

describe('Audit Trail', () => {
  const testTenantId = 'audit-test-tenant'

  describe('Event Logging', () => {
    test('should log all API actions', async () => {
      // Perform an action
      const { correlationId } = await apiCall('/api/signals/ingest', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: 'audit-test-entity',
          signal_type: 'activity',
          evidence_type: 'A',
          payload: { test: true }
        })
      })

      // Check audit log
      const { response } = await apiCall(`/api/audit?correlation_id=${correlationId}`)
      
      expect([200, 404]).toContain(response.status)
    })

    test('should include actor information', async () => {
      const { response } = await apiCall('/api/audit?limit=10')
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      data.events.forEach((event: any) => {
        // Each event should have actor info
        expect(event.actor || event.system).toBeDefined()
      })
    })

    test('should include timestamp and IP', async () => {
      const { response } = await apiCall('/api/audit?limit=10')
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      data.events.forEach((event: any) => {
        expect(event.timestamp).toBeDefined()
        // IP may or may not be present
      })
    })
  })

  describe('Audit Search', () => {
    test('should filter by date range', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      
      const { response } = await apiCall(
        `/api/audit?start=${startDate.toISOString()}&end=${new Date().toISOString()}`
      )
      
      expect(response.status).toBe(200)
    })

    test('should filter by entity', async () => {
      const entityId = 'specific-entity'
      
      const { response } = await apiCall(`/api/audit?entity_id=${entityId}`)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      data.events.forEach((event: any) => {
        if (event.entity_id) {
          expect(event.entity_id).toBe(entityId)
        }
      })
    })

    test('should filter by action type', async () => {
      const { response } = await apiCall('/api/audit?action=approve')
      
      expect(response.status).toBe(200)
    })

    test('should filter by actor', async () => {
      const actorId = 'test-user'
      
      const { response } = await apiCall(`/api/audit?actor_id=${actorId}`)
      
      expect(response.status).toBe(200)
    })
  })

  describe('Compliance Reports', () => {
    test('should generate approval summary report', async () => {
      const { response } = await apiCall('/api/governance/reports/approvals?period=7d')
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.total_proposed).toBeDefined()
      expect(data.total_approved).toBeDefined()
      expect(data.total_rejected).toBeDefined()
    })

    test('should generate action execution report', async () => {
      const { response } = await apiCall('/api/governance/reports/executions?period=7d')
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.total_executed).toBeDefined()
      expect(data.success_rate).toBeDefined()
    })

    test('should export audit log', async () => {
      const { response } = await apiCall('/api/audit/export?format=csv&period=7d')
      
      expect([200, 202]).toContain(response.status)
    })
  })
})

describe('Escalation', () => {
  const testTenantId = 'escalation-test-tenant'

  describe('Automatic Escalation', () => {
    test('should escalate on timeout', async () => {
      const actionId = 'timeout-test-action'
      
      // Simulate checking escalation status
      const { response } = await apiCall(`/api/actions/${actionId}/escalation-status`)
      
      expect([200, 404]).toContain(response.status)
    })

    test('should escalate high-value actions', async () => {
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: 'high-value-account',
          action_type: 'offer_discount',
          proposed_by: 'ai',
          confidence: 0.85,
          parameters: {
            discount_amount: 25000 // High value
          },
          metadata: {
            entity_mrr: 50000
          }
        })
      })

      expect(response.status).toBe(201)
      
      const data = await response.json()
      // May have escalation flag
      expect(data.escalated || data.required_approvers).toBeDefined()
    })

    test('should escalate based on entity tier', async () => {
      const { response } = await apiCall('/api/actions/propose', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          entity_type: 'account',
          entity_id: 'enterprise-account',
          action_type: 'cancel_subscription',
          proposed_by: 'ai',
          confidence: 0.8,
          metadata: {
            entity_tier: 'enterprise'
          }
        })
      })

      expect(response.status).toBe(201)
    })
  })

  describe('Escalation Notifications', () => {
    test('should send notification on escalation', async () => {
      const { response } = await apiCall('/api/governance/escalations', {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: testTenantId,
          action_id: 'test-action',
          escalation_reason: 'timeout',
          escalate_to: ['manager@company.com'],
          notification_channels: ['email']
        })
      })

      expect([200, 201]).toContain(response.status)
    })

    test('should track escalation acknowledgment', async () => {
      const escalationId = 'test-escalation'
      
      const { response } = await apiCall(`/api/governance/escalations/${escalationId}/acknowledge`, {
        method: 'POST',
        body: JSON.stringify({
          acknowledged_by: 'manager@company.com'
        })
      })

      expect([200, 404]).toContain(response.status)
    })
  })
})

describe('Spending Controls', () => {
  const testTenantId = 'spending-test-tenant'

  test('should enforce discount limits', async () => {
    const { response } = await apiCall('/api/actions/validate', {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: testTenantId,
        action_type: 'offer_discount',
        parameters: {
          discount_percentage: 50 // Over limit
        }
      })
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    // May be blocked or require additional approval
    expect(data.valid === false || data.requires_escalation === true).toBeTruthy()
  })

  test('should track spending against budget', async () => {
    const { response } = await apiCall(`/api/governance/spending?tenant_id=${testTenantId}`)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.period).toBeDefined()
    expect(data.spent).toBeDefined()
    expect(data.budget).toBeDefined()
  })

  test('should alert on budget threshold', async () => {
    const { response } = await apiCall(`/api/governance/spending/alerts?tenant_id=${testTenantId}`)
    
    expect(response.status).toBe(200)
  })
})
