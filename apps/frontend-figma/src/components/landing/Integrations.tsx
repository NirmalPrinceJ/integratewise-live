import React from "react";
import { motion } from "motion/react";
import { Check, Database, MessageSquare, CreditCard, Calendar, Code, Users, TrendingUp } from "lucide-react";

export function Integrations() {
  const categories = [
    {
      name: "CRM & Sales",
      icon: <Database className="w-6 h-6" />,
      tools: [
        { name: "Salesforce", color: "#00A1E0" },
        { name: "HubSpot", color: "#FF7A59" },
        { name: "Pipedrive", color: "#FF7A59" },
        { name: "Close", color: "#4A90E2" },
      ]
    },
    {
      name: "Support & CX",
      icon: <MessageSquare className="w-6 h-6" />,
      tools: [
        { name: "Zendesk", color: "#03363D" },
        { name: "Intercom", color: "#0a62ff" },
        { name: "Freshdesk", color: "#21B573" },
        { name: "Help Scout", color: "#1292EE" },
      ]
    },
    {
      name: "Billing & Finance",
      icon: <CreditCard className="w-6 h-6" />,
      tools: [
        { name: "Stripe", color: "#635BFF" },
        { name: "QuickBooks", color: "#2CA01C" },
        { name: "Chargebee", color: "#FF6C37" },
        { name: "Recurly", color: "#EE4823" },
      ]
    },
    {
      name: "Project & Ops",
      icon: <Calendar className="w-6 h-6" />,
      tools: [
        { name: "Jira", color: "#0052CC" },
        { name: "Asana", color: "#F06A6A" },
        { name: "Linear", color: "#5E6AD2" },
        { name: "Monday", color: "#FF3D57" },
      ]
    },
    {
      name: "Communication",
      icon: <MessageSquare className="w-6 h-6" />,
      tools: [
        { name: "Slack", color: "#4A154B" },
        { name: "Teams", color: "#6264A7" },
        { name: "Gmail", color: "#EA4335" },
        { name: "Outlook", color: "#0078D4" },
      ]
    },
    {
      name: "Dev & Engineering",
      icon: <Code className="w-6 h-6" />,
      tools: [
        { name: "GitHub", color: "#181717" },
        { name: "GitLab", color: "#FC6D26" },
        { name: "Bitbucket", color: "#0052CC" },
        { name: "Sentry", color: "#362D59" },
      ]
    },
    {
      name: "HR & People",
      icon: <Users className="w-6 h-6" />,
      tools: [
        { name: "BambooHR", color: "#73C41D" },
        { name: "Workday", color: "#EC7E00" },
        { name: "Greenhouse", color: "#44B368" },
        { name: "Gusto", color: "#F45D48" },
      ]
    },
    {
      name: "Analytics",
      icon: <TrendingUp className="w-6 h-6" />,
      tools: [
        { name: "Mixpanel", color: "#7856FF" },
        { name: "Amplitude", color: "#0065FF" },
        { name: "Looker", color: "#4285F4" },
        { name: "Tableau", color: "#E97627" },
      ]
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-emerald-50 text-[#047857] text-xs font-bold tracking-widest uppercase mb-6 font-['JetBrains_Mono']">
              40+ INTEGRATIONS
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight font-['Plus_Jakarta_Sans']">
              Works With Your<br />
              <span className="text-[#047857]">Existing Stack</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              IntegrateWise connects to the tools you already use. No rip-and-replace. No migration headaches. Just one layer that makes everything smarter.
            </p>
          </motion.div>
        </div>

        {/* Integration Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-8 bg-white border border-gray-200 rounded-3xl hover:border-[#047857] hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl shadow-sm group-hover:bg-[#059669] group-hover:text-white transition-all flex items-center justify-center border border-emerald-100 text-[#059669]">
                  {cat.icon}
                </div>
                <h3 className="font-black text-lg text-gray-900 font-['Plus_Jakarta_Sans']">{cat.name}</h3>
              </div>
              <div className="space-y-3">
                {cat.tools.map((tool, j) => (
                  <div key={j} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                    <span className="text-sm font-semibold text-gray-700">{tool.name}</span>
                    <Check className="w-4 h-4 text-[#059669] ml-auto" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-sm text-gray-600 mb-6 font-['JetBrains_Mono'] font-bold uppercase tracking-widest">
            Need a custom integration? We build it.
          </p>
          <button
            onClick={() => window.location.hash = "contact"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg font-['Plus_Jakarta_Sans'] min-h-[48px]"
          >
            Request Integration
          </button>
        </motion.div>
      </div>
    </section>
  );
}