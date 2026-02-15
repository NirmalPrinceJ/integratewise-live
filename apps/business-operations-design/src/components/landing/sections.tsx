/**
 * Reusable Section Components — Relume-style patterns
 * Hero, FeatureGrid, FeatureWithImage, Stats, Testimonial, CTA, FAQ, Timeline, LogoCloud, Team, Blog, Contact
 */
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight, ChevronDown, ChevronRight, Check, Star, Quote,
  Mail, Phone, MapPin, ExternalLink,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  DataFlowInfographic, 
  SecurityShieldInfographic,
  WorkflowAutomationInfographic,
  RoleDashboardInfographic,
  TeamCollaborationInfographic,
  AICircuitInfographic,
  NetworkInfographic
} from "./infographics";

/* ─── Animation wrapper ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. HERO SECTION
   ══════════════════════════════════════════════════════════════════════════ */

interface HeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: { label: string; hash: string };
  secondaryCta?: { label: string; hash: string };
  image?: string;
  imageAlt?: string;
  layout?: "center" | "split";
  dark?: boolean;
}

export function HeroSection({
  badge, title, highlight, description,
  primaryCta, secondaryCta, image, imageAlt,
  layout = "center", dark = false,
}: HeroProps) {
  const bg = dark ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const descColor = dark ? "text-white/60" : "text-gray-500";

  if (layout === "split" && image) {
    return (
      <section className={`pt-28 md:pt-36 pb-16 md:pb-24 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 ${image ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12 lg:gap-16 items-center`}>
            <FadeIn>
              {badge && (
                <span className={`inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-5 font-['JetBrains_Mono'] ${dark ? "bg-white/10 text-white/70" : "bg-emerald-50 text-[#059669]"}`}>
                  {badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 font-['Plus_Jakarta_Sans']">
                {title}{" "}
                {highlight && <span className="text-[#047857]">{highlight}</span>}
              </h1>
              <p className={`text-lg md:text-xl ${descColor} leading-relaxed mb-8`}>{description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                {primaryCta && (
                  <button onClick={() => { window.location.hash = primaryCta.hash; }} className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-base shadow-lg transition-all flex items-center gap-2 group font-['Plus_Jakarta_Sans'] min-h-[48px]">
                    {primaryCta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {secondaryCta && (
                  <button onClick={() => { window.location.hash = secondaryCta.hash; }} className={`px-7 py-3.5 border-2 rounded-full font-bold text-base transition-all ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-700 hover:border-[#059669] hover:text-[#059669]"}`}>
                    {secondaryCta.label}
                  </button>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback src={image} alt={imageAlt || title} className="w-full h-auto object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`pt-28 md:pt-36 pb-16 md:pb-24 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn className="max-w-3xl mx-auto">
          {badge && (
            <span className={`inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-5 ${dark ? "bg-white/10 text-white/70" : "bg-emerald-50 text-[#059669]"}`}>
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            {title}{" "}
            {highlight && <span className="text-[#047857]">{highlight}</span>}
          </h1>
          <p className={`text-lg md:text-xl ${descColor} leading-relaxed mb-8`}>{description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {primaryCta && (
              <button onClick={() => { window.location.hash = primaryCta.hash; }} className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-base shadow-lg transition-all flex items-center gap-2 group">
                {primaryCta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {secondaryCta && (
              <button onClick={() => { window.location.hash = secondaryCta.hash; }} className={`px-7 py-3.5 border-2 rounded-full font-bold text-base transition-all ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-700 hover:border-[#059669] hover:text-[#059669]"}`}>
                {secondaryCta.label}
              </button>
            )}
          </div>
        </FadeIn>
        {image && (
          <FadeIn delay={0.2} className="mt-12 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/50">
              <ImageWithFallback src={image} alt={imageAlt || title} className="w-full h-auto object-cover" />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. FEATURE GRID (2x2 or 3x3)
   ══════════════════════════════════════════════════════════════════════════ */

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface FeatureGridProps {
  badge?: string;
  title: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  accentColor?: string;
}

export function FeatureGrid({ badge, title, subtitle, features, columns = 3, accentColor = "#059669" }: FeatureGridProps) {
  const gridCols = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {badge && <span className="inline-block py-1 px-4 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold uppercase tracking-wider mb-4">{badge}</span>}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{title}</h2>
          {subtitle && <p className="text-base md:text-lg text-gray-500 leading-relaxed">{subtitle}</p>}
        </FadeIn>
        <div className={`grid grid-cols-1 ${gridCols} gap-6 md:gap-8`}>
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:border-slate-300 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${accentColor}10` }}>
                  <f.icon className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FEATURE WITH IMAGE (alternating layout)
   ═══════════════════════════════════════════════════════════════════════════ */

interface FeatureWithImageProps {
  badge?: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  image: string;
  imageAlt?: string;
  imageRight?: boolean;
  cta?: { label: string; hash: string };
  accentColor?: string;
}

export function FeatureWithImage({ badge, title, description, bulletPoints, image, imageAlt, imageRight = true, cta, accentColor = "#059669" }: FeatureWithImageProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageRight ? "" : "lg:[direction:rtl] lg:[&>*]:![direction:ltr]"}`}>
          <FadeIn>
            {badge && <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>{badge}</span>}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{title}</h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-6">{description}</p>
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3 mb-6">
                {bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                      <Check className="w-3 h-3" style={{ color: accentColor }} />
                    </div>
                    <span className="text-sm text-gray-600">{bp}</span>
                  </li>
                ))}
              </ul>
            )}
            {cta && (
              <button onClick={() => { window.location.hash = cta.hash; }} className="inline-flex items-center gap-2 font-bold text-sm group" style={{ color: accentColor }}>
                {cta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <ImageWithFallback src={image} alt={imageAlt || title} className="w-full h-auto object-cover" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. STATS BAR
   ═══════════════════════════════════════════════════════════════════════════ */

interface Stat { value: string; label: string; suffix?: string }

interface StatsBarProps {
  stats: Stat[];
  dark?: boolean;
  title?: string;
  subtitle?: string;
}

export function StatsBar({ stats, dark = false, title, subtitle }: StatsBarProps) {
  const bg = dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const gridCols = stats.length <= 2 ? "md:grid-cols-2" : stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <section className={`py-14 md:py-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <FadeIn className="text-center max-w-2xl mx-auto mb-10">
            {title && <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{title}</h2>}
            {subtitle && <p className={`text-base ${dark ? "text-white/60" : "text-gray-500"}`}>{subtitle}</p>}
          </FadeIn>
        )}
        <div className={`grid grid-cols-2 ${gridCols} gap-6 md:gap-8`}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">
                <span className={dark ? "text-[#10B981]" : "text-[#059669]"}>{s.value}</span>
                {s.suffix && <span className="text-lg md:text-xl font-bold">{s.suffix}</span>}
              </div>
              <div className={`text-sm font-medium ${dark ? "text-white/50" : "text-gray-500"}`}>{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5. TESTIMONIAL SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

interface Testimonial { quote: string; author: string; role: string; company: string; avatar?: string; rating?: number }

interface TestimonialProps { testimonials: Testimonial[]; title?: string }

export function TestimonialSection({ testimonials, title }: TestimonialProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{title}</h2>
          </FadeIn>
        )}
        <div className={`grid grid-cols-1 ${testimonials.length > 1 ? "md:grid-cols-2" : ""} ${testimonials.length > 2 ? "lg:grid-cols-3" : ""} gap-6`}>
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 h-full flex flex-col">
                {t.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
                <Quote className="w-8 h-8 text-[#059669]/20 mb-3" />
                <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-1 mb-6">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {t.avatar ? (
                    <ImageWithFallback src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold text-sm">
                      {t.author.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.author}</div>
                    <div className="text-xs text-gray-400">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. CTA SECTION
   ══════════════════════════════════════════════════════════════════════════ */

interface CTAProps {
  title: string;
  description: string;
  primaryCta: { label: string; hash: string };
  secondaryCta?: { label: string; hash: string };
  dark?: boolean;
}

export function CTASection({ title, description, primaryCta, secondaryCta, dark = true }: CTAProps) {
  return (
    <section className={`py-16 md:py-24 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
            {title}
          </h2>
          <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${dark ? "text-white/60" : "text-gray-500"}`}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => { window.location.hash = primaryCta.hash; }} className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold text-base shadow-lg transition-all flex items-center gap-2 group">
              {primaryCta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {secondaryCta && (
              <button onClick={() => { window.location.hash = secondaryCta.hash; }} className={`px-7 py-3.5 border-2 rounded-full font-bold text-base transition-all ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-700 hover:border-[#059669]"}`}>
                {secondaryCta.label}
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. FAQ SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

interface FAQItem { question: string; answer: string }

interface FAQProps { title?: string; subtitle?: string; faqs: FAQItem[] }

export function FAQSection({ title = "Frequently Asked Questions", subtitle, faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm md:text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
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
   8. TIMELINE / STEPS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

interface TimelineStep { title: string; description: string }

interface TimelineProps { title?: string; subtitle?: string; steps: TimelineStep[]; accentColor?: string }

export function TimelineSection({ title, subtitle, steps, accentColor = "#059669" }: TimelineProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <FadeIn className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
          </FadeIn>
        )}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-5 md:gap-8 items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 relative z-10 shadow-lg" style={{ backgroundColor: accentColor }}>
                    {i + 1}
                  </div>
                  <div className="pt-2 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. LOGO CLOUD
   ═══════════════════════════════════════════════════════════════════════════ */

interface LogoCloudProps { title?: string; logos: string[] }

export function LogoCloud({ title = "Trusted by innovative teams", logos }: LogoCloudProps) {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{title}</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {logos.map((name, i) => (
            <span key={i} className="text-lg md:text-xl font-bold text-slate-300 hover:text-slate-500 transition-colors cursor-default">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. TEAM GRID
   ═══════════════════════════════════════════════════════════════════════════ */

interface TeamMember { name: string; role: string; image?: string; bio?: string }

interface TeamGridProps { title?: string; subtitle?: string; members: TeamMember[] }

export function TeamGrid({ title = "Our Team", subtitle, members }: TeamGridProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="text-center group">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-emerald-50 mb-4 group-hover:scale-105 transition-transform">
                  {m.image ? (
                    <ImageWithFallback src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#059669] font-bold text-2xl">
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.role}</p>
                {m.bio && <p className="text-xs text-gray-400 mt-2">{m.bio}</p>}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. BLOG GRID
   ═══════════════════════════════════════════════════════════════════════════ */

interface BlogPost { title: string; excerpt: string; category: string; date: string; readTime: string; image: string; slug?: string }

interface BlogGridProps { title?: string; subtitle?: string; posts: BlogPost[] }

export function BlogGrid({ title = "Latest Articles", subtitle, posts }: BlogGridProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-[10px] text-gray-400">{post.date}</span>
                    <span className="text-[10px] text-gray-400">· {post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#059669] transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-500 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm font-bold text-[#059669] group-hover:gap-2.5 transition-all">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. CONTACT FORM
   ═══════════════════════════════════════════════════════════════════════════ */

interface ContactProps { title?: string; subtitle?: string }

export function ContactSection({ title = "Get in Touch", subtitle }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
            {subtitle && <p className="text-base text-gray-500 leading-relaxed mb-8">{subtitle}</p>}
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "connect@integratewise.ai", href: "mailto:connect@integratewise.ai" },
                { icon: Phone, label: "Phone", value: "+91-7026317111", href: "tel:+917026317111" },
                { icon: MapPin, label: "Offices", value: "San Francisco, CA · Bangalore, IN", href: undefined },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-gray-900 hover:text-[#059669] transition-colors">{item.value}</a>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            {submitted ? (
              <div className="bg-emerald-50 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Message Sent!</h3>
                <p className="text-sm text-emerald-700">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-slate-50 rounded-2xl p-6 md:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">First Name</label>
                    <input type="text" required className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Last Name</label>
                    <input type="text" required className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Work Email</label>
                  <input type="email" required className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Company</label>
                  <input type="text" className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">How can we help?</label>
                  <select className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]">
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Careers</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Message</label>
                  <textarea rows={4} className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#059669]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-bold text-sm transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   13. COMPARISON TABLE
   ═══════════════════════════════════════════════════════════════════════════ */

interface ComparisonRow { feature: string; us: boolean | string; them: boolean | string }

interface ComparisonProps { title?: string; subtitle?: string; usLabel?: string; themLabel?: string; rows: ComparisonRow[] }

export function ComparisonTable({ title, subtitle, usLabel = "IntegrateWise", themLabel = "Others", rows }: ComparisonProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
          </FadeIn>
        )}
        <FadeIn>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <div className="p-4 text-sm font-bold text-slate-500">Feature</div>
              <div className="p-4 text-sm font-bold text-center text-[#059669]">{usLabel}</div>
              <div className="p-4 text-sm font-bold text-center text-gray-400">{themLabel}</div>
            </div>
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="p-4 text-sm text-gray-700 font-medium">{row.feature}</div>
                <div className="p-4 flex justify-center">
                  {typeof row.us === "boolean" ? (
                    row.us ? <Check className="w-5 h-5 text-emerald-500" /> : <span className="text-slate-300">—</span>
                  ) : (
                    <span className="text-sm font-medium text-[#059669]">{row.us}</span>
                  )}
                </div>
                <div className="p-4 flex justify-center">
                  {typeof row.them === "boolean" ? (
                    row.them ? <Check className="w-5 h-5 text-slate-400" /> : <span className="text-slate-300">—</span>
                  ) : (
                    <span className="text-sm text-slate-500">{row.them}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   14. NEWSLETTER SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

interface NewsletterProps { title?: string; description?: string }

export function NewsletterSection({ title = "Stay Updated", description }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="py-16 md:py-20 bg-[#059669]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">{title}</h2>
          {description && <p className="text-base text-white/60 mb-8">{description}</p>}
          {done ? (
            <p className="text-white font-bold">You're in! Check your inbox.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true); }} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm" />
              <button type="submit" className="px-6 py-3 bg-white text-[#059669] hover:bg-gray-50 rounded-lg font-bold text-sm transition-colors shrink-0">Subscribe</button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   15. PRICING TABLE
   ═══════════════════════════════════════════════════════════════════════════ */

interface PricingTier { name: string; price: string; period?: string; description: string; features: string[]; cta: string; highlighted?: boolean }

interface PricingTableProps { title?: string; subtitle?: string; tiers: PricingTier[] }

export function PricingTable({ title, subtitle, tiers }: PricingTableProps) {
  const gridCols = tiers.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
          </FadeIn>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-6 max-w-5xl mx-auto`}>
          {tiers.map((tier, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`rounded-2xl p-6 md:p-8 h-full flex flex-col ${tier.highlighted ? "bg-gray-900 text-white ring-2 ring-emerald-500 shadow-xl" : "bg-white border border-gray-200 shadow-sm"}`}>
                <h3 className={`text-lg font-bold mb-1 ${tier.highlighted ? "text-white" : "text-gray-900"}`}>{tier.name}</h3>
                <p className={`text-sm mb-4 ${tier.highlighted ? "text-white/60" : "text-gray-500"}`}>{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black">{tier.price}</span>
                  {tier.period && <span className={`text-sm ml-1 ${tier.highlighted ? "text-white/50" : "text-gray-400"}`}>/{tier.period}</span>}
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-[#10B981]" : "text-[#059669]"}`} />
                      <span className={tier.highlighted ? "text-white/80" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { window.location.hash = "app"; }}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${tier.highlighted ? "bg-[#059669] hover:bg-[#047857] text-white" : "bg-[#059669] hover:bg-[#047857] text-white"}`}
                >
                  {tier.cta}
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   16. TABBED CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface Tab { label: string; icon?: React.ElementType; content: React.ReactNode }

interface TabbedContentProps { title?: string; subtitle?: string; tabs: Tab[] }

export function TabbedContent({ title, subtitle, tabs }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <FadeIn className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
          </FadeIn>
        )}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === i ? "bg-[#059669] text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
        <div>{tabs[activeTab]?.content}</div>
      </div>
    </section>
  );
}