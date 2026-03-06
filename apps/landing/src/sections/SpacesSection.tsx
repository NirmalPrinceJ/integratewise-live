import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Briefcase, Users, Lock, Shield, Share2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SpacesSectionProps {
  className?: string;
}

const SpacesSection = ({ className = '' }: SpacesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const spacesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSpace, setActiveSpace] = useState(0);

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
          { x: '-30vw', opacity: 0 },
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
          spacesRef.current?.children || [],
          { y: 50, opacity: 0 },
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

  const spaces = [
    {
      icon: User,
      name: 'Personal',
      tagline: 'Your cognitive sanctuary',
      description: 'Your private AI, notes, and learning. Never visible to your team. Works offline, syncs to edge.',
      features: ['Private AI chat history', 'Personal notes & tasks', 'Offline capable'],
      privacy: 'RLS-enforced isolation',
      privacyIcon: Lock,
      color: 'from-emerald-500/20 to-emerald-600/10',
    },
    {
      icon: Briefcase,
      name: 'Work',
      tagline: 'Your professional flow',
      description: 'Role-based execution. Domain-adapted modules. AI signals prioritized by your role.',
      features: ['Role-based views', 'Domain modules', 'AI signal prioritization'],
      privacy: 'Organization-only access',
      privacyIcon: Shield,
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      icon: Users,
      name: 'Team',
      tagline: 'Shared coordination',
      description: 'Shared goals, approval queues, cross-functional analytics. Appears when you invite user #2.',
      features: ['Shared goals', 'Approval queues', 'Cross-functional analytics'],
      privacy: 'Hard architectural boundary',
      privacyIcon: Share2,
      color: 'from-purple-500/20 to-purple-600/10',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="spaces"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/three_spaces_laptop.jpg)',
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
            Three Spaces
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-display-lg text-iw-text text-center max-w-[85vw]"
        >
          Personal. Work. Team.
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-lg text-iw-text-secondary text-center max-w-[56ch] leading-relaxed"
        >
          Privacy as a feature, not a bug.
        </p>

        {/* Spaces Cards */}
        <div
          ref={spacesRef}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl w-full"
        >
          {spaces.map((space, index) => (
            <div
              key={index}
              onClick={() => setActiveSpace(index)}
              className={`relative p-6 lg:p-8 rounded-xl bg-gradient-to-br ${space.color} border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                activeSpace === index
                  ? 'border-iw-accent/50 scale-105'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-white/5 ${activeSpace === index ? 'text-iw-accent' : 'text-iw-text-secondary'}`}>
                  <space.icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-iw-text-secondary uppercase tracking-wider">
                  {space.name}
                </span>
              </div>

              <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                {space.tagline}
              </h3>

              <p className="text-sm text-iw-text-secondary leading-relaxed mb-4">
                {space.description}
              </p>

              <div className="space-y-2 mb-4">
                {space.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-iw-accent" />
                    <span className="text-xs text-iw-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <space.privacyIcon className="w-4 h-4 text-iw-accent" />
                <span className="text-xs text-iw-accent font-mono">{space.privacy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpacesSection;
