import React from "react";
import { MessageSquareOff, DatabaseZap, FileQuestion, Wrench } from "lucide-react";
import { motion } from "motion/react";

export function Problem() {
  const problems = [
    {
      icon: <MessageSquareOff className="w-8 h-8 text-[#F54476]" />,
      number: "01",
      title: "AI Chats Disappear",
      description: "You have an incredible brainstorming session with ChatGPT, Claude, or Gemini. You shape an idea, refine strategy, get clarity. Then the tab closes — and the intelligence is gone. Three weeks later, you start over.",
      pain: "AI becomes a treadmill — not a memory."
    },
    {
      icon: <DatabaseZap className="w-8 h-8 text-[#F54476]" />,
      number: "02",
      title: "Data Is Everywhere, Delivers Nothing",
      description: "CRM has accounts. Billing has payments. Support has tickets. Slack has real conversations. Email has commitments. Each tool holds a piece, but no one sees the whole customer.",
      pain: "You have data everywhere — but intelligence nowhere."
    },
    {
      icon: <FileQuestion className="w-8 h-8 text-[#F54476]" />,
      number: "03",
      title: "Documents Go In, Nothing Comes Out",
      description: "Strategy docs in Notion. Meeting notes in Google Docs. Contracts in Dropbox. Research in PDFs. Each took real effort — but later, no one can find them, and insights don't surface when decisions are made.",
      pain: "Your best thinking becomes archived content."
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#F54476]" />,
      number: "04",
      title: "You Do Plumbing Every Single Day",
      description: "Copy/paste between apps. Export/import spreadsheets. Update the same truth in three places. Chase 'where is that doc?' Rebuild dashboards because numbers don't match.",
      pain: "You're not doing your job. You're maintaining a broken system of context."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] leading-[1.1] mb-8 tracking-tight">
            The Four Problems<br />
            <span className="text-[#F54476]">Draining Every Team</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Modern teams aren't struggling because they lack talent. They're struggling because their work lives in fragments — and every day becomes plumbing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 md:p-10 rounded-[32px] border border-slate-100 bg-white hover:shadow-2xl hover:border-transparent transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F54476]/5 to-transparent -z-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#F54476]/5 flex items-center justify-center group-hover:bg-[#F54476]/10 transition-colors">
                  {p.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#F54476] tracking-[0.3em] uppercase">{p.number}</span>
                  <h3 className="text-xl font-black text-[#1E2A4A] tracking-tight">{p.title}</h3>
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed mb-6">{p.description}</p>
              <div className="px-4 py-3 bg-[#1E2A4A]/5 rounded-xl">
                <p className="text-sm font-bold text-[#1E2A4A] italic">{p.pain}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The hidden tax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Information exists, but it's scattered. Intelligence exists, but it evaporates.
            Documents exist, but they don't surface when needed.
          </p>
          <p className="text-2xl font-black text-[#1E2A4A] mt-6">
            Work doesn't move forward. <span className="text-[#F54476]">You move between tools.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
