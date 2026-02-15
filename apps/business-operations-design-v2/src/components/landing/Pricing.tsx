import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { PRICING_TIERS, formatPrice } from "./product-catalog";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-[#3F5185]/10 text-[#3F5185] text-xs font-bold uppercase tracking-wider mb-5">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E2A4A] mb-6 tracking-tight uppercase leading-[1.1]">
              Simple, value-aligned pricing
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              Start free. Scale as your intelligence grows. Every plan includes the living truth layer and intelligent insights.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  !annual ? "bg-white text-[#1E2A4A] shadow-sm" : "text-slate-500"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  annual ? "bg-white text-[#1E2A4A] shadow-sm" : "text-slate-500"
                }`}
              >
                Annual
                <span className="text-[10px] font-black text-[#F54476] bg-[#F54476]/10 px-2 py-0.5 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-stretch">
          {PRICING_TIERS.map((tier, i) => {
            const price = tier.priceMonthly === 0
              ? "Free"
              : tier.priceMonthly < 0
                ? "Custom"
                : annual
                  ? `$${tier.priceAnnual}`
                  : `$${tier.priceMonthly}`;

            return (
              <motion.div
                key={tier.sku}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl flex flex-col h-full transition-all duration-300 relative ${
                  tier.highlighted
                    ? "bg-[#1E2A4A] text-white ring-2 ring-[#F54476] shadow-2xl lg:scale-[1.02] z-10"
                    : "bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300"
                }`}
              >
                {tier.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#F54476] rounded-full text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-[#F54476]/30 whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div className="p-6 lg:p-7 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-black tracking-tight ${tier.highlighted ? "text-white" : "text-[#1E2A4A]"}`}>
                        {tier.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        tier.highlighted ? "bg-white/10 text-white/60" : "bg-slate-100 text-slate-400"
                      }`}>
                        {tier.sku}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 ${tier.highlighted ? "text-white/50" : "text-slate-400"}`}>
                      {tier.tagline}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black tracking-tighter">{price}</span>
                      {tier.priceMonthly > 0 && (
                        <span className={`text-sm font-medium ${tier.highlighted ? "text-white/40" : "text-slate-400"}`}>
                          /{tier.billingLabel}
                        </span>
                      )}
                      {tier.priceMonthly === 0 && (
                        <span className={`text-sm font-medium ${tier.highlighted ? "text-white/40" : "text-slate-400"}`}>
                          {tier.billingLabel}
                        </span>
                      )}
                      {tier.priceMonthly < 0 && (
                        <span className={`text-sm font-medium ${tier.highlighted ? "text-white/40" : "text-slate-400"}`}>
                          {tier.billingLabel}
                        </span>
                      )}
                    </div>
                    {annual && tier.annualSavings && (
                      <p className="text-[11px] font-bold text-[#F54476] mt-1.5">{tier.annualSavings}</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                          tier.highlighted ? "text-[#F54476]" : "text-emerald-500"
                        }`} />
                        <span className={`${tier.highlighted ? "text-white/75" : "text-slate-600"} leading-snug`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => { window.location.hash = tier.ctaHash; }}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                      tier.highlighted
                        ? "bg-[#F54476] hover:bg-[#E03A66] text-white shadow-lg shadow-[#F54476]/30"
                        : "bg-[#3F5185] hover:bg-[#344573] text-white"
                    }`}
                  >
                    {tier.ctaLabel}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 md:p-14 bg-[#3F5185] rounded-3xl text-white text-center relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">
              Need help choosing the right plan?
            </h3>
            <p className="text-white/50 text-base mb-8 font-medium">
              Our team will help you find the perfect fit based on your tool stack, team size, and intelligence requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => { window.location.hash = "contact"; }}
                className="w-full sm:w-auto px-8 py-4 bg-[#F54476] hover:bg-[#E03A66] text-white rounded-full font-bold text-sm shadow-xl shadow-[#F54476]/30 transition-all flex items-center justify-center gap-2"
              >
                Talk to Sales <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => { window.location.hash = "pricing"; }}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm transition-all"
              >
                Compare All Features
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}