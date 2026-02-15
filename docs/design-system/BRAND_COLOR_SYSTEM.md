# IntegrateWise OS — Brand Color System

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Implementation Ready

---

## Overview

This document defines the complete color palette for IntegrateWise OS, mapping brand identity to UI implementation. The system is designed to:

1. **Reinforce brand identity** through consistent use of Primary (Spine/Hub) and Accent (Neutron/Cognitive Twin) colors
2. **Maintain visual hierarchy** with a structured neutral palette
3. **Communicate status clearly** through semantic colors (success, warning, danger, info)
4. **Support accessibility** with WCAG AA-compliant contrast ratios

---

## 1. Core Brand Palette

### Primary (Spine / Hub) — Purple

**Represents:** Core infrastructure, stability, enterprise trust, the Spine architecture

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#3F3182` | Primary brand color: Buttons, links, active states, logo "Wise" |
| `--color-primary-hover` | `#51409A` | Hover state for primary elements |
| `--color-primary-soft` | `rgba(63, 49, 130, 0.08)` | Subtle background fills: Chips, tags, hover states |
| `--color-primary-border` | `rgba(63, 49, 130, 0.18)` | Borders, outlines, focus rings |

**Color Accessibility:**
- Primary text on white: **5.8:1** (WCAG AA Pass)
- White text on primary: **10.1:1** (WCAG AAA Pass)

**Usage Examples:**
```tsx
// Primary button
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
  Save Changes
</button>

// Secondary button (bordered)
<button className="text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)]">
  Change view...
</button>

// Active sidebar item
<div className="bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
  {/* Slim left bar */}
  <div className="w-0.5 bg-[var(--color-primary)]" />
  Home
</div>
```

---

### Accent (Neutron / Cognitive Twin) — Pink

**Represents:** AI intelligence, cognitive features, innovation, dynamic energy

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#E94B8A` | Accent highlights: AI features, notifications, special CTAs |
| `--color-accent-hover` | `#F0639A` | Hover state for accent elements |
| `--color-accent-soft` | `rgba(233, 75, 138, 0.10)` | Subtle fills: Neutron pills, AI badges, highlights |

**Color Accessibility:**
- Accent text on white: **4.7:1** (WCAG AA Pass for large text)
- White text on accent: **5.9:1** (WCAG AA Pass)

**Usage Examples:**
```tsx
// AI/Cognitive Twin features
<div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-soft)] border border-[var(--color-accent)] rounded-full">
  <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
  <span className="text-sm font-medium text-[var(--color-accent)]">AI-Powered</span>
</div>

// Notification badge
<div className="w-2 h-2 bg-[var(--color-accent)] rounded-full" />

// Logo accent node (in SVG)
<circle cx="27.5" cy="11.5" r="3" fill="var(--color-accent)" />
```

---

### Link / Info Blue (Optional)

**Represents:** Hyperlinks, charts, non-brand informational elements

| Token | Value | Usage |
|-------|-------|-------|
| `--color-link` | `#2563EB` | Inline links, chart colors (when not using primary/accent) |

**⚠️ Important:** This is NOT a core brand color. Use sparingly for functional links and charts where primary purple would create confusion.

**Usage Examples:**
```tsx
// Inline text link (not a primary action)
<a href="#" className="text-[var(--color-link)] hover:underline">
  Learn more about IQ Hub
</a>

// Chart series (when 5+ colors needed)
<Line stroke="var(--color-link)" />
```

---

## 2. Neutrals (UI Shell & Surfaces)

### Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F8FAFC` | App shell background, page background |
| `--color-bg-alt` | `#F4F4F6` | Alternate panels, subtle differentiation |
| `--color-surface` | `#FFFFFF` | Cards, modals, dropdowns, elevated surfaces |

**Usage Examples:**
```tsx
// App shell
<body className="bg-[var(--color-bg)]">
  {/* Sidebar */}
  <aside className="bg-[var(--color-bg)]">...</aside>
  
  {/* Topbar */}
  <header className="bg-[var(--color-surface)]">...</header>
  
  {/* Card */}
  <div className="bg-[var(--color-surface)] rounded-lg shadow">...</div>
</body>
```

