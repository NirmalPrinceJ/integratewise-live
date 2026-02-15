import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/today/stats
 * Returns aggregated stats for today: meetings, tasks due, follow-ups
 */
export async function GET(request: NextRequest) {
  try {
    // In production, this would aggregate from calendar and task services
    // For now, return mock data that represents typical daily stats
    
    const now = new Date()
    const dayOfWeek = now.getDay()
    
    // Vary data slightly based on day of week for realistic feel
    const baseMeetings = dayOfWeek === 0 || dayOfWeek === 6 ? 0 : 3
    const baseTasks = dayOfWeek === 1 ? 8 : 5 // More tasks on Monday
    const baseFollowUps = 2
    
    return NextResponse.json({
      meetings: baseMeetings + Math.floor(Math.random() * 2),
      tasks_due: baseTasks + Math.floor(Math.random() * 3),
      follow_ups: baseFollowUps + Math.floor(Math.random() * 2),
      date: now.toISOString()
    })
  } catch (error) {
    console.error('Error fetching today stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today stats' },
      { status: 500 }
    )
  }
}
