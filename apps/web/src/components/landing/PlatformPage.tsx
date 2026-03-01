import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  SlideUp,
} from "@/components/motion/AnimateIn";
import { SpineVisualization } from "@/components/landing/workspace-demo/WorkspaceScreen";
import { ToolLogoGrid } from "@/components/landing/ToolLogos";
import {
  AnimatedInfographic,
  VideoPlayer,
  DataCounter,
} from "@/components/landing/AnimatedInfographic";
const productBlueprintImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f5f5f5'%3E%3Crect width='800' height='600' rx='16'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23a0a0a0' font-family='Inter,sans-serif' font-size='18'%3EProduct Blueprint%3C/text%3E%3C/svg%3E";
const threePlaneModelImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f5f5f5'%3E%3Crect width='800' height='600' rx='16'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23a0a0a0' font-family='Inter,sans-serif' font-size='18'%3EThree-Plane Model%3C/text%3E%3C/svg%3E";
import {
  Upload,
  Layers,
  Lightbulb,
  Play,
  RefreshCcw,
  ArrowRight,
  ChevronRight,
  Eye,
  Brain,
  Sparkles,
  Database,
  Workflow,
  AlertTriangle,
  Search,
  Filter,
  ScanSearch,
  Route,
  Tag,
  Trash2,
  FileText,
  ShieldCheck,
  Activity,
  Zap,
  TrendingUp,
} from "lucide-react";

/* ─── Architecture Stages (the living loop) ──────────────────────────── */
const stages = [
  {
    icon: Upload,
    label: "Load",
    heading: "The Senses — Ingestion Mesh",
    desc: "The Accelerator accepts data from 200+ sources simultaneously. XML from accounting tools, JSON from CRMs, plain text from messaging apps, even a photo of a handwritten ledger — everything enters here. Handles 10,000 requests per second, even during peak sales events.",
    snippet: "Connect → Authorize → Stream entities into the Engine",
  },
  {
    icon: Layers,
    label: "Normalize",
    heading: "8-Stage Cognitive Pipeline",
    desc: "Raw data is crude oil — it needs refining. Every byte passes through: Analyzer → Classifier → Filter → Refiner → Extractor → Validator → Sanity Scan → Sectorizer. Dates standardized, currencies normalized, phone numbers formatted.",
    snippet: "Raw data → 8 stages → Clean, structured, canonical",
  },
  {
    icon: Database,
    label: "Store",
    heading: "One Connected Memory",
    desc: "Cleaned data enters one connected truth stored on edge databases across multiple regions. Like a diary that instantly updates in every room simultaneously. Encrypted end-to-end. Every entry locked like a bank vault.",
    snippet: "Edge database → AES-256 → Sub-50ms global latency",
  },
  {
    icon: Brain,
    label: "Think",
    heading: "It Knows Who Is Who",
    desc: "The system connects: 'R. Chen' in Slack = 'Rachel Chen' in Salesforce. It notices: 'Last month this customer paid in 3 days. This time it's Day 5.' It correlates operational patterns across every connected source.",
    snippet: "Entity resolution + Temporal linking + Prediction",
  },
  {
    icon: Lightbulb,
    label: "Decide",
    heading: "The Command Layer",
    desc: "Creates Actions: 'Alert the factory owner.' 'Suggest calling the client.' 'Auto-generate the compliance report.' Uses your rules + AI learning. Adjusts reminder timing based on actual behavioral patterns.",
    snippet: "Rules + AI → Intelligent next-best-action suggestions",
  },
  {
    icon: Play,
    label: "Act",
    heading: "Bi-Directional Sync",
    desc: "Not just reads — writes back. Update a phone number in IntegrateWise, your CRM updates automatically. Sends messages, creates tasks in project tools, updates machine logs. Under 200 milliseconds.",
    snippet: "Bi-directional sync → Workflow triggers → API gateway",
  },
  {
    icon: RefreshCcw,
    label: "Adjust",
    heading: "The Learning Loop",
    desc: "You ignored the alert? System tunes down priority. You acted on the machine warning? System tunes up. Every day it becomes more 'you.' It learns that 'delay' in one context means 1 day, but in another means 3 days.",
    snippet: "Feedback → Pattern learning → Personalized tuning",
  },
];

