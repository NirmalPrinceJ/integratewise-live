"use client"

import { useCallback, useState } from "react"
import { toast as sonnerToast } from "sonner"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  title?: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const { title, description, type = "info", duration = 3000 } = options
    
    switch (type) {
      case "success":
        sonnerToast.success(title, { description, duration })
        break
      case "error":
        sonnerToast.error(title, { description, duration })
        break
      case "warning":
        sonnerToast.warning(title, { description, duration })
        break
      default:
        sonnerToast(title, { description, duration })
    }
    
    setToasts((prev) => [...prev, options])
  }, [])

  return { toast, toasts }
}

export { sonnerToast as toast }
