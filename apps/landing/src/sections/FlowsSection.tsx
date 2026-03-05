import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, FileText, Brain, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FlowsSectionProps {
  className?: string;
}

const FlowsSection = ({ className = '' }: FlowsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const flowsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
          { x: '30vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
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
          flowsRef.current?.children || [],
          { x: (i) => (i % 2 === 0 ? '-20vw' : '20vw'), opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.04, ease: 'power2.out' },
          0.15
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

  const flows = [
    {
      icon: Database,
      label: 'Flow A',
      title: 'Structured Tools',
      description: 'ERP, CRM, WhatsApp Business—your existing stack connected.',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      icon: FileText,
      label: 'Flow B',
      title: 'Unstructured Documents',
      description: 'PDFs, voice notes, images—auto-extracted to structured truth.',
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      icon: Brain,
      label: 'Flow C',
      title: 'AI Sessions',
      description: 'Claude, ChatGPT—captured as organizational memory.',
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="flows"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/data_flow_office.jpg)',
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
            Three Flows
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Structured + unstructured + AI—
          <br />
          <span className="text-iw-accent">unified.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          All your data sources feed the same source of truth.
        </p>

        {/* Flow Cards */}
        <div
          ref={flowsRef}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl w-full"
        >
          {flows.map((flow, index) => (
            <div
              key={index}
              className={`relative p-6 lg:p-8 rounded-xl bg-gradient-to-br ${flow.color} border border-white/10 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-white/5 ${flow.iconColor}`}>
                  <flow.icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-iw-text-secondary uppercase tracking-wider">
                  {flow.label}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                {flow.title}
              </h3>
              <p className="text-sm text-iw-text-secondary leading-relaxed">
                {flow.description}
              </p>
            </div>
          ))}
        </div>

        {/* Unification indicator */}
        <div className="mt-8 flex items-center gap-3">
          <span className="text-sm text-iw-text-secondary">All flows converge to</span>
          <ArrowRight className="w-4 h-4 text-iw-accent" />
          <span className="font-mono text-sm text-iw-accent">Single Source of Truth</span>
        </div>
      </div>
    </section>
  );
};

export default FlowsSection;
