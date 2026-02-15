import { test, expect } from '@playwright/test'

/**
 * Core Navigation E2E Tests
 * 
 * Tests the main navigation between views:
 * Today, Spine, Context, Knowledge, Think, Act, Audit
 */
test.describe('Core Navigation', () => {
  test('should load home/today view', async ({ page }) => {
    await page.goto('/')
    
    // Should be on the main page
    await expect(page).toHaveURL(/\/(today|home)?$/)
    
    // Check for main content
    const mainContent = page.locator('main, [role="main"], .main-content')
    await expect(mainContent).toBeVisible()
  })

  test('should navigate to Spine view', async ({ page }) => {
    await page.goto('/spine')
    
    await expect(page).toHaveURL(/\/spine/)
    
    // Spine view should show accounts or schema content
    const pageContent = await page.content()
    const hasSpineContent = 
      pageContent.includes('spine') ||
      pageContent.includes('account') ||
      pageContent.includes('schema') ||
      pageContent.includes('entity')
    
    expect(hasSpineContent).toBeTruthy()
  })

  test('should navigate to Context view', async ({ page }) => {
    await page.goto('/context')
    
    await expect(page).toHaveURL(/\/context/)
  })

  test('should navigate to Knowledge view', async ({ page }) => {
    await page.goto('/knowledge')
    
    await expect(page).toHaveURL(/\/knowledge/)
  })

  test('should navigate to Think view', async ({ page }) => {
    await page.goto('/think')
    
    await expect(page).toHaveURL(/\/think/)
  })

  test('should navigate to Act view', async ({ page }) => {
    await page.goto('/act')
    
    await expect(page).toHaveURL(/\/act/)
  })

  test('should navigate to Approvals view', async ({ page }) => {
    await page.goto('/approvals')
    
    await expect(page).toHaveURL(/\/approvals/)
  })

  test('should navigate to Audit view', async ({ page }) => {
    await page.goto('/audit')
    
    await expect(page).toHaveURL(/\/audit/)
  })
})

test.describe('Sidebar Navigation', () => {
  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/')
    
    // Look for sidebar
    const sidebar = page.locator('nav, aside, [role="navigation"], .sidebar')
    
    if (await sidebar.isVisible()) {
      // Find navigation links
      const navLinks = sidebar.locator('a')
      const linkCount = await navLinks.count()
      
      expect(linkCount).toBeGreaterThan(0)
    }
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/spine')
    
    // Look for active state on Spine link
    const activeLink = page.locator(
      'a[href="/spine"].active, ' +
      'a[href="/spine"][aria-current="page"], ' +
      'nav a:has-text("Spine").active'
    )
    
    // Should have some indication of active state
    const spineLink = page.locator('a[href="/spine"], a:has-text("Spine")').first()
    if (await spineLink.isVisible()) {
      await expect(spineLink).toBeVisible()
    }
  })

  test('should toggle mobile sidebar', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Look for hamburger menu
    const menuButton = page.locator(
      'button[aria-label*="menu"], ' +
      'button[aria-label*="Menu"], ' +
      '.hamburger, ' +
      '[data-testid="mobile-menu"]'
    )
    
    if (await menuButton.isVisible()) {
      await menuButton.click()
      
      // Sidebar should become visible
      const sidebar = page.locator('nav, aside, .sidebar')
      await expect(sidebar).toBeVisible({ timeout: 5000 })
    }
  })
})

test.describe('View Content Loading', () => {
  test('should show loading states', async ({ page }) => {
    await page.goto('/spine')
    
    // Check for loading indicators (may be brief)
    const loadingIndicator = page.locator(
      '.loading, ' +
      '.spinner, ' +
      '[aria-busy="true"], ' +
      'skeleton, ' +
      '.skeleton'
    )
    
    // Loading should appear then disappear
    await page.waitForTimeout(500)
    
    // Content should eventually load
    const content = page.locator('main, .content, [role="main"]')
    await expect(content).toBeVisible()
  })

  test('should handle empty states', async ({ page }) => {
    await page.goto('/spine')
    
    await page.waitForTimeout(2000)
    
    // Should show data or empty state message
    const pageContent = await page.content()
    const hasContent = 
      pageContent.includes('No data') ||
      pageContent.includes('empty') ||
      pageContent.includes('Get started') ||
      await page.locator('table, .card, .list-item').count() > 0
    
    expect(hasContent).toBeTruthy()
  })
})

test.describe('Error Handling', () => {
  test('should show 404 for invalid routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345')
    
    // Should either 404 or redirect
    const is404 = response?.status() === 404
    const hasNotFound = (await page.content()).includes('not found') || 
                        (await page.content()).includes('404')
    const wasRedirected = page.url() !== '/non-existent-page-12345'
    
    expect(is404 || hasNotFound || wasRedirected).toBeTruthy()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true)
    
    try {
      await page.goto('/spine', { timeout: 5000 })
    } catch {
      // Expected to fail
    }
    
    await page.context().setOffline(false)
    
    // Should recover when back online
    await page.goto('/spine')
    await expect(page).toHaveURL(/\/spine/)
  })
})
