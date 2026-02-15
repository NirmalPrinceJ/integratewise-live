"use client"

import { usePathname } from "next/navigation"
import { Card, DashboardLayout, MetricCard } from "@/components/layouts/page-layouts"
import { Activity, Brain, Database, Zap, Sparkles, Shield, Eye } from "lucide-react"

export function ViewStub({ view, page }: { view: string; page: string }) {
  const pathname = usePathname()

  // Dynamic icons based on page name
  const getIcon = () => {
    const p = page.toLowerCase()
    if (p.includes("spine")) return Database
    if (p.includes("context")) return Database
    if (p.includes("iq")) return Brain
    if (p.includes("agent")) return Sparkles
    if (p.includes("audit") || p.includes("govern") || p.includes("polic")) return Shield
    if (p.includes("evidence")) return Eye
    if (p.includes("workflow") || p.includes("auto")) return Zap
    return Activity
  }

  const Icon = getIcon()

  return (
    <DashboardLayout
      title={page}
      description={`Advanced ${page.toLowerCase()} management for the ${view} department.`}
      stageId={`${view.toUpperCase().substring(0, 3)}-${page.toUpperCase().substring(0, 3)}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Health Score" value="98%" icon={Activity} />
        <MetricCard title="Active Signals" value="12" icon={Zap} />
        <MetricCard title="Data Sync" value="Live" icon={Database} primary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Cognitive Layer: {page}</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            The chaos ends here. IntegrateWise absorbs the noise and forces every tool and every AI to work as one unified system.
            This {page.toLowerCase()} surface provides a deep-dive into the {view.toLowerCase()} perspective of the OS.
          </p>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">Route Status</p>
            <p className="text-xs font-mono text-slate-600">{pathname} is now live and wired into the Shell.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Upcoming Updates</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-1.5 w-full mt-1.5 bg-slate-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
