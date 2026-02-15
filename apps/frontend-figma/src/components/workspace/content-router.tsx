/**
 * Content Router
 * 
 * Maps domains and module IDs to existing component files via Role-Domain Module Registries.
 * Implements lazy loading + data density scoring per spec Section 6.
 * 
 * "Normalize Once, Render Anywhere" — content components are domain-agnostic,
 * router provides domain-specific data context.
 * 
 * ARCHITECTURE: All import paths are centralized in the role-domain/<domain>/modules.ts registries.
 * This file only maps (domain, moduleId) → registry export. Import path changes only
 * need to happen in the modules.ts files, not here.
 * 
 * CRITICAL FIX: React.lazy requires default exports.
 * All existing components use NAMED exports, so we wrap each import
 * to re-export the first function as default. Lazy components are
 * cached in a Map to avoid re-creating them on every render.
 */

import React, { Suspense } from "react";
import type { Domain } from "./workspace-config";
import { shouldRenderModule, getEmptyStateMessage, type ModuleData } from "./data-density-scorer";

// ─── Role-Domain Module Registries ──────────────────────────────────────────
import * as csModules from "../onboarding/role-domain/account-success/modules";
import * as salesModules from "../onboarding/role-domain/salesops/modules";
import * as revopsModules from "../onboarding/role-domain/revops/modules";
import * as bizopsModules from "../onboarding/role-domain/business-ops/modules";
import * as marketingModules from "../onboarding/role-domain/marketing/modules";

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-white/5 rounded w-1/3" />
      <div className="h-32 bg-white/5 rounded" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full p-12">
      <div className="text-center space-y-3 max-w-md">
        <div className="text-slate-400 text-sm">{message}</div>
        <div className="text-xs text-slate-500">
          This module will appear automatically once sufficient data is available
        </div>
      </div>
    </div>
  );
}

// ─── HELPER: Wrap named-export module for React.lazy ────────────────────────

/**
 * React.lazy requires `{ default: Component }`.
 * Our components export named functions (e.g. `export function SalesDashboard`).
 * This wrapper finds the first exported React component and re-exports it as default.
 */
function wrapNamedExport(loader: () => Promise<any>): () => Promise<{ default: React.ComponentType<any> }> {
  return () =>
    loader().then((mod) => {
      // If there's already a default export, use it
      if (mod.default) return mod;
      // Otherwise pick the first exported function (React component)
      const component = Object.values(mod).find(
        (v) => typeof v === "function"
      ) as React.ComponentType<any> | undefined;
      if (!component) {
        // Fallback: return a placeholder
        return { default: () => React.createElement("div", { className: "p-6 text-slate-400" }, "Component not found in module") };
      }
      return { default: component };
    });
}

// ─── LAZY COMPONENT CACHE ───────────────────────────────────────────────────
// React.lazy must NOT be called inside render. We cache lazy wrappers here.

const lazyCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

function getLazyComponent(
  cacheKey: string,
  loader: () => Promise<any>
): React.LazyExoticComponent<React.ComponentType<any>> {
  if (!lazyCache.has(cacheKey)) {
    lazyCache.set(cacheKey, React.lazy(wrapNamedExport(loader)));
  }
  return lazyCache.get(cacheKey)!;
}

// ─── DOMAIN CONTENT MAP (Registry-Backed) ──────────────────────────────────
//
// Each entry maps moduleId → loader function from the role-domain registries.
// Import paths live ONLY in the modules.ts files. Content-router never uses
// raw import() — it delegates to registry exports.

