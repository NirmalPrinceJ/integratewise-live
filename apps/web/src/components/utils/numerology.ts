export interface NumerologyResult {
  nameNumber?: number;
  destinyNumber?: number;
  soulNumber?: number;
  interpretation?: string;
  number?: number;
  archetype?: string;
  description?: string;
  traits?: string[];
  persona?: string;
  style?: {
    gradient?: string;
    icon?: any;
    theme?: string;
    textGradient?: string;
  };
}

export interface IntegrateWisePersona {
  name: string;
  role: string;
  archetype: string;
  numerologyScore: number;
  traits: string[];
}

/**
 * Calculate numerology number from string
 * Uses simple sum of character codes modulo 9
 */
export function calculateNameNumber(name: string): NumerologyResult {
  if (!name || name.length === 0) {
    return {
      nameNumber: 1,
      number: 1,
      archetype: 'Innovator',
      description: 'Leader, innovative, independent',
      traits: ['Leader', 'Innovative', 'Independent'],
      persona: 'Innovator',
      style: {
        gradient: 'from-iw-indigo to-iw-navy',
        theme: 'Leadership',
        textGradient: 'from-iw-gold to-iw-indigo',
      },
    };
  }

  const normalized = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  if (normalized.length === 0) {
    return {
      nameNumber: 1,
      number: 1,
      archetype: 'Innovator',
      description: 'Leader, innovative, independent',
      traits: ['Leader', 'Innovative', 'Independent'],
      persona: 'Innovator',
      style: {
        gradient: 'from-iw-indigo to-iw-navy',
        theme: 'Leadership',
        textGradient: 'from-iw-gold to-iw-indigo',
      },
    };
  }

  let sum = 0;
  for (const char of normalized) {
    sum += char.charCodeAt(0) - 64; // A=1, B=2, etc.
  }

  let result = sum;
  while (result > 9) {
    result = Math.floor(result / 10) + (result % 10);
  }

  const number = result || 9;
  const archetypes = [
    'Innovator',
    'Builder',
    'Creator',
    'Organizer',
    'Adventurer',
    'Harmonizer',
    'Seeker',
    'Leader',
    'Visionary',
  ];
  const archetype = archetypes[number - 1];
  const description = getNumerologyInterpretation(number);

  const gradients = [
    'from-iw-indigo to-iw-navy',
    'from-emerald-600 to-teal-700',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-purple-600 to-violet-700',
    'from-lime-500 to-green-600',
    'from-yellow-500 to-amber-600',
    'from-fuchsia-500 to-purple-600',
  ];

  const textGradients = [
    'from-iw-gold to-iw-indigo',
    'from-emerald-200 to-teal-300',
    'from-amber-200 to-orange-300',
    'from-rose-200 to-pink-300',
    'from-cyan-200 to-blue-300',
    'from-purple-200 to-violet-300',
    'from-lime-200 to-green-300',
    'from-yellow-200 to-amber-300',
    'from-fuchsia-200 to-purple-300',
  ];

  return {
    nameNumber: number,
    destinyNumber: number,
    soulNumber: number,
    interpretation: description,
    number,
    archetype,
    description,
    traits: [description],
    persona: archetype,
    style: {
      gradient: gradients[number - 1],
      theme: archetype,
      textGradient: textGradients[number - 1],
    },
  };
}

// Keep the old function for backward compatibility
export function calculateNameNumberOld(name: string): number {
  if (!name || name.length === 0) return 1;

  const normalized = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  if (normalized.length === 0) return 1;

  let sum = 0;
  for (const char of normalized) {
    sum += char.charCodeAt(0) - 64; // A=1, B=2, etc.
  }

  let result = sum;
  while (result > 9) {
    result = Math.floor(result / 10) + (result % 10);
  }

  return result || 9;
}

/**
 * Get numerology interpretation
 */
export function getNumerologyInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: 'Leader, innovative, independent',
    2: 'Diplomat, cooperative, sensitive',
    3: 'Creative, communicative, expressive',
    4: 'Practical, stable, organized',
    5: 'Adventurous, dynamic, versatile',
    6: 'Nurturing, responsible, balanced',
    7: 'Analytical, spiritual, introspective',
    8: 'Ambitious, powerful, successful',
    9: 'Compassionate, humanitarian, idealistic',
  };

  return interpretations[number] || 'Unknown';
}

/**
 * Calculate destiny number (simplified)
 */
export function calculateDestinyNumber(birthDate: string): number {
  const date = new Date(birthDate);
  const sum = date.getDate() + (date.getMonth() + 1) + date.getFullYear();

  let result = sum;
  while (result > 9) {
    result = Math.floor(result / 10) + (result % 10);
  }

  return result || 9;
}

/**
 * Assess IntegrateWise persona
 */
export function assessPersona(name: string, role: string): IntegrateWisePersona {
  const nameNumberResult = calculateNameNumber(name);
  const nameNumber = typeof nameNumberResult === 'number' ? nameNumberResult : (nameNumberResult.number || 1);
  const archetypes = [
    'Innovator',
    'Builder',
    'Creator',
    'Organizer',
    'Adventurer',
    'Harmonizer',
    'Seeker',
    'Leader',
    'Visionary',
  ];

  return {
    name,
    role,
    archetype: archetypes[nameNumber - 1] || 'Innovator',
    numerologyScore: nameNumber,
    traits: [
      getNumerologyInterpretation(nameNumber),
      `Role: ${role}`,
      'IntegrateWise user',
    ].filter(Boolean),
  };
}
