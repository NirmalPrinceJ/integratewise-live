import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router";
import { FadeIn, StaggerChildren, StaggerItem } from "../motion/AnimateIn";
import { PersonaCardsSection } from "../PersonaCards";
import { DataCounter } from "../AnimatedInfographic";
import { ToolLogoBar } from "../ToolLogos";
import { LivingLoopAnimation } from "../LivingLoopAnimation";
import { HeroWorkspace } from "../workspace/WorkspaceScreen";
import { SSOTExplainer } from "../SSOTExplainer";
import {
  ArrowRight, Brain, Eye, Stethoscope, ShoppingBag, Factory,
  GraduationCap, Car, Briefcase, Layers, Scale, Home, Zap, Activity,
  Users, Shield, ChevronRight, Sparkles, Database, Link2, Unplug,
  AlertTriangle, RefreshCw, Workflow, HeartPulse, Target,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   Float — gentle anti-gravity drift on any element
   ═══════════════════════════════════════════════════════════════════════ */
function Float({ children, delay = 0, duration = 6, y = 10, className = "" }: {
  children: React.ReactNode; delay?: number; duration?: number; y?: number; className?: string;
}) {
  return (
    <motion.div className={className}
      animate={{ y: [-y / 2, y / 2, -y / 2] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ACT I — HERO
   ═══════════════════════════════════════════════════════════════════════ */
function GlobalProblemHero() {
  return (
    <section className="relative pt-32 pb-28 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Minimal badge */}
          <FadeIn className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-emerald-600/[0.06] border border-emerald-600/[0.1]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ag-pulse-dot" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">The Disconnection Era</span>
            </div>
          </FadeIn>

          {/* HUGE headline — Antigravity-style clean bold */}
          <motion.h1
            className="mb-8"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Your Tools Don't Talk
            <br className="hidden sm:block" />
            to Each Other.
            <br />
            <span className="italic" style={{ color: 'var(--muted-foreground)' }}>You Do. All Day.</span>
          </motion.h1>

          <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-14">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Two phones. Three chat apps. Four storage drives. Five AI tools.
              Fifteen browser tabs. Zero connected outcome. Sound familiar?
            </p>
          </FadeIn>

          {/* High Impact Hero CTA */}
          <FadeIn delay={0.5} className="flex flex-col items-center justify-center gap-4 mb-24">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-full px-8 sm:px-10 py-6 sm:py-7 bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl text-base sm:text-[17px] font-medium w-full sm:w-auto"
                asChild
              >
                <a href="https://app.integratewise.com" target="_blank" rel="noopener noreferrer">
                  Stop Being the Human Cable <ArrowRight className="ml-3 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-[13px] sm:text-sm text-muted-foreground mt-2">
              <span>Start free. No credit card required.</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-emerald-600/20" />
              <Link to="/platform" className="hover:text-emerald-700 transition-colors underline underline-offset-4 font-medium">
                Explore Use Cases
              </Link>
            </div>
          </FadeIn>

          {/* Stat badges — clean, Antigravity-matched */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { number: "15+", label: "Tools per person daily", icon: Unplug, d: 0 },
              { number: "4hrs", label: "Lost to context-switching", icon: RefreshCw, d: 0.8 },
              { number: "73%", label: "Of data sits disconnected", icon: AlertTriangle, d: 1.6 },
              { number: "$0", label: "Connected outcome", icon: Target, d: 2.4 },
            ].map((stat, i) => (
              <Float key={stat.label} delay={stat.d} duration={5 + i * 0.5} y={6}>
                <motion.div
                  className="px-4 py-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-600/[0.08] shadow-[0_1px_3px_rgba(5,150,105,0.06)] group cursor-default hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center bg-emerald-600/[0.08]">
                    <stat.icon className="h-4 w-4 text-foreground/50" />
                  </div>
                  <p className="text-2xl tracking-tight">{stat.number}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              </Float>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DARK PRODUCT SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function DarkProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="px-4 lg:px-8 pb-8" ref={ref}>
      <motion.div
        className="ag-rounded-section bg-emerald-900 text-white relative overflow-hidden max-w-[1400px] mx-auto ag-shimmer"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Vibrant background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.06] blur-[120px]"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[100px]"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
            style={{ background: "rgba(219,39,119,0.03)" }}
            animate={{ x: [0, -20, 20, 0], y: [0, 30, -10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 py-24 lg:py-36">
          <div className="container mx-auto px-6 lg:px-10">
            {/* Solution reveal */}
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Float delay={0} duration={4} y={8}>
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center mx-auto mb-8"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="h-7 w-7 text-white/80" />
                </motion.div>
              </Float>

              <motion.p
                className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                Not Another App
              </motion.p>

              <motion.h2
                className="text-3xl md:text-4xl lg:text-[3.25rem] tracking-[-0.02em] mb-6 leading-[1.12] font-semibold"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.8 }}
              >
                We Didn't Build Another Tool.
                <br className="hidden sm:block" />
                <span className="italic text-white/50 font-normal">We Built the Context Layer.</span>
              </motion.h2>

              <motion.p
                className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                IntegrateWise is the world's first AI-powered Knowledge Workspace. It doesn't replace any tool or ask you to move your data. It sits quietly across your email, chat, drive, and files—and makes them aware of each other.
              </motion.p>

              {/* Value pills with color accents */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
                {[
                  { text: "Nothing to migrate", color: "#4285f4" },
                  { text: "Nothing new to learn", color: "#059669" },
                  { text: "Connects in 30 minutes", color: "#7c3aed" },
                  { text: "Works on your phone", color: "#db2777" },
                  { text: "200+ tools supported", color: "#0891b2" },
                ].map((point, i) => (
                  <Float key={point.text} delay={i * 0.3} duration={5 + i * 0.4} y={3}>
                    <motion.span
                      className="text-[11px] px-4 py-2 rounded-full border border-white/[0.08] text-white/60 hover:text-white/90 transition-colors cursor-default"
                      style={{ background: `${point.color}15`, borderColor: `${point.color}20` }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.08 }}
                    >
                      {point.text}
                    </motion.span>
                  </Float>
                ))}
              </div>

              {/* CTA buttons */}
              <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    className="rounded-full px-8 bg-white text-emerald-900 hover:bg-white/90 shadow-lg text-[15px] h-12"
                    asChild
                  >
                    <a href="https://app.integratewise.com" target="_blank" rel="noopener noreferrer">
                      See It In Action — Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
                <Link to="/platform">
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-white/10 text-white hover:bg-white/[0.06] text-[15px] h-12">
                    How It Works
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* Product screenshot */}
            <motion.div
              className="max-w-5xl mx-auto rounded-2xl bg-emerald-950 border border-white/[0.08] p-4 md:p-8 shadow-2xl ag-glow-blue"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <HeroWorkspace />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
function TrustBar() {
  return (
    <section className="py-14">
      <div className="ag-section-divider mb-14" />
      <div className="container mx-auto px-4">
        <FadeIn>
          <p className="text-center text-[11px] text-muted-foreground/50 mb-8 uppercase tracking-[0.2em]">
            Works with the tools your business already uses
          </p>
        </FadeIn>
        <ToolLogoBar />
      </div>
      <div className="ag-section-divider mt-14" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
function HowItHeals() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const healingSteps = [
    { icon: Workflow, title: "Connect", desc: "Link your tools in minutes. One-click sign-in. No data migration. No downtime. Keep using everything you already use.", color: "#4285f4" },
    { icon: Brain, title: "Recognize", desc: "It figures out that 'J. Smith' in your CRM and 'john.smith@acme.com' in your inbox are the same person. Automatically.", color: "#7c3aed" },
    { icon: HeartPulse, title: "Predict", desc: "After two weeks, it learns your business rhythms. A client goes quiet? You'll know before the invoice turns red.", color: "#db2777" },
    { icon: Target, title: "Act", desc: "Every warning comes with a button. One tap to send the follow-up, reorder the stock, or escalate the issue.", color: "#059669" },
  ];

  return (
    <section className="py-28 lg:py-36" ref={ref}>
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Four Steps to Clarity</p>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15 }} className="mb-4">
            From Chaos to Calm. <span className="italic" style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>In Days, Not Months.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            No consultants. No 6-month implementation. Connect your tools and watch the intelligence build itself.
          </p>
        </FadeIn>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {healingSteps.map((step, i) => (
            <Float key={step.title} delay={i * 0.3} duration={5 + i} y={5}>
              <motion.div
                className="ag-gradient-border relative p-6 rounded-2xl bg-white border border-emerald-600/[0.08] shadow-[0_1px_3px_rgba(5,150,105,0.06)] hover:shadow-lg transition-all duration-300 h-full"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className="absolute top-4 right-4 text-[11px] text-muted-foreground/20 tabular-nums">0{i + 1}</div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: step.color, boxShadow: `0 4px 12px -2px ${step.color}40` }}
                >
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-[15px] font-medium mb-2">{step.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            </Float>
          ))}
        </div>

        {/* Living Loop visualization */}
        <FadeIn className="text-center mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Watch It Work</p>
          <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2 }} className="mb-4">
            Connect Your Tools. <span className="italic" style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>Watch Intelligence Emerge.</span>
          </h3>
        </FadeIn>
        <div className="max-w-4xl mx-auto">
          <LivingLoopAnimation />
        </div>
        <FadeIn delay={0.3} className="text-center mt-8">
          <Link to="/platform">
            <Button variant="outline" className="rounded-full border-emerald-600/[0.12]">
              See the Full Picture <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
const outcomes = [
  { icon: Layers, title: "One Truth for Everyone", desc: "Same data, shaped to each person's role.", link: "/platform", color: "#4285f4" },
  { icon: Brain, title: "It Knows Who Is Who", desc: "Connects identities automatically across all your tools.", link: "/platform", color: "#7c3aed" },
  { icon: Eye, title: "Early Warnings", desc: "Spots patterns weeks before you would.", link: "/who-its-for", color: "#db2777" },
];

function WhatChanges() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">What Changes</p>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15 }} className="mb-3">Not Features. <span className="italic" style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>Outcomes.</span></h2>
          <p className="max-w-xl mx-auto text-muted-foreground">Connected awareness — so you can focus on the work that matters.</p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" stagger={0.12}>
          {outcomes.map((item, i) => (
            <StaggerItem key={item.title}>
              <Float delay={i * 0.4} duration={6} y={6}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 rounded-2xl border-emerald-600/[0.08] overflow-hidden">
                    <CardContent className="p-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${item.color}10` }}
                      >
                        <item.icon className="h-5 w-5" style={{ color: item.color }} />
                      </div>
                      <h3 className="text-sm font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                      <Link to={item.link}>
                        <span className="text-xs hover:text-foreground transition-colors flex items-center gap-1" style={{ color: item.color }}>
                          Learn more <ChevronRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </Float>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ACT V — INDUSTRY VERTICALS
   ═══════════════════════════════════════════════════════════════════════ */
const verticalDetails = [
  { icon: Stethoscope, label: "Healthcare", result: "20 min saved per patient", before: "Patient history in 3 systems.", after: "One screen. Full history. Pharmacy sees prescriptions in real time.", color: "#dc2626" },
  { icon: Briefcase, label: "IT Services", result: "4.2 hrs saved daily", before: "Jira, Slack, Toggl, invoicing — all disconnected.", after: "Code commits map to invoices automatically.", color: "#4285f4" },
  { icon: Factory, label: "Manufacturing", result: "Zero relay calls", before: "Supervisor, godown, trader — everyone calling everyone.", after: "Live production tracking. Auto-alerts for stock and dispatch.", color: "#7c3aed" },
  { icon: Home, label: "Real Estate", result: "3x faster response", before: "30 listings, 50 leads in Excel, site visits in chat.", after: "Caller ID triggers full client file. Instant context.", color: "#059669" },
  { icon: Scale, label: "Professional Services", result: "60% faster close", before: "3 days collating client data before analysis.", after: "Auto-reconciliation. Flagged mismatches. Drafted replies.", color: "#0891b2" },
  { icon: GraduationCap, label: "Education", result: "30 sec parent response", before: "Attendance in one app, grades in another.", after: "Complete student view. Auto-parent updates.", color: "#d97706" },
  { icon: Car, label: "Auto Dealership", result: "2x retention", before: "Service reminders, follow-ups — all separate.", after: "Unified customer lifecycle. Predictive service alerts.", color: "#db2777" },
  { icon: ShoppingBag, label: "Retail", result: "Zero stockouts", before: "5 locations, each with own billing and stock.", after: "Cross-location inventory. Unified credit.", color: "#6366f1" },
];

function IndustryBenefits() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-28 bg-[#fafafa]" ref={ref}>
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Every Industry. Same Intelligence.</p>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15 }} className="mb-3">
            The Chaos Is the Same Everywhere.
            <br className="hidden md:block" />
            <span className="italic" style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>The Healing Adapts to You.</span>
          </h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {verticalDetails.map((v, i) => (
            <Float key={v.label} delay={i * 0.15} duration={6 + (i % 3)} y={3}>
              <motion.div
                className="group p-5 rounded-2xl bg-white border border-emerald-600/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 cursor-default overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                {/* Left color accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: v.color }} />
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: `${v.color}10`,
                      color: v.color,
                    }}
                  >
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">{v.label}</h3>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 font-medium"
                        style={{ background: `${v.color}10`, color: v.color }}
                      >{v.result}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                      <span className="text-red-500/60 text-[10px] uppercase tracking-wider mr-1">Before:</span>{v.before}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
                      <span className="text-emerald-600/60 text-[10px] uppercase tracking-wider mr-1">After:</span>{v.after}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Float>
          ))}
        </div>
        <FadeIn delay={0.3} className="text-center mt-10">
          <Link to="/who-its-for">
            <Button variant="outline" className="rounded-full border-emerald-600/[0.12]">See Stories From Your Industry <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
function QuickProof() {
  return (
    <section className="py-16">
      <div className="ag-section-divider mb-16" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <DataCounter value="200+" label="Tool connectors" icon={<Link2 className="h-5 w-5" />} />
          <DataCounter value="<200ms" label="Response time" icon={<Activity className="h-5 w-5" />} trend="down" />
          <DataCounter value="99.4%" label="Match accuracy" icon={<Brain className="h-5 w-5" />} />
          <DataCounter value="AES-256" label="Field-level encryption" icon={<Shield className="h-5 w-5" />} />
        </div>
      </div>
      <div className="ag-section-divider mt-16" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
function ValidationPath() {
  const validationItems = [
    { icon: Database, title: "How It Works", desc: "See the engine behind the magic.", link: "/platform", color: "#4285f4" },
    { icon: Users, title: "Who It's For", desc: "Find your role. See your morning.", link: "/who-its-for", color: "#7c3aed" },
    { icon: Shield, title: "Security", desc: "Your data is safer here than on your laptop.", link: "/security", color: "#059669" },
    { icon: Sparkles, title: "Integrations", desc: "200+ tools. Connect in minutes.", link: "/integrations", color: "#db2777" },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl tracking-[-0.02em] mb-3 font-semibold">Want to Dig Deeper?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Explore at your own pace.</p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto" stagger={0.08}>
          {validationItems.map((item, i) => (
            <StaggerItem key={item.title}>
              <Float delay={i * 0.3} duration={5} y={4}>
                <Link to={item.link}>
                  <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group rounded-2xl border-emerald-600/[0.08]">
                      <CardContent className="p-5">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300"
                          style={{ background: `${item.color}10`, color: item.color }}
                        >
                          <item.icon className="h-5 w-5 transition-all group-hover:scale-110" />
                        </div>
                        <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                        <span className="text-[10px] mt-3 flex items-center gap-1 transition-colors" style={{ color: item.color }}>
                          Explore <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </Float>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CTA — Final conversion section
   ═══════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="px-4 lg:px-8 pb-8">
      <motion.div
        className="ag-rounded-section text-white relative overflow-hidden max-w-[1400px] mx-auto"
        style={{ backgroundColor: '#064e3b' }}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Vibrant glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.05] blur-[120px]"
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/[0.04] blur-[100px]"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full blur-[80px]"
            style={{ background: "rgba(219,39,119,0.03)" }}
            animate={{ x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 py-24 lg:py-28 text-center max-w-2xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] mb-5 font-semibold"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            You're Not Disorganized.
            <br />
            <span className="italic text-white/50 font-normal">
              Your Tools Are Disconnected.
            </span>
          </motion.h2>
          <motion.p
            className="text-white/40 mb-10 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
          >
            Connect your context today. No migration, no new habits, just everything aware of everything else.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="bg-white text-emerald-900 hover:bg-white/90 rounded-full px-8 shadow-xl text-[15px] h-12"
                asChild
              >
                <a href="https://app.integratewise.com" target="_blank" rel="noopener noreferrer">
                  Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-[15px] h-12"
                style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                See Pricing
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="mt-12 flex items-center justify-center gap-3 text-white/25 text-xs"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Join 2,400+ businesses that stopped being the middleman
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════════════════════════════ */
export function HomePage() {
  return (
    <>
      {/* ACT I — Light hero */}
      <GlobalProblemHero />

      {/* Persona cards */}
      <PersonaCardsSection />

      {/* SSOT Explainer */}
      <SSOTExplainer />

      {/* ACT II — Dark product showcase */}
      <DarkProductShowcase />

      {/* Trust bar */}
      <TrustBar />

      {/* How It Heals */}
      <HowItHeals />

      {/* What Changes */}
      <WhatChanges />

      {/* Industry benefits */}
      <IndustryBenefits />

      {/* Quick proof stats */}
      <QuickProof />

      {/* Validation paths */}
      <ValidationPath />

      {/* CTA */}
      <CTASection />
    </>
  );
}
