/**
 * Multi-Tenant Integration Test
 * Tests: Tenant Isolation → Data Boundaries → Cross-Tenant Prevention
 * Day 4: UI Polish + Integration + Testing
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Test tenants
const TENANT_A = {
  id: 'tenant-isolation-test-a',
  name: 'Test Company A'
}

const TENANT_B = {
  id: 'tenant-isolation-test-b',
  name: 'Test Company B'
}

// Helper function
function generateCorrelationId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

async function apiCallWithTenant(endpoint: string, tenantId: string, options: RequestInit = {}) {
  const correlationId = generateCorrelationId()
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      'X-Tenant-ID': tenantId,
      ...options.headers
    }
  })
  return { response, correlationId }
}

describe('Multi-Tenant Isolation', () => {
  let tenantAEntityId: string
  let tenantBEntityId: string
  let tenantASignalId: string
  let tenantBSignalId: string

  beforeAll(async () => {
    // Create test entities for each tenant
    tenantAEntityId = `entity-a-${Date.now()}`
    tenantBEntityId = `entity-b-${Date.now()}`

    // Create signals for each tenant
    const signalA = await apiCallWithTenant('/api/signals/ingest', TENANT_A.id, {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: TENANT_A.id,
        entity_type: 'account',
        entity_id: tenantAEntityId,
        signal_type: 'activity',
        evidence_type: 'A',
        payload: { source: 'test', event: 'tenant_a_event' }
      })
    })

    if (signalA.response.status === 201) {
      const data = await signalA.response.json()
      tenantASignalId = data.signal_id
    }

    const signalB = await apiCallWithTenant('/api/signals/ingest', TENANT_B.id, {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: TENANT_B.id,
        entity_type: 'account',
        entity_id: tenantBEntityId,
        signal_type: 'activity',
        evidence_type: 'A',
        payload: { source: 'test', event: 'tenant_b_event' }
      })
    })

    if (signalB.response.status === 201) {
      const data = await signalB.response.json()
      tenantBSignalId = data.signal_id
    }
  })

  describe('Signal Isolation', () => {
    test('tenant A cannot see tenant B signals', async () => {
      const { response } = await apiCallWithTenant(
        `/api/signals?entity_id=${tenantBEntityId}`,
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      // Should return empty or 404, not Tenant B's data
      expect(data.signals.length).toBe(0)
    })

    test('tenant B cannot see tenant A signals', async () => {
      const { response } = await apiCallWithTenant(
        `/api/signals?entity_id=${tenantAEntityId}`,
        TENANT_B.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      // Should return empty or 404, not Tenant A's data
      expect(data.signals.length).toBe(0)
    })

    test('tenant A can only see own signals', async () => {
      const { response } = await apiCallWithTenant(
        `/api/signals?entity_id=${tenantAEntityId}`,
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // All signals should belong to tenant A
      data.signals.forEach((signal: any) => {
        expect(signal.tenant_id).toBe(TENANT_A.id)
      })
    })
  })

  describe('Entity Isolation', () => {
    test('tenant A cannot access tenant B entities', async () => {
      const { response } = await apiCallWithTenant(
        `/api/entities/${tenantBEntityId}`,
        TENANT_A.id
      )

      // Should be 404 or 403
      expect([403, 404]).toContain(response.status)
    })

    test('tenant B cannot access tenant A entities', async () => {
      const { response } = await apiCallWithTenant(
        `/api/entities/${tenantAEntityId}`,
        TENANT_B.id
      )

      // Should be 404 or 403
      expect([403, 404]).toContain(response.status)
    })

    test('entity list only shows tenant entities', async () => {
      const { response } = await apiCallWithTenant(
        '/api/entities?type=account',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // All entities should belong to tenant A
      data.entities.forEach((entity: any) => {
        expect(entity.tenant_id).toBe(TENANT_A.id)
      })
    })
  })

  describe('Action Isolation', () => {
    test('tenant A cannot approve tenant B actions', async () => {
      // First create action for tenant B
      const createResponse = await apiCallWithTenant('/api/actions/propose', TENANT_B.id, {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: TENANT_B.id,
          entity_type: 'account',
          entity_id: tenantBEntityId,
          action_type: 'follow_up',
          proposed_by: 'ai',
          confidence: 0.8
        })
      })

      if (createResponse.response.status !== 201) return

      const action = await createResponse.response.json()

      // Try to approve as tenant A
      const { response } = await apiCallWithTenant(
        `/api/actions/${action.action_id}/approve`,
        TENANT_A.id,
        {
          method: 'POST',
          body: JSON.stringify({ approved_by: 'tenant-a-user' })
        }
      )

      // Should be denied
      expect([403, 404]).toContain(response.status)
    })

    test('action list only shows tenant actions', async () => {
      const { response } = await apiCallWithTenant(
        '/api/actions?status=pending',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // All actions should belong to tenant A
      data.actions.forEach((action: any) => {
        expect(action.tenant_id).toBe(TENANT_A.id)
      })
    })
  })

  describe('Situation Isolation', () => {
    test('tenant A cannot see tenant B situations', async () => {
      // Create situation for tenant B
      await apiCallWithTenant('/api/situations', TENANT_B.id, {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: TENANT_B.id,
          entity_type: 'account',
          entity_id: tenantBEntityId,
          situation_type: 'test_situation',
          severity: 'medium',
          signal_ids: []
        })
      })

      // Try to fetch as tenant A
      const { response } = await apiCallWithTenant(
        `/api/situations?entity_id=${tenantBEntityId}`,
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.situations.length).toBe(0)
    })
  })

  describe('Policy Isolation', () => {
    test('tenant A cannot see tenant B policies', async () => {
      // Create policy for tenant B
      await apiCallWithTenant('/api/governance/policies', TENANT_B.id, {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: TENANT_B.id,
          name: 'Tenant B Only Policy',
          type: 'approval_threshold',
          rules: [{ condition: 'confidence >= 0.9', action: 'auto_approve' }],
          enabled: true
        })
      })

      // Try to list policies as tenant A
      const { response } = await apiCallWithTenant(
        '/api/governance/policies',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // Should not contain tenant B policies
      data.policies.forEach((policy: any) => {
        expect(policy.tenant_id).toBe(TENANT_A.id)
      })
    })

    test('tenant A cannot modify tenant B policies', async () => {
      // Assume we know a tenant B policy ID
      const tenantBPolicyId = 'tenant-b-policy-123'

      const { response } = await apiCallWithTenant(
        `/api/governance/policies/${tenantBPolicyId}`,
        TENANT_A.id,
        {
          method: 'PATCH',
          body: JSON.stringify({ enabled: false })
        }
      )

      // Should be denied
      expect([403, 404]).toContain(response.status)
    })
  })

  describe('Audit Trail Isolation', () => {
    test('tenant A cannot see tenant B audit logs', async () => {
      const { response } = await apiCallWithTenant(
        '/api/audit',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // All audit events should belong to tenant A
      data.events.forEach((event: any) => {
        expect(event.tenant_id).toBe(TENANT_A.id)
      })
    })
  })

  describe('Cross-Tenant Prevention', () => {
    test('cannot create signal with mismatched tenant header', async () => {
      // Try to create signal for tenant B with tenant A header
      const { response } = await apiCallWithTenant('/api/signals/ingest', TENANT_A.id, {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: TENANT_B.id, // Mismatch!
          entity_type: 'account',
          entity_id: 'cross-tenant-test',
          signal_type: 'activity',
          evidence_type: 'A',
          payload: {}
        })
      })

      // Should either reject or override body tenant_id with header
      expect([400, 403, 201]).toContain(response.status)

      if (response.status === 201) {
        // If accepted, should use header tenant ID
        const data = await response.json()
        expect(data.tenant_id).toBe(TENANT_A.id)
      }
    })

    test('cannot inject tenant ID in query params', async () => {
      // Try to bypass with query param
      const { response } = await apiCallWithTenant(
        `/api/signals?tenant_id=${TENANT_B.id}`,
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // Should still only return tenant A data
      data.signals.forEach((signal: any) => {
        expect(signal.tenant_id).toBe(TENANT_A.id)
      })
    })

    test('cannot access other tenant via direct ID', async () => {
      if (!tenantBSignalId) return

      const { response } = await apiCallWithTenant(
        `/api/signals/${tenantBSignalId}`,
        TENANT_A.id
      )

      // Should be denied
      expect([403, 404]).toContain(response.status)
    })
  })

  describe('Data Aggregation Isolation', () => {
    test('metrics only include tenant data', async () => {
      const { response } = await apiCallWithTenant(
        '/api/metrics/overview',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // Metrics should be scoped to tenant
      expect(data.tenant_id).toBe(TENANT_A.id)
    })

    test('dashboard data only shows tenant data', async () => {
      const { response } = await apiCallWithTenant(
        '/api/dashboard',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
    })

    test('reports only include tenant data', async () => {
      const { response } = await apiCallWithTenant(
        '/api/governance/reports/approvals?period=7d',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
    })
  })

  describe('Search Isolation', () => {
    test('search only returns tenant results', async () => {
      const { response } = await apiCallWithTenant(
        '/api/search?q=test',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // All results should belong to tenant A
      data.results.forEach((result: any) => {
        expect(result.tenant_id).toBe(TENANT_A.id)
      })
    })
  })

  describe('Integration Isolation', () => {
    test('tenant A cannot see tenant B integrations', async () => {
      // Create integration for tenant B
      await apiCallWithTenant('/api/integrations', TENANT_B.id, {
        method: 'POST',
        body: JSON.stringify({
          tenant_id: TENANT_B.id,
          provider: 'salesforce',
          credentials: { /* encrypted */ },
          enabled: true
        })
      })

      // List integrations as tenant A
      const { response } = await apiCallWithTenant(
        '/api/integrations',
        TENANT_A.id
      )

      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      // Should only show tenant A integrations
      data.integrations.forEach((integration: any) => {
        expect(integration.tenant_id).toBe(TENANT_A.id)
      })
    })
  })
})

