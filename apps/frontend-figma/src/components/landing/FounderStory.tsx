import React from "react";
import { motion } from "motion/react";
import { 
  AlertTriangle, CheckCircle2, ArrowRight, Zap, Brain, 
  Target, Users, TrendingUp, Shield, Sparkles, Database, Network
} from "lucide-react";

export function FounderStory() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-emerald-100 text-[#047857] text-xs font-bold tracking-widest uppercase mb-6 font-['JetBrains_Mono']">
              THE ORIGIN — BUILT FROM THE TRENCHES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight font-['Plus_Jakarta_Sans']">
              They Called It a <span className="text-red-600">Dead Account</span><br />
              I Brought It Back — Then Built the System
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              An $8 million account. Marked Red. Labeled 100% attrition. Every leader had written it off. I didn't have a magic tool — I had 13 years of wiring enterprise systems.
            </p>
          </motion.div>
        </div>

        {/* The Story Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Story Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose prose-lg max-w-none">
                <div className="mb-8 p-6 border-l-4 border-emerald-600 bg-emerald-50 rounded-r-xl">
                  <p className="text-lg italic text-gray-800 leading-relaxed">
                    "An $8 million account. Marked <span className="font-bold text-emerald-600">Red</span>. Labeled 100% attrition. Every leader in the room had written it off. I didn't have a magic tool — I had 13 years of wiring enterprise systems, and I knew that somewhere in the data, <span className="font-bold text-emerald-600">there was a story nobody had read.</span>"
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  I was a <strong>Customer Success Manager</strong> at one of the world's largest enterprise software companies, managing four accounts. A fellow CSM moved on, and their most critical account landed on my desk. An <strong className="text-gray-900">$8 million relationship</strong> — already flagged Red. 100% attrition risk. The official assessment: <span className="text-red-600 font-bold">this account is gone.</span>
                </p>

                <p className="text-gray-700 mb-4">
                  The handover? <strong>Nothing. Literally nothing.</strong> No context. No success plan. No relationship history. No documentation about what had been tried, what had failed, or why the client was disengaged. Every system had scraps — a name in the CRM, some scattered tickets in support, an empty project tracker. But no system had the story. <strong>The account was completely dark.</strong>
                </p>

                <p className="text-gray-700 mb-4">
                  So I did what I'd spent <strong>13 years learning to do</strong> — I became the integration layer. I went system by system, record by record, cross-referencing every email thread, every support interaction, every internal note. <strong className="text-amber-600">Weeks of plumbing work.</strong> And I found things that weren't in any document, any dashboard, or any status report.
                </p>

                <p className="text-gray-700 mb-4">
                  <strong className="text-red-600">The contract had never been signed.</strong> That was the untold mystery — the thing that had quietly stalled everything for months, and nobody knew. Buried deeper in the records, I uncovered <strong>interpersonal conflicts between key stakeholders</strong> — ego-driven friction that had poisoned the relationship from the inside. These weren't signals any tool would surface. They were the kind of truth that only emerges when you connect data across every system and read between the lines.
                </p>

                <p className="text-gray-700 mb-4">
                  I resolved every issue. Got the contract signed. Navigated the stakeholder dynamics. Rebuilt the relationship from absolute zero. And when renewal time came — <strong className="text-emerald-600">they renewed. The full $8 million.</strong> An account that was declared dead, saved.
                </p>

                <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white mt-8">
                  <p className="text-lg leading-relaxed mb-4">
                    That save changed everything for me. Not because it worked — but because <strong className="text-emerald-400">it should never require one person doing weeks of manual detective work across a dozen systems</strong> to uncover what should have been visible from day one.
                  </p>
                  <p className="text-lg leading-relaxed font-bold text-emerald-400">
                    That's why I built IntegrateWise. The plumbing work, the cross-referencing, the signal discovery, the hidden-story detection — automated. So every team can find what I found, without going into the dark alone.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black">
                      NP
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-lg font-['Plus_Jakarta_Sans']">Nirmal Prince J</div>
                      <div className="text-sm text-gray-600 font-medium">Founder & CEO, IntegrateWise LLP</div>
                      <div className="text-xs text-gray-500 mt-1">13 Years Integration Architect | Former Salesforce CSM</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sticky top-24">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">The Journey to IntegrateWise</h3>
                <div className="space-y-6">
                  <TimelineItem
                    year="13 Years"
                    title="Integration Architect Across 5 Industries"
                    description="Telecom, finance, healthcare, retail, insurance. Wired hundreds of enterprise systems. Built the plumbing that moves data between tools at scale — and saw firsthand what happens when that plumbing doesn't exist for the people who need it most."
                  />
                  <TimelineItem
                    year="The Red Account"
                    title="Inherited an $8M Account Labeled 100% Attrition"
                    description="A fellow CSM left. Their biggest account landed on my desk with zero handover — no context, no docs, no history. The entire organization had written it off. Completely dark."
                  />
                  <TimelineItem
                    year="The Untold Story"
                    title="Weeks of Manual Plumbing Uncovered Hidden Truths"
                    description="The contract was never signed — a mystery nobody knew existed. Ego-driven conflicts between stakeholders had poisoned the relationship. None of this was in any system, any dashboard, or any report. It only surfaced by connecting data across every source."
                  />
                  <TimelineItem
                    year="$8M Saved"
                    title="From 100% Attrition to Full Renewal"
                    description="Resolved every issue. Got the contract signed. Rebuilt the relationship from zero. The account that was declared dead — renewed in full. Not because of better tools, but because one person did the integration work manually."
                    highlight
                  />
                  <TimelineItem
                    year="IntegrateWise"
                    title="Built the System So Nobody Has to Do It Alone"
                    description="Took everything I did by hand — the cross-referencing, the signal discovery, the hidden-story detection — and built it into a platform. 12 verticals. 40+ integrations. Zero tools replaced. Human approval at every step."
                    highlight
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Universal Application */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
              This Story Repeats <span className="text-[#047857]">Everywhere</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Different teams. Different tools. Same fragmentation. Same late nights. Same preventable crises.
            </p>
          </div>

          {/* Sector Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectorCard
              sector="Customer Success"
              scenario="Champion goes silent"
              tools="Salesforce, Zendesk, Slack, Stripe"
              signal="Hidden in API logs, support tickets, Slack mentions"
            />
            <SectorCard
              sector="Revenue Operations"
              scenario="Pipeline suddenly stalls"
              tools="HubSpot, Stripe, Jira, Calendly"
              signal="Deal velocity drop + engineering delays + billing issues"
            />
            <SectorCard
              sector="Product/Engineering"
              scenario="Feature request escalates"
              tools="Jira, Intercom, GitHub, Slack"
              signal="Customer tier + NPS + churn risk + contract value"
            />
            <SectorCard
              sector="Sales"
              scenario="Deal goes cold"
              tools="Salesforce, Gong, LinkedIn, Email"
              signal="Champion changed roles, budget got frozen, competitor moved in"
            />
            <SectorCard
              sector="Marketing"
              scenario="Campaign performs poorly"
              tools="HubSpot, Google Analytics, Stripe, CRM"
              signal="Wrong ICP segment, pricing mismatch, timing issues"
            />
            <SectorCard
              sector="Finance/Operations"
              scenario="Revenue recognition delays"
              tools="Stripe, QuickBooks, Salesforce, Contracts"
              signal="Misaligned data across billing, CRM, and accounting"
            />
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
            Don't Wait for Your Dead Account Moment
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            IntegrateWise was built to prevent these moments—for every team, in every sector.
          </p>
          <button
            onClick={() => { window.location.hash = "app"; }}
            className="px-10 py-4 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-extrabold text-lg shadow-lg transition-all flex items-center justify-center gap-3 mx-auto group font-['Plus_Jakarta_Sans'] min-h-[48px]"
          >
            START CONNECTING YOUR FRAGMENTS <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// Timeline Item Component
interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

function TimelineItem({ year, title, description, highlight }: TimelineItemProps) {
  return (
    <div className={`relative pl-8 pb-6 border-l-2 ${highlight ? 'border-emerald-500' : 'border-gray-200'} last:border-l-0 last:pb-0`}>
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${highlight ? 'bg-emerald-500' : 'bg-gray-300'} border-4 border-white shadow-md`} />
      <div className={`inline-block px-2 py-1 rounded text-xs font-bold font-['JetBrains_Mono'] mb-2 ${highlight ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
        {year}
      </div>
      <h4 className="font-bold text-gray-900 mb-2 text-sm leading-tight">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Sector Card Component
interface SectorCardProps {
  sector: string;
  scenario: string;
  tools: string;
  signal: string;
}

function SectorCard({ sector, scenario, tools, signal }: SectorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-emerald-300 transition-all group"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
          <Target className="w-5 h-5 text-[#059669]" />
        </div>
        <h4 className="font-black text-gray-900 font-['Plus_Jakarta_Sans']">{sector}</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider font-['JetBrains_Mono'] block mb-1">Crisis</span>
          <p className="text-gray-900 font-semibold">{scenario}</p>
        </div>
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-['JetBrains_Mono'] block mb-1">Fragmented Across</span>
          <p className="text-gray-700 text-xs">{tools}</p>
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-['JetBrains_Mono'] block mb-1">Hidden Signal</span>
          <p className="text-gray-700 text-xs">{signal}</p>
        </div>
      </div>
    </motion.div>
  );
}