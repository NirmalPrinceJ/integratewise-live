/**
 * IntegrateWise Color Palette
 * Blue-Teal Dark Atmospheric System
 * 
 * Primary: Sky Blue (#0EA5E9)
 * Accent: Teal (#14B8A6)
 * Dark Base: Navy Black (#0C1222)
 */

// ============================================================================
// PRIMARY COLORS - Blue-Teal System
// ============================================================================

export const COLORS = {
  // Primary Blue (Sky Blue)
  primary: '#0EA5E9',
  primaryLight: '#38BDF8',
  primaryDark: '#0284C7',
  
  // Accent Teal
  accent: '#14B8A6',
  accentLight: '#2DD4BF',
  accentDark: '#0D9488',
  
  // Dark Base
  darkBase: '#0C1222',
  darkSecondary: '#1A2332',
  darkTertiary: '#2A3342',
  
  // Neutral Grays (matching dark theme)
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  
  // Semantic Colors
  success: '#00C853',
  warning: '#FFB020',
  danger: '#FF4757',
  info: '#0EA5E9',
  
  // Brand Accent Colors
  pink: '#F54476',
  purple: '#7B5EA7',
  orange: '#D4883E',
  
  // White & Black
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ============================================================================
// LEGACY COLOR MAPPING (for migration reference)
// ============================================================================

export const LEGACY_COLORS = {
  oldBlue: '#3F5185',      // → COLORS.primary (#0EA5E9)
  oldNavy: '#1E2A4A',      // → COLORS.darkBase (#0C1222)
  oldGradientEnd: '#344573', // → Use with COLORS.primaryDark
} as const;

// ============================================================================
// CONTEXTUAL COLOR MAPPINGS
// ============================================================================

export const UI_COLORS = {
  // Sidebar & Navigation
  sidebarBg: COLORS.darkBase,
  sidebarText: COLORS.white,
  sidebarActive: COLORS.white,
  sidebarActiveBg: COLORS.white,
  sidebarActiveText: COLORS.darkBase,
  
  // Buttons & Interactive
  buttonPrimary: COLORS.primary,
  buttonPrimaryHover: COLORS.primaryDark,
  buttonSecondary: COLORS.accent,
  buttonSecondaryHover: COLORS.accentDark,
  
  // Text Colors
  textPrimary: COLORS.darkBase,
  textSecondary: COLORS.gray600,
  textMuted: COLORS.gray500,
  textLight: COLORS.white,
  
  // Borders & Dividers
  border: COLORS.gray200,
  borderLight: COLORS.gray100,
  borderDark: COLORS.gray300,
  
  // Backgrounds
  bgWhite: COLORS.white,
  bgLight: COLORS.gray50,
  bgCard: COLORS.white,
  bgDark: COLORS.darkBase,
  bgDarkSecondary: COLORS.darkSecondary,
  
  // Accents & Highlights
  accent: COLORS.primary,
  accentLight: `${COLORS.primary}1A`, // 10% opacity
  accentMedium: `${COLORS.primary}33`, // 20% opacity
  
  // Status & Feedback
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  info: COLORS.info,
} as const;

// ============================================================================
// TAILWIND-COMPATIBLE COLORS (for className strings)
// ============================================================================

export const TW_COLORS = {
  // Primary
  primary: '[#0EA5E9]',
  primaryLight: '[#38BDF8]',
  primaryDark: '[#0284C7]',
  
  // Accent
  accent: '[#14B8A6]',
  accentLight: '[#2DD4BF]',
  accentDark: '[#0D9488]',
  
  // Dark Base
  darkBase: '[#0C1222]',
  darkSecondary: '[#1A2332]',
  darkTertiary: '[#2A3342]',
  
  // Semantic
  success: '[#00C853]',
  warning: '[#FFB020]',
  danger: '[#FF4757]',
  pink: '[#F54476]',
  purple: '[#7B5EA7]',
  orange: '[#D4883E]',
} as const;

// ============================================================================
// GRADIENT DEFINITIONS
// ============================================================================

export const GRADIENTS = {
  primaryToDark: `from-${TW_COLORS.primary} to-${TW_COLORS.darkBase}`,
  primaryToAccent: `from-${TW_COLORS.primary} to-${TW_COLORS.accent}`,
  darkVertical: `from-${TW_COLORS.darkBase} via-${TW_COLORS.purple} to-${TW_COLORS.orange}`,
  heroGradient: `from-${TW_COLORS.primary} to-${TW_COLORS.accentDark}`,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Add opacity to a hex color
 * @param hex - Hex color (e.g., '#0EA5E9')
 * @param opacity - Opacity value 0-100
 * @returns Hex color with opacity suffix
 */
export function withOpacity(hex: string, opacity: number): string {
  const opacityHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
  return `${hex}${opacityHex}`;
}

/**
 * Get Tailwind class string for background color
 */
export function bgColor(color: keyof typeof TW_COLORS): string {
  return `bg-${TW_COLORS[color]}`;
}

/**
 * Get Tailwind class string for text color
 */
export function textColor(color: keyof typeof TW_COLORS): string {
  return `text-${TW_COLORS[color]}`;
}

/**
 * Get Tailwind class string for border color
 */
export function borderColor(color: keyof typeof TW_COLORS): string {
  return `border-${TW_COLORS[color]}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default COLORS;
