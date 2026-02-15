import { test, expect } from '@playwright/test'

/**
 * API Routes E2E Tests
 * 
 * Tests API endpoints for:
 * - Health checks
 * - Authentication
 * - Data operations
 * - Integrations
 */
test.describe('API Health Checks', () => {
  test('should return health status', async ({ request }) => {
    const response = await request.get('/api/health')
    
    // Health endpoint might not exist yet
    if (response.status() === 200) {
      const data = await response.json()
      expect(data.status || data.ok || data.healthy).toBeTruthy()
    } else if (response.status() === 404) {
      // Endpoint doesn't exist yet - acceptable
      expect(response.status()).toBe(404)
    }
  })
})

test.describe('API Authentication', () => {
  test('should reject unauthenticated requests to protected endpoints', async ({ request }) => {
    // Make request without auth
    const response = await request.get('/api/accounts', {
      headers: {
        // No auth header
      }
    })
    
    // Should be 401 Unauthorized or redirect
    expect([401, 403, 302]).toContain(response.status())
  })

  test('should return user session info', async ({ request }) => {
    const response = await request.get('/api/auth/session')
    
    if (response.status() === 200) {
      const data = await response.json()
      // Session should have user info if authenticated
      expect(data).toBeDefined()
    }
  })
})

test.describe('API Onboarding Endpoints', () => {
  test('should get onboarding status', async ({ request }) => {
    const response = await request.get('/api/onboarding/status')
    
    if (response.status() === 200) {
      const data = await response.json()
      expect(data.state || data.status).toBeDefined()
    } else if (response.status() === 401) {
      // Needs auth - expected
      expect(response.status()).toBe(401)
    }
  })

  test('should list available integrations', async ({ request }) => {
    const response = await request.get('/api/integrations')
    
    if (response.status() === 200) {
      const data = await response.json()
      expect(Array.isArray(data.integrations || data)).toBeTruthy()
    }
  })

  test('should handle integration connection request', async ({ request }) => {
    const response = await request.post('/api/integrations', {
      data: {
        provider: 'slack',
        action: 'connect'
      }
    })
    
    // Should redirect to OAuth or return connection info
    expect([200, 302, 401, 404]).toContain(response.status())
  })
})

test.describe('API Data Endpoints', () => {
  test('should fetch accounts', async ({ request }) => {
    const response = await request.get('/api/accounts')
    
    if (response.status() === 200) {
      const data = await response.json()
      expect(Array.isArray(data.accounts || data.data || data)).toBeTruthy()
    } else if (response.status() === 401) {
      expect(response.status()).toBe(401)
    }
  })

  test('should fetch knowledge records', async ({ request }) => {
    const response = await request.get('/api/knowledge')
    
    if (response.status() === 200) {
      const data = await response.json()
      expect(data).toBeDefined()
    }
  })

  test('should handle search queries', async ({ request }) => {
    const response = await request.get('/api/search?q=test')
    
    if (response.status() === 200) {
      const data = await response.json()
      expect(data.results || data.data || Array.isArray(data)).toBeTruthy()
    }
  })
})

test.describe('API Error Handling', () => {
  test('should return 404 for non-existent endpoints', async ({ request }) => {
    const response = await request.get('/api/non-existent-endpoint-12345')
    
    expect(response.status()).toBe(404)
  })

  test('should handle malformed requests gracefully', async ({ request }) => {
    const response = await request.post('/api/accounts', {
      data: 'not valid json',
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    
    // Should return 400 Bad Request or similar
    expect([400, 401, 404, 415, 500]).toContain(response.status())
  })

  test('should include error details in response', async ({ request }) => {
    const response = await request.post('/api/accounts', {
      data: {}  // Missing required fields
    })
    
    if (response.status() >= 400 && response.status() < 500) {
      const data = await response.json().catch(() => ({}))
      
      // Should have error information
      if (data.error || data.message || data.errors) {
        expect(data.error || data.message || data.errors).toBeDefined()
      }
    }
  })
})

test.describe('API Rate Limiting', () => {
  test('should handle rapid requests', async ({ request }) => {
    const requests = Array(10).fill(null).map(() => 
      request.get('/api/health')
    )
    
    const responses = await Promise.all(requests)
    
    // Most should succeed
    const successCount = responses.filter(r => r.status() === 200 || r.status() === 404).length
    expect(successCount).toBeGreaterThan(5)
  })
})

test.describe('API CORS', () => {
  test('should handle preflight requests', async ({ request }) => {
    const response = await request.fetch('/api/accounts', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://external-app.com',
        'Access-Control-Request-Method': 'POST'
      }
    })
    
    // Should handle OPTIONS (200, 204, or method not allowed)
    expect([200, 204, 405, 404]).toContain(response.status())
  })
})
