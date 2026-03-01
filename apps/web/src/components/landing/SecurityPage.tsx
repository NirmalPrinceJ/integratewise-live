import { motion } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  SlideUp,
} from "@/components/motion/AnimateIn";
const governedExecutionImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f5f5f5'%3E%3Crect width='800' height='600' rx='16'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23a0a0a0' font-family='Inter,sans-serif' font-size='18'%3EGoverned Execution%3C/text%3E%3C/svg%3E";
const threePlaneModelImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f5f5f5'%3E%3Crect width='800' height='600' rx='16'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23a0a0a0' font-family='Inter,sans-serif' font-size='18'%3EThree-Plane Model%3C/text%3E%3C/svg%3E";
import {
  Shield,
  Lock,
  Eye,
  FileSearch,
  Activity,
  MessageSquare,
  CheckCircle2,
  Server,
  Brain,
  Globe,
  KeyRound,
  ShieldCheck,
  UserCheck,
  MapPin,
  Fingerprint,
  FileText,
} from "lucide-react";

const governanceCards = [
  {
    icon: UserCheck,
    title: "Every Request Verified",
    desc: "Every login, every action, every data request is verified fresh — your session, your device, your identity. No shortcuts.",
  },
  {
    icon: Fingerprint,
    title: "Your Sensitive Data Is Locked Separately",
    desc: "Phone numbers, IDs, and financial details get their own layer of encryption — separate from the rest. Even if someone breached the database, they'd see gibberish.",
  },
  {
    icon: Activity,
    title: "Every Change Is Recorded. Forever.",
    desc: "Who changed what, when, and from where — in your local timezone. Exportable logs for audits, compliance, and peace of mind.",
  },
  {
    icon: FileText,
    title: "Delete Means Delete",
    desc: "Request data erasure and it's gone — from every connected tool within 24 hours. Consent management built in. Your customers' privacy, protected by default.",
  },
];

const complianceItems = [
  { icon: MapPin, label: "Your Data Stays in Your Region", status: "Active" },
  { icon: ShieldCheck, label: "Privacy Compliance Ready", status: "Active" },
  { icon: Globe, label: "Multi-Region Infrastructure", status: "Active" },
  { icon: KeyRound, label: "Bank-Grade Encryption", status: "Active" },
];

export function SecurityPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        {/* Animated shield pulse */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            className="w-[500px] h-[500px] rounded-full border border-foreground/[0.03]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full border border-foreground/[0.04]"
            animate={{ scale: [1.05, 1, 1.05], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-3 w-3 mr-1 inline" />
              Security & Governance
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Bank-Grade Security. Zero Vendor Lock-In.
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your data stays in your region. Full audit trails on every action. Daily exports so you always own your data. We just connect it — we never hold it hostage.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {[
              "Your data stays in your country",
              "Privacy compliance built in",
              "Full audit trails",
              "Sensitive fields encrypted separately",
              "Every access logged",
            ].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Governed Execution & Architecture Visuals */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Governed by Design</Badge>
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Nothing Happens Without Your Approval.
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Every suggestion the system makes requires a human to approve it.
              No AI runs wild. No automation executes without your say-so. That's not a limitation — that's the whole point.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Governed Execution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl border bg-white shadow-lg overflow-hidden h-full">
                <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    How decisions flow: Intelligence → Your Approval → Action
                  </span>
                </div>
                <img
                  src={governedExecutionImg}
                  alt="Governed Execution model: 99.4% entity match rate, 100% human-in-the-loop approval, real-time self-healing data, and comparison with traditional autonomous AI agents"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            {/* Three-Plane Model */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl border bg-white shadow-lg overflow-hidden h-full">
                <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    Three layers of protection between your data and the outside world
                  </span>
                </div>
                <img
                  src={threePlaneModelImg}
                  alt="Three-Plane Ingestion Model showing Kernel Layer security, Governance Gate with human-in-the-loop control, and Evidence Drawer with approval required for every action"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Old Way vs Professional */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">Old Way vs. New Way</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              No more "We'll manage in Excel." This is a permanent solution
              that grows with your business — not a temporary fix that breaks at scale.
            </p>
          </FadeIn>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            stagger={0.15}
          >
            <StaggerItem>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="text-lg mb-4 text-muted-foreground">The Old Way</h3>
                  <ul className="space-y-3">
                    {[
                      "Same data maintained in 3 different places",
                      "Excel files on one laptop — laptop crashes, data gone",
                      "Group chats where context gets lost",
                      "'I'll update it tomorrow' — manual updates that never happen",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-foreground/20 shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full border-foreground/20">
                <CardContent className="p-8">
                  <h3 className="text-lg mb-4">The IntegrateWise Way</h3>
                  <ul className="space-y-3">
                    {[
                      "Update once — everything syncs automatically",
                      "Cloud-native — your laptop dies, log in on a new one, continue",
                      "Context stays with the data, not lost in chat groups",
                      "AI auto-updates and alerts you when things need attention",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">Trust & Security Architecture</h2>
          </FadeIn>
          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            stagger={0.1}
          >
            {governanceCards.map((card) => (
              <StaggerItem key={card.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <card.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="text-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">Enterprise Ready. Compliance Built In.</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Built for businesses that take security seriously. Scales as you grow.
            </p>
          </FadeIn>
          <StaggerChildren
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            stagger={0.08}
          >
            {complianceItems.map((item) => (
              <StaggerItem key={item.label}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <motion.div
                      className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h4 className="text-sm mb-1">{item.label}</h4>
                    <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}