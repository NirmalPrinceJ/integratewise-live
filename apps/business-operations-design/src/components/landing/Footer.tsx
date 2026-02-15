import React, { useState } from "react";
import { Code, AtSign, Briefcase, Mail, ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { LogoWithText } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Overview", hash: "platform-overview" },
        { label: "Architecture", hash: "technical" },
        { label: "Features", hash: "features" },
        { label: "Security", hash: "security" },
        { label: "Enterprise Integration", hash: "enterprise-integration" },
        { label: "AI Pillars", hash: "connect" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Use Cases", hash: "use-cases" },
        { label: "Customer Success", hash: "csm" },
        { label: "Revenue Operations", hash: "revops-role" },
        { label: "Founders & Execs", hash: "founders-executives" },
        { label: "Operations", hash: "operations" },
        { label: "IT & Security", hash: "it-admin-security" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", hash: "blog" },
        { label: "Documentation", hash: "documentation" },
        { label: "Guides", hash: "guides" },
        { label: "Webinars", hash: "webinars" },
        { label: "Case Studies", hash: "case-studies" },
        { label: "Newsletter", hash: "newsletter" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Contact", hash: "contact" },
        { label: "Pricing", hash: "pricing" },
        { label: "Support", hash: "support" },
        { label: "Legal", hash: "legal" },
        { label: "Careers", hash: "careers" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 pt-16 md:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top: Logo + Links + Newsletter ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Logo & Tagline */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div
              className="inline-flex items-center gap-2.5 cursor-pointer group mb-5"
              onClick={() => { window.location.hash = ""; window.scrollTo(0, 0); }}
            >
              <LogoWithText markSize={36} textSize="text-xl" inverted className="" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              The integration intelligence workspace that makes your tools smarter every day — empowered by AI, with humans always in control.
            </p>
            <div className="flex gap-3">
              {[
                { icon: AtSign, href: "#", label: "Twitter" },
                { icon: Briefcase, href: "#", label: "LinkedIn" },
                { icon: Code, href: "#", label: "GitHub" },
                { icon: Mail, href: "mailto:connect@integratewise.ai", label: "Email" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all min-w-[44px] min-h-[44px]"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-5: Link Groups */}
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-5">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <button
                      onClick={() => { window.location.hash = link.hash; window.scrollTo(0, 0); }}
                      className="text-white/60 hover:text-[#10B981] font-medium text-sm transition-colors flex items-center gap-1 group/link"
                    >
                      {link.label}
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter Subscribe Bar ── */}
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-12 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">Stay in the Intelligence Loop</h3>
              <p className="text-sm text-white/60">
                Weekly insights on integration intelligence, product updates, and best practices. Join 2,400+ subscribers.
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-sm">
                  <Check className="w-4 h-4" />
                  You're in! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="flex-1 md:w-56 px-4 py-2.5 bg-white/10 text-white placeholder:text-white/25 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-bold text-sm transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-bold text-white/40 uppercase tracking-widest">
            <p>&copy; {currentYear} IntegrateWise Inc.</p>
            <p className="hidden sm:block">San Francisco &middot; Bangalore</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              { label: "Privacy", hash: "legal" },
              { label: "Terms", hash: "legal" },
              { label: "Security", hash: "security" },
              { label: "Status", hash: "support" },
            ].map((link, i) => (
              <button
                key={i}
                onClick={() => { window.location.hash = link.hash; window.scrollTo(0, 0); }}
                className="text-xs font-bold text-white/40 hover:text-[#10B981] transition-colors uppercase tracking-widest"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}