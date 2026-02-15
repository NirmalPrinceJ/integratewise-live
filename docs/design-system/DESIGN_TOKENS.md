# IntegrateWise OS — Design Token System

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Implementation Ready

---

## Overview

This document defines the complete design token system for IntegrateWise OS. Tokens create a single source of truth that connects Figma designs, marketing sites, and application code.

**Token Philosophy:**
- **Tokens are hierarchical**: Brand → Functional → UI
- **Tokens enable theming**: Change one value, update everywhere
- **Tokens enforce consistency**: No ad-hoc hex values in components
- **Tokens scale**: Light/dark mode, workspace themes, accessibility

---

## Token Taxonomy

IntegrateWise uses a **7-layer token system**:

```
1. Brand tokens (brand.*) ────────────── Core identity (purple, pink)
2. Engine tokens (engine.*) ───────────── Workflow stages (Load, Think, Act, etc.)
3. Semantic tokens (semantic.*) ────────── Status & meaning (good, warning, danger)
4. Surface tokens (surface.*) ──────────── Backgrounds & elevation
5. Text tokens (text.*) ────────────────── Typography hierarchy
6. Border tokens (border.*) ────────────── Dividers & outlines
7. UI tokens (button.*, badge.*) ──────── Component-specific usage
```

**Rule:** Components only use tokens from layers 4-7 (Surface, Text, Border, UI). They never directly reference Brand, Engine, or Semantic tokens (except in specialized cases like engine diagrams).

---

## 1. Brand Tokens

**Purpose:** Core brand identity. Global, stable colors that define IntegrateWise's visual DNA.

### Primary (Spine / Hub) — Purple

| Token | Value | Usage |
|-------|-------|-------|
| `brand.primary` | `#3F3182` | Base purple (logo "Wise", primary buttons) |
| `brand.primary-dark` | `#2F2461` | Darker shade (pressed states) |
| `brand.primary-light` | `#51409A` | Lighter shade (hover states) |
| `brand.primary-soft` | `rgba(63,49,130,0.08)` | 8% opacity fill (backgrounds) |
| `brand.primary-border` | `rgba(63,49,130,0.18)` | 18% opacity (outlines) |

**Symbolism:** The Spine — reliable infrastructure, enterprise trust, stability.

---

### Accent (Cognitive Twin / Neutron) — Pink

| Token | Value | Usage |
|-------|-------|-------|
| `brand.accent` | `#E94B8A` | Base pink (Cognitive Twin features) |
| `brand.accent-dark` | `#C43C5E` | Darker shade (pressed states) |
| `brand.accent-light` | `#F0639A` | Lighter shade (hover states) |
| `brand.accent-soft` | `rgba(233,75,138,0.10)` | 10% opacity fill (backgrounds) |
| `brand.accent-border` | `rgba(233,75,138,0.25)` | 25% opacity (outlines) |

**Symbolism:** Cognitive Twin / Neutron — AI intelligence, innovation, dynamic energy.

---

## 2. Engine Stage Tokens

**Purpose:** Workflow identity. Colors for the IntegrateWise 5-stage engine (Load → Normalize → Think → Act → Govern).

**⚠️ Usage Rule:** Use ONLY in:
- Engine architecture diagrams
- Stage pills ("LOAD", "THINK", etc.)
- Micro-UI rails that tag content by stage

**Do NOT use for:**
- Status indicators (use `semantic.*` instead)
- General purpose buttons or badges

| Token | Value | Stage | Symbolism |
|-------|-------|-------|-----------|
| `engine.load` | `#0EA5E9` | Load | Data ingestion (cyan = flow) |
| `engine.normalize` | `#3F3182` | Normalize | Standardization (purple = structure) |
| `engine.think` | `#6366F1` | Think | Analysis (indigo = intelligence) |
| `engine.act` | `#22C55E` | Act | Execution (green = action) |
| `engine.govern` | `#E94B8A` | Govern | Oversight (pink = control) |

**Aliases:**
- `engine.normalize` → `brand.primary` (intentional)
- `engine.govern` → `brand.accent` (intentional)

**Soft variants:** All have a `-soft` variant at 12% opacity for backgrounds.

