'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@iw/ui/Button';
import { Zap, Binary } from 'lucide-react';
import { calculateNameNumber, NumerologyResult, IntegrateWisePersona } from '../utils/numerology';

export type UserNature = IntegrateWisePersona;

interface PersonaAssessmentProps {
  onComplete: (nature: UserNature) => void;
}

export function PersonaAssessment({ onComplete }: PersonaAssessmentProps) {
  const [step, setStep] = useState<'input' | 'processing' | 'reveal'>('input');
  const [name, setName] = useState('');
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const handleAnalyze = async () => {
    if (!name.trim()) return;

    setStep('processing');

    // Calculate immediately but show "Thinking" animation
    const calcResult = calculateNameNumber(name);
    setResult(calcResult);

    // Simulate "Assessment" delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    setStep('reveal');
    // Play success sound logic here
  };

  const handleContinue = () => {
    if (result) {
      onComplete((result.persona ?? 'explorer') as unknown as IntegrateWisePersona);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col min-h-[600px] relative transition-all duration-500">
      {/* Duolingo-style Progress Header */}
      <div className="px-8 py-6 flex items-center gap-6">
        <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-iw-success shadow-glow-blue"
            initial={{ width: '0%' }}
            animate={{
              width: step === 'input' ? '20%' : step === 'processing' ? '80%' : '100%',
            }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          />
        </div>
        <div className="flex items-center space-x-2 bg-iw-gold/10 px-3 py-1.5 rounded-full border border-iw-gold/20">
          <Zap className="h-4 w-4 text-iw-gold fill-iw-gold" />
          <span className="text-xs font-black text-iw-gold uppercase tracking-wider">
            Streak: 0
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-8 md:px-12 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: NAME INPUT */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col items-center"
            >
              {/* Mascot */}
              <div className="mb-8 relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-iw-indigo to-iw-navy shadow-halo flex items-center justify-center border border-white/10 animate-hover">
                  <div className="absolute inset-0 bg-iw-indigo/20 blur-xl rounded-full" />
                  <span className="text-3xl">👋</span>
                </div>
                <div className="absolute -right-24 -top-8 bg-white text-iw-darkblue font-bold px-4 py-2 rounded-xl rounded-bl-sm shadow-lg text-sm w-48 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                  Hi! I'm your Guide. What should I call you?
                </div>
              </div>

              <input
                type="text"
                value={name}
                onChange={e => {
                  // Strictly allow only characters (letters)
                  const val = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(val)) setName(val);
                }}
                placeholder="Type your name..."
                className="w-full text-center bg-transparent border-b-2 border-white/20 text-4xl font-black text-white focus:outline-none focus:border-iw-indigo placeholder-white/10 py-4 mb-12 transition-colors uppercase tracking-widest"
                autoFocus
              />

              <Button
                disabled={!name.trim()}
                onClick={handleAnalyze}
                className={`w-full md:w-auto px-16 py-6 rounded-2xl font-black text-lg tracking-widest uppercase shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all
                                ${
                                  name.trim()
                                    ? 'bg-iw-indigo hover:bg-iw-royal text-white shadow-glow-blue border-b-4 border-blue-900'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed border-b-4 border-white/5'
                                }`}
              >
                START SCAN
              </Button>
            </motion.div>
          )}

          {/* STEP 2: PROCESSING (Character Analysis) */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center text-center"
            >
              <div className="h-32 w-32 rounded-3xl bg-iw-navy border border-white/10 flex items-center justify-center relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-3xl border-2 border-dashed border-iw-indigo/50"
                />
                <Binary className="h-12 w-12 text-iw-indigo animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Reading Characters...</h3>
              <p className="text-iw-silver/60 font-medium">
                Analyzing the unique signature of "{name}"
              </p>
            </motion.div>
          )}

          {/* STEP 3: REVEAL */}
          {step === 'reveal' && result && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* Dynamic Result Card */}
              <div
                className={`w-full bg-gradient-to-br ${result.style?.gradient ?? ''} border border-white/20 rounded-3xl p-8 mb-8 relative overflow-hidden group shadow-2xl`}
              >
                {/* Abstract Background Numbers */}
                <div className="absolute top-0 right-0 p-4 opacity-30 mix-blend-overlay">
                  <span className="text-[12rem] font-black text-white leading-none select-none absolute -top-12 -right-8">
                    {result.number}
                  </span>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  {/* Icon Badge */}
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-6 shadow-lg border border-white/20">
                    {result.style?.icon && <result.style.icon className="h-10 w-10 text-white" />}
                  </div>

                  <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 border border-white/10 text-white font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-sm">
                    {result.style?.theme ?? ''}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                    {result.archetype}
                  </h2>

                  {/* Number Display */}
                  <div
                    className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b ${result.style?.textGradient ?? ''} mb-4 drop-shadow-sm`}
                  >
                    {result.number}
                  </div>

                  <p className="text-lg text-white/90 font-medium max-w-md mx-auto leading-relaxed drop-shadow-sm">
                    {result.description}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {(result.traits ?? []).map((trait, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl text-sm text-white font-bold shadow-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
                  System Role Assigned: <span className="text-white">{result.persona}</span>
                </p>
                <Button
                  onClick={handleContinue}
                  className="w-full md:w-auto px-16 py-6 rounded-2xl font-black text-lg tracking-widest uppercase bg-iw-success hover:bg-green-500 text-white shadow-glow-blue border-b-4 border-green-700 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all"
                >
                  ENTER MISSION CONTROL
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
