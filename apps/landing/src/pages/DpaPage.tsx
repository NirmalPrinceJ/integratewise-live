import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const DpaPage = () => {
  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="text-iw-text-secondary hover:text-iw-text mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to home
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-iw-text mb-4">
            Data Processing Agreement
          </h1>
          <p className="text-iw-text-secondary">
            Last updated: March 6, 2026
          </p>
          <div className="mt-6">
            <Button className="bg-iw-accent text-iw-bg font-semibold">
              <Download className="mr-2 w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg max-w-none">
          <div className="glass-card rounded-xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-iw-accent/10 border border-iw-accent/30">
              <FileText className="w-8 h-8 text-iw-accent" />
              <div>
                <h2 className="font-display font-semibold text-xl text-iw-text m-0">
                  Enterprise Data Protection
                </h2>
                <p className="text-iw-text-secondary m-0">
                  This DPA governs how we process data on behalf of our Enterprise customers.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              1. Definitions
            </h2>
            <p className="text-iw-text-secondary">
              <strong>"Controller"</strong> means the entity that determines the purposes and means 
              of processing personal data.
            </p>
            <p className="text-iw-text-secondary">
              <strong>"Processor"</strong> means IntegrateWise, which processes personal data on 
              behalf of the Controller.
            </p>
            <p className="text-iw-text-secondary">
              <strong>"Data Subject"</strong> means an identified or identifiable natural person 
              whose personal data is processed.
            </p>
            <p className="text-iw-text-secondary">
              <strong>"Personal Data"</strong> means any information relating to an identified or 
              identifiable natural person.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              2. Processing of Personal Data
            </h2>
            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              2.1 Purpose Limitation
            </h3>
            <p className="text-iw-text-secondary">
              The Processor shall process Personal Data only for the purposes specified in the 
              Agreement and this DPA, and in accordance with the documented instructions of the 
              Controller.
            </p>

            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              2.2 Data Minimization
            </h3>
            <p className="text-iw-text-secondary">
              The Processor shall ensure that Personal Data processed is adequate, relevant, and 
              limited to what is necessary for the purposes of processing.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              3. Data Security
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 my-6">
              <Shield className="w-6 h-6 text-iw-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-iw-text mb-2">Security Measures</h4>
                <p className="text-iw-text-secondary text-sm m-0">
                  We implement appropriate technical and organizational measures to ensure a level 
                  of security appropriate to the risk, including encryption, access controls, and 
                  regular security assessments.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              3.1 Security Measures Include:
            </h3>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>AES-256 encryption for data at rest</li>
              <li>TLS 1.3 for data in transit</li>
              <li>Row-Level Security (RLS) enforcement</li>
              <li>Multi-factor authentication</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee security training</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              4. Subprocessors
            </h2>
            <p className="text-iw-text-secondary">
              The Controller authorizes the Processor to engage subprocessors for the processing 
              of Personal Data. The Processor maintains a list of authorized subprocessors and 
              will notify the Controller of any changes.
            </p>
            <p className="text-iw-text-secondary">
              Current subprocessors include:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Cloudflare (hosting and CDN)</li>
              <li>Supabase (database)</li>
              <li>Stripe (payment processing)</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              5. Data Subject Rights
            </h2>
            <p className="text-iw-text-secondary">
              The Processor shall assist the Controller in responding to requests from Data 
              Subjects to exercise their rights under applicable data protection laws, including:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Right to access</li>
              <li>Right to rectification</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              6. Data Breach Notification
            </h2>
            <p className="text-iw-text-secondary">
              The Processor shall notify the Controller without undue delay (and in any case 
              within 24 hours) upon becoming aware of a personal data breach. The notification 
              shall include:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>The nature of the breach</li>
              <li>The categories and approximate number of affected Data Subjects</li>
              <li>The likely consequences of the breach</li>
              <li>Measures taken or proposed to address the breach</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              7. Data Transfer
            </h2>
            <p className="text-iw-text-secondary">
              Any transfer of Personal Data outside the country of origin shall be conducted 
              in accordance with applicable data protection laws. We offer data residency 
              options for Enterprise customers.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              8. Audit Rights
            </h2>
            <p className="text-iw-text-secondary">
              The Controller has the right to audit the Processor's compliance with this DPA. 
              Audits may be conducted annually or upon reasonable request, with at least 30 days 
              notice.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              9. Term and Termination
            </h2>
            <p className="text-iw-text-secondary">
              This DPA is effective as of the date the Enterprise Agreement is signed and 
              continues until the termination of the Agreement. Upon termination, the Processor 
              shall, at the Controller's choice, return or delete all Personal Data.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              10. Contact Information
            </h2>
            <p className="text-iw-text-secondary">
              For questions about this DPA or to request a signed copy, please contact us at{' '}
              <a href="mailto:dpa@integratewise.ai" className="text-iw-accent hover:underline">
                dpa@integratewise.ai
              </a>.
            </p>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-iw-text-secondary">
                This Data Processing Agreement is incorporated into and forms part of the 
                Enterprise Agreement between the parties. In case of any conflict, the terms 
                of this DPA shall prevail with respect to data protection matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DpaPage;
