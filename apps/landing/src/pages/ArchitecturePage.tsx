import { Link } from 'react-router-dom';
import { 
  Layers, Database, Brain, ArrowRight, Code, 
  Server, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const ArchitecturePage = () => {
  const layers = [
    {
      level: 'L3',
      name: 'Backend Layer',
      icon: Server,
      description: '8-stage mandatory pipeline ensuring zero data corruption.',
      components: ['Validation', 'Transformation', 'Enrichment', 'Persistence'],
      color: 'from-purple-500/20 to-purple-600/10',
    },
    {
      level: 'L2',
      name: 'Intelligence Layer',
      icon: Brain,
      description: 'AI that proposes, waits for approval, and executes.',
      components: ['Cognitive Agents', 'The Hard Gate™', 'Audit Logger', 'Memory Store'],
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      level: 'L1',
      name: 'Workspace Layer',
      icon: Layers,
      description: 'One view of Home, Accounts, Pipeline, Tasks—hydrated from ALL tools.',
      components: ['Personal Space', 'Work Space', 'Team Space', 'Signals'],
      color: 'from-green-500/20 to-green-600/10',
    },
    {
      level: 'L0',
      name: 'Onboarding Layer',
      icon: Database,
      description: 'Domain-aware setup—4 minutes, not 4 weeks.',
      components: ['Context Detection', 'Schema Adaptation', 'Tool Discovery', 'AI Connection'],
      color: 'from-orange-500/20 to-orange-600/10',
    },
  ];

  const techStack = [
    { category: 'Edge', items: ['Cloudflare Workers', 'Cloudflare Pages', 'Durable Objects'] },
    { category: 'Database', items: ['Supabase (PostgreSQL)', 'Row-Level Security', 'Realtime'] },
    { category: 'AI/ML', items: ['Claude API', 'OpenAI', 'Custom Models', 'MCP Protocol'] },
    { category: 'Security', items: ['JWT Auth', 'SOC 2', 'GDPR', 'DPDP Act 2023'] },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
                Architecture
              </span>
              <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
                Built for scale.
                <br />
                <span className="text-iw-accent">Designed for trust.</span>
              </h1>
              <p className="mt-6 text-lg text-iw-text-secondary">
                A 4-layer cognitive architecture that connects your entire stack 
                while maintaining strict data boundaries and audit compliance.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/api-reference">
                  <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5 btn-lift">
                    <Code className="mr-2 w-5 h-5" />
                    API Reference
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                    Read docs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-iw-accent/20 blur-3xl rounded-full" />
              <div className="relative glass-card rounded-2xl p-8">
                <div className="space-y-4">
                  {layers.map((layer, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl bg-gradient-to-r ${layer.color} border border-white/10`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/10">
                          <layer.icon className="w-5 h-5 text-iw-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-iw-accent">{layer.level}</span>
                            <span className="text-white/30">|</span>
                            <span className="font-semibold text-iw-text">{layer.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layers Detail */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-16">
            The Four Layers
          </h2>
          <div className="space-y-8">
            {layers.map((layer, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-2xl bg-gradient-to-br ${layer.color} border border-white/10`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        <layer.icon className="w-8 h-8 text-iw-accent" />
                      </div>
                      <div>
                        <span className="font-mono text-sm text-iw-accent">{layer.level}</span>
                        <h3 className="font-display font-semibold text-xl text-iw-text">{layer.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-iw-text-secondary mb-4">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map((component, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 rounded-full bg-white/10 text-sm text-iw-text"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <h3 className="font-mono text-sm text-iw-accent uppercase tracking-wider mb-4">
                  {stack.category}
                </h3>
                <ul className="space-y-2">
                  {stack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-iw-text">
                      <Check className="w-4 h-4 text-iw-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
            The New Loop
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg">
            <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400">DATA</span>
            <ArrowRight className="w-5 h-5 text-iw-accent" />
            <span className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">CONTEXT</span>
            <ArrowRight className="w-5 h-5 text-iw-accent" />
            <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400">INSIGHT</span>
            <ArrowRight className="w-5 h-5 text-iw-accent" />
            <span className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400">ACTION</span>
            <ArrowRight className="w-5 h-5 text-iw-accent" />
            <span className="px-4 py-2 rounded-lg bg-pink-500/20 text-pink-400">LEARNING</span>
          </div>
          <p className="mt-8 text-iw-text-secondary">
            Completed by IntegrateWise. Broken everywhere else.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArchitecturePage;
