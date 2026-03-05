import { motion, useInView } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router";
import { Logo } from "./Logo";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

const productLinks = [
  { to: "/platform", label: "Platform" },
  { to: "/integrations", label: "Integrations" },
  { to: "/pricing", label: "Pricing" },
  { to: "/security", label: "Security & Governance" },
];
const companyLinks = [
  { to: "/story", label: "Our Story" },
  { to: "/who-its-for", label: "Who It's For" },
  { to: "#", label: "Careers" },
  { to: "mailto:hello@integratewise.com", label: "Contact" },
];
const resourceLinks = [
  { to: "/login", label: "App Login & Architecture" },
  { to: "#", label: "Documentation" },
  { to: "#", label: "Architecture (L0-L3)" },
  { to: "mailto:support@integratewise.com", label: "Support" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      setSubmitting(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "https://gateway.integratewise.ai";
      const res = await fetch(`${API_BASE}/api/v1/public/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(data.error || "Failed to subscribe");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer ref={ref} className="bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Subtle animated glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/[0.015] blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/[0.01] blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + email */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Logo className="h-8 w-auto text-white" />
              <span className="text-white tracking-tight text-lg font-normal">
                Integrate<span className="opacity-30">Wise</span>
              </span>
            </Link>
            <p className="text-white/45 mb-6 max-w-md text-sm leading-relaxed">
              The Cognitive Operating System for Growing Businesses. Where your data thinks, connects, and works for you.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className="max-w-xs bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30 focus:border-white/20 rounded-full px-4 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={submitting || submitted}
                className="bg-white text-[#0a0a0a] hover:bg-white/90 rounded-full px-5 disabled:opacity-50"
              >
                {submitted ? "Sent!" : submitting ? "Sending..." : "Get Started"} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </form>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </motion.div>

          {/* Link columns */}
          {[
            { title: "Product", links: productLinks, delay: 0.1 },
            { title: "Company", links: companyLinks, delay: 0.15 },
            { title: "Resources", links: resourceLinks, delay: 0.2 },
          ].map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: section.delay }}
            >
              <h4 className="text-white/70 mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: section.delay + 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    {link.to.startsWith("mailto:") ? (
                      <a
                        href={link.to}
                        className="text-white/35 hover:text-white transition-colors duration-200 text-sm inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-white/35 hover:text-white transition-colors duration-200 text-sm inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-white/[0.06] my-8"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ transformOrigin: "left" }}
        />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[13px] text-white/25 mb-4 md:mb-0">
            &copy; 2026 IntegrateWise. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[13px] text-white/25">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookie Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
