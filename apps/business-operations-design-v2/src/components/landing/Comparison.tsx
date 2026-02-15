import React from "react";
import { X, Check } from "lucide-react";
import { motion } from "motion/react";

export function Comparison() {
  const columns = [
    {
      title: "Automation Tools",
      subtitle: "(Zapier, Make, n8n)",
      points: [
        { text: "Move data A\u2192B", check: true },
        { text: "Intelligence", check: false },
        { text: "Workspace", check: false },
        { text: "AI Memory", check: false }
      ]
    },
    {
      title: "CRMs",
      subtitle: "(Salesforce, HubSpot)",
      points: [
        { text: "Store records", check: true },
        { text: "Real-time context", check: false },
        { text: "Cross-tool view", check: false },
        { text: "Document intelligence", check: false }
      ]
    },
    {
      title: "AI-Native Apps",
      subtitle: "(Newer Agents)",
      points: [
        { text: "Task completion", check: true },
        { text: "Human control", check: false },
        { text: "Persistent memory", check: false },
        { text: "Work preservation", check: false }
      ]
    },
    {
      title: "IntegrateWise",
      subtitle: "(The Difference)",
      highlight: true,
      points: [
        { text: "Preserved work layer", check: true },
        { text: "Background intelligence", check: true },
        { text: "Human approvals", check: true },
        { text: "Continuous learning", check: true }
      ]
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] tracking-tight uppercase leading-[1.1]">
            Others Move Data.<br />
            <span className="text-[#F54476]">IntegrateWise Creates Understanding.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 md:border md:border-slate-100 rounded-[40px] overflow-hidden bg-white shadow-[0_40px_80px_-20px_rgba(30,42,74,0.1)]">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 md:p-12 flex flex-col ${col.highlight ? 'bg-[#1E2A4A] text-white z-10 md:-my-4 md:rounded-[40px] shadow-2xl relative' : 'bg-white text-slate-800'}`}
            >
              {col.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#F54476] rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg">
                  DIFFERENT BY DESIGN
                </div>
              )}
              <div className="mb-12">
                <h3 className="text-2xl font-black mb-2 tracking-tight">{col.title}</h3>
                <p className={`text-sm font-bold ${col.highlight ? 'text-white/40' : 'text-slate-400'} uppercase tracking-widest`}>{col.subtitle}</p>
              </div>
              <ul className="space-y-8 flex-1">
                {col.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-4 group">
                    <div className="shrink-0 mt-1">
                      {p.check ? (
                        <Check className={`w-6 h-6 ${col.highlight ? 'text-[#F54476]' : 'text-[#3F5185]'}`} />
                      ) : (
                        <X className={`w-6 h-6 ${col.highlight ? 'text-white/10' : 'text-slate-200'}`} />
                      )}
                    </div>
                    <span className={`text-base font-bold leading-tight ${col.highlight ? 'text-white/80' : 'text-slate-600'}`}>{p.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-8 border-t border-current/10">
                <button
                  onClick={() => window.location.hash = col.highlight ? "app" : "differentiators"}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${col.highlight ? 'bg-[#F54476] hover:bg-[#E03A66] text-white shadow-xl shadow-[#F54476]/20' : 'bg-slate-50 hover:bg-slate-100 text-[#1E2A4A]'}`}
                >
                  {col.highlight ? 'Get Started' : 'Learn More'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
