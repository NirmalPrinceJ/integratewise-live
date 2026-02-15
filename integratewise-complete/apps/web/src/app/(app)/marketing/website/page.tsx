import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
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
    <DashboardLayout
      title="Website Manager"
      description="Manage pages, forms, and track visitor analytics"
      stageId="BUSINESS-018"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync HubSpot
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <Section title="Website Analytics">
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
          <MetricCard
            title="Avg Bounce Rate"
            value="28.2%"
            trend={-3}
            trendLabel="vs last month"
            icon={TrendingDown}
          />
        </div>
      </Section>

      {/* Pages Table */}
      <Section title="Website Pages">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Page</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Views</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Visitors</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Conversions</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">SEO</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.path} className="hover:bg-muted">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{page.name}</p>
                      <p className="text-sm text-muted-foreground">{page.path}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{page.type}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{page.status}</span>
                  </td>
                  <td className="p-4 text-foreground">{page.views.toLocaleString()}</td>
                  <td className="p-4 text-foreground">{page.visitors.toLocaleString()}</td>
                  <td className="p-4 text-foreground">{page.conversions}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-muted rounded-full h-2">
                        <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: "92%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">92</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" aria-label="Open page">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </DashboardLayout>
  )
}