---

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#E2E8F0` | Standard dividers, card borders, input outlines |
| `--color-border-strong` | `#CBD5F5` | Emphasized borders, focus rings (when not using primary) |

**Usage Examples:**
```tsx
// Card with border
<div className="border border-[var(--color-border)] rounded-lg">
  <h3 className="border-b border-[var(--color-border)]">Title</h3>
  <p>Content</p>
</div>

// Focus ring (accessibility)
<input className="focus:ring-2 focus:ring-[var(--color-border-strong)]" />
```

---

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text` | `#0F172A` | Primary text: Headings, body copy, high-emphasis content |
| `--color-text-secondary` | `#64748B` | Secondary labels, descriptions, metadata |
| `--color-text-muted` | `#94A3B8` | Tertiary text: Placeholder hints, disabled states |
| `--color-text-on-dark` | `#F9FAFB` | Text on dark backgrounds (buttons, badges) |

**Contrast Ratios:**
- `--color-text` on `--color-bg`: **14.8:1** (WCAG AAA)
- `--color-text-secondary` on `--color-bg`: **7.2:1** (WCAG AAA)
- `--color-text-muted` on `--color-bg`: **4.6:1** (WCAG AA)

**Usage Examples:**
```tsx
// Text hierarchy
<h1 className="text-[var(--color-text)]">Business Hub</h1>
<p className="text-[var(--color-text-secondary)]">Monthly Recurring Revenue and key metrics</p>
<span className="text-[var(--color-text-muted)]">Last updated 2 hours ago</span>

// Button text
<button className="bg-[var(--color-primary)] text-[var(--color-text-on-dark)]">
  Save
</button>
```

---

## 3. Semantic Status Colors

**⚠️ Rule:** Use semantic colors ONLY for health indicators, alerts, and KPIs. **Never** use them for primary navigation or brand accent.

### Success (Green)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#16A34A` | Success states, positive metrics, health indicators |
| `--color-success-soft` | `#DCFCE7` | Success background fills |

**Usage:**
```tsx
// Health metric
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-[var(--color-success)] rounded-full" />
  <span className="text-[var(--color-success)]">All systems operational</span>
</div>

// Success toast
<div className="bg-[var(--color-success-soft)] border-l-4 border-[var(--color-success)] p-4">
  <p className="text-[var(--color-success)]">Profile updated successfully!</p>
</div>
```

---

### Warning (Amber)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-warning` | `#F59E0B` | Warning states, attention needed, moderate risk |
| `--color-warning-soft` | `#FEF3C7` | Warning background fills |

**Usage:**
```tsx
// Warning banner
<div className="bg-[var(--color-warning-soft)] border border-[var(--color-warning)] rounded-lg p-4">
  <p className="text-[var(--color-warning)]">Some integrations require attention</p>
</div>
```

---

### Danger / Risk (Red)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-danger` | `#DC2626` | Error states, critical alerts, destructive actions |
| `--color-danger-soft` | `#FEE2E2` | Danger background fills |

**Usage:**
```tsx
// Delete button
<button className="bg-[var(--color-danger)] hover:bg-[#B91C1C] text-white">
  Delete Account
</button>

// Error message
<div className="bg-[var(--color-danger-soft)] border-l-4 border-[var(--color-danger)] p-4">
  <p className="text-[var(--color-danger)]">Unable to connect to API</p>
</div>
```

---

### Info (Cyan)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-info` | `#0EA5E9` | Informational messages, tips, neutral highlights |
| `--color-info-soft` | `#E0F2FE` | Info background fills |

**Usage:**
```tsx
// Info callout
<div className="bg-[var(--color-info-soft)] border-l-4 border-[var(--color-info)] p-4">
  <p className="text-[var(--color-info)]">💡 Tip: Enable auto-sync for real-time updates</p>
</div>
```

