import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set([labelRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(overlayRef.current, { opacity: 1 });

      // Entrance sequence
      tl.to(overlayRef.current, { opacity: 0.55, duration: 0.8 })
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to(subheadlineRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset elements when scrolling back to top
            gsap.to([labelRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current], {
              opacity: 1,
              y: 0,
              duration: 0.3,
            });
            gsap.to(bgRef.current, { scale: 1, duration: 0.3 });
            gsap.to(overlayRef.current, { opacity: 0.55, duration: 0.3 });
          },
        },
      });

      // ENTRANCE (0-30%): Hold - entrance already handled by load animation
      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          bgRef.current,
          { scale: 1 },
          { scale: 1.06, ease: 'none' },
          0.7
        )
        .fromTo(
          overlayRef.current,
          { opacity: 0.55 },
          { opacity: 0.75, ease: 'none' },
          0.7
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/hero_cables.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-iw-bg/80" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        {/* Micro Label */}
        <div
          ref={labelRef}
          className="absolute top-[7vh] left-1/2 -translate-x-1/2"
        >
          <span className="font-mono text-xs tracking-[0.2em] text-iw-text-secondary uppercase">
            IntegrateWise v3.6
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-display-xl text-iw-text text-center max-w-[92vw]"
        >
          Stop being the cable
          <br />
          <span className="text-iw-accent">between your own tools.</span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg lg:text-xl text-iw-text-secondary text-center max-w-[62ch] leading-relaxed"
        >
          A cognitive operating system that connects your apps, AI, documents, and context—
          so your stack finally knows what you're trying to do.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 text-base btn-lift"
            >
              <Rocket className="mr-2 w-5 h-5" />
              Get started free
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-iw-text hover:bg-white/5 px-8 py-6 text-base"
            onClick={() => scrollToSection('solution')}
          >
            See the architecture
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
