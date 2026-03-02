/**
 * IntegrateWise Unified Router
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ COMPLETE ROUTING TABLE                                         │
 * ├──────────────────────────┬──────────────────────────────────────┤
 * │ Route                    │ Component / Purpose                  │
 * ├──────────────────────────┼──────────────────────────────────────┤
 * │ MARKETING (Public)       │                                      │
 * │ /                        │ HomePage — landing hero + CTAs       │
 * │ /platform                │ PlatformPage — product deep-dive     │
 * │ /who-its-for             │ WhoItsForPage — audience segments    │
 * │ /pricing                 │ PricingPage — tiers + CTAs           │
 * │ /security                │ SecurityPage — security & governance │
 * │ /story                   │ StoryPage — founder story            │
 * │ /integrations            │ IntegrationsPage — 200+ tools        │
 * │ /login                   │ MarketingLoginPage — public login    │
 * ├──────────────────────────┼──────────────────────────────────────┤
 * │ APP (Authenticated)      │ Lazy-loaded AppShell                 │
 * │ /app/*                   │ AppShell (stages below)              │
 * │  → stage: login          │ LoginPage — email/SSO                │
 * │  → stage: signup         │ SignUpPage — registration            │
 * │  → stage: onboarding     │ OnboardingFlowNew — 4-step setup     │
 * │  → stage: loading        │ LoaderPhase1 — data hydration        │
 * │  → stage: workspace      │ WorkspaceShellNew — main workspace   │
 * ├──────────────────────────┼──────────────────────────────────────┤
 * │ OAUTH                    │                                      │
 * │ /oauth/callback/:provider│ OAuthCallbackPage — provider redirect│
 * ├──────────────────────────┼──────────────────────────────────────┤
 * │ CATCH-ALL                │                                      │
 * │ *                        │ NotFound — 404 page                  │
 * └──────────────────────────┴──────────────────────────────────────┘
 *
 * CTA Routing:
 *   All "Start Free" / "Sign In" CTAs → /app
 *   Pricing tier CTAs → /app?plan={tier} or /app?intent=contact_sales
 *   OAuth success → /app/workspace?tab=integrations&connected={provider}
 *   OAuth error → /app/workspace?tab=integrations&error={error}
 *   404 "Back to Home" → /
 *   404 "Explore Platform" → /platform
 *
 * Navigation:
 *   Header: / /platform /who-its-for /pricing /integrations /security /story
 *   Footer: /platform /integrations /pricing /security /story /who-its-for /login
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
