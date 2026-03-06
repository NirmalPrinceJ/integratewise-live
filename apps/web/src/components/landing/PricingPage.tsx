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
import {
  Check,
  Zap,
  Users,
  Building2,
  Rocket,
  Link2,
  Brain,
  Shield,
  Headphones,
  ArrowRight,
  Smartphone,
  MessageSquare,
} from "lucide-react";

const tiers = [
  {
    name: "Starter",
    icon: Zap,
    price: "Free",
    period: "forever",
    description: "For individual business owners exploring connected workspace.",
    features: [
      "2 tool connections (e.g., QuickBooks + Slack)",
      "Basic unified dashboard",
      "Daily auto-sync",
      "Morning Brief via email or Slack",
      "Community support",
      "Works on any phone (PWA)",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    icon: Rocket,
    price: "$99",
    period: "/month",
    description: "For growing businesses that need intelligence and full automation.",
    features: [
      "Up to 5 users included",
      "10 tool connections",
      "Ask questions in plain English",
      "Smart automation & auto-sorting",
      "Predictive alerts & stock warnings",
      "Tax auto-tagging & compliance tools",
      "Spot anomalies before they become problems",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    icon: Users,
    price: "$35",
    period: "/user/month",
    description: "For teams that need role-based views, approvals, and audit trails.",
    features: [
      "Unlimited tool connections",
      "Each role sees their own view (CEO, Sales, Accounts)",
      "Team approval workflows",
      "Auto-match bank statements with invoices",
      "Messaging bot for field staff",
      "MS Teams & Slack integration",
      "Advanced analytics & reports",
      "Priority support with SLA",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "For organizations with advanced compliance, multi-location, and scale needs.",
    features: [
      "Dedicated infrastructure",
      "Custom data fields",
      "Single Sign-On authentication",
      "Data privacy compliance suite",
      "Sensitive data encrypted separately",
      "Dedicated success manager",
      "Custom connectors for any tool",
      "Data stays in your country — guaranteed",
      "99.9% uptime guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqItems = [
  {
    q: "Does it work on any device?",
    a: "Yes! IntegrateWise is a Progressive Web App (PWA) that works on any phone, tablet, or desktop — even with slow networks. Offline mode lets you view cached data and sync when you're back online.",
  },
  {
    q: "Do I need to stop using my current tools?",
    a: "No. Your accounting stays. Your CRM stays. We plug into your existing tools — no migration, no 'switching systems.' Your team keeps using what they know.",
  },
  {
    q: "Is my data secure? Where is it stored?",
    a: "All data is encrypted at rest and in transit using AES-256. We offer regional data residency options (US, EU, APAC). We never train AI models on your data. Full audit trails on every action.",
  },
  {
    q: "How fast is the setup?",
    a: "30 minutes. Sign up, connect your tools via OAuth, and see your first insight — like 'You have 3 customers who chatted yesterday but have unpaid invoices.'",
  },
  {
    q: "Can the AI understand multiple languages?",
    a: "Yes! Ask 'Which customers delayed payment this month?' or 'Show me top 5 leads' in your preferred language — the system understands natural language queries.",
  },
  {
    q: "What if I want to leave IntegrateWise?",
    a: "No vendor lock-in. Daily automated exports of your data in CSV/JSON format to your own storage. If you ever leave, you keep everything.",
  },
];

export function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Pricing</p>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.03em] mb-5 font-normal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Start Free. Scale When Ready.
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No credit card required. Cancel anytime. 40% lower total cost than legacy ERP integrations.
          </motion.p>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-black/[0.04] text-sm text-muted-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Over 2,400 businesses connected this month
          </motion.div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 border-t border-black/[0.04]">
        <div className="container mx-auto px-4">
          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
            stagger={0.1}
          >
            {tiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card
                    className={`relative h-full rounded-2xl ${
                      tier.popular ? "shadow-lg border-[#0a0a0a]/20" : "border-black/[0.04]"
                    } hover:shadow-xl transition-shadow duration-300`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] text-white rounded-full px-4">
                        Most Popular
                      </Badge>
                    )}
                    <CardContent className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center">
                          <tier.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-normal">{tier.name}</h3>
                      </div>
                      <div className="mb-4">
                        <span className="text-4xl tracking-[-0.02em] font-normal">{tier.price}</span>
                        {tier.period && (
                          <span className="text-muted-foreground ml-1 text-sm">{tier.period}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                      <Button
                        className={`w-full mb-6 rounded-full ${tier.popular ? "bg-[#0a0a0a] hover:bg-[#1a1a1a]" : ""}`}
                        variant={tier.popular ? "default" : "outline"}
                        asChild
                      >
                        <Link to={tier.cta === "Contact Sales" ? "/app?intent=contact_sales" : `/app?plan=${tier.name.toLowerCase()}`}>
                          {tier.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <ul className="space-y-3">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 shrink-0 mt-0.5 text-foreground" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Every Plan Includes */}
      <section className="py-16 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl tracking-tight mb-4">Every Plan Includes</h2>
          </FadeIn>
          <StaggerChildren
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            stagger={0.08}
          >
            {[
              { icon: Smartphone, label: "Works on Any Device", desc: "PWA — phones, tablets, desktops" },
              { icon: MessageSquare, label: "Messaging Integration", desc: "Morning Brief & alerts via Slack, Teams, or SMS" },
              { icon: Shield, label: "Regional Data Residency", desc: "Your data stays in your region" },
              { icon: Headphones, label: "Support", desc: "Community or priority, your choice" },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <h4 className="text-sm mb-1">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl tracking-tight mb-4">Frequently Asked Questions</h2>
          </FadeIn>
          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            stagger={0.1}
          >
            {faqItems.map((item) => (
              <StaggerItem key={item.q}>
                <h4 className="text-sm mb-2">{item.q}</h4>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}