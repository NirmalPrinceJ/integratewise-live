import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Factory, Anchor, Code, Car, User, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface UseCaseSectionProps {
  className?: string;
}

const UseCaseSection = ({ className = '' }: UseCaseSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        casesRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: casesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const useCases = [
    {
      icon: Factory,
      title: 'Power Loom (Jaipur)',
      context: 'Manufacturing',
      workspace: 'Loom efficiency, weaver payroll, yarn inventory',
      agents: 'Predict material shortages, auto-schedule maintenance',
    },
    {
      icon: Anchor,
      title: 'Fishery (Kanyakumari)',
      context: 'Marine/Fishery',
      workspace: 'Catch logs, weather alerts, boat maintenance',
      agents: 'Optimize fishing zones based on past catch + market prices',
    },
    {
      icon: Code,
      title: 'SaaS Founder (Bangalore)',
      context: 'Technology',
      workspace: 'MRR pipeline, churn signals, feature adoption',
      agents: 'SuccessPilot predicts at-risk accounts 60 days early',
    },
    {
      icon: Car,
      title: 'Auto Parts (Chennai)',
      context: 'Industrial',
      workspace: 'QC checklists, supplier latency, production batches',
      agents: 'ChurnShield flags payment delays, VaultGuard rotates credentials',
    },
    {
      icon: User,
      title: 'Freelancer (Remote)',
      context: 'Personal/Professional',
      workspace: 'Client deliverables, time tracking, AI memory',
      agents: 'Digital Twin reminds you of client preferences from past chats',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="usecases"
      className={`relative bg-iw-bg py-24 lg:py-32 ${className}`}
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Use-Case Matrix
          </span>
          <h2 className="mt-6 font-display font-bold text-display-md text-iw-text">
            Will it work for me?
            <span className="text-iw-accent"> Yes.</span>
          </h2>
          <p className="mt-4 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            One architecture. Infinite verticals. Only the labels change.
          </p>
        </div>

        {/* Use Cases */}
        <div ref={casesRef} className="max-w-5xl mx-auto">
          {/* Case Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {useCases.map((useCase, index) => (
              <button
                key={index}
                onClick={() => setActiveCase(index)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeCase === index
                    ? 'bg-iw-accent/20 border border-iw-accent/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <useCase.icon
                  className={`w-5 h-5 ${
                    activeCase === index ? 'text-iw-accent' : 'text-iw-text-secondary'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    activeCase === index ? 'text-iw-text' : 'text-iw-text-secondary'
                  }`}
                >
                  {useCase.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Active Case Display */}
          <div className="glass-card rounded-xl p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left: Identity */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-iw-accent/20">
                    {(() => {
                      const ActiveIcon = useCases[activeCase].icon;
                      return <ActiveIcon className="w-8 h-8 text-iw-accent" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-iw-text">
                      {useCases[activeCase].title}
                    </h3>
                    <span className="text-sm text-iw-accent font-mono">
                      {useCases[activeCase].context}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-iw-text-secondary">
                  The schema adapts to your industry. The engine stays the same.
                </p>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Workspace */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-iw-accent" />
                    <span className="text-xs font-mono text-iw-text-secondary uppercase tracking-wider">
                      L1 Workspace Shows
                    </span>
                  </div>
                  <p className="text-iw-text">{useCases[activeCase].workspace}</p>
                </div>

                {/* AI Agents */}
                <div className="p-4 rounded-lg bg-iw-accent/10 border border-iw-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-iw-accent" />
                    <span className="text-xs font-mono text-iw-accent uppercase tracking-wider">
                      L2 AI Agents Do
                    </span>
                  </div>
                  <p className="text-iw-text">{useCases[activeCase].agents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Unanimous promise */}
          <div className="mt-8 text-center">
            <p className="text-sm text-iw-text-secondary font-mono">
              Same architecture. Same security. Same intelligence.
              <br />
              Whether you have 1 employee or 10,000.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
