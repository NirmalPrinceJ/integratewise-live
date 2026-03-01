import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Logo } from "../Logo";
import {
  SalesforceLogo,
  SlackLogo,
  StripeLogo,
  JiraLogo,
} from "../ToolLogos";
import {
  Search,
  Bell,
  Circle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  Brain,
  Shield,
  MessageSquare,
  ChevronUp,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle,
  BarChart3,
  DollarSign,
  Factory,
  Users,
  Briefcase,
  Settings,
  FileText,
} from "lucide-react";

/* ─── Window Chrome ─────────────────────────────────────────────────── */
function WindowChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white shadow-2xl shadow-black/8 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-foreground/10" />
          <div className="w-3 h-3 rounded-full bg-foreground/10" />
          <div className="w-3 h-3 rounded-full bg-foreground/10" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-muted/60 text-xs text-muted-foreground">
            app.integratewise.io
          </div>
        </div>
        <div className="w-12" />
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DOMAIN VIEWS — L1 adapts per role/department
   ═══════════════════════════════════════════════════════════════════════ */

interface DomainView {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  sidebarItems: { label: string; active: boolean }[];
  connectors: { icon: React.FC<{ className?: string }>; label: string }[];
  tableHeader: string;
  tableCount: string;
  columns: string[];
  rows: { cells: string[]; status?: string; statusType?: "good" | "warning" | "critical" }[];
}