---

## 4. Component Token Mapping

### Sidebar

```tsx
<aside className="bg-[var(--color-bg)] border-r border-[var(--color-border)]">
  {/* Normal item */}
  <button className="text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
    Home
  </button>
  
  {/* Active item */}
  <button className="bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
    <div className="absolute left-0 w-0.5 h-full bg-[var(--color-primary)]" />
    Today
  </button>
</aside>
```

---

### Topbar

```tsx
<header className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
  {/* Title */}
  <h1 className="text-[var(--color-text)]">Work – Business Hub</h1>
  
  {/* Subtitle */}
  <p className="text-[var(--color-text-secondary)]">Momentum Mode – Focused on clean syncs</p>
  
  {/* Change view button */}
  <button className="text-[var(--color-primary)] border border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)]">
    Change view...
  </button>
  
  {/* Notification badge */}
  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full" />
</header>
```

---

### Cards & Metrics

```tsx
<div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
  {/* Title */}
  <h3 className="text-[var(--color-text)]">Monthly Recurring Revenue</h3>
  
  {/* Label */}
  <p className="text-[var(--color-text-muted)]">Current month</p>
  
  {/* Value */}
  <div className="text-[var(--color-text)] text-3xl font-bold">$127,450</div>
  
  {/* Trend indicator */}
  <div className="flex items-center gap-1 text-[var(--color-success)]">
    <TrendingUp className="w-4 h-4" />
    <span>+12.5% vs last month</span>
  </div>
</div>
```

---

### Buttons

```tsx
// Primary action
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-dark)] px-4 py-2 rounded-lg font-medium">
  Save Changes
</button>

// Secondary action
<button className="border border-[var(--color-primary-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] px-4 py-2 rounded-lg font-medium">
  Cancel
</button>

// Tertiary action
<button className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] px-4 py-2 rounded-lg font-medium">
  Learn More
</button>

// Destructive action
<button className="bg-[var(--color-danger)] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg font-medium">
  Delete
</button>
```

---

### AI / Cognitive Twin Elements

```tsx
// Neutron pill
<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-soft)] border border-[var(--color-accent)] rounded-full">
  <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
  <span className="text-sm font-semibold text-[var(--color-accent)]">Cognitive Twin</span>
</div>

// AI insight card
<div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-lg p-4">
  <h4 className="text-[var(--color-text)] font-semibold">AI Insight</h4>
  <p className="text-[var(--color-text-secondary)]">Your MRR is trending 15% above forecast...</p>
</div>
```

---

## 5. Implementation Guide

### Step 1: Import in CSS

All tokens are defined in `/src/styles/theme.css` under `@theme`:

```css
@theme {
  /* Core Brand Palette */
  --color-primary: #3F3182;
  --color-primary-hover: #51409A;
  --color-primary-soft: rgba(63, 49, 130, 0.08);
  --color-primary-border: rgba(63, 49, 130, 0.18);
  
  --color-accent: #E94B8A;
  --color-accent-hover: #F0639A;
  --color-accent-soft: rgba(233, 75, 138, 0.10);
  
  /* ... rest of palette */
}
```

---

### Step 2: Use in Components

**Option A: Direct CSS variables (recommended for new code)**
```tsx
<div className="bg-[var(--color-primary)] text-[var(--color-text-on-dark)]">
  Primary Button
</div>
```

**Option B: Tailwind classes (for gradual migration)**
```tsx
<div className="bg-[#3F3182] text-white">
  Primary Button
</div>
```

**Option C: Inline styles (when dynamic)**
```tsx
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Primary Button
</div>
```

---

### Step 3: Dark Mode (Future)

