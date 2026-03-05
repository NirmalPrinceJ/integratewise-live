import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  FadeIn,
  FadeInSpring,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleIn,
} from "../motion/AnimateIn";
import productBlueprintImg from "figma:asset/ee4f5ad6f9ab51a91f6b4787c4152163c777e29c.png";
import {
  AlertTriangle,
  Puzzle,
  Brain,
  Layers,
  Shield,
  RefreshCcw,
  ArrowRight,
  Heart,
  Smartphone,
  MessageSquare,
  Eye,
  Factory,
  Stethoscope,
  ShoppingBag,
  Car,
  GraduationCap,
  Briefcase,
  TrendingDown,
  CheckCircle2,
  Home,
  Scale,
} from "lucide-react";

const timelineSteps = [
  {
    icon: Puzzle,
    label: "The Fragmentation Problem",
    year: "The Problem",
    desc: "Businesses ran on 4+ disconnected tools. Every morning started with opening multiple apps just to know what happened yesterday.",
  },
  {
    icon: AlertTriangle,
    label: "The Red Account",
    year: "The Wake-Up Call",
    desc: "A client stopped renewing. CRM said 'active.' Accounting showed unpaid invoice. We saw red too late. Three weeks before, the signals were amber — integration calls slowed 40%, usage dropped. We were blind.",
  },
  {
    icon: Eye,
    label: "The Visibility Problem",
    year: "The Insight",
    desc: "Most businesses don't have a revenue problem. They have a visibility problem. We built something we needed ourselves: a layer that sees behavioral drift before financial crisis.",
  },
  {
    icon: Layers,
    label: "The Foundation",
    year: "The Build",
    desc: "We built a system that takes data from any source and turns it into one connected truth. Like how digital payments connected bank accounts, we connected business apps.",
  },
  {
    icon: Brain,
    label: "The Intelligence",
    year: "The AI Layer",
    desc: "We added intelligence that understands your questions, predicts payment delays, warns about stock-outs before peak seasons, and turns messages into business actions.",
  },
  {
    icon: Smartphone,
    label: "Built for Everyone",
    year: "The Mission",
    desc: "Works on any device. Offline mode. Morning Brief via messaging. If you can use messaging, you can use IntegrateWise.",
  },
];

/* ─── Persona Stories ───────────────────────────────────────────────── */
const personaStories = [
  {
    icon: Briefcase,
    title: "The Tech Services Firm",
    subtitle: "IT Services & Software",
    story: "8 projects across 3 clients. Developers log time in Toggl, tasks in Jira, client conversations in Slack, invoicing in QuickBooks. Client asks 'Is the payment gateway done?' — checking Jira, Toggl, and email takes 15 minutes. Worse: a developer bills 20 hours to a module the client cancelled in last week's email.",
    transformation: "Client's Slack message triggers the full view. One screen: Payment gateway 80% complete, 32 hours logged, but Alert: Client requested 'add Apple Pay' yesterday which changes scope. System auto-calculates: 'This adds 8 hours. Send revised estimate?' One tap.",
  },
  {
    icon: Factory,
    title: "The Specialty Manufacturer",
    subtitle: "Manufacturing",
    story: "You run 4 production lines, 3 warehouses, and sell to 50 dealers. Your 'system' is Slack channels + QuickBooks on one PC + Excel sheets on your phone. A dealer calls: 'Is my order ready?' You call the floor supervisor, who checks and calls back. 30 minutes wasted for a simple status update.",
    transformation: "You open IntegrateWise on your phone. It shows: Line 2 is running the order, 80% complete, expected dispatch tomorrow. Tap once — dealer gets an SMS update with a live tracking link. The system also warns: 'Raw material for next order is 2 days late — call supplier now.'",
  },
  {
    icon: Stethoscope,
    title: "The Clinic Chain",
    subtitle: "Healthcare",
    story: "Patient arrives. Receptionist asks medical history (they forget). Doctor asks for old reports (file missing). Pharmacy asks for prescription (in doctor's cabin). Billing asks for insurance details (card left at home). Four people asking the same patient for information they should already have.",
    transformation: "Phone number typed. Screen shows: Last visit 3 months ago, diabetes medication running low, pending insurance claim, today's appointment for BP check. Pharmacy already sees the prescription the doctor is typing. Billing sees insurance from last visit.",
  },
  {
    icon: Home,
    title: "The Property Consultant",
    subtitle: "Real Estate",
    story: "You have 30 listings on Zillow, 50 leads in Excel, and showing notes in your personal messages. A lead calls: 'What happened to that 3-bedroom?' You panic, scroll through messages for 5 minutes, cannot find it, lose credibility.",
    transformation: "Caller ID triggers the file. Screen shows: Mr. Johnson, saw the 3BR on Oak Street Tuesday, wife liked the kitchen but concerned about price, follow-up due today, similar 2BR available in same neighborhood for 15% less. You offer an intelligent alternative before he finishes his question.",
  },
  {
    icon: Scale,
    title: "The Accounting Firm",
    subtitle: "Professional Services",
    story: "Month-end madness. Client sends accounting data on email, tax portal data on the website, bank statements on Drive, and random questions on chat. You spend 3 days just collating before you can start analyzing. Missed deadlines. Missed deductions.",
    transformation: "All four sources feed one screen. The system auto-reconciles accounting with bank statements, flags mismatched tax entries, and drafts replies to client queries based on their own data. You review, not reconstruct.",
  },
  {
    icon: Car,
    title: "The Auto Dealership",
    subtitle: "Automobile Dealership",
    story: "Sales uses Excel for leads, service uses QuickBooks for billing, spare parts in a legacy system from 2005. A customer who bought a Camry 6 months ago comes for service. The advisor asks 'Which model?' — they're insulted. Meanwhile, 40 cars sit in inventory but the salesman tells a walk-in 'Civic is not available' because he can't see real-time stock during a test drive.",
    transformation: "Customer enters, phone number typed. Screen shows: Bought Camry in March, insurance expires next week, referred 2 friends. 'Welcome back, shall we renew insurance while you wait?' Sales team sees real-time stock across all variants on their phone.",
  },
  {
    icon: GraduationCap,
    title: "The School Network",
    subtitle: "Educational Institution",
    story: "2000 students. Admissions in Google Forms, fees in QuickBooks, attendance via badge scanners, parent communication in 40 different group chats. A parent messages: 'Has my child reached school?' — checking the bus driver's phone, then class attendance, then replying takes 30 minutes. By month-end, 15 students have left without anyone noticing the fee defaults.",
    transformation: "Parent's message triggers the full view. One screen: Bus GPS (entered school gate), attendance marked at 8:15 AM, and Alert: Medical form overdue. Reply in 30 seconds. Fee defaulters caught on Day 31, not Day 90.",
  },
  {
    icon: ShoppingBag,
    title: "The Multi-Store Owner",
    subtitle: "Retail",
    story: "5 shops. Each has its own POS system, own messaging for orders, own notebook for credit. Driving 40 miles daily checking each shop. Stockouts happen because Shop A doesn't know Shop B has excess. A customer's credit at one shop is invisible at another.",
    transformation: "One screen shows all 5 locations. Shop 3 is low on rice — system suggests transferring from Shop 1. Credit given at Shop 2 shows when the same customer visits Shop 4. Real-time sales while having breakfast at home.",
  },
];

