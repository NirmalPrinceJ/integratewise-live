import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Database, FileText, MessageSquare, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SolutionSectionProps {
  className?: string;
}

const SolutionSection = ({ className = '' }: SolutionSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
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

      // Line draw animation
      const lineLength = lineRef.current?.getTotalLength() || 1000;
      gsap.set(lineRef.current, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
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
          lineRef.current,
          { strokeDashoffset: lineLength },
          { strokeDashoffset: 0, ease: 'none' },
          0.1
        )
        .fromTo(
          categoriesRef.current?.children || [],
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.02, ease: 'back.out(1.4)' },
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
          lineRef.current,
          { strokeDashoffset: 0 },
          { strokeDashoffset: -lineLength, ease: 'none' },
          0.75
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    { icon: Cpu, label: 'Tools', color: 'text-iw-accent' },
    { icon: Brain, label: 'AI', color: 'text-purple-400' },
    { icon: Database, label: 'Data', color: 'text-blue-400' },
    { icon: FileText, label: 'Context', color: 'text-green-400' },
    { icon: MessageSquare, label: 'Memory', color: 'text-orange-400' },
  ];

  return (
    <section
      ref={sectionRef}
      id="solution"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/workspace_context.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-iw-bg" />

      {/* Connection Line SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={lineRef}
          d="M 10 50 Q 25 30, 40 50 T 70 50 T 90 50"
          className="connection-line"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        {/* Label */}
        <div ref={labelRef} className="mb-6">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            The Context Layer
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Connect categories—
          <br />
          <span className="text-iw-accent">not just apps.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          One loop. One truth. One calm.
        </p>

        {/* Categories */}
        <div
          ref={categoriesRef}
          className="mt-12 flex flex-wrap justify-center gap-4 lg:gap-6"
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-4 lg:p-6 glass-card rounded-lg"
            >
              <cat.icon className={`w-8 h-8 ${cat.color}`} />
              <span className="text-sm font-medium text-iw-text">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Connection arrows */}
        <div className="mt-8 flex items-center gap-2 text-iw-text-secondary">
          <span className="font-mono text-xs">TOOLS</span>
          <span className="text-iw-accent">↔</span>
          <span className="font-mono text-xs">AI</span>
          <span className="text-iw-accent">↔</span>
          <span className="font-mono text-xs">DATA</span>
          <span className="text-iw-accent">↔</span>
          <span className="font-mono text-xs">CONTEXT</span>
          <span className="text-iw-accent">↔</span>
          <span className="font-mono text-xs">MEMORY</span>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
