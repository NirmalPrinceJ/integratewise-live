"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, BarChart3, PieChart, Users, CreditCard,
  FileText, ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react"

// Finance KPIs from docs.md Layer 1: Financial & Revenue Intelligence
const KPIS = [
  {
    label: "ARR",
    value: "$847K",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    detail: "Annual Recurring Revenue"
  },
  {
    label: "Net Retention",
    value: "118%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    detail: "Target: 110%+"
  },
  {
    label: "DSO",
    value: "42 days",
    change: "+8 days",
    trend: "down",
    icon: Calendar,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    detail: "Days Sales Outstanding"
  },
  {
    label: "Churn Rate",
    value: "2.1%",
    change: "-0.4%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    detail: "Monthly churn"
  },
]

// Revenue Breakdown from Layer 1
const REVENUE_MIX = [
  { category: "New Business", amount: "$245K", percentage: 29, color: "emerald" },
  { category: "Expansion", amount: "$178K", percentage: 21, color: "blue" },
  { category: "Renewal", amount: "$424K", percentage: 50, color: "purple" },
]

// AR Aging from Layer 1
const AR_AGING = [
  { bucket: "Current", amount: "$284K", percentage: 62, count: 47 },
  { bucket: "1-30 days", amount: "$98K", percentage: 21, count: 18 },
  { bucket: "31-60 days", amount: "$52K", percentage: 11, count: 9 },
  { bucket: "61-90 days", amount: "$18K", percentage: 4, count: 4 },
  { bucket: "90+ days", amount: "$8K", percentage: 2, count: 2, alert: true },
]

// Churn Risk from Layer 7
const CHURN_RISK_ACCOUNTS = [
  { name: "TechCorp", arr: "$180K", probability: 72, signals: ["Payment delays", "Usage -32%", "No executive engagement"], severity: "high" },
  { name: "GlobalInc", arr: "$95K", probability: 65, signals: ["Support tickets +40%", "NPS: 3"], severity: "high" },
  { name: "DataSystems", arr: "$125K", probability: 58, signals: ["Contract renewal 45 days", "Champion departed"], severity: "medium" },
]

// Payment Intelligence from Layer 7
const PAYMENT_SIGNALS = [
  { customer: "Acme Corp", invoice: "INV-2847", amount: "$45K", daysLate: 12, status: "collections", risk: "medium" },
  { customer: "BuildCo", invoice: "INV-2891", amount: "$28K", daysLate: 48, status: "escalated", risk: "high" },
  { customer: "TechStart", invoice: "INV-2903", amount: "$15K", daysLate: 5, status: "reminder", risk: "low" },
]

export default function FinanceHomePage() {
  return (
    <DashboardLayout 
      title="Finance Operations" 
      description="Revenue intelligence, collections management, and financial performance analytics"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Forecast
          </Button>
          <Button size="sm">
            <DollarSign className="w-4 h-4 mr-2" />
            Close Period
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {KPIS.map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                {kpi.change}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-slate-600 font-medium">{kpi.label}</p>
              <p className="text-xs text-slate-500">{kpi.detail}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Mix */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Revenue Mix</h3>
              <p className="text-sm text-slate-600">Q1 2026</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {REVENUE_MIX.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm font-semibold">{item.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${item.color}-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total MRR</span>
              <span>$847K</span>
            </div>
          </div>
        </Card>

        {/* AR Aging */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">AR Aging Analysis</h3>
              <p className="text-sm text-slate-600">Total outstanding: $460K</p>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Collections Queue
            </Button>
          </div>

          <div className="space-y-3">
            {AR_AGING.map((bucket) => (
              <div key={bucket.bucket} className={`p-4 rounded-lg border ${bucket.alert ? 'border-rose-200 bg-rose-50' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{bucket.bucket}</span>
                    <Badge variant="outline" className="text-xs">{bucket.count} invoices</Badge>
                    {bucket.alert && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{bucket.amount}</div>
                    <div className="text-xs text-slate-600">{bucket.percentage}%</div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={bucket.alert ? "bg-rose-500" : "bg-blue-500"}
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Churn Risk & Payment Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Financial Impact */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Churn Risk Analysis</h3>
              <p className="text-sm text-slate-600">$400K ARR at risk</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {CHURN_RISK_ACCOUNTS.map((account) => (
              <div key={account.name} className="border-l-4 border-l-rose-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">{account.name}</span>
                    <div className="text-xs text-slate-600 mt-1">{account.arr} ARR</div>
                  </div>
                  <Badge variant={account.severity === "high" ? "destructive" : "secondary"}>
                    {account.probability}% risk
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {account.signals.map((signal, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700">
                <strong>Action Required:</strong> Historical churn rate for 'high risk' accounts: 65%. Expected Q2 impact: $260K
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Intelligence */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Payment Signals</h3>
              <p className="text-sm text-slate-600">Overdue invoices requiring action</p>
            </div>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Collections Workflow
            </Button>
          </div>

          <div className="space-y-4">
            {PAYMENT_SIGNALS.map((payment) => (
              <div key={payment.invoice} className="border-l-4 border-l-amber-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">{payment.customer}</span>
                    <div className="text-xs text-slate-600 mt-1 font-mono">{payment.invoice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{payment.amount}</div>
                    <Badge 
                      variant="outline"
                      className={`text-xs mt-1 ${
                        payment.risk === "high" ? "border-rose-500 text-rose-700" :
                        payment.risk === "medium" ? "border-amber-500 text-amber-700" :
                        "border-blue-500 text-blue-700"
                      }`}
                    >
                      {payment.daysLate} days late
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-slate-600">
                  Status: <span className="font-medium capitalize">{payment.status}</span>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Escalate to Collections
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