---

## 3. Semantic Tokens

**Purpose:** Universal status language. Colors that communicate health, risk, and information.

**⚠️ Usage Rule:** Use for:
- Health metrics, KPIs, trends
- Alerts, toasts, banners
- Status badges

**Do NOT use for:**
- Primary navigation
- Brand identity
- Engine stage tagging

### Success / Good

| Token | Value | Usage |
|-------|-------|-------|
| `semantic.good` | `#22C55E` | Positive metrics, success states |
| `semantic.good-soft` | `rgba(34,197,94,0.12)` | Background fill |
| `semantic.good-border` | `rgba(34,197,94,0.6)` | Border (60% opacity) |
| `semantic.good-text` | `#4ADE80` | Text on dark backgrounds |

---

### Warning / Caution

| Token | Value | Usage |
|-------|-------|-------|
| `semantic.warning` | `#F59E0B` | Moderate risk, attention needed |
| `semantic.warning-soft` | `rgba(245,158,11,0.12)` | Background fill |
| `semantic.warning-border` | `rgba(245,158,11,0.6)` | Border (60% opacity) |
| `semantic.warning-text` | `#FCD34D` | Text on dark backgrounds |

---

### Danger / Risk / Error

| Token | Value | Usage |
|-------|-------|-------|
| `semantic.danger` | `#EF4444` | Critical alerts, errors, destructive actions |
| `semantic.danger-soft` | `rgba(239,68,68,0.12)` | Background fill |
| `semantic.danger-border` | `rgba(239,68,68,0.6)` | Border (60% opacity) |
| `semantic.danger-text` | `#FCA5A5` | Text on dark backgrounds |

---

### Info / Neutral

| Token | Value | Usage |
|-------|-------|-------|
| `semantic.info` | `#0EA5E9` | Informational messages, tips |
| `semantic.info-soft` | `rgba(14,165,233,0.12)` | Background fill |
| `semantic.info-border` | `rgba(14,165,233,0.6)` | Border (60% opacity) |
| `semantic.info-text` | `#38BDF8` | Text on dark backgrounds |

**Note:** `semantic.info` aliases to `engine.load` (same hex value, different conceptual use).

---

## 4. Surface Tokens

**Purpose:** Backgrounds, cards, panels. Defines elevation and hierarchy.

### App Shell

| Token | Value | Usage |
|-------|-------|-------|
| `surface.app-bg` | `#F8FAFC` | Main app background |
| `surface.app-bg-alt` | `#F4F4F6` | Alternate panels, subtle differentiation |

---

### Cards & Panels

| Token | Value | Usage |
|-------|-------|-------|
| `surface.card` | `#FFFFFF` | Standard card background |
| `surface.card-elevated` | `#FFFFFF` | Modal, dropdown, elevated surface |
| `surface.card-hover` | `#FAFBFC` | Card hover state |

---

### Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `surface.interactive` | `#F9FAFB` | Clickable surface (neutral) |
| `surface.interactive-hover` | `#F3F4F6` | Hover state |

---

### Modal & Overlay

| Token | Value | Usage |
|-------|-------|-------|
| `surface.modal` | `#FFFFFF` | Modal background |
| `surface.overlay` | `rgba(15,23,42,0.6)` | Backdrop (60% opacity) |

---

## 5. Text Tokens

**Purpose:** Typography hierarchy. Defines text color for different emphasis levels.

### Light Mode (Default)

| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `text.primary` | `#0F172A` | 14.8:1 | Headings, high-emphasis body text |
| `text.secondary` | `#64748B` | 7.2:1 | Labels, descriptions, metadata |
| `text.tertiary` | `#94A3B8` | 4.6:1 | Placeholder hints, low-emphasis |
| `text.disabled` | `#CBD5E1` | 3.1:1 | Disabled states |

---

### On Dark Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `text.on-dark` | `#F9FAFB` | Text on `surface.app-bg` (dark mode) |
| `text.on-brand` | `#FFFFFF` | Text on `brand.primary` or `brand.accent` |

---

