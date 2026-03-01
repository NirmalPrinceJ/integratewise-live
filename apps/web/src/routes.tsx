/**
 * IntegrateWise Unified Router
 *
 * Route Architecture:
 *   /                    → Marketing site (Dir 1: Anti-Gravity design)
 *   /platform            → Platform deep-dive
 *   /who-its-for         → Audience segmentation
 *   /pricing             → Pricing tiers
 *   /security            → Security & governance
 *   /story               → Founder story
 *   /integrations        → 200+ tool integrations
 *   /app                 → Authenticated workspace (Dir 2: workspace shell)
 *   /app/login            → Login page
 *   /app/signup           → Signup page
 *   /app/onboarding       → 4-step onboarding
 *   /app/workspace        → Main workspace (post-auth)
 *
 * Infrastructure:
 *   Frontend: Cloudflare Pages (Vite static build)
 *   Backend:  Cloudflare Workers (Gateway → Pipeline → Intelligence → BFF)
 *   Auth:     Supabase Auth (Google SSO, GitHub SSO, email/password)
 *   Secrets:  Doppler (189+ secrets across environments)
 */

import { createBrowserRouter } from "react-router";
import React from "react";

// === MARKETING PAGES (from Dir 1: Design System SaaS Landing Page) ===
import { Layout as MarketingLayout } from "@/components/landing/Layout";
import { HomePage } from "@/components/landing/HomePage";
import { PlatformPage } from "@/components/landing/PlatformPage";
import { WhoItsForPage } from "@/components/landing/WhoItsForPage";
import { PricingPage } from "@/components/landing/PricingPage";
import { SecurityPage } from "@/components/landing/SecurityPage";
import { StoryPage } from "@/components/landing/StoryPage";
import { IntegrationsPage } from "@/components/landing/IntegrationsPage";
import { LoginPage as MarketingLoginPage } from "@/components/landing/LoginPage";
import { NotFound } from "@/components/landing/NotFound";

// === APP SHELL (from Dir 2: IntegrateWise Business Operations Design) ===
// Lazy-loaded for code splitting — marketing site loads instantly
const AppShell = React.lazy(() => import("@/AppShell"));
const OAuthCallbackPage = React.lazy(() => import("@/components/connectors/oauth-callback"));

export const router = createBrowserRouter([
  // ─── Marketing Site ────────────────────────────────────────
  {
    path: "/",
    Component: MarketingLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "platform", Component: PlatformPage },
      { path: "who-its-for", Component: WhoItsForPage },
      { path: "pricing", Component: PricingPage },
      { path: "security", Component: SecurityPage },
      { path: "story", Component: StoryPage },
      { path: "integrations", Component: IntegrationsPage },
      { path: "login", Component: MarketingLoginPage },
    ],
  },

  // ─── Application (Authenticated Workspace) ─────────────────
  {
    path: "/app/*",
    element: (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#0C1222] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/60 text-sm">Loading IntegrateWise...</p>
            </div>
          </div>
        }
      >
        <AppShell />
      </React.Suspense>
    ),
  },

  // ─── OAuth Callback (provider redirects here) ──────────────────
  {
    path: "/oauth/callback/:provider",
    element: (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#0C1222] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OAuthCallbackPage />
      </React.Suspense>
    ),
  },

  // ─── 404 Catch-all ─────────────────────────────────────────
  {
    path: "*",
    Component: NotFound,
  },
]);
