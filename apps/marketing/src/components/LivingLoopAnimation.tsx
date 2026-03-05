import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Layers,
  Database,
  Brain,
  Lightbulb,
  Play,
  RefreshCcw,
  ChevronRight,
  Plug,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  SalesforceLogo,
  SlackLogo,
  StripeLogo,
  JiraLogo,
  ShopifyLogo,
  GoogleSheetsLogo,
  QuickBooksLogo,
  HubSpotLogo,
  GitHubLogo,
  WhatsAppLogo,
} from "./ToolLogos";

/* ═══════════════════════════════════════════════════════════════════════
   THE LIVING LOOP — Interactive SVG-based animation
   Shows: Connect → Load → Normalize → Store → Think → Decide → Act → Adjust → Repeat
   ═══════════════════════════════════════════════════════════════════════ */

const stages = [
  {
    id: "connect",
    icon: Plug,
    label: "Connect",
    desc: "Your tools plug in with one click. No migration. No coding.",
    color: "#0a0a0a",
  },
  {
    id: "load",
    icon: Upload,
    label: "Load",
    desc: "Data flows in from 200+ tools simultaneously.",
    color: "#0a0a0a",
  },
  {
    id: "normalize",
    icon: Layers,
    label: "Clean",
    desc: "Messy data is automatically cleaned, matched, and organized.",
    color: "#0a0a0a",
  },
  {
    id: "store",
    icon: Database,
    label: "Remember",
    desc: "Everything stored as one connected truth. Encrypted. Fast.",
    color: "#0a0a0a",
  },
  {
    id: "think",
    icon: Brain,
    label: "Understand",
    desc: "Recognizes that 'J. Smith' in CRM is 'john@acme.com' in email.",
    color: "#0a0a0a",
  },
  {
    id: "decide",
    icon: Lightbulb,
    label: "Suggest",
    desc: "Surfaces what needs attention. Waits for your approval.",
    color: "#0a0a0a",
  },
  {
    id: "act",
    icon: Play,
    label: "Act",
    desc: "One tap to resolve. Updates flow back to your tools instantly.",
    color: "#0a0a0a",
  },
  {
    id: "adjust",
    icon: RefreshCcw,
    label: "Learn",
    desc: "Gets smarter from your decisions. Every cycle, sharper.",
    color: "#0a0a0a",
  },
];

/* Tool connector icons for the "Connect" stage animation */
const connectorTools = [
  { Logo: SalesforceLogo, name: "Salesforce" },
  { Logo: SlackLogo, name: "Slack" },
  { Logo: StripeLogo, name: "Stripe" },
  { Logo: JiraLogo, name: "Jira" },
  { Logo: ShopifyLogo, name: "Shopify" },
  { Logo: GoogleSheetsLogo, name: "Sheets" },
  { Logo: QuickBooksLogo, name: "QuickBooks" },
  { Logo: HubSpotLogo, name: "HubSpot" },
  { Logo: GitHubLogo, name: "GitHub" },
  { Logo: WhatsAppLogo, name: "WhatsApp" },
];

/* ─── Connector Plugging Animation ───────────────────────────────────── */
function ConnectorAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2">
      {connectorTools.map((tool, i) => (
        <motion.div
          key={tool.name}
          className="relative"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={
            isActive
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 },
                }
              : { opacity: 0.3, scale: 0.8, y: 0 }
          }
        >
          <tool.Logo size={28} />
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-foreground flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, type: "spring" }}
            >
              <CheckCircle2 className="h-2 w-2 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Data Flow Particles (SVG-based) ────────────────────────────────── */
