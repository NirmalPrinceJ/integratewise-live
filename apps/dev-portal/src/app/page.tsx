"use client";

import { Header } from "@/components/header";
import { PhilosophyBanner } from "@/components/philosophy-banner";
import { OverviewSection } from "@/components/overview-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { InfrastructureSection } from "@/components/infrastructure-section";
import { GapsSection } from "@/components/gaps-section";
import { TimelineSection } from "@/components/timeline-section";
import { AIContextSection } from "@/components/ai-context-section";
import { SignalMonitor } from "@/components/signal-monitor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 md:px-8 md:py-12">
      <Header />
      <PhilosophyBanner />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          <TabsTrigger value="gaps">Gaps &amp; Blockers</TabsTrigger>
          <TabsTrigger value="timeline">Evolution</TabsTrigger>
          <TabsTrigger value="ai-context">AI Context Layer</TabsTrigger>
          <TabsTrigger value="signals">Signal Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection />
        </TabsContent>

        <TabsContent value="architecture">
          <ArchitectureSection />
        </TabsContent>

        <TabsContent value="infra">
          <InfrastructureSection />
        </TabsContent>

        <TabsContent value="gaps">
          <GapsSection />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineSection />
        </TabsContent>

        <TabsContent value="ai-context">
          <AIContextSection />
        </TabsContent>

        <TabsContent value="signals">
          <SignalMonitor />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-xs text-muted-foreground">
        <div>Glowing Pancake · Bengaluru, India · Internal Use Only</div>
        <div>Built by Prince (Nirmal Prince J) · CEO &amp; Founder</div>
      </footer>
    </main>
  );
}
