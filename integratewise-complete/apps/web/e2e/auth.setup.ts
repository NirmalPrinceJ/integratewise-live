import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

/**
 * Authentication Setup
 * 
 * This runs before all tests to establish an authenticated session.
 * Uses test credentials from environment variables.
 */
setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL || 'test@integratewise.ai'
  const password = process.env.TEST_USER_PASSWORD || 'testpassword123'

  // Navigate to login page
  await page.goto('/auth/login')

  // Check if we're on the login page
  const isLoginPage = await page.locator('form').isVisible().catch(() => false)

  if (isLoginPage) {
    // Fill in credentials
    await page.fill('input[type="email"], input[name="email"]', email)
    await page.fill('input[type="password"], input[name="password"]', password)

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for successful navigation (to dashboard or home)
    await page.waitForURL(/\/(dashboard|home|today)?$/, { timeout: 30000 })

    // Verify we're logged in
    await expect(page.locator('body')).not.toContainText('Sign in')
  }

  // Save authentication state
  await page.context().storageState({ path: authFile })
})

setup('verify session', async ({ page }) => {
  // Verify the saved session works
  await page.goto('/')
  
  // Should not redirect to login
  await expect(page).not.toHaveURL(/\/auth\/login/)
})