/* ─── 8-Stage Normalizer Pipeline (from animations.md) ───────────────── */
const pipelineStages = [
  {
    icon: ScanSearch,
    label: "Analyze",
    desc: "What is this? Invoice, chat message, error log, or attendance mark?",
    example: "Sees a PDF from a supplier and recognizes it's an invoice, not a catalog.",
  },
  {
    icon: Tag,
    label: "Classify",
    desc: "Tags the data: Sales, Support, Inventory, HR, Compliance.",
    example: "A casual message like 'send the goods' gets tagged as Sales-Dispatch-Request, not just Chat.",
  },
  {
    icon: Trash2,
    label: "Filter",
    desc: "Removes duplicates. Same invoice from accounting and email? Keeps one. Spam? Gone.",
    example: "Greeting messages filtered out so your workspace stays focused.",
  },
  {
    icon: FileText,
    label: "Refine",
    desc: "Dates, money, phone numbers — all standardized to one format.",
    example: "\"01-04-2024\" and \"April 1, 2024\" both become one standard. Multi-currency normalized.",
  },
  {
    icon: Lightbulb,
    label: "Extract",
    desc: "Pulls out critical data from unstructured text, photos, handwritten notes.",
    example: "From a handwritten note: \"Order #4421, 500 meters cloth, due Tuesday.\"",
  },
  {
    icon: ShieldCheck,
    label: "Validate",
    desc: "Tax ID valid format? EIN valid? Amount makes sense?",
    example: "Flags $1,000,000 for tea expenses as suspicious.",
  },
  {
    icon: AlertTriangle,
    label: "Sanity",
    desc: "AI checks for weirdness. Transaction on Sunday when office is closed?",
    example: "Employee marked present but badge scan shows they never entered. Flagged.",
  },
  {
    icon: Route,
    label: "Route",
    desc: "Sends refined data to the right brain section and the right person.",
    example: "Tax data → Accountant. Machine breakdown → Supervisor. Absence → Manager.",
  },
];

/* ─── Animated Pipeline Section ──────────────────────────────────────── */
function AnimatedPipelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setActiveStage(i);
      i++;
      if (i >= pipelineStages.length) i = 0;
    }, 800);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">The 8-Stage Refinery</Badge>
          <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
            How Raw Data Becomes Intelligence
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Like crude oil needs refining before it powers your bike, raw data passes through
            8 stages of cleaning in{" "}
            <strong className="text-foreground">200 milliseconds</strong>.
          </p>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          {/* Pipeline cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {pipelineStages.map((stage, i) => {
              const isActive = i === activeStage;
              const isPast = i < activeStage || (activeStage === -1 && false);

              return (
                <motion.div
                  key={stage.label}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Card
                    className={`p-4 h-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "shadow-lg ring-2 ring-foreground/20 -translate-y-1"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setActiveStage(i)}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground scale-110"
                            : isPast
                              ? "bg-primary/80 text-primary-foreground"
                              : "bg-muted"
                        }`}
                      >
                        <stage.icon className="h-4 w-4" />
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="text-xs">{stage.label}</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {stage.desc}
                      </p>
                    </CardContent>
                  </Card>
                  {/* Connector arrow */}
                  {i < pipelineStages.length - 1 && i % 4 !== 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                      <ChevronRight
                        className={`h-3 w-3 transition-colors duration-300 ${
                          isPast ? "text-foreground/40" : "text-foreground/15"
                        }`}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animated progress bar with shimmer */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
            <motion.div
              className="absolute inset-y-0 left-0 bg-foreground rounded-full"
              animate={{
                width: isInView
                  ? `${((activeStage + 1) / pipelineStages.length) * 100}%`
                  : "0%",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
            <div
              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ animation: "shimmer 2.5s infinite linear" }}
            />
          </div>

          {/* Active stage example callout */}
          {activeStage >= 0 && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl bg-white border"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Stage {activeStage + 1}:</span>
                <span className="text-xs">{pipelineStages[activeStage].label}</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{pipelineStages[activeStage].example}"
              </p>
            </motion.div>
          )}

          {/* Data healing note */}
          <FadeIn delay={0.3} className="mt-6">
            <div className="p-4 rounded-xl bg-[#fafafa] border text-center">
              <p className="text-sm text-muted-foreground">
                Self-healing data: "R. Chen" in CRM + "Rachel Chen" in email = automatically merged. 
                Phone numbers auto-formatted. Duplicate invoices merged.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Journey Steps ──────────────────────────────────────────────────── */
