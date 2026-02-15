/**
 * Test Setup
 * Global test configuration and mocks
 */

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock fetch for integration tests
const originalFetch = global.fetch

beforeAll(() => {
  // Only mock if not running actual integration tests
  if (process.env.MOCK_API === 'true') {
    global.fetch = vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
      const urlObj = new URL(url, 'http://localhost:3001')
      const path = urlObj.pathname

      // Default mock responses
      const mockResponses: Record<string, any> = {
        '/api/signals/ingest': {
          status: 201,
          body: { signal_id: `sig-${Date.now()}`, correlation_id: 'test' }
        },
        '/api/signals': {
          status: 200,
          body: { signals: [] }
        },
        '/api/situations': {
          status: 200,
          body: { situations: [] }
        },
        '/api/actions': {
          status: 200,
          body: { actions: [] }
        },
        '/api/evidence': {
          status: 200,
          body: { evidence: [] }
        },
        '/api/governance/policies': {
          status: 200,
          body: { policies: [] }
        },
        '/api/audit': {
          status: 200,
          body: { events: [] }
        },
        '/api/entities': {
          status: 200,
          body: { entities: [] }
        }
      }

      // Match route
      for (const [route, mock] of Object.entries(mockResponses)) {
        if (path.startsWith(route)) {
          return {
            status: mock.status,
            ok: mock.status >= 200 && mock.status < 300,
            json: async () => mock.body,
            text: async () => JSON.stringify(mock.body)
          }
        }
      }

      // Default 404
      return {
        status: 404,
        ok: false,
        json: async () => ({ error: 'Not found' }),
        text: async () => 'Not found'
      }
    })
  }
})

afterAll(() => {
  if (process.env.MOCK_API === 'true') {
    global.fetch = originalFetch
  }
})

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver
})

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver
})

// Suppress console errors in tests (optional)
// vi.spyOn(console, 'error').mockImplementation(() => {})
