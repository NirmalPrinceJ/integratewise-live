import React from "react";
import { 
  Database, 
  MessageSquare, 
  CreditCard, 
  BarChart, 
  Slack, 
  Github,
  Component,
  Activity,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

export function Integrations() {
  const categories = [
    {
      name: "CRM & Revenue",
      icon: <Database className="w-5 h-5" />,
      platforms: ["Salesforce", "HubSpot", "Pipedrive"]
    },
    {
      name: "Customer Support",
      icon: <MessageSquare className="w-5 h-5" />,
      platforms: ["Zendesk", "Intercom", "Freshdesk"]
    },
    {
      name: "Billing & Finance",
      icon: <CreditCard className="w-5 h-5" />,
      platforms: ["Stripe", "Chargebee", "Recurly"]
    },
    {
      name: "Product & Data",
      icon: <BarChart className="w-5 h-5" />,
      platforms: ["Mixpanel", "Segment", "Amplitude"]
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] mb-8 tracking-tight uppercase leading-[1.1]">Integrate with your entire ecosystem</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            IntegrateWise connects to over 100+ platforms out of the box, unifying their data into a living truth layer for intelligent insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 group cursor-default"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm group-hover:bg-[#3F5185] group-hover:text-white transition-all flex items-center justify-center border border-slate-100">
                  {cat.icon}
                </div>
                <h3 className="font-black text-[#1E2A4A] tracking-tight">{cat.name}</h3>
              </div>
              <ul className="space-y-4">
                {cat.platforms.map((platform, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-500 font-bold text-sm group-hover:text-slate-900 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#F54476] transition-colors" />
                    {platform}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Slack className="w-6 h-6" /> Slack</div>
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Github className="w-6 h-6" /> GitHub</div>
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Component className="w-6 h-6" /> Jira</div>
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter"><Activity className="w-6 h-6" /> Mixpanel</div>
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter">Stripe</div>
           <div className="flex items-center gap-3 font-black text-xl tracking-tighter">Segment</div>
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => window.location.hash = "connect"}
            className="px-10 py-5 bg-[#1E2A4A] hover:bg-slate-800 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-[#1E2A4A]/20"
          >
            VIEW ALL 100+ INTEGRATIONS <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}