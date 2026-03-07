import { useState, useEffect } from 'react';

import { 
  Check, AlertTriangle, X, Clock, ArrowRight, 
  Globe, Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const StatusPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    { name: 'API', status: 'operational', uptime: '99.99%' },
    { name: 'Web App', status: 'operational', uptime: '99.99%' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%' },
    { name: 'Integrations', status: 'operational', uptime: '99.97%' },
    { name: 'AI Services', status: 'operational', uptime: '99.95%' },
    { name: 'Database', status: 'operational', uptime: '99.99%' },
  ];

  const regions = [
    { name: 'India (Mumbai)', status: 'operational', latency: '45ms' },
    { name: 'India (Delhi)', status: 'operational', latency: '52ms' },
    { name: 'Singapore', status: 'operational', latency: '78ms' },
    { name: 'Europe (Frankfurt)', status: 'operational', latency: '142ms' },
    { name: 'US East (Virginia)', status: 'operational', latency: '198ms' },
  ];

  const incidents = [
    {
      date: 'March 1, 2026',
      title: 'AI Service Degradation',
      status: 'resolved',
      description: 'Intermittent delays in AI agent responses. Resolved within 15 minutes.',
      duration: '15 minutes',
    },
    {
      date: 'February 15, 2026',
      title: 'Scheduled Maintenance',
      status: 'resolved',
      description: 'Database upgrade to improve query performance.',
      duration: '30 minutes',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Check className="w-5 h-5 text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'down':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-green-500/20 text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
              Status
            </span>
            <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
              System Status
            </h1>
            <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
              Real-time status of IntegrateWise services and infrastructure.
            </p>
            <p className="mt-4 text-sm text-iw-text-secondary font-mono">
              Last updated: {currentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </p>
          </div>

          {/* Overall Status */}
          <div className="max-w-xl mx-auto">
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-iw-text mb-2">
                All Systems Operational
              </h2>
              <p className="text-iw-text-secondary">
                All services are running normally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-8">
            Services
          </h2>
          <div className="glass-card rounded-xl overflow-hidden">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(service.status)}
                  <span className="text-iw-text font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-iw-text-secondary">{service.uptime} uptime</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-8">
            Regions
          </h2>
          <div className="glass-card rounded-xl overflow-hidden">
            {regions.map((region, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-iw-accent" />
                  <span className="text-iw-text font-medium">{region.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-iw-text-secondary">{region.latency}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(region.status)}`}>
                    {region.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime Graph */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-8">
            30-Day Uptime History
          </h2>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-end gap-1 h-32">
              {Array.from({ length: 30 }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex-1 bg-green-500/40 rounded-t"
                  style={{ height: `${95 + Math.random() * 5}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-iw-text-secondary">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-8">
            Recent Incidents
          </h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm text-iw-text-secondary">{incident.date}</span>
                    <h3 className="font-display font-semibold text-lg text-iw-text">
                      {incident.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-iw-text-secondary mb-2">{incident.description}</p>
                <div className="flex items-center gap-2 text-sm text-iw-text-secondary">
                  <Clock className="w-4 h-4" />
                  Duration: {incident.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-2xl glass-card">
            <div className="p-4 rounded-full bg-iw-accent/20 w-fit mx-auto mb-6">
              <Activity className="w-8 h-8 text-iw-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
              Subscribe to Status Updates
            </h2>
            <p className="text-iw-text-secondary mb-6 max-w-xl mx-auto">
              Get notified when we create, update, or resolve incidents.
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StatusPage;
