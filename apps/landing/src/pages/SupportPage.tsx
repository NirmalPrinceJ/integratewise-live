import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MessageSquare, Mail, Book, ArrowRight, 
  Check, Clock, AlertCircle, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I connect my first integration?',
      answer: 'Go to your workspace settings, click "Integrations", and select the tool you want to connect. Follow the OAuth flow to authorize access.',
      category: 'Getting Started',
    },
    {
      question: 'What is The Hard Gate™?',
      answer: 'The Hard Gate™ is our AI governance system that ensures no AI action executes without human approval. Every suggestion requires an explicit approval token.',
      category: 'AI & Agents',
    },
    {
      question: 'How does Row-Level Security work?',
      answer: 'RLS ensures users only see data they have permission to access. Your Chennai plant manager will never see Bangalore HQ data—enforced at the database level.',
      category: 'Security',
    },
    {
      question: 'Can I self-host IntegrateWise?',
      answer: 'Enterprise customers can opt for a dedicated VPC or air-gapped deployment. Contact sales for more information.',
      category: 'Enterprise',
    },
    {
      question: 'What is Progressive Hydration?',
      answer: 'Progressive Hydration is our onboarding system that delivers value in minutes (B0-B2) and full intelligence in weeks (B3-B7).',
      category: 'Getting Started',
    },
    {
      question: 'How do I invite team members?',
      answer: 'Go to your Team Space settings and click "Invite Members". Enter their email addresses and assign appropriate roles.',
      category: 'Team',
    },
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time.',
      availability: 'Available 9am-6pm IST',
      cta: 'Start chat',
      link: '#chat',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours.',
      availability: '24/7',
      cta: 'Email us',
      link: 'mailto:support@integratewise.ai',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive documentation.',
      availability: 'Always available',
      cta: 'Read docs',
      link: '/documentation',
    },
  ];

  const plans = [
    {
      name: 'Personal',
      support: 'Community',
      response: 'Best effort',
      features: ['Discord community', 'Documentation', 'Forum access'],
    },
    {
      name: 'Cognitive',
      support: 'Email',
      response: '24 hours',
      features: ['Email support', 'Priority Discord', 'Monthly check-ins'],
    },
    {
      name: 'Enterprise',
      support: 'Dedicated',
      response: '4 hours',
      features: ['Dedicated CSM', 'Phone support', 'SLA guarantee', 'Custom onboarding'],
    },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Support
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            How can we help?
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Search our documentation, browse FAQs, or contact our support team.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-iw-text-secondary" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <a 
                key={index} 
                href={option.link}
                className="p-6 rounded-xl glass-card hover:bg-white/5 transition-colors"
              >
                <div className="p-3 rounded-xl bg-iw-accent/20 w-fit mb-4">
                  <option.icon className="w-6 h-6 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-2">
                  {option.title}
                </h3>
                <p className="text-iw-text-secondary text-sm mb-4">
                  {option.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-iw-text-secondary mb-4">
                  <Clock className="w-4 h-4" />
                  {option.availability}
                </div>
                <div className="flex items-center text-iw-accent">
                  <span className="text-sm font-medium">{option.cta}</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-iw-accent/20 flex-shrink-0">
                    <FileText className="w-5 h-5 text-iw-accent" />
                  </div>
                  <div>
                    <span className="text-xs text-iw-accent font-mono uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="font-display font-semibold text-lg text-iw-text mt-1 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-iw-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/documentation">
              <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5">
                View all FAQs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Plans */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Support Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <h3 className="font-display font-semibold text-xl text-iw-text mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-iw-accent/20 text-iw-accent text-xs font-mono">
                    {plan.support}
                  </span>
                  <span className="text-sm text-iw-text-secondary">{plan.response}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-iw-text-secondary">
                      <Check className="w-4 h-4 text-iw-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-2xl glass-card">
            <div className="p-4 rounded-full bg-iw-accent/20 w-fit mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-iw-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
              Still need help?
            </h2>
            <p className="text-iw-text-secondary mb-6 max-w-xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@integratewise.ai">
                <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5">
                  <Mail className="mr-2 w-5 h-5" />
                  Contact Support
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                  General Inquiry
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

export default SupportPage;
