// e2e/support-pages.spec.ts
// E2E tests for support pages, 404, error handling, and footer

import { test, expect } from '@playwright/test'

test.describe('Support Pages', () => {
    test('should display help center with categories', async ({ page }) => {
        await page.goto('/support')

        // Check header with logo
        await expect(page.locator('img[alt="IntegrateWise"]')).toBeVisible()

        // Check hero section
        await expect(page.getByRole('heading', { name: /how can we help/i })).toBeVisible()

        // Check search input
        await expect(page.getByPlaceholder(/search for help articles/i)).toBeVisible()

        // Check help categories are displayed
        await expect(page.getByText('Getting Started')).toBeVisible()
        await expect(page.getByText('Integrations')).toBeVisible()
        await expect(page.getByText('IQ Hub & AI')).toBeVisible()
        await expect(page.getByText('Security & Privacy')).toBeVisible()

        // Check FAQ section
        await expect(page.getByText('Frequently Asked Questions')).toBeVisible()

        // Check contact options
        await expect(page.getByText('Live Chat')).toBeVisible()
        await expect(page.getByText('Email Support')).toBeVisible()

        // Check footer with copyright
        await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()
    })

    test('should display contact support page with form', async ({ page }) => {
        await page.goto('/support/contact')

        // Check page title
        await expect(page.getByRole('heading', { name: /contact support/i })).toBeVisible()

        // Check contact options
        await expect(page.getByText('Live Chat')).toBeVisible()
        await expect(page.getByText('Email')).toBeVisible()
        await expect(page.getByText('Phone')).toBeVisible()

        // Check form fields
        await expect(page.getByLabel('Name')).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.getByLabel('Subject')).toBeVisible()
        await expect(page.getByLabel('Priority')).toBeVisible()
        await expect(page.getByLabel('Message')).toBeVisible()

        // Check submit button
        await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
    })

    test('should open and close chat widget', async ({ page }) => {
        await page.goto('/support/contact')

        // Click live chat button
        await page.getByText('Live Chat').first().click()

        // Check chat widget opened
        await expect(page.getByText('IntegrateWise Support')).toBeVisible()
        await expect(page.getByText(/online now/i)).toBeVisible()
        await expect(page.getByPlaceholder(/type your message/i)).toBeVisible()

        // Close chat widget
        await page.click('button:has-text("✕")')
    })

    test('should submit contact form successfully', async ({ page }) => {
        await page.goto('/support/contact')

        // Fill out form
        await page.getByLabel('Name').fill('Test User')
        await page.getByLabel('Email').fill('test@example.com')
        await page.getByLabel('Subject').fill('Test inquiry')
        await page.getByLabel('Message').fill('This is a test message for E2E testing.')

        // Submit form
        await page.getByRole('button', { name: /send message/i }).click()

        // Check success message
        await expect(page.getByText('Message Sent!')).toBeVisible()
        await expect(page.getByText(/our support team will get back to you/i)).toBeVisible()

        // Check ticket reference is shown
        await expect(page.getByText(/ticket reference/i)).toBeVisible()
    })
})

test.describe('404 Not Found Page', () => {
    test('should display 404 page for non-existent routes', async ({ page }) => {
        await page.goto('/this-page-does-not-exist-12345')

        // Check 404 content
        await expect(page.getByText('404')).toBeVisible()
        await expect(page.getByText('Page not found')).toBeVisible()

        // Check navigation options
        await expect(page.getByRole('link', { name: /go home/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /go back/i })).toBeVisible()

        // Check search input
        await expect(page.getByPlaceholder(/search for what you need/i)).toBeVisible()

        // Check support links
        await expect(page.getByRole('link', { name: /help center/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /contact support/i })).toBeVisible()

        // Check copyright
        await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()
    })

    test('should navigate to home from 404 page', async ({ page }) => {
        await page.goto('/non-existent-page')

        await page.getByRole('link', { name: /go home/i }).click()

        // Should navigate to home
        await expect(page).toHaveURL('/')
    })
})

test.describe('Legal Pages', () => {
    test('should display privacy policy page', async ({ page }) => {
        await page.goto('/legal/privacy')

        // Check page content
        await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible()
        await expect(page.getByText(/last updated/i)).toBeVisible()

        // Check key sections exist
        await expect(page.getByText('1. Introduction')).toBeVisible()
        await expect(page.getByText('2. Information We Collect')).toBeVisible()
        await expect(page.getByText('4. Data Security')).toBeVisible()
        await expect(page.getByText('5. Your Rights')).toBeVisible()

        // Check footer
        await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()
    })

    test('should display terms of service page', async ({ page }) => {
        await page.goto('/legal/terms')

        // Check page content
        await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible()
        await expect(page.getByText(/last updated/i)).toBeVisible()

        // Check key sections exist
        await expect(page.getByText('1. Acceptance of Terms')).toBeVisible()
        await expect(page.getByText('2. Description of Service')).toBeVisible()
        await expect(page.getByText('4. Subscription and Payment')).toBeVisible()
        await expect(page.getByText('7. Limitation of Liability')).toBeVisible()

        // Check footer
        await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()
    })

    test('should navigate between legal pages', async ({ page }) => {
        await page.goto('/legal/privacy')

        // Click link to terms
        await page.getByRole('link', { name: /terms of service/i }).click()
        await expect(page).toHaveURL('/legal/terms')

        // Click link back to privacy
        await page.getByRole('link', { name: /privacy policy/i }).click()
        await expect(page).toHaveURL('/legal/privacy')
    })
})

test.describe('Logo Integration', () => {
    test('should display IntegrateWise logo on support pages', async ({ page }) => {
        await page.goto('/support')

        // Check logo is visible
        const logo = page.locator('img[alt="IntegrateWise"]').first()
        await expect(logo).toBeVisible()

        // Check logo links to home
        await logo.click()
        await expect(page).toHaveURL('/')
    })

    test('should display logo on 404 page', async ({ page }) => {
        await page.goto('/non-existent')

        await expect(page.locator('img[alt*="IntegrateWise"]').first()).toBeVisible()
    })
})

test.describe('Footer', () => {
    test('should display footer on legal pages', async ({ page }) => {
        await page.goto('/legal/privacy')

        // Check copyright text
        await expect(page.getByText(/© \d{4} IntegrateWise/)).toBeVisible()

        // Check footer links
        await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /terms/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /support/i })).toBeVisible()
    })
})
