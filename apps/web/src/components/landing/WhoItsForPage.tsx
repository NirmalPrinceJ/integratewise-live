import { motion } from "motion/react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/AnimateIn";
const productBlueprintImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f5f5f5'%3E%3Crect width='800' height='600' rx='16'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23a0a0a0' font-family='Inter,sans-serif' font-size='18'%3EProduct Blueprint%3C/text%3E%3C/svg%3E";
import {
  User,
  Building2,
  TrendingUp,
  BarChart3,
  DollarSign,
  Headphones,
  Package,
  Lightbulb,
  ArrowRight,
  Clock,
  ShieldCheck,
  Target,
  Zap,
  Stethoscope,
  ShoppingBag,
  Factory,
  Home,
} from "lucide-react";

const personas = [
  {
    icon: Building2,
    title: "Founder / CEO",
    problem: "You open four apps every morning just to know what happened yesterday. Your sales guy updates one system, your accountant another — and they never match.",
    solution: "One screen shows bird's-eye health: cash runway, team productivity, customer metrics. Morning Brief delivered via Slack or email at 9 AM — payments received overnight, follow-ups due, compliance countdown.",
    outcome: "See your entire business health over morning coffee. Stop being the glue between your own software.",
    outIcon: ShieldCheck,
  },
  {
    icon: TrendingUp,
    title: "Sales Executive",
    problem: "You're updating CRM, checking Slack for customer replies, and looking up order history in QuickBooks — switching between apps 50 times a day.",
    solution: "Today's calls, hot leads, proposal status, and commission calculator — all in one view. Customer calls? Their entire history appears instantly: last chat, pending payment, delivery status.",
    outcome: "Answer customer queries in 30 seconds instead of 15 minutes. Never miss a follow-up again.",
    outIcon: Target,
  },
  {
    icon: DollarSign,
    title: "Accountant / CPA",
    problem: "Reconciliation nightmares. Your accounting system says one thing, bank statement says another. Tax filing involves manually cross-checking invoices across three systems.",
    solution: "Auto-reconciliation of accounting with bank statements — only mismatches are flagged. Tax data auto-tagged with proper codes and categories. Filing countdown with alerts.",
    outcome: "Cut month-end reconciliation by 60%. Tax data is always ready. Sleep peacefully knowing no invoice falls through cracks.",
    outIcon: Clock,
  },
  {
    icon: ShoppingBag,
    title: "Retail / Store Owner",
    problem: "Stock tracking in Excel, customer credit in a notebook, orders in messages. When a regular customer asks 'How much is pending?' you scramble to find the answer.",
    solution: "IntegrateWise tracks credit balances automatically. Stock levels update across your online catalog, billing software, and your dashboard. AI alerts when items are running low before peak seasons.",
    outcome: "Update stock once — online catalog, website, and dashboard all sync. Focus on selling, not tracking.",
    outIcon: Zap,
  },
  {
    icon: Stethoscope,
    title: "Healthcare / Clinic",
    problem: "Patient records in one system, appointments in another, billing in a third. No unified view of patient journey or payment status.",
    solution: "Patient Queue tracking replaces your whiteboard. Appointment, treatment history, and billing linked in one view. Auto-generated payment reminders via SMS or email.",
    outcome: "Unified patient view from registration to follow-up. No more searching through scattered files.",
    outIcon: ShieldCheck,
  },
  {
    icon: Factory,
    title: "Manufacturing",
    problem: "Production schedule, raw material inventory, supplier lead times, and customer orders all tracked in separate systems. Delays become visible only when it's too late.",
    solution: "Production Schedule module connects with inventory, supplier data, and customer orders. AI predicts stock-outs based on lead times and seasonal demand.",
    outcome: "Predict supply chain gaps 5 days ahead. Never tell a customer 'delivery will be late' because you forgot to reorder raw material.",
    outIcon: Target,
  },
  {
    icon: Home,
    title: "Real Estate",
    problem: "Site visit tracking on paper, customer follow-ups scattered across messaging apps, booking status in Excel. Leads fall through the cracks daily.",
    solution: "Site Visit Status tracking, auto-follow-up reminders based on customer engagement signals, and unified customer journey from first enquiry to closing.",
    outcome: "Never lose a hot lead because someone forgot to follow up. See entire customer journey from enquiry to booking.",
    outIcon: TrendingUp,
  },
  {
    icon: Package,
    title: "Distribution / Trading",
    problem: "Orders coming via messages, phone calls, and in-person visits. Billing in QuickBooks, delivery tracking on paper. You're manually matching orders to invoices every evening.",
    solution: "Auto-classification of incoming orders into billing entries. Delivery tracking linked to invoices. AI-generated daily summary: what shipped, what's pending, what's overdue.",
    outcome: "Eliminate 80% of manual data work. An incoming order message auto-creates an invoice task.",
    outIcon: Zap,
  },
];

export function WhoItsForPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        {/* Subtle animated orbits */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-foreground/[0.03]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-foreground/[0.04]"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">Who It's For</Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            If You Run a Business, This Is for You
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Founder. Sales. Accountant. Operations. One platform that speaks your language and solves your specific pain.
          </motion.p>
        </div>
      </section>

      {/* How the Platform Adapts — Blueprint */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">One Platform, Every Role</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Same intelligence. Your vocabulary.
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              The platform speaks your language. For a sales exec,
              "Status" means Lead Hot/Cold. For an accountant, it means Invoice Paid/Overdue.
              For a doctor, it means Patient Critical/Stable. Same system — different words.
            </p>
          </FadeIn>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border bg-white shadow-xl overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/20 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                </div>
                <span className="text-[10px] text-muted-foreground ml-2">
                  Role-Based Intelligence for 12 Verticals — Product Architecture
                </span>
              </div>
              <img
                src={productBlueprintImg}
                alt="IntegrateWise role-based intelligence showing how Sales, Marketing, Finance, and Customer Success all share one cognitive spine"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Persona Grid */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            stagger={0.08}
          >
            {personas.map((persona) => (
              <StaggerItem key={persona.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="bg-muted/50 p-6 flex items-center gap-4">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center"
                          whileHover={{ scale: 1.08, rotate: 3 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <persona.icon className="h-6 w-6" />
                        </motion.div>
                        <h3 className="text-xl">{persona.title}</h3>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">The Problem</p>
                          <p className="text-sm text-muted-foreground">{persona.problem}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-1">How IntegrateWise Helps</p>
                          <p className="text-sm text-muted-foreground">{persona.solution}</p>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
                          <persona.outIcon className="h-5 w-5 shrink-0 mt-0.5" />
                          <p className="text-sm">{persona.outcome}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl tracking-tight mb-4">
              Ready to stop juggling apps?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Sign up with your email. Connect your tools in 30 minutes.
              See your business clearly for the first time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
              <Link to="/app">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Book a Demo
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}