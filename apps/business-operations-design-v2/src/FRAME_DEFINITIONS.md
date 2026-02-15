# IntegrateWise Frame Definitions

> **Detailed specifications for all UI frames, layouts, and shell components**

---

## 🎯 What is a "Frame"?

A **Frame** is a reusable layout container that defines:
- **Structure:** Header, sidebar, content area arrangement
- **Navigation:** How users move between views
- **Visual Design:** Color scheme, spacing, typography
- **Behavior:** Responsive breakpoints, animations, interactions
- **State Management:** What persists across navigation

IntegrateWise uses **5 primary frames** to structure the entire application.

---

## 📐 Frame Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRAME HIERARCHY                          │
└─────────────────────────────────────────────────────────────┘

Level 1: Marketing Landing Frame
         ├─→ Navbar (sticky)
         ├─→ Content (scrollable)
         └─→ Footer (static)

Level 2: Centered Auth Frame
         └─→ Form Card (centered on gradient)

Level 3: Workspace Shell Frame
         ├─→ Sidebar (fixed left)
         ├─→ Top Bar (fixed top)
         ├─→ Content Area (scrollable)
         └─→ Intelligence Overlay (floating right)

Level 4: Domain Deep Dive Frame
         ├─→ Workspace Sidebar (inherited)
         ├─→ Domain Sidebar (nested left)
         ├─→ View Content (scrollable)
         └─→ Intelligence Overlay (domain-specific)

Level 5: Settings Frame
         ├─→ Header (back button)
         └─→ Content (tabbed)
