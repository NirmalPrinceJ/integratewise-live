import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CompetitiveSectionProps {
  className?: string;
}

const CompetitiveSection = ({ className = '' }: CompetitiveSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

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
        tableRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  type FeatureStatus = boolean | 'partial';

  interface ComparisonRow {
    feature: string;
    description: string;
    integratewise: FeatureStatus;
    zapier: FeatureStatus;
    erp: FeatureStatus;
  }

  const comparisons: ComparisonRow[] = [
    {
      feature: 'Context-aware',
      description: 'Knows your business logic',
      integratewise: true,
      zapier: false,
      erp: false,
    },
    {
      feature: 'AI Governance',
      description: 'Hard approval gate',
      integratewise: true,
      zapier: false,
      erp: false,
    },
    {
      feature: 'Adaptive Schema',
      description: 'Fits any vertical',
      integratewise: true,
      zapier: false,
      erp: false,
    },
    {
      feature: 'Three Spaces',
      description: 'Personal/Work/Team',
      integratewise: true,
      zapier: false,
      erp: false,
    },
    {
      feature: 'MCP Protocol',
      description: 'AI-native architecture',
      integratewise: true,
      zapier: false,
      erp: false,
    },
    {
      feature: 'Unstructured Data',
      description: 'PDFs, voice, images',
      integratewise: true,
      zapier: 'partial',
      erp: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="competitive"
      className={`relative bg-iw-bg py-24 lg:py-32 ${className}`}
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Why IntegrateWise?
          </span>
          <h2 className="mt-6 font-display font-bold text-display-md text-iw-text">
            We don't connect apps.
            <br />
            <span className="text-iw-accent">We connect categories.</span>
          </h2>
        </div>

        {/* Comparison Table */}
        <div ref={tableRef} className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 lg:p-6 bg-white/5 border-b border-white/10">
              <div className="col-span-1">
                <span className="text-xs font-mono text-iw-text-secondary uppercase tracking-wider">
                  Feature
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono text-iw-accent uppercase tracking-wider">
                  IntegrateWise
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono text-iw-text-secondary uppercase tracking-wider">
                  Zapier/Make
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono text-iw-text-secondary uppercase tracking-wider">
                  Traditional ERP
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {comparisons.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-4 lg:p-6 border-b border-white/5 last:border-b-0"
              >
                <div className="col-span-1">
                  <div className="font-medium text-iw-text text-sm">{row.feature}</div>
                  <div className="text-xs text-iw-text-secondary">{row.description}</div>
                </div>
                <div className="flex items-center justify-center">
                  {row.integratewise === true ? (
                    <div className="p-2 rounded-full bg-iw-accent/20">
                      <Check className="w-5 h-5 text-iw-accent" />
                    </div>
                  ) : row.integratewise === 'partial' ? (
                    <span className="text-xs text-iw-text-secondary font-mono">Limited</span>
                  ) : (
                    <div className="p-2 rounded-full bg-white/5">
                      <X className="w-5 h-5 text-iw-text-secondary" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {row.zapier === true ? (
                    <div className="p-2 rounded-full bg-white/5">
                      <Check className="w-5 h-5 text-iw-text-secondary" />
                    </div>
                  ) : row.zapier === 'partial' ? (
                    <span className="text-xs text-iw-text-secondary font-mono">Limited</span>
                  ) : (
                    <div className="p-2 rounded-full bg-white/5">
                      <X className="w-5 h-5 text-iw-text-secondary" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {row.erp === true ? (
                    <div className="p-2 rounded-full bg-white/5">
                      <Check className="w-5 h-5 text-iw-text-secondary" />
                    </div>
                  ) : row.erp === 'partial' ? (
                    <span className="text-xs text-iw-text-secondary font-mono">Limited</span>
                  ) : (
                    <div className="p-2 rounded-full bg-white/5">
                      <X className="w-5 h-5 text-iw-text-secondary" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Key differentiator */}
          <div className="mt-8 text-center">
            <p className="text-lg text-iw-text">
              <span className="text-iw-accent font-semibold">Tools ↔ AI ↔ Data ↔ Context ↔ Memory</span>
            </p>
            <p className="text-sm text-iw-text-secondary mt-2">
              Completed by IntegrateWise. Broken everywhere else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitiveSection;
