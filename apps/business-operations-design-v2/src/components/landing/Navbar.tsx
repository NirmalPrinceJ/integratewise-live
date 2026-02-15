import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { motion, AnimatePresence } from "motion/react";

/* ── Types ── */

interface NavLink {
  label: string;
  hash: string;
  desc?: string;
}

interface NavGroup {
  heading?: string;
  links: NavLink[];
}

interface NavItem {
  label: string;
  hash?: string;
  children?: NavGroup[];
  wide?: boolean; // mega-menu mode
}

/* ── Sitemap-driven navigation structure ── */

const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    wide: true,
    children: [
      {
        heading: "Platform",
        links: [
          { label: "Platform Overview", hash: "platform-overview", desc: "End-to-end integration intelligence OS" },
          { label: "Architecture", hash: "technical", desc: "Five-layer cognitive system design" },
          { label: "Features", hash: "features", desc: "Full capability set with governance" },
          { label: "Security", hash: "security", desc: "Enterprise-grade compliance & encryption" },
          { label: "Enterprise Integration", hash: "enterprise-integration", desc: "At-scale connectors & pipelines" },
        ],
      },
      {
        heading: "7 AI Pillars",
        links: [
          { label: "Connect", hash: "connect", desc: "One-click OAuth connectors" },
          { label: "Context", hash: "context", desc: "Canonical Spine — single source of truth" },
          { label: "Cognition", hash: "cognition", desc: "Think Engine AI reasoning" },
          { label: "Action", hash: "action", desc: "Governed human-approved execution" },
          { label: "Memory", hash: "memory", desc: "Organizational learning & patterns" },
          { label: "Correct", hash: "correct", desc: "Self-healing data quality" },
          { label: "Repeat", hash: "repeat", desc: "Compound intelligence loop" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    wide: true,
    children: [
      {
        heading: "Use Cases",
        links: [
          { label: "All Use Cases", hash: "use-cases", desc: "Five core integration challenges" },
          { label: "Customer Data Unification", hash: "customer-data-unification", desc: "Single canonical customer entity" },
          { label: "Automated RevOps & Billing", hash: "automated-revops-billing-sync", desc: "Zero manual reconciliation" },
          { label: "Proactive Monitoring", hash: "proactive-integration-monitoring", desc: "Self-healing integrations" },
          { label: "Zero-Disruption Upgrades", hash: "zero-disruption-integration-upgrades", desc: "No downtime schema changes" },
          { label: "AI Compliance Audit", hash: "ai-assisted-compliance-audit", desc: "Automated evidence & lineage" },
        ],
      },
      {
        heading: "Key Features",
        links: [
          { label: "Contextual AI", hash: "contextual-ai", desc: "Org-aware AI reasoning" },
          { label: "Human-Approved Actions", hash: "human-approved-actions", desc: "Governance-first execution" },
          { label: "Evidence-Backed Execution", hash: "evidence-backed-executions", desc: "Full provenance trails" },
          { label: "Three Worlds in One Sync", hash: "three-worlds-in-one-sync", desc: "Three-plane architecture" },
        ],
      },
      {
        heading: "By Role",
        links: [
          { label: "Customer Success", hash: "csm", desc: "Health, churn & expansion" },
          { label: "Revenue Operations", hash: "revops-role", desc: "Pipeline & billing intelligence" },
          { label: "Founders & Executives", hash: "founders-executives", desc: "Strategic visibility" },
          { label: "Operations", hash: "operations", desc: "Workflow automation" },
          { label: "IT & Security", hash: "it-admin-security", desc: "Governance & RBAC" },
          { label: "Freelancers", hash: "freelancers", desc: "Solo intelligence" },
          { label: "Students", hash: "students", desc: "Free learning & certification" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        heading: "Learn",
        links: [
          { label: "Blog", hash: "blog", desc: "Articles & thought leadership" },
          { label: "Newsletter", hash: "newsletter", desc: "Weekly intelligence digest" },
          { label: "Guides", hash: "guides", desc: "Step-by-step walkthroughs" },
          { label: "Webinars", hash: "webinars", desc: "Live demos & panels" },
        ],
      },
      {
        heading: "Reference",
        links: [
          { label: "Documentation", hash: "documentation", desc: "API reference & SDK guides" },
          { label: "Case Studies", hash: "case-studies", desc: "Real results from real teams" },
          { label: "Support", hash: "support", desc: "Knowledge base & forums" },
        ],
      },
    ],
  },
  { label: "Pricing", hash: "pricing" },
  { label: "Contact", hash: "contact" },
];

/* ── Component ── */

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedMobileGroup(null);
  }, [currentPage]);

  const navigate = (hash: string) => {
    window.location.hash = hash;
    onNavigate(hash || "home");
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 250);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => navigate("")}
          >
            <Logo width={36} className="mr-2.5 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black tracking-tighter text-[#1E2A4A] uppercase">
              Integrate<span className="text-[#F54476]">Wise</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => {
                    if (item.hash) navigate(item.hash);
                    else if (item.children) setOpenDropdown(openDropdown === item.label ? null : item.label);
                  }}
                  className={`flex items-center gap-1 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] rounded-full transition-all ${
                    (item.hash && currentPage === item.hash)
                      ? "text-[#F54476] bg-[#F54476]/5"
                      : "text-[#1E2A4A] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  )}
                </button>

                {/* Dropdown / Mega Menu */}
                <AnimatePresence>
                  {item.children && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-900/8 overflow-hidden z-50 ${
                        item.wide
                          ? "left-1/2 -translate-x-1/2 w-[720px]"
                          : "left-0 min-w-[340px]"
                      }`}
                      onMouseEnter={() => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={`p-6 ${item.wide ? "grid grid-cols-3 gap-6" : "grid gap-6"}`}>
                        {item.children.map((group) => (
                          <div key={group.heading}>
                            {group.heading && (
                              <div className="text-[10px] font-black text-[#3F5185] uppercase tracking-[0.25em] mb-3 pb-2 border-b border-slate-100">
                                {group.heading}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              {group.links.map((link) => (
                                <button
                                  key={link.hash}
                                  onClick={() => navigate(link.hash)}
                                  className="w-full text-left group/item px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  <div className={`font-bold text-[13px] leading-tight transition-colors ${
                                    currentPage === link.hash
                                      ? "text-[#F54476]"
                                      : "text-[#1E2A4A] group-hover/item:text-[#F54476]"
                                  }`}>
                                    {link.label}
                                  </div>
                                  {link.desc && (
                                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                      {link.desc}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer CTA for mega-menus */}
                      {item.wide && (
                        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.label === "Product"
                              ? "Explore the complete integration intelligence platform"
                              : "Find the right solution for your team"}
                          </span>
                          <button
                            onClick={() => navigate(item.label === "Product" ? "platform-overview" : "solutions")}
                            className="text-[11px] font-bold text-[#3F5185] hover:text-[#F54476] transition-colors flex items-center gap-1"
                          >
                            View All <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <button
              onClick={() => navigate("app")}
              className="ml-3 bg-[#1E2A4A] hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:shadow-xl hover:shadow-[#1E2A4A]/20 active:scale-95"
            >
              Request Access
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#1E2A4A] p-2 rounded-xl bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        if (item.hash) navigate(item.hash);
                        else setExpandedMobileGroup(expandedMobileGroup === item.label ? null : item.label);
                      }}
                      className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-black text-[#1E2A4A] uppercase tracking-tight">
                        {item.label}
                      </span>
                      {item.children && (
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedMobileGroup === item.label ? "rotate-180" : ""
                        }`} />
                      )}
                    </button>

                    {/* Mobile Sub-nav */}
                    <AnimatePresence>
                      {item.children && expandedMobileGroup === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 pb-3 space-y-4">
                            {item.children.map((group) => (
                              <div key={group.heading}>
                                {group.heading && (
                                  <div className="text-[10px] font-black text-[#3F5185] uppercase tracking-[0.2em] px-3 py-1.5 mb-1">
                                    {group.heading}
                                  </div>
                                )}
                                <div className="space-y-0.5">
                                  {group.links.map((link) => (
                                    <button
                                      key={link.hash}
                                      onClick={() => navigate(link.hash)}
                                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        currentPage === link.hash
                                          ? "text-[#F54476] bg-[#F54476]/5"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {link.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate("app")}
                  className="w-full bg-[#F54476] text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-[#F54476]/20"
                >
                  Request Access
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
