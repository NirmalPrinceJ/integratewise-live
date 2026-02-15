# IntegrateWise Platform Architecture

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Relume-Ready Specification

---

## Overview

IntegrateWise is an Enterprise Integration Platform built around three core principles:

1. **One Platform, One Spine** — Single Source of Truth (SSOT)
2. **IQ Hub** — Thinking and orchestration workspace
3. **Role-Based Views** — Same data, different lenses

---

## 1. EXTERNAL PAGES (Relume Pages 1–6)

### 1.1 `/` – Universal Landing Page

**Purpose:** Tell the "One Platform, One Spine" story and drive conversions.

**Sections (Top to Bottom):**

1. **Hero – IntegrateWise Overview**
   - H1: "IntegrateWise — All Your Enterprise Integrations, One Platform."
   - Subcopy: Modern answer to Tool Sprawl, CS Team Paradox, GenAI Divide
   - Primary CTA: "Start Free" → `/auth`
   - Secondary CTA: "Book a Demo" → `/auth?mode=demo`
   - Visual: Spine, IQ Hub, Role-Based Views

2. **Feature Strip – One Platform, One Spine**
   - Headline: "One Platform, One Spine: End Tool Sprawl"
   - 3 Icon Cards:
     - SSOT (Spine)
     - IQ Hub
     - Role-Based Views

3. **Governance Built In**
   - Headline: "Governance Built In"
   - Pillars:
     - Governor Slack
     - AI-Relay
     - Audit Trail
     - Policy Gates
   - Copy: "Non-negotiable, always-on"

4. **How It Works (Master Flow)**
   - Horizontal Flow:
     1. Load → 2. Store in Spine → 3. Think in IQ Hub → 4. Act via Cognitive Twin → 5. Govern
   - Each step: 1 line outcome

5. **Benefits Grid**
   - 4 Cards:
     - Reduce integration cost
     - Simplify support
     - Bridge GenAI Divide
     - Accelerate operations

6. **Testimonials**
   - Enterprise quotes
   - Example: "Unified support cut onboarding times by 45%"

7. **FAQ**
   - Security, compliance, role-based access
   - Integrations supported
   - Support model

8. **CTA Band**
   - Headline: "Ready to unify and govern your integrations?"
   - CTAs: "Start Free" / "Book a Demo"

9. **Newsletter + Footer**

---

### 1.2 `/auth` – Login Page

**Purpose:** Secure, confident entry with minimal friction.

**Key Blocks:**

1. **Header Bar**
   - Logo, minimal nav (Home, Solutions, Resources)
   - CTAs: "Start Free" / "Book a Demo"

2. **Hero Panel**
   - H1: "Your Enterprise Integration Command Center"
   - Subcopy: "One Platform. One Spine. Multiple Role-Based Views."
   - Auth methods:
     - Continue with Google
     - Continue with Microsoft
     - Continue with Email (Magic Link or Password)
   - Small note: "By continuing you agree to Terms & Privacy"

3. **Supporting Features Row**
   - Unified Platform
   - Single Source of Truth (SSOT / Spine)
   - Role-Based Views

4. **Mini IQ Hub Explainer**
   - Description: Workspace for orchestrating integrations, analyzing data, managing workflows

5. **Governance Layer Highlight**
   - Visual diagram showing governance embedded throughout
   - Governor Slack, AI-Relay, Audit Trail, Policy Gates

6. **Footer**

---

### 1.3 `/onboarding/analyzing` – Persona Analysis Page

**Purpose:** 6–10s "magic" moment analyzing working style.

**Content:**

1. **Progress Header**
   - Step indicator: 1/3 (Analysis → Insights → Load Your Data)
   - Copy: "I'm learning how you work so I can set up the right workspace for you."

2. **Loading/Analysis State**
   - Animated "analysis" visual
   - Microcopy: "Reading your role, team, and goals to recommend the best view"
   - Auto-advance after 6–10s once backend returns persona

3. **Fallback**
   - Small "Skip analysis" link → `/onboarding/insights` with generic persona

---

### 1.4 `/onboarding/insights` – Persona Insights Page

**Purpose:** Show persona (1 of 20) and map to default view.

**Blocks:**

1. **Persona Summary**
   - Title: "You work like a [Persona Name]" (e.g., Builder-Operator CSM)
   - 3–5 bullet strengths
   - 2–3 friction patterns
   - Reassurance: "I've set up a workspace that fits this style"

