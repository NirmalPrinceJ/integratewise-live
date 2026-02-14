import React from "react";
import { motion } from "motion/react";
import { Users, Target, TrendingUp, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { TeamCollaborationInfographic } from "./infographics";

export function Audience() {
  const workspaces = [
    {
      title: "Customer Success",
      quote: "Account health, renewals, risks, interventions — all in one place. Stop rebuilding context before every call.",
      focus: "Proactive retention and expansion",
      icon: <Users className="w-8 h-8" />,
      color: "bg-[#059669]"
    },
    {
      title: "Sales",
      quote: "Pipeline, deal context, account prep, follow-ups. Your CRM shows what happened. IntegrateWise shows what's happening now.",
      focus: "Real-time deal intelligence",
      icon: <Target className="w-8 h-8" />,
      color: "bg-[#059669]"
    },
    {
      title: "Finance & RevOps",
      quote: "Revenue health, subscriptions, billing risk — unified. No more manual reconciliation between Stripe and Salesforce.",
      focus: "Revenue intelligence without spreadsheets",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-[#8B5CF6]"
    },
    {
      title: "Operations",
      quote: "Projects, tasks, blockers, execution context. The workspace updates itself so you can focus on the work, not the plumbing.",
      focus: "Workflow intelligence and capacity",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-gray-800"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-gray-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight uppercase font-['Plus_Jakarta_Sans']">Where Work Actually Happens</h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            IntegrateWise isn't a background sync tool. It's where teams work. Intelligence surfaces wherever you are — with evidence and approval gates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Progressive Growth */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-widest font-['Plus_Jakarta_Sans']">
              <span className="w-2.5 h-10 bg-[#059669] rounded-full" />
              Progressive growth
            </h3>
            <p className="text-white/70 text-lg mb-10 leading-relaxed font-medium">
              You start simple, and capability unlocks as data becomes ready. No massive setup. No feature overload.
            </p>
            <ul className="space-y-6 mb-16">
              {[
                "Basic workspace — start working immediately",
                "Docs + AI conversations — searchable memory",
                "Tool sync + context linking — unified view",
                "Scores + insights — intelligence surfaces",
                "Suggested workflows + approvals — effortless work"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-6 group">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <span className="text-white/80 text-lg font-medium leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            {/* Outcome card */}
            <div className="bg-white/[0.05] backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl" />
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3 font-['JetBrains_Mono']">WITHIN WEEKS</div>
                <div className="h-1 w-24 bg-[#059669] rounded-full" />
              </div>
              <div className="space-y-6">
                {[
                  { label: "Information finds you", stat: "instead of chasing it" },
                  { label: "AI chats become reusable knowledge", stat: "not lost conversations" },
                  { label: "Decisions become faster", stat: "with evidence behind them" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-white/80 font-bold">{item.label}</span>
                    <span className="text-[#10B981] text-sm font-black">{item.stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Workspace cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-black mb-4 flex items-center gap-4 uppercase tracking-widest font-['Plus_Jakarta_Sans']">
              <span className="w-2.5 h-10 bg-[#059669] rounded-full" />
              Workspaces for every team
            </h3>
            <div className="space-y-6">
              {workspaces.map((ws, i) => (
                <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] hover:bg-white/[0.07] hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`w-16 h-16 ${ws.color} rounded-2xl text-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10`}>
                      {ws.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-xl tracking-tight font-['Plus_Jakarta_Sans']">{ws.title}</h4>
                      <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1 font-['JetBrains_Mono']">{ws.focus}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-lg leading-relaxed font-medium">{ws.quote}</p>
                </div>
              ))}
            </div>

            {/* Intelligence callout */}
            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
              <div className="text-[10px] font-bold text-[#10B981] mb-3 flex items-center gap-3 uppercase tracking-widest font-['JetBrains_Mono']">
                <Zap className="w-4 h-4 fill-current" /> INTELLIGENCE INSIDE EVERY PAGE
              </div>
              <p className="text-white/70 font-medium text-sm leading-relaxed">
                Wherever you are, you see what changed recently, what matters next, why the system thinks so, and what action is recommended — approval-gated.
              </p>
            </div>

            {/* Visual with intelligence context */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg h-48">
              <TeamCollaborationInfographic className="w-full h-full object-cover opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}