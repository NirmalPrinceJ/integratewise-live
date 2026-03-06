import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import {
  MessageSquare,
  FileSpreadsheet,
  Phone,
  Calculator,
  Clock,
  AlertTriangle,
  Frown,
  ArrowRight,
  CheckCircle2,
  Zap,
  Brain,
  Eye,
  Shield,
  TrendingUp,
  Smile,
  Smartphone,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   Visual Infographic — From Chaos to Clarity
   Google NotebookLM-style visual storytelling of user pain → solution
   ═══════════════════════════════════════════════════════════════════════ */

const personas = [
  {
    role: "Founder",
    chaos: {
      apps: ["Accounting", "Messaging", "CRM", "Sheets"],
      pain: "Opens 4 apps every morning. By the time he pieces together yesterday's reality, it's already 11 AM.",
      visual: [
        { icon: Calculator, label: "Accounting", x: 15, y: 20 },
        { icon: MessageSquare, label: "Messaging", x: 65, y: 10 },
        { icon: FileSpreadsheet, label: "Sheets", x: 35, y: 70 },
        { icon: Phone, label: "Calls", x: 75, y: 65 },
      ],
      stat: "4 apps",
      statLabel: "before first decision",
      time: "2+ hours",
      timeLabel: "daily context-switching",
    },
    clarity: {
      headline: "One morning brief. One screen. One truth.",
      features: [
        "Cash flow, team health, customer metrics — all visible at 9 AM",
        "Morning Brief: payments received, follow-ups due, compliance countdown",
        "AI flags anomalies before they become problems",
      ],
      stat: "30 sec",
      statLabel: "to full business picture",
    },
  },
  {
    role: "Sales Exec",
    chaos: {
      apps: ["CRM", "Accounting", "Chat", "Notes"],
      pain: "Customer calls — scrambles through 3 apps to find their history. By the time he responds, competitor already quoted.",
      visual: [
        { icon: Phone, label: "Client Call", x: 50, y: 15 },
        { icon: Calculator, label: "Billing", x: 20, y: 50 },
        { icon: MessageSquare, label: "Chat History", x: 75, y: 45 },
        { icon: FileSpreadsheet, label: "Lead Sheet", x: 40, y: 75 },
      ],
      stat: "15 min",
      statLabel: "to answer one query",
      time: "50+",
      timeLabel: "app switches per day",
    },
    clarity: {
      headline: "Customer calls. Full context appears instantly.",
      features: [
        "Caller ID triggers complete file: invoices, chats, last order, payment history",
        "AI suggests: 'This customer usually orders monthly. It's been 6 weeks.'",
        "One-tap WhatsApp follow-up with auto-drafted message",
      ],
      stat: "30 sec",
      statLabel: "to full customer context",
    },
  },
  {
    role: "Accountant",
    chaos: {
      apps: ["Accounting", "Tax Portal", "Bank", "Email"],
      pain: "Month-end: 3 days just collating data before analysis can begin. Tax filing always a last-minute scramble.",
      visual: [
        { icon: Calculator, label: "Accounting", x: 25, y: 20 },
        { icon: Shield, label: "Tax Portal", x: 70, y: 15 },
        { icon: FileSpreadsheet, label: "Bank Stmt", x: 15, y: 65 },
        { icon: MessageSquare, label: "Client Queries", x: 65, y: 70 },
      ],
      stat: "3 days",
      statLabel: "of manual reconciliation",
      time: "Weekend",
      timeLabel: "work every month-end",
    },
    clarity: {
      headline: "Auto-reconciled. Auto-tagged. Always ready.",
      features: [
        "Accounting + Bank auto-reconciled — only mismatches flagged for review",
        "Tax data auto-tagged with proper codes and categories",
        "AI drafts replies to client queries using their own data",
      ],
      stat: "60%",
      statLabel: "less month-end time",
    },
  },
  {
    role: "Factory Owner",
    chaos: {
      apps: ["Messaging", "Accounting", "Phone", "Ledger"],
      pain: "Trader calls: 'Is my order ready?' Owner calls supervisor. Supervisor checks. Calls back in 30 minutes. Customer thinks it's chaos.",
      visual: [
        { icon: Phone, label: "Trader Calls", x: 50, y: 10 },
        { icon: MessageSquare, label: "Group Chats", x: 20, y: 40 },
        { icon: Calculator, label: "Billing PC", x: 75, y: 55 },
        { icon: FileSpreadsheet, label: "Manual Log", x: 35, y: 75 },
      ],
      stat: "30 min",
      statLabel: "for a simple status update",
      time: "No",
      timeLabel: "real-time visibility",
    },
    clarity: {
      headline: "Open phone. See production status. Tap — dealer gets update.",
      features: [
        "Machine status, production %, expected dispatch — all on mobile",
        "One tap sends SMS update to customer with tracking link",
        "AI warns: 'Raw material for next order is 2 days late'",
      ],
      stat: "10 sec",
      statLabel: "from query to answer",
    },
  },
];

function ChaosCloud({
  items,
  isInView,
}: {
  items: { icon: any; label: string; x: number; y: number }[];
  isInView: boolean;
}) {
  return (
    <div className="relative w-full h-40 rounded-xl bg-muted/30 border border-dashed border-foreground/10 overflow-hidden">
      {/* Tangled lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {items.map((a, i) =>
          items.slice(i + 1).map((b, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={1}
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
            />
          ))
        )}
      </svg>

      {/* Scattered app icons */}
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  scale: 1,
                  x: [0, (Math.random() - 0.5) * 6, 0],
                  y: [0, (Math.random() - 0.5) * 6, 0],
                }
              : {}
          }
          transition={{
            delay: 0.2 + i * 0.1,
            duration: 0.5,
            x: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 2.5 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="w-9 h-9 rounded-lg bg-white border shadow-sm flex items-center justify-center">
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-[9px] text-muted-foreground">{item.label}</span>
        </motion.div>
      ))}

      {/* Frustration indicator */}
      <motion.div
        className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/5 text-[9px] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <Frown className="h-3 w-3" />
        Disconnected
      </motion.div>
    </div>
  );
}

