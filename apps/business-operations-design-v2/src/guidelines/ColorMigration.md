# Color System Migration Guide

## Overview
Migrating from old blue-navy palette to new Blue-Teal atmospheric system.

## Color Mappings

### Primary Colors
| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `#3F5185` | `#0EA5E9` | Primary blue, interactive elements, accents |
| `#1E2A4A` | `#0C1222` | Dark navy, headers, sidebar, dark sections |
| `#344573` | `#0284C7` | Gradient end (use primaryDark) |

### Import Pattern
```typescript
import { COLORS, TW_COLORS, UI_COLORS } from '@/utils/colors';
```

### Usage Examples

#### Inline Styles (JavaScript)
```tsx
// Before
style={{ backgroundColor: '#3F5185' }}

// After
import { COLORS } from '@/utils/colors';
style={{ backgroundColor: COLORS.primary }}
```

#### Tailwind Classes
```tsx
// Before
className="bg-[#3F5185] text-white"

// After
import { TW_COLORS } from '@/utils/colors';
className={`bg-${TW_COLORS.primary} text-white`}
```

#### Direct Replacement (Simplest)
```tsx
// Before
className="bg-[#3F5185]"

// After
className="bg-[#0EA5E9]"
```

## Files Updated

### ✅ Completed
- [x] `/App.tsx`
- [x] `/components/landing/Hero.tsx`
- [x] `/components/landing/Audience.tsx`
- [x] `/components/landing/AudiencePage.tsx`
- [x] `/utils/colors.ts` (NEW)

### 🔄 In Progress - Workspace Components
- [ ] `/components/DashboardShell.tsx` (23 instances)
- [ ] `/components/intelligence-overlay-new.tsx` (7 instances)
- [ ] `/components/architecture-visualization.tsx` (6 instances)
- [ ] `/components/dashboard-view.tsx` (1 instance)
- [ ] `/components/integrations-hub.tsx` (1 instance)
- [ ] `/components/LayerAudit.tsx` (1 instance)

### 🔄 In Progress - Landing Pages
- [ ] `/components/landing/Comparison.tsx` (5 instances)
- [ ] `/components/landing/Differentiators.tsx` (4 instances)
- [ ] `/components/landing/DifferentiatorsDetail.tsx` (3 instances)
- [ ] `/components/landing/Footer.tsx` (1 instance)
- [ ] `/components/landing/GenericPage.tsx` (2 instances)
- [ ] `/components/landing/Integrations.tsx` (4 instances)
- [ ] `/components/landing/Navbar.tsx` (9 instances)
- [ ] `/components/landing/Pillars.tsx` (9 instances)
- [ ] `/components/landing/Pricing.tsx` (9 instances)
- [ ] `/components/landing/PricingPage.tsx` (15 instances)
- [ ] `/components/landing/TechnicalPage.tsx` (13+ instances)
- [ ] `/components/landing/sections.tsx` (20+ instances)

## Migration Steps

1. ✅ Create centralized color palette (`/utils/colors.ts`)
2. 🔄 Update workspace components (high priority - user-facing)
3. 🔄 Update landing pages
4. ⏭️ Test all pages for visual consistency
5. ⏭️ Remove all legacy color references

## Color System Benefits

- ✅ Single source of truth
- ✅ Type-safe color constants
- ✅ Easy to update across entire app
- ✅ Supports both inline styles and Tailwind
- ✅ Helper functions for opacity and utilities
- ✅ Clear semantic naming

## Notes

- The `/components/website/*` directory already uses CSS variables and is compliant
- Domain-specific workspace views use design token system
- Focus migration on DashboardShell and landing pages first