### Inverted (Dark Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `text.inverted-primary` | `#F9FAFB` | Primary text (dark mode) |
| `text.inverted-secondary` | `#CBD5E1` | Secondary text (dark mode) |
| `text.inverted-tertiary` | `#94A3B8` | Tertiary text (dark mode) |

---

## 6. Border Tokens

**Purpose:** Dividers, outlines, focus rings.

### Neutral Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border.subtle` | `#E2E8F0` | Card borders, dividers |
| `border.default` | `#CBD5E1` | Input outlines, stronger dividers |
| `border.strong` | `#94A3B8` | High-emphasis borders |

---

### Interactive Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border.focus` | `#3F3182` | Focus outline (keyboard nav) |
| `border.focus-ring` | `rgba(63,49,130,0.3)` | Focus ring (shadow) |

---

### Status Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border.error` | `#EF4444` | Error input outline |
| `border.success` | `#22C55E` | Success input outline |

---

## 7. UI Component Tokens

**Purpose:** Usage-specific tokens. Components reference these, never raw brand/semantic colors.

### Buttons

#### Primary Button

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `button.primary.bg` | `brand.primary` | Background |
| `button.primary.bg-hover` | `brand.primary-light` | Hover background |
| `button.primary.text` | `text.on-brand` | Text color |
| `button.primary.border` | `transparent` | Border (none) |

**Example:**
```tsx
<button className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-bg-hover)] text-[var(--color-button-primary-text)]">
  Save Changes
</button>
```

---

#### Secondary Button

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `button.secondary.bg` | `transparent` | Background |
| `button.secondary.bg-hover` | `brand.primary-soft` | Hover background |
| `button.secondary.text` | `brand.primary` | Text color |
| `button.secondary.border` | `brand.primary-border` | Border |

**Example:**
```tsx
<button className="bg-[var(--color-button-secondary-bg)] hover:bg-[var(--color-button-secondary-bg-hover)] text-[var(--color-button-secondary-text)] border border-[var(--color-button-secondary-border)]">
  Cancel
</button>
```

---

#### Tertiary Button

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `button.tertiary.bg` | `transparent` | Background |
| `button.tertiary.bg-hover` | `surface.interactive-hover` | Hover background |
| `button.tertiary.text` | `text.secondary` | Text color |
| `button.tertiary.border` | `transparent` | Border (none) |

---

#### Danger Button

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `button.danger.bg` | `semantic.danger` | Background |
| `button.danger.bg-hover` | `#DC2626` | Hover background |
| `button.danger.text` | `text.on-brand` | Text color |
| `button.danger.border` | `transparent` | Border (none) |

---

### Badges & Pills

#### Good Badge

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `badge.good.bg` | `semantic.good-soft` | Background |
| `badge.good.border` | `semantic.good-border` | Border |
| `badge.good.text` | `semantic.good` | Text color |

**Example:**
```tsx
<span className="inline-flex items-center px-3 py-1 bg-[var(--color-badge-good-bg)] border border-[var(--color-badge-good-border)] text-[var(--color-badge-good-text)] rounded-full text-sm font-medium">
  Active
</span>
```

---

#### Warning Badge

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `badge.warning.bg` | `semantic.warning-soft` | Background |
| `badge.warning.border` | `semantic.warning-border` | Border |
| `badge.warning.text` | `semantic.warning` | Text color |

---

#### Danger Badge

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `badge.danger.bg` | `semantic.danger-soft` | Background |
| `badge.danger.border` | `semantic.danger-border` | Border |
| `badge.danger.text` | `semantic.danger` | Text color |

---

#### Info Badge

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `badge.info.bg` | `semantic.info-soft` | Background |
| `badge.info.border` | `semantic.info-border` | Border |
| `badge.info.text` | `semantic.info` | Text color |

---

#### Accent Badge (AI / Cognitive Twin)

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `badge.accent.bg` | `brand.accent-soft` | Background |
| `badge.accent.border` | `brand.accent-border` | Border |
| `badge.accent.text` | `brand.accent` | Text color |

**Example:**
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-badge-accent-bg)] border border-[var(--color-badge-accent-border)] rounded-full">
  <Sparkles className="w-4 h-4 text-[var(--color-badge-accent-text)]" />
  <span className="text-sm font-semibold text-[var(--color-badge-accent-text)]">AI-Powered</span>
