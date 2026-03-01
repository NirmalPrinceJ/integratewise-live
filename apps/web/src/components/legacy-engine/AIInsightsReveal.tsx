'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Zap, Target, ArrowRight } from 'lucide-react';
import { Button } from '@iw/ui/Button';

interface InsightCard {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  stats: { label: string; value: string }[];
}

const insights: InsightCard[] = [
  {
    id: 1,
    title: 'Strategic Alignment',
    description:
      'Your business spine is being calibrated for maximum strategic coherence across all departments.',
    icon: Target,
    color: 'text-iw-gold',
    stats: [
      { label: 'Coherence', value: '94%' },
      { label: 'Strategic Drift', value: '-12%' },
    ],
  },
  {
    id: 2,
    title: 'Operational Efficiency',
    description:
      'AI Orchestration will automate redundant workflows, freeing up 35% of your high-value human capital.',
    icon: Zap,
    color: 'text-iw-indigo',
    stats: [
      { label: 'Automation', value: '68%' },
      { label: 'Time Saved', value: '40h/wk' },
    ],
  },
  {
    id: 3,
    title: 'Growth Engine',
    description:
      'Predictive modeling and real-time infrastructure will scale your output by a factor of 3.5x.',
    icon: BarChart3,
    color: 'text-iw-success',
    stats: [
      { label: 'Scale Factor', value: '3.5x' },
      { label: 'ROI Forecast', value: '480%' },
    ],
  },
];

interface AIInsightsRevealProps {
  onComplete: () => void;
}

export function AIInsightsReveal({ onComplete }: AIInsightsRevealProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < insights.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6">
      <div className="mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
        >
          Computational Insight
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-iw-silver/60 text-lg font-medium"
        >
          Synthesizing your enterprise intelligence profile...
        </motion.p>
      </div>

      <div className="relative w-full h-[450px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-3xl shadow-halo relative overflow-hidden"
          >
            {/* High-fidelity background glow */}
            <div
              className={`absolute -top-20 -right-20 w-64 h-64 bg-iw-indigo/20 blur-[100px] rounded-full`}
            />

            <div className="relative z-10">
              <div className="flex items-center space-x-5 mb-8">
                <div
                  className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${insights[currentStep].color}`}
                >
                  {(() => {
                    const Icon = insights[currentStep].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <h3 className="text-3xl font-bold text-white">{insights[currentStep].title}</h3>
              </div>

              <p className="text-xl text-iw-silver/80 mb-10 leading-relaxed">
                {insights[currentStep].description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {insights[currentStep].stats.map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-sm font-bold text-iw-silver/40 uppercase tracking-widest mb-2">
                      {stat.label}
                    </div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {insights.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 transition-all duration-300 rounded-full ${i === currentStep ? 'w-8 bg-iw-indigo' : 'w-2 bg-white/10'}`}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleNext}
                  className="bg-white text-iw-darkblue hover:bg-iw-softviolet px-8 py-6 rounded-full font-bold shadow-lg transition-all active:scale-95 border border-white/10"
                >
                  {currentStep === insights.length - 1 ? 'Go Live' : 'Next Insight'}{' '}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
