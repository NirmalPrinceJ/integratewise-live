# IntegrateWise Brand Identity System

**Version:** 2.0  
**Core Promise:** L0 introduces reality, L3 understands it, L2 reasons about it, L1 is where everyone works.
**Brand Colors:** Navy `#2D4A7C` · White `#FFFFFF`

---

## 1. Logo System

Our mark represents the **4-Layer Architecture** of IntegrateWise OS: L0 (Onboarding) → L3 (Adaptive Spine) → L2 (Cognitive Brain) → L1 (Workplace).

### A. Primary Logo (Horizontal)

Use this for website headers, proposals, and login screens.

* **Geometry:** 4-Node "Interwoven Loops" representing the 4 layers
* **Typography:** *Inter Bold* (Brand) + *Inter Regular* (Tagline: "Operating System")
* **File:** `public/logo-iw-navy.svg` (light backgrounds)
* **File:** `public/logo-iw-white.svg` (dark backgrounds)

### B. App Icon (Logomark)

Use for favicons, mobile app icons, or avatar placeholders.

* **Constraint:** 4 nodes centered in a Navy square container
* **File:** `public/favicon-iw.svg`

```xml
<svg width="600" height="150" viewBox="0 0 600 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IntegrateWise">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
    </style>
  </defs>

  <g transform="translate(40, 45)">
    <path d="M0 30 V 50 C 0 80, 120 80, 120 50 V 30" 
          stroke="#3F51B5" 
          stroke-width="12" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
          
    <path d="M60 30 V 50 C 60 80, 180 80, 180 50 V 30" 
          stroke="#3F51B5" 
          stroke-width="12" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <circle cx="0" cy="30" r="12" fill="#3F51B5"/>
    <circle cx="60" cy="30" r="12" fill="#3F51B5"/>
    <circle cx="120" cy="30" r="12" fill="#3F51B5"/>
    <circle cx="180" cy="30" r="12" fill="#3F51B5"/>
  </g>

  <g transform="translate(240, 0)">
    <text x="0" y="75" 
          font-family="'Inter', sans-serif" 
          font-weight="700" 
          font-size="60" 
          fill="#1E2A4A"
          letter-spacing="-1.5">
      IntegrateWise
    </text>
    
    <text x="2" y="105" 
          font-family="'Inter', sans-serif" 
          font-weight="400" 
          font-size="20" 
          fill="#333333" 
          letter-spacing="0.5">
      Enterprise Integrations
    </text>
  </g>

  <rect x="242" y="125" width="80" height="6" rx="3" fill="#F54476"/>
</svg>
```

### B. App Icon (Logomark)

Use for favicons, mobile app icons, or avatar placeholders.

* **Constraint:** The path is centered in a square container
* **Accent:** Includes the "Action Pink" node to signify completion
* **File:** `public/favicon.svg`

```xml
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" rx="40" fill="#F3F4F6"/>
  
  <g transform="translate(10, 50)">
    <path d="M30 30 V 60 C 30 110, 110 110, 110 60 V 30" stroke="#3F51B5" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M70 30 V 60 C 70 110, 150 110, 150 60 V 30" stroke="#3F51B5" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    
    <circle cx="30" cy="30" r="14" fill="#3F51B5"/>
    <circle cx="70" cy="30" r="14" fill="#3F51B5"/>
    <circle cx="110" cy="30" r="14" fill="#3F51B5"/>
    <circle cx="150" cy="30" r="14" fill="#F54476"/>
  </g>
</svg>
```

### C. Dark Mode Variant

Use for footers or dark-themed dashboards. Text is white; tagline is light indigo.

* **File:** `public/logo-full-dark.svg`

```xml
<svg width="600" height="150" viewBox="0 0 600 150" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IntegrateWise Dark Mode">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
    </style>
  </defs>

  <g transform="translate(40, 45)">
    <path d="M0 30 V 50 C 0 80, 120 80, 120 50 V 30" 
          stroke="#5C6BC0" 
          stroke-width="12" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
          
    <path d="M60 30 V 50 C 60 80, 180 80, 180 50 V 30" 
          stroke="#5C6BC0" 
          stroke-width="12" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <circle cx="0" cy="30" r="12" fill="#5C6BC0"/>
    <circle cx="60" cy="30" r="12" fill="#5C6BC0"/>
    <circle cx="120" cy="30" r="12" fill="#5C6BC0"/>
    <circle cx="180" cy="30" r="12" fill="#5C6BC0"/>
  </g>

  <g transform="translate(240, 0)">
    <text x="0" y="75" 
          font-family="'Inter', sans-serif" 
          font-weight="700" 
          font-size="60" 
          fill="#FFFFFF"
          letter-spacing="-1.5">
      IntegrateWise
    </text>
    
    <text x="2" y="105" 
          font-family="'Inter', sans-serif" 
          font-weight="400" 
          font-size="20" 
          fill="#A5B4FC" 
          letter-spacing="0.5">
      Enterprise Integrations
    </text>
  </g>

  <rect x="242" y="125" width="80" height="6" rx="3" fill="#F54476"/>
</svg>
```

