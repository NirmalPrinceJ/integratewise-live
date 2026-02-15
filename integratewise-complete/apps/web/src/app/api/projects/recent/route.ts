import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/projects/recent
 * L1 Workspace API - Returns user's recent projects
 * NO AI/cognitive features - pure project data
 */
export async function GET(request: NextRequest) {
  try {
    // In production, this queries the projects database
    const projects = [
      {
        id: 'proj_001',
        name: 'Website Redesign',
        status: 'active',
        progress: 65,
        tasks_total: 24,
        tasks_completed: 16,
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'proj_002',
        name: 'Q1 Planning',
        status: 'active',
        progress: 40,
        tasks_total: 15,
        tasks_completed: 6,
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'proj_003',
        name: 'Mobile App Launch',
        status: 'planning',
        progress: 10,
        tasks_total: 30,
        tasks_completed: 3,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    return NextResponse.json({
      projects,
      total: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
