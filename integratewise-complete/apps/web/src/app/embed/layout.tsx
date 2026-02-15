/**
 * Embed Layout - Minimal layout for Webflow iframes
 * No auth required, CORS enabled, minimal styling
 */

import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "IntegrateWise Embed",
  robots: "noindex, nofollow",
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-transparent font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
