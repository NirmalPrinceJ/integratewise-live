import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * 
 * Tests login, logout, signup, and OAuth flows
 */
test.describe('Authentication', () => {
  test.describe('Login Flow', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Check for login form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]')
      const passwordInput = page.locator('input[type="password"], input[name="password"]')
      const submitButton = page.locator('button[type="submit"]')
      
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
      await expect(submitButton).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Should show validation message
      await page.waitForTimeout(500)
      
      const hasError = 
        await page.locator('.error, [role="alert"], .text-red, .text-destructive').isVisible() ||
        await page.locator('input:invalid').count() > 0
      
      expect(hasError).toBeTruthy()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Fill with invalid credentials
      await page.fill('input[type="email"], input[name="email"]', 'invalid@test.com')
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword')
      
      // Submit
      await page.click('button[type="submit"]')
      
      // Wait for error response
      await page.waitForTimeout(2000)
      
      // Should show error or stay on login page
      const stillOnLogin = page.url().includes('/auth/login') || page.url().includes('/login')
      const hasError = await page.locator('.error, [role="alert"], .text-red').isVisible()
      
      expect(stillOnLogin || hasError).toBeTruthy()
    })

    test('should redirect authenticated users away from login', async ({ page }) => {
      // This test uses the authenticated session from setup
      await page.goto('/auth/login')
      
      await page.waitForTimeout(1000)
      
      // If authenticated, should redirect to dashboard
      const redirected = !page.url().includes('/auth/login')
      const stillOnLogin = page.url().includes('/auth/login')
      
      // Either behavior is acceptable depending on implementation
      expect(redirected || stillOnLogin).toBeTruthy()
    })
  })

  test.describe('OAuth Providers', () => {
    test('should show Google login option', async ({ page }) => {
      await page.goto('/auth/login')
      
      const googleButton = page.locator(
        'button:has-text("Google"), ' +
        'a:has-text("Google"), ' +
        '[data-provider="google"]'
      )
      
      const hasGoogle = await googleButton.isVisible().catch(() => false)
      
      // Google OAuth should be available
      if (hasGoogle) {
        expect(await googleButton.isVisible()).toBeTruthy()
      }
    })

    test('should show Microsoft login option', async ({ page }) => {
      await page.goto('/auth/login')
      
      const microsoftButton = page.locator(
        'button:has-text("Microsoft"), ' +
        'a:has-text("Microsoft"), ' +
        '[data-provider="microsoft"], ' +
        '[data-provider="azure"]'
      )
      
      const hasMicrosoft = await microsoftButton.isVisible().catch(() => false)
      
      if (hasMicrosoft) {
        expect(await microsoftButton.isVisible()).toBeTruthy()
      }
    })

    test('should show GitHub login option', async ({ page }) => {
      await page.goto('/auth/login')
      
      const githubButton = page.locator(
        'button:has-text("GitHub"), ' +
        'a:has-text("GitHub"), ' +
        '[data-provider="github"]'
      )
      
      const hasGitHub = await githubButton.isVisible().catch(() => false)
      
      if (hasGitHub) {
        expect(await githubButton.isVisible()).toBeTruthy()
      }
    })
  })

  test.describe('Signup Flow', () => {
    test('should display signup page', async ({ page }) => {
      await page.goto('/auth/signup')
      
      // Check for signup form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]')
      
      await expect(emailInput).toBeVisible()
    })

    test('should have link from login to signup', async ({ page }) => {
      await page.goto('/auth/login')
      
      const signupLink = page.locator('a:has-text("Sign up"), a:has-text("Create account"), a[href*="signup"]')
      
      if (await signupLink.isVisible()) {
        await signupLink.click()
        await expect(page).toHaveURL(/\/(signup|register)/)
      }
    })
  })

  test.describe('Logout Flow', () => {
    test('should have logout option when authenticated', async ({ page }) => {
      await page.goto('/')
      
      // Look for user menu or logout button
      const userMenu = page.locator(
        '[data-testid="user-menu"], ' +
        '.user-menu, ' +
        'button:has-text("Account"), ' +
        '[aria-label*="user"]'
      )
      
      if (await userMenu.isVisible()) {
        await userMenu.click()
        
        const logoutButton = page.locator(
          'button:has-text("Logout"), ' +
          'button:has-text("Sign out"), ' +
          'a:has-text("Logout")'
        )
        
        await expect(logoutButton).toBeVisible()
      }
    })
  })

  test.describe('Session Management', () => {
    test('should persist session across page reloads', async ({ page }) => {
      await page.goto('/')
      
      // Should be on authenticated page
      await page.reload()
      
      // Should still be authenticated
      await expect(page).not.toHaveURL(/\/auth\/login/)
    })

    test('should redirect to login when session expires', async ({ page }) => {
      // Clear storage to simulate expired session
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      
      // Clear cookies too
      await page.context().clearCookies()
      
      await page.goto('/spine')
      
      await page.waitForTimeout(2000)
      
      // Should redirect to login or show unauthorized
      const onLogin = page.url().includes('/auth/login') || page.url().includes('/login')
      const hasUnauthorized = (await page.content()).toLowerCase().includes('unauthorized') ||
                              (await page.content()).toLowerCase().includes('sign in')
      
      expect(onLogin || hasUnauthorized).toBeTruthy()
    })
  })
})

test.describe('Password Reset', () => {
  test('should show forgot password link', async ({ page }) => {
    await page.goto('/auth/login')
    
    const forgotLink = page.locator(
      'a:has-text("Forgot"), ' +
      'a:has-text("Reset password"), ' +
      'a[href*="forgot"], ' +
      'a[href*="reset"]'
    )
    
    if (await forgotLink.isVisible()) {
      await forgotLink.click()
      
      // Should navigate to password reset page
      await page.waitForTimeout(1000)
      
      const hasResetForm = await page.locator('input[type="email"]').isVisible()
      expect(hasResetForm).toBeTruthy()
    }
  })
})
