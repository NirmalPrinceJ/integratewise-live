"use client"

import { useState } from "react"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, Mail, Smartphone, MessageSquare, Monitor,
  Zap, AlertTriangle, CheckCircle2, TrendingUp,
  Calendar, Users, FileText, Bot, Volume2, VolumeX,
  Clock, Save
} from "lucide-react"

type NotificationChannel = "email" | "push" | "slack" | "inApp"

interface NotificationSetting {
  id: string
  label: string
  description: string
  icon: any
  channels: NotificationChannel[]
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<Record<string, Record<NotificationChannel, boolean>>>({
    signals: { email: true, push: true, slack: true, inApp: true },
    anomalies: { email: true, push: true, slack: true, inApp: true },
    aiInsights: { email: false, push: true, slack: false, inApp: true },
    taskAssignments: { email: true, push: true, slack: true, inApp: true },
    approvals: { email: true, push: true, slack: true, inApp: true },
    weeklyDigest: { email: true, push: false, slack: false, inApp: false },
    teamUpdates: { email: false, push: false, slack: true, inApp: true },
    systemAlerts: { email: true, push: true, slack: true, inApp: true },
  })

  const notificationCategories: { title: string; items: NotificationSetting[] }[] = [
    {
      title: "Signal Alerts",
      items: [
        { 
          id: "signals", 
          label: "Signal Notifications", 
          description: "Real-time alerts from Flow A (Truth & Signals)",
          icon: Zap,
          channels: ["email", "push", "slack", "inApp"]
        },
        { 
          id: "anomalies", 
          label: "Anomaly Detection", 
          description: "Threshold breaches, pattern alerts, lifecycle transitions",
          icon: AlertTriangle,
          channels: ["email", "push", "slack", "inApp"]
        },
      ]
    },
    {
      title: "AI & Intelligence",
      items: [
        { 
          id: "aiInsights", 
          label: "AI Insights & Proposals", 
          description: "Think Layer generated insights and action proposals",
          icon: Bot,
          channels: ["email", "push", "slack", "inApp"]
        },
      ]
    },
    {
      title: "Workflow & Tasks",
      items: [
        { 
          id: "taskAssignments", 
          label: "Task Assignments", 
          description: "When tasks are assigned to you",
          icon: CheckCircle2,
          channels: ["email", "push", "slack", "inApp"]
        },
        { 
          id: "approvals", 
          label: "Approval Requests", 
          description: "Act Layer execution approvals needed",
          icon: FileText,
          channels: ["email", "push", "slack", "inApp"]
        },
      ]
    },
    {
      title: "Digests & Reports",
      items: [
        { 
          id: "weeklyDigest", 
          label: "Weekly Digest", 
          description: "Summary of activity and insights",
          icon: Calendar,
          channels: ["email", "push", "slack", "inApp"]
        },
        { 
          id: "teamUpdates", 
          label: "Team Updates", 
          description: "Changes from team members",
          icon: Users,
          channels: ["email", "push", "slack", "inApp"]
        },
      ]
    },
    {
      title: "System",
      items: [
        { 
          id: "systemAlerts", 
          label: "System Alerts", 
          description: "Integration failures, sync errors, security events",
          icon: Monitor,
          channels: ["email", "push", "slack", "inApp"]
        },
      ]
    },
  ]

  const toggleChannel = (settingId: string, channel: NotificationChannel) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: {
        ...prev[settingId],
        [channel]: !prev[settingId][channel]
      }
    }))
  }

  const ChannelIcon = ({ channel }: { channel: NotificationChannel }) => {
    switch (channel) {
      case "email": return <Mail className="w-4 h-4" />
      case "push": return <Smartphone className="w-4 h-4" />
      case "slack": return <MessageSquare className="w-4 h-4" />
      case "inApp": return <Bell className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout
      title="Notifications"
      description="Configure how and when you receive notifications"
      stageId="SETTINGS-NOTIFICATIONS-001"
      actions={
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      }
    >
      {/* Quick Controls */}
      <Section>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Notification Channels</h3>
            <p className="text-sm text-gray-500">Configure your connected notification channels</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <VolumeX className="w-4 h-4 mr-2" />
              Mute All
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Do Not Disturb
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { channel: "email" as NotificationChannel, name: "Email", icon: Mail, status: "connected", detail: "alex.chen@company.com" },
            { channel: "push" as NotificationChannel, name: "Push", icon: Smartphone, status: "connected", detail: "3 devices" },
            { channel: "slack" as NotificationChannel, name: "Slack", icon: MessageSquare, status: "connected", detail: "#alerts channel" },
            { channel: "inApp" as NotificationChannel, name: "In-App", icon: Bell, status: "connected", detail: "Browser notifications" },
          ].map((ch) => (
            <div key={ch.channel} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ch.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{ch.name}</span>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">On</Badge>
              </div>
              <p className="text-xs text-gray-500">{ch.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Notification Settings by Category */}
      {notificationCategories.map((category) => (
        <Section key={category.title} title={category.title}>
          <div className="space-y-4">
            {category.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <item.icon className="w-5 h-5 text-[#2D7A3E]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.channels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => toggleChannel(item.id, channel)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        settings[item.id]?.[channel]
                          ? 'bg-[#2D7A3E] text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                      title={channel}
                    >
                      <ChannelIcon channel={channel} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      {/* Quiet Hours */}
      <Section title="Quiet Hours">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Do Not Disturb Schedule</p>
              <p className="text-xs text-gray-500">Pause notifications during specific hours</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select className="bg-white border border-gray-200 rounded px-2 py-1 text-sm">
                <option>10:00 PM</option>
                <option>11:00 PM</option>
                <option>12:00 AM</option>
              </select>
              <span className="text-gray-400">to</span>
              <select className="bg-white border border-gray-200 rounded px-2 py-1 text-sm">
                <option>7:00 AM</option>
                <option>8:00 AM</option>
                <option>9:00 AM</option>
              </select>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mt-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Weekend Mode</p>
              <p className="text-xs text-gray-500">Reduce notifications on weekends</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
          </label>
        </div>
      </Section>

      {/* Critical Alerts Override */}
      <Section>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-900">Critical Alerts Override</span>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Critical system alerts and security notifications will always be delivered, 
            regardless of your quiet hours or mute settings.
          </p>
          <div className="flex items-center gap-2 text-xs text-yellow-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Security events, integration failures, and anomaly alerts are always enabled</span>
          </div>
        </div>
      </Section>
    </DashboardLayout>
  )
}
