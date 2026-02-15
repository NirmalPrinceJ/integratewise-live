export const runtime = 'edge';

/**
 * Public API endpoint for Webflow to fetch pricing data
 * 
 * Usage in Webflow:
 * fetch('https://app.integratewise.ai/api/webflow/pricing')
 */

import { NextResponse } from 'next/server'

// CORS headers for Webflow
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'For individuals getting started',
      price: {
        monthly: 0,
        annual: 0,
      },
      limits: {
        integrations: 5,
        apiCalls: 1000,
        seats: 1,
        storage: '100MB',
      },
      features: [
        'Basic integrations',
        'Standard analytics',
        'Email support',
        'Community access',
      ],
      cta: {
        text: 'Get Started Free',
        url: '/auth/sign-up?plan=free',
      },
    },
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'For small teams',
      price: {
        monthly: 49,
        annual: 39,
      },
      limits: {
        integrations: 25,
        apiCalls: 50000,
        seats: 5,
        storage: '5GB',
      },
      features: [
        'All Free features',
        'Advanced integrations',
        'Custom workflows',
        'Team collaboration',
        'Priority email support',
      ],
      cta: {
        text: 'Start Free Trial',
        url: '/auth/sign-up?plan=starter',
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For growing businesses',
      price: {
        monthly: 149,
        annual: 119,
      },
      popular: true,
      limits: {
        integrations: -1, // unlimited
        apiCalls: 500000,
        seats: 20,
        storage: '50GB',
      },
      features: [
        'All Starter features',
        'Unlimited integrations',
        'AI-powered insights',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom branding',
      ],
      cta: {
        text: 'Start Free Trial',
        url: '/auth/sign-up?plan=pro',
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'For large organizations',
      price: {
        monthly: null,
        annual: null,
        custom: true,
      },
      limits: {
        integrations: -1,
        apiCalls: -1,
        seats: -1,
        storage: 'Unlimited',
      },
      features: [
        'All Pro features',
        'Unlimited everything',
        'Custom AI models',
        'SSO/SAML',
        'Dedicated support',
        'SLA guarantee',
        'On-premise option',
        'Custom contracts',
      ],
      cta: {
        text: 'Contact Sales',
        url: '/contact?type=enterprise',
      },
    },
  ]

  const addons = [
    {
      id: 'extra-seats',
      name: 'Additional Seats',
      price: 10,
      unit: 'per seat/month',
    },
    {
      id: 'extra-api',
      name: 'Additional API Calls',
      price: 5,
      unit: 'per 10k calls/month',
    },
    {
      id: 'premium-support',
      name: 'Premium Support',
      price: 99,
      unit: 'per month',
    },
  ]

  return NextResponse.json(
    {
      plans,
      addons,
      currency: 'USD',
      trialDays: 14,
      lastUpdated: new Date().toISOString(),
    },
    { headers: corsHeaders }
  )
}
