/**
 * Numerology Calculator for IntegrateWise
 *
 * Maps names to numbers (1-9, 11, 22, 33) and corresponding IntegrateWise Personas.
 * Now includes distinct Visual Styles for each character pattern.
 */

import {
  Sun,
  Moon,
  Zap,
  Hammer,
  Wind,
  Heart,
  Globe,
  Crown,
  Flame,
  Sparkles,
  Building2,
  Lightbulb,
} from 'lucide-react';

export type IntegrateWisePersona = 'Strategist' | 'Builder' | 'Operator';

interface VisualStyle {
  gradient: string;
  accent: string;
  textGradient: string;
  icon: any;
  theme: string;
}

export interface NumerologyResult {
  number: number;
  archetype: string;
  description: string;
  persona: IntegrateWisePersona;
  traits: string[];
  style: VisualStyle;
}

const LETTER_MAP: Record<string, number> = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 1,
  k: 2,
  l: 3,
  m: 4,
  n: 5,
  o: 6,
  p: 7,
  q: 8,
  r: 9,
  s: 1,
  t: 2,
  u: 3,
  v: 4,
  w: 5,
  x: 6,
  y: 7,
  z: 8,
};

// Map Numbers to Archetypes, Personas, and Styles
const NUMBER_MEANINGS: Record<number, Omit<NumerologyResult, 'number'>> = {
  1: {
    archetype: 'The Pioneer',
    description: 'Independent, ambitious, and original.',
    persona: 'Strategist',
    traits: ['Leadership', 'Innovation', 'Drive'],
    style: {
      gradient: 'from-amber-500 to-orange-600',
      accent: 'text-amber-400',
      textGradient: 'from-amber-100 to-amber-300',
      icon: Sun,
      theme: 'Solar Radiance',
    },
  },
  2: {
    archetype: 'The Diplomat',
    description: 'Intuitive, cooperative, and detail-oriented.',
    persona: 'Operator',
    traits: ['Harmony', 'Detail', 'Support'],
    style: {
      gradient: 'from-sky-300 to-blue-400',
      accent: 'text-sky-200',
      textGradient: 'from-white to-sky-200',
      icon: Moon,
      theme: 'Lunar Calm',
    },
  },
  3: {
    archetype: 'The Creator',
    description: 'Expressive, optimistic, and charming.',
    persona: 'Operator',
    traits: ['Expression', 'Creativity', 'Connection'],
    style: {
      gradient: 'from-purple-500 to-pink-500',
      accent: 'text-purple-300',
      textGradient: 'from-purple-100 to-pink-200',
      icon: Zap,
      theme: 'Creative Spark',
    },
  },
  4: {
    archetype: 'The Builder',
    description: 'Practical, disciplined, and bedrock solid.',
    persona: 'Builder',
    traits: ['Stability', 'Systems', 'Logic'],
    style: {
      gradient: 'from-slate-600 to-slate-800',
      accent: 'text-slate-300',
      textGradient: 'from-slate-100 to-slate-400',
      icon: Hammer,
      theme: 'Concrete Architecture',
    },
  },
  5: {
    archetype: 'The Catalyst',
    description: 'Versatile, adventurous, and progressive.',
    persona: 'Strategist',
    traits: ['Adaptability', 'Change', 'Vision'],
    style: {
      gradient: 'from-emerald-400 to-teal-600',
      accent: 'text-emerald-300',
      textGradient: 'from-emerald-100 to-teal-200',
      icon: Wind,
      theme: 'Kinetic Energy',
    },
  },
  6: {
    archetype: 'The Steward',
    description: 'Responsible, caring, and harmonious.',
    persona: 'Operator',
    traits: ['Responsibility', 'Team', 'Service'],
    style: {
      gradient: 'from-rose-400 to-pink-600',
      accent: 'text-rose-200',
      textGradient: 'from-rose-100 to-pink-200',
      icon: Heart,
      theme: 'Harmonic Resonance',
    },
  },
  7: {
    archetype: 'The Analyst',
    description: 'Analytical, insightful, and deep.',
    persona: 'Builder',
    traits: ['Analysis', 'Wisdom', 'Depth'],
    style: {
      gradient: 'from-indigo-600 to-violet-900',
      accent: 'text-indigo-300',
      textGradient: 'from-indigo-100 to-violet-300',
      icon: Globe,
      theme: 'Deep Space',
    },
  },
  8: {
    archetype: 'The Executive',
    description: 'Authoritative, efficient, and successful.',
    persona: 'Strategist',
    traits: ['Power', 'Efficiency', 'Success'],
    style: {
      gradient: 'from-blue-900 to-black',
      accent: 'text-blue-200',
      textGradient: 'from-blue-100 to-slate-300',
      icon: Crown,
      theme: 'Corporate Power',
    },
  },
  9: {
    archetype: 'The Connector',
    description: 'Compassionate, selfless, and wise.',
    persona: 'Operator',
    traits: ['Compassion', 'Global', 'Wisdom'],
    style: {
      gradient: 'from-red-500 to-orange-600',
      accent: 'text-red-200',
      textGradient: 'from-red-100 to-orange-200',
      icon: Flame,
      theme: 'Universal Fire',
    },
  },
  11: {
    archetype: 'The Visionary',
    description: 'Intuitive visionary channeling high-level strategy.',
    persona: 'Strategist',
    traits: ['Intuition', 'Vision', 'Idealism'],
    style: {
      gradient: 'from-white via-blue-100 to-white', // Iridescent
      accent: 'text-blue-300',
      textGradient: 'from-white via-blue-200 to-white',
      icon: Sparkles,
      theme: 'Ethereal Light',
    },
  },
  22: {
    archetype: 'The Master Architect',
    description: 'Turns massive plans into tangible reality.',
    persona: 'Builder',
    traits: ['Manifestation', 'Scale', 'Impact'],
    style: {
      gradient: 'from-yellow-600 to-amber-800', // Deep Gold
      accent: 'text-yellow-400',
      textGradient: 'from-yellow-200 to-amber-500',
      icon: Building2,
      theme: 'Golden Foundations',
    },
  },
  33: {
    archetype: 'The Orchestrator',
    description: 'The essence of strategic guidance and utility.',
    persona: 'Operator',
    traits: ['Guidance', 'Healing', 'Utility'],
    style: {
      gradient: 'from-cyan-400 to-blue-500',
      accent: 'text-cyan-200',
      textGradient: 'from-cyan-100 to-blue-100',
      icon: Lightbulb,
      theme: 'Pure Clarity',
    },
  },
};

export function calculateNameNumber(name: string): NumerologyResult {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;

  for (let char of cleanName) {
    sum += LETTER_MAP[char] || 0;
  }

  // Reduce to single digit or master number
  let current = sum;
  while (current > 9 && ![11, 22, 33].includes(current)) {
    current = current
      .toString()
      .split('')
      .reduce((acc, val) => acc + parseInt(val), 0);
  }

  // Fallback to 9 if something weird happens, though loop should catch it
  const meaning = NUMBER_MEANINGS[current] || NUMBER_MEANINGS[9];

  return {
    number: current,
    ...meaning,
  };
}
