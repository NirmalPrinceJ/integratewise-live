import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, TrendingUp, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface ProofSectionProps {
  className?: string;
}

const ProofSection = ({ className = '' }: ProofSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stats animation
      gsap.fromTo(
        statsRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Pricing animation
      gsap.fromTo(
        pricingRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: TrendingDown,
      value: '40%',
      label: 'Less swivel-chair time',
      description: 'Stop copying between apps',
    },
    {
      icon: TrendingUp,
      value: '60%',
      label: 'Faster decisions',
      description: 'AI pre-analyzes, you approve',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Audit trail',
      description: 'Never lose why a decision was made',
    },
  ];

  const pricingTiers = [
    {
      name: 'Personal',
      price: 'Free',
      description: 'For individuals and freelancers',
      features: ['Personal + Work spaces', 'B0-B5 hydration', 'Core integrations', 'AI memory'],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Cognitive',
      price: '₹2,999',
      period: '/month',
      description: 'For SMEs (5-200 employees)',
      features: [
        'Full B0-B7 hydration',
        'Colony agents',
        'MCP server access',
        'Team space',
        'Priority support',
      ],
      cta: 'Start trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For multi-location, compliance needs',
      features: [
        'Dedicated infrastructure',
        'Custom VPC',
        'Air-gapped option',
        'SLA guarantee',
        'Dedicated success manager',
      ],
      cta: 'Contact sales',
      highlighted: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="proof"
      className={`relative bg-iw-bg py-24 lg:py-32 ${className}`}
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Proof & Pricing
          </span>
          <h2 className="mt-6 font-display font-bold text-display-md text-iw-text">
            Built for scale.
            <br />
            <span className="text-iw-accent">Priced to start.</span>
          </h2>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 lg:p-8 rounded-xl glass-card text-center"
            >
              <div className="inline-flex p-3 rounded-xl bg-iw-accent/20 mb-4">
                <stat.icon className="w-6 h-6 text-iw-accent" />
              </div>
              <div className="font-display font-bold text-4xl lg:text-5xl text-iw-text mb-2">
                {stat.value}
              </div>
              <div className="font-medium text-iw-text mb-1">{stat.label}</div>
              <div className="text-sm text-iw-text-secondary">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div
          ref={pricingRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative p-6 lg:p-8 rounded-xl ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-iw-accent/20 to-iw-accent/5 border-2 border-iw-accent/50'
                  : 'glass-card border border-white/10'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-iw-accent">
                  <span className="text-xs font-mono font-bold text-iw-bg">MOST POPULAR</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-3xl text-iw-text">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-iw-text-secondary">{tier.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-iw-text-secondary">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-iw-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-iw-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-iw-accent text-iw-bg hover:bg-iw-accent/90'
                      : 'bg-white/10 text-iw-text hover:bg-white/20'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
