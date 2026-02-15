"use client"

/**
 * Finance Dashboard — Revenue, expenses, burn, budgets, invoices, P&L snapshot.
 */

import {
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Receipt, PieChart, ArrowUpRight, ArrowDownRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const kpis = {
  arr: 11_800_000,
  mrr: 983_333,
  burnRate: 620_000,
  runway: "19 months",
  grossMargin: 78,
  netRevRetention: 118,
}

const revenue = [
  { month: "Sep", value: 850 },
  { month: "Oct", value: 890 },
  { month: "Nov", value: 920 },
  { month: "Dec", value: 945 },
  { month: "Jan", value: 965 },
  { month: "Feb", value: 983 },
]

const expenseBuckets = [
  { category: "Payroll", amount: 380_000, pct: 61, color: "bg-blue-500" },
  { category: "Infrastructure", amount: 85_000, pct: 14, color: "bg-purple-500" },
  { category: "Sales & Marketing", amount: 78_000, pct: 13, color: "bg-pink-500" },
  { category: "Office & Admin", amount: 42_000, pct: 7, color: "bg-amber-500" },
  { category: "Other", amount: 35_000, pct: 5, color: "bg-muted-foreground" },
]

const budgetVsActual = [
  { dept: "Engineering", budget: 420_000, actual: 395_000 },
  { dept: "Sales", budget: 180_000, actual: 192_000 },
  { dept: "Marketing", budget: 120_000, actual: 108_000 },
  { dept: "CS", budget: 90_000, actual: 85_000 },
  { dept: "G&A", budget: 60_000, actual: 52_000 },
]

const invoices = [
  { id: "INV-1092", client: "Acme Corp", amount: 42_500, status: "paid", date: "Feb 1" },
  { id: "INV-1091", client: "TechNova", amount: 28_000, status: "pending", date: "Jan 28" },
  { id: "INV-1090", client: "DataFlow Inc", amount: 18_750, status: "overdue", date: "Jan 15" },
  { id: "INV-1089", client: "CloudServ", amount: 35_000, status: "paid", date: "Jan 10" },
  { id: "INV-1088", client: "FinScale", amount: 22_000, status: "paid", date: "Jan 5" },
]

const statusColors: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600",
  pending: "bg-amber-500/10 text-amber-600",
  overdue: "bg-red-500/10 text-red-600",
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export function FinanceDashboard() {
  const maxRevenue = Math.max(...revenue.map((r) => r.value))

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="ARR" value={fmt(kpis.arr)} sub={`MRR ${fmt(kpis.mrr)}`} icon={<DollarSign className="w-4 h-4" />} accent="text-green-600" trend="+4.8%" up />
        <KPI title="Gross Margin" value={`${kpis.grossMargin}%`} sub="target 80%" icon={<PieChart className="w-4 h-4" />} accent="text-blue-600" />
        <KPI title="Net Rev Retention" value={`${kpis.netRevRetention}%`} sub="expansion + churn" icon={<TrendingUp className="w-4 h-4" />} accent="text-purple-600" trend="+2.1%" up />
        <KPI title="Runway" value={kpis.runway} sub={`Burn ${fmt(kpis.burnRate)}/mo`} icon={<CreditCard className="w-4 h-4" />} accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">MRR Trend ($K)</h3>
            <div className="flex items-end gap-2 h-32">
              {revenue.map((r) => (
                <div key={r.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-medium">{r.value}</span>
                  <div className="w-full rounded-t bg-green-500" style={{ height: `${(r.value / maxRevenue) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground">{r.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Monthly Expenses</h3>
            {/* Stacked bar */}
            <div className="flex h-6 rounded-full overflow-hidden mb-3">
              {expenseBuckets.map((b) => (
                <div key={b.category} className={`${b.color}`} style={{ width: `${b.pct}%` }} title={`${b.category}: ${b.pct}%`} />
              ))}
            </div>
            <div className="space-y-1.5">
              {expenseBuckets.map((b) => (
                <div key={b.category} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  <span className="flex-1 text-muted-foreground">{b.category}</span>
                  <span className="font-medium">{fmt(b.amount)}</span>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{b.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Budget vs Actual</h3>
            <div className="space-y-3">
              {budgetVsActual.map((d) => {
                const pct = Math.round((d.actual / d.budget) * 100)
                const over = d.actual > d.budget
                return (
                  <div key={d.dept}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{d.dept}</span>
                      <span className={`text-[10px] ${over ? "text-red-600" : "text-green-600"}`}>
                        {pct}% {over ? "over" : "of"} budget
                      </span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className={`h-2 ${over ? "[&>div]:bg-red-500" : ""}`} />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Recent Invoices</h3>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                  <Receipt className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{inv.client}</div>
                    <div className="text-[10px] text-muted-foreground">{inv.id} · {inv.date}</div>
                  </div>
                  <span className="text-xs font-semibold">{fmt(inv.amount)}</span>
                  <Badge variant="outline" className={`text-[9px] ${statusColors[inv.status]}`}>{inv.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPI({ title, value, sub, icon, accent, trend, up }: { title: string; value: string; sub: string; icon: React.ReactNode; accent: string; trend?: string; up?: boolean }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{title}</span>
          <div className={accent}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl font-semibold ${accent}`}>{value}</span>
          {trend && (
            <span className={`text-[10px] flex items-center ${up ? "text-green-600" : "text-red-600"}`}>
              {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  )
}
