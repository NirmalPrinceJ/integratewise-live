import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IntegrateWise - One Workspace for All Your Tools",
  description:
    "Stop juggling 15 apps. IntegrateWise unifies Notion, Slack, Calendar, CRM, and more into one intelligent workspace with AI-powered insights.",
  keywords: ["productivity", "integration", "workspace", "AI", "automation", "SaaS", "tools"],
  authors: [{ name: "IntegrateWise" }],
  openGraph: {
    title: "IntegrateWise - One Workspace for All Your Tools",
    description: "Your AI-powered digital workspace that unifies all your tools.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IntegrateWise",
    description: "One workspace. All your tools.",
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