function DataFlowDots({
  from,
  to,
  active,
}: {
  from: number;
  to: number;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <>
      {[0, 1, 2].map((dot) => (
        <motion.circle
          key={dot}
          r={2}
          fill="#0a0a0a"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            cx: [from, (from + to) / 2, to],
          }}
          transition={{
            duration: 1.2,
            delay: dot * 0.3,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Living Loop Component
   ═══════════════════════════════════════════════════════════════════════ */
export function LivingLoopAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeStage, setActiveStage] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  /* Auto-advance through stages */
  useEffect(() => {
    if (!isInView || !isAutoPlaying) return;

    // Start after a brief delay
    const startDelay = setTimeout(() => {
      setActiveStage(0);
    }, 600);

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % stages.length;
        return next;
      });
    }, 2500);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, [isInView, isAutoPlaying]);

  const handleStageClick = (i: number) => {
    setIsAutoPlaying(false);
    setActiveStage(i);
    // Resume auto-play after 8 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div ref={ref} className="w-full">
      <motion.div
        className="rounded-2xl border bg-white shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-muted/20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          </div>
          <span className="text-[10px] text-muted-foreground ml-2">
            The Living Loop — Connect → Load → Normalize → Store → Think →
            Decide → Act → Adjust → Repeat
          </span>
          <motion.div
            className="ml-auto flex items-center gap-1 text-[9px] text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Running
          </motion.div>
        </div>

        <div className="p-5 md:p-8">
          {/* Stage progress bar */}
          <div className="relative mb-6">
            {/* Background track */}
            <div className="h-1 bg-muted rounded-full" />
            {/* Progress fill */}
            <motion.div
              className="absolute top-0 left-0 h-1 bg-foreground rounded-full"
              animate={{
                width:
                  activeStage >= 0
                    ? `${((activeStage + 1) / stages.length) * 100}%`
                    : "0%",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Stage dots on the track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
              {stages.map((stage, i) => {
                const isActive = i === activeStage;
                const isPast = i < activeStage;

                return (
                  <motion.button
                    key={stage.id}
                    onClick={() => handleStageClick(i)}
                    className={`relative w-5 h-5 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-foreground border-foreground scale-125"
                        : isPast
                          ? "bg-foreground border-foreground"
                          : "bg-white border-muted-foreground/20"
                    }`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-foreground/30"
                        animate={{ scale: [1, 2, 2.5], opacity: [0.4, 0.1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Stage labels row */}
          <div className="grid grid-cols-8 gap-1 mb-8">
            {stages.map((stage, i) => {
              const isActive = i === activeStage;
              const isPast = i < activeStage;

              return (
                <motion.button
                  key={stage.id}
                  onClick={() => handleStageClick(i)}
                  className={`text-center cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "opacity-100"
                      : isPast
                        ? "opacity-60"
                        : "opacity-30"
                  }`}
                >
                  <motion.div
                    className={`w-9 h-9 rounded-xl mx-auto mb-1.5 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-foreground text-white shadow-lg"
                        : isPast
                          ? "bg-foreground/80 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: isActive ? Infinity : 0,
                    }}
                  >
                    <stage.icon className="h-4 w-4" />
                  </motion.div>
                  <span
                    className={`text-[9px] md:text-[10px] block ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Active stage visualization */}
          <AnimatePresence mode="wait">
            {activeStage >= 0 && (
              <motion.div
                key={stages[activeStage].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border bg-muted/20 p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                    {(() => {
                      const StageIcon = stages[activeStage].icon;
                      return <StageIcon className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-sm">
                      {stages[activeStage].label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Stage {activeStage + 1} of {stages.length}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <motion.div
                      className="flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-1 rounded-full bg-muted"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-2.5 w-2.5" />
                      Processing
                    </motion.div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {stages[activeStage].desc}
                </p>

                {/* Stage-specific visualization */}
                {activeStage === 0 && (
                  <ConnectorAnimation isActive={true} />
                )}

                {activeStage === 1 && (
                  <div className="flex items-center justify-center gap-3 py-3">
                    {["CRM Data", "Chat Messages", "Payments", "Code Commits", "Spreadsheets"].map(
                      (source, i) => (
                        <motion.div
                          key={source}
                          className="flex flex-col items-center gap-1"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <motion.div
                            className="w-16 h-8 rounded-lg bg-muted/80 border flex items-center justify-center"
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              duration: 1.5 + i * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <span className="text-[8px] text-muted-foreground">
                              {source}
                            </span>
                          </motion.div>
                          <motion.div
                            className="w-0.5 h-4 bg-foreground/20"
                            animate={{ scaleY: [0, 1, 0] }}
                            transition={{
                              duration: 1,
                              delay: i * 0.15,
                              repeat: Infinity,
                            }}
                          />
                        </motion.div>
                      )
                    )}
                  </div>
                )}

                {activeStage === 2 && (
                  <div className="space-y-2 py-2">
                    {[
                      "Analyze — What is this data?",
                      "Classify — Where does it go?",
                      "Filter — Remove duplicates",
                      "Refine — Standardize formats",
                      "Extract — Pull key entities",
                      "Validate — Check for errors",
                      "Sanity — Does this make sense?",
                      "Route — Send to right view",
                    ].map((step, i) => (
                      <motion.div
                        key={step}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: i * 0.08 + 0.1,
                            type: "spring",
                          }}
                        >
                          <span className="text-[7px] text-white">
                            {i + 1}
                          </span>
                        </motion.div>
                        <span className="text-[11px] text-muted-foreground">
                          {step}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeStage === 3 && (
                  <div className="flex items-center justify-center py-4">
                    <motion.div
                      className="relative w-40 h-40 rounded-2xl bg-foreground flex items-center justify-center"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="text-center">
                        <Database className="h-8 w-8 text-white/80 mx-auto mb-2" />
                        <p className="text-[10px] text-white/80">Connected Memory</p>
                        <p className="text-[8px] text-white/40">
                          One truth · Encrypted
                        </p>
                      </div>
                      {/* Orbiting data points */}
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-white/50"
                          animate={{
                            rotate: [i * 60, i * 60 + 360],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{
                            transformOrigin: "80px 80px",
                            top: "50%",
                            left: "50%",
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}

                {activeStage === 4 && (
                  <div className="py-3">
                    <svg
                      viewBox="0 0 400 120"
                      className="w-full"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Entity nodes */}
                      {[
                        { x: 60, y: 30, label: "'R. Chen' in Slack" },
                        { x: 200, y: 60, label: "Rachel Chen" },
                        { x: 340, y: 30, label: "'rahul@' in Email" },
                        { x: 100, y: 100, label: "Invoice #891" },
                        { x: 300, y: 100, label: "Jira Task #234" },
                      ].map((node, i) => (
                        <g key={node.label}>
                          <motion.rect
                            x={node.x - 55}
                            y={node.y - 12}
                            width={110}
                            height={24}
                            rx={6}
                            fill={i === 1 ? "#0a0a0a" : "#f4f4f5"}
                            stroke={i === 1 ? "#0a0a0a" : "#e4e4e7"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                          />
                          <motion.text
                            x={node.x}
                            y={node.y + 4}
                            textAnchor="middle"
                            fill={i === 1 ? "white" : "#71717a"}
                            fontSize="8"
                            fontFamily="Inter, sans-serif"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.12 + 0.2 }}
                          >
                            {node.label}
                          </motion.text>
                          {/* Connection lines to center node */}
                          {i !== 1 && (
                            <motion.line
                              x1={node.x}
                              y1={node.y}
                              x2={200}
                              y2={60}
                              stroke="#d4d4d8"
                              strokeWidth={1}
                              strokeDasharray="3 3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                            />
                          )}
                        </g>
                      ))}
                    </svg>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                      Entities linked across tools — not just data, but
                      relationships
                    </p>
                  </div>
                )}

                {activeStage === 5 && (
                  <div className="space-y-2 py-2">
                    {[
                      {
                        label: "Payment overdue: Send reminder?",
                        status: "Awaiting approval",
                      },
                      {
                        label: "Engagement dropping: Schedule call?",
                        status: "Awaiting approval",
                      },
                      {
                        label: "Stock low: Reorder suggested",
                        status: "Awaiting approval",
                      },
                    ].map((action, i) => (
                      <motion.div
                        key={action.label}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white border"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                      >
                        <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs flex-1">{action.label}</span>
                        <motion.span
                          className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {action.status}
                        </motion.span>
                      </motion.div>
                    ))}
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                      AI never acts alone. Every action waits for your confirmation.
                    </p>
                  </div>
                )}

                {activeStage === 6 && (
                  <div className="py-3">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {[
                        "CRM updated",
                        "Reminder sent",
                        "Task created",
                        "Log recorded",
                      ].map((action, i) => (
                        <motion.div
                          key={action}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border text-xs"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: i * 0.15,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.15 + 0.2, type: "spring" }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                          </motion.div>
                          {action}
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-3">
                      Bi-directional sync — writes back to your tools in under
                      200ms
                    </p>
                  </div>
                )}

                {activeStage === 7 && (
                  <div className="py-3 text-center">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-white text-xs mb-3"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Learning from your decisions...
                    </motion.div>
                    <div className="flex items-center justify-center gap-4 flex-wrap mt-3">
                      {[
                        "Ignored alert → tuned down",
                        "Acted on warning → priority up",
                        "Pattern confirmed → refined model",
                      ].map((learning, i) => (
                        <motion.div
                          key={learning}
                          className="text-[10px] text-muted-foreground px-3 py-1.5 rounded-lg bg-muted/50"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.15 }}
                        >
                          {learning}
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-4">
                      Every cycle, the system becomes more "you." Then it starts
                      again.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Repeat indicator */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-5 text-[10px] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            <RefreshCcw className="h-3 w-3" />
            <span>
              This loop runs continuously. Every second. Every minute. Every
              day.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}