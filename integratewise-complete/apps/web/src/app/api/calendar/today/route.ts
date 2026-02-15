import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/calendar/today
 * L1 Workspace API - Returns today's meetings from connected calendars
 * NO AI/cognitive features - pure calendar data
 */
export async function GET(request: NextRequest) {
  try {
    // In production, this fetches from Google Calendar, Outlook, etc.
    // For now, return realistic mock data
    
    const now = new Date()
    const dayOfWeek = now.getDay()
    
    // Weekends have no meetings
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({
        meetings: [],
        date: now.toISOString()
      })
    }
    
    // Realistic weekday meetings
    const meetings = [
      {
        id: 'mtg_001',
        title: 'Team Standup',
        time: '9:00 AM - 9:15 AM',
        attendees: 8,
        location: 'Zoom'
      },
      {
        id: 'mtg_002',
        title: 'Product Review',
        time: '11:00 AM - 12:00 PM',
        attendees: 5,
        location: 'Conference Room A'
      },
      {
        id: 'mtg_003',
        title: 'Client Call - Acme Corp',
        time: '2:00 PM - 2:30 PM',
        attendees: 3,
        location: 'Google Meet'
      },
      {
        id: 'mtg_004',
        title: 'Sprint Planning',
        time: '4:00 PM - 5:00 PM',
        attendees: 6,
        location: 'Zoom'
      }
    ]
    
    // Vary based on day (fewer meetings on Friday)
    const count = dayOfWeek === 5 ? 2 : meetings.length
    
    return NextResponse.json({
      meetings: meetings.slice(0, count),
      date: now.toISOString()
    })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar' },
      { status: 500 }
    )
  }
}
