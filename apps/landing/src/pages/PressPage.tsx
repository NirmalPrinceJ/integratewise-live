import { Link } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, Newspaper, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const PressPage = () => {
  const pressReleases = [
    {
      title: 'IntegrateWise Launches v3.6: The Universal Cognitive Operating System',
      date: 'March 6, 2026',
      excerpt: 'New Context Layer architecture connects Tools ↔ AI ↔ Data ↔ Context ↔ Memory in one unified loop.',
      slug: 'v36-launch',
    },
    {
      title: 'IntegrateWise Achieves SOC 2 Type II Certification',
      date: 'January 15, 2026',
      excerpt: 'Enterprise-grade security certification validates commitment to data protection.',
      slug: 'soc2-certification',
    },
    {
      title: 'IntegrateWise Raises Seed Funding to Build for Bharat',
      date: 'October 10, 2025',
      excerpt: 'Funding will accelerate product development and expand team across India.',
      slug: 'seed-funding',
    },
  ];

  const mediaCoverage = [
    {
      outlet: 'TechCrunch',
      title: 'The Startup Unifying India\'s Fragmented Business Tools',
      date: 'February 2026',
      link: '#',
    },
    {
      outlet: 'YourStory',
      title: 'How IntegrateWise is Building the OS for Indian SMEs',
      date: 'January 2026',
      link: '#',
    },
    {
      outlet: 'Inc42',
      title: 'The Future of Work is Context-Aware',
      date: 'December 2025',
      link: '#',
    },
  ];

  const brandAssets = [
    { name: 'Logo Pack', format: 'SVG, PNG', size: '2.4 MB' },
    { name: 'Brand Guidelines', format: 'PDF', size: '4.1 MB' },
    { name: 'Founder Photos', format: 'JPG', size: '8.7 MB' },
    { name: 'Product Screenshots', format: 'PNG', size: '12.3 MB' },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Press
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            News & Media
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Latest updates, press releases, and media coverage about IntegrateWise.
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-8">
            Press Releases
          </h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="flex items-center gap-2 text-sm text-iw-text-secondary mb-3">
                  <Calendar className="w-4 h-4" />
                  {release.date}
                </div>
                <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                  {release.title}
                </h3>
                <p className="text-iw-text-secondary mb-4">
                  {release.excerpt}
                </p>
                <Link to={`/press/${release.slug}`}>
                  <Button variant="outline" size="sm" className="border-white/20 text-iw-text hover:bg-white/5">
                    Read more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-8">
            Media Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaCoverage.map((article, index) => (
              <a 
                key={index} 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 rounded-xl glass-card hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-iw-accent">{article.outlet}</span>
                  <ExternalLink className="w-4 h-4 text-iw-text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-iw-text-secondary">{article.date}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-8">
            Brand Assets
          </h2>
          <div className="glass-card rounded-xl overflow-hidden">
            {brandAssets.map((asset, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-iw-accent/20">
                    <Download className="w-5 h-5 text-iw-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-iw-text">{asset.name}</p>
                    <p className="text-sm text-iw-text-secondary">{asset.format} • {asset.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/20 text-iw-text hover:bg-white/5">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-2xl glass-card">
            <div className="p-4 rounded-xl bg-iw-accent/20 w-fit mx-auto mb-6">
              <Newspaper className="w-8 h-8 text-iw-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
              Media Inquiries
            </h2>
            <p className="text-iw-text-secondary mb-6">
              For press inquiries, interview requests, or additional information, 
              please reach out to our communications team.
            </p>
            <a href="mailto:press@integratewise.ai">
              <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5">
                press@integratewise.ai
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PressPage;
