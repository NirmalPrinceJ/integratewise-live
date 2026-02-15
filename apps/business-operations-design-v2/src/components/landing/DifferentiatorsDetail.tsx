import React from "react";
import { motion } from "motion/react";

export function DifferentiatorsDetail() {
  const diffs = [
    { title: "Five-Layer Architecture", desc: "A strict 5-layer cognitive stack — Connect, Context, Cognition, Action, Memory — ensuring data integrity from raw event to executive insight." },
    { title: "Canonical Spine", desc: "A single source of truth for entities like 'Account' and 'User' that persists across all tool changes with 99.4% match accuracy." },
    { title: "Intelligence Overlay", desc: "A governed AI layer that reasons across tools but requires human sign-off before acting. No autonomous execution." },
    { title: "Dual-Context Alignment", desc: "Every metric must serve both vendor growth (NRR, pipeline) and client outcomes (ROI, satisfaction) simultaneously." },
    { title: "Edge Correction Library", desc: "A cumulative moat of human corrections that makes the AI smarter every day — your team teaches the system." },
    { title: "MCP-Native Design", desc: "Built to be discovered and used by AI agents using the Model Context Protocol — future-proof by design." },
    { title: "Self-Healing Schemas", desc: "AI detects when an upstream API changes and automatically suggests a mapping fix — no manual intervention needed." },
    { title: "Work Preservation Layer", desc: "Intelligence is delivered into existing tools (Slack, Salesforce) so your team's workflows never break." },
    { title: "Truth-Spine Linkage", desc: "Deterministic linking of disparate tool IDs into a single canonical record — cross-tool entity resolution at scale." },
    { title: "Semantic Context Graph", desc: "Captures unstructured data from calls and tickets to enrich structured records with qualitative insight." },
    { title: "Governance Guardrails", desc: "Strict policies that prevent AI from making unsupported updates. Every action has evidence and approval." },
    { title: "Expansion Signal Detection", desc: "Proprietary models that detect upsell and expansion opportunities before the customer asks — from usage patterns." },
    { title: "Outcome-Driven Logic", desc: "Focuses on 'What did the customer achieve?' rather than 'What did they click?' — true outcome intelligence." },
    { title: "Integration Agnostic", desc: "Swap a CRM or Billing tool without losing a decade of historical context — the Spine transcends any single tool." },
    { title: "High-Fidelity Eventing", desc: "Real-time processing of tool events at 1,247+ per minute with zero-loss deduplication and full provenance." },
    { title: "Federated Intelligence", desc: "Learns cross-tool patterns from thousands of teams while keeping every organization's data strictly private." },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F3F4F6]/30 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-black text-[#1E2A4A] mb-6 uppercase tracking-tight">The 16 Pillars of Integration Intelligence</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Why we are fundamentally different from iPaaS tools and AI bolt-ons. IntegrateWise is a new operating system category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {diffs.map((diff, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.05 }}
               className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
             >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-[#3F5185]/10 text-[#3F5185] flex items-center justify-center font-black text-sm group-hover:bg-[#3F5185] group-hover:text-white transition-all shadow-inner">
                      {String(i + 1).padStart(2, '0')}
                   </div>
                   <h3 className="font-black text-[#1E2A4A] text-sm uppercase tracking-tight leading-tight">{diff.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{diff.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
