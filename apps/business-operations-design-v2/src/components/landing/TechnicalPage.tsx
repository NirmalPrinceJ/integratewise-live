import React from "react";
import { motion } from "motion/react";
import { Repeat, ShieldCheck, Database, LayoutPanelTop, Search, BrainCircuit, Activity, Zap, Brain, FileText, CheckCircle, Briefcase, Cpu } from "lucide-react";
import { DifferentiatorsDetail } from "./DifferentiatorsDetail";
import brandSpecImage from "figma:asset/a76fd4f119a6c6a979f0bd213fd10e1d85edd796.png";
import { Logo } from "./logo";

export function TechnicalPage() {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Above the fold */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-6xl font-black text-[#1E2A4A] mb-6 md:mb-8 uppercase tracking-tight"
          >
            Under the hood: An OS for <br className="hidden md:block" />
            <span className="text-[#F54476]">Integration Intelligence</span>
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium uppercase tracking-wide">
            FROM RAW EVENTS TO GROWTH-ALIGNED INSIGHTS — WITH HUMANS IN THE LOOP AT EVERY STEP. A WORKSPACE EMPOWERED BY AI, BUILT ON A STRICT ARCHITECTURE.
          </p>
          <button
            onClick={() => { window.location.hash = "app"; }}
            className="inline-flex items-center gap-3 bg-[#3F5185] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:shadow-2xl transition-all shadow-[#3F5185]/20"
          >
            <Zap className="w-5 h-5" /> Launch the workspace
          </button>
        </div>

        {/* Brand & Architecture Spec Image */}
        <section className="mb-20 md:mb-32">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 p-2 md:p-4 bg-[#F3F4F6]">
            <img src={brandSpecImage} alt="Beyond Integration: The IntegrateWise Integration Intelligence Architecture" className="w-full h-auto rounded-[32px]" />
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.3em]">INTEGRATEWISE ARCHITECTURE SPECIFICATION v2.0</p>
        </section>

        {/* IntegrateWise OS Architecture */}
        <section className="mb-20 md:mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E2A4A] mb-6 uppercase tracking-tight">The IntegrateWise OS</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Normalize Once. Render Anywhere. A Cognitive Operating System for Governed Execution.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Database className="w-6 h-6" />, title: "Business Data", desc: "Data sources, raw records, and foundational records flow into the unified spine.", color: "bg-[#3F5185]" },
              { icon: <Brain className="w-6 h-6" />, title: "Think Engine", desc: "Converges structured truth, unstructured context, and AI reasoning into situations.", color: "bg-[#7B5EA7]" },
              { icon: <FileText className="w-6 h-6" />, title: "Documents Hub", desc: "Emails, docs, chats, meeting notes — mapped with knowledge links and relationship tracking.", color: "bg-[#3D8B6E]" },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Governance Gate", desc: "Nothing executes without approval. Policy compliance, risk assessment, and human sign-off.", color: "bg-[#F54476]" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h4 className="font-black text-lg text-[#1E2A4A] mb-3 uppercase tracking-tight">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Five-Layer Architecture */}
        <section className="mb-20 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E2A4A] mb-6 uppercase tracking-tight">The Five-Layer Architecture</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Every piece of data flows through five strictly separated layers — from raw reality to governed human action.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                layer: "01", name: "Platform", icon: <Activity className="w-6 h-6" />,
                color: "bg-[#D4883E]", borderColor: "border-[#D4883E]/10",
                desc: "Ingests raw events from all connected tools. Deduplication, webhook validation, and normalization.",
                items: ["1,247 events/min", "99.7% dedup rate"],
              },
              {
                layer: "02", name: "Truth", icon: <Database className="w-6 h-6" />,
                color: "bg-[#3F5185]", borderColor: "border-[#3F5185]/10",
                desc: "The Canonical Spine — single source of truth. Cross-tool entity matching and schema enforcement.",
                items: ["2,847 spine entities", "99.4% match rate"],
              },
              {
                layer: "03", name: "Intelligence", icon: <BrainCircuit className="w-6 h-6" />,
                color: "bg-[#7B5EA7]", borderColor: "border-[#7B5EA7]/10",
                desc: "AI reasoning on Spine data. Edge corrections, dual-context analysis, and goal alignment.",
                items: ["847 corrections", "91.3% health"],
              },
              {
                layer: "04", name: "Cognitive", icon: <Cpu className="w-6 h-6" />,
                color: "bg-[#3D8B6E]", borderColor: "border-[#3D8B6E]/10",
                desc: "Decision surfaces where humans interact with intelligence via chat loops and decision planes.",
                items: ["Decision surfaces", "Session memory"],
              },
              {
                layer: "05", name: "Work", icon: <Briefcase className="w-6 h-6" />,
                color: "bg-[#1E2A4A]", borderColor: "border-[#1E2A4A]/10",
                desc: "Where insights become action. Prioritized task queues, approval gates, and execution logs.",
                items: ["23 pending review", "156 executed/mo"],
              },
            ].map((l, i) => (
              <div key={i} className={`rounded-[32px] border ${l.borderColor} bg-white p-8 shadow-sm hover:shadow-2xl transition-all group`}>
                <div className={`w-14 h-14 ${l.color} rounded-2xl text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {l.icon}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-white ${l.color} uppercase tracking-widest`}>{l.layer}</span>
                  <h3 className="text-lg font-black text-[#1E2A4A] tracking-tight uppercase">{l.name}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">{l.desc}</p>
                <div className="space-y-2">
                  {l.items.map((item, j) => (
                    <div key={j} className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                      <div className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Universal Loop */}
        <section className="mb-20 md:mb-32">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-black text-[#1E2A4A] mb-10 uppercase tracking-tight">The Universal Loop:<br /><span className="text-[#F54476]">From reality to work</span></h2>
              <div className="space-y-10">
                <LoopStep step="1" title="Reality Ingestion" desc="Raw events from your tools (CRM, CS, product usage, billing, support)." />
                <LoopStep step="2" title="Truth Synthesis" desc="We unify structured Spine entities, unstructured semantic info, and AI reasoning." />
                <LoopStep step="3" title="Intelligence Mapping" desc="We map everything to Goals → Metrics → KPIs, aligned to business growth." />
                <LoopStep step="4" title="Governed Execution" desc="Prioritized insights in existing tools + Human-in-the-loop approval loops." />
              </div>
            </div>
            <div className="lg:w-1/2 bg-[#F3F4F6]/50 p-10 md:p-16 rounded-[48px] border border-slate-100 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-[#3F5185] rounded-full blur-[100px]" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F54476] rounded-full blur-[100px]" />
               </div>
               <div className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 border-[3px] border-dashed border-[#3F5185]/20 rounded-full animate-spin-slow" />
                  <div className="w-56 h-56 bg-white shadow-2xl rounded-[40px] flex flex-col items-center justify-center text-center p-8 z-10 border border-slate-100">
                     <Repeat className="w-14 h-14 text-[#F54476] mb-6 animate-pulse" />
                     <div className="text-xs font-black text-[#1E2A4A] uppercase tracking-[0.2em]">CONTINUOUS LEARNING</div>
                  </div>
                  {/* Outer icons */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3F5185] text-white p-5 rounded-2xl shadow-2xl"><Database className="w-7 h-7" /></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#F54476] text-white p-5 rounded-2xl shadow-2xl"><ShieldCheck className="w-7 h-7" /></div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E2A4A] text-white p-5 rounded-2xl shadow-2xl"><LayoutPanelTop className="w-7 h-7" /></div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white p-5 rounded-2xl shadow-2xl"><Search className="w-7 h-7" /></div>
               </div>
            </div>
          </div>
        </section>

        {/* Dual-Context */}
        <section className="mb-20 md:mb-32 py-16 md:py-24 bg-[#1E2A4A] rounded-[48px] text-white px-8 md:px-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F54476]/10 to-transparent" />
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-black mb-12 uppercase tracking-tight leading-tight">Dual-Context by Design:<br />Every metric serves two masters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
               <div>
                  <h3 className="text-[#F54476] font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#F54476]" /> Vendor Context</h3>
                  <p className="text-white/70 text-xl leading-relaxed font-medium">Your growth targets: ARR, NRR, retention, expansion, CAC efficiency.</p>
               </div>
               <div>
                  <h3 className="text-[#3F5185] font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#3F5185]" /> Client Context</h3>
                  <p className="text-white/70 text-xl leading-relaxed font-medium">Your customers' goals: Outcomes, efficiency, ROI, goal attainment.</p>
               </div>
            </div>
            <div className="p-10 bg-white/[0.03] rounded-[32px] border border-white/10 italic text-white/60 text-lg font-medium">
               "Client used Feature X → achieved Outcome Y → improved their retention → they renewed → we hit our NRR target."
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-20 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-black text-[#1E2A4A] text-center mb-16 uppercase tracking-tight">Architecture Differentiation</h2>
          <div className="overflow-x-auto -mx-4 px-4 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <table className="w-full min-w-[600px] text-left border-collapse">
               <thead>
                  <tr className="border-b-2 border-slate-50">
                     <th className="p-10 font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">System Property</th>
                     <th className="p-10 font-black text-slate-800 uppercase tracking-widest text-sm">Legacy Automation</th>
                     <th className="p-10 font-black text-[#3F5185] uppercase tracking-widest text-sm bg-[#3F5185]/5">IntegrateWise OS</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <tr>
                     <td className="p-10 font-black text-slate-700 uppercase tracking-tight text-sm">Data Flow</td>
                     <td className="p-10 text-slate-500 font-medium">Point-to-point (A→B)</td>
                     <td className="p-10 font-black text-[#3F5185] tracking-tight bg-[#3F5185]/5">Universal Intelligence Spine</td>
                  </tr>
                  <tr>
                     <td className="p-10 font-black text-slate-700 uppercase tracking-tight text-sm">Intelligence</td>
                     <td className="p-10 text-slate-500 font-medium">None (Hardcoded rules)</td>
                     <td className="p-10 font-black text-[#3F5185] tracking-tight bg-[#3F5185]/5">Self-learning Edge Correction</td>
                  </tr>
                  <tr>
                     <td className="p-10 font-black text-slate-700 uppercase tracking-tight text-sm">Workflow</td>
                     <td className="p-10 text-slate-500 font-medium">Context-less triggers</td>
                     <td className="p-10 font-black text-[#3F5185] tracking-tight bg-[#3F5185]/5">Dual-context alignment</td>
                  </tr>
                  <tr>
                     <td className="p-10 font-black text-slate-700 uppercase tracking-tight text-sm">AI Trust</td>
                     <td className="p-10 text-slate-500 font-medium">Black-box / Hallucination</td>
                     <td className="p-10 font-black text-[#3F5185] tracking-tight bg-[#3F5185]/5">Human-approved Gating</td>
                  </tr>
               </tbody>
            </table>
          </div>
        </section>

        {/* Rollout */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-black text-[#1E2A4A] text-center mb-16 uppercase tracking-tight">The Road to the Intelligent OS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-10 rounded-[40px] bg-[#3F5185]/5 border border-[#3F5185]/10 group hover:bg-[#3F5185] hover:text-white transition-all duration-500">
                <div className="text-[#3F5185] group-hover:text-white font-black text-5xl mb-10">01</div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Phase 1: Land with CSMs</h3>
                <p className="text-slate-500 group-hover:text-white/70 font-medium leading-relaxed">Solve dual‑context reporting and insight gaps. Focus on renewals and expansion signals.</p>
             </div>
             <div className="p-10 rounded-[40px] bg-[#F54476]/5 border border-[#F54476]/10 group hover:bg-[#F54476] hover:text-white transition-all duration-500">
                <div className="text-[#F54476] group-hover:text-white font-black text-5xl mb-10">02</div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Phase 2: Expand Sales</h3>
                <p className="text-slate-500 group-hover:text-white/70 font-medium leading-relaxed">Add revenue intelligence and product usage insights across the whole funnel.</p>
             </div>
             <div className="p-10 rounded-[40px] bg-[#1E2A4A] border border-[#1E2A4A]/10 text-white group hover:scale-[1.02] transition-all duration-500">
                <div className="text-white font-black text-5xl mb-10">03</div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Phase 3: Become the OS</h3>
                <p className="text-white/60 font-medium leading-relaxed">Full‑company deployment with enterprise features and custom AI agents.</p>
             </div>
          </div>
        </section>

        <DifferentiatorsDetail />

        {/* Final CTA */}
        <div className="text-center bg-[#1E2A4A] p-12 md:p-24 rounded-[48px] border border-white/5 mt-16 md:mt-32 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#F54476] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           <h2 className="text-3xl md:text-5xl font-black text-white mb-10 uppercase tracking-tight leading-[1.1] relative z-10">Work with intelligence —<br />without losing control</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <button 
                onClick={() => window.location.hash = "app"}
                className="bg-white text-[#1E2A4A] px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Launch workspace
              </button>
              <button 
                onClick={() => window.location.hash = "contact"}
                className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-white/10"
              >
                Book strategy call
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function LoopStep({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#3F5185]/10 text-[#3F5185] flex items-center justify-center font-black text-2xl group-hover:bg-[#3F5185] group-hover:text-white transition-all shadow-inner group-hover:shadow-xl">
        {step}
      </div>
      <div>
        <h4 className="text-xl font-black text-[#1E2A4A] mb-3 uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}