</div>
```

---

### Navigation

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `nav.bg` | `surface.app-bg` | Sidebar background |
| `nav.item-text` | `text.secondary` | Default item text |
| `nav.item-text-hover` | `brand.primary` | Hover text |
| `nav.item-bg-hover` | `brand.primary-soft` | Hover background |
| `nav.item-text-active` | `brand.primary` | Active text |
| `nav.item-bg-active` | `brand.primary-soft` | Active background |
| `nav.item-indicator` | `brand.primary` | Left bar indicator |

**Example:**
```tsx
{/* Active nav item */}
<button className="relative bg-[var(--color-nav-item-bg-active)] text-[var(--color-nav-item-text-active)]">
  <div className="absolute left-0 w-0.5 h-full bg-[var(--color-nav-item-indicator)]" />
  Home
</button>

{/* Hover nav item */}
<button className="hover:bg-[var(--color-nav-item-bg-hover)] hover:text-[var(--color-nav-item-text-hover)] text-[var(--color-nav-item-text)]">
  Today
</button>
```

---

### Tables

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `table.header-bg` | `surface.app-bg-alt` | Header row background |
| `table.header-text` | `text.secondary` | Header text |
| `table.row-bg` | `surface.card` | Body row background |
| `table.row-bg-hover` | `surface.card-hover` | Row hover state |
| `table.row-border` | `border.subtle` | Row dividers |

---

### Form Inputs

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `input.bg` | `surface.card` | Input background |
| `input.border` | `border.default` | Default border |
| `input.border-hover` | `border.strong` | Hover border |
| `input.border-focus` | `border.focus` | Focus border |
| `input.text` | `text.primary` | Entered text |
| `input.placeholder` | `text.tertiary` | Placeholder text |

---

### Stage Pills (Engine Diagrams Only)

| Token | Aliases To | Usage |
|-------|-----------|-------|
| `stage.load.bg` | `engine.load-soft` | Background |
| `stage.load.border` | `engine.load` | Border |
| `stage.load.text` | `engine.load` | Text |

*Same pattern for `stage.normalize.*`, `stage.think.*`, `stage.act.*`, `stage.govern.*`*

**Example:**
```tsx
<span className="inline-flex items-center px-2 py-1 bg-[var(--color-stage-load-bg)] border border-[var(--color-stage-load-border)] text-[var(--color-stage-load-text)] rounded text-xs font-semibold uppercase">
  LOAD
</span>
```

---

## Implementation Guide

### 1. Figma Setup

**Create Variable Collections:**

1. **Color / Brand & Neutrals**
   - `brand.primary`, `brand.primary-dark`, `brand.primary-light`, etc.
   - `surface.app-bg`, `surface.card`, etc.
   - `text.primary`, `text.secondary`, etc.
   - `border.subtle`, `border.default`, etc.

2. **Color / Engine**
   - `engine.load`, `engine.normalize`, `engine.think`, `engine.act`, `engine.govern`
   - Each with `-soft` variant

3. **Color / Semantic**
   - `semantic.good`, `semantic.warning`, `semantic.danger`, `semantic.info`
   - Each with `-soft`, `-border`, `-text` variants

4. **Color / UI**
   - `button.primary.bg`, `button.primary.bg-hover`, `button.primary.text`, etc.
   - `badge.good.bg`, `badge.good.border`, `badge.good.text`, etc.
   - `nav.bg`, `nav.item-text`, etc.

**Figma Modes:**
- Default mode: Light
- Future mode: Dark (same token names, different values)

**Usage Rule:** Components only bind to `Color / UI` variables, never directly to `Color / Brand` or `Color / Semantic`.

---

### 2. CSS Setup

All tokens are defined in `/src/styles/theme.css`:

```css
@theme {
  /* Brand */
  --color-brand-primary: #3F3182;
  --color-brand-primary-light: #51409A;
  
  /* Engine */
  --color-engine-load: #0EA5E9;
  --color-engine-think: #6366F1;
  
  /* Semantic */
  --color-semantic-good: #22C55E;
  --color-semantic-danger: #EF4444;
  
  /* UI (aliases to above) */
  --color-button-primary-bg: var(--color-brand-primary);
  --color-badge-good-text: var(--color-semantic-good);
}
```

---

### 3. Component Usage

**✅ Correct:**
```tsx
// Use UI tokens
<button className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-bg-hover)]">
  Save
