import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface ClosingSectionProps {
  className?: string;
}

const ClosingSection = ({ className = '' }: ClosingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
          { opacity: 0.7 },
          { opacity: 0.4, ease: 'none' },
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
          ctaRef.current,
          { y: '4vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.18
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: '-8vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closing"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/calm_workspace.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Light Overlay for calm effect */}
      <div ref={overlayRef} className="absolute inset-0 bg-iw-bg/40" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        {/* Label */}
        <div ref={labelRef} className="mb-6">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            The Calm
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Let your stack
          <br />
          <span className="text-iw-accent">know itself.</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          Start with a 30-day pilot. Or book an architecture review and we'll map v3.6 to your workflow—exactly.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 text-base btn-lift"
            >
              <Rocket className="mr-2 w-5 h-5" />
              Start free trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-iw-text hover:bg-white/5 px-8 py-6 text-base"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Sign in
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-xs text-iw-text-secondary font-mono">
          <span>30-day free trial</span>
          <span className="text-white/30">|</span>
          <span>No credit card required</span>
          <span className="text-white/30">|</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
