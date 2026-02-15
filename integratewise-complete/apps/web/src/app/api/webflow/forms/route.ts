export const runtime = 'edge';

/**
 * Webflow Forms Sync API
 * 
 * Fetches form submissions from Webflow and stores them
 * Can be triggered via cron or webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { getWebflowClient } from '@/lib/webflow'

// CORS headers for Webflow
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET - Fetch form submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('formId')

    if (!formId) {
      return NextResponse.json(
        { error: 'formId is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const webflow = getWebflowClient()
    const { submissions } = await webflow.getFormSubmissions(formId)

    return NextResponse.json(
      { 
        submissions,
        count: submissions.length,
        fetchedAt: new Date().toISOString(),
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Webflow forms sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch forms' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST - Webhook handler for new form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature if configured
    const signature = request.headers.get('X-Webflow-Signature')
    if (process.env.WEBFLOW_WEBHOOK_SECRET && signature) {
      // TODO: Verify HMAC signature
      // const isValid = verifyWebflowSignature(body, signature)
    }

    const { 
      _id,
      name,
      email,
      company,
      message,
      plan,
      source,
      formName,
      siteId 
    } = body

    console.log('Webflow form submission received:', {
      formName,
      email,
      source,
      plan,
    })

    // TODO: Store in database
    // await db.insert(leads).values({
    //   email,
    //   name,
    //   company,
    //   source: source || 'webflow',
    //   plan: plan || 'unknown',
    //   message,
    //   webflowFormId: _id,
    //   webflowSiteId: siteId,
    //   createdAt: new Date(),
    // })

    // TODO: Send to CRM (HubSpot, Salesforce, etc.)
    // await syncToCRM({ email, name, company, source })

    // TODO: Send notification
    // await sendSlackNotification(`New lead: ${email} from ${source}`)

    return NextResponse.json(
      { 
        success: true,
        message: 'Form submission processed',
        leadId: _id,
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Webflow webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}
