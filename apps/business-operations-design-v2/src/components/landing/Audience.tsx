import React from "react";
import { CheckCircle2, UserCheck, Briefcase, BarChart3, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";

export function Audience() {
  const workspaces = [
    {
      title: "Customer Success",
      quote: "Account health, renewals, risks, interventions — all in one place. Stop rebuilding context before every call.",
      focus: "Proactive retention and expansion",
      icon: <UserCheck className="w-8 h-8" />,
      color: "bg-[#0EA0EA5E9E9]"
    },
    {
      title: "Sales",
      quote: "Pipeline, deal context, account prep, follow-ups. Your CRM shows what happened. IntegrateWise shows what's happening now.",
      focus: "Real-time deal intelligence",
      icon: <Briefcase className="w-8 h-8" />,
      color: "bg-[#0EA0EA5E9E9]"
    },
    {
      title: "Finance & RevOps",
      quote: "Revenue health, subscriptions, billing risk — unified. No more manual reconciliation between Stripe and Salesforce.",
      focus: "Revenue intelligence without spreadsheets",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-[#F54476]"
    },
    {
      title: "Operations",
      quote: "Projects, tasks, blockers, execution context. The workspace updates itself so you can focus on the work, not the plumbing.",
      focus: "Workflow intelligence and capacity",
      icon: <Settings className="w-8 h-8" />,
      color: "bg-[#0C0C122222]"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0C0C122222] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0EA0EA5E9E9] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F54476] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight uppercase">Where Work Actually Happens</h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
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
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-widest">
              <span className="w-2.5 h-10 bg-[#F54476] rounded-full shadow-[0_0_20px_#F54476]" />
              Progressive growth
            </h3>
            <p className="text-white/60 text-lg mb-10 leading-relaxed font-medium">
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
                  <div className="w-8 h-8 rounded-full bg-[#F54476]/20 border border-[#F54476]/40 flex items-center justify-center shrink-0 group-hover:bg-[#F54476]/30 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#F54476]" />
                  </div>
                  <span className="text-white/80 text-lg font-medium leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            {/* Outcome card */}
            <div className="bg-white/[0.05] backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F54476]/20 to-transparent blur-2xl" />
              <div className="mb-8">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">WITHIN WEEKS</div>
                <div className="h-1 w-24 bg-[#F54476] rounded-full shadow-[0_0_15px_#F54476]" />
              </div>
              <div className="space-y-6">
                {[
                  { label: "Information finds you", stat: "instead of chasing it" },
                  { label: "AI chats become reusable knowledge", stat: "not lost conversations" },
                  { label: "Decisions become faster", stat: "with evidence behind them" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-white/80 font-bold">{item.label}</span>
                    <span className="text-[#F54476] text-sm font-black">{item.stat}</span>
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
            <h3 className="text-2xl font-black mb-4 flex items-center gap-4 uppercase tracking-widest">
              <span className="w-2.5 h-10 bg-[#14B4B8A6A6] rounded-full shadow-[0_0_20px_#14B4B8A6A6]" />
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
                      <h4 className="font-black text-xl tracking-tight">{ws.title}</h4>
                      <p className="text-xs text-white/40 font-black uppercase tracking-widest mt-1">{ws.focus}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-lg leading-relaxed font-medium">{ws.quote}</p>
                </div>
              ))}
            </div>

            {/* Intelligence callout */}
            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
              <div className="text-[10px] font-black text-[#F54476] mb-3 flex items-center gap-3 uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-current" /> INTELLIGENCE INSIDE EVERY PAGE
              </div>
              <p className="text-white/60 font-medium text-sm leading-relaxed">
                Wherever you are, you see what changed recently, what matters next, why the system thinks so, and what action is recommended — approval-gated.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}