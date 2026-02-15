import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Zap, Brain, Bell, Settings, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function ShadowPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Shadow"
        description="Your proactive AI assistant that works in the background"
        stageId="IQCLONE-010"
        actions={
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        }
      />

      {/* Shadow Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suggestions Today</p>
              <p className="font-semibold text-gray-900">7</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Actions Taken</p>
              <p className="font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Suggestions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Suggestions</h3>
        <div className="space-y-3">
          {[
            {
              type: "follow_up",
              title: "Follow up with HealthPlus",
              reason: "Proposal sent 3 days ago, no response",
              priority: "high",
            },
            {
              type: "task",
              title: "Create task from IQ Hub conversation",
              reason: "You mentioned 'integration architecture review' yesterday",
              priority: "medium",
            },
            {
              type: "reminder",
              title: "TechCorp renewal coming up",
              reason: "Contract expires in 2 weeks",
              priority: "high",
            },
          ].map((suggestion, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              {suggestion.priority === "high" ? (
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{suggestion.title}</p>
                <p className="text-sm text-gray-500">{suggestion.reason}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Dismiss
                </Button>
                <Button size="sm" className="bg-[#2D7A3E] hover:bg-[#236B31]">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Shadow Actions</h3>
        <div className="space-y-3">
          {[
            { action: "Extracted 3 tasks from IQ Hub session", time: "2 hours ago" },
            { action: "Added meeting notes to TechCorp client profile", time: "Yesterday" },
            { action: "Created follow-up reminder for proposal", time: "2 days ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border-l-2 border-[#2D7A3E]">
              <CheckCircle className="w-4 h-4 text-[#2D7A3E]" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{item.action}</p>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
