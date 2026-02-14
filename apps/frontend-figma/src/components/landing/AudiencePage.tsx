import React from "react";
import { Audience } from "./Audience";
import { Layout } from "./Layout";
import { motion } from "motion/react";

export function AudiencePage() {
  return (
    <Layout>
      <div className="pt-16 md:pt-20">
        <Audience />
        <div className="py-24 md:py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-12 md:mb-16 uppercase tracking-tight font-['Plus_Jakarta_Sans']">Built for the modern Revenue Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {[
                      { name: "Salesforce", desc: "CRM & Revenue" },
                      { name: "HubSpot", desc: "Marketing & CRM" },
                      { name: "Zendesk", desc: "Customer Support" },
                      { name: "Stripe", desc: "Billing & Payments" },
                      { name: "Slack", desc: "Team Communication" },
                      { name: "Jira", desc: "Project Tracking" },
                      { name: "Mixpanel", desc: "Product Analytics" },
                      { name: "Segment", desc: "Data Pipeline" }
                    ].map((tool, i) => (
                      <motion.div 
                        key={tool.name} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-[32px] p-8 border border-gray-200 text-center hover:shadow-2xl hover:border-emerald-200 transition-all group cursor-default"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#059669] group-hover:text-white transition-all shadow-inner">
                          <span className="text-[#059669] group-hover:text-white font-black text-2xl uppercase">{tool.name[0]}</span>
                        </div>
                        <div className="font-black text-gray-900 text-sm uppercase tracking-tight mb-2 font-['Plus_Jakarta_Sans']">{tool.name}</div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest font-['JetBrains_Mono']">{tool.desc}</div>
                      </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}