"use client"

export const runtime = 'edge';

/**
 * Embeddable Testimonials Widget for Webflow
 * 
 * Usage in Webflow:
 * <iframe src="https://app.integratewise.ai/embed/testimonials?theme=light&layout=carousel" />
 */

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "VP of Operations",
    company: "TechScale Inc",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "IntegrateWise reduced our manual data entry by 85%. What used to take our team 20 hours a week now happens automatically.",
    metrics: { timeSaved: "20hrs/week", roi: "340%" },
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "CTO",
    company: "Finova Solutions",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "The AI-powered insights helped us identify a churn risk pattern we never would have caught manually. Saved us $2M in potential lost revenue.",
    metrics: { revenueSaved: "$2M", accuracy: "94%" },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Head of Customer Success",
    company: "CloudFirst",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "Our team finally has a single source of truth. No more hunting through 15 different tools to get a complete picture of a customer.",
    metrics: { toolsConsolidated: "15→1", nps: "+45" },
  },
  {
    id: 4,
    name: "David Kim",
    title: "Revenue Operations Lead",
    company: "ScaleUp Labs",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "Implementation took 2 days, not 2 months. The pre-built connectors and AI setup made it seamless.",
    metrics: { setupTime: "2 days", integrations: "50+" },
  },
]

function TestimonialsContent() {
  const searchParams = useSearchParams()
  const theme = searchParams.get("theme") || "light"
  const layout = searchParams.get("layout") || "carousel"
  const isDark = theme === "dark"

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (layout === "carousel") {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [layout])

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  )

  if (layout === "grid") {
    return (
      <div className={cn(
        "p-6",
        isDark ? "bg-gray-900" : "bg-white"
      )}>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={cn(
                "p-6 rounded-xl",
                isDark ? "bg-gray-800" : "bg-gray-50"
              )}
            >
              <Quote className={cn(
                "h-8 w-8 mb-4",
                isDark ? "text-blue-400" : "text-blue-500"
              )} />
              <p className={cn(
                "text-sm mb-4",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className={cn(
                    "text-xs",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {t.title}, {t.company}
                  </div>
                </div>
              </div>
              {renderStars(t.rating)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Carousel layout (default)
  const current = testimonials[activeIndex]

  return (
    <div className={cn(
      "p-8",
      isDark ? "bg-gray-900" : "bg-white"
    )}>
      <div className="max-w-3xl mx-auto">
        <div className={cn(
          "relative p-8 rounded-2xl",
          isDark ? "bg-gray-800" : "bg-gray-50"
        )}>
          <Quote className={cn(
            "absolute top-4 left-4 h-12 w-12 opacity-20",
            isDark ? "text-blue-400" : "text-blue-500"
          )} />

          <div className="text-center">
            <p className={cn(
              "text-lg md:text-xl mb-6 relative z-10",
              isDark ? "text-gray-200" : "text-gray-800"
            )}>
              "{current.quote}"
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
                {current.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-semibold">{current.name}</div>
                <div className={cn(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  {current.title}, {current.company}
                </div>
                {renderStars(current.rating)}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex justify-center gap-6 mt-6">
              {Object.entries(current.metrics).map(([key, value]) => (
                <div key={key} className={cn(
                  "px-4 py-2 rounded-lg",
                  isDark ? "bg-gray-700" : "bg-white"
                )}>
                  <div className="text-xl font-bold text-blue-500">{value}</div>
                  <div className={cn(
                    "text-xs capitalize",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors",
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors",
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                idx === activeIndex
                  ? "bg-blue-500"
                  : isDark ? "bg-gray-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-gray-400">Loading testimonials...</div>
    </div>
  )
}

export default function EmbedTestimonials() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TestimonialsContent />
    </Suspense>
  )
}
