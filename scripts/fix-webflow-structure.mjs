#!/usr/bin/env node

/**
 * Webflow Site Fixer Script
 * 
 * This script helps audit and fix the Webflow site structure.
 * Run with: node scripts/fix-webflow-structure.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) {
      process.env[key.trim()] = vals.join('=').trim()
    }
  })
} catch (e) {
  console.log('Note: .env.local not found, using process.env')
}

const WEBFLOW_TOKEN = process.env.WEBFLOW_API_TOKEN
const SITE_ID = '696dbefa23d782ae6fb81d40'
const BASE_URL = 'https://api.webflow.com/v2'

// App URLs for CTAs
const APP_URLS = {
  signUp: 'https://app.integratewise.ai/auth/sign-up',
  signIn: 'https://app.integratewise.ai/auth/login',
  dashboard: 'https://app.integratewise.ai/dashboard',
  contactSales: 'https://app.integratewise.ai/contact-sales',
  demo: 'https://calendly.com/integratewise/demo', // Or your booking link
}

// Recommended URL structure
const URL_FIXES = {
  'how-it-works-2': 'how-it-works',
  'how-it-works-3': null, // DELETE
  'how-it-works-4': null, // DELETE
  'use-cases-2': 'use-cases',
  'roles-2': 'roles',
  'case-studies-2': 'case-studies',
  'blog-2': 'blog',
}

// Expected site structure
const SITE_STRUCTURE = {
  // Core pages
  'home': { title: 'IntegrateWise - Unify Your Stack', published: true },
  'pricing': { title: 'Pricing - IntegrateWise', published: true },
  'integrations': { title: 'Integrations - 500+ Tools', published: true },
  'architecture': { title: 'Architecture - Enterprise Grade', published: true },
  'security-governance': { title: 'Security & Governance', published: true },
  'about-our-story': { title: 'About Us - Our Story', published: true },
  'contact-request-a-demo': { title: 'Contact & Request Demo', published: true },
  
  // How It Works
  'how-it-works': { title: 'How It Works - The Engine', published: true },
  'engine-stage-1-load': { title: 'Stage 1: Load - IntegrateWise', published: true },
  'engine-stage-2-normalize': { title: 'Stage 2: Normalize - IntegrateWise', published: true },
  'engine-stage-3-think': { title: 'Stage 3: Think - IntegrateWise', published: true },
  'engine-stage-4-act': { title: 'Stage 4: Act - IntegrateWise', published: true },
  'engine-stage-5-govern': { title: 'Stage 5: Govern - IntegrateWise', published: true },
  'engine-stage-6-repeat': { title: 'Stage 6: Repeat - IntegrateWise', published: true },
  
  // Use Cases
  'use-cases': { title: 'Use Cases - IntegrateWise', published: true },
  'sales': { title: 'Sales - Stop Losing Deals', published: true },
  'marketing': { title: 'Marketing - Attribution That Works', published: true },
  'customer-success': { title: 'Customer Success - 360° View', published: true },
  'finance-billing': { title: 'Finance & Billing', published: true },
  'development': { title: 'Development - API-First', published: true },
  'research': { title: 'Research - Data Pipelines', published: true },
  'strategy': { title: 'Strategy - Real-Time Dashboards', published: true },
  'management': { title: 'Management - Cross-Team Visibility', published: true },
  
  // Roles
  'roles': { title: 'Roles - Built for Everyone', published: true },
  'visionary': { title: 'For Visionaries (C-Suite)', published: true },
  'missionary': { title: 'For Missionaries (Champions)', published: true },
  'practitioner': { title: 'For Practitioners (Operators)', published: true },
  'passenger': { title: 'For Passengers (End Users)', published: true },
  
  // Education
  'institutions-universities': { title: 'Institutions & Universities', published: true },
  'educators': { title: 'For Educators', published: true },
  'students': { title: 'For Students', published: true },
  'freelancers': { title: 'For Freelancers', published: true },
  'employee-and-external-relations': { title: 'HR & External Relations', published: true },
  
  // Blog & Case Studies
  'blog': { title: 'Blog - IntegrateWise', published: true },
  'case-studies': { title: 'Case Studies', published: true },
}

async function fetchPages() {
  const response = await fetch(`${BASE_URL}/sites/${SITE_ID}/pages`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'accept': 'application/json'
    }
  })
  const data = await response.json()
  return data.pages || []
}

async function auditSite() {
  console.log('🔍 Auditing Webflow Site Structure...\n')
  
  const pages = await fetchPages()
  console.log(`Found ${pages.length} pages\n`)
  
  // Check for pages that need URL fixes
  console.log('📝 URL FIXES NEEDED:')
  console.log('─'.repeat(60))
  
  for (const page of pages) {
    const slug = page.slug || 'home'
    if (URL_FIXES[slug] !== undefined) {
      if (URL_FIXES[slug] === null) {
        console.log(`❌ DELETE: /${slug} (duplicate)`)
      } else {
        console.log(`🔄 RENAME: /${slug} → /${URL_FIXES[slug]}`)
      }
    }
  }
  
  console.log('\n')
  
  // Check for missing pages
  console.log('📋 EXPECTED PAGES STATUS:')
  console.log('─'.repeat(60))
  
  const existingSlugs = new Set(pages.map(p => p.slug || 'home'))
  
  for (const [slug, config] of Object.entries(SITE_STRUCTURE)) {
    const exists = existingSlugs.has(slug)
    const status = exists ? '✅' : '❌'
    console.log(`${status} /${slug}`)
  }
  
  console.log('\n')
  
  // Check for extra/unexpected pages
  console.log('🔍 EXTRA PAGES (not in structure):')
  console.log('─'.repeat(60))
  
  const expectedSlugs = new Set(Object.keys(SITE_STRUCTURE))
  const systemPages = ['401', '404', 'style-guide-606ac02d-cca5-4ac1-ad93-bb64f5c5930d', 
                       'checkout', 'paypal-checkout', 'order-confirmation',
                       'detail_category', 'detail_product', 'detail_sku',
                       'blog-post', 'customer-story']
  
  for (const page of pages) {
    const slug = page.slug || 'home'
    if (!expectedSlugs.has(slug) && !systemPages.includes(slug) && !URL_FIXES[slug]) {
      console.log(`⚠️  /${slug} - ${page.title}`)
    }
  }
  
  console.log('\n')
  
  // Generate CTA update instructions
  console.log('🔗 CTA LINKS TO UPDATE IN WEBFLOW:')
  console.log('─'.repeat(60))
  console.log(`
In Webflow Designer, update these links:

NAVBAR:
  • "Sign In" button → ${APP_URLS.signIn}
  • "Get Started" button → ${APP_URLS.signUp}

PRICING PAGE:
  • Growth "Get Started" → ${APP_URLS.signUp}?plan=growth
  • Scale "Get Started" → ${APP_URLS.signUp}?plan=scale
  • Enterprise "Talk to Us" → ${APP_URLS.contactSales}?plan=enterprise

ALL PAGES:
  • "Start Free Trial" → ${APP_URLS.signUp}
  • "Request Demo" → ${APP_URLS.demo}
  • "Enter Dashboard" → ${APP_URLS.dashboard}

USE CASE PAGES:
  • Sales CTA → ${APP_URLS.signUp}?use_case=sales
  • Marketing CTA → ${APP_URLS.signUp}?use_case=marketing
  • etc.

CONTACT INFO:
  • Email: connect@integratewise.co
  • Replace any hello@integratewise.com references
`)
}

async function main() {
  if (!WEBFLOW_TOKEN) {
    console.error('❌ WEBFLOW_API_TOKEN not found in environment')
    console.log('Add it to .env.local: WEBFLOW_API_TOKEN=your_token')
    process.exit(1)
  }
  
  await auditSite()
}

main().catch(console.error)