</button>

// Use semantic badge tokens
<span className="bg-[var(--color-badge-good-bg)] border-[var(--color-badge-good-border)] text-[var(--color-badge-good-text)]">
  Active
</span>
```

**❌ Incorrect:**
```tsx
// Don't use brand tokens directly (except for special cases)
<button className="bg-[var(--color-brand-primary)]">Save</button>

// Don't use hardcoded hex
<button className="bg-[#3F3182]">Save</button>

// Don't mix semantic and engine tokens
<span className="bg-[var(--color-engine-act-soft)]">Active</span> // Should use badge.good
```

---

### 4. Token Migration Checklist

**Phase 1: Foundation (Week 1)**
- [x] Define all tokens in CSS
- [x] Set up Figma Variables
- [ ] Create token documentation
- [ ] Train team on token usage rules

**Phase 2: Refactor (Week 2-3)**
- [ ] Replace hardcoded hex values with tokens
- [ ] Update button components
- [ ] Update badge components
- [ ] Update navigation components
- [ ] Update form inputs

**Phase 3: Advanced (Month 1)**
- [ ] Implement dark mode (same tokens, different values)
- [ ] Add workspace-specific accent colors
- [ ] Create token validation linter
- [ ] Add A11y contrast checker

---

## Token Usage Rules

### ✅ DO

- **Use UI tokens** (`button.*`, `badge.*`, `nav.*`) in components
- **Use semantic tokens** for status, health, KPIs
- **Use engine tokens** for stage diagrams, pills, rails
- **Alias extensively** (UI tokens point to semantic/brand tokens)
- **Document exceptions** when breaking rules

### ❌ DON'T

- **Don't hardcode hex values** in components
- **Don't mix semantic and engine** (e.g., don't use `engine.act` for status)
- **Don't use brand tokens directly** in most components (use UI tokens)
- **Don't create new colors** without adding to token system
- **Don't use status colors** (red, green, amber) for navigation

---

## Token Naming Conventions

**Pattern:** `{category}.{element}.{variant}`

**Examples:**
- `brand.primary` (category: brand, element: primary)
- `button.primary.bg-hover` (category: button, element: primary, variant: bg-hover)
- `badge.good.text` (category: badge, element: good, variant: text)

**Suffixes:**
- `-bg`: Background
- `-text`: Text color
- `-border`: Border color
- `-soft`: Low-opacity fill
- `-hover`: Hover state
- `-active`: Active state
- `-focus`: Focus state

---

## Quick Reference: Token Hierarchy

```
Brand Tokens (Raw Colors)
  ├── brand.primary (#3F3182)
  └── brand.accent (#E94B8A)
       │
       ↓
Engine Tokens (Stage Identity)
  ├── engine.load (#0EA5E9)
  ├── engine.normalize (→ brand.primary)
  ├── engine.think (#6366F1)
  ├── engine.act (#22C55E)
  └── engine.govern (→ brand.accent)
       │
       ↓
Semantic Tokens (Status Meaning)
  ├── semantic.good (#22C55E) ← aliases to engine.act
  ├── semantic.warning (#F59E0B)
  ├── semantic.danger (#EF4444)
  └── semantic.info (#0EA5E9) ← aliases to engine.load
       │
       ↓
UI Tokens (Component Usage)
  ├── button.primary.bg (→ brand.primary)
  ├── badge.good.text (→ semantic.good)
  ├── nav.item-indicator (→ brand.primary)
  └── stage.load.bg (→ engine.load-soft)
```

**Components only use the bottom layer (UI tokens).**

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | Initial | Complete design token system |

**Reviewers:**
- Design: [ ]
- Engineering: [ ]
- Brand: [ ]

**Approval Status:** ⚠️ Pending Review

---

**END OF DESIGN TOKEN SYSTEM**
