"use client"

/**
 * People / HR Dashboard — Headcount, recruiting pipeline, engagement, performance, org health.
 */

import {
  Users, UserPlus, Heart, TrendingUp, Award, Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const headcount = { total: 148, engineering: 52, product: 18, sales: 28, cs: 22, marketing: 14, ops: 8, hr: 6 }
const openRoles = [
  { title: "Senior Backend Engineer", dept: "Engineering", stage: "Interviewing", applicants: 34, daysOpen: 18 },
  { title: "Product Designer", dept: "Product", stage: "Screening", applicants: 56, daysOpen: 7 },
  { title: "Enterprise AE", dept: "Sales", stage: "Final Round", applicants: 12, daysOpen: 32 },
  { title: "Data Analyst", dept: "Ops", stage: "Offer Sent", applicants: 28, daysOpen: 25 },
  { title: "CSM — Enterprise", dept: "CS", stage: "Sourcing", applicants: 8, daysOpen: 3 },
]

const engagementScore = 82
const recentSurvey = { participation: 91, topStrength: "Team collaboration", topConcern: "Career growth clarity", nps: 42 }

const performanceDist = [
  { label: "Exceeds", pct: 18, color: "bg-green-500" },
  { label: "Meets", pct: 64, color: "bg-blue-500" },
  { label: "Developing", pct: 14, color: "bg-amber-500" },
  { label: "Below", pct: 4, color: "bg-red-500" },
]

const upcomingEvents = [
  { name: "All-Hands Q1 Kickoff", date: "Feb 14", type: "company" },
  { name: "Eng Team Offsite", date: "Feb 20-21", type: "team" },
  { name: "Performance Reviews Due", date: "Feb 28", type: "hr" },
  { name: "Benefits Enrollment Close", date: "Mar 1", type: "hr" },
]

const attrition = { last90days: 3, annualized: 8.1, avgTenure: "2.4y" }

const stageColors: Record<string, string> = {
  Sourcing: "text-muted-foreground",
  Screening: "text-blue-600",
  Interviewing: "text-purple-600",
  "Final Round": "text-amber-600",
  "Offer Sent": "text-green-600",
}

export function PeopleDashboard() {
  const deptEntries = Object.entries(headcount).filter(([k]) => k !== "total")
  const maxDept = Math.max(...deptEntries.map(([, v]) => v))

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Headcount" value={headcount.total.toString()} sub={`${openRoles.length} open roles`} icon={<Users className="w-4 h-4" />} accent="text-blue-600" />
        <KPI title="Engagement Score" value={`${engagementScore}%`} sub={`eNPS ${recentSurvey.nps}`} icon={<Heart className="w-4 h-4" />} accent="text-pink-600" />
        <KPI title="Attrition (ann.)" value={`${attrition.annualized}%`} sub={`${attrition.last90days} departures (90d)`} icon={<TrendingUp className="w-4 h-4" />} accent="text-amber-600" />
        <KPI title="Avg Tenure" value={attrition.avgTenure} sub="across all depts" icon={<Clock className="w-4 h-4" />} accent="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Org Composition */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Org Composition</h3>
            <div className="space-y-2">
              {deptEntries.map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-20 capitalize">{dept}</span>
                  <div className="flex-1 bg-muted/50 rounded-full h-3">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(count / maxDept) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Performance Distribution</h3>
            <div className="flex items-end gap-3 h-32 mb-2">
              {performanceDist.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold">{d.pct}%</span>
                  <div className={`w-full rounded-t ${d.color}`} style={{ height: `${(d.pct / 70) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 rounded bg-muted/50 text-[10px] text-muted-foreground">
              <Award className="w-3 h-3 inline mr-1" /> Last review cycle: 92% completion rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Open Roles */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Open Roles ({openRoles.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] text-muted-foreground border-b">
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium text-right">Applicants</th>
                  <th className="pb-2 font-medium text-right">Days Open</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {openRoles.map((r) => (
                  <tr key={r.title} className="hover:bg-muted/50 transition-colors">
                    <td className="py-2 font-medium">{r.title}</td>
                    <td className="py-2 text-muted-foreground">{r.dept}</td>
                    <td className="py-2"><span className={`font-medium ${stageColors[r.stage] || ""}`}>{r.stage}</span></td>
                    <td className="py-2 text-right">{r.applicants}</td>
                    <td className="py-2 text-right">{r.daysOpen}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Latest Pulse Survey</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-lg font-bold">{engagementScore}%</span>
              </div>
              <div className="text-xs space-y-1">
                <div><span className="text-muted-foreground">Participation:</span> <span className="font-medium">{recentSurvey.participation}%</span></div>
                <div><span className="text-muted-foreground">eNPS:</span> <span className="font-medium">{recentSurvey.nps}</span></div>
              </div>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-2 p-1.5 rounded bg-green-500/5"><span className="text-green-600 font-medium">Strength:</span> {recentSurvey.topStrength}</div>
              <div className="flex items-center gap-2 p-1.5 rounded bg-amber-500/5"><span className="text-amber-600 font-medium">Concern:</span> {recentSurvey.topConcern}</div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.map((e) => (
                <div key={e.name} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                  <UserPlus className={`w-3.5 h-3.5 flex-shrink-0 ${e.type === "hr" ? "text-pink-500" : e.type === "company" ? "text-blue-500" : "text-purple-500"}`} />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{e.name}</div>
                    <div className="text-[10px] text-muted-foreground">{e.date}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px]">{e.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPI({ title, value, sub, icon, accent }: { title: string; value: string; sub: string; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{title}</span>
          <div className={accent}>{icon}</div>
        </div>
        <div className={`text-xl font-semibold ${accent}`}>{value}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  )
}
