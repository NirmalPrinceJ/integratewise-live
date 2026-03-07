import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Target, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Unanimous Architecture',
      description: 'One engine. Every dialect. From Kashmir to Kanyakumari, the same truth.',
    },
    {
      icon: Heart,
      title: 'Human Sovereignty',
      description: 'AI serves human judgment, not replaces it. The Hard Gate™ ensures control.',
    },
    {
      icon: Globe,
      title: 'Global by Design',
      description: 'Built for the Global South. 100ms latency from Jaipur to Lagos.',
    },
    {
      icon: Users,
      title: 'Privacy First',
      description: 'Your data is yours. RLS-enforced boundaries, always.',
    },
  ];

  const team = [
    { name: 'Nirmal Prince J', role: 'Founder & CEO', location: 'India' },
    { name: 'Engineering Team', role: 'Distributed', location: 'Global' },
  ];

  const milestones = [
    { year: '2023', event: 'IntegrateWise founded' },
    { year: '2024', event: 'First paying customers' },
    { year: '2025', event: 'v3.0 launch on Cloudflare edge' },
    { year: '2026', event: 'v3.6 - The Context Layer' },
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
                About Us
              </span>
              <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
                Building the
                <br />
                <span className="text-iw-accent">cognitive layer</span>
                <br />
                for work
              </h1>
              <p className="mt-6 text-lg text-iw-text-secondary">
                From the weaver in Jaipur to the engineer in Bangalore, 
                we're unifying how teams work with their tools, AI, and data.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/careers">
                  <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5 btn-lift">
                    Join our team
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-iw-accent/20 blur-3xl rounded-full" />
              <div className="relative glass-card rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="font-display font-bold text-4xl text-iw-accent">63M+</div>
                    <div className="text-sm text-iw-text-secondary mt-1">SMEs in India</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display font-bold text-4xl text-iw-accent">100ms</div>
                    <div className="text-sm text-iw-text-secondary mt-1">Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display font-bold text-4xl text-iw-accent">99.9%</div>
                    <div className="text-sm text-iw-text-secondary mt-1">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display font-bold text-4xl text-iw-accent">40%</div>
                    <div className="text-sm text-iw-text-secondary mt-1">Time Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-iw-text-secondary leading-relaxed">
            "You did not start your business to babysit technology. 
            You started it to weave textiles, catch fish, write code, heal patients. 
            We're building the cognitive operating system that lets your stack know itself—
            so you can stop being the cable between your own tools."
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-8 rounded-xl glass-card">
                <div className="p-4 rounded-xl bg-iw-accent/20 w-fit mb-6">
                  <value.icon className="w-8 h-8 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-xl text-iw-text mb-3">
                  {value.title}
                </h3>
                <p className="text-iw-text-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-8">
                  <div className="w-8 h-8 rounded-full bg-iw-accent/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-iw-accent" />
                  </div>
                  <div>
                    <span className="font-mono text-sm text-iw-accent">{milestone.year}</span>
                    <p className="text-iw-text">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="p-6 rounded-xl glass-card text-center">
                <div className="w-20 h-20 rounded-full bg-iw-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-iw-accent">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text">
                  {member.name}
                </h3>
                <p className="text-iw-text-secondary">{member.role}</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-iw-text-secondary">
                  <MapPin className="w-4 h-4" />
                  {member.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-6">
            Want to join our mission?
          </h2>
          <p className="text-iw-text-secondary mb-8">
            We're always looking for talented people who care about building the future of work.
          </p>
          <Link to="/careers">
            <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
              View open positions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
