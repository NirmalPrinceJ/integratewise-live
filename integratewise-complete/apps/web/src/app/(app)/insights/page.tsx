import { PageHeader } from "@/components/spine/page-header"
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"

export default function InsightsPage() {
  return (
    <div className="p-6">
      <PageHeader title="AI Insights" description="Pattern detection and business alerts" stageId="INSIGHTS-013" />

      {/* Today's Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#2D7A3E]" />
          <h3 className="font-semibold text-gray-900">Today's AI Insights</h3>
          <span className="text-xs text-gray-400 ml-auto">Generated 2 hours ago</span>
        </div>
        <p className="text-gray-600 mb-4">
          Today, IntegrateWise OS experienced moderate activity with focus on client engagement and pipeline management.
          Key patterns detected across your data sources.
        </p>
        <div className="space-y-3">
          {[
            {
              type: "opportunity",
              icon: TrendingUp,
              color: "text-green-600 bg-green-50",
              text: "MuleSoft projects driving 60% of revenue - consider expanding this service line",
            },
            {
              type: "warning",
              icon: AlertCircle,
              color: "text-amber-600 bg-amber-50",
              text: "RetailMax client health score dropped 15% - immediate attention recommended",
            },
            {
              type: "trend",
              icon: TrendingUp,
              color: "text-blue-600 bg-blue-50",
              text: "SaaS subscriptions growing 15% MoM - strong recurring revenue trend",
            },
            {
              type: "suggestion",
              icon: Lightbulb,
              color: "text-purple-600 bg-purple-50",
              text: "Based on pipeline analysis, focus on converting HealthPlus opportunity (₹1.2Cr)",
            },
          ].map((insight, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-lg ${insight.color.split(" ")[1]}`}>
              <insight.icon className={`w-5 h-5 ${insight.color.split(" ")[0]} mt-0.5`} />
              <p className="text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Priority Actions</h3>
        <div className="space-y-2">
          {[
            "Schedule Team Engagement Meeting: Facilitate a brainstorming session to re-energize collaboration",
            "Review and Optimize AI Utilization: Evaluate current usage to identify barriers",
            "Set Clear Daily Targets: Implement daily goal-setting practice",
            "Encourage Interdepartmental Collaboration: Initiate cross-functional partnerships",
          ].map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#2D7A3E] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#2D7A3E] font-medium">{i + 1}</span>
              </div>
              <p className="text-gray-600">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Brainstorm Sessions", value: "0", trend: null },
          { label: "Tasks Created", value: "0", trend: null },
          { label: "Content Generated", value: "0", trend: null },
          { label: "Pipeline Updates", value: "0", trend: null },
        ].map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
