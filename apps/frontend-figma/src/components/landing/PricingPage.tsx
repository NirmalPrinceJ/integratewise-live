/**
 * PricingPage — Full pricing page with tier cards, feature comparison, add-ons, and FAQ.
 * Uses product-catalog.ts as single source of truth for all SKU data.
 */
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Check, X, ArrowRight, ChevronDown, Info, Zap,
  Shield, Headphones, Puzzle, Plus,
} from "lucide-react";
import {
  PRICING_TIERS,
  ADD_ONS,
  FEATURE_COMPARISON,
  PRICING_FAQ,
  getComparisonCategories,
  getComparisonByCategory,
  getAddOnsByCategory,
  formatPrice,
  type TierSlug,
} from "./product-catalog";

/* ── Animation wrapper ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIER CARDS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function TierCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold uppercase tracking-wider mb-5 font-['JetBrains_Mono']">
            Pricing & Plans
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5 font-['Plus_Jakarta_Sans']">
            Choose the Right Plan for{" "}
            <span className="text-[#047857]">
              Your Team
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">
            Start free with 3 connectors. Upgrade as the workspace grows with you. Every plan includes the living truth layer and intelligent insights.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                !annual ? "bg-white text-[#1E2A4A] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                annual ? "bg-white text-[#1E2A4A] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annual
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {PRICING_TIERS.map((tier, i) => {
            const displayPrice = tier.priceMonthly === 0
              ? "Free"
              : tier.priceMonthly < 0
                ? "Custom"
                : annual
                  ? `$${tier.priceAnnual}`
                  : `$${tier.priceMonthly}`;

            return (
              <FadeIn key={tier.sku} delay={i * 0.08}>
                <div className={`rounded-2xl flex flex-col h-full transition-all relative ${
                  tier.highlighted
                    ? "bg-gray-900 text-white ring-2 ring-emerald-500 shadow-2xl"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}>
                  {tier.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[#059669] rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap font-['Plus_Jakarta_Sans']">
                      {tier.badge}
                    </div>
                  )}

                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-lg font-bold ${tier.highlighted ? "text-white" : "text-gray-900"} font-['Plus_Jakarta_Sans']`}>
                          {tier.name}
                        </h3>
                        <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded ${
                          tier.highlighted ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-300"
                        } font-['JetBrains_Mono']`}>
                          {tier.sku}
                        </span>
                      </div>
                      <p className={`text-sm mb-4 ${tier.highlighted ? "text-white/50" : "text-gray-400"}`}>
                        {tier.tagline}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tight">{displayPrice}</span>
                        {tier.priceMonthly > 0 && (
                          <span className={`text-sm ${tier.highlighted ? "text-white/35" : "text-gray-400"}`}>
                            /{tier.billingLabel}
                          </span>
                        )}
                      </div>
                      {annual && tier.annualSavings && (
                        <p className="text-[11px] font-bold text-[#10B981] mt-1">{tier.annualSavings}</p>
                      )}
                    </div>

                    <p className={`text-[13px] leading-relaxed mb-5 ${tier.highlighted ? "text-white/50" : "text-gray-500"}`}>
                      {tier.description}
                    </p>

                    <ul className="space-y-2 flex-1 mb-6">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13px]">
                          <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            tier.highlighted ? "text-[#10B981]" : "text-[#059669]"
                          }`} />
                          <span className={tier.highlighted ? "text-white/70" : "text-gray-600"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => { window.location.hash = tier.ctaHash; }}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all font-['Plus_Jakarta_Sans'] ${
                        tier.highlighted
                          ? "bg-[#059669] hover:bg-[#047857] text-white shadow-lg"
                          : "bg-[#059669] hover:bg-[#047857] text-white"
                      }`}
                    >
                      {tier.ctaLabel}
                    </button>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE COMPARISON TABLE
   ═══════════════════════════════════════════════════════════════════════════ */

