export const runtime = 'edge';

/**
 * Public API endpoint for Webflow to fetch live stats
 * 
 * Usage in Webflow:
 * fetch('https://app.integratewise.ai/api/webflow/stats')
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
  // In production, these would come from your database
  // For now, using realistic mock data
  const stats = {
    customers: {
      total: 2847,
      growth: '+23%',
      period: 'vs last quarter',
    },
    integrations: {
      total: 150,
      categories: ['CRM', 'Marketing', 'Finance', 'Support', 'Analytics'],
    },
    dataProcessed: {
      total: '4.2B',
      unit: 'events/month',
      uptime: '99.97%',
    },
    timeSaved: {
      total: '1.2M',
      unit: 'hours saved',
      period: 'this year',
    },
    satisfaction: {
      nps: 72,
      csat: 4.8,
      reviews: 847,
    },
    featuredLogos: [
      { name: 'TechScale', logo: '/logos/techscale.svg' },
      { name: 'Finova', logo: '/logos/finova.svg' },
      { name: 'CloudFirst', logo: '/logos/cloudfirst.svg' },
      { name: 'ScaleUp', logo: '/logos/scaleup.svg' },
      { name: 'DataFlow', logo: '/logos/dataflow.svg' },
    ],
  }

  return NextResponse.json(
    {
      ...stats,
      lastUpdated: new Date().toISOString(),
    },
    { headers: corsHeaders }
  )
}