---

## 2. Color Palette

**Brand Colors (Constitution v1):** Navy `#2D4A7C` · White `#FFFFFF`

Our colors are professional, cool, and high-contrast. The 4-layer architecture is represented by a unified Navy color across all nodes.

| Swatch | Role | Hex Code | Usage |
|--------|------|----------|-------|
| 🔵 | **Brand Navy** | `#2D4A7C` | Primary Brand Color, Logo, Headings |
| ⚪ | **Brand White** | `#FFFFFF` | Text on Navy, Light Mode Backgrounds |
| 🌊 | **L3 Spine Dark** | `#1D3A6C` | Spine Layer accents |
| 🌀 | **L2 Cognitive** | `#4A6A9C` | Cognitive Layer accents |
| ☁️ | **Surface** | `#F3F4F6` | Page Backgrounds (Light Mode) |
| ⬜ | **Card** | `#FFFFFF` | Content Containers, Modals |

### 4-Layer Architecture Colors

```
L0 (Onboarding)   → #2D4A7C (Navy)
L3 (Spine)        → #1D3A6C (Deep Navy)
L2 (Cognitive)    → #4A6A9C (Light Navy)
L1 (Workplace)    → #2D4A7C (Navy)
```

### CSS Variables

```css
:root {
  /* Brand - Constitution v1 */
  --brand-navy: #2D4A7C;
  --brand-white: #FFFFFF;
  
  /* Layer Colors */
  --l0-onboarding: #2D4A7C;
  --l1-workplace: #2D4A7C;
  --l2-cognitive: #4A6A9C;
  --l3-spine: #1D3A6C;

  /* Surfaces */
  --bg-app: #F3F4F6;
  --bg-card: #FFFFFF;
  --bg-dark: #2D4A7C;
  --border-subtle: #E5E7EB;

  /* Typography */
  --text-main: #111827;
  --text-muted: #6B7280;
  --text-on-dark: #FFFFFF;
  --text-on-dark-muted: #A5B4FC;
}
```

---

## 3. Typography

We use **Inter** (Google Font) for its legibility in dense interfaces and technical dashboards.

| Style | Weight | Tracking | Usage |
|-------|--------|----------|-------|
| **Headings** | Inter Bold (700) | `-1px` or `-0.02em` | Solid, authoritative feel |
| **Body** | Inter Regular (400) | Standard | General content |
| **Labels/UI** | Inter Medium (500) | Standard | Buttons, navigation |
| **Taglines** | Inter Medium (500) | `+1.5px` | Uppercase subtitles |

### Import

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 4. Usage Rules

### Clear Space (Exclusion Zone)

Always maintain clear space around the logo equal to the **diameter of one node** (approx 14px at standard size) to ensure legibility.

### ✅ Do

- Use the logo on light (`#F3F4F6`, `#FFFFFF`) or dark (`#1E2A4A`) backgrounds
- Maintain aspect ratio when scaling
- Use the dark variant on dark backgrounds

### ❌ Don't

- Add drop shadows to the logo (keep it flat)
- Change the path color to the accent pink (path must remain Blue/Navy)
- Rotate the logo (flow is strictly horizontal)
- Place on busy/patterned backgrounds
- Stretch or distort the geometry

---

## 5. Logo Geometry Specification

The "Interwoven Loops" pattern represents:

```
Node 1 ──────────────────────── Node 3
   │                              │
   └──────── Loop 1 ──────────────┘
   
       Node 2 ──────────────────────── Node 4
          │                              │
          └──────── Loop 2 ──────────────┘
```

- **Loop 1** connects nodes at positions 0 and 120 (horizontal units)
- **Loop 2** connects nodes at positions 60 and 180 (horizontal units)
- Loops intersect creating the "interwoven" visual
- Node 4 uses accent color (`#F54476`) in icon variant to signify completion

---

## 6. File Export List

| File | Purpose | Location |
|------|---------|----------|
| `logo-full-light.svg` | Web Header (Light Mode) | `public/` |
| `logo-full-dark.svg` | Footer (Dark Mode) | `public/` |
| `logo.svg` | General use | `public/` |
| `favicon.svg` | Browser Tab, App Icon | `public/` |
| `social-share.png` | 1200x630px, Logo on #F3F4F6 | `public/` |

---

## 7. Constitution Reference

This brand identity is part of the IntegrateWise OS Constitution. See:
- [CANONICAL_OS_LAYER_MODEL.md](./CANONICAL_OS_LAYER_MODEL.md)

---

**© IntegrateWise Inc. — All Rights Reserved**
