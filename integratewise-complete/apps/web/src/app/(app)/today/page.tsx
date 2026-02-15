import { DashboardLayout, Section, StatCard } from "@/components/layouts/page-layouts"
import { MetricCard } from "@/components/spine/metric-card"
import { CheckSquare, Calendar, Zap, Clock } from "lucide-react"

export default function TodayPage() {
  return (
    <DashboardLayout title="Today" description="Your daily overview and priorities" stageId="TODAY-011">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Tasks Due" value="5" icon={CheckSquare} primary />
        <MetricCard title="Meetings" value="3" icon={Calendar} />
        <MetricCard title="AI Suggestions" value="7" icon={Zap} />
        <MetricCard title="Focus Time" value="4h" icon={Clock} />
      </div>

      {/* Today's Tasks */}
      <Section title="Priority Tasks">
        <div className="space-y-3">
          {[
            { title: "Review MuleSoft proposal", priority: "high", client: "HealthPlus" },
            { title: "Send weekly metrics report", priority: "medium", client: "Internal" },
            { title: "Schedule customer success call", priority: "high", client: "TechCorp" },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#2D7A3E]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500">{task.client}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Shadow Suggestions */}
      <Section title="Shadow Suggestions">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#2D7A3E]" />
          <h3 className="font-semibold text-gray-900">Shadow Suggestions</h3>
        </div>
        <div className="space-y-3">
          {[
            "Follow up with HealthPlus - proposal sent 3 days ago",
            "TechCorp renewal coming up in 2 weeks - schedule review",
            "You mentioned 'integration architecture' in IQ Hub - create task?",
          ].map((suggestion, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <Zap className="w-4 h-4 text-[#2D7A3E] mt-0.5" />
              <p className="text-sm text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </Section>
    </DashboardLayout>
  )
}
