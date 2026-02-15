/**
 * Responsive Layout Components
 * Mobile-first responsive utilities
 * Day 4: UI Polish + Integration
 */

"use client"

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"

// Breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

type Breakpoint = keyof typeof breakpoints

// Hook to detect screen size
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Breakpoint hooks
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`)
}

export function useIsTablet(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`)
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
}

export function useBreakpoint(): Breakpoint {
  const isSm = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`)
  const isMd = useMediaQuery(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`)
  const isLg = useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`)
  const isXl = useMediaQuery(`(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`)

  if (isSm) return 'sm'
  if (isMd) return 'md'
  if (isLg) return 'lg'
  if (isXl) return 'xl'
  return '2xl'
}

// Mobile Navigation Context
interface MobileNavContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const MobileNavContext = createContext<MobileNavContextType>({
  isOpen: false,
  toggle: () => {},
  open: () => {},
  close: () => {}
})

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  // Close nav when switching to desktop
  useEffect(() => {
    if (!isMobile) setIsOpen(false)
  }, [isMobile])

  // Prevent body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <MobileNavContext.Provider value={{
      isOpen,
      toggle: () => setIsOpen(prev => !prev),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }}>
      {children}
    </MobileNavContext.Provider>
  )
}

export function useMobileNav() {
  return useContext(MobileNavContext)
}

// Mobile Header with hamburger
interface MobileHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
}

export function MobileHeader({ title, subtitle, showBack, onBack, rightAction }: MobileHeaderProps) {
  const { toggle } = useMobileNav()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <button 
              onClick={toggle}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {rightAction}
      </div>
    </header>
  )
}

// Mobile Slide-Out Navigation
interface MobileNavDrawerProps {
  children: ReactNode
}

export function MobileNavDrawer({ children }: MobileNavDrawerProps) {
  const { isOpen, close } = useMobileNav()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D7A3E] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IW</span>
            </div>
            <span className="font-semibold text-gray-900">IntegrateWise</span>
          </div>
          <button 
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </>
  )
}

// Collapsible Sidebar (desktop)
interface CollapsibleSidebarProps {
  children: ReactNode
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function CollapsibleSidebar({ children, collapsed = false, onCollapsedChange }: CollapsibleSidebarProps) {
  return (
    <aside className={`
      hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  )
}

// Responsive Grid
interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 }, 
  gap = 4,
  className = ""
}: ResponsiveGridProps) {
  const colClasses = [
    cols.sm ? `grid-cols-${cols.sm}` : 'grid-cols-1',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={`grid ${colClasses} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Stack (flex column on mobile, row on desktop)
interface ResponsiveStackProps {
  children: ReactNode
  direction?: 'row' | 'column'
  breakpoint?: Breakpoint
  gap?: number
  className?: string
}

export function ResponsiveStack({
  children,
  direction = 'row',
  breakpoint = 'md',
  gap = 4,
  className = ""
}: ResponsiveStackProps) {
  const directionClass = direction === 'row'
    ? `flex-col ${breakpoint}:flex-row`
    : `flex-row ${breakpoint}:flex-col`

  return (
    <div className={`flex ${directionClass} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

// Hide/Show components based on breakpoint
interface ResponsiveShowProps {
  children: ReactNode
  above?: Breakpoint
  below?: Breakpoint
}

export function ResponsiveShow({ children, above, below }: ResponsiveShowProps) {
  if (above) {
    const breakpointClass = `hidden ${above}:block`
    return <div className={breakpointClass}>{children}</div>
  }
  if (below) {
    const breakpointClass = `${below}:hidden`
    return <div className={breakpointClass}>{children}</div>
  }
  return <>{children}</>
}

// Responsive Table (scrollable on mobile)
interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className = "" }: ResponsiveTableProps) {
  return (
    <div className={`overflow-x-auto -mx-4 md:mx-0 ${className}`}>
      <div className="min-w-[640px] md:min-w-0 px-4 md:px-0">
        {children}
      </div>
    </div>
  )
}

// Mobile Bottom Sheet
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sheet */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transform transition-transform duration-300 ease-in-out max-h-[85vh] overflow-hidden md:hidden
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="px-4 pb-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-60px)] p-4">
          {children}
        </div>
      </div>
    </>
  )
}

// Touch-friendly action button row
interface ActionRowProps {
  children: ReactNode
  className?: string
}

export function ActionRow({ children, className = "" }: ActionRowProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto py-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap ${className}`}>
      {children}
    </div>
  )
}

// Touch-optimized button
interface TouchButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  className?: string
  disabled?: boolean
}

export function TouchButton({ 
  children, 
  onClick, 
  variant = 'secondary', 
  size = 'md', 
  icon,
  className = "",
  disabled = false
}: TouchButtonProps) {
  const variantClasses = {
    primary: 'bg-[#2D7A3E] text-white hover:bg-[#236B32] active:bg-[#1A5025]',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[44px]', // 44px is recommended touch target
    lg: 'px-6 py-3 text-base min-h-[52px]'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors touch-manipulation
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  )
}

export default {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  MobileNavProvider,
  useMobileNav,
  MobileHeader,
  MobileNavDrawer,
  CollapsibleSidebar,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveShow,
  ResponsiveTable,
  BottomSheet,
  ActionRow,
  TouchButton
}
