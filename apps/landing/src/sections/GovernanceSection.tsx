import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Shield, Zap, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface GovernanceSectionProps {
  className?: string;
}

const GovernanceSection = ({ className = '' }: GovernanceSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
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
          stepsRef.current?.children || [],
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, ease: 'power2.out' },
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

  const steps = [
    {
      icon: Brain,
      title: 'Think',
      description: 'AI reasons across your entire stack—not just one tool.',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      icon: Shield,
      title: 'Govern',
      description: 'Hard gate. No execution without human approval token.',
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
    },
    {
      icon: Zap,
      title: 'Act',
      description: 'Executes only with signed, auditable, revocable permission.',
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      icon: ClipboardCheck,
      title: 'Audit',
      description: 'Immutable log of who decided what, when, based on which evidence.',
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="governance"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/governance_server_room.jpg)',
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
            AI Governance
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Think. Govern. Act. Audit.
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          Human sovereignty, guaranteed. SOC 2 ready.
        </p>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl w-full"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-xl bg-gradient-to-br ${step.color} border border-white/10 backdrop-blur-sm`}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-iw-accent flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-iw-bg">{index + 1}</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-xl bg-white/5 mb-4 ${step.iconColor}`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-iw-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs text-iw-text-secondary font-mono">SOC 2 READY</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs text-iw-text-secondary font-mono">GDPR COMPLIANT</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs text-iw-text-secondary font-mono">DPDP ACT 2023</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernanceSection;
