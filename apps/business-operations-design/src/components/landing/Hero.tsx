import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles, Layers, AlertTriangle, Database } from "lucide-react";
import architectureImage from "figma:asset/a76fd4f119a6c6a979f0bd213fd10e1d85edd796.png";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-red-500 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Crisis Badge */}
            <div className="inline-flex items-center gap-3 py-2 px-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-8 font-['JetBrains_Mono']">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              11:47 PM — ACCOUNT AT RISK
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight font-['Plus_Jakarta_Sans']">
              Don't Wait for Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400">
                11:47 PM Crisis
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed font-medium">
              $450K account wants to cancel. Meeting at 9 AM. You have <span className="text-white font-bold">9 hours</span> to piece together data from Salesforce, Stripe, Zendesk, Jira, and Slack.
            </p>
            <p className="text-base md:text-lg text-emerald-400 mb-10 max-w-2xl mx-auto font-bold">
              Or you could have seen it coming weeks ago.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { window.location.hash = "app"; }}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full font-extrabold text-lg shadow-2xl shadow-emerald-500/50 transition-all flex items-center justify-center gap-3 group font-['Plus_Jakarta_Sans'] min-h-[56px]"
              >
                PREVENT YOUR CRISIS <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { window.location.hash = "founder-story"; }}
                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 text-white rounded-full font-extrabold text-lg transition-all flex items-center justify-center gap-3 font-['Plus_Jakarta_Sans'] min-h-[56px]"
              >
                <Play className="w-5 h-5 fill-current" /> READ THE STORY
              </button>
            </div>
          </motion.div>
        </div>

        {/* Crisis Dashboard Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Main Dashboard Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-1">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-[22px] p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider font-['JetBrains_Mono'] mb-1">ACCOUNT HEALTH</div>
                  <div className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">TechFlow Systems</div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-400">CRITICAL</span>
                </div>
              </div>

              {/* Crisis Signals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <CrisisSignal
                  icon={<Layers className="w-5 h-5" />}
                  label="Champion Engagement"
                  value="0 interactions"
                  trend="↓ 100% (14 days)"
                  status="critical"
                />
                <CrisisSignal
                  icon={<Sparkles className="w-5 h-5" />}
                  label="Support Tickets"
                  value="12 open"
                  trend="↑ 400% (2 weeks)"
                  status="warning"
                />
                <CrisisSignal
                  icon={<Database className="w-5 h-5" />}
                  label="API Usage"
                  value="10x spike"
                  trend="Hidden growth signal"
                  status="opportunity"
                />
              </div>

              {/* Data Source Badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <span className="text-xs text-gray-500 font-['JetBrains_Mono'] mr-2">DATA FROM:</span>
                {[
                  { name: "Salesforce", color: "#00A1E0" },
                  { name: "Stripe", color: "#635BFF" },
                  { name: "Zendesk", color: "#03363D" },
                  { name: "Jira", color: "#0052CC" },
                  { name: "Slack", color: "#4A154B" },
                ].map(tool => (
                  <div key={tool.name} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                    <span className="text-xs font-bold text-gray-400">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Alert - Left */}
          <div className="absolute top-[10%] -left-4 md:-left-12 hidden lg:block">
            <div className="bg-red-500 text-white p-4 rounded-2xl shadow-2xl border border-red-400 max-w-[200px] animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-black uppercase font-['JetBrains_Mono']">SLACK ALERT</span>
              </div>
              <p className="text-xs font-bold leading-tight">
                "TechFlow wants to cancel. Meeting tomorrow 9 AM."
              </p>
              <span className="text-[10px] text-red-200 mt-1 block">11:47 PM</span>
            </div>
          </div>

          {/* Floating Signal - Right */}
          <div className="absolute bottom-[15%] -right-4 md:-right-12 hidden lg:block">
            <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl border border-emerald-400 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase font-['JetBrains_Mono']">HIDDEN SIGNAL</span>
              </div>
              <p className="text-xs font-bold leading-tight">
                API usage 10x'd. They're growing, not churning.
              </p>
              <span className="text-[10px] text-emerald-200 mt-1 block">Discovered at 2:14 AM</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <StatItem value="4 hours" label="Wasted scrambling" />
          <StatItem value="5 tools" label="Manually checked" />
          <StatItem value="$450K" label="ARR at risk" />
          <StatItem value="$630K" label="After the save" />
        </motion.div>
      </div>
    </section>
  );
}

// Crisis Signal Component
interface CrisisSignalProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  status: "critical" | "warning" | "opportunity";
}

function CrisisSignal({ icon, label, value, trend, status }: CrisisSignalProps) {
  const colors = {
    critical: "border-red-500/30 bg-red-500/10",
    warning: "border-amber-500/30 bg-amber-500/10",
    opportunity: "border-emerald-500/30 bg-emerald-500/10"
  };

  const textColors = {
    critical: "text-red-400",
    warning: "text-amber-400",
    opportunity: "text-emerald-400"
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[status]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`${textColors[status]}`}>{icon}</div>
        <span className="text-xs text-gray-400 font-bold uppercase font-['JetBrains_Mono']">{label}</span>
      </div>
      <div className={`text-xl font-black ${textColors[status]} mb-1 font-['Plus_Jakarta_Sans']`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium">{trend}</div>
    </div>
  );
}

// Stat Item Component
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black text-white mb-2 font-['Plus_Jakarta_Sans']">{value}</div>
      <div className="text-xs text-gray-400 uppercase font-bold tracking-wider font-['JetBrains_Mono']">{label}</div>
    </div>
  );
}