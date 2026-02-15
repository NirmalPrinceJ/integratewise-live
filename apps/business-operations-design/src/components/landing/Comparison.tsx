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
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight uppercase leading-[1.1] font-['Plus_Jakarta_Sans']">
            Others Move Data.<br />
            <span className="text-[#047857]">IntegrateWise Creates Understanding.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 md:border md:border-gray-200 rounded-[40px] overflow-hidden bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 md:p-12 flex flex-col ${col.highlight ? 'bg-gray-900 text-white z-10 md:-my-4 md:rounded-[40px] shadow-2xl relative' : 'bg-white text-gray-800'}`}
            >
              {col.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#059669] rounded-full text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg font-['Plus_Jakarta_Sans']">
                  DIFFERENT BY DESIGN
                </div>
              )}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-2 tracking-tight font-['Plus_Jakarta_Sans']">{col.title}</h3>
                <p className={`text-sm font-bold ${col.highlight ? 'text-white/50' : 'text-gray-500'} uppercase tracking-widest`}>{col.subtitle}</p>
              </div>
              <ul className="space-y-8 flex-1">
                {col.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-4 group">
                    <div className="shrink-0 mt-1">
                      {p.check ? (
                        <Check className={`w-6 h-6 ${col.highlight ? 'text-[#10B981]' : 'text-[#059669]'}`} />
                      ) : (
                        <X className={`w-6 h-6 ${col.highlight ? 'text-white/10' : 'text-gray-200'}`} />
                      )}
                    </div>
                    <span className={`text-base font-bold leading-tight ${col.highlight ? 'text-white/80' : 'text-gray-600'}`}>{p.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-8 border-t border-current/10">
                <button
                  onClick={() => window.location.hash = col.highlight ? "app" : "differentiators"}
                  className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all font-['Plus_Jakarta_Sans'] min-h-[48px] ${col.highlight ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-xl' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
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