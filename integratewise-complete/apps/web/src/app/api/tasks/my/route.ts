import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/tasks/my
 * L1 Workspace API - Returns user's tasks
 * NO AI/cognitive features - pure task management data
 */
export async function GET(request: NextRequest) {
  try {
    // In production, this queries the tasks database
    // For now, return realistic mock data
    
    const tasks = [
      {
        id: 'task_001',
        title: 'Review Q1 proposal draft',
        due: 'Today',
        priority: 'high',
        project: 'Q1 Planning',
        status: 'in_progress'
      },
      {
        id: 'task_002',
        title: 'Update project timeline',
        due: 'Today',
        priority: 'medium',
        project: 'Website Redesign',
        status: 'pending'
      },
      {
        id: 'task_003',
        title: 'Send meeting notes to team',
        due: 'Tomorrow',
        priority: 'low',
        project: null,
        status: 'pending'
      },
      {
        id: 'task_004',
        title: 'Prepare demo for client call',
        due: 'Tomorrow',
        priority: 'high',
        project: 'Acme Corp',
        status: 'pending'
      },
      {
        id: 'task_005',
        title: 'Review pull requests',
        due: 'This week',
        priority: 'medium',
        project: 'Engineering',
        status: 'pending'
      }
    ]
    
    return NextResponse.json({
      tasks,
      total: tasks.length,
      overdue: 0,
      due_today: 2
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks/my
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newTask = {
      id: `task_${Date.now()}`,
      title: body.title,
      due: body.due || null,
      priority: body.priority || 'medium',
      project: body.project || null,
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
