import { Link } from 'react-router-dom';
import { 
  Database, Brain, Zap, Layers, Shield,
  Workflow, Check, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const FeaturesPage = () => {
  const features = [
    {
      icon: Layers,
      title: 'The Context Layer',
      description: 'Connect Tools ↔ AI ↔ Data ↔ Context ↔ Memory in one unified loop.',
      details: ['Single Source of Truth', 'Adaptive Schema', 'Real-time Sync'],
    },
    {
      icon: Database,
      title: 'Three Data Flows',
      description: 'Structured tools, unstructured documents, and AI sessions—all unified.',
      details: ['ERP/CRM Integration', 'Document Extraction', 'AI Memory Capture'],
    },
    {
      icon: Brain,
      title: 'AI Governance',
      description: 'Think. Govern. Act. Audit. Human sovereignty guaranteed.',
      details: ['Hard Approval Gates', 'Immutable Audit Trail', 'SOC 2 Ready'],
    },
    {
      icon: Shield,
      title: 'Three Spaces',
      description: 'Personal, Work, and Team spaces with hard privacy boundaries.',
      details: ['RLS Enforcement', 'Role-based Access', 'Data Isolation'],
    },
    {
      icon: Zap,
      title: 'Progressive Hydration',
      description: 'Value in minutes, intelligence in weeks. No empty dashboards.',
      details: ['B0-B7 Stages', 'Zero Abandonment', 'Instant Value'],
    },
    {
      icon: Workflow,
      title: 'Colony Agents',
      description: 'Orchestrate complex workflows across your entire stack.',
      details: ['Multi-step Automation', 'Cross-tool Logic', 'Human-in-the-Loop'],
    },
  ];

  const integrations = [
    'Salesforce', 'HubSpot', 'Slack', 'Notion', 'GitHub', 
    'Jira', 'Zendesk', 'Stripe', 'WhatsApp', 'Claude', 'ChatGPT'
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Features
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-6xl text-iw-text">
            Everything you need to
            <br />
            <span className="text-iw-accent">unify your stack</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            From the weaver in Jaipur to the engineer in Bangalore—one architecture, 
            one truth, one calm.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/documentation">
              <Button variant="outline" size="lg" className="border-white/20 text-iw-text hover:bg-white/5 px-8 py-6">
                Read documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-xl glass-card hover:bg-white/5 transition-colors">
                <div className="p-4 rounded-xl bg-iw-accent/20 w-fit mb-6">
                  <feature.icon className="w-8 h-8 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-xl text-iw-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-iw-text-secondary mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-iw-text-secondary">
                      <Check className="w-4 h-4 text-iw-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-iw-text mb-4">
              Connect your favorite tools
            </h2>
            <p className="text-iw-text-secondary">
              100+ integrations and counting. If we don't have it, build it with our API.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-iw-text font-medium"
              >
                {integration}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/api-reference">
              <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5">
                View all integrations
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-iw-text mb-6">
            Ready to stop being the cable?
          </h2>
          <p className="text-iw-text-secondary mb-8 max-w-xl mx-auto">
            Join thousands of teams who've unified their stack with IntegrateWise.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
              Get started free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
