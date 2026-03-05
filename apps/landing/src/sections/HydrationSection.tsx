import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Loader2, Sparkles, Database, Brain, Workflow } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HydrationSectionProps {
  className?: string;
}

const HydrationSection = ({ className = '' }: HydrationSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(2);

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
          stagesRef.current?.children || [],
          { x: (i) => (i % 2 === 0 ? '-30vw' : '30vw'), opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'power2.out' },
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

  const stages = [
    { id: 'B0', name: 'Signup', icon: Check, status: 'complete', description: 'Skeleton UI ready' },
    { id: 'B1', name: 'Context', icon: Check, status: 'complete', description: 'Domain-adapted workspace' },
    { id: 'B2', name: 'First Tool', icon: Database, status: 'active', description: 'Real data flows in' },
    { id: 'B3', name: 'Second Tool', icon: Loader2, status: 'pending', description: 'Additional integrations' },
    { id: 'B4', name: 'Third Tool', icon: Loader2, status: 'pending', description: 'Full stack connected' },
    { id: 'B5', name: 'AI Connected', icon: Brain, status: 'pending', description: 'MCP activates' },
    { id: 'B6', name: 'Intelligence', icon: Sparkles, status: 'pending', description: 'AI agents active' },
    { id: 'B7', name: 'Full System', icon: Workflow, status: 'pending', description: 'Colony orchestration' },
  ];

  return (
    <section
      ref={sectionRef}
      id="hydration"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/hydration_meeting.jpg)',
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
            Progressive Hydration
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Value in minutes.
          <br />
          <span className="text-iw-accent">Intelligence in weeks.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          No empty dashboards. No abandonment.
        </p>

        {/* Hydration Stages */}
        <div
          ref={stagesRef}
          className="mt-12 w-full max-w-4xl"
        >
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-iw-accent to-iw-accent/50 rounded-full transition-all duration-500"
                style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 lg:gap-3">
            {stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => setActiveStage(index)}
                className={`relative p-3 lg:p-4 rounded-lg border transition-all duration-300 ${
                  index <= activeStage
                    ? 'bg-iw-accent/10 border-iw-accent/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <stage.icon
                    className={`w-5 h-5 ${
                      index < activeStage
                        ? 'text-iw-accent'
                        : index === activeStage
                        ? 'text-iw-accent animate-pulse'
                        : 'text-iw-text-secondary'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono ${
                      index <= activeStage ? 'text-iw-text' : 'text-iw-text-secondary'
                    }`}
                  >
                    {stage.id}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Detail */}
          <div className="mt-6 glass-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-iw-accent/20">
                {(() => {
                  const ActiveIcon = stages[activeStage].icon;
                  return <ActiveIcon className="w-8 h-8 text-iw-accent" />;
                })()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm text-iw-accent">
                    {stages[activeStage].id}
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="font-display font-semibold text-xl text-iw-text">
                    {stages[activeStage].name}
                  </span>
                </div>
                <p className="text-sm text-iw-text-secondary">
                  {stages[activeStage].description}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline indicator */}
          <div className="mt-6 flex justify-between text-xs text-iw-text-secondary font-mono">
            <span>Day 1</span>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HydrationSection;
