# 🚀 IntegrateWise Quick Reference

> **Instant answers for common tasks**

---

## 🎨 Colors: Copy-Paste Ready

### **Current Palette (Teal-Blue)**
```typescript
Primary:    #0EA5E9  // Sky Blue
Accent:     #14B8A6  // Teal
Dark Base:  #0C1222  // Navy Black
CTA Pink:   #F54476  // Brand Pop
```

### **Quick Replace**
```bash
# Old → New
#3F5185 → #0EA5E9  (Primary Blue)
#1E2A4A → #0C1222  (Dark Navy)
#344573 → #0284C7  (Primary Dark)
```

### **Usage (Choose One)**

```tsx
// ✅ Method 1: Direct Hex (Simplest for migration)
className="bg-[#0EA5E9] text-white"

// ✅ Method 2: Import Constants
import { COLORS } from '@/utils/colors';
style={{ backgroundColor: COLORS.primary }}

// ✅ Method 3: Tailwind with Constants
import { TW_COLORS } from '@/utils/colors';
className={`bg-${TW_COLORS.primary} text-white`}

// ✅ Method 4: CSS Variables (For workspace contexts)
className="bg-[var(--iw-blue)] text-white"
```

---

## 📁 Files: Where Is Everything?

### **Documentation**
```bash
/README.md                       # Start here
/PROJECT_STRUCTURE.md            # Complete file tree
/PAGE_STRUCTURE.md               # Routing & navigation
/FRAME_DEFINITIONS.md            # UI frames & layouts
/QUICK_REFERENCE.md              # This file
/guidelines/INDEX.md             # Documentation hub
/guidelines/ColorMigration.md    # Migration checklist
/guidelines/DOCUMENTATION_MAP.md # Visual diagram
```

### **Color System**
```bash
/utils/colors.ts                 # TS constants
/styles/globals.css              # CSS variables
```

### **Components**
```bash
/App.tsx                         # Entry point
/components/landing/*            # Marketing (28 files)
/components/website/*            # Website workspace (6 files)
/components/domains/*            # Deep Dive shells (4 domains)
/components/business-ops/*       # Business Ops context
/components/sales/*              # Sales context
/components/ui/*                 # Shadcn components (45+)
```

---

## 🔍 Search: Find Old Colors Fast

```bash
# Find all old colors
grep -r "#3F5185\|#1E2A4A" components/

# Find in specific directory
grep -r "#3F5185" components/landing/

# Count instances in a file
grep -o "#3F5185\|#1E2A4A" components/DashboardShell.tsx | wc -l

# Find files using color imports
grep -r "from '@/utils/colors'" components/
```

---

## ✅ Migration Checklist (Copy This)

```markdown
## File: [FILENAME]

- [ ] Search for `#3F5185` → Replace with `#0EA5E9`
- [ ] Search for `#1E2A4A` → Replace with `#0C1222`
- [ ] Search for `#344573` → Replace with `#0284C7`
- [ ] Check gradients (from-[old] to-[new])
- [ ] Test visually
- [ ] Mark as complete in ColorMigration.md
```

---

## 📊 Status: Quick Glance

### **✅ Done (17 files)**
- System files (3): colors.ts, globals.css, docs
- Updated (4): App.tsx, Hero.tsx, Audience.tsx, AudiencePage.tsx
- Compliant (10+): website/*, domains/*, auth/*

### **🔄 Next Up (16 files, 113 instances)**
**High Priority (Workspace):**
- DashboardShell.tsx (23)
- intelligence-overlay-new.tsx (7)
- architecture-visualization.tsx (6)

**Medium Priority (Landing):**
- PricingPage.tsx (15)
- TechnicalPage.tsx (13+)
- sections.tsx (20+)

---

## 💻 Import Patterns

```typescript
// Colors
import { COLORS, TW_COLORS, UI_COLORS } from '@/utils/colors';

