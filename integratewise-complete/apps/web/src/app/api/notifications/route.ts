import { NextResponse } from "next/server"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

// Mock notifications
const notifications: Notification[] = [
  {
    id: "1",
    title: "Document Processed",
    message: "Your Q4 Financial Report has been processed successfully",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "System Update",
    message: "IntegrateWise has been updated to version 2.1.0",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
]

export async function GET() {
  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  })
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    const notification = notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark notification" }, { status: 500 })
  }
}
