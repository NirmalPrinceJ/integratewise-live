import { Link } from 'react-router-dom';
import { 
  Book, Code, Shield, Layers, ArrowRight, 
  Search, FileText, Terminal, Cpu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const DocumentationPage = () => {
  const sections = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics and set up your first workspace.',
      links: ['Quick Start', 'Installation', 'Configuration', 'First Integration'],
    },
    {
      icon: Layers,
      title: 'Core Concepts',
      description: 'Understand the architecture and key concepts.',
      links: ['The Context Layer', 'Three Flows', 'Three Spaces', 'Progressive Hydration'],
    },
    {
      icon: Cpu,
      title: 'AI & Agents',
      description: 'Configure AI assistants and Colony agents.',
      links: ['AI Governance', 'The Hard Gate', 'Colony Agents', 'MCP Protocol'],
    },
    {
      icon: Code,
      title: 'Integrations',
      description: 'Connect your tools and build custom integrations.',
      links: ['Pre-built Connectors', 'Custom Webhooks', 'API Integration', 'SDK'],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Configure security settings and compliance.',
      links: ['Authentication', 'Row-Level Security', 'Audit Logs', 'Compliance'],
    },
    {
      icon: Terminal,
      title: 'API Reference',
      description: 'Complete API documentation and examples.',
      links: ['REST API', 'GraphQL', 'Webhooks', 'Rate Limits'],
    },
  ];

  const quickLinks = [
    { title: 'Quick Start', href: '/docs/quick-start' },
    { title: 'API Reference', href: '/api-reference' },
    { title: 'SDKs', href: '/docs/sdks' },
    { title: 'Changelog', href: '/changelog' },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Documentation
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            Learn how to build with
            <br />
            <span className="text-iw-accent">IntegrateWise</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Everything you need to integrate, configure, and extend IntegrateWise.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-iw-text placeholder:text-iw-text-secondary/50 focus:outline-none focus:border-iw-accent"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {quickLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.href}
                className="px-4 py-2 rounded-full bg-white/5 text-iw-text-secondary hover:bg-white/10 hover:text-iw-text transition-colors text-sm"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="p-3 rounded-xl bg-iw-accent/20 w-fit mb-4">
                  <section.icon className="w-6 h-6 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                  {section.title}
                </h3>
                <p className="text-iw-text-secondary text-sm mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        to={`/docs/${link.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-iw-accent hover:underline"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8 lg:p-12 text-center">
            <div className="p-4 rounded-xl bg-iw-accent/20 w-fit mx-auto mb-6">
              <FileText className="w-8 h-8 text-iw-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-iw-text mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-iw-text-secondary mb-6 max-w-xl mx-auto">
              Our support team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support">
                <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5">
                  Contact Support
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DocumentationPage;