// Spine (SSOT)
import { useSpineProjection } from '@/components/spine/spine-client';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Domain Shells
import { AccountSuccessShell } from '@/components/domains/account-success/shell';
```

---

## 🎯 Common Tasks

### **Add Color to Component**
```tsx
import { COLORS } from '@/utils/colors';

// Option 1: Inline style
<div style={{ backgroundColor: COLORS.primary }}>

// Option 2: Tailwind
<div className="bg-[#0EA5E9]">

// Option 3: CSS variable
<div className="bg-[var(--iw-blue)]">
```

### **Create Gradient**
```tsx
// Old
className="bg-gradient-to-r from-[#3F5185] to-[#1E2A4A]"

// New
className="bg-gradient-to-r from-[#0EA5E9] to-[#0C1222]"
```

### **Check File Status**
```bash
# View migration guide
cat guidelines/ColorMigration.md

# View project structure
cat PROJECT_STRUCTURE.md

# Check color constants
cat utils/colors.ts
```

---

## 🚨 Rules & Gotchas

### **DO ✅**
- Use `/utils/colors.ts` for new components
- Use CSS variables (`var(--iw-*)`) in workspace contexts
- Test changes visually
- Update ColorMigration.md when done

### **DON'T ❌**
- Use legacy colors (`#3F5185`, `#1E2A4A`)
- Edit `/components/figma/ImageWithFallback.tsx` (protected)
- Mix different color methods in same file
- Forget to check dark mode

---

## 📖 Learn More

| Topic | File |
|-------|------|
| Full project structure | `/PROJECT_STRUCTURE.md` |
| Migration guide | `/guidelines/ColorMigration.md` |
| Color palette | `/utils/colors.ts` |
| CSS tokens | `/styles/globals.css` |
| Documentation hub | `/guidelines/INDEX.md` |
| Visual map | `/guidelines/DOCUMENTATION_MAP.md` |

---

## 🎬 Quick Commands

```bash
# View docs
cat README.md
cat PROJECT_STRUCTURE.md
cat guidelines/ColorMigration.md

# Search old colors
grep -r "#3F5185" components/
grep -r "#1E2A4A" components/

# Count remaining instances
grep -ro "#3F5185\|#1E2A4A" components/ | wc -l

# Find specific file
find . -name "DashboardShell.tsx"

# Check imports
grep -r "from '@/utils/colors'" components/
```

---

## 🔢 Quick Stats

```
Files Total:        180+
Components:         120+
Docs Created:       6
Color System:       Teal-Blue (#0EA5E9, #14B8A6, #0C1222)
Migration:          11% complete (17/150+ files)
Remaining:          16 files, 113 instances
Contexts:           10 workspace contexts
Domains:            4 Deep Dive shells
Views:              30+ specialized
```

---

## 🏆 Priority Order

1. **DashboardShell.tsx** (23 instances) - Main workspace
2. **intelligence-overlay-new.tsx** (7 instances) - AI layer
3. **architecture-visualization.tsx** (6 instances) - Diagrams
4. **PricingPage.tsx** (15 instances) - Landing page
5. **TechnicalPage.tsx** (13+ instances) - Landing page
6. **sections.tsx** (20+ instances) - Landing sections
7. **Navbar.tsx** (9 instances) - Navigation
8. **Pillars.tsx** (9 instances) - Features
9. **Pricing.tsx** (9 instances) - Pricing component
10. **Others** (14 instances across 7 files)

---

## 💡 Pro Tips

1. **Before starting:** Read ColorMigration.md for context
2. **While working:** Use find/replace for consistency
3. **After changes:** Test in both light and dark mode
4. **When done:** Update migration checklist
5. **If stuck:** Check PROJECT_STRUCTURE.md for file locations

---

**Last Updated:** February 12, 2026  
**Status:** 🟡 Migration in Progress  
**Next Action:** Update workspace components (6 files)