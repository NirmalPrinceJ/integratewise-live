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
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 py-3 shadow-sm"
          : "bg-white/80 backdrop-blur-sm py-5"
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
            <span className="text-xl font-black tracking-tighter text-[#111827] uppercase font-['Plus_Jakarta_Sans']">
              Integrate<span className="text-[#047857]">Wise</span>
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
                  className={`flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] rounded-full transition-all font-['Plus_Jakarta_Sans'] min-h-[44px] ${
                    (item.hash && currentPage === item.hash)
                      ? "text-[#047857] bg-emerald-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
                      className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 ${
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
                              <div className="text-[10px] font-bold text-[#047857]/70 uppercase tracking-[0.25em] mb-3 pb-2 border-b border-gray-100 font-['JetBrains_Mono']">
                                {group.heading}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              {group.links.map((link) => (
                                <button
                                  key={link.hash}
                                  onClick={() => navigate(link.hash)}
                                  className="w-full text-left group/item px-2.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                                >
                                  <div className={`font-bold text-sm leading-tight transition-colors font-['Plus_Jakarta_Sans'] ${
                                    currentPage === link.hash
                                      ? "text-[#047857]"
                                      : "text-gray-700 group-hover/item:text-[#047857]"
                                  }`}>
                                    {link.label}
                                  </div>
                                  {link.desc && (
                                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">
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
                        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-medium">
                            {item.label === "Product"
                              ? "Explore the complete integration intelligence platform"
                              : "Find the right solution for your team"}
                          </span>
                          <button
                            onClick={() => navigate(item.label === "Product" ? "platform-overview" : "solutions")}
                            className="text-[11px] font-bold text-[#047857] hover:text-[#059669] transition-colors flex items-center gap-1"
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
              className="ml-3 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.12em] transition-all hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 font-['Plus_Jakarta_Sans'] min-h-[44px]"
            >
              Request Access
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-800 p-2.5 rounded-xl bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden shadow-xl"
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
                      className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
                    >
                      <span className="text-base font-bold text-gray-800 uppercase tracking-tight font-['Plus_Jakarta_Sans']">
                        {item.label}
                      </span>
                      {item.children && (
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
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
                                  <div className="text-[10px] font-bold text-[#047857]/70 uppercase tracking-[0.2em] px-3 py-1.5 mb-1 font-['JetBrains_Mono']">
                                    {group.heading}
                                  </div>
                                )}
                                <div className="space-y-0.5">
                                  {group.links.map((link) => (
                                    <button
                                      key={link.hash}
                                      onClick={() => navigate(link.hash)}
                                      className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                                        currentPage === link.hash
                                          ? "text-[#047857] bg-emerald-50"
                                          : "text-gray-600 hover:bg-gray-50"
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate("app")}
                  className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold uppercase tracking-[0.12em] text-sm shadow-lg shadow-emerald-600/20 font-['Plus_Jakarta_Sans'] min-h-[48px]"
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