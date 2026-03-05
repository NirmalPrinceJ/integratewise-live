import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import ProblemSection from '@/sections/ProblemSection';
import SolutionSection from '@/sections/SolutionSection';
import FlowsSection from '@/sections/FlowsSection';
import SchemaSection from '@/sections/SchemaSection';
import SpacesSection from '@/sections/SpacesSection';
import HydrationSection from '@/sections/HydrationSection';
import GovernanceSection from '@/sections/GovernanceSection';
import ProofSection from '@/sections/ProofSection';
import UseCaseSection from '@/sections/UseCaseSection';
import CompetitiveSection from '@/sections/CompetitiveSection';
import ClosingSection from '@/sections/ClosingSection';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount before setting up global snap
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-iw-bg">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections */}
      <main className="relative">
        <HeroSection className="z-10" />
        <ProblemSection className="z-20" />
        <SolutionSection className="z-30" />
        <FlowsSection className="z-40" />
        <SchemaSection className="z-50" />
        <SpacesSection className="z-[60]" />
        <HydrationSection className="z-[70]" />
        <GovernanceSection className="z-[80]" />
        <ProofSection className="z-[90]" />
        <UseCaseSection className="z-[100]" />
        <CompetitiveSection className="z-[110]" />
        <ClosingSection className="z-[120]" />
        <Footer className="z-[130]" />
      </main>
    </div>
  );
};

export default LandingPage;
