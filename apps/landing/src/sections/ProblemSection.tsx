import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProblemSectionProps {
  className?: string;
}

const ProblemSection = ({ className = '' }: ProblemSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
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
          { opacity: 0.9 },
          { opacity: 0.65, ease: 'none' },
          0
        )
        .fromTo(
          labelRef.current,
          { x: '-30vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        .fromTo(
          headlineRef.current,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        .fromTo(
          subheadlineRef.current,
          { y: '8vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.1
        )
        .fromTo(
          statsRef.current?.children || [],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, ease: 'power2.out' },
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
        )
        .fromTo(
          overlayRef.current,
          { opacity: 0.65 },
          { opacity: 0.85, ease: 'none' },
          0.7
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '$4.2T', label: 'Annual disconnection tax' },
    { value: '40%', label: 'Time lost to context switching' },
    { value: '12', label: 'Average apps per business' },
  ];

  return (
    <section
      ref={sectionRef}
      id="problem"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/disconnected_apps.jpg)',
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
            The Disconnection Tax
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Your tools don't talk.
          <br />
          <span className="text-iw-text-secondary">You pay the price.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          Copy-paste context. Re-explaining decisions. Chasing updates across tabs. 
          It's not a skills problem—it's an architecture problem.
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display font-bold text-4xl lg:text-5xl text-iw-accent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-iw-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