const DOMAIN_CONTENT_MAP: Record<Domain, Record<string, () => Promise<any>>> = {
  // ─── CUSTOMER SUCCESS ─────────────────────────────────────────────────────
  CUSTOMER_SUCCESS: {
    dashboard:               csModules.dashboard,
    accounts:                csModules.accounts,
    contacts:                csModules.contacts,
    "health-scores":         csModules.healthScores,
    meetings:                csModules.meetings,
    tasks:                   csModules.tasks,
    touchpoints:             csModules.engagementLog,
    expansion:               csModules.valueStreams,
    renewals:                csModules.successPlans,
    risks:                   csModules.riskRegister,
    // Deep views
    "account-master":        csModules.accountMaster,
    "api-portfolio":         csModules.apiPortfolio,
    "business-context":      csModules.businessContext,
    capabilities:            csModules.capabilities,
    "company-growth":        csModules.companyGrowth,
    initiatives:             csModules.initiatives,
    insights:                csModules.insights,
    "people-team":           csModules.peopleTeam,
    "product-client":        csModules.productClient,
    "stakeholder-outcomes":  csModules.stakeholderOutcomes,
    "strategic-objectives":  csModules.strategicObjectives,
    "task-manager":          csModules.taskManager,
    // Fabric Admin (system-wide)
    "fabric-admin":          bizopsModules.fabricAdmin,
  },

  // ─── SALES ────────────────────────────────────────────────────────────────
  SALES: {
    dashboard:    salesModules.dashboard,
    pipeline:     salesModules.pipeline,
    deals:        salesModules.deals,
    accounts:     salesModules.contacts,
    contacts:     salesModules.contacts,
    activities:   salesModules.activities,
    meetings:     salesModules.activities,
    forecasting:  salesModules.forecasting,
    quotes:       salesModules.quotes,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── MARKETING ────────────────────────────────────────────────────────────
  MARKETING: {
    dashboard:    marketingModules.dashboard,
    campaigns:    marketingModules.campaigns,
    leads:        marketingModules.forms,
    analytics:    marketingModules.attribution,
    email:        marketingModules.emailStudio,
    social:       marketingModules.social,
    blog:         marketingModules.blog,
    website:      marketingModules.websiteDashboard,
    attribution:  marketingModules.attribution,
    forms:        marketingModules.forms,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── REVOPS ───────────────────────────────────────────────────────────────
  REVOPS: {
    dashboard:    revopsModules.dashboard,
    revenue:      revopsModules.revopsViews,
    pipeline:     revopsModules.revopsViews,
    forecasting:  revopsModules.revopsViews,
    territories:  revopsModules.revopsViews,
    quotas:       revopsModules.revopsViews,
    "comp-plans": revopsModules.revopsViews,
    analytics:    revopsModules.revopsViews,
    reports:      revopsModules.revopsViews,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── PRODUCT & ENGINEERING ────────────────────────────────────────────────
  PRODUCT_ENGINEERING: {
    dashboard:  bizopsModules.dashboard,
    roadmap:    bizopsModules.workflows,
    features:   bizopsModules.tasks,
    bugs:       bizopsModules.tasks,
    sprints:    bizopsModules.workflows,
    tasks:      bizopsModules.tasks,
    releases:   bizopsModules.workflows,
    analytics:  bizopsModules.analyticsView,
    feedback:   bizopsModules.documents,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── FINANCE ──────────────────────────────────────────────────────────────
  FINANCE: {
    dashboard:    bizopsModules.dashboard,
    revenue:      bizopsModules.analyticsView,
    expenses:     bizopsModules.analyticsView,
    invoices:     bizopsModules.documents,
    reports:      bizopsModules.analyticsView,
    forecasting:  bizopsModules.analyticsView,
    budget:       bizopsModules.analyticsView,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── CUSTOMER SERVICE ─────────────────────────────────────────────────────
  SERVICE: {
    dashboard:    bizopsModules.dashboard,
    tickets:      bizopsModules.tasks,
    customers:    bizopsModules.accounts,
    knowledge:    bizopsModules.documents,
    analytics:    bizopsModules.analyticsView,
    satisfaction: bizopsModules.analyticsView,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── PROCUREMENT ──────────────────────────────────────────────────────────
  PROCUREMENT: {
    dashboard:  bizopsModules.dashboard,
    vendors:    bizopsModules.accounts,
    orders:     bizopsModules.tasks,
    contracts:  bizopsModules.documents,
    spend:      bizopsModules.analyticsView,
    savings:    bizopsModules.analyticsView,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── IT & ADMIN ───────────────────────────────────────────────────────────
  IT_ADMIN: {
    dashboard:    bizopsModules.dashboard,
    integrations: bizopsModules.integrationsHub,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── STUDENT / TEACHER ────────────────────────────────────────────────────
  STUDENT_TEACHER: {
    dashboard:    bizopsModules.dashboard,
    courses:      bizopsModules.workflows,
    assignments:  bizopsModules.tasks,
    grades:       bizopsModules.analyticsView,
    discussions:  bizopsModules.documents,
    projects:     bizopsModules.workflows,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── BUSINESS OPS ─────────────────────────────────────────────────────────
  BIZOPS: {
    dashboard:  bizopsModules.dashboard,
    projects:   bizopsModules.workflows,
    workflows:  bizopsModules.workflows,
    analytics:  bizopsModules.analyticsView,
    accounts:   bizopsModules.accounts,
    tasks:      bizopsModules.tasks,
    docs:       bizopsModules.documents,
    "fabric-admin": bizopsModules.fabricAdmin,
  },

  // ─── PERSONAL ─────────────────────────────────────────────────────────────
  PERSONAL: {
    dashboard:  bizopsModules.personalDashboard,
    tasks:      bizopsModules.tasks,
    calendar:   bizopsModules.calendarView,
    notes:      bizopsModules.documents,
    projects:   bizopsModules.workflows,
    docs:       bizopsModules.documentStorage,
    "fabric-admin": bizopsModules.fabricAdmin,
  },
};

// ─── CONTENT ROUTER COMPONENT ───────────────────────────────────────────────

export interface ContentRouterProps {
  domain: Domain;
  moduleId: string;
  dataContext?: ModuleData;
  forceRender?: boolean; // Bypass density check
}

export function ContentRouter({ 
  domain, 
  moduleId, 
  dataContext,
  forceRender = false 
}: ContentRouterProps) {
  // Check if component exists for this domain + moduleId
  const componentLoader = DOMAIN_CONTENT_MAP[domain]?.[moduleId];
  
  if (!componentLoader) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="text-center space-y-3">
          <div className="text-slate-400">Module not found</div>
          <div className="text-xs text-slate-500 font-mono">
            {domain}/{moduleId}
          </div>
        </div>
      </div>
    );
  }
  
  // Apply data density scoring if dataContext provided
  if (dataContext && !forceRender) {
    const render = shouldRenderModule(dataContext, domain, "default");
    
    if (!render) {
      const message = getEmptyStateMessage(dataContext);
      return <EmptyState message={message} />;
    }
  }
  
  // Get or create cached lazy component
  const cacheKey = `${domain}::${moduleId}`;
  const LazyComponent = getLazyComponent(cacheKey, componentLoader);
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponent />
    </Suspense>
  );
}

// ─── EXPORT DEFAULT COMPONENT ───────────────────────────────────────────────

export default ContentRouter;