"use client"

/**
 * SalesOps Dashboard — Pipeline kanban, activity feed, rep leaderboard, key contacts.
 * Ported from Figma Design salesops/dashboard.tsx → shadcn/ui tokens + inline data (no recharts).
 */

import { DollarSign, Phone, Mail, Calendar, Users, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

/* ─── Inline Mock Data ─── */
const deals = [
  { id: 1, name: "TechServe Analytics Suite", accountName: "TechServe India", stage: "prospect", amount: 240000, probability: 30, owner: { initials: "PS" } },
  { id: 2, name: "CloudBridge SOC2 Module", accountName: "CloudBridge APAC", stage: "proposal", amount: 180000, probability: 65, owner: { initials: "VR" } },
  { id: 3, name: "RetailNow Global Expansion", accountName: "RetailNow Global", stage: "negotiate", amount: 520000, probability: 80, owner: { initials: "PS" } },
  { id: 4, name: "HealthTech Recovery Plan", accountName: "HealthTech Solutions", stage: "qualify", amount: 96000, probability: 40, owner: { initials: "AP" } },
  { id: 5, name: "EduPlatform Onboarding", accountName: "EduPlatform Asia", stage: "prospect", amount: 48000, probability: 20, owner: { initials: "DJ" } },
  { id: 6, name: "CloudBridge Data Residency", accountName: "CloudBridge APAC", stage: "qualify", amount: 150000, probability: 55, owner: { initials: "VR" } },
  { id: 7, name: "RetailNow BI Dashboard", accountName: "RetailNow Global", stage: "proposal", amount: 110000, probability: 70, owner: { initials: "AP" } },
]

const contacts = [
  { id: 1, name: "Ravi Sharma", title: "CTO", accountName: "TechServe India", leadScore: 85 },
  { id: 2, name: "Li Wei", title: "VP Engineering", accountName: "CloudBridge APAC", leadScore: 92 },
  { id: 3, name: "James Tan", title: "COO", accountName: "RetailNow Global", leadScore: 78 },
  { id: 4, name: "Arjun Nair", title: "Head of Product", accountName: "EduPlatform Asia", leadScore: 45 },
  { id: 5, name: "Dr. Meena Rao", title: "CEO", accountName: "HealthTech Solutions", leadScore: 62 },
]

const leaderboard = [
  { name: "Priya S.", initials: "PS", deals: 8, revenue: 460000 },
  { name: "Vikram R.", initials: "VR", deals: 6, revenue: 330000 },
  { name: "Anjali P.", initials: "AP", deals: 5, revenue: 280000 },
  { name: "Deepak J.", initials: "DJ", deals: 4, revenue: 150000 },
]

const activityDays = [
  { day: "Mon", calls: 12, emails: 18, meetings: 3 },
  { day: "Tue", calls: 8, emails: 22, meetings: 5 },
  { day: "Wed", calls: 15, emails: 14, meetings: 2 },
  { day: "Thu", calls: 10, emails: 20, meetings: 4 },
  { day: "Fri", calls: 6, emails: 16, meetings: 6 },
]

const stages = [
  { id: "prospect", label: "Prospect", color: "bg-blue-500" },
  { id: "qualify", label: "Qualify", color: "bg-purple-500" },
  { id: "proposal", label: "Proposal", color: "bg-amber-500" },
  { id: "negotiate", label: "Negotiate", color: "bg-pink-500" },
]

export function SalesOpsDashboard() {
  const openDeals = deals.filter((d) => !["closed-won", "closed-lost"].includes(d.stage))
  const closingSoon = deals.filter((d) => d.probability >= 70)
  const totalPipeline = openDeals.reduce((s, d) => s + d.amount, 0)
  const maxActivity = Math.max(...activityDays.flatMap((d) => [d.calls, d.emails, d.meetings]))

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickStat icon={<DollarSign className="w-4 h-4" />} label="Pipeline" value={`$${(totalPipeline / 1000).toFixed(0)}K`} accent="text-emerald-600" />
        <QuickStat icon={<Clock className="w-4 h-4" />} label="Closing Soon" value={closingSoon.length.toString()} accent="text-amber-600" />
        <QuickStat icon={<Users className="w-4 h-4" />} label="Contacts" value={contacts.length.toString()} accent="text-blue-600" />
        <QuickStat icon={<TrendingUp className="w-4 h-4" />} label="Win Rate" value="62%" accent="text-purple-600" />
      </div>

      {/* Pipeline Kanban */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Pipeline</h3>
            <span className="text-xs text-muted-foreground">{openDeals.length} open deals</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.id)
              const stageTotal = stageDeals.reduce((s, d) => s + d.amount, 0)
              return (
                <div key={stage.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="text-xs font-semibold">{stage.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">${(stageTotal / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map((deal) => (
                      <Card key={deal.id} className="hover:shadow-sm transition-all cursor-pointer">
                        <CardContent className="p-2">
                          <div className="text-xs font-medium truncate">{deal.name}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-muted-foreground">{deal.accountName}</span>
                            <span className="text-[10px] font-semibold">${(deal.amount / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[7px] font-bold">{deal.owner.initials}</div>
                            <span className="text-[9px] text-muted-foreground">{deal.probability}% prob</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-4 text-[10px] text-muted-foreground">No deals</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart (CSS-only bars instead of recharts) */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">This Week&apos;s Activity</h3>
              <div className="flex gap-3 text-[10px]">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-500" /> Calls</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-500" /> Emails</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-500" /> Meetings</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-36">
              {activityDays.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex gap-0.5 items-end h-28">
                    <div className="flex-1 rounded-t bg-emerald-500" style={{ height: `${(d.calls / maxActivity) * 100}%` }} />
                    <div className="flex-1 rounded-t bg-blue-500" style={{ height: `${(d.emails / maxActivity) * 100}%` }} />
                    <div className="flex-1 rounded-t bg-purple-500" style={{ height: `${(d.meetings / maxActivity) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Contacts */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Key Contacts</h3>
              <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.title} · {c.accountName}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${c.leadScore >= 80 ? "text-green-600" : c.leadScore >= 60 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {c.leadScore}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rep Leaderboard */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Team Leaderboard</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {leaderboard.map((rep, i) => {
              const medals = ["🥇", "🥈", "🥉"]
              return (
                <div
                  key={rep.name}
                  className={`p-3 rounded-lg text-center ${i === 0 ? "bg-amber-500/5 border border-amber-500/20" : "bg-muted/50"}`}
                >
                  <div className="text-xl mb-1">{medals[i] || `#${i + 1}`}</div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mx-auto mb-2">
                    {rep.initials}
                  </div>
                  <div className="text-sm font-semibold">{rep.name}</div>
                  <div className="text-xs text-muted-foreground">{rep.deals} deals</div>
                  <div className="text-sm font-semibold text-emerald-600 mt-1">${(rep.revenue / 1000).toFixed(0)}K</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={accent}>{icon}</div>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
        <div className={`text-lg font-semibold ${accent}`}>{value}</div>
      </CardContent>
    </Card>
  )
}
