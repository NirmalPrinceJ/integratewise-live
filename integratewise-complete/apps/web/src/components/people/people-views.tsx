"use client"

/**
 * People/HR domain-specific views: Employees, Recruiting, Payroll, Performance.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Award, Briefcase, DollarSign, Filter, Plus, Search,
  Star, TrendingUp, User, UserPlus, Users,
} from "lucide-react"

/* ─── Employees View ─── */
const employees = [
  { name: "Ravi Kumar", role: "Sr Backend Engineer", department: "Engineering", status: "active", tenure: "2.5y", location: "Bangalore" },
  { name: "Sarah Kim", role: "Product Manager", department: "Product", status: "active", tenure: "1.8y", location: "SF" },
  { name: "Mike Rodriguez", role: "Enterprise AE", department: "Sales", status: "active", tenure: "3.1y", location: "NYC" },
  { name: "Priya Mehta", role: "Frontend Engineer", department: "Engineering", status: "active", tenure: "1.2y", location: "Remote" },
  { name: "Jake Liu", role: "CS Manager", department: "Customer Success", status: "on-leave", tenure: "2.0y", location: "Austin" },
  { name: "Anna Petrov", role: "Marketing Lead", department: "Marketing", status: "active", tenure: "0.8y", location: "London" },
]

export function EmployeesView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Employees ({employees.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Search className="w-3.5 h-3.5 mr-1.5" /> Search</Button>
          <Button size="sm"><UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Employee</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] text-muted-foreground border-b">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Tenure</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((e) => (
                <tr key={e.name} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[8px] font-bold">{e.name.split(" ").map((n) => n[0]).join("")}</div>
                    {e.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.role}</td>
                  <td className="px-4 py-3">{e.department}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location}</td>
                  <td className="px-4 py-3">{e.tenure}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={`text-[9px] ${e.status === "active" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Recruiting View ─── */
const candidates = [
  { name: "Alex Chen", role: "Sr Backend Engineer", stage: "Technical Interview", source: "LinkedIn", applied: "Feb 5", rating: 4 },
  { name: "Maria Santos", role: "Product Designer", stage: "Portfolio Review", source: "Referral", applied: "Feb 8", rating: 5 },
  { name: "James Wilson", role: "Enterprise AE", stage: "Final Round", source: "Recruiter", applied: "Jan 28", rating: 4 },
  { name: "Yuki Tanaka", role: "Data Analyst", stage: "Offer Sent", source: "Website", applied: "Jan 22", rating: 5 },
  { name: "Omar Hassan", role: "CSM — Enterprise", stage: "Phone Screen", source: "LinkedIn", applied: "Feb 10", rating: 3 },
]
const stageColors: Record<string, string> = {
  "Phone Screen": "text-muted-foreground",
  "Portfolio Review": "text-blue-600",
  "Technical Interview": "text-purple-600",
  "Final Round": "text-amber-600",
  "Offer Sent": "text-green-600",
}

export function RecruitingView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recruiting Pipeline</h2>
        <Button size="sm"><Briefcase className="w-3.5 h-3.5 mr-1.5" /> Post Role</Button>
      </div>
      {/* Pipeline Funnel */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[["Applied", 56], ["Screen", 28], ["Interview", 12], ["Final", 5], ["Offer", 2]].map(([label, count]) => (
          <div key={label as string} className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold">{count}</div>
            <div className="text-[9px] text-muted-foreground">{label as string}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {candidates.map((c) => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.role} · {c.source} · Applied {c.applied}</div>
                </div>
                <span className={`text-[10px] font-medium ${stageColors[c.stage] || ""}`}>{c.stage}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < c.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Payroll View ─── */
const payrollSummary = { totalPayroll: 380_000, headcount: 148, avgSalary: 128_000, nextRunDate: "Feb 28", benefits: 45_000, taxes: 62_000 }
const deptPayroll = [
  { dept: "Engineering", amount: 165_000, pct: 43 },
  { dept: "Sales", amount: 78_000, pct: 21 },
  { dept: "CS", amount: 52_000, pct: 14 },
  { dept: "Marketing", amount: 38_000, pct: 10 },
  { dept: "Product", amount: 28_000, pct: 7 },
  { dept: "Ops & Admin", amount: 19_000, pct: 5 },
]

export function PayrollView() {
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}K`
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payroll</h2>
        <Badge variant="outline" className="text-[10px]">Next run: {payrollSummary.nextRunDate}</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Monthly Payroll</div><div className="text-xl font-bold text-blue-600">{fmt(payrollSummary.totalPayroll)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Avg Salary</div><div className="text-xl font-bold">{fmt(payrollSummary.avgSalary)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Benefits</div><div className="text-xl font-bold text-green-600">{fmt(payrollSummary.benefits)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Taxes & Withholding</div><div className="text-xl font-bold text-amber-600">{fmt(payrollSummary.taxes)}</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">By Department</h3>
          <div className="space-y-3">
            {deptPayroll.map((d) => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{d.dept}</span>
                  <span className="text-muted-foreground">{fmt(d.amount)} ({d.pct}%)</span>
                </div>
                <Progress value={d.pct} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Performance View ─── */
const reviews = [
  { name: "Ravi Kumar", cycle: "H2 2025", rating: "Exceeds", score: 4.5, areas: "Technical depth, mentoring", growth: "Leadership track" },
  { name: "Sarah Kim", cycle: "H2 2025", rating: "Exceeds", score: 4.3, areas: "Strategy, cross-functional", growth: "Sr PM → Director" },
  { name: "Mike Rodriguez", cycle: "H2 2025", rating: "Meets+", score: 3.8, areas: "Deal execution, pipeline mgmt", growth: "Enterprise focus" },
  { name: "Priya Mehta", cycle: "H2 2025", rating: "Meets", score: 3.5, areas: "UI/UX quality, testing", growth: "Sr Frontend → Staff" },
  { name: "Jake Liu", cycle: "H2 2025", rating: "Developing", score: 2.8, areas: "Documentation, process", growth: "PIP — coaching plan" },
]
const ratingColors: Record<string, string> = { Exceeds: "text-green-600", "Meets+": "text-blue-600", Meets: "text-foreground", Developing: "text-amber-600" }

export function PerformanceView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Performance Reviews</h2>
        <Button size="sm"><Award className="w-3.5 h-3.5 mr-1.5" /> New Cycle</Button>
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        <Card><CardContent className="p-3"><div className="text-lg font-bold text-green-600">18%</div><div className="text-[9px] text-muted-foreground">Exceeds</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-lg font-bold text-blue-600">64%</div><div className="text-[9px] text-muted-foreground">Meets/Meets+</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-lg font-bold text-amber-600">14%</div><div className="text-[9px] text-muted-foreground">Developing</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-lg font-bold text-red-600">4%</div><div className="text-[9px] text-muted-foreground">Below</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {reviews.map((r) => (
              <div key={r.name} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">{r.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.cycle}</div>
                  </div>
                  <span className={`text-xs font-semibold ${ratingColors[r.rating]}`}>{r.rating}</span>
                  <Badge variant="outline" className="text-[9px]">{r.score}/5</Badge>
                </div>
                <div className="ml-11 mt-1 text-[10px] text-muted-foreground">
                  Strengths: {r.areas} · Growth: {r.growth}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
