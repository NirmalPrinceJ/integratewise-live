import React from "react";
import { ArrowRight, MessageSquare, Database, FileSearch, Zap, ShieldCheck, Brain } from "lucide-react";
import { motion } from "motion/react";

export function Differentiators() {
  const items = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Conversations Become Memory",
      desc: "Chats from ChatGPT, Claude, Gemini captured, organized, and linked to customers and projects. Insights resurface when relevant."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Becomes Intelligence",
      desc: "Cross-tool pattern detection: churn risk, expansion signals, delivery blockers — with reasoning and sources behind every recommendation."
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: "Documents Produce Outcomes",
      desc: "Key insights extracted automatically and surfaced at the right moment. Documents stop being storage and become leverage."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Plumbing Stops",
      desc: "Intelligent import with relationship preservation, automatic deduplication, and structured models. No more copy/paste across apps."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "You Stay in Control",
      desc: "Every recommendation includes why, what sources, and what changes. Every action is approval-gated, role-scoped, and fully auditable."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "The System Learns",
      desc: "Every approval or rejection teaches IntegrateWise. Over time, your team builds an institutional brain of reusable intelligence."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F3F4F6]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] mb-8 tracking-tight uppercase">What You Get with IntegrateWise</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Not another tool to manage. A workspace that eliminates the fragmentation tax and turns your existing work into compounding intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[32px] border border-slate-100 bg-white hover:shadow-2xl hover:border-transparent transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-[#3F5185]/5 text-[#3F5185] flex items-center justify-center mb-8 group-hover:bg-[#3F5185] group-hover:text-white transition-all shadow-inner group-hover:shadow-2xl">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-[#1E2A4A] mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">This is the difference between integration and integration intelligence.</p>
          <button
            onClick={() => window.location.hash = "technical"}
            className="inline-flex items-center gap-3 text-[#3F5185] font-black uppercase tracking-widest text-sm hover:gap-6 transition-all group"
          >
            EXPLORE THE ARCHITECTURE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
