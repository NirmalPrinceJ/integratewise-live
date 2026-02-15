import React from "react";
import { motion } from "motion/react";
import { 
  AlertTriangle, Clock, Database, TrendingDown, Users, 
  Zap, XCircle, CheckCircle2, ArrowRight, Eye, Layers
} from "lucide-react";

export function Problem() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase mb-6 font-['JetBrains_Mono']">
              THE FRAGMENTATION TAX
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight font-['Plus_Jakarta_Sans']">
              You're Not Working.<br />
              <span className="text-red-600">You're Context Switching.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Every B2B team loses 12+ hours per week rebuilding context across fragmented tools. The signal is there. You just can't see it.
            </p>
          </motion.div>
        </div>

        {/* The Daily Scramble Visualization */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 font-['Plus_Jakarta_Sans']">The Daily Scramble</h3>
                <p className="text-sm text-gray-600 font-medium">A typical customer health check</p>
              </div>
            </div>

            {/* Scramble Steps */}
            <div className="space-y-4">
              <ScrambleStep
                step={1}
                tool="Salesforce"
                color="#00A1E0"
                task="Check account details, last touch date, ARR"
                time="4 min"
              />
              <ScrambleStep
                step={2}
                tool="Stripe"
                color="#635BFF"
                task="Pull payment history, MRR trends, failed charges"
                time="3 min"
              />
              <ScrambleStep
                step={3}
                tool="Zendesk"
                color="#03363D"
                task="Count open tickets, CSAT scores, escalations"
                time="5 min"
              />
              <ScrambleStep
                step={4}
                tool="Slack"
                color="#4A154B"
                task="Search #customer-alerts, DMs, mentions"
                time="6 min"
              />
              <ScrambleStep
                step={5}
                tool="Jira"
                color="#0052CC"
                task="Feature requests, bug reports, priority"
                time="4 min"
              />
              <ScrambleStep
                step={6}
                tool="Email"
                color="#EA4335"
                task="Search inbox, find thread, read context"
                time="5 min"
              />
              <ScrambleStep
                step={7}
                tool="Google Sheets"
                color="#0F9D58"
                task="Update manual tracking spreadsheet"
                time="3 min"
              />
            </div>

            {/* Total Time */}
            <div className="mt-8 pt-6 border-t-2 border-red-200 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600 font-bold uppercase tracking-wider font-['JetBrains_Mono']">Total Time</span>
                <div className="text-4xl font-black text-red-600 mt-1 font-['Plus_Jakarta_Sans']">30 minutes</div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600 font-bold uppercase tracking-wider font-['JetBrains_Mono']">For One Decision</span>
                <div className="text-xl font-black text-gray-900 mt-1 font-['Plus_Jakarta_Sans']">×40 times/week</div>
              </div>
            </div>

            {/* Cost Callout */}
            <div className="mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <p className="text-lg font-black text-red-900 font-['Plus_Jakarta_Sans']">20+ hours per person per week</p>
                  <p className="text-sm text-red-700 font-medium">Not doing work. Just finding the work to do.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Hidden Costs Grid */}
        <div className="mb-20">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 text-center font-['Plus_Jakarta_Sans']">
            What Fragmentation <span className="text-red-600">Really Costs</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CostCard
              icon={<TrendingDown className="w-6 h-6" />}
              title="Missed Signals"
              description="Expansion opportunities and churn risks buried across tools"
              impact="$180K+ ARR lost"
            />
            <CostCard
              icon={<Clock className="w-6 h-6" />}
              title="Slow Response"
              description="Hours to gather context when minutes matter"
              impact="4-hour average"
            />
            <CostCard
              icon={<Users className="w-6 h-6" />}
              title="Team Burnout"
              description="Mental overhead of constant tool switching"
              impact="40% productivity loss"
            />
            <CostCard
              icon={<XCircle className="w-6 h-6" />}
              title="Bad Decisions"
              description="Incomplete data leads to wrong actions"
              impact="73% confidence gap"
            />
          </div>
        </div>

        {/* The Real Problem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-['Plus_Jakarta_Sans']">The Real Problem</h3>
            </div>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              It's not that the data doesn't exist. It's that <span className="text-white font-bold">no single system can see across all of it</span> to understand what's actually happening.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Your CRM doesn't know about support tickets. Your billing system doesn't know about Slack sentiment. Your project tracker doesn't know about customer health.
            </p>
            <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-lg font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                You need a system that sees everything, understands context, and surfaces what matters.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Solution Teaser */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
            IntegrateWise Ends the Scramble
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            One workspace. All your tools. AI that understands your business context. Insights ready when you need them.
          </p>
          <button
            onClick={() => { window.location.hash = "platform-overview"; }}
            className="px-10 py-4 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-extrabold text-lg shadow-lg transition-all flex items-center justify-center gap-3 mx-auto group font-['Plus_Jakarta_Sans'] min-h-[48px]"
          >
            SEE HOW IT WORKS <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Scramble Step Component
interface ScrambleStepProps {
  step: number;
  tool: string;
  color: string;
  task: string;
  time: string;
}

function ScrambleStep({ step, tool, color, task, time }: ScrambleStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: step * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3 min-w-[140px]">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-sm font-black text-gray-600 font-['JetBrains_Mono']">{step}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-bold text-gray-900">{tool}</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-700">{task}</p>
      </div>
      <div className="text-right min-w-[60px]">
        <span className="text-sm font-black text-red-600 font-['JetBrains_Mono']">{time}</span>
      </div>
    </motion.div>
  );
}

// Cost Card Component
interface CostCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}

function CostCard({ icon, title, description, impact }: CostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="font-black text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">{title}</h4>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="text-xs font-bold text-red-600 uppercase tracking-wider font-['JetBrains_Mono']">{impact}</div>
    </motion.div>
  );
}