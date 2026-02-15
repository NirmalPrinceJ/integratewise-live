import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const stages = [
  { name: "Discovery", value: "₹0K", deals: 0, color: "bg-blue-500" },
  { name: "Qualification", value: "₹0K", deals: 0, color: "bg-cyan-500" },
  { name: "Proposal", value: "₹0K", deals: 0, color: "bg-yellow-500" },
  { name: "Negotiation", value: "₹0K", deals: 0, color: "bg-orange-500" },
]

export default function PipelinePage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Sales Pipeline"
        description="Track opportunities and deals"
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        }
      />

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Pipeline" value="₹0K" primary />
        <MetricCard title="Weighted Pipeline" value="₹0K" />
        <MetricCard title="Open Opportunities" value="0" />
        <MetricCard title="Avg Deal Size" value="₹0" />
      </div>

      {/* Pipeline Stages */}
      <div className="flex gap-4 mb-6">
        {stages.map((stage) => (
          <div key={stage.name} className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`h-1 ${stage.color} rounded-full mb-3`} />
            <p className="text-sm text-gray-500">{stage.name}</p>
            <p className="text-xl font-bold text-gray-900">{stage.value}</p>
            <p className="text-xs text-gray-400">{stage.deals} deals</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No opportunities in pipeline yet.</p>
        <Button className="mt-4 bg-[#2D7A3E] hover:bg-[#236B31]">
          <Plus className="w-4 h-4 mr-2" />
          Add First Opportunity
        </Button>
      </div>
    </div>
  )
}
