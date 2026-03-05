import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Factory, Stethoscope, ShoppingBag, Anchor, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SchemaSectionProps {
  className?: string;
}

const SchemaSection = ({ className = '' }: SchemaSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const verticalsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeVertical, setActiveVertical] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(
          overlayRef.current,
          { opacity: 0.85 },
          { opacity: 0.6, ease: 'none' },
          0
        )
        .fromTo(
          labelRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo(
          headlineRef.current,
          { y: '8vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.08
        )
        .fromTo(
          subheadlineRef.current,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.12
        )
        .fromTo(
          verticalsRef.current,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.18
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: '-12vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const verticals = [
    {
      icon: Factory,
      name: 'Manufacturing',
      entities: ['Line Unit', 'Batch', 'Quality Score'],
      example: 'Auto parts, textiles, electronics',
    },
    {
      icon: Stethoscope,
      name: 'Healthcare',
      entities: ['Patient', 'Treatment', 'Recovery Metric'],
      example: 'Hospitals, clinics, diagnostics',
    },
    {
      icon: ShoppingBag,
      name: 'Retail',
      entities: ['SKU', 'Inventory', 'Sales Metric'],
      example: 'E-commerce, brick & mortar',
    },
    {
      icon: Anchor,
      name: 'Marine',
      entities: ['Boat', 'Catch', 'Market Price'],
      example: 'Fisheries, aquaculture',
    },
    {
      icon: User,
      name: 'Freelance',
      entities: ['Client', 'Project', 'Delivery Metric'],
      example: 'Consultants, creatives, agencies',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="schema"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/verticals_manufacturing.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-iw-bg" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        {/* Label */}
        <div ref={labelRef} className="mb-6">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Adaptive Schema
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          One engine.
          <br />
          <span className="text-iw-accent">Every dialect.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          The system learns your language, not the other way around.
        </p>

        {/* Verticals Selector */}
        <div
          ref={verticalsRef}
          className="mt-12 w-full max-w-4xl"
        >
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-8">
            {verticals.map((vertical, index) => (
              <button
                key={index}
                onClick={() => setActiveVertical(index)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeVertical === index
                    ? 'bg-iw-accent/20 border border-iw-accent/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <vertical.icon
                  className={`w-5 h-5 ${
                    activeVertical === index ? 'text-iw-accent' : 'text-iw-text-secondary'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    activeVertical === index ? 'text-iw-text' : 'text-iw-text-secondary'
                  }`}
                >
                  {vertical.name}
                </span>
              </button>
            ))}
          </div>

          {/* Active Vertical Display */}
          <div className="glass-card rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              {(() => {
                const ActiveIcon = verticals[activeVertical].icon;
                return (
                  <div className="p-4 rounded-xl bg-iw-accent/20">
                    <ActiveIcon className="w-8 h-8 text-iw-accent" />
                  </div>
                );
              })()}
              <div>
                <h3 className="font-display font-semibold text-2xl text-iw-text">
                  {verticals[activeVertical].name}
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  {verticals[activeVertical].example}
                </p>
              </div>
            </div>

            {/* Entity Flow */}
            <div className="flex flex-wrap items-center gap-3">
              {verticals[activeVertical].entities.map((entity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-iw-text">{entity}</span>
                  </div>
                  {idx < verticals[activeVertical].entities.length - 1 && (
                    <span className="text-iw-accent">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Underlying structure hint */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-iw-text-secondary font-mono">
                UNDERLYING: Goal → Metric → Outcome (same for all verticals)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchemaSection;
