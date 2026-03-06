/**
 * Finance Views - Finance Department
 * All views use UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  DashboardPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  CreditCard,
  Receipt,
  DollarSign,
  Calendar,
  CheckSquare,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Users
} from "lucide-react"

// ============================================================================
// Subscriptions View
// ============================================================================

const mockSubscriptions = [
  { id: "sub-001", customer: "Acme Corp", plan: "Enterprise", mrr: 4500, status: "active", nextBilling: "2024-02-01", users: 45 },
  { id: "sub-002", customer: "TechStart Inc", plan: "Growth", mrr: 1200, status: "active", nextBilling: "2024-02-15", users: 12 },
  { id: "sub-003", customer: "GlobalTrade", plan: "Enterprise", mrr: 8500, status: "active", nextBilling: "2024-02-01", users: 85 },
  { id: "sub-004", customer: "StartupXYZ", plan: "Starter", mrr: 299, status: "past_due", nextBilling: "2024-01-20", users: 3 },
]

function SubscriptionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    active: { bg: "bg-green-100", text: "text-green-700" },
    past_due: { bg: "bg-red-100", text: "text-red-700" },
    canceled: { bg: "bg-gray-100", text: "text-gray-600" },
    trialing: { bg: "bg-blue-100", text: "text-blue-700" },
  }
  const { bg, text } = config[status] || config.active
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status.replace("_", " ")}
    </span>
  )
}

export function SubscriptionsView() {
  const [subscriptions] = useState(mockSubscriptions)
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const kpis: KPIItem[] = [
    { label: "Total MRR", value: "$142.5K", color: "primary", icon: <DollarSign className="w-4 h-4" /> },
    { label: "Active Subscriptions", value: "234", color: "green" },
    { label: "Past Due", value: "3", color: "red", icon: <AlertTriangle className="w-4 h-4" /> },
    { label: "MRR Growth", value: "+8.2%", change: "vs last month", changeType: "positive" },
  ]

  const selectedSub = subscriptions.find(s => s.id === selected)

  return (
    <ListPageTemplate
      title="Subscriptions"
      description="Manage customer subscriptions"
      stageId="FIN-SUBS-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Subscriptions" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />New Subscription</button>}
      rightPanel={selectedSub ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4><p className="text-gray-900 font-medium">{selectedSub.customer}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Plan</h4><p className="text-gray-900">{selectedSub.plan}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4><SubscriptionStatusBadge status={selectedSub.status} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">MRR</h4><p className="text-gray-900">${selectedSub.mrr.toLocaleString()}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Users</h4><p className="text-gray-900">{selectedSub.users}</p></div>
          </div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Next Billing</h4><p className="text-gray-900">{selectedSub.nextBilling}</p></div>
        </div>
      ) : null}
      rightPanelTitle="Subscription Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Plan</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">MRR</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Users</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Next Billing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelected(sub.id); setPanelOpen(true); }}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg"><Building2 className="w-4 h-4 text-blue-600" /></div><span className="text-sm font-medium text-gray-900">{sub.customer}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{sub.plan}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${sub.mrr.toLocaleString()}</td>
                <td className="px-4 py-3"><SubscriptionStatusBadge status={sub.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">{sub.users}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{sub.nextBilling}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Transactions View
// ============================================================================

export function TransactionsView() {
  const transactions = [
    { id: "txn-001", customer: "Acme Corp", type: "payment", amount: 4500, status: "completed", date: "2024-01-15" },
    { id: "txn-002", customer: "TechStart Inc", type: "payment", amount: 1200, status: "completed", date: "2024-01-14" },
    { id: "txn-003", customer: "StartupXYZ", type: "refund", amount: -299, status: "completed", date: "2024-01-12" },
    { id: "txn-004", customer: "GlobalTrade", type: "payment", amount: 8500, status: "pending", date: "2024-01-10" },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Revenue", value: "$234.5K", color: "primary" },
    { label: "This Month", value: "$42.3K", change: "+15%", changeType: "positive" },
    { label: "Pending", value: "$8.5K", color: "yellow" },
    { label: "Refunds", value: "$1.2K", icon: <RefreshCcw className="w-4 h-4" /> },
  ]

  return (
    <ListPageTemplate
      title="Transactions"
      description="Payment and refund history"
      stageId="FIN-TRANS-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Transactions" }]}
      kpis={kpis}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Transaction</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{txn.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{txn.customer}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${txn.type === 'payment' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{txn.type}</span></td>
                <td className="px-4 py-3 text-sm font-medium"><span className={txn.amount > 0 ? 'text-green-600' : 'text-red-600'}>{txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{txn.status}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Revenue View
// ============================================================================

export function RevenueView() {
  const kpis: KPIItem[] = [
    { label: "ARR", value: "$1.71M", color: "primary", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "MRR", value: "$142.5K", change: "+8.2%", changeType: "positive" },
    { label: "Net Revenue Retention", value: "115%", color: "green" },
    { label: "Expansion MRR", value: "$12.3K", change: "+23%", changeType: "positive" },
  ]

  return (
    <DashboardPageTemplate
      title="Revenue"
      description="Revenue analytics and forecasting"
      stageId="FIN-REV-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Revenue" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">MRR Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg"><span className="text-gray-400">MRR Chart Placeholder</span></div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Revenue by Plan</h3>
            <div className="space-y-2">
              {[{ name: "Enterprise", pct: 68, amount: "$96.9K" }, { name: "Growth", pct: 24, amount: "$34.2K" }, { name: "Starter", pct: 8, amount: "$11.4K" }].map((plan, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{plan.name}</span>
                  <span className="text-sm font-medium text-gray-900">{plan.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">MRR Movements</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">New</span><span className="text-green-600 font-medium">+$8.2K</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Expansion</span><span className="text-green-600 font-medium">+$12.3K</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Contraction</span><span className="text-red-600 font-medium">-$2.1K</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Churn</span><span className="text-red-600 font-medium">-$5.4K</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Finance Today View
// ============================================================================

export function FinanceTodayView() {
  const kpis: KPIItem[] = [
    { label: "Invoices Due", value: "12", color: "yellow" },
    { label: "Revenue Today", value: "$8.5K", color: "green" },
    { label: "Failed Payments", value: "2", color: "red" },
    { label: "Renewals This Week", value: "8", icon: <RefreshCcw className="w-4 h-4" /> },
  ]

  return (
    <DashboardPageTemplate
      title="Today"
      description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      stageId="FIN-TODAY-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Today" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              {[
                { type: "failed", customer: "StartupXYZ", amount: "$299", action: "Retry payment" },
                { type: "past_due", customer: "SmallBiz Co", amount: "$599", action: "Send reminder" },
                { type: "renewal", customer: "Acme Corp", amount: "$4,500", action: "Process renewal" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'failed' ? 'bg-red-50' : item.type === 'past_due' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      {item.type === 'failed' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : item.type === 'past_due' ? <Clock className="w-4 h-4 text-yellow-600" /> : <RefreshCcw className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div><p className="text-sm font-medium text-gray-900">{item.customer}</p><p className="text-xs text-gray-500">{item.amount}</p></div>
                  </div>
                  <button className="text-sm text-[#2D7A3E] hover:underline">{item.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4" /><h3 className="text-sm font-semibold">AI Alerts</h3></div>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">3 customers with payment methods expiring this month. Consider proactive outreach.</p></div>
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">MRR growth trending 12% above forecast. Consider updating projections.</p></div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Finance Tasks View
// ============================================================================

export function FinanceTasksView() {
  const kpis: KPIItem[] = [
    { label: "Total Tasks", value: "18", color: "primary" },
    { label: "Due Today", value: "3", color: "yellow" },
    { label: "Overdue", value: "1", color: "red" },
    { label: "Completed", value: "12", color: "green" },
  ]

  return (
    <ListPageTemplate
      title="Tasks"
      description="Manage finance tasks"
      stageId="FIN-TASKS-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Tasks" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Task</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-sm">Finance task list with same structure as other Tasks views</p>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Billing View
// ============================================================================

export function BillingView() {
  const kpis: KPIItem[] = [
    { label: "Invoices Sent", value: "234", color: "primary" },
    { label: "Paid", value: "218", color: "green" },
    { label: "Pending", value: "12", color: "yellow" },
    { label: "Overdue", value: "4", color: "red" },
  ]

  return (
    <ListPageTemplate
      title="Billing"
      description="Invoice and billing management"
      stageId="FIN-BILLING-001"
      breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Billing" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Create Invoice</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="space-y-4">
          {[
            { id: "INV-001", customer: "Acme Corp", amount: 4500, status: "paid", date: "2024-01-15" },
            { id: "INV-002", customer: "TechStart Inc", amount: 1200, status: "pending", date: "2024-01-20" },
            { id: "INV-003", customer: "GlobalTrade", amount: 8500, status: "overdue", date: "2024-01-10" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><FileText className="w-4 h-4 text-gray-600" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.id}</p>
                  <p className="text-xs text-gray-500">{inv.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${inv.amount.toLocaleString()}</p>
                <span className={`text-xs font-medium ${inv.status === 'paid' ? 'text-green-600' : inv.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ListPageTemplate>
  )
}

export default {
  SubscriptionsView,
  TransactionsView,
  RevenueView,
  FinanceTodayView,
  FinanceTasksView,
  BillingView,
}