2. **Recommended Default View**
   - Card: "Recommended starting view"
   - Examples:
     - CS Manager / TAM → CS View
     - AE / Sales Leader → Sales View
     - Marketing Lead → Marketing View
     - PM / Head of Product → PM View
     - Founder / COO → Business OS (Owner Cockpit)
     - Org Admin / IT / RevOps → Admin View
   - Primary CTA: "Continue with this workspace" → `/setup?view=cs`
   - Secondary link: "Change my default workspace" → opens view selector

3. **View Selector (Override)**
   - Radio or pill selector: CS / Sales / Marketing / PM / Business OS / Admin
   - Copy: "You can switch anytime inside the app"

4. **Continue Button**
   - "Next: Load your data" → `/setup`

---

### 1.5 `/setup` – Load Your Data Page

**Purpose:** Avoid empty state; ensure something to work with in `/app`.

**Sections:**

1. **Header + Progress**
   - Step indicator: 2/3 (Insights → Load Data → Enter Workspace)
   - H1: "Load your work into IntegrateWise"
   - Sub: "You can connect tools, drop files, or start with demo data"

2. **Option 1 – Connect Tools**
   - Description: "Connect Slack, CRM, Notion, helpdesk, or other systems"
   - CTA: "Connect tools"
   - Outcome: At least 1 connected tool triggers Loader to build accounts/tasks

3. **Option 2 – Dump Files/Exports**
   - Description: "Drop CSVs, PDFs, exports, or raw notes"
   - Drag-and-drop area
   - Outcome: Quick "we're structuring this" preview; produce sample accounts/tasks

4. **Option 3 – Start with Demo Data**
   - Description: "See how your workspace will look, using demo data. You can connect tools later."
   - CTA: "Explore with demo data"

5. **Minimal Requirements Before `/app`**
   - At least one of:
     - A demo dataset; or
     - A connected tool; or
     - A parsed file batch
   - Once satisfied: "Enter your workspace" button → `/app`

---

### 1.6 `/app` – App Shell (Main Product Container)

**Purpose:** Single OS container hosting all internal routes.

**Layout Elements:**
- Global header
- Global left nav
- Main content area (where Today / Tasks / Views render)
- Right rail (optional; Cognitive Twin, insights, etc.)

**Note:** From here everything is internal routes/views, not external pages.

---

## 2. INTERNAL PRODUCT ROUTES (inside `/app`)

All routes live in the app shell. Not separate Relume pages, but stateful layout spec.

### 2.1 Global Layout Elements

**Header (Top):**
- Logo
- Current Workspace/View name
- Search
- User menu

**Left Navigation:**

**Global Utilities:**
- Today
- Work Queue / Tasks
- Search / Memory
- IQ Hub
- Integrations
- Governance Center

**Views (Role-Based):**
- CS View
- Sales View
- Marketing View
- PM View
- Business OS (Owner Cockpit)
- Admin View

**Right Rail (Optional):**
- Cognitive Twin panel: context-aware suggestions, summaries, actions

---

### 2.2 Today

**Purpose:** Daily command center for current default view.

**Content:**
- "Today's focus" cards from Cognitive Twin
- Key metrics for current view (e.g., at-risk accounts for CS; pipeline for Sales)
- Short list of top tasks and meetings
- Deep links into Work Queue, IQ Hub, accounts, etc.

---

### 2.3 Work Queue / Tasks

**Purpose:** Centralized execution layer.

**Content:**
- Task list filtered by current view and role
- Grouping by: Today / This week / Later; or by account/deal/project
- Each task links back to underlying Spine entities and appropriate view

---

### 2.4 Search / Memory

**Purpose:** Global recall across Spine + IQ Hub.

**Content:**
- Search bar with filters (Accounts, Deals, Campaigns, Features, Decisions, Notes)
- Result list with badges for origin (CS / Sales / Marketing / PM)
- Click-through opens entity in most relevant view, with ability to switch view while preserving context

---

### 2.5 IQ Hub

**Purpose:** Thinking and knowledge space.

**Content:**
- Threads / notes from AI conversations, brainstorms, curated documents
- Grouped by projects, accounts, themes
- Actions: "Send to Spine as…" Account/Task/Play/Feature request
- Cognitive Twin appears as chat panel working off full Spine context

---

### 2.6 Integrations

**Purpose:** Connect and manage tools.

**Content:**
- List of connected tools with status
- Button: "Connect new tool"
- Per-integration config (what entities are synced, direction, frequency)

---

### 2.7 Governance Center

**Purpose:** Policy and AI-Relay control.