```

---

## 🖼️ Frame 1: Marketing Landing

### **Visual Structure**
```
┌─────────────────────────────────────────────────────────────┐
│ Navbar (h: 80px, sticky)                                    │
│ [Logo] [Features▾] [Solutions▾] [Pricing] [Docs] [Login]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Content Area                             │
│                    (Dynamic sections)                        │
│                                                             │
│  • Hero Section (h: 100vh)                                  │
│  • Problem Section                                          │
│  • Features/Pillars                                         │
│  • Integrations                                             │
│  • Pricing                                                  │
│  • CTA Section                                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer (bg: #0C1222)                                        │
│ [Product] [Company] [Resources] [Legal] [Social]            │
└─────────────────────────────────────────────────────────────┘
```

### **Implementation**
- **File:** `/components/landing/Layout.tsx` (wrapper)
- **Components:**
  - `Navbar.tsx` - Top navigation
  - `Footer.tsx` - Bottom navigation & links
  - Dynamic page content (Hero, Audience, Pricing, etc.)

### **Color Scheme**
```css
Background:       #FFFFFF (white) or #F8FAFC (light gray)
Navbar:           rgba(255,255,255,0.95) with backdrop-blur
Footer:           #0C1222 (Navy Black)
Text Primary:     #0C1222 (Navy Black)
Accents:          #0EA5E9 (Sky Blue), #14B8A6 (Teal)
CTA Buttons:      #F54476 (Pink)
```

### **Responsive Behavior**
| Breakpoint | Navbar | Content | Footer |
|------------|--------|---------|--------|
| **Desktop** (1280px+) | Full horizontal menu | 3-column layouts | 5-column links |
| **Tablet** (768px-1279px) | Compact menu | 2-column layouts | 3-column links |
| **Mobile** (<768px) | Hamburger menu | Stacked sections | Stacked links |

### **Navigation Pattern**
- **Scroll behavior:** Smooth scroll to sections
- **Sticky navbar:** Always visible at top
- **Dropdown menus:** Features & Solutions have submenus
- **CTA prominence:** "Sign Up" button highlighted throughout

### **Pages Using This Frame**
- `/` (Home)
- `/audience`
- `/pricing`
- `/technical`
- `/problem`
- `/differentiators`
- `/product/:productId`

---

## 🔐 Frame 2: Centered Authentication

### **Visual Structure**
```
┌─────────────────────────────────────────────────────────────┐
│                  Gradient Background                        │
│             (from-[#0C1222] to-[#0284C7])                   │
│                                                             │
│         ┌───────────────────────────────────┐               │
│         │         [IntegrateWise Logo]      │               │
│         │                                   │               │
│         │  ┌─────────────────────────────┐  │               │
│         │  │  Login / Sign Up Form        │  │               │
│         │  │                             │  │               │
│         │  │  Email    [____________]     │  │               │
│         │  │  Password [____________]     │  │               │
│         │  │                             │  │               │
│         │  │  [Sign In with Google]      │  │               │
│         │  │  [Sign In with Microsoft]   │  │               │
│         │  │                             │  │               │
│         │  │  [Continue →]               │  │               │
│         │  │                             │  │               │
│         │  │  Terms · Privacy            │  │               │
│         │  └─────────────────────────────┘  │               │
│         │                                   │               │
│         │  Don't have an account? Sign up   │               │
│         └───────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Implementation**
- **Files:** 
  - `/components/auth/login-page.tsx`
  - `/components/auth/signup-page.tsx`
- **Layout:** Centered card with max-width constraint
- **Validation:** Real-time form validation
- **OAuth:** Google & Microsoft SSO buttons

### **Color Scheme**
```css
Background:       Linear gradient from #0C1222 to #0284C7
Card:             #FFFFFF with shadow
Input Fields:     #F8FAFC with #E2E8F0 border
Primary Button:   #0EA5E9 (Sky Blue)
OAuth Buttons:    White with brand logos
Text:             #0C1222 (Navy Black)
Links:            #0EA5E9 (Sky Blue)
```

### **Responsive Behavior**
| Breakpoint | Card Width | Padding | Logo Size |
|------------|------------|---------|-----------|
| **Desktop** (1280px+) | 480px | 48px | Large |
| **Tablet** (768px-1279px) | 400px | 32px | Medium |
| **Mobile** (<768px) | 90vw | 24px | Small |

### **Form Validation**
- **Email:** Real-time regex validation
- **Password:** 
  - Minimum 8 characters
  - Must include uppercase, lowercase, number
  - Strength indicator (weak/medium/strong)
- **Error States:** Red border + error message below field
- **Success States:** Green checkmark icon

### **Pages Using This Frame**
- `/login`
- `/signup`

---

## 🏢 Frame 3: Workspace Shell

### **Visual Structure**
```
┌─────────┬───────────────────────────────────────────────────┐
│         │  Top Bar (h: 64px)                                │
│         │  [Context Name] [Search] [Cmd+K] [🔔] [👤]        │
│ Sidebar ├───────────────────────────────────────────────────┤
│ (256px) │                                                   │
│         │                 Content Area                       │
│ Logo    │                 (Context Views)                    │
│         │                                                   │
│ Nav:    │  ┌─────────────────────────────────────────────┐  │
│ • Home  │  │ Dashboard KPIs (4-column)                   │  │
│ • Ctx1  │  ├─────────────────────────────────────────────┤  │
│ • Ctx2  │  │ Charts & Visualizations                     │  │
│ • Ctx3  │  ├─────────────────────────────────────────────┤  │
│ ...     │  │ Data Tables                                 │  │
│ • Ctx10 │  ├─────────────────────────────────────────────┤  │
│         │  │ Recent Activity Feed                        │  │
│ [AI 🤖] │  └─────────────────────────────────────────────┘  │
│ [Deep▾] │                                                   │
│         │                                                   │
│ [⚙️]    │                                                   │
│ [👤]    │                                                   │
└─────────┴───────────────────────────────────────────────────┘
                                                        │
                                    ┌───────────────────┘
                                    │
                          ┌─────────▼─────────┐
                          │ Intelligence      │
                          │ Overlay (400px)   │
                          │                   │
                          │ [AI Chat]         │
                          │ [Insights]        │
                          │ [Agents]          │
                          │                   │
                          └───────────────────┘
                          (Togglable drawer)
```

### **Implementation**
- **File:** `/components/DashboardShell.tsx` (main container)
- **Components:**
  - `sidebar.tsx` - Left navigation (256px fixed)
  - `top-bar.tsx` - Top bar with search & user menu
  - `intelligence-overlay-new.tsx` - AI drawer (right side)
  - Context-specific content area

### **Color Scheme**
```css
Sidebar Background:    #0C1222 (Navy Black)
Sidebar Text:          #FFFFFF (white)
Active Item:           #FFFFFF bg, #0C1222 text
Hover Item:            rgba(255,255,255,0.05)

Top Bar Background:    #FFFFFF (white)
Top Bar Border:        #E2E8F0 (bottom border)

Content Background:    #F8FAFC (light gray)
Card Background:       #FFFFFF (white)
Card Border:           #E2E8F0

Primary Accents:       #0EA5E9 (Sky Blue)
Secondary Accents:     #14B8A6 (Teal)
```

### **Sidebar Navigation**
```typescript
Structure:
├── Logo (top)
├── Context Switcher (10 contexts)
│   ├── Website
│   ├── Sales
│   ├── Marketing
│   ├── Business Ops
│   ├── Customer Success
│   ├── Finance
│   ├── Product
│   ├── Engineering
│   ├── Admin
│   └── Analytics
├── Divider
├── Deep Dive (dropdown)
│   ├── Account Success
│   ├── RevOps
│   ├── SalesOps
│   └── Personal
├── Divider
├── AI Intelligence (button)
├── Settings (bottom)
└── User Avatar (bottom)
```

### **Top Bar Elements**
```typescript
Left Side:
├── Context Name (large heading)
├── Breadcrumbs (if applicable)

Center:
└── Search bar (Cmd+K trigger)

Right Side:
├── Command Palette icon (Cmd+K)
├── Notifications bell (🔔)
└── User avatar dropdown
    ├── Profile
    ├── Settings
    ├── Subscriptions
    └── Logout
```

### **Responsive Behavior**
| Breakpoint | Sidebar | Top Bar | Content | Intelligence |
|------------|---------|---------|---------|--------------|
| **Desktop** (1280px+) | Fixed 256px | Full | Flex grow | 400px drawer |
| **Tablet** (768px-1279px) | Collapsible | Compact | Full width | Full overlay |
| **Mobile** (<768px) | Hidden (drawer) | Mobile menu | Full | Full screen modal |

### **State Management**
- **Active Context:** Stored in URL + localStorage
- **Sidebar Collapsed:** localStorage toggle
- **Intelligence Open:** Session state
- **Search History:** localStorage cache

### **Pages Using This Frame**
- All `/workspace/*` routes (10 contexts)
- All context dashboards
- Cross-workspace analytics

---

## 🔬 Frame 4: Domain Deep Dive

### **Visual Structure**
```
┌────────┬────────┬──────────────────────────────────────────┐
│        │ Domain │  Domain Top Bar (h: 64px)                │
│ Work   │ Side   │  [Domain Name] [← Back] [View: ▾]        │
│ space  │ bar    ├──────────────────────────────────────────┤
│ Side   │ (240px)│                                          │
│ bar    │        │           View Content Area               │
│ (256px)│ Views: │                                          │
│        │        │  Account Success Domain Example:         │
│ [Ctx]  │ • 1-17 │  ┌────────────────────────────────────┐  │
│ ...    │        │  │ Account Master View                │  │
│        │ [Intel]│  │                                    │  │
│ [AI]   │ [Spine]│  │ ┌──────────────────────────────┐   │  │
│        │        │  │ │ Health Score Timeline        │   │  │
│        │        │  │ │ (Chart visualization)        │   │  │
│        │        │  │ └──────────────────────────────┘   │  │
│        │        │  │                                    │  │
│        │        │  │ ┌──────────────────────────────┐   │  │
│        │        │  │ │ Risk Indicators (cards)      │   │  │
│        │        │  │ └──────────────────────────────┘   │  │
│        │        │  │                                    │  │
│        │        │  │ ┌──────────────────────────────┐   │  │
│        │        │  │ │ Engagement Log (table)       │   │  │
│        │        │  │ └──────────────────────────────┘   │  │
│        │        │  └────────────────────────────────────┘  │
│        │        │                                          │
└────────┴────────┴──────────────────────────────────────────┘
```

### **Implementation**
- **Files:**
  - `/components/domains/[domain]/shell.tsx` - Domain container
  - `/components/domains/domain-sidebar.tsx` - Domain navigation
  - `/components/domains/[domain]/views/*.tsx` - Individual views
  - `/components/domains/[domain]/intelligence-overlay.tsx` - Domain AI

### **Dual Sidebar Pattern**
```
Left Sidebar (Workspace):
├── Width: 256px (fixed)
├── Always visible
├── Context switching
└── Domain entry points

Middle Sidebar (Domain):
├── Width: 240px (fixed)
├── View navigation (17+ views for Account Success)
├── Intelligence panel trigger
├── Spine readiness indicator
└── View-specific actions
```

### **Domain Top Bar**
```typescript
Left Side:
├── Domain Icon
├── Domain Name (e.g., "Account Success")
└── Back to Workspace button

Center:
└── View Selector Dropdown
    ├── Account Master
    ├── Business Context
    ├── People & Team
    ├── Platform Health
    └── ... (13 more views)

Right Side:
├── View-specific actions
└── Share/Export buttons
```

### **Color Scheme**
```css
Domain Sidebar:
  Background:        #FFFFFF (white)
  Border:            #E2E8F0 (right border)
  Active View:       #0EA5E9 bg, white text
  Hover:             #F8FAFC

View Content:
  Background:        #F8FAFC (light gray)
  Card:              #FFFFFF (white)
  Section Borders:   #E2E8F0

Domain Accents:
  Account Success:   #14B8A6 (Teal)
  RevOps:            #0EA5E9 (Sky Blue)
  SalesOps:          #7B5EA7 (Purple)
  Personal:          #F54476 (Pink)
```

### **Account Success Views (17 Views)**
```typescript
Navigation Hierarchy:
├── Overview
│   └── Account Master View
├── Business Context
│   ├── Business Context View
│   ├── Strategic Objectives
│   └── Value Streams
├── People & Organization
│   ├── People & Team View
│   └── Stakeholder Outcomes
├── Platform & Health
│   ├── Platform Health View
│   ├── API Portfolio
│   └── Capabilities View
├── Planning & Execution
│   ├── Success Plans
│   ├── Initiatives
│   └── Task Manager
├── Engagement & Risk
│   ├── Engagement Log
│   ├── Risk Register
│   └── Insights View
└── Meetings & Documents
    ├── Meetings View
    └── Documents View
```

### **Responsive Behavior**
| Breakpoint | Workspace Sidebar | Domain Sidebar | Content | View Selector |
|------------|-------------------|----------------|---------|---------------|
| **Desktop** (1280px+) | Fixed 256px | Fixed 240px | Flex | Dropdown |
| **Tablet** (768px-1279px) | Collapsible | Tabs at top | Full | Tabs |
| **Mobile** (<768px) | Hidden | Select menu | Full | Select |

### **Pages Using This Frame**
- `/workspace/domain/account-success` (+ 17 views)
- `/workspace/domain/revops` (+ 8 views)
- `/workspace/domain/salesops` (+ 6 views)
- `/workspace/domain/personal` (+ 5 views)

---

## ⚙️ Frame 5: Settings & Management

### **Visual Structure**
```
┌─────────────────────────────────────────────────────────────┐
│  Header (h: 64px)                                           │
│  [← Back to Workspace]  Settings                     [👤]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tabs: [Profile] [Security] [Billing] [Team] [API]   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │              Active Tab Content                       │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Form Section 1                                 │  │   │
│  │  │ • Field 1  [_______________]                   │  │   │
│  │  │ • Field 2  [_______________]                   │  │   │
│  │  │ • Field 3  [▾ dropdown    ▾]                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Form Section 2                                 │  │   │
│  │  │ • Setting toggle  [○━━━━━━]                    │  │   │
│  │  │ • Setting toggle  [━━━━━━●]                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  [Cancel]  [Save Changes →]                          │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Implementation**
- **Files:**
  - `/components/profile-page.tsx`
  - `/components/settings-page.tsx`
  - `/components/subscriptions-page.tsx`
  - `/components/admin/tenant-manager.tsx`
  - `/components/admin/rbac-manager.tsx`
  - `/components/admin/user-management.tsx`

### **Tab Structure**
```typescript
Profile Tab:
├── Avatar upload
├── Name & email
├── Bio
└── Social links

Security Tab:
├── Change password
├── Two-factor auth
├── Active sessions
└── Login history

Billing Tab (Subscriptions):
├── Current plan
├── Payment method
├── Billing history
└── Upgrade options

Team Tab:
├── Team members list
├── Invite users
├── Role management
└── Permissions

API Tab (Admin):
├── API keys
├── Webhooks
├── Rate limits
└── Documentation links
```

### **Color Scheme**
```css
Header:              #FFFFFF with bottom border #E2E8F0
Background:          #F8FAFC
Content Card:        #FFFFFF
Tab Active:          #0EA5E9 (border-bottom)
Tab Inactive:        #64748B (gray text)
Form Inputs:         #FFFFFF with #E2E8F0 border
Primary Button:      #0EA5E9
Danger Button:       #FF4757 (delete actions)
```

### **Form Patterns**
- **Input Fields:** Full-width with labels above
- **Dropdowns:** Custom styled with Shadcn select
- **Toggles:** Switch component for boolean settings
- **Save Button:** Sticky at bottom on mobile, fixed in view on desktop
- **Validation:** Real-time with error messages below fields

### **Responsive Behavior**
| Breakpoint | Tabs | Content | Actions |
|------------|------|---------|---------|
| **Desktop** (1280px+) | Horizontal | 2-column forms | Bottom right |
| **Tablet** (768px-1279px) | Horizontal | 1-column | Bottom right |
| **Mobile** (<768px) | Dropdown | 1-column | Sticky bottom |

### **Pages Using This Frame**
- `/profile`
- `/settings`
- `/subscriptions`
- `/workspace/admin/*` (admin-only)

---

## 🎨 Shared Frame Elements

### **Intelligence Overlay** (Cross-Frame Component)
```
┌────────────────────────┐
│ Intelligence Overlay   │
│ ──────────────────────│
│ Width: 400px (desktop) │
│ Position: Fixed right  │
│ Z-index: 50            │
│                        │
│ Tabs:                  │
│ • Chat                 │
│ • Agents               │
│ • Insights             │
│                        │
│ [Chat Interface]       │
│ ┌──────────────────┐   │
│ │ Message bubble   │   │
│ │ AI response...   │   │
│ └──────────────────┘   │
│                        │
│ [Input field + Send]   │
└────────────────────────┘

Available in:
✅ Frame 3 (Workspace Shell)
✅ Frame 4 (Domain Deep Dive)
❌ Frame 1 (Marketing)
❌ Frame 2 (Auth)
❌ Frame 5 (Settings)
```

### **Command Palette** (Global)
```
Triggered by: Cmd+K (Mac) or Ctrl+K (Windows)
Position: Center overlay
Width: 600px (max)
Height: 400px (max)

Features:
├── Quick navigation (all contexts)
├── Search (entities, views, docs)
├── Actions (create, edit, delete)
└── Recent items

Appearance:
├── Dark mode backdrop (rgba(0,0,0,0.5))
├── White card with shadow
├── List with keyboard navigation
└── Fuzzy search matching
```

### **Notification Center**
```
Triggered by: Bell icon in Top Bar
Position: Dropdown below bell
Width: 400px
Max Height: 600px

Structure:
├── Header "Notifications" + [Mark all read]
├── Filter tabs: All | Unread | Mentions
├── Notification list (scrollable)
│   ├── Notification item (icon + text + time)
│   └── ... (repeat)
└── Footer "View all →"

Available in:
✅ Frame 3 (Workspace Shell)
✅ Frame 4 (Domain Deep Dive)
❌ Frames 1, 2, 5
```

---

## 🔄 Frame Transitions

### **Marketing → Auth**
```
Animation: Fade out marketing, fade in auth
Duration: 300ms
Easing: ease-in-out
Preserve: None (clean slate)
```

### **Auth → Workspace**
```
Animation: Fade in sidebar, slide in content
Duration: 400ms
Easing: ease-out
Preserve: User session, redirect path
```

### **Context Switch (Within Workspace)**
```
Animation: Cross-fade content area
Duration: 200ms
Easing: ease-in-out
Preserve: Sidebar state, intelligence overlay state
```

### **Domain Entry (Workspace → Domain)**
```
Animation: Slide in domain sidebar from left
Duration: 300ms
Easing: ease-out
Preserve: Workspace context, intelligence state
```

---

## 📱 Mobile-First Considerations

### **Frame Adaptations**

#### **Frame 1 (Marketing) - Mobile**
- Hamburger menu replaces horizontal nav
- Hero text scales down (from 4xl to 2xl)
- Multi-column sections stack vertically
- CTA buttons full-width

#### **Frame 3 (Workspace) - Mobile**
- Sidebar becomes bottom drawer
- Top bar shows hamburger + logo + avatar
- Content area full-screen
- Intelligence overlay becomes full-screen modal

#### **Frame 4 (Domain) - Mobile**
- Both sidebars hidden
- View selector as top dropdown
- Single view at a time
- Bottom nav for common actions

---

## 🎯 Frame Selection Guide

**Use Frame 1 (Marketing)** when:
- Content is public
- Need SEO optimization
- Showcasing product features
- Converting visitors to users

**Use Frame 2 (Auth)** when:
- User authentication required
- Onboarding flow
- Password reset
- Email verification

**Use Frame 3 (Workspace)** when:
- User is authenticated
- Managing data across multiple contexts
- Need quick context switching
- General workspace operations

**Use Frame 4 (Domain)** when:
- Deep analysis required
- Multiple related views
- Domain-specific workflows
- Specialized operations (CSM, RevOps, etc.)

**Use Frame 5 (Settings)** when:
- User/account configuration
- Administrative tasks
- Billing/subscription management
- API key management

---

## 🛠️ Frame Customization

### **Creating a New Frame**
```typescript
1. Define layout structure
2. Create shell component in /components
3. Configure in /routes.ts
4. Apply color scheme
5. Add responsive breakpoints
6. Test navigation flow
```

### **Modifying Existing Frame**
```typescript
1. Locate frame file (e.g., DashboardShell.tsx)
2. Update structure/styles
3. Test across all routes using frame
4. Update this documentation
```

---

## 📊 Frame Usage Statistics

| Frame | Routes | Components | Lines of Code |
|-------|--------|------------|---------------|
| **Frame 1** | 7 | 28 | ~3,200 |
| **Frame 2** | 2 | 2 | ~800 |
| **Frame 3** | 10 | 40+ | ~5,000 |
| **Frame 4** | 4 domains | 30+ views | ~7,500 |
| **Frame 5** | 4 | 8 | ~1,500 |

---

## 🔗 Related Documentation

- **[PAGE_STRUCTURE.md](./PAGE_STRUCTURE.md)** - Complete page hierarchy
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File organization
- **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** - Architecture principles

---

**Version:** 1.0  
**Last Updated:** February 12, 2026  
**Maintained By:** IntegrateWise Team