function FeatureComparisonSection() {
  const categories = getComparisonCategories();
  const tierSlugs: TierSlug[] = ["starter", "growth", "professional", "enterprise"];
  const tierNames = ["Starter", "Growth", "Professional", "Enterprise"];

  const renderValue = (val: boolean | string) => {
    if (val === true) return <Check className="w-4 h-4 text-[#059669] mx-auto" />;
    if (val === false) return <X className="w-4 h-4 text-gray-200 mx-auto" />;
    return <span className="text-sm font-medium text-gray-900">{val}</span>;
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 font-['Plus_Jakarta_Sans']">
            Compare All Features
          </h2>
          <p className="text-base text-slate-500">
            Detailed breakdown of what's included in each plan
          </p>
        </FadeIn>

        <FadeIn>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
              <div className="p-4 text-sm font-bold text-slate-500">Feature</div>
              {tierNames.map((name, i) => (
                <div key={i} className={`p-4 text-sm font-bold text-center ${
                  name === "Professional" ? "text-[#059669]" : "text-gray-900"
                } font-['Plus_Jakarta_Sans']`}>
                  {name}
                </div>
              ))}
            </div>

            {/* Rows grouped by category */}
            {categories.map((category) => (
              <div key={category}>
                {/* Category header */}
                <div className="grid grid-cols-5 bg-emerald-50/50 border-b border-gray-100">
                  <div className="col-span-5 px-4 py-2.5 text-[11px] font-black text-[#059669] uppercase tracking-widest font-['JetBrains_Mono']">
                    {category}
                  </div>
                </div>

                {/* Feature rows */}
                {getComparisonByCategory(category).map((row, j) => (
                  <div key={j} className="grid grid-cols-5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="p-3.5 text-sm text-slate-700 font-medium flex items-center gap-1.5">
                      {row.feature}
                      {row.tooltip && (
                        <span className="group relative">
                          <Info className="w-3 h-3 text-slate-300 cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#1E2A4A] text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {row.tooltip}
                          </span>
                        </span>
                      )}
                    </div>
                    {tierSlugs.map((slug) => (
                      <div key={slug} className="p-3.5 flex justify-center items-center">
                        {renderValue(row[slug])}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADD-ONS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

const CATEGORY_META: Record<string, { icon: any; label: string; color: string }> = {
  capacity: { icon: Zap, label: "Capacity", color: "#059669" },
  security: { icon: Shield, label: "Security & Compliance", color: "#059669" },
  support: { icon: Headphones, label: "Support", color: "#059669" },
  integration: { icon: Puzzle, label: "Integration", color: "#059669" },
};

function AddOnsSection() {
  const categories = ["capacity", "security", "support", "integration"] as const;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold uppercase tracking-wider mb-4 font-['JetBrains_Mono']">
            Add-Ons
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A4A] mb-3">
            Customize Your Plan
          </h2>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Extend any plan with additional capacity, security features, or premium support. Add-ons can be added or removed at any time.
          </p>
        </FadeIn>

        <div className="space-y-10">
          {categories.map((cat) => {
            const addOns = getAddOnsByCategory(cat);
            if (addOns.length === 0) return null;
            const meta = CATEGORY_META[cat];

            return (
              <FadeIn key={cat}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${meta.color}10` }}>
                    <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E2A4A] uppercase tracking-wider">{meta.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addOns.map((addon) => (
                    <div key={addon.sku} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Plus className="w-5 h-5 text-[#059669]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-[#1E2A4A]">{addon.name}</h4>
                          <span className="text-[9px] font-mono text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                            {addon.sku}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-500 leading-relaxed mb-2">{addon.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-bold text-[#1E2A4A]">${addon.price}</span>
                            <span className="text-slate-400 ml-1 text-[11px]">{addon.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {addon.includedIn && addon.includedIn.length > 0 && (
                              <span className="text-[10px] text-slate-400">
                                Included in {addon.includedIn.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A4A] mb-3">
            Pricing FAQ
          </h2>
          <p className="text-base text-slate-500">
            Everything you need to know about billing, plans, and upgrades
          </p>
        </FadeIn>

        <div className="space-y-3">
          {PRICING_FAQ.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-[#1E2A4A] pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTERPRISE CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function EnterpriseCTA() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <span className="inline-block py-1 px-4 rounded-full bg-white/10 text-white/60 text-xs font-bold uppercase tracking-wider mb-5 font-['JetBrains_Mono']">
            Enterprise · IW-ENT-CUST
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 font-['Plus_Jakarta_Sans']">
            Need a Custom Solution?
          </h2>
          <p className="text-base md:text-lg text-white/50 mb-8 max-w-2xl mx-auto">
            Private cloud deployment, custom ML models, SAML/SSO, dedicated CSM, and SLAs up to 99.99%. Let's design the perfect plan for your organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { window.location.hash = "contact"; }}
              className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-base shadow-lg transition-all flex items-center gap-2 group font-['Plus_Jakarta_Sans']"
            >
              Contact Enterprise Sales <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => { window.location.hash = "security"; }}
              className="px-7 py-3.5 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold text-base transition-all"
            >
              View Security Docs
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export function PricingPage() {
  return (
    <>
      <TierCards />
      <FeatureComparisonSection />
      <AddOnsSection />
      <PricingFAQ />
      <EnterpriseCTA />
    </>
  );
}