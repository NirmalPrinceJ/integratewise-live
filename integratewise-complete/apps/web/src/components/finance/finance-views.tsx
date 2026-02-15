"use client"

/**
 * Finance domain-specific views: Revenue, Budgets, Expenses, Invoices.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowDownRight, ArrowUpRight, CreditCard, DollarSign,
  Download, Filter, PieChart, Plus, Receipt, TrendingUp,
} from "lucide-react"

/* ─── Revenue View ─── */
const revStreams = [
  { name: "Subscriptions", amount: 920_000, pct: 78, growth: 5.2, color: "bg-blue-500" },
  { name: "Professional Services", amount: 142_000, pct: 12, growth: 12.8, color: "bg-purple-500" },
  { name: "Add-ons / Upsells", amount: 85_000, pct: 7, growth: 22.1, color: "bg-green-500" },
  { name: "Support Contracts", amount: 36_000, pct: 3, growth: -2.4, color: "bg-amber-500" },
]
const cohorts = [
  { label: "Enterprise", mrr: 580_000, accounts: 18, nrr: 124 },
  { label: "Mid-Market", mrr: 285_000, accounts: 42, nrr: 112 },
  { label: "SMB", mrr: 118_000, accounts: 82, nrr: 98 },
]

export function RevenueView() {
  const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Revenue Breakdown</h2>
        <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {revStreams.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-3">
              <div className="text-[10px] text-muted-foreground">{s.name}</div>
              <div className="text-xl font-bold mt-1">{fmt(s.amount)}</div>
              <div className={`text-[10px] flex items-center gap-0.5 ${s.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                {s.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(s.growth)}% MoM
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Revenue Mix</h3>
          <div className="flex h-6 rounded-full overflow-hidden mb-3">
            {revStreams.map((s) => <div key={s.name} className={s.color} style={{ width: `${s.pct}%` }} title={`${s.name}: ${s.pct}%`} />)}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {revStreams.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-medium ml-auto">{s.pct}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">By Cohort</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {cohorts.map((c) => (
              <div key={c.label} className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs font-medium">{c.label}</div>
                <div className="text-lg font-bold mt-1">{fmt(c.mrr)}</div>
                <div className="text-[10px] text-muted-foreground">{c.accounts} accounts · NRR {c.nrr}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Budgets View ─── */
const budgets = [
  { dept: "Engineering", allocated: 420_000, spent: 395_000, committed: 15_000 },
  { dept: "Sales", allocated: 180_000, spent: 192_000, committed: 8_000 },
  { dept: "Marketing", allocated: 120_000, spent: 108_000, committed: 22_000 },
  { dept: "CS", allocated: 90_000, spent: 85_000, committed: 3_000 },
  { dept: "G&A", allocated: 60_000, spent: 52_000, committed: 0 },
  { dept: "Product", allocated: 75_000, spent: 68_000, committed: 5_000 },
]

export function BudgetsView() {
  const fmt = (n: number) => `$${(n / 1_000).toFixed(0)}K`
  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget Tracker</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px]">FY 2026 Q1</Badge>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Allocate</Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Total Allocated</div><div className="text-xl font-bold">{fmt(totalAllocated)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Total Spent</div><div className="text-xl font-bold text-blue-600">{fmt(totalSpent)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Remaining</div><div className="text-xl font-bold text-green-600">{fmt(totalAllocated - totalSpent)}</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.allocated) * 100)
              const over = b.spent > b.allocated
              return (
                <div key={b.dept}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{b.dept}</span>
                    <span className="text-muted-foreground">{fmt(b.spent)} / {fmt(b.allocated)}</span>
                  </div>
                  <Progress value={Math.min(pct, 100)} className={`h-2.5 ${over ? "[&>div]:bg-red-500" : ""}`} />
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>{pct}% used</span>
                    {b.committed > 0 && <span>{fmt(b.committed)} committed</span>}
                    {over && <span className="text-red-600">{fmt(b.spent - b.allocated)} over</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Expenses View ─── */
const expenses = [
  { id: "EXP-301", desc: "AWS Infrastructure – Jan", category: "Cloud", amount: 42_500, status: "approved", date: "Feb 1" },
  { id: "EXP-302", desc: "Team offsite catering", category: "Events", amount: 3_200, status: "pending", date: "Feb 5" },
  { id: "EXP-303", desc: "SaaS licenses renewal – Q1", category: "Software", amount: 18_900, status: "approved", date: "Feb 3" },
  { id: "EXP-304", desc: "Travel – NYC client visit", category: "Travel", amount: 2_150, status: "pending", date: "Feb 8" },
  { id: "EXP-305", desc: "Legal – contract review", category: "Professional", amount: 8_500, status: "approved", date: "Jan 28" },
  { id: "EXP-306", desc: "Office supplies Q1", category: "Office", amount: 1_800, status: "rejected", date: "Feb 2" },
]
const expStatus: Record<string, string> = { approved: "bg-green-500/10 text-green-600", pending: "bg-amber-500/10 text-amber-600", rejected: "bg-red-500/10 text-red-600" }

export function ExpensesView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1.5" /> Filter</Button>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Submit Expense</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] text-muted-foreground border-b">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{e.id}</td>
                  <td className="px-4 py-3 font-medium">{e.desc}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[9px]">{e.category}</Badge></td>
                  <td className="px-4 py-3 text-right font-semibold">${e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={`text-[9px] ${expStatus[e.status]}`}>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Invoices View ─── */
const invoices = [
  { id: "INV-1092", client: "Acme Corp", amount: 42_500, status: "paid", issued: "Jan 15", due: "Feb 1", paid: "Feb 1" },
  { id: "INV-1091", client: "TechNova", amount: 28_000, status: "pending", issued: "Jan 28", due: "Feb 28", paid: "—" },
  { id: "INV-1090", client: "DataFlow Inc", amount: 18_750, status: "overdue", issued: "Dec 15", due: "Jan 15", paid: "—" },
  { id: "INV-1089", client: "CloudServ", amount: 35_000, status: "paid", issued: "Jan 10", due: "Feb 10", paid: "Feb 8" },
  { id: "INV-1088", client: "FinScale", amount: 22_000, status: "paid", issued: "Jan 5", due: "Feb 5", paid: "Feb 3" },
  { id: "INV-1087", client: "GreenTech", amount: 15_200, status: "draft", issued: "—", due: "—", paid: "—" },
]
const invStatus: Record<string, string> = { paid: "bg-green-500/10 text-green-600", pending: "bg-amber-500/10 text-amber-600", overdue: "bg-red-500/10 text-red-600", draft: "bg-muted text-muted-foreground" }

export function InvoicesView() {
  const totalOutstanding = invoices.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.amount, 0)
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-[10px]">${totalOutstanding.toLocaleString()} outstanding</Badge>
          <Button size="sm"><Receipt className="w-3.5 h-3.5 mr-1.5" /> New Invoice</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] text-muted-foreground border-b">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium">{inv.id}</td>
                  <td className="px-4 py-3">{inv.client}</td>
                  <td className="px-4 py-3 text-right font-semibold">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.issued}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.due}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={`text-[9px] ${invStatus[inv.status]}`}>{inv.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
