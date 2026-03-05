import { Link } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Briefcase, Clock, Globe, 
  Heart, Zap, Users, Coffee, Laptop 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const CareersPage = () => {
  const benefits = [
    {
      icon: Globe,
      title: 'Remote First',
      description: 'Work from anywhere. We\'re distributed across India and beyond.',
    },
    {
      icon: Zap,
      title: 'Cutting Edge',
      description: 'Build on Cloudflare edge, AI/ML, and the latest tech.',
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance for you and your family.',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate people who care about the mission.',
    },
    {
      icon: Coffee,
      title: 'Learning Budget',
      description: '₹1,00,000 annual budget for courses, conferences, and books.',
    },
    {
      icon: Laptop,
      title: 'Equipment',
      description: 'Latest MacBook Pro and home office setup allowance.',
    },
  ];

  const openings = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'senior-fullstack-engineer',
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'ai-ml-engineer',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'product-designer',
    },
    {
      title: 'Developer Relations',
      department: 'Growth',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'developer-relations',
    },
    {
      title: 'Technical Writer',
      department: 'Engineering',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'technical-writer',
    },
    {
      title: 'Customer Success Manager',
      department: 'Success',
      location: 'Remote (India)',
      type: 'Full-time',
      slug: 'customer-success-manager',
    },
  ];

  const departments = ['All', 'Engineering', 'Design', 'Growth', 'Success'];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Careers
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            Build the future of
            <br />
            <span className="text-iw-accent">cognitive work</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Join a team that's unifying how the world works. From Kashmir to Kanyakumari, 
            we're building something extraordinary.
          </p>
          <div className="mt-8">
            <Link to="#openings">
              <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
                View open positions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Why work at IntegrateWise?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="p-3 rounded-xl bg-iw-accent/20 w-fit mb-4">
                  <benefit.icon className="w-6 h-6 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-8">
            Open Positions
          </h2>

          {/* Departments */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {departments.map((dept, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-iw-accent text-iw-bg'
                    : 'bg-white/5 text-iw-text-secondary hover:bg-white/10 hover:text-iw-text'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {openings.map((job, index) => (
              <Link key={index} to={`/careers/${job.slug}`}>
                <div className="p-6 rounded-xl glass-card hover:bg-white/5 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-iw-text-secondary">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-iw-accent hidden sm:block" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No positions */}
          <div className="text-center mt-12 p-8 rounded-xl glass-card">
            <p className="text-iw-text-secondary">
              Don't see a role that fits? We're always looking for great people.
            </p>
            <Link to="/contact" className="inline-block mt-4">
              <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5">
                Send us your resume
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-iw-text-secondary leading-relaxed mb-8">
            "Stop being the cable between your own tools. We're building the cognitive 
            operating system that lets your stack know itself—so you can focus on what matters."
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="font-display font-bold text-3xl text-iw-accent">63M+</div>
              <div className="text-sm text-iw-text-secondary">SMEs in India</div>
            </div>
            <div>
              <div className="font-display font-bold text-3xl text-iw-accent">100ms</div>
              <div className="text-sm text-iw-text-secondary">Global latency</div>
            </div>
            <div>
              <div className="font-display font-bold text-3xl text-iw-accent">40%</div>
              <div className="text-sm text-iw-text-secondary">Time saved</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
