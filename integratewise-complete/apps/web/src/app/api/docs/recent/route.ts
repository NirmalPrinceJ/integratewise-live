import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/docs/recent
 * L1 Workspace API - Returns user's recent documents/notes
 * NO AI/cognitive features - pure document data
 */
export async function GET(request: NextRequest) {
  try {
    // In production, this queries connected document sources
    const docs = [
      {
        id: 'doc_001',
        name: 'Q1 Strategy Notes',
        type: 'note',
        updated: '2 hours ago',
        source: 'internal'
      },
      {
        id: 'doc_002',
        name: 'Product Roadmap 2026',
        type: 'spreadsheet',
        updated: 'Yesterday',
        source: 'google_sheets'
      },
      {
        id: 'doc_003',
        name: 'Meeting Notes - Client Call',
        type: 'doc',
        updated: 'Yesterday',
        source: 'google_docs'
      },
      {
        id: 'doc_004',
        name: 'Technical Spec Draft',
        type: 'doc',
        updated: '3 days ago',
        source: 'notion'
      }
    ]
    
    return NextResponse.json({
      docs,
      total: docs.length
    })
  } catch (error) {
    console.error('Error fetching docs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch docs' },
      { status: 500 }
    )
  }
}
