/**
 * Platform Detection & Integration
 * 
 * Detects current platform (web, desktop, mobile) and provides
 * appropriate Supabase client configuration.
 */

export type Platform = 'web' | 'desktop' | 'mobile' | 'unknown'

/**
 * Detect current platform
 */
export function detectPlatform(): Platform {
  // Check for Electron
  if (typeof window !== 'undefined' && window.electronAPI) {
    return 'desktop'
  }
  
  // Check for React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'mobile'
  }
  
  // Check for Expo
  if (typeof global !== 'undefined' && (global as any).expo) {
    return 'mobile'
  }
  
  // Browser
  if (typeof window !== 'undefined') {
    return 'web'
  }
  
  return 'unknown'
}

/**
 * Check if running as PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

/**
 * Check if running in Electron
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI
}

/**
 * Get Electron storage (if available)
 */
export function getElectronStorage() {
  if (!isElectron()) return null
  return window.electronAPI!.storage
}

/**
 * Platform info object
 */
export const platform = {
  detect: detectPlatform,
  isPWA,
  isElectron,
  getElectronStorage,
  get current(): Platform {
    return detectPlatform()
  },
  get isWeb(): boolean {
    return detectPlatform() === 'web'
  },
  get isDesktop(): boolean {
    return detectPlatform() === 'desktop'
  },
  get isMobile(): boolean {
    return detectPlatform() === 'mobile'
  },
}

// Type augmentation for Electron API
declare global {
  interface Window {
    electronAPI?: {
      storage: {
        getItem: (key: string) => Promise<string | null>
        setItem: (key: string, value: string) => Promise<void>
        removeItem: (key: string) => Promise<void>
      }
      platform: string
      version: string
    }
  }
}
