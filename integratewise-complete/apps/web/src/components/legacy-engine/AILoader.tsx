'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@iw/ui/Button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AILoaderProps {
  platform: 'OS' | 'CS';
  initialName?: string;
}

export function AILoader({ platform, initialName }: AILoaderProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const platformName = platform === 'OS' ? 'Productivity Hub' : 'CS Platform';

  useEffect(() => {
    const loadingSteps = [
      `Initializing ${platformName} environment...`,
      'Synchronizing with IntegrateWise Spine...',
      'Allocating AI Orchestration resources...',
      'Verifying Computational Insight integrity...',
      'Calibrating Operational Infrastructure...',
      'Optimizing Mission Control console...',
      'System Online.',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= loadingSteps.length) {
        clearInterval(interval);
        setComplete(true);
        return;
      }

      setLogs(prev => [...prev, `> ${loadingSteps[currentStep]}`]);
      setProgress(Math.round(((currentStep + 1) / loadingSteps.length) * 100));
      currentStep++;

      // Auto scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 800); // Add a step every 800ms

    return () => clearInterval(interval);
  }, [platformName]);

  const handleDashboardEnter = () => {
    // Persist the selected platform preference
    document.cookie = `selected_platform=${platform}; path=/; max-age=31536000`; // 1 year

    // Redirect to Dashboard
    router.push('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            className="w-full bg-iw-darkblue/90 border border-white/10 rounded-2xl overflow-hidden shadow-halo font-sans"
          >
            {/* Premium Header */}
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-iw-error/50" />
                <div className="w-3 h-3 rounded-full bg-iw-gold/50" />
                <div className="w-3 h-3 rounded-full bg-iw-success/50" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                System Initialization
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              className="h-72 overflow-hidden p-8 relative bg-iw-navy/50 grid-pattern"
            >
              <div className="flex flex-col gap-3">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-iw-silver/80 text-sm md:text-base font-medium flex items-center"
                  >
                    <span className="text-iw-indigo mr-3 font-bold">::</span>
                    {log}
                    {i === logs.length - 1 && (
                      <span className="animate-pulse inline-block w-1.5 h-4 bg-iw-indigo ml-3 align-middle" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/5">
              <motion.div
                className="h-full bg-iw-indigo shadow-glow-blue"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8 relative inline-block">
              <div className="absolute -inset-4 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
              <div className="relative bg-black border border-blue-500/50 p-6 rounded-2xl shadow-2xl">
                <svg
                  className="w-16 h-16 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-iw-silver">
              Deployment Successful
            </h2>

            <p className="text-iw-silver/60 text-lg mb-12 max-w-lg mx-auto font-medium">
              Your high-fidelity <strong>{platformName}</strong> is now online.
              {initialName ? ` Welcome to the Mission Control, ${initialName}.` : ''}
            </p>

            <Button
              onClick={handleDashboardEnter}
              className="bg-iw-indigo text-white hover:bg-iw-royal px-12 py-8 rounded-full font-bold text-xl shadow-glow-blue hover:scale-105 transition-all border border-white/10"
            >
              Access Mission Control
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
