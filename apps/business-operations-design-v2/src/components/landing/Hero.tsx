import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles, Layers } from "lucide-react";
import architectureImage from "figma:asset/a76fd4f119a6c6a979f0bd213fd10e1d85edd796.png";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-[#F3F4F6]/30">
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 hidden lg:block">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[#0EA0EA5E9E9] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-[#F54476] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-[#0EA0EA5E9E9]/10 text-[#0EA0EA5E9E9] text-xs font-bold tracking-widest uppercase mb-8">
              THE STORY OF EFFORTLESS WORK
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#0C0C122222] leading-[1.1] mb-8 tracking-tight">
              Work Isn't Hard.<br />
              <span className="text-[#F54476]">Fragmented Work Is.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              You bounce between CRM, billing, support, Slack, email, docs, dashboards, and AI tools — not to do work, but to rebuild context for one decision. IntegrateWise stops the plumbing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { window.location.hash = "app"; }}
                className="w-full sm:w-auto px-10 py-5 bg-[#F54476] hover:bg-[#E03A66] text-white rounded-full font-black text-lg shadow-2xl shadow-[#F54476]/30 transition-all flex items-center justify-center gap-3 group"
              >
                STOP THE PLUMBING <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { window.location.hash = "problem"; }}
                className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-[#0EA0EA5E9E9] text-[#0C0C122222] rounded-full font-black text-lg transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" /> SEE THE PROBLEM
              </button>
            </div>
          </motion.div>
        </div>

        {/* Architecture Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(112,18,318,34,0.3)] border border-white/50 bg-white/50 backdrop-blur-xl p-2 md:p-4">
            <img
              src={architectureImage}
              alt="IntegrateWise — A workspace that understands your work"
              className="w-full h-auto rounded-[24px]"
            />

            {/* Floating Element — Intelligence */}
            <div className="absolute top-[15%] -left-8 hidden lg:block bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0EA0EA5E9E9]/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#0EA0EA5E9E9]" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Fragments Unified</div>
                  <div className="text-xl font-black text-[#0EA0EA5E9E9]">12 tools</div>
                </div>
              </div>
            </div>

            {/* Floating Element — AI Memory */}
            <div className="absolute bottom-[20%] -right-8 hidden lg:block bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-bounce-slow-delay">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F54476]/10 flex items-center justify-center text-[#F54476]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AI Memory</div>
                  <div className="text-xl font-black text-[#0C0C122222]">Active</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Strip */}
        <div className="mt-20 md:mt-32 text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-12">CONNECTS TO YOUR EXISTING TOOLS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
            {["Salesforce", "HubSpot", "Zendesk", "Stripe", "Slack", "Jira"].map(name => (
              <div key={name} className="flex items-center gap-2 text-xl md:text-2xl font-black text-[#0C0C122222] tracking-tighter">{name}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}