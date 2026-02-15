import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Star, TrendingUp, ArrowUpRight } from "lucide-react"
import { getLeads } from "@/lib/supabase/queries"

export default async function LeadsPage() {
  const leads = await getLeads()

  const leadStats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Leads"
        description="Manage and track your sales leads"
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        }
      />

      {/* Lead Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Leads" value={leadStats.total.toString()} icon={Users} />
        <MetricCard title="New" value={leadStats.new.toString()} icon={Star} />
        <MetricCard title="Qualified" value={leadStats.qualified.toString()} icon={TrendingUp} />
        <MetricCard title="Converted" value={leadStats.converted.toString()} icon={ArrowUpRight} primary />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {["All", "New", "Contacted", "Qualified", "Unqualified"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm rounded-lg ${
              i === 0 ? "bg-[#2D7A3E] text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Company</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Source</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No leads yet. Add your first lead to get started.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{lead.company || "-"}</td>
                  <td className="p-4 text-gray-600">{lead.source || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        lead.status === "qualified"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lead.status || "unknown"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900">{lead.score || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
