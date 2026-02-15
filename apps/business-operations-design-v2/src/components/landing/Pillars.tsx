import React from "react";
import { Database, Layers, BrainCircuit, ShieldCheck, Layout, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "./logo";

function WhatItBuilds() {
  const layers = [
    {
      number: "01",
      label: "Truth (SSOT)",
      desc: "Clean, deduplicated, structured records",
      icon: <Database className="w-4 h-4" />,
      color: "bg-[#1E2A4A]",
      items: ["Accounts", "Contacts", "Deals", "Tickets", "Subscriptions"]
    },
    {
      number: "02",
      label: "Context",
      desc: "Conversations, documents, and history — preserved with provenance",
      icon: <Layers className="w-4 h-4" />,
      color: "bg-[#3F5185]",
      items: ["Slack Threads", "Emails", "Docs", "AI Chats", "Meeting Notes"]
    },
    {
      number: "03",
      label: "Intelligence",
      desc: "Patterns across tools: churn risk, expansion signals, blockers — with evidence",
      icon: <BrainCircuit className="w-4 h-4" />,
      color: "bg-[#F54476]",
      items: ["Risk Detection", "Expansion Signals", "Next Actions", "Scoring"]
    },
    {
      number: "04",
      label: "Control",
      desc: "AI proposes. Humans approve. Everything is auditable.",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "bg-[#3F5185]",
      items: ["Approval Gates", "RBAC", "Audit Trail", "Evidence"]
    },
  ];

  return (
    <div className="bg-[#1E2A4A] rounded-[40px] p-8 md:p-10 text-white shadow-2xl shadow-[#1E2A4A]/40 border border-white/5">
      <div className="flex items-center gap-3 mb-10">
        <Logo width={32} />
        <span className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">INTELLIGENCE LAYER</span>
      </div>
      <div className="space-y-3">
        {layers.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all">
              <div className={`w-10 h-10 ${l.color} rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg border border-white/10`}>
                {l.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">{l.number}</span>
                  <span className="text-sm font-black tracking-tight">{l.label}</span>
                </div>
                <p className="text-[11px] text-white/40 mb-3 font-medium">{l.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {l.items.map((item, j) => (
                    <span key={j} className="text-[9px] px-2 py-1 rounded-md bg-white/5 text-white/30 font-bold uppercase tracking-wider border border-white/5">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-px h-4 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Pillars() {
  const pillars = [
    {
      icon: <Layout className="w-10 h-10 text-[#3F5185]" />,
      title: "Doesn't Replace Your Tools",
      description: "IntegrateWise connects your existing tools and runs in the background. Your team keeps working the way they already do — the workspace just gets smarter.",
      color: "border-[#3F5185]/10 hover:bg-[#3F5185]/5 hover:border-[#3F5185]/30"
    },
    {
      icon: <Sparkles className="w-10 h-10 text-[#3F5185]" />,
      title: "Preserves Your Thinking",
      description: "AI conversations, documents, meeting notes, and decisions are captured, linked to projects and customers, and resurfaced when you need them.",
      color: "border-[#3F5185]/10 hover:bg-[#3F5185]/5 hover:border-[#3F5185]/30"
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#F54476]" />,
      title: "Keeps Humans in Control",
      description: "AI suggests. You decide. Every recommendation includes why it was made, what sources it used, and what will change if executed. Every action is approval-gated and auditable.",
      color: "border-[#F54476]/10 hover:bg-[#F54476]/5 hover:border-[#F54476]/30"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F3F4F6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] leading-[1.1] mb-8 tracking-tight uppercase">A Workspace That Understands Your Work</h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
            IntegrateWise is a workspace that brings your fragments together — empowered by AI that continuously turns them into usable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Pillar Cards */}
          <div className="space-y-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 md:p-10 rounded-[32px] bg-white border ${pillar.color} shadow-sm hover:shadow-2xl transition-all group text-left cursor-default`}
              >
                <div className="flex items-start gap-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#1E2A4A] mb-4 tracking-tight">{pillar.title}</h3>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">{pillar.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What It Builds Diagram */}
          <div className="lg:sticky lg:top-32">
            <WhatItBuilds />
          </div>
        </div>
      </div>
    </section>
  );
}