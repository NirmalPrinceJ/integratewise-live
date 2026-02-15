import { test as base, expect } from '@playwright/test'

/**
 * Test Fixtures and Utilities for E2E Tests
 */

// Extend base test with custom fixtures
export const test = base.extend<{
  authenticatedPage: any
  testData: TestData
}>({
  // Pre-authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    // Login if needed
    await page.goto('/')
    
    // Check if already logged in
    const isLoggedIn = !page.url().includes('/auth/login')
    
    if (!isLoggedIn) {
      await page.goto('/auth/login')
      await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@test.com')
      await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password')
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(dashboard|home)?$/, { timeout: 10000 }).catch(() => {})
    }
    
    await use(page)
  },

  // Test data fixture
  testData: async ({}, use) => {
    const data: TestData = {
      testAccount: {
        name: 'Test Account',
        email: 'test@example.com',
        type: 'customer',
      },
      testUser: {
        email: 'test@integratewise.ai',
        name: 'Test User',
      },
    }
    
    await use(data)
  },
})

interface TestData {
  testAccount: {
    name: string
    email: string
    type: string
  }
  testUser: {
    email: string
    name: string
  }
}

/**
 * Helper: Wait for network idle
 */
export async function waitForNetworkIdle(page: any, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Helper: Wait for API response
 */
export async function waitForApiResponse(page: any, urlPattern: string | RegExp) {
  return page.waitForResponse((response: any) => {
    const url = response.url()
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern)
    }
    return urlPattern.test(url)
  })
}

/**
 * Helper: Get all console errors
 */
export async function collectConsoleErrors(page: any): Promise<string[]> {
  const errors: string[] = []
  
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  
  return errors
}

/**
 * Helper: Screenshot on failure
 */
export async function screenshotOnFailure(page: any, testName: string) {
  await page.screenshot({
    path: `test-results/failures/${testName}-${Date.now()}.png`,
    fullPage: true,
  })
}

/**
 * Helper: Check accessibility
 */
export async function checkAccessibility(page: any) {
  // Basic accessibility checks
  const issues: string[] = []
  
  // Check for images without alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count()
  if (imagesWithoutAlt > 0) {
    issues.push(`${imagesWithoutAlt} images without alt text`)
  }
  
  // Check for buttons without accessible names
  const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not(:has-text(*))').count()
  if (buttonsWithoutLabel > 0) {
    issues.push(`${buttonsWithoutLabel} buttons without accessible names`)
  }
  
  // Check for form inputs without labels
  const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([id])').count()
  if (inputsWithoutLabels > 0) {
    issues.push(`${inputsWithoutLabels} inputs without labels`)
  }
  
  return issues
}

/**
 * Helper: Mock API response
 */
export async function mockApiResponse(
  page: any, 
  url: string, 
  response: { status?: number; body?: any }
) {
  await page.route(url, (route: any) => {
    route.fulfill({
      status: response.status || 200,
      contentType: 'application/json',
      body: JSON.stringify(response.body || {}),
    })
  })
}

/**
 * Test matchers
 */
export { expect }

/**
 * Common test selectors
 */
export const selectors = {
  sidebar: 'nav, aside, [role="navigation"], .sidebar',
  mainContent: 'main, [role="main"], .main-content',
  header: 'header, [role="banner"]',
  footer: 'footer, [role="contentinfo"]',
  modal: '[role="dialog"], .modal, .dialog',
  dropdown: '[role="menu"], .dropdown, .popover',
  button: 'button, [role="button"]',
  link: 'a, [role="link"]',
  input: 'input, textarea, [role="textbox"]',
  table: 'table, [role="table"], [role="grid"]',
  tableRow: 'tr, [role="row"]',
  loadingSpinner: '.loading, .spinner, [aria-busy="true"]',
  errorMessage: '.error, [role="alert"], .text-destructive',
  successMessage: '.success, [role="status"]',
}