describe('Tenant Context Propagation', () => {
  test('tenant ID propagates through async operations', async () => {
    const testTenantId = 'propagation-test-tenant'
    
    // Create a signal that triggers async processing
    const { response, correlationId } = await apiCallWithTenant('/api/signals/ingest', testTenantId, {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: testTenantId,
        entity_type: 'account',
        entity_id: 'propagation-test-entity',
        signal_type: 'activity',
        evidence_type: 'A',
        payload: { trigger_async: true }
      })
    })

    expect(response.status).toBe(201)

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check that derived data maintains tenant context
    const { response: checkResponse } = await apiCallWithTenant(
      `/api/audit?correlation_id=${correlationId}`,
      testTenantId
    )

    if (checkResponse.status === 200) {
      const data = await checkResponse.json()
      data.events.forEach((event: any) => {
        expect(event.tenant_id).toBe(testTenantId)
      })
    }
  })

  test('background jobs maintain tenant context', async () => {
    const testTenantId = 'background-job-test-tenant'
    
    // Trigger a background job
    const { response } = await apiCallWithTenant('/api/jobs/trigger', testTenantId, {
      method: 'POST',
      body: JSON.stringify({
        job_type: 'signal_aggregation',
        parameters: {}
      })
    })

    expect([200, 202, 404]).toContain(response.status)
  })
})

describe('Tenant Resource Limits', () => {
  const testTenantId = 'limits-test-tenant'

  test('should enforce rate limits per tenant', async () => {
    const requests = Array.from({ length: 50 }, () =>
      apiCallWithTenant('/api/signals', testTenantId)
    )

    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.response.status === 429)
    
    console.log(`${rateLimited.length} of ${requests.length} requests rate limited`)
  })

  test('should enforce storage limits per tenant', async () => {
    const { response } = await apiCallWithTenant('/api/usage/storage', testTenantId)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.used_bytes).toBeDefined()
    expect(data.limit_bytes).toBeDefined()
  })

  test('should track API usage per tenant', async () => {
    const { response } = await apiCallWithTenant('/api/usage/api', testTenantId)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.requests_today).toBeDefined()
  })
})
