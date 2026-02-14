import React from "react";
import { motion } from "motion/react";
import {
  Layers,
  Database,
  Brain,
  UserCircle,
  ShieldCheck,
  Zap,
  Network,
  Target,
  ArrowDown,
  CheckCircle2,
  Briefcase,
  Cpu,
  Eye,
  GitBranch,
  Settings,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Bot,
} from "lucide-react";

export function ArchitectureVisualization() {
  return (
    <div className="w-full h-full bg-white p-6 md:p-10 flex flex-col items-center justify-start font-sans overflow-auto">
      <div className="w-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3F5185] mb-2">
            IntegrateWise OS — System Architecture
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E2A4A]">
            Five-Layer Cognitive Operating System
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
            From raw connector events to governed human action — every layer has a strict boundary and clear responsibility.
          </p>
        </div>

        {/* Architecture Stack */}
        <div className="relative flex flex-col gap-0">
          {/* ═══════════════════ LAYER 5: WORK LAYER ═══════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <div className="bg-[#1E2A4A] rounded-t-2xl p-5 text-white border-2 border-[#1E2A4A]">
              <div className="flex items-start gap-4">
                {/* Layer badge */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black bg-white/15 rounded-full px-2 py-0.5">L5</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black tracking-tight">Work Layer</h3>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-[#F54476] rounded-full px-2.5 py-0.5">
                      Human Execution
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    Where insights become work. Prioritized actions, task queues, and governed execution — nothing runs without human approval.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: CheckCircle2, label: "Task Queue", detail: "23 pending" },
                      { icon: ShieldCheck, label: "Approval Gate", detail: "HITL required" },
                      { icon: Users, label: "Team Actions", detail: "156 /month" },
                      { icon: BarChart3, label: "Execution Log", detail: "Auditable" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.06] border border-white/10 rounded-lg p-2.5 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold">{item.label}</div>
                          <div className="text-[7px] text-white/30">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flow arrow */}
          <FlowArrow label="Governed actions flow up" color="bg-[#1E2A4A]" />

          {/* ═══════════════════ LAYER 4: COGNITIVE LAYER ═══════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-[#3D8B6E] to-[#2D7A5C] p-5 text-white border-x-2 border-[#3D8B6E]">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black bg-white/15 rounded-full px-2 py-0.5">L4</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black tracking-tight">Cognitive Layer</h3>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2.5 py-0.5">
                      UI & Operational Loops
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    Context-aware dashboards, AI chat loops, and interactive decision surfaces. Where humans interact with intelligence.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: Eye, label: "Dashboards", detail: "Context-aware" },
                      { icon: Bot, label: "AI Chat / Think", detail: "Session memory" },
                      { icon: MessageSquare, label: "Decision UI", detail: "Interactive" },
                      { icon: GitBranch, label: "Workflow Canvas", detail: "Visual builder" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.06] border border-white/10 rounded-lg p-2.5 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold">{item.label}</div>
                          <div className="text-[7px] text-white/30">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flow arrow */}
          <FlowArrow label="Situations rendered as decisions" color="bg-[#3D8B6E]" />

          {/* ═══════════════════ LAYER 3: INTELLIGENCE LAYER ═══════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-[#7B5EA7] to-[#6A4E94] p-5 text-white border-x-2 border-[#7B5EA7]">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black bg-white/15 rounded-full px-2 py-0.5">L3</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black tracking-tight">Intelligence Layer</h3>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2.5 py-0.5">
                      Think Engine
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    AI reasoning on Spine data. Edge corrections, dual-context analysis, situation convergence, and goal alignment.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: Brain, label: "Think Engine", detail: "847 corrections" },
                      { icon: Target, label: "Goal Alignment", detail: "Dual-context" },
                      { icon: Zap, label: "Situation Engine", detail: "Convergence" },
                      { icon: Settings, label: "Edge Correction", detail: "Self-learning" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.06] border border-white/10 rounded-lg p-2.5 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold">{item.label}</div>
                          <div className="text-[7px] text-white/30">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flow arrow */}
          <FlowArrow label="Structured truth feeds reasoning" color="bg-[#7B5EA7]" />

          {/* ═══════════════════ LAYER 2: TRUTH LAYER ═══════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-[#3F5185] to-[#344573] p-5 text-white border-x-2 border-[#3F5185]">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black bg-white/15 rounded-full px-2 py-0.5">L2</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black tracking-tight">Truth Layer</h3>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2.5 py-0.5">
                      The Spine (SSOT)
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    Canonical Spine — single source of truth. Cross-tool entity matching, provenance tracking, schema enforcement, and digital twin.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: Database, label: "Canonical Spine", detail: "2,847 entities" },
                      { icon: Layers, label: "Digital Twin", detail: "Multi-source" },
                      { icon: FileText, label: "Evidence Drawer", detail: "Provenance" },
                      { icon: GitBranch, label: "Schema Health", detail: "99.4% match" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.06] border border-white/10 rounded-lg p-2.5 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold">{item.label}</div>
                          <div className="text-[7px] text-white/30">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flow arrow */}
          <FlowArrow label="Normalized events become entities" color="bg-[#3F5185]" />

          {/* ═══════════════════ LAYER 1: PLATFORM LAYER ═══════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-[#D4883E] to-[#C07830] rounded-b-2xl p-5 text-white border-2 border-t-0 border-[#D4883E]">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black bg-white/15 rounded-full px-2 py-0.5">L1</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black tracking-tight">Platform Layer</h3>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2.5 py-0.5">
                      Infrastructure & Connectors
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    Raw event ingestion from all connected tools. Webhook validation, deduplication, auth, and governance infrastructure.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { icon: Network, label: "Connector Hub", detail: "12 tools" },
                      { icon: ShieldCheck, label: "Auth & RBAC", detail: "Multi-tenant" },
                      { icon: Settings, label: "Governance", detail: "Audit trail" },
                      { icon: Zap, label: "Event Stream", detail: "1,247/min" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.06] border border-white/10 rounded-lg p-2.5 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        <div>
                          <div className="text-[9px] font-bold">{item.label}</div>
                          <div className="text-[7px] text-white/30">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right-side flow spine */}
          <div className="absolute right-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1E2A4A] via-[#7B5EA7] to-[#D4883E] opacity-30 hidden md:block" />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between w-full text-[9px] font-mono text-slate-400 uppercase tracking-[0.15em] border-t border-slate-200 pt-3">
          <span>Normalize Once. Render Anywhere.</span>
          <span>IntegrateWise OS v4.2.0</span>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center justify-center py-0 relative z-10">
      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
        <ArrowDown className="w-2.5 h-2.5 text-slate-400" />
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <ArrowDown className="w-2.5 h-2.5 text-slate-400 rotate-180" />
      </div>
    </div>
  );
}
