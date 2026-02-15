/**
 * Error Boundaries
 * Graceful error handling components
 * Day 4: UI Polish + Integration
 */

"use client"

import React, { Component, ErrorInfo, ReactNode, useState } from "react"
import { 
  AlertTriangle, 
  RefreshCcw, 
  ChevronDown, 
  ChevronUp, 
  Bug, 
  WifiOff, 
  ServerCrash, 
  Clock, 
  FileQuestion,
  Home,
  ArrowLeft,
  Copy,
  Check,
  Mail
} from "lucide-react"

// Error types
export type ErrorType = 'unknown' | 'network' | 'server' | 'timeout' | 'notfound' | 'permission' | 'validation'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// Class-based Error Boundary (required for React error boundaries)
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

// Error Fallback Component
interface ErrorFallbackProps {
  error: Error | null
  errorInfo?: ErrorInfo | null
  onRetry?: () => void
  errorType?: ErrorType
}

export function ErrorFallback({ error, errorInfo, onRetry, errorType = 'unknown' }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const getErrorConfig = () => {
    switch (errorType) {
      case 'network':
        return {
          icon: WifiOff,
          title: "Connection lost",
          description: "Unable to connect to the server. Please check your internet connection and try again."
        }
      case 'server':
        return {
          icon: ServerCrash,
          title: "Server error",
          description: "Something went wrong on our end. Our team has been notified and we're working on it."
        }
      case 'timeout':
        return {
          icon: Clock,
          title: "Request timeout",
          description: "The request took too long to complete. This might be due to a slow connection or high server load."
        }
      case 'notfound':
        return {
          icon: FileQuestion,
          title: "Not found",
          description: "The resource you're looking for doesn't exist or may have been moved."
        }
      case 'permission':
        return {
          icon: AlertTriangle,
          title: "Access denied",
          description: "You don't have permission to access this resource. Contact your administrator if you need access."
        }
      case 'validation':
        return {
          icon: AlertTriangle,
          title: "Invalid data",
          description: "The data provided is invalid. Please check your input and try again."
        }
      default:
        return {
          icon: Bug,
          title: "Something went wrong",
          description: "An unexpected error occurred. We've been notified and are looking into it."
        }
    }
  }

  const config = getErrorConfig()
  const Icon = config.icon

  const errorDetails = `Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'Not available'}`

  const handleCopyError = async () => {
    await navigator.clipboard.writeText(errorDetails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{config.description}</p>
      
      <div className="flex items-center gap-3 mb-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#236B32] transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </button>
      </div>

      {error && (
        <div className="w-full max-w-lg">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Details
              </>
            )}
          </button>

          {showDetails && (
            <div className="mt-4 bg-gray-900 rounded-xl p-4 text-left overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-mono">Error Details</span>
                <button
                  onClick={handleCopyError}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap break-all mt-2 max-h-48 overflow-y-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Inline Error Component (for smaller areas)
interface InlineErrorProps {
  message: string
  onRetry?: () => void
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  )
}

// Card Error Component (for individual cards/sections)
interface CardErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function CardError({ title = "Failed to load", message = "Unable to load this content", onRetry }: CardErrorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw className="w-3 h-3" />
          Try Again
        </button>
      )}
    </div>
  )
}

// Full Page Error (for 404, 500, etc.)
interface PageErrorProps {
  statusCode?: number
  title?: string
  description?: string
  showGoBack?: boolean
  showGoHome?: boolean
  showReportButton?: boolean
}

export function PageError({ 
  statusCode, 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
  showGoBack = true,
  showGoHome = true,
  showReportButton = false
}: PageErrorProps) {
  const getDefaultConfig = () => {
    switch (statusCode) {
      case 404:
        return {
          icon: FileQuestion,
          title: "Page not found",
          description: "The page you're looking for doesn't exist or has been moved."
        }
      case 403:
        return {
          icon: AlertTriangle,
          title: "Access denied",
          description: "You don't have permission to access this page."
        }
      case 500:
        return {
          icon: ServerCrash,
          title: "Server error",
          description: "Something went wrong on our end. Our team has been notified."
        }
      case 503:
        return {
          icon: Clock,
          title: "Service unavailable",
          description: "We're currently undergoing maintenance. Please try again soon."
        }
      default:
        return { icon: Bug, title, description }
    }
  }

  const config = getDefaultConfig()
  const Icon = config.icon

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-red-500" />
      </div>
      
      {statusCode && (
        <span className="text-6xl font-bold text-gray-200 mb-4">{statusCode}</span>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{config.title}</h1>
      <p className="text-gray-500 max-w-md text-center mb-8">{config.description}</p>
      
      <div className="flex items-center gap-3">
        {showGoBack && (
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
        {showGoHome && (
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#236B32] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        )}
        {showReportButton && (
          <button
            onClick={() => window.location.href = 'mailto:connect@integratewise.co'}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Report Issue
          </button>
        )}
      </div>
    </div>
  )
}

// Hook for managing loading/error states
export function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async (asyncFn: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setLoading(false)
    setError(null)
  }

  return { data, loading, error, execute, reset }
}

export default {
  ErrorBoundary,
  ErrorFallback,
  InlineError,
  CardError,
  PageError,
  useAsyncState
}
