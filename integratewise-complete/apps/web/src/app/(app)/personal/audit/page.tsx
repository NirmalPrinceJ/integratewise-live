"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, Database, Settings, Shield } from "lucide-react"

const mockAuditLogs = [
  { id: 1, action: "Updated customer record", user: "Alice Johnson", target: "Acme Corp", time: "2 min ago", type: "data" },
  { id: 2, action: "Approved discount request", user: "Bob Smith", target: "Deal #1234", time: "15 min ago", type: "approval" },
  { id: 3, action: "Connected integration", user: "System", target: "Slack", time: "1 hour ago", type: "system" },
  { id: 4, action: "Exported report", user: "Carol Davis", target: "Q1 Analysis", time: "2 hours ago", type: "data" },
  { id: 5, action: "Modified policy", user: "Admin", target: "Data Retention", time: "3 hours ago", type: "governance" },
  { id: 6, action: "AI insight generated", user: "ChurnShield", target: "TechStart account", time: "4 hours ago", type: "ai" },
  { id: 7, action: "Login from new device", user: "Alice Johnson", target: "Chrome/Mac", time: "5 hours ago", type: "security" }
]

export default function AuditPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "data": return <Database className="h-4 w-4" />
      case "approval": return <FileText className="h-4 w-4" />
      case "system": return <Settings className="h-4 w-4" />
      case "governance": return <Shield className="h-4 w-4" />
      case "security": return <Shield className="h-4 w-4" />
      case "ai": return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      data: "bg-blue-100 text-blue-800",
      approval: "bg-green-100 text-green-800",
      system: "bg-gray-100 text-gray-800",
      governance: "bg-purple-100 text-purple-800",
      security: "bg-red-100 text-red-800",
      ai: "bg-orange-100 text-orange-800"
    }
    return <Badge className={variants[type] || ""}>{type}</Badge>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">Track all system activities and changes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockAuditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                  <div className="mt-1">{getTypeIcon(log.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.action}</span>
                      {getTypeBadge(log.type)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                      <span>on {log.target}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
