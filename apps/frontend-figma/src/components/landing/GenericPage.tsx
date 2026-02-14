/**
 * GenericPage — Composes rich multi-section pages from page-content.ts data.
 * Every route in the sitemap gets a unique, production-quality page.
 */
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Rocket } from "lucide-react";
import { PAGE_CONTENT } from "./page-content";
import {
  HeroSection,
  FeatureGrid,
  FeatureWithImage,
  StatsBar,
  TestimonialSection,
  CTASection,
  FAQSection,
  TimelineSection,
  LogoCloud,
  BlogGrid,
  ContactSection,
  ComparisonTable,
  NewsletterSection,
  PricingTable,
} from "./sections";

interface GenericPageProps {
  pageId: string;
}

export function GenericPage({ pageId }: GenericPageProps) {
  const content = PAGE_CONTENT[pageId];

  if (!content) {
    return (
      <div className="pt-28 md:pt-36 pb-16 md:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-50 text-sm font-bold text-gray-600 uppercase tracking-wide mb-6">
              <Rocket className="w-4 h-4 text-[#059669]" />
              Coming Soon
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
              This Page is Under Construction
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              We're building something great. Check back soon for the full content.
            </p>
            <button
              onClick={() => { window.location.hash = ""; }}
              className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full font-bold flex items-center gap-2 mx-auto group font-['Plus_Jakarta_Sans']"
            >
              Back to Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero */}
      <HeroSection {...content.hero} />

      {/* 2. Logo Cloud */}
      {content.logos && <LogoCloud logos={content.logos} />}

      {/* 3. Feature Grid */}
      {content.features && (
        <FeatureGrid
          badge={content.features.badge}
          title={content.features.title}
          subtitle={content.features.subtitle}
          features={content.features.items}
          columns={content.features.columns}
          accentColor={content.features.accentColor}
        />
      )}

      {/* 4. Feature With Image (1) */}
      {content.featureWithImage && <FeatureWithImage {...content.featureWithImage} />}

      {/* 5. Stats Bar */}
      {content.stats && (
        <StatsBar
          stats={content.stats}
          dark={content.statsMeta?.dark}
          title={content.statsMeta?.title}
          subtitle={content.statsMeta?.subtitle}
        />
      )}

      {/* 6. Feature With Image (2) */}
      {content.featureWithImage2 && <FeatureWithImage {...content.featureWithImage2} />}

      {/* 7. Timeline */}
      {content.timeline && <TimelineSection {...content.timeline} />}

      {/* 8. Comparison Table */}
      {content.comparison && <ComparisonTable {...content.comparison} />}

      {/* 9. Blog Grid */}
      {content.blog && <BlogGrid posts={content.blog} />}

      {/* 10. Pricing Table */}
      {content.pricing && <PricingTable tiers={content.pricing} />}

      {/* 11. Testimonials */}
      {content.testimonials && (
        <TestimonialSection
          testimonials={content.testimonials}
          title={content.testimonialTitle}
        />
      )}

      {/* 12. Newsletter */}
      {content.newsletter && (
        <NewsletterSection
          title="Subscribe to Our Newsletter"
          description="Weekly insights on integration intelligence, product updates, and best practices. Join 2,400+ subscribers."
        />
      )}

      {/* 13. Contact Form */}
      {content.contact && (
        <ContactSection
          title="Get in Touch"
          subtitle="Questions about IntegrateWise? Our team responds within 24 hours. We're here for sales inquiries, technical support, partnerships, and careers."
        />
      )}

      {/* 14. FAQ */}
      {content.faq && <FAQSection faqs={content.faq} title={content.faqTitle} />}

      {/* 15. CTA */}
      {content.cta && <CTASection {...content.cta} />}
    </>
  );
}