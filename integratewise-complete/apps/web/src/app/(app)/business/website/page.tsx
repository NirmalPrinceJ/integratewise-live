import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Eye, Users, Target, TrendingDown, ExternalLink } from "lucide-react"

const pages = [
  { name: "Home", path: "/", type: "Landing", status: "published", views: 12500, visitors: 8200, conversions: 320 },
  {
    name: "Services",
    path: "/services",
    type: "Page",
    status: "published",
    views: 5600,
    visitors: 4200,
    conversions: 180,
  },
  {
    name: "Integration Patterns Blog",
    path: "/blog/integration-patterns",
    type: "Blog",
    status: "published",
    views: 4500,
    visitors: 3800,
    conversions: 45,
  },
]

export default function WebsiteManagerPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Website Manager"
        description="Manage pages, forms, and track visitor analytics"
        stageId="BUSINESS-018"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync HubSpot
            </Button>
            <Button size="sm" className="bg-[#2D7A3E] hover:bg-[#236B31]">
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Page Views" value="37,200" trend={12} trendLabel="vs last month" icon={Eye} />
        <MetricCard title="Unique Visitors" value="28,300" trend={8} trendLabel="vs last month" icon={Users} />
        <MetricCard
          title="Total Conversions"
          value="1,482"
          trend={15}
          trendLabel="vs last month"
          icon={Target}
          primary
        />
        <MetricCard title="Avg Bounce Rate" value="28.2%" trend={-3} trendLabel="vs last month" icon={TrendingDown} />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        {["Pages", "Forms", "Visitors", "HubSpot Sync"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm rounded-lg ${
              i === 0 ? "bg-white border border-gray-300 font-medium" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Page</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Views</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Visitors</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Conversions</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">SEO</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.path} className="hover:bg-gray-50">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">{page.name}</p>
                    <p className="text-sm text-gray-500">{page.path}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{page.type}</span>
                </td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{page.status}</span>
                </td>
                <td className="p-4 text-gray-900">{page.views.toLocaleString()}</td>
                <td className="p-4 text-gray-900">{page.visitors.toLocaleString()}</td>
                <td className="p-4 text-gray-900">{page.conversions}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }} />
                    </div>
                    <span className="text-sm text-gray-600">92</span>
                  </div>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
