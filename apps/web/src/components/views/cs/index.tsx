/**
 * CS Views - Customer Success Department
 * All views use UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate,
  ListPageTemplate, 
  DashboardPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Users,
  Heart,
  MessageSquare,
  RefreshCw,
  Calendar,
  CheckSquare,
  Lightbulb,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Clock,
  Star,
  MoreHorizontal,
  ArrowRight,
  Phone,
  Mail,
  Activity,
  Target,
  Sparkles
} from "lucide-react"

// ============================================================================
// Customers View
// ============================================================================

const mockCustomers = [
  { id: "cust-001", name: "Acme Corp", plan: "Enterprise", mrr: 12500, health: "healthy", nps: 9, csm: "Sarah Chen", renewalDate: "2024-06-15" },
  { id: "cust-002", name: "TechStart Inc", plan: "Growth", mrr: 2500, health: "at-risk", nps: 6, csm: "Mike Johnson", renewalDate: "2024-03-01" },
  { id: "cust-003", name: "GlobalTech", plan: "Enterprise", mrr: 25000, health: "healthy", nps: 10, csm: "Lisa Park", renewalDate: "2024-08-20" },
  { id: "cust-004", name: "RetailMax", plan: "Starter", mrr: 500, health: "churned", nps: 3, csm: "David Lee", renewalDate: "2024-01-10" },
]

function HealthBadge({ health }: { health: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    healthy: { bg: "bg-green-100", text: "text-green-700" },
    "at-risk": { bg: "bg-yellow-100", text: "text-yellow-700" },
    churned: { bg: "bg-red-100", text: "text-red-700" },
  }
  const { bg, text } = config[health] || config.healthy
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text} capitalize`}>{health.replace("-", " ")}</span>
}

export function CustomersView() {
  const [customers] = useState(mockCustomers)
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const kpis: KPIItem[] = [
    { label: "Total Customers", value: "234", color: "primary" },
    { label: "Total ARR", value: "$2.8M", icon: <DollarSign className="w-4 h-4" /> },
    { label: "Healthy", value: "189", color: "green" },
    { label: "At Risk", value: "23", color: "yellow" },
  ]

  const selectedCustomer = customers.find(c => c.id === selected)

  return (
    <ListPageTemplate
      title="Customers"
      description="Manage your customer portfolio"
      stageId="CS-CUSTOMERS-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Customers" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Customer</button>}
      rightPanel={selectedCustomer ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4><p className="text-gray-900 font-medium">{selectedCustomer.name}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Plan</h4><p className="text-gray-900">{selectedCustomer.plan}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">MRR</h4><p className="text-gray-900 font-semibold">${selectedCustomer.mrr.toLocaleString()}</p></div>
          </div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Health</h4><HealthBadge health={selectedCustomer.health} /></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">NPS Score</h4><p className="text-gray-900">{selectedCustomer.nps}/10</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">CSM</h4><p className="text-gray-900">{selectedCustomer.csm}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Renewal Date</h4><p className="text-gray-900">{new Date(selectedCustomer.renewalDate).toLocaleDateString()}</p></div>
        </div>
      ) : null}
      rightPanelTitle="Customer Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
      isEmpty={customers.length === 0}
      emptyState={{ icon: <Users className="w-12 h-12" />, title: "No Customers Yet", description: "Add your first customer to get started." }}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Plan</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">MRR</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Health</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">NPS</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">CSM</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelected(customer.id); setPanelOpen(true); }}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg"><Users className="w-4 h-4 text-blue-600" /></div><span className="text-sm font-medium text-gray-900">{customer.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.plan}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${customer.mrr.toLocaleString()}</td>
                <td className="px-4 py-3"><HealthBadge health={customer.health} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.nps}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.csm}</td>
                <td className="px-4 py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Health View
// ============================================================================

export function HealthView() {
  const healthMetrics = [
    { label: "Overall Health Score", value: "78", change: "+3 pts", trend: "up" },
    { label: "NPS", value: "42", change: "+5", trend: "up" },
    { label: "Product Adoption", value: "67%", change: "+8%", trend: "up" },
    { label: "Support Tickets", value: "12", change: "-4", trend: "up" },
  ]

  const atRiskCustomers = [
    { name: "TechStart Inc", health: 45, reason: "Low product usage", mrr: 2500 },
    { name: "DataFlow", health: 52, reason: "Multiple support tickets", mrr: 1800 },
    { name: "CloudSync", health: 38, reason: "Contract ending, no renewal discussion", mrr: 3200 },
  ]

  const kpis: KPIItem[] = [
    { label: "Avg Health Score", value: "78", color: "primary" },
    { label: "Healthy (>70)", value: "156", color: "green" },
    { label: "At Risk (<50)", value: "18", color: "red" },
    { label: "NPS Score", value: "+42", color: "blue" },
  ]

  return (
    <DashboardPageTemplate
      title="Customer Health"
      description="Monitor customer health scores and engagement"
      stageId="CS-HEALTH-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Health" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Health Metrics Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <span className="text-gray-400">Health Score Chart Placeholder</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">At-Risk Customers</h3>
              <span className="text-xs text-red-600">{atRiskCustomers.length} require attention</span>
            </div>
            <div className="space-y-3">
              {atRiskCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><span className="text-sm font-bold text-red-600">{customer.health}</span></div>
                    <div><p className="text-sm font-medium text-gray-900">{customer.name}</p><p className="text-xs text-gray-500">{customer.reason}</p></div>
                  </div>
                  <div className="text-right"><p className="text-sm font-medium text-gray-900">${customer.mrr.toLocaleString()}/mo</p><button className="text-xs text-[#2D7A3E] hover:underline">Take Action</button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          {healthMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{metric.label}</span>
                {metric.trend === "up" ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>{metric.change} vs last month</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Engagements View
// ============================================================================

export function EngagementsView() {
  const engagements = [
    { id: 1, customer: "Acme Corp", type: "QBR", date: "2024-01-20", status: "scheduled", owner: "Sarah Chen" },
    { id: 2, customer: "TechStart", type: "Health Check", date: "2024-01-18", status: "completed", owner: "Mike Johnson" },
    { id: 3, customer: "GlobalTech", type: "Training", date: "2024-01-22", status: "scheduled", owner: "Lisa Park" },
    { id: 4, customer: "RetailMax", type: "Escalation", date: "2024-01-15", status: "in-progress", owner: "David Lee" },
  ]

  const kpis: KPIItem[] = [
    { label: "This Month", value: "45", color: "primary" },
    { label: "Completed", value: "32", color: "green" },
    { label: "Scheduled", value: "8", color: "blue" },
    { label: "Avg Duration", value: "35m", icon: <Clock className="w-4 h-4" /> },
  ]

  return (
    <ListPageTemplate
      title="Engagements"
      description="Customer touchpoints and interactions"
      stageId="CS-ENGAGEMENTS-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Engagements" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Schedule Engagement</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {engagements.map((eng) => (
              <tr key={eng.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{eng.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{eng.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(eng.date).toLocaleDateString()}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eng.status === 'completed' ? 'bg-green-100 text-green-700' : eng.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{eng.status}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600">{eng.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Renewals View
// ============================================================================

export function RenewalsView() {
  const renewals = [
    { id: 1, customer: "Acme Corp", arr: 150000, renewalDate: "2024-02-15", probability: 95, status: "on-track" },
    { id: 2, customer: "TechStart", arr: 30000, renewalDate: "2024-03-01", probability: 60, status: "at-risk" },
    { id: 3, customer: "GlobalTech", arr: 300000, renewalDate: "2024-02-28", probability: 90, status: "on-track" },
    { id: 4, customer: "DataFlow", arr: 45000, renewalDate: "2024-02-20", probability: 40, status: "at-risk" },
  ]

  const kpis: KPIItem[] = [
    { label: "Renewal Pipeline", value: "$1.2M", color: "primary" },
    { label: "Due This Quarter", value: "45", icon: <Calendar className="w-4 h-4" /> },
    { label: "On Track", value: "38", color: "green" },
    { label: "At Risk", value: "7", color: "red" },
  ]

  return (
    <ListPageTemplate
      title="Renewals"
      description="Track and manage customer renewals"
      stageId="CS-RENEWALS-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Renewals" }]}
      kpis={kpis}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">ARR</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Renewal Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Probability</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renewals.map((renewal) => (
              <tr key={renewal.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{renewal.customer}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${renewal.arr.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(renewal.renewalDate).toLocaleDateString()}</td>
                <td className="px-4 py-3"><span className={`text-sm font-medium ${renewal.probability >= 80 ? 'text-green-600' : renewal.probability >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{renewal.probability}%</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${renewal.status === 'on-track' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{renewal.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// CS Today View
// ============================================================================

export function CSTodayView() {
  const kpis: KPIItem[] = [
    { label: "Calls Today", value: "6", icon: <Phone className="w-4 h-4" /> },
    { label: "Tasks Due", value: "8", color: "yellow" },
    { label: "Renewals This Week", value: "3", color: "blue" },
    { label: "At-Risk Alerts", value: "2", color: "red" },
  ]

  return (
    <DashboardPageTemplate
      title="Today"
      description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      stageId="CS-TODAY-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Today" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "9:00 AM", title: "QBR with Acme Corp", type: "meeting" },
              { time: "11:00 AM", title: "Health check call - TechStart", type: "call" },
              { time: "2:00 PM", title: "Training session - GlobalTech", type: "training" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500 w-20">{item.time}</span>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.title}</p></div>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4" /><h3 className="text-sm font-semibold">AI Suggestions</h3></div>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">TechStart hasn't logged in for 5 days. Consider reaching out to check on adoption.</p></div>
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">Acme Corp's usage is up 40%. Good time to discuss expansion.</p></div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// CS Tasks View
// ============================================================================

export function CSTasksView() {
  const kpis: KPIItem[] = [
    { label: "Total Tasks", value: "34", color: "primary" },
    { label: "Due Today", value: "5", color: "yellow" },
    { label: "Overdue", value: "2", color: "red" },
    { label: "Completed", value: "18", color: "green" },
  ]

  return (
    <ListPageTemplate
      title="Tasks"
      description="Manage your customer success tasks"
      stageId="CS-TASKS-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Tasks" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Task</button>}
      isEmpty={false}
      emptyState={{ icon: <CheckSquare className="w-12 h-12" />, title: "No Tasks", description: "Create your first task" }}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-sm">Task list with same structure as Sales Tasks view</p>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// CS Insights View
// ============================================================================

export function CSInsightsView() {
  const kpis: KPIItem[] = [
    { label: "AI Insights", value: "8", color: "primary", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Churn Risk", value: "3", color: "red" },
    { label: "Expansion Opps", value: "5", color: "green" },
    { label: "NPS Alerts", value: "2", color: "yellow" },
  ]

  return (
    <DashboardPageTemplate
      title="Insights"
      description="AI-powered customer success analytics"
      stageId="CS-INSIGHTS-001"
      breadcrumbs={[{ label: "Customer Success", href: "/cs" }, { label: "Insights" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Success Insights</h3>
          <div className="space-y-4">
            {[
              { type: "risk", title: "Churn risk detected", description: "TechStart usage dropped 60% this month", priority: "high" },
              { type: "opportunity", title: "Expansion opportunity", description: "Acme Corp hitting seat limits frequently", priority: "medium" },
              { type: "action", title: "NPS follow-up needed", description: "GlobalTech gave NPS score of 6 - investigate", priority: "high" },
            ].map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${insight.type === 'risk' ? 'bg-red-50 border-red-200' : insight.type === 'opportunity' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Distribution</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Healthy</span><span className="text-sm font-medium text-green-600">156</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Neutral</span><span className="text-sm font-medium text-yellow-600">45</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">At Risk</span><span className="text-sm font-medium text-red-600">18</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

export default {
  CustomersView,
  HealthView,
  EngagementsView,
  RenewalsView,
  CSTodayView,
  CSTasksView,
  CSInsightsView,
}
