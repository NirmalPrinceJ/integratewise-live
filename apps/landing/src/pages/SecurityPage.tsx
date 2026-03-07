import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Eye, Server, FileCheck, 
  ArrowRight, Check, Fingerprint, Key, UserCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const SecurityPage = () => {
  const certifications = [
    { name: 'SOC 2 Type II', status: 'Certified', description: 'Security, availability, and confidentiality controls' },
    { name: 'GDPR', status: 'Compliant', description: 'EU data protection regulation' },
    { name: 'DPDP Act 2023', status: 'Compliant', description: 'India Digital Personal Data Protection' },
    { name: 'ISO 27001', status: 'In Progress', description: 'Information security management' },
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: 'Row-Level Security',
      description: 'Your Chennai plant manager never sees Bangalore HQ data. Every query is filtered by user permissions.',
    },
    {
      icon: Eye,
      title: 'The Hard Gate™',
      description: 'No token = No execution. Every AI action requires human approval with immutable audit trail.',
    },
    {
      icon: Server,
      title: 'Data Residency',
      description: 'Indian data stays in India. Choose your region for data storage and processing.',
    },
    {
      icon: Key,
      title: 'Encryption at Rest & Transit',
      description: 'AES-256 encryption for stored data. TLS 1.3 for all data in transit.',
    },
    {
      icon: Fingerprint,
      title: 'SSO & MFA',
      description: 'SAML 2.0 and OIDC support. Enforce multi-factor authentication for all users.',
    },
    {
      icon: UserCheck,
      title: 'Role-Based Access Control',
      description: 'Granular permissions. Control who sees what, down to the field level.',
    },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Security
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-6xl text-iw-text">
            Trust is our
            <br />
            <span className="text-iw-accent">foundation</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Enterprise-grade security with human sovereignty at its core. 
            Your data is yours. Period.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dpa">
              <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                <FileCheck className="mr-2 w-5 h-5" />
                Download DPA
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                Privacy Policy
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Certifications & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="p-6 rounded-xl glass-card text-center">
                <div className="inline-flex p-3 rounded-xl bg-iw-accent/20 mb-4">
                  <Shield className="w-8 h-8 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                  {cert.name}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm mb-3">
                  {cert.status}
                </span>
                <p className="text-sm text-iw-text-secondary">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="p-3 rounded-xl bg-iw-accent/20 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Spaces Security */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
                Three Spaces. Hard Boundaries.
              </h2>
              <p className="text-iw-text-secondary mb-8">
                Our architecture enforces privacy at the database level. 
                Personal data never leaks into Work or Team spaces.
              </p>
              <div className="space-y-4">
                {[
                  { name: 'Personal Space', desc: 'Private AI, notes, tasks. Never visible to team.' },
                  { name: 'Work Space', desc: 'Role-based views. Organization-only access.' },
                  { name: 'Team Space', desc: 'Shared coordination. Hard architectural boundary.' },
                ].map((space, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                    <Check className="w-5 h-5 text-iw-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-iw-text">{space.name}</h4>
                      <p className="text-sm text-iw-text-secondary">{space.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-iw-accent/20 blur-3xl rounded-full" />
              <div className="relative glass-card rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-emerald-400" />
                      <span className="font-mono text-sm text-emerald-400">RLS_ENFORCED</span>
                    </div>
                    <p className="mt-2 text-sm text-iw-text-secondary">
                      SELECT * FROM tasks WHERE user_id = current_user_id()
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <span className="font-mono text-sm text-blue-400">AUDIT_LOG</span>
                    </div>
                    <p className="mt-2 text-sm text-iw-text-secondary">
                      Every action logged with timestamp, user, and context
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-purple-400" />
                      <span className="font-mono text-sm text-purple-400">ENCRYPTION</span>
                    </div>
                    <p className="mt-2 text-sm text-iw-text-secondary">
                      AES-256 at rest, TLS 1.3 in transit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
            Questions about security?
          </h2>
          <p className="text-iw-text-secondary mb-8">
            Our security team is here to help. Reach out for a security review or compliance questionnaire.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
              Contact Security Team
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SecurityPage;