const journeySteps = [
  { icon: Upload, label: "Day 1: Connect", desc: "Authorize your tools via OAuth in 15 minutes. No migration needed." },
  { icon: Layers, label: "Day 1-2: Clean", desc: "6 months of data flows through the refinery. Duplicates merged. Formats unified." },
  { icon: Database, label: "Day 3: Instantiate", desc: "System detects your industry from data patterns. Auto-configures workspace." },
  { icon: Search, label: "Week 1-2: Learn", desc: "Engine observes: when do you follow up? What's your average invoice size?" },
  { icon: Sparkles, label: "Week 3+: Intelligence", desc: "Auto-tagging messages, predicting cash flow gaps, warning about compliance issues." },
];

/* ═══════════════════════════════════════════════════════════════════════
   Platform Page
   ═══════════════════════════════════════════════════════════════════════ */
export function PlatformPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">Platform Architecture</Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            How IntegrateWise Works
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-muted-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Think of your business data like blood flowing through the body. It must circulate,
            get cleaned, carry oxygen, and feed the brain. That is what our Living Loop does.
          </motion.p>

          {/* The Living Loop — architecture overview */}
          <motion.div
            className="max-w-4xl mx-auto rounded-2xl border bg-[#fafafa] p-8"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
              The Living Loop — Load → Normalize → Store → Think → Decide → Act → Adjust → Repeat
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {stages.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "#0a0a0a" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <s.icon className="h-5 w-5" />
                  </motion.div>
                  <span className="text-xs">{s.label}</span>
                  {i < stages.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-foreground/20" />
                  )}
                </motion.div>
              ))}
              {/* Repeat arrow */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <RefreshCcw className="h-4 w-4 text-foreground/30" />
                <span className="text-xs text-muted-foreground">Repeat</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Blueprint — The Full Picture */}
      <section className="py-16 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">The Complete Blueprint</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              One Image. The Entire System.
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              From tool sprawl to governed intelligence — this is how IntegrateWise transforms
              scattered data into a cognitive operating system with evidence-based actions.
            </p>
          </FadeIn>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border bg-white shadow-2xl shadow-black/8 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b bg-[#fafafa]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-muted/60 text-xs text-muted-foreground">
                    IntegrateWise — Product Architecture
                  </div>
                </div>
                <div className="w-12" />
              </div>
              <img
                src={productBlueprintImg}
                alt="IntegrateWise product architecture showing the Governed Intelligence Loop, L1 Workspace, L2 Cognitive Layer, role-based views, and comparison with traditional AI assistants"
                className="w-full h-auto"
              />
            </div>

            {/* Caption callouts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Governed Loop", desc: "Load → Normalize → Think → Govern → Repeat" },
                { label: "L1 + L2 Layers", desc: "Workspace surface with cognitive brain overlay" },
                { label: "12 Verticals", desc: "Role-based intelligence for every department" },
                { label: "60-Sec Setup", desc: "OAuth connect, hydrate context in under a minute" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="p-3 rounded-xl bg-muted/40 border text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <p className="text-xs mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deep-Dive Architecture Cards */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              The Cognitive Engine — In Detail
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Not features. Organs of a living system. Each stage processes data like 
              the nervous system processes sensory input.
            </p>
          </FadeIn>

          <div className="max-w-5xl mx-auto space-y-6">
            {stages.map((stage, i) => (
              <SlideUp key={stage.label} delay={i * 0.06}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-muted/50 p-8 flex flex-col items-center justify-center md:w-48 shrink-0">
                        <motion.div
                          className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-3"
                          whileHover={{ scale: 1.08, rotate: 2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <stage.icon className="h-7 w-7" />
                        </motion.div>
                        <span className="text-sm">{stage.label}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Stage {i + 1}
                        </span>
                      </div>
                      <div className="p-8 flex-1">
                        <h3 className="text-lg mb-3">{stage.heading}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{stage.desc}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                          <Workflow className="h-3 w-3" />
                          {stage.snippet}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* 8-Stage Pipeline Animation */}
      <AnimatedPipelineSection />

      {/* Three-Plane Ingestion Model — Deep Architecture */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Deep Architecture</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              The Three-Plane Ingestion Model
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Structured truth, unstructured context, and AI session memory converge
              in the Spine — powering the Think Engine, passing through the Governance
              Gate, and rendering as role-specific workspaces.
            </p>
          </FadeIn>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border bg-white shadow-2xl shadow-black/8 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b bg-[#fafafa]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-muted/60 text-xs text-muted-foreground">
                    Kernel → Memory → Think → Govern → Workspace
                  </div>
                </div>
                <div className="w-12" />
              </div>
              <img
                src={threePlaneModelImg}
                alt="The Three-Plane Ingestion Model: Kernel Layer loading and securing data, Memory Layer fusing context into the Spine, Think Engine evolving the workspace, Governance Gate ensuring human approval, and Preserved Work Layer rendering Sales, CS, and Finance views"
                className="w-full h-auto"
              />
            </div>

            {/* Layer callouts */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              {[
                { label: "Kernel", desc: "Loading, normalizing, securing all enterprise data" },
                { label: "Memory", desc: "The Spine — fusing data, context, and AI memory" },
                { label: "Think Engine", desc: "Background intelligence evolving the workspace" },
                { label: "Governance Gate", desc: "Nothing executes without human review and audit" },
                { label: "Work Layer", desc: "Sales, CS, Finance — role-specific views" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="p-3 rounded-xl bg-muted/40 border text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                >
                  <p className="text-xs mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spine Visualization */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Connected Memory</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              One Truth. Every Tool.
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Regardless of source — QuickBooks, Salesforce, Slack, or Excel — everything resolves into
              one connected, industry-aware data layer.
            </p>
          </FadeIn>
          <div className="max-w-6xl mx-auto">
            <SpineVisualization />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Integrations</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              200+ Connectors — Ready to Go
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Connect in minutes. No coding. No migration. Your tools stay as they are.
            </p>
          </FadeIn>
          <div className="max-w-3xl mx-auto">
            <ToolLogoGrid />
          </div>
          <div className="text-center mt-10">
            <Link to="/integrations">
              <Button variant="outline">
                View All Integrations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Journey from Chaos to Clarity */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Your Journey</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              From Chaos to Clarity — In Stages
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              You don't "learn" software. You just start using it. Here's how the first weeks unfold.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-5 gap-4" stagger={0.1}>
            {journeySteps.map((step, i) => (
              <StaggerItem key={step.label}>
                <div className="relative text-center group">
                  <motion.div
                    className="w-14 h-14 mx-auto rounded-full bg-white border flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <step.icon className="h-6 w-6" />
                  </motion.div>
                  <h4 className="text-sm mb-1">{step.label}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                  {i < journeySteps.length - 1 && (
                    <div className="hidden md:block absolute top-7 -right-2 z-10">
                      <ChevronRight className="h-4 w-4 text-foreground/15" />
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn delay={0.3} className="mt-12 text-center">
            <Link to="/security">
              <Button variant="outline">
                View Security & Compliance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Ready to See It in Action?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Connect your tools in 30 minutes. No migration. No coding. If you can use Slack,
              you can use IntegrateWise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
              <Link to="/app">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Book a Demo
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}