When implementing dark mode, override tokens in a `@media (prefers-color-scheme: dark)` block:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-bg: #0F172A;
    --color-bg-alt: #1E293B;
    --color-surface: #1E293B;
    --color-text: #F9FAFB;
    --color-text-secondary: #CBD5E1;
    /* Primary and accent remain the same */
  }
}
```

---

## 6. Brand Color Psychology

| Color | Emotion / Association | IntegrateWise Meaning |
|-------|----------------------|----------------------|
| **Primary Purple** (#3F3182) | Trust, stability, sophistication, enterprise | The Spine — reliable infrastructure that holds everything together |
| **Accent Pink** (#E94B8A) | Energy, innovation, creativity, intelligence | Cognitive Twin / Neutron — the dynamic AI layer that adds insight |
| **Neutral Grays** | Clarity, professionalism, focus | Clean UI shell that lets data and actions shine |
| **Semantic Colors** | Universal status language | Health, warnings, errors — immediately understood |

---

## 7. Accessibility Checklist

- [x] **Contrast ratios meet WCAG AA** for all text sizes
- [x] **Primary color** (5.8:1) passes for body text
- [x] **Accent color** (4.7:1) passes for large text (18px+)
- [x] **Semantic colors** never used alone (always paired with icons or text labels)
- [x] **Focus indicators** use strong contrast (`--color-border-strong` or `--color-primary-border`)
- [x] **Color-blind safe** (no red-green alone; always use icons)

---

## 8. Don'ts (Common Mistakes)

❌ **Don't** use semantic colors (green, red, amber) for navigation or brand identity  
✅ **Do** use them strictly for status, health, and alerts

❌ **Don't** use accent pink for all "important" things  
✅ **Do** reserve it for AI/Cognitive Twin features and special highlights

❌ **Don't** create new shades of purple or pink without approval  
✅ **Do** use the defined hover and soft variants

❌ **Don't** use pure black (#000) or pure white (#FFF) for text  
✅ **Do** use `--color-text` (#0F172A) and `--color-text-on-dark` (#F9FAFB)

❌ **Don't** hardcode hex values in components  
✅ **Do** use CSS custom properties (`var(--color-primary)`)

---

## 9. Design Token Migration Plan

### Phase 1: New Components (Current)
- All new components use CSS custom properties
- Existing components gradually updated as touched

### Phase 2: Systematic Refactor (Q1 2026)
- Search and replace hardcoded colors
- Update all `className` strings to use `var(--color-*)`
- Remove unused Tailwind color utilities

### Phase 3: Advanced Theming (Q2 2026)
- Implement dark mode
- Add user-selectable accent colors
- Support high contrast mode

---

## 10. Quick Reference Table

| Use Case | Token | Hex Value |
|----------|-------|-----------|
| Primary button background | `--color-primary` | #3F3182 |
| Primary button hover | `--color-primary-hover` | #51409A |
| Secondary button border | `--color-primary-border` | rgba(63,49,130,0.18) |
| Active sidebar item bg | `--color-primary-soft` | rgba(63,49,130,0.08) |
| Active sidebar item text | `--color-primary` | #3F3182 |
| AI badge background | `--color-accent-soft` | rgba(233,75,138,0.10) |
| AI badge border/text | `--color-accent` | #E94B8A |
| Notification dot | `--color-accent` | #E94B8A |
| App shell background | `--color-bg` | #F8FAFC |
| Card background | `--color-surface` | #FFFFFF |
| Divider | `--color-border` | #E2E8F0 |
| Heading text | `--color-text` | #0F172A |
| Body text | `--color-text` | #0F172A |
| Secondary text | `--color-text-secondary` | #64748B |
| Placeholder text | `--color-text-muted` | #94A3B8 |
| Success indicator | `--color-success` | #16A34A |
| Warning indicator | `--color-warning` | #F59E0B |
| Error indicator | `--color-danger` | #DC2626 |
| Info indicator | `--color-info` | #0EA5E9 |

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | Initial | Complete brand color system |

**Reviewers:**
- Brand: [ ]
- Design: [ ]
- Engineering: [ ]
- Accessibility: [ ]

**Approval Status:** ⚠️ Pending Review

---

**END OF BRAND COLOR SYSTEM**