const domainViews: DomainView[] = [
  {
    id: "founder",
    label: "Founder",
    icon: Briefcase,
    sidebarItems: [
      { label: "Overview", active: true },
      { label: "Revenue", active: false },
      { label: "Teams", active: false },
      { label: "Compliance", active: false },
    ],
    connectors: [
      { icon: Layers, label: "Stripe: Active" },
      { icon: MessageSquare, label: "Slack: Connected" },
    ],
    tableHeader: "Business Health",
    tableCount: "5 metrics",
    columns: ["Metric", "Current", "Status", "Trend"],
    rows: [
      { cells: ["Monthly Revenue", "$284K", "On Track", "+12%"], statusType: "good" },
      { cells: ["Cash Runway", "8.2 months", "Healthy", "+0.4"], statusType: "good" },
      { cells: ["Client Retention", "87%", "Watch", "-3%"], statusType: "warning" },
      { cells: ["Team Utilization", "72%", "Low", "-8%"], statusType: "warning" },
      { cells: ["Overdue Invoices", "$61K", "Critical", "+15%"], statusType: "critical" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: TrendingUp,
    sidebarItems: [
      { label: "Pipeline", active: true },
      { label: "Leads", active: false },
      { label: "Proposals", active: false },
      { label: "Commissions", active: false },
    ],
    connectors: [
      { icon: Layers, label: "Salesforce: Active" },
      { icon: MessageSquare, label: "HubSpot: Synced" },
    ],
    tableHeader: "Active Deals",
    tableCount: "18 open",
    columns: ["Deal", "Value", "Stage", "Engagement"],
    rows: [
      { cells: ["Apex Corp — Platform", "$145K", "Proposal Sent", "High"], statusType: "good" },
      { cells: ["Nova Inc — API Suite", "$82K", "Demo Done", "Active"], statusType: "good" },
      { cells: ["Bright Co — Starter", "$23K", "Negotiation", "Cooling"], statusType: "warning" },
      { cells: ["Carter Group — Ent.", "$210K", "Legal Review", "Stalled"], statusType: "critical" },
      { cells: ["Summit Ltd — Growth", "$56K", "Qualified", "New"], statusType: "good" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Factory,
    sidebarItems: [
      { label: "Production", active: true },
      { label: "Supply Chain", active: false },
      { label: "Quality", active: false },
      { label: "Maintenance", active: false },
    ],
    connectors: [
      { icon: Settings, label: "IoT: Streaming" },
      { icon: Layers, label: "ERP: Synced" },
    ],
    tableHeader: "Production Lines",
    tableCount: "6 active",
    columns: ["Line", "Output", "Status", "ETA"],
    rows: [
      { cells: ["Line A — Order #4421", "82%", "Running", "Tomorrow"], statusType: "good" },
      { cells: ["Line B — Order #4418", "100%", "QC Pending", "Today"], statusType: "warning" },
      { cells: ["Line C — Order #4425", "45%", "Running", "3 days"], statusType: "good" },
      { cells: ["Line D — Maintenance", "0%", "Down", "2 days"], statusType: "critical" },
      { cells: ["Line E — Order #4430", "67%", "Running", "2 days"], statusType: "good" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    sidebarItems: [
      { label: "Reconciliation", active: true },
      { label: "Invoices", active: false },
      { label: "Tax Filing", active: false },
      { label: "Audit Trail", active: false },
    ],
    connectors: [
      { icon: Layers, label: "QuickBooks: Active" },
      { icon: FileText, label: "Bank: Linked" },
    ],
    tableHeader: "Reconciliation",
    tableCount: "23 items",
    columns: ["Entry", "Amount", "Match", "Source"],
    rows: [
      { cells: ["INV-2024-0891", "$12,800", "Matched", "Stripe + QB"], statusType: "good" },
      { cells: ["INV-2024-0887", "$45,200", "Overdue", "QB Only"], statusType: "critical" },
      { cells: ["INV-2024-0893", "$8,400", "Matched", "Stripe + QB"], statusType: "good" },
      { cells: ["INV-2024-0895", "$3,200", "Mismatch", "Bank ≠ QB"], statusType: "warning" },
      { cells: ["INV-2024-0899", "$23,100", "Matched", "Stripe + QB"], statusType: "good" },
    ],
  },
];

/* ─── L2 Signal types per domain ────────────────────────────────────── */
const domainSignals: Record<string, typeof signals> = {
  founder: [
    {
      type: "revenue",
      icon: AlertTriangle,
      label: "Revenue Alert",
      severity: "critical" as const,
      summary: "Carter Group — $61K overdue (Day 7, usually pays Day 3)",
      detail: 'Slack: "Will send tomorrow." 3rd time. Suggest: formal reminder with escalation.',
      actions: ["Send Reminder", "Dismiss"],
    },
    {
      type: "churn",
      icon: AlertCircle,
      label: "Engagement Drop",
      severity: "emergency" as const,
      summary: "Client retention dropped 3% — 2 relationships cooling",
      detail: "Bright Co: email response slowed 60%. Nova Inc: feature requests stopped. Revenue at risk: $105K/quarter.",
      actions: ["Review Relationships", "Escalate"],
    },
    {
      type: "compliance",
      icon: Shield,
      label: "Compliance",
      severity: "warning" as const,
      summary: "Q4 tax filing due in 12 days — 3 items need review",
      detail: "Auto-prepared draft ready. 3 mismatches flagged for manual review before submission.",
      actions: ["Review Draft", "Remind Later"],
    },
  ],
  sales: [
    {
      type: "deal",
      icon: TrendingUp,
      label: "Deal Alert",
      severity: "warning" as const,
      summary: "Bright Co engagement cooling — last interaction 5 days ago",
      detail: "Open rate dropped 40%. Decision maker hasn't viewed proposal. Pattern: at-risk deals go cold after 7 days silence.",
      actions: ["Schedule Call", "Send Follow-up"],
    },
    {
      type: "upsell",
      icon: Brain,
      label: "Upsell Signal",
      severity: "info" as const,
      summary: "Nova Inc matches Enterprise tier profile — 3 feature requests this month",
      detail: "Usage patterns, feature requests, and team size all align with Enterprise upgrade path. Estimated uplift: $40K/yr.",
      actions: ["Create Proposal", "Monitor"],
    },
    {
      type: "competitor",
      icon: AlertCircle,
      label: "Competitor Alert",
      severity: "emergency" as const,
      summary: "Carter Group evaluating competitor — meeting detected in calendar",
      detail: "Calendar sync shows 'Demo — AlternativeCo' scheduled for Friday. Current deal: $210K. Suggest pre-emptive call.",
      actions: ["Call Now", "Prepare Counter"],
    },
  ],
  operations: [
    {
      type: "machine",
      icon: AlertTriangle,
      label: "Machine Alert",
      severity: "critical" as const,
      summary: "Line D — abnormal vibration pattern detected, maintenance overdue",
      detail: "Runtime: 2,400 hrs since last service (threshold: 2,000). Historical: this pattern preceded 3 breakdowns. Cost of unplanned stop: $15K.",
      actions: ["Schedule Service", "Monitor"],
    },
    {
      type: "supply",
      icon: AlertCircle,
      label: "Supply Chain",
      severity: "emergency" as const,
      summary: "Raw material for Order #4430 — 3 days stock, supplier lead time 5 days",
      detail: "Q4 demand spike expected. If not reordered today, Line E stops in 3 days. Alternative supplier available at +8% cost.",
      actions: ["Place Order", "Check Alt Supplier"],
    },
    {
      type: "quality",
      icon: Brain,
      label: "Quality Insight",
      severity: "info" as const,
      summary: "Line A defect rate dropped 40% after calibration last week",
      detail: "Correlating: humidity was 65% during peak defects. Now 52%. Suggest: add humidity threshold alert for future prevention.",
      actions: ["Add Alert Rule", "Note"],
    },
  ],
  finance: [
    {
      type: "mismatch",
      icon: AlertTriangle,
      label: "Mismatch Found",
      severity: "critical" as const,
      summary: "INV-0895: Bank shows $3,200 but QuickBooks shows $3,450 — $250 gap",
      detail: "Possible cause: partial payment received. Bank transaction ID: TXN-88421. Suggest: check if credit note was issued.",
      actions: ["Investigate", "Flag for Review"],
    },
    {
      type: "overdue",
      icon: AlertCircle,
      label: "Overdue Invoice",
      severity: "emergency" as const,
      summary: "INV-0887: $45,200 from Apex — 12 days past due",
      detail: "Contact history: 2 reminders sent. Accounts payable contact unresponsive. Escalation to CFO recommended.",
      actions: ["Escalate", "Send Final Notice"],
    },
    {
      type: "tax",
      icon: Brain,
      label: "Tax Insight",
      severity: "warning" as const,
      summary: "Potential $8K deduction identified from uncategorized expenses",
      detail: "12 transactions tagged 'Miscellaneous' match R&D expense criteria. Reclassifying could save $8K in Q4 filing.",
      actions: ["Reclassify", "Review Later"],
    },
  ],
};

/* ─── Signal types for default ──────────────────────────────── */
const signals = [
  {
    type: "payment",
    icon: AlertTriangle,
    label: "Payment Alert",
    severity: "critical" as const,
    summary: "Carter & Sons — $61K overdue (Day 7, usually pays Day 3)",
    detail: 'Slack last msg: "Will send tomorrow." Pattern: 3rd time saying this. Suggest: Send formal reminder.',
    actions: ["Send Reminder", "Dismiss"],
  },
  {
    type: "engagement",
    icon: AlertCircle,
    label: "Engagement Drop",
    severity: "emergency" as const,
    summary: "Acme Traders engagement dropped 40% — URGENT",
    detail: "Email responses slowed, order frequency down from daily to weekly. Relationship at risk.",
    actions: ["Schedule Call", "Escalate"],
  },
  {
    type: "insight",
    icon: Brain,
    label: "Opportunity",
    severity: "info" as const,
    summary: "Bright Electronics matches upgrade profile",
    detail: "Buying pattern matches Enterprise tier profile. Suggest: Present upgrade path.",
    actions: ["Create Proposal", "Monitor"],
  },
];

/* ─── L2 Signal Bar (bottom-up cognitive panel) ────────────────────── */
function L2SignalBar({
  isInView,
  activeDomain,
}: {
  isInView: boolean;
  activeDomain: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeSignalIdx, setActiveSignalIdx] = useState(0);
  const [emergencyPulse, setEmergencyPulse] = useState(false);

  const currentSignals = domainSignals[activeDomain] || signals;
  const activeSignal = currentSignals[activeSignalIdx % currentSignals.length];

  /* Reset signal index when domain changes */
  useEffect(() => {
    setActiveSignalIdx(0);
    setExpanded(false);
  }, [activeDomain]);

  /* Auto-cycle through signals */
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveSignalIdx((prev) => {
        const next = (prev + 1) % currentSignals.length;
        const nextSig = currentSignals[next];
        if (
          nextSig.severity === "emergency" ||
          nextSig.severity === "critical"
        ) {
          setEmergencyPulse(true);
          setTimeout(() => setEmergencyPulse(false), 2000);
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isInView, currentSignals]);

  const isUrgent =
    activeSignal.severity === "emergency" ||
    activeSignal.severity === "critical";

  return (
    <div className="relative">
      {/* Emergency emission toast */}
      <AnimatePresence>
        {emergencyPulse && !expanded && (
          <motion.div
            className="absolute -top-8 left-0 right-0 flex justify-center pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="px-3 py-1 rounded-full bg-foreground text-white text-[10px] flex items-center gap-1.5"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AlertCircle className="h-3 w-3" />
              {activeSignal.summary.split("—")[0].trim()} — Tap to review
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              height: { duration: 0.4 },
            }}
            className="overflow-hidden border-b"
            style={{ transformOrigin: "bottom" }}
          >
            <div className="p-4 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="w-6 h-6 rounded-lg bg-foreground flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="h-3.5 w-3.5 text-white" />
                </motion.div>
                <span className="text-xs">Cognitive Layer</span>
                <span className="text-[10px] text-muted-foreground ml-1">
                  L2
                </span>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {currentSignals.length} active signals
                </span>
              </div>

              {/* Signal tabs */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {currentSignals.map((s, i) => (
                  <button
                    key={s.type}
                    onClick={() => setActiveSignalIdx(i)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
                      i === activeSignalIdx % currentSignals.length
                        ? s.severity === "emergency"
                          ? "bg-foreground text-white ring-1 ring-foreground/50"
                          : "bg-foreground text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <s.icon className="h-2.5 w-2.5" />
                    {s.label}
                    {(s.severity === "emergency" ||
                      s.severity === "critical") && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Active signal detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSignal.type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg border ${
                    activeSignal.severity === "emergency"
                      ? "bg-foreground/5 border-foreground/20"
                      : "bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <activeSignal.icon className="h-3.5 w-3.5" />
                    <span className="text-xs">{activeSignal.label}</span>
                    {activeSignal.severity === "emergency" && (
                      <motion.span
                        className="text-[9px] px-1.5 py-0.5 rounded bg-foreground text-white"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        URGENT
                      </motion.span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1">
                    {activeSignal.summary}
                  </p>
                  <p className="text-[10px] text-muted-foreground mb-3">
                    {activeSignal.detail}
                  </p>
                  <div className="flex gap-1.5">
                    {activeSignal.actions.map((action, ai) => (
                      <button
                        key={action}
                        className={`px-2.5 py-1 rounded text-[10px] transition-colors ${
                          ai === 0
                            ? "bg-foreground text-white hover:bg-foreground/90"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-3 flex items-center gap-2 text-[9px] text-muted-foreground">
                <Shield className="h-2.5 w-2.5" />
                Every action requires your approval. Full evidence trail
                recorded.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signal Relay Bar (always visible at bottom) */}
      <motion.div
        className="relative cursor-pointer select-none overflow-hidden bg-foreground text-white"
        onClick={() => setExpanded(!expanded)}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        {/* Pulsing rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border ${
                isUrgent ? "border-white/50" : "border-white/30"
              }`}
              animate={{
                scale: [1, 3, 5],
                opacity: [0.4, 0.15, 0],
              }}
              transition={{
                duration: isUrgent ? 1.5 : 2.5,
                repeat: Infinity,
                delay: ring * (isUrgent ? 0.5 : 0.8),
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 relative z-10">
          <div className="relative flex items-center justify-center">
            <motion.div
              className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: isUrgent ? 0.8 : 1.5,
                repeat: Infinity,
              }}
            >
              <Zap className="h-3 w-3 text-white" />
            </motion.div>
          </div>

          {/* Signal dots */}
          <div className="flex items-center gap-1.5">
            {currentSignals.map((s, i) => (
              <motion.div
                key={s.type}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  i === activeSignalIdx % currentSignals.length
                    ? "bg-white"
                    : "bg-white/30"
                }`}
                animate={
                  i === activeSignalIdx % currentSignals.length
                    ? { scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }
                    : {}
                }
                transition={{ duration: 1.2, repeat: Infinity }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSignalIdx(i);
                  if (!expanded) setExpanded(true);
                }}
              />
            ))}
          </div>

          {/* Active signal summary */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <activeSignal.icon className="h-3 w-3 shrink-0 text-white/70" />
            <span className="text-[11px] text-white/80 truncate">
              {activeSignal.summary}
            </span>
          </div>

          {/* Pull-up indicator */}
          <div className="flex items-center gap-2">
            <motion.span
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentSignals.length} signals
            </motion.span>
            <motion.div
              animate={{
                rotate: expanded ? 180 : 0,
                y: expanded ? 0 : [0, -2, 0],
              }}
              transition={
                expanded
                  ? { duration: 0.25 }
                  : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ChevronUp className="h-3 w-3 text-white/70" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   L1 — Multi-Domain WorkspaceScreen
   L1 changes per role. L2 shows cognitive signals from the Spine.
   ═══════════════════════════════════════════════════════════════════════ */
export function WorkspaceScreen() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);

  /* Auto-cycle domains every 6 seconds */
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveDomainIdx((prev) => (prev + 1) % domainViews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isInView]);

  const domain = domainViews[activeDomainIdx];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      style={{ perspective: 1200 }}
    >
      <WindowChrome>
        <div className="flex flex-col">
          {/* Domain switcher strip — shows L1 adapts per role */}
          <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/10 overflow-x-auto">
            <span className="text-[9px] text-muted-foreground mr-2 shrink-0 uppercase tracking-wider">
              L1 Workspace:
            </span>
            {domainViews.map((dv, i) => (
              <motion.button
                key={dv.id}
                onClick={() => setActiveDomainIdx(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] transition-all shrink-0 ${
                  i === activeDomainIdx
                    ? "bg-foreground text-white"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <dv.icon className="h-3 w-3" />
                {dv.label}
              </motion.button>
            ))}
            <motion.div
              className="ml-auto flex items-center gap-1 text-[9px] text-muted-foreground shrink-0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </motion.div>
          </div>

          <div className="flex min-h-[320px]">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={domain.id + "-sidebar"}
                className="w-44 border-r bg-muted/20 p-4 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Logo variant="mark" className="h-6 w-auto text-foreground" />
                </div>
                <nav className="space-y-0.5">
                  {domain.sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`px-3 py-2 rounded-md text-xs transition-colors ${
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </nav>
                <div className="mt-6 pt-4 border-t">
                  {domain.connectors.map((c) => (
                    <div
                      key={c.label}
                      className="px-3 py-2 rounded-md text-[11px] text-muted-foreground flex items-center gap-2"
                    >
                      <c.icon className="h-3 w-3" />
                      {c.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* L1 Main content */}
            <div className="flex-1 p-4 md:p-5">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={domain.id + "-header"}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="text-sm">{domain.tableHeader}</h3>
                    <span className="text-xs text-muted-foreground">
                      {domain.tableCount}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    <Search className="h-3 w-3" />
                    <span className="hidden sm:inline">Search...</span>
                  </div>
                  <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center relative">
                    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-foreground"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={domain.id + "-table"}
                  className="border rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="grid gap-px bg-muted/50 px-4 py-2 text-[11px] text-muted-foreground"
                    style={{
                      gridTemplateColumns: `repeat(${domain.columns.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {domain.columns.map((col) => (
                      <span key={col}>{col}</span>
                    ))}
                  </div>
                  {domain.rows.map((row, i) => (
                    <motion.div
                      key={row.cells[0]}
                      className="grid gap-px px-4 py-2.5 border-t text-xs items-center hover:bg-muted/20 transition-colors cursor-pointer"
                      style={{
                        gridTemplateColumns: `repeat(${domain.columns.length}, minmax(0, 1fr))`,
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.5 + i * 0.08,
                        duration: 0.4,
                      }}
                    >
                      <span className="truncate">{row.cells[0]}</span>
                      <span className="font-mono">{row.cells[1]}</span>
                      <span>
                        {row.statusType === "good" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px]">
                            <CheckCircle2 className="h-2.5 w-2.5" />{" "}
                            {row.cells[2]}
                          </span>
                        )}
                        {row.statusType === "warning" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                            <AlertTriangle className="h-2.5 w-2.5" />{" "}
                            {row.cells[2]}
                          </span>
                        )}
                        {row.statusType === "critical" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-foreground text-primary-foreground text-[10px]">
                            <AlertTriangle className="h-2.5 w-2.5" />{" "}
                            {row.cells[2]}
                          </span>
                        )}
                      </span>
                      <span
                        className={`hidden sm:block ${
                          row.cells[3]?.startsWith("+") ||
                          row.cells[3]?.startsWith("High") ||
                          row.cells[3]?.startsWith("Active") ||
                          row.cells[3]?.startsWith("New") ||
                          row.cells[3] === "Tomorrow" ||
                          row.cells[3] === "Today"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {row.cells[3]}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* L2: Cognitive Signal Bar at bottom */}
          <L2SignalBar isInView={isInView} activeDomain={domain.id} />
        </div>
      </WindowChrome>

      {/* Layer labels */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="w-3 h-1.5 rounded-full bg-muted" />
          <span>
            <strong className="text-foreground">L1</strong> — Workspace Layer
            (adapts per role)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="w-3 h-1.5 rounded-full bg-foreground" />
          <span>
            <strong className="text-foreground">L2</strong> — Cognitive Layer
            (the Spine's signals)
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Spine Visualization (Sources → Engine → Views) with animated flow
   ═══════════════════════════════════════════════════════════════════════ */
export function SpineVisualization() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fields = [
    "entity_name",
    "entity_type",
    "status",
    "amount",
    "due_date",
    "last_interaction",
    "health_score",
    "linked_tools",
    "department",
    "follow_up_due",
    "risk_level",
    "audit_trail",
  ];

  const sources: { name: string; Logo?: React.FC<{ size?: number }> }[] = [
    { name: "Salesforce", Logo: SalesforceLogo },
    { name: "Slack", Logo: SlackLogo },
    { name: "Stripe", Logo: StripeLogo },
    { name: "Jira", Logo: JiraLogo },
    { name: "CSV/API" },
  ];

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border bg-white shadow-xl shadow-black/5 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="px-5 py-4 border-b bg-muted/20 flex items-center gap-3">
        <Layers className="h-4 w-4" />
        <span className="text-sm">The Spine — Connected Intelligence</span>
        <span className="ml-auto text-xs text-muted-foreground">
          Universal Data Layer
        </span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Sources */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Data Sources
            </p>
            {sources.map((src, i) => (
              <motion.div
                key={src.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              >
                {src.Logo ? (
                  <src.Logo size={16} />
                ) : (
                  <Circle className="h-3 w-3 fill-foreground/30 text-foreground/30" />
                )}
                {src.name}
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground/40"
                  animate={
                    isInView ? { opacity: [0, 1, 0], x: [0, 10, 20] } : {}
                  }
                  transition={{
                    delay: 0.8 + i * 0.3,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2 + i,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Engine Core */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              The Spine (One Truth)
            </p>
            <div className="inline-flex flex-wrap gap-1 justify-center max-w-[220px]">
              {fields.map((f, i) => (
                <motion.span
                  key={f}
                  className="px-1.5 py-0.5 rounded bg-primary/8 text-[9px] text-foreground/70"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.04, duration: 0.3 }}
                >
                  {f}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Output Views */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Role-Specific Views
            </p>
            {[
              "Founder Overview",
              "Sales Pipeline",
              "Operations Dashboard",
              "Finance & Compliance",
              "Morning Brief",
            ].map((view, i) => (
              <motion.div
                key={view}
                className="flex items-center justify-end gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                {view}
                <ArrowUpRight className="h-2.5 w-2.5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Combined Hero Workspace
   ═══════════════════════════════════════════════════════════════════════ */
export function HeroWorkspace() {
  return (
    <div className="relative max-w-5xl mx-auto">
      <WorkspaceScreen />
    </div>
  );
}