export function StoryPage() {
  const [activeStory, setActiveStory] = useState(0);
  const story = personaStories[activeStory];

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
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            From daily chaos to
            <br className="hidden sm:block" />
            cognitive clarity
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            IntegrateWise was born because "best software" shouldn't mean
            "switching windows 50 times a day."
          </motion.p>
        </div>
      </section>

      {/* The Red Account — Origin Story */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SlideUp>
              <Card className="overflow-hidden border-foreground/15">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-10">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <TrendingDown className="h-8 w-8" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                        The Red Account
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        It started with a quiet drift that almost cost us everything. Our oldest client
                        stopped renewing. The CRM showed them as "active." The accounting showed an unpaid
                        invoice. By the time we saw the red, the relationship was already dead.
                      </p>
                      <p className="text-muted-foreground mb-4">
                        Three weeks before the invoice turned red, the behavioral signals were already amber:
                        integration calls had slowed 40%, usage shifted from daily to weekly, engagement
                        depth had evaporated.
                      </p>
                      <p>
                        That night, we realized: most businesses don't have a revenue problem.
                        They have a <strong>visibility problem</strong>. We built IntegrateWise to
                        fix our own blindness first.
                      </p>
                    </div>
                    {/* Animated warning signals */}
                    <div className="lg:w-1/2 bg-[#fafafa] p-10 flex items-center justify-center">
                      <div className="space-y-4 w-full max-w-xs">
                        {[
                          { label: "API Calls", value: "Down 40%", delay: 0.2 },
                          { label: "Usage Pattern", value: "Daily → Weekly", delay: 0.35 },
                          { label: "Webhook Events", value: "Dropping", delay: 0.5 },
                          { label: "Engagement", value: "Evaporated", delay: 0.65 },
                          { label: "Invoice", value: "$0 — Red", delay: 0.8 },
                        ].map((item) => (
                          <motion.div
                            key={item.label}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: item.delay, duration: 0.5 }}
                          >
                            <span className="text-sm">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.value}</span>
                          </motion.div>
                        ))}
                        <motion.div
                          className="text-center pt-4"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.0, duration: 0.5 }}
                        >
                          <div className="w-px h-6 bg-foreground/20 mx-auto" />
                          <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                            <Eye className="h-4 w-4" />
                            Visibility Layer Born
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">The Journey</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              From recognizing the chaos of disconnected business tools to building a cognitive operating system.
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {timelineSteps.map((step, i) => (
              <motion.div
                key={step.label}
                className="relative flex gap-6 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: i * 0.06,
                }}
              >
                {i < timelineSteps.length - 1 && (
                  <motion.div
                    className="absolute left-6 top-14 bottom-0 w-px bg-border"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <step.icon className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs">{step.year}</Badge>
                  </div>
                  <h3 className="text-lg mb-2">{step.label}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Every Person's Story */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Real Stories</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              From Our Problem to Your Solution
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Just like our Red Account showed integration slowdown before churn,
              every industry faces the same invisible drift. Here's how we fix it.
            </p>
          </FadeIn>

          {/* Story Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {personaStories.map((s, i) => (
              <motion.button
                key={s.title}
                onClick={() => setActiveStory(i)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  i === activeStory
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white border text-muted-foreground hover:border-foreground/30"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                layout
              >
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.subtitle}</span>
                <span className="sm:hidden">{s.subtitle.split(" ")[0]}</span>
                {i === activeStory && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-emerald-600 -z-10"
                    layoutId="story-tab-bg"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Story progress dots */}
          <div className="flex justify-center gap-1.5 mb-8">
            {personaStories.map((_, i) => (
              <motion.button
                key={`dot-${i}`}
                onClick={() => setActiveStory(i)}
                className="p-1"
                whileHover={{ scale: 1.3 }}
              >
                <motion.div
                  className="rounded-full bg-foreground"
                  animate={{
                    width: i === activeStory ? 20 : 6,
                    height: 6,
                    opacity: i === activeStory ? 1 : 0.2,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Active Story */}
          <AnimatePresence mode="wait">
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto"
            >
              <Card className="overflow-hidden border-foreground/10 shadow-lg">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center"
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <story.icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg">{story.title}</h3>
                      <p className="text-xs text-muted-foreground">{story.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-red-400"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm text-muted-foreground">The Problem</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{story.story}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-emerald-500"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <span className="text-sm">The Transformation</span>
                      </div>
                      <p className="text-sm">{story.transformation}</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Founder note */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-white border flex items-center justify-center mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Heart className="h-7 w-7" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl tracking-tight mb-6">Why This Matters</h2>
            <blockquote className="text-muted-foreground mb-6 italic">
              "We started IntegrateWise because we watched brilliant business owners — traders,
              founders, manufacturers — waste hours being the 'bridge' between their own software.
              Their accountant said one thing, sales team said another, and nobody trusted the numbers."
            </blockquote>
            <blockquote className="text-muted-foreground mb-6 italic">
              "We believe if you can send a message, you should be able to run your entire business from one
              screen. On your phone. IntegrateWise isn't a tool you operate — it's a cognitive
              partner that operates between your tools, so you can focus on deciding, selling, and growing."
            </blockquote>
            <p className="text-sm text-muted-foreground mb-2">
              — The IntegrateWise Team
            </p>
            <p className="text-sm italic text-muted-foreground">
              Now your systems have become smart too.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why This Is a New Category */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Category Definer</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Why This Is a New Category
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              For thirty years, businesses bought "tools." Each solved one problem and created
              a new one: fragmentation. IntegrateWise is not another tool. It is the end of tools.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" stagger={0.1}>
            {[
              {
                icon: Puzzle,
                title: "Not Integration",
                desc: "Integration moves data between apps. We don't move data — we understand what it means together. 'R. Chen' in Slack = 'Rachel Chen' in Salesforce. That's not integration. That's cognition.",
              },
              {
                icon: Brain,
                title: "Not a Dashboard",
                desc: "Dashboards show you yesterday's numbers. IntegrateWise predicts tomorrow's problems. It doesn't wait for you to ask — it surfaces what matters before you know to look.",
              },
              {
                icon: Layers,
                title: "Not an ERP",
                desc: "ERPs force you into their shape. IntegrateWise takes the shape of your business. It adapts to hospitals, factories, schools, and law firms — same intelligence, different vocabulary.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center mb-4">
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-sm mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn delay={0.3} className="mt-12 max-w-3xl mx-auto">
            <div className="border-l-4 border-emerald-600 bg-white rounded-r-xl shadow-md px-8 py-6">
              <p className="italic text-muted-foreground">
                "Like how instant payments didn't just improve bank transfers but created a new category
                of real-time finance, IntegrateWise doesn't improve integrations — it creates
                a new category: the <strong className="text-foreground">Cognitive Operating System</strong> for governed work."
              </p>
            </div>
          </FadeIn>

          {/* Product Architecture Blueprint */}
          <FadeIn delay={0.4} className="mt-16 max-w-5xl mx-auto">
            <motion.div
              className="rounded-2xl border bg-white shadow-xl overflow-hidden"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="px-5 py-3 border-b bg-muted/20 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                </div>
                <span className="text-[10px] text-muted-foreground ml-2">
                  The Cognitive Operating System for Governed Work — Full Architecture
                </span>
              </div>
              <img
                src={productBlueprintImg}
                alt="IntegrateWise complete product architecture — from tool sprawl through the Governed Intelligence Loop to role-based intelligence across 12 verticals"
                className="w-full h-auto"
              />
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl tracking-tight mb-4">Built for Growth. Secured for Enterprise.</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Sign up in minutes. Connect your tools in 30 minutes.
              Experience clarity for the first time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
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