**Content:**
- Policy cards: AI write-back rules, access scopes, retention
- AI-Relay configuration for agents
- Logs of AI actions and decisions
- About "what is allowed" and "what was done", not user roles (that's Admin View)

---

### 2.8 Views (Role-Based)

Each view is the same Spine rendered through a different lens. All share same global header/nav.

#### 2.8.1 CS View

**Default Objects:**
- Accounts, Health Scores, Risks, Plays, Renewals

**Today Tab Focus:**
- At-risk accounts and upcoming renewals

**Typical Journeys:**
- Review at-risk accounts → open account → see health details and plays
- Prepare for QBR → Cognitive Twin pulls IQ Hub notes + account timeline → export summary

---

#### 2.8.2 Sales View

**Objects:**
- Pipeline, Deals, Accounts, Forecast

**Same account data, emphasizing:**
- ARR, stage, owners, next steps

**Journeys:**
- See expansion opportunities this quarter → filter accounts with high health + low expansion
- Follow up on stalled deals → Twin surfaces deals with no activity in N days

---

#### 2.8.3 Marketing View

**Objects:**
- Segments, Campaigns, Touchpoints, Content, Attribution

**Uses Spine to:**
- See which segments map to healthy accounts and expansions

**Journeys:**
- Identify which customer segments respond best to feature X → filter campaigns tied to accounts with strong adoption
- Pull examples of successful campaigns for high-health customers → link to IQ Hub case notes

---

#### 2.8.4 PM View

**Objects:**
- Features, Feedback, Usage, Roadmap, Issues

**Uses account + segment data to:**
- Inform prioritization

**Journeys:**
- See which features are under-adopted across healthy accounts → cross-tab health vs usage
- Pull consolidated feedback around a module → search memory + feedback, group by theme

---

#### 2.8.5 Business OS (Owner Cockpit)

**Objects:**
- Revenue, Churn, NRR, Team Load, Key Initiatives

**Cross-sectional view across:**
- CS, Sales, Marketing, PM

**Journeys:**
- See this quarter's revenue + risk + key projects in one screen
- Drill from high-level NRR → see which accounts and teams are driving risk/opportunity

---

#### 2.8.6 Admin View

**Responsibilities:**
- User management, roles/permissions
- Workspace-level settings
- Billing
- High-level monitoring

**Tight coupling with:**
- Governance Center (policies)
- Integrations (technical connections)

**Journeys:**
- Grant a new CSM access to CS View for a region
- Review AI usage and recent write-backs from Cognitive Twin; adjust rules in Governance Center

---

## Implementation Status

### ✅ Completed
- Landing Page (/)
- Login Page (/auth)
- Persona Analysis (/onboarding/analyzing)
- Persona Insights (/onboarding/insights)
- Load Your Data (/setup)
- AI Loader (onboarding step)
- Workspace Entrance (premium gate)
- Workspace Container (app shell)
- Logo System (IntegrateWiseLogo component)
- Brand Colors (#3F3182 primary, #E94B8A accent)

### 🚧 In Progress
- Internal routing structure
- Role-based views implementation
- IQ Hub foundation

### 📋 Roadmap
- Today dashboard
- Work Queue / Tasks
- Search / Memory
- Integrations management
- Governance Center
- All 6 role-based views (CS, Sales, Marketing, PM, Business OS, Admin)
- Cognitive Twin right rail

---

## Technical Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Tailwind built-in + CSS transitions
- **Routing:** Internal state management (to be replaced with React Router)
- **State:** React hooks + localStorage

---

## Design Tokens

### Colors
```css
--color-primary: #3F3182;      /* Primary Purple */
--color-accent: #E94B8A;       /* Accent Pink */
--color-bg-light: #FFFFFF;
--color-bg-gray: #F9FAFB;
--color-text-primary: #111827;
--color-text-secondary: #6B7280;
--color-border: #E5E7EB;
```

### Typography
- **Font Family:** Inter (system fallback)
- **Logo:** Bold/Semibold
- **Tagline:** Uppercase, tracking-wide, low emphasis

---

## Revolutionary Headline

**"Load your work. Store it in your Spine. Think in your IQ Hub, Act through your Cognitive Twin"**

This appears in:
- Landing page hero
- Workspace entrance
- Key onboarding moments

---

## Next Steps

1. **Implement React Router** for proper URL-based routing
2. **Build internal view scaffolding** (Today, Tasks, IQ Hub, etc.)
3. **Create role-based view components** starting with CS View
4. **Integrate Cognitive Twin** as right rail panel
5. **Build Governance Center** UI
6. **Add integration management** interface
7. **Implement Search/Memory** functionality
8. **Add demo data** for all views
9. **Build Business OS** (Owner Cockpit) dashboard
10. **Create Admin View** for workspace management

---

This architecture document serves as the **source of truth** for IntegrateWise platform development and can be imported directly into Relume as a structured specification for pages, sections, and components.
