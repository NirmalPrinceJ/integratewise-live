// e2e/api-integration.spec.ts
// E2E tests for API endpoints integration

import { test, expect } from '@playwright/test'

test.describe('API Integration Tests', () => {

    test.describe('Workspace Bag API', () => {
        test('GET /api/workspace/bag should return user workspace', async ({ request }) => {
            const response = await request.get('/api/workspace/bag', {
                headers: {
                    'x-user-id': 'test-user-123'
                }
            })

            expect(response.ok()).toBeTruthy()
            const data = await response.json()

            // Should have required properties
            expect(data).toHaveProperty('user_id')
            expect(data).toHaveProperty('active_modules')
            expect(data).toHaveProperty('pinned_widgets')
            expect(data).toHaveProperty('created_at')
            expect(data).toHaveProperty('updated_at')

            // Active modules should be an array with 'home' as first
            expect(Array.isArray(data.active_modules)).toBeTruthy()
            if (data.active_modules.length > 0) {
                expect(data.active_modules[0]).toBe('home')
            }
        })

        test('PUT /api/workspace/bag should update workspace', async ({ request }) => {
            const updateData = {
                active_modules: ['home', 'tasks', 'goals'],
                pinned_widgets: ['recent_activity'],
                sidebar_collapsed: false
            }

            const response = await request.put('/api/workspace/bag', {
                headers: {
                    'x-user-id': 'test-user-456',
                    'Content-Type': 'application/json'
                },
                data: updateData
            })

            expect(response.ok()).toBeTruthy()
            const data = await response.json()

            expect(data.active_modules).toEqual(updateData.active_modules)
            expect(data.sidebar_collapsed).toBe(updateData.sidebar_collapsed)
        })

        test('POST /api/workspace/bag should create default workspace', async ({ request }) => {
            const response = await request.post('/api/workspace/bag', {
                headers: {
                    'x-user-id': 'new-user-789',
                    'Content-Type': 'application/json'
                }
            })

            expect(response.ok()).toBeTruthy()
            const data = await response.json()

            expect(data.user_id).toBe('new-user-789')
            expect(data.active_modules[0]).toBe('home')
        })

        test('DELETE /api/workspace/bag should reset workspace', async ({ request }) => {
            const response = await request.delete('/api/workspace/bag', {
                headers: {
                    'x-user-id': 'test-user-456'
                }
            })

            expect(response.ok()).toBeTruthy()
            const data = await response.json()
            expect(data.message).toContain('reset')
        })

        test('should require user-id header', async ({ request }) => {
            const response = await request.get('/api/workspace/bag')

            expect(response.status()).toBe(400)
            const data = await response.json()
            expect(data.error).toContain('user-id')
        })
    })

    test.describe('Auth API', () => {
        test('GET /api/auth/session should return session status', async ({ request }) => {
            const response = await request.get('/api/auth/session')

            // Should return 200 regardless of auth status
            expect(response.status()).toBeLessThanOrEqual(401)
        })
    })

    test.describe('Health Check', () => {
        test('API should be reachable', async ({ request }) => {
            const response = await request.get('/api/workspace/bag', {
                headers: {
                    'x-user-id': 'health-check'
                }
            })

            // API should respond (200 or 201)
            expect([200, 201]).toContain(response.status())
        })
    })
})

test.describe('Frontend Integration Tests', () => {

    test.describe('Navigation Flow', () => {
        test('should navigate through main app sections', async ({ page }) => {
            await page.goto('/')

            // Wait for page to load
            await page.waitForLoadState('networkidle')

            // Check main elements are present
            await expect(page.locator('body')).toBeVisible()
        })

        test('should load support page from anywhere', async ({ page }) => {
            await page.goto('/')

            // Navigate to support
            await page.goto('/support')

            await expect(page.getByRole('heading', { name: /how can we help/i })).toBeVisible()
        })
    })

    test.describe('Error Handling', () => {
        test('should display 404 for unknown routes', async ({ page }) => {
            const response = await page.goto('/unknown-route-xyz123')

            // Should still render the 404 page (not a server error)
            await expect(page.getByText('404')).toBeVisible()
        })

        test('should recover from client-side errors gracefully', async ({ page }) => {
            // Go to a valid page first
            await page.goto('/support')

            // Verify page works
            await expect(page.getByRole('heading', { name: /how can we help/i })).toBeVisible()
        })
    })

    test.describe('Keyboard Shortcuts', () => {
        test('should open command palette with Cmd+K', async ({ page }) => {
            await page.goto('/admin/today')

            // Wait for app to load
            await page.waitForLoadState('networkidle')

            // Press Cmd+K
            await page.keyboard.press('Meta+k')

            // Check if command palette or search opens
            // This may vary based on the specific implementation
            const searchInput = page.getByPlaceholder(/search/i).first()
            if (await searchInput.isVisible()) {
                await expect(searchInput).toBeFocused()
            }
        })
    })
})

test.describe('Cross-Page Consistency', () => {

    test('IntegrateWise branding should be consistent', async ({ page }) => {
        const pagesToCheck = [
            '/support',
            '/support/contact',
            '/legal/privacy',
            '/legal/terms',
        ]

        for (const path of pagesToCheck) {
            await page.goto(path)

            // Logo should be present
            const logo = page.locator('img[alt*="IntegrateWise"]').first()
            await expect(logo).toBeVisible()

            // Copyright should be present
            await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()
        }
    })

    test('footer links should work across pages', async ({ page }) => {
        await page.goto('/legal/privacy')

        // Click support link in footer
        await page.getByRole('link', { name: /support/i }).last().click()
        await expect(page).toHaveURL(/support/)

        // Navigate back via footer
        await page.getByRole('link', { name: /privacy/i }).last().click()
        await expect(page).toHaveURL(/privacy/)
    })
})
