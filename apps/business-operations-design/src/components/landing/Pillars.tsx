import React from "react";
import { motion } from "motion/react";
import { Database, Layers, Brain, CheckCircle2, RefreshCw, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { NetworkInfographic } from "./infographics";

export function Pillars() {
  const pillars = [
    {
      icon: <Database className="w-10 h-10 text-[#059669]" />,
      title: "Doesn't Replace Your Tools",
      description: "IntegrateWise connects your existing tools and runs in the background. Your team keeps working the way they already do — the workspace just gets smarter.",
      color: "border-emerald-100 hover:bg-emerald-50/50 hover:border-emerald-200"
    },
    {
      icon: <Layers className="w-10 h-10 text-[#059669]" />,
      title: "Preserves Your Thinking",
      description: "AI conversations, documents, meeting notes, and decisions are captured, linked to projects and customers, and resurfaced when you need them.",
      color: "border-emerald-100 hover:bg-emerald-50/50 hover:border-emerald-200"
    },
    {
      icon: <Brain className="w-10 h-10 text-[#8B5CF6]" />,
      title: "Keeps Humans in Control",
      description: "AI suggests. You decide. Every recommendation includes why it was made, what sources it used, and what will change if executed. Every action is approval-gated and auditable.",
      color: "border-purple-100 hover:bg-purple-50/50 hover:border-purple-200"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight uppercase font-['Plus_Jakarta_Sans']">A Workspace That Understands Your Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
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
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-gray-100">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight font-['Plus_Jakarta_Sans']">{pillar.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">{pillar.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What It Builds Diagram */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="rounded-[32px] overflow-hidden border border-gray-200 shadow-md h-72">
              <NetworkInfographic className="w-full h-full" />
            </div>
            
            {/* Benefits List */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h4 className="font-black text-gray-900 mb-6 text-lg font-['Plus_Jakarta_Sans']">What This Means for You</h4>
              <ul className="space-y-4">
                {[
                  "Stop rebuilding context manually",
                  "AI that explains its reasoning",
                  "Work stays in the systems you know",
                  "Intelligence surfaces automatically"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}