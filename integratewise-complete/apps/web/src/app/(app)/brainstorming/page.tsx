import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, MessageSquare } from "lucide-react"

export default function BrainstormingPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Brainstorming"
        description="AI-powered ideation and problem solving"
        stageId="IQHUB-008"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        }
      />

      {/* Today's AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#2D7A3E]" />
          <h3 className="font-semibold text-gray-900">Today's AI Insights</h3>
          <span className="text-xs text-gray-400 ml-auto">2026-01-17</span>
        </div>
        <p className="text-gray-600 mb-4">
          Today, IntegrateWise OS experienced no activity in brainstorming sessions, AI-generated insights, and task
          creation, indicating a potential stagnation in collaboration and productivity. Immediate intervention is
          necessary to boost engagement and output across teams.
        </p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: "Brainstorm Sessions", value: "0" },
            { label: "Tasks Created", value: "0" },
            { label: "Content Generated", value: "0" },
            { label: "Pipeline Updates", value: "0" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Session Tabs */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-600">
          Brainstorm Sessions
        </button>
        <button className="px-4 py-2 text-sm rounded-lg bg-[#2D7A3E] text-white">AI-Generated Insights</button>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">No brainstorming sessions yet</h3>
        <p className="text-gray-500 mb-4">Start a new session to capture AI conversations and extract insights</p>
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <Plus className="w-4 h-4 mr-2" />
          Start First Session
        </Button>
      </div>
    </div>
  )
}