function ClarityView({
  features,
  isInView,
}: {
  features: string[];
  isInView: boolean;
}) {
  return (
    <div className="relative w-full h-40 rounded-xl bg-foreground overflow-hidden p-4 flex flex-col justify-between">
      {/* Unified flow lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        <motion.path
          d="M 0 80 Q 80 60, 160 80 Q 240 100, 320 70 Q 400 50, 480 80"
          fill="none"
          stroke="white"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
      </svg>

      <div className="relative z-10 space-y-2">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
          >
            <CheckCircle2 className="h-3 w-3 text-white/60 shrink-0 mt-0.5" />
            <span className="text-[10px] text-white/80 leading-snug">{f}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 flex items-center gap-1 text-[9px] text-white/50"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
      >
        <Smile className="h-3 w-3" />
        One unified workspace
      </motion.div>
    </div>
  );
}

export function ChaosToClarity() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activePersona, setActivePersona] = useState(0);
  const persona = personas[activePersona];

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted text-xs text-muted-foreground mb-4">
            <Eye className="h-3 w-3" />
            Visual Transformation
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
            See the chaos. Then see it{" "}
            <span className="italic">disappear</span>.
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Every role in your business suffers from the same disease: scattered
            data across disconnected apps. Here is what that looks like — and how
            it changes.
          </p>
        </motion.div>

        {/* Persona tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {personas.map((p, i) => (
            <motion.button
              key={p.role}
              onClick={() => setActivePersona(i)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                i === activePersona
                  ? "bg-foreground text-white shadow-lg"
                  : "bg-white border text-muted-foreground hover:border-foreground/30"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {p.role}
            </motion.button>
          ))}
        </div>

        {/* Infographic card */}
        <motion.div
          key={persona.role}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border bg-white shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-0">
              {/* ── LEFT: Chaos ───────────────────────────── */}
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Before — The Chaos
                  </span>
                </div>

                <ChaosCloud items={persona.chaos.visual} isInView={isInView} />

                <p className="text-sm text-muted-foreground mt-4 mb-4">
                  {persona.chaos.pain}
                </p>

                {/* Pain stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 border p-3 text-center">
                    <motion.p
                      className="text-2xl tracking-tight"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      {persona.chaos.stat}
                    </motion.p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {persona.chaos.statLabel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/50 border p-3 text-center">
                    <motion.p
                      className="text-2xl tracking-tight"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      {persona.chaos.time}
                    </motion.p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {persona.chaos.timeLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Clarity ────────────────────────── */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-foreground"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs uppercase tracking-wider">
                    After — The Clarity
                  </span>
                </div>

                <ClarityView
                  features={persona.clarity.features}
                  isInView={isInView}
                />

                <p className="text-sm mt-4 mb-4">{persona.clarity.headline}</p>

                {/* Outcome stat */}
                <div className="rounded-xl bg-foreground text-white p-4 text-center">
                  <motion.p
                    className="text-3xl tracking-tight"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  >
                    {persona.clarity.stat}
                  </motion.p>
                  <p className="text-[10px] text-white/60 mt-1">
                    {persona.clarity.statLabel}
                  </p>
                </div>

                {/* Transformation arrow */}
                <motion.div
                  className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1 }}
                >
                  <Zap className="h-3 w-3" />
                  Powered by the Cognitive Engine
                </motion.div>
              </div>
            </div>

            {/* Bottom transformation bar */}
            <div className="bg-muted/30 border-t px-6 md:px-8 py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-6">
                  {[
                    { icon: Brain, label: "AI Context" },
                    { icon: Shield, label: "Compliant" },
                    { icon: Smartphone, label: "Works Anywhere" },
                    { icon: TrendingUp, label: "Predictive" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
                      initial={{ opacity: 0, y: 5 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </motion.div>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Same platform. Every role. Every industry.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}