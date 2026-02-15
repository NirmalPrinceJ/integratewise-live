import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Zap, Database, ArrowRight, CheckCircle2, Users, Globe } from "lucide-react";
import { AICircuitInfographic } from "./infographics";

export function Differentiators() {
  const items = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Security First",
      desc: "Built-in security features ensure your data is protected and compliant with industry standards."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Speed and Efficiency",
      desc: "Rapid data processing and intelligent automation save time and reduce manual effort."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Management",
      desc: "Centralized data storage and management for easy access and analysis."
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: "Seamless Integration",
      desc: "Connects with a wide range of tools and platforms to streamline workflows."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Reliability",
      desc: "Robust and reliable system with high uptime and minimal downtime."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User-Friendly",
      desc: "Intuitive interface and user-friendly design for easy adoption."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      desc: "Accessible from anywhere with internet connectivity, supporting remote work."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight uppercase font-['Plus_Jakarta_Sans']">What You Get with IntegrateWise</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
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
              className="p-10 rounded-[32px] border border-gray-200 bg-white hover:shadow-2xl hover:border-emerald-200 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-8 group-hover:bg-[#059669] group-hover:text-white transition-all shadow-inner group-hover:shadow-2xl">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight font-['Plus_Jakarta_Sans']">{item.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-[32px] overflow-hidden border border-gray-200 shadow-lg relative h-56 md:h-72"
        >
          <AICircuitInfographic
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-gray-900/20 flex items-center">
            <div className="px-8 md:px-14 max-w-xl">
              <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.3em] mb-3 font-['JetBrains_Mono']">INTELLIGENCE, NOT AUTOMATION</p>
              <p className="text-white text-xl md:text-3xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] mb-5">
                Your tools stay the same. Your team gets <span className="text-[#10B981]">10x smarter.</span>
              </p>
              <button
                onClick={() => window.location.hash = "app"}
                className="px-8 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg font-['Plus_Jakarta_Sans'] flex items-center gap-2 min-h-[44px]"
              >
                Try It Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6 font-['JetBrains_Mono']">This is the difference between integration and integration intelligence.</p>
          <button
            onClick={() => window.location.hash = "technical"}
            className="inline-flex items-center gap-3 text-[#059669] font-bold uppercase tracking-widest text-sm hover:gap-6 transition-all group font-['Plus_Jakarta_Sans']"
          >
            EXPLORE THE ARCHITECTURE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}