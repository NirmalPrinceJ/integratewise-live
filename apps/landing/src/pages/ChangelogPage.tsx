
import { ArrowRight, Sparkles, Bug, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const ChangelogPage = () => {
  const releases = [
    {
      version: 'v3.6.0',
      date: 'March 2026',
      type: 'major',
      icon: Sparkles,
      title: 'The Context Layer',
      description: 'Introducing the Universal Cognitive Operating System. Connect Tools ↔ AI ↔ Data ↔ Context ↔ Memory in one unified loop.',
      changes: [
        { type: 'feature', text: 'New: The Context Layer architecture' },
        { type: 'feature', text: 'New: MCP (Model Context Protocol) support' },
        { type: 'feature', text: 'New: Progressive Hydration (B0-B7)' },
        { type: 'feature', text: 'New: Colony Agents for workflow orchestration' },
        { type: 'improvement', text: 'Improved: AI Governance with The Hard Gate™' },
        { type: 'improvement', text: 'Improved: Adaptive Schema for all verticals' },
      ],
    },
    {
      version: 'v3.5.0',
      date: 'February 2026',
      type: 'feature',
      icon: Zap,
      title: 'Three Spaces',
      description: 'Personal, Work, and Team spaces with hard privacy boundaries.',
      changes: [
        { type: 'feature', text: 'New: Personal Space for private AI and notes' },
        { type: 'feature', text: 'New: Work Space with role-based views' },
        { type: 'feature', text: 'New: Team Space for shared coordination' },
        { type: 'improvement', text: 'Improved: Row-Level Security enforcement' },
      ],
    },
    {
      version: 'v3.4.0',
      date: 'January 2026',
      type: 'feature',
      icon: Shield,
      title: 'SOC 2 Compliance',
      description: 'Achieved SOC 2 Type II certification with enhanced security controls.',
      changes: [
        { type: 'feature', text: 'New: SOC 2 Type II certification' },
        { type: 'feature', text: 'New: Immutable audit logs' },
        { type: 'improvement', text: 'Improved: Encryption at rest and transit' },
        { type: 'improvement', text: 'Improved: Access control policies' },
      ],
    },
    {
      version: 'v3.3.0',
      date: 'December 2025',
      type: 'feature',
      icon: Zap,
      title: 'AI Agents',
      description: 'Introduced intelligent agents that can reason across your entire stack.',
      changes: [
        { type: 'feature', text: 'New: SuccessPilot for churn prediction' },
        { type: 'feature', text: 'New: ChurnShield for payment monitoring' },
        { type: 'feature', text: 'New: VaultGuard for credential rotation' },
        { type: 'improvement', text: 'Improved: AI session memory' },
      ],
    },
    {
      version: 'v3.2.0',
      date: 'November 2025',
      type: 'improvement',
      icon: Bug,
      title: 'Performance & Stability',
      description: 'Major performance improvements and bug fixes.',
      changes: [
        { type: 'improvement', text: 'Improved: 40% faster data sync' },
        { type: 'improvement', text: 'Improved: Reduced memory footprint' },
        { type: 'fix', text: 'Fixed: Edge case in schema adaptation' },
        { type: 'fix', text: 'Fixed: Rare race condition in Flow C' },
      ],
    },
    {
      version: 'v3.1.0',
      date: 'October 2025',
      type: 'feature',
      icon: Zap,
      title: 'Three Flows',
      description: 'Unified structured tools, unstructured documents, and AI sessions.',
      changes: [
        { type: 'feature', text: 'New: Flow A - Structured tools integration' },
        { type: 'feature', text: 'New: Flow B - Unstructured document extraction' },
        { type: 'feature', text: 'New: Flow C - AI session capture' },
      ],
    },
    {
      version: 'v3.0.0',
      date: 'September 2025',
      type: 'major',
      icon: Sparkles,
      title: 'IntegrateWise 3.0',
      description: 'Complete rebuild on Cloudflare edge with Supabase truth.',
      changes: [
        { type: 'feature', text: 'New: Cloudflare edge deployment' },
        { type: 'feature', text: 'New: Supabase backend' },
        { type: 'feature', text: 'New: Real-time sync' },
        { type: 'feature', text: 'New: 100ms latency worldwide' },
      ],
    },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Sparkles className="w-4 h-4 text-iw-accent" />;
      case 'improvement':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'fix':
        return <Bug className="w-4 h-4 text-red-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-iw-accent" />;
    }
  };

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Changelog
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            What's new at
            <br />
            <span className="text-iw-accent">IntegrateWise</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary">
            Track our journey from v1.0 to the Universal Cognitive Operating System.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {releases.map((release, index) => (
              <div key={index} className="relative">
                {/* Timeline line */}
                {index < releases.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-white/10" />
                )}
                
                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-iw-accent/20 flex items-center justify-center">
                      <release.icon className="w-6 h-6 text-iw-accent" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-iw-accent">{release.version}</span>
                      <span className="text-white/30">|</span>
                      <span className="text-sm text-iw-text-secondary">{release.date}</span>
                      {release.type === 'major' && (
                        <span className="px-2 py-0.5 rounded-full bg-iw-accent/20 text-iw-accent text-xs font-mono">
                          MAJOR
                        </span>
                      )}
                    </div>
                    
                    <h2 className="font-display font-semibold text-2xl text-iw-text mb-2">
                      {release.title}
                    </h2>
                    <p className="text-iw-text-secondary mb-6">
                      {release.description}
                    </p>
                    
                    <div className="space-y-2">
                      {release.changes.map((change, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                        >
                          {getChangeIcon(change.type)}
                          <span className="text-iw-text">{change.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
            Stay in the loop
          </h2>
          <p className="text-iw-text-secondary mb-6">
            Get notified when we ship new features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="you@company.com"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-iw-text placeholder:text-iw-text-secondary/50 focus:outline-none focus:border-iw-accent"
            />
            <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-3">
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChangelogPage;
