# IntegrateWise OS - Universal Hub Shell Specification

**Version:** 2.0  
**Last Updated:** January 17, 2026  
**Status:** Implementation Ready

---

## 1. Overview & Architecture

### 1.1 Core Principle

**"Identity in Profile, Projection in Topbar, Sections in Sidebar"**

The Universal Hub is a **single-shell architecture** where all views (Personal, Business, CS, Sales, Marketing, PM, Admin, Internal) are rendered inside the same container. There are no separate shells per persona or mode.

### 1.2 User Journey Context

The Universal Hub is reached after the 6-step FTUX onboarding flow:

1. Landing → Login → Persona Analysis → Persona Insights → Load Your Data → AI Loader
2. User completes One-Click Loader (Stage 7-12)
3. Shell initializes with **Profile-driven defaults**

### 1.3 Key Components

- **Topbar**: Displays current projection + "Change view..." control
- **Sidebar**: Collapsible navigation (sections driven by Profile preferences)
- **Content Area**: Dynamic hub view based on current projection
- **Footer**: (Future: AI assistant, quick actions)

### 1.4 Brand Color System

IntegrateWise OS uses a structured color palette to reinforce brand identity:

- **Primary (#3F3182)**: Spine/Hub architecture — stability, trust, core infrastructure
- **Accent (#E94B8A)**: Cognitive Twin/Neutron — AI intelligence, innovation, energy
- **Neutrals**: Clean UI shell (backgrounds, borders, text hierarchy)
- **Semantics**: Status-only colors (success, warning, danger, info)

**Full specification:** See `/BRAND_COLOR_SYSTEM.md` for complete token definitions, usage guidelines, and accessibility requirements.

**Implementation:** All components use CSS custom properties defined in `/src/styles/theme.css`:
```tsx
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-dark)]">
  Save Changes
</button>
```

---

## 2. State Model (Explicit Definition)

### 2.1 Persistent State (Profile)

Stored in database, synced via API, cached in `localStorage`:

```typescript
interface ProfilePreferences {
  // View defaults
  defaultMode: 'Personal' | 'Work';
  defaultWorkView: 'Business' | 'CS' | 'Sales' | 'Marketing' | 'PM' | 'Admin' | 'Internal';
  
  // Enabled sections (controls sidebar + Change view... list)
  enabledSections: {
    personal: boolean;           // Always true
    business: boolean;
    customerSuccess: boolean;
    sales: boolean;
    marketing: boolean;
    productManagement: boolean;
    admin: boolean;
    internal: boolean;
    integrations: boolean;
    webhooks: boolean;
    settings: boolean;           // Always true
  };
  
  // Work mode preference (from Persona Insights)
  workMode: 'momentum' | 'clarity' | 'automation' | 'craft';
}
```

**Storage keys:**
- `iwDefaultMode` → `'Personal' | 'Work'`
- `iwDefaultWorkView` → `'Business' | 'CS' | 'Sales' | ...`
- `iwEnabledSections` → JSON object

### 2.2 Session State (Runtime)

Held in React component state, not persisted:

```typescript
interface SessionState {
  currentMode: 'Personal' | 'Work';
  currentWorkView: 'Business' | 'CS' | 'Sales' | 'Marketing' | 'PM' | 'Admin' | 'Internal';
  currentHub: 'home' | 'today' | 'profile' | 'settings' | 'integrations' | 'webhooks';
  
  // UI state
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  hasTemporarilySwitched: boolean;  // Triggers "Make default" CTA
}
```

### 2.3 Initialization Flow

**On shell mount:**

1. **Load Profile preferences** (from API or localStorage fallback)
2. **Initialize session state:**
   ```typescript
   currentMode = profilePrefs.defaultMode
   currentWorkView = profilePrefs.defaultWorkView
   ```
3. **Compute topbar label** from current state
4. **Build sidebar sections** from `enabledSections`
5. **Render content** for current projection

---

## 3. Topbar: Profile-Driven Projection

### 3.1 Visual Structure

**Layout (flexbox):**

```
┌────────────────────────────────────────────────────────��────────┐
│ [Mobile ☰] [Current View Label]    [Change view...] [🔍] [🔔] [👤] │
│            [Optional subtitle]                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Left stack:**
- **Mobile hamburger** (only on `<lg` breakpoint)
- **Primary label** (computed from `currentMode` + `currentWorkView`):
  - Personal mode: `"Personal Workspace"`
  - Work mode: `"Work – {View Label}"`
    - Business: `"Work – Business Hub"`
    - CS: `"Work – Customer Success"`
    - Sales: `"Work – Sales Hub"`
    - etc.
- **Subtitle** (optional, only in Work mode):
  - Shows work mode description from persona
  - Examples:
    - `"Momentum Mode – Focused on clean syncs and flow"`
    - `"Clarity Mode – Insight-driven analysis"`

**Right stack:**
- **"Change view..."** button (secondary/bordered style)
- **Search** icon button (hidden on mobile)
- **Notifications** icon button (with badge if unread)
- **User avatar** (gradient circle, shows first initial)

### 3.2 "Change view..." Popover

**Trigger:** Click "Change view..." button

**Popover structure:**

```
┌────────────────────────────────────────┐
│ Current Mode (read-only)               │
│ ────────────────────────────────────── │
│ You're currently in {mode}: {view}.    │
│ 🔧 Edit default view in Profile        │
├────────────────────────────────────────┤
│ QUICK SWITCH (THIS SESSION ONLY)      │
│ ────────────────────────────────────── │
│                                        │
│ [Scrollable list of views - max 400px]│
│   📊 Personal Workspace                │
│      Your personal goals and tasks     │
│                                        │
│   💼 Business Hub                      │
│      Owner cockpit with MRR metrics    │
│                                        │
│   👥 Customer Success                  │
│      Account health and renewals       │
│   ...                                  │
│                                        │
├────────────────────────────────────────┤
│ [Make this my default view] (optional) │
│ Saved. You'll land here next time.     │
└────────────────────────────────────────┘
```

**Section 1: Current Mode (always shown)**
- Text adapts based on `currentMode`:
  - Personal: `"You're currently in Personal mode."`
  - Work: `"You're currently in Work mode: {Business | CS | Sales | ...}."`
- Link: `"Edit default view in Profile"` → navigates to `/profile` (closes popover)

**Section 2: Quick Switch List**
- Header: `"Quick switch (this session only)"`
- Shows **only enabled views** from `profilePrefs.enabledSections`
- Grouped visually:
  - **Personal Workspace** (if user is in Work mode)
  - **Work views** (if user is in Personal mode, prefixed with "Switch to a work hub:")
- Each item:
  - Icon (hub-specific)
  - Label
  - Description (one line)
  - Current view is **highlighted** and **disabled**
- Clicking a view:
  - Updates `sessionState.currentMode` and `sessionState.currentWorkView`
  - Sets `sessionState.hasTemporarilySwitched = true`
  - Closes popover
  - **Does NOT update Profile defaults**

**Section 3: Make Default (conditional)**
- Only appears if `hasTemporarilySwitched === true`
- Button: `"Make this my default view"`
- On click:
  - Calls API: `PUT /api/user/preferences` (or updates localStorage)
  - Updates `profilePrefs.defaultMode` and `profilePrefs.defaultWorkView`
  - Shows confirmation: `"Saved. You'll land here next time."`
  - Sets `hasTemporarilySwitched = false`

### 3.3 State Transitions

**Scenario 1: User opens shell**
```
Profile: defaultMode=Work, defaultWorkView=Business
↓
Session: currentMode=Work, currentWorkView=Business
↓
Topbar label: "Work – Business Hub"
```

**Scenario 2: User switches temporarily**
```
User clicks "Change view..." → selects "Customer Success"
↓
Session: currentMode=Work, currentWorkView=CS
hasTemporarilySwitched=true
↓
Topbar label: "Work – Customer Success"
Popover: Shows "Make this my default view" button
```

**Scenario 3: User makes it permanent**
```
User clicks "Make this my default view"
↓
API call: PUT /api/user/preferences {defaultWorkView: 'CS'}
↓
Profile: defaultWorkView=CS
hasTemporarilySwitched=false
↓
Next session: Opens directly to CS view
```

### 3.4 Permission Scoping

**Rule:** Only enabled views appear in "Change view..." list.

**Implementation:**
```typescript
const availableViews = ALL_VIEWS.filter(view => {
  if (view.id === 'Personal') return true;  // Always available
  return profilePrefs.enabledSections[view.sectionKey];
});
```

**If a view is disabled:**
- It does **not appear** in the Quick Switch list
- It cannot be set as `defaultWorkView` in Profile
- If somehow set (data corruption), fallback rules apply (see 3.5)

**UI pattern:** Do not show disabled items as grayed-out. Simply omit them.

### 3.5 Fallback Rules (Error Handling)

**Problem:** `defaultMode` or `defaultWorkView` is missing, invalid, or disabled.

**Fallback chain:**

1. **If `defaultMode` is invalid:**
   - Set to `'Work'`

2. **If `defaultWorkView` is invalid or disabled:**
   - Try `'Business'` (if enabled)
   - Else try first enabled work view (in order: CS, Sales, Marketing, PM, Admin, Internal)
   - Else fall back to `'Personal'` mode

3. **If ALL work views are disabled:**
   - Force `defaultMode = 'Personal'`
   - Hide "Work" option in Profile preferences
   - "Change view..." only shows Personal Workspace

**Logging:** When fallback is triggered, log to console:
```javascript
console.warn('[UniversalHub] Invalid defaultWorkView, falling back to Business');
```

---

## 4. Sidebar: Collapsible Navigation

### 4.1 Visual States

**Expanded (default on desktop):**
- Width: `256px` (16rem)
- Shows: Logo (horizontal woven spine), icons + labels, section headers
- Collapse button: `ChevronLeft` icon

**Collapsed:**
- Width: `72px` (4.5rem)
- Shows: Logomark (woven spine icon only), icons only
- Tooltips on hover
- Collapse button: `ChevronRight` icon

**Mobile drawer:**
- Full overlay with backdrop
- Hamburger in topbar triggers open
- Slides in from left
- Closes on backdrop click or item selection

### 4.1.1 Logo Implementation

**Woven Spine Logo Assets:**

The IntegrateWise logo features a woven spine design that visually represents the core architecture:

- **Logomark** (`/public/integratewise-logomark-woven.svg`): 40×40px circular icon
  - Outer hub circle
  - Three braided strands (left, right, middle with over/under weave)
  - Pink accent node (representing Cognitive Twin / IQ Hub)
  - Subtle halo around node

- **Horizontal Logo** (`/public/integratewise-logo-horizontal-woven.svg`): 220×44px
  - Logomark + wordmark
  - "Integrate" (standard weight, dark gray)
  - "Wise" (bold weight, primary purple #3F3182)

**Usage in Sidebar:**

- **Expanded state**: Shows full horizontal logo at 165×33px (75% scale)
- **Collapsed state**: Shows logomark only at 40×40px (original size)
- Component: `<IntegrateWiseLogo variant="full" size="sm" />` for expanded
- Component: `<IntegrateWiseLogo variant="icon" size="md" />` for collapsed

**Revolutionary Headline Integration:**

The tagline "Load your work. Store it in your Spine. Think in your IQ Hub, Act through your Cognitive Twin" appears:
- Landing page (with logo, `showTagline={true}`)
- Onboarding flow (Screen 1, 4, 6)
- NOT in the Universal Hub shell (too verbose for persistent UI)

### 4.2 Section Structure

Sidebar is divided into **4 groups**:

**1. Core (always visible):**
- Home
- Today

**2. IQ Hub (expandable):**
- Knowledge
- Tasks
- Insights
- Workflows
- (Only if any IQ feature is enabled)

**3. Work Hubs (dynamic from Profile):**
- Business Hub (if `enabledSections.business`)
- Customer Success (if `enabledSections.customerSuccess`)
- Sales (if `enabledSections.sales`)
- Marketing (if `enabledSections.marketing`)
- Product (if `enabledSections.productManagement`)
- Admin Console (if `enabledSections.admin`)
- Internal Ops (if `enabledSections.internal`)

**4. System (bottom):**
- Integrations (if `enabledSections.integrations`)
- Webhooks (if `enabledSections.webhooks`)
- Settings (always visible)

### 4.3 Sidebar-Profile Linkage

**Rule:** Disabling a hub in Profile affects:
1. **Sidebar:** Section is hidden/removed
2. **Change view... popover:** View is omitted from Quick Switch list
3. **Fallback logic:** View cannot be used as default

**Example:**
```typescript
// User disables "Customer Success" in Profile
profilePrefs.enabledSections.customerSuccess = false

// Result:
// - Sidebar: No "Customer Success" item
// - Topbar popover: CS not in Quick Switch list
// - If defaultWorkView was 'CS', fallback to Business
```

### 4.4 Collapsed State Icon Mapping

**Icon sizes:** 20px (w-5 h-5) in both expanded and collapsed states

**In collapsed mode:**
- Show icon only
- Add tooltip on hover/focus (positioned to the right)
- Tooltip content: Full label text

**Nested items (IQ Hub):**
- When sidebar is collapsed:
  - IQ Hub shows as single icon (Zap or Brain)
  - Clicking opens a mini-popover with sub-items
  - OR expand sidebar temporarily on hover (decide one pattern)
- When sidebar is expanded:
  - IQ Hub is collapsible section with chevron
  - Sub-items indent slightly

**Recommendation:** Use hover-triggered mini-popover for nested items in collapsed mode (matches Figma/Linear patterns).

### 4.5 Keyboard & Accessibility

**Collapse/expand control:**
- `tabindex="0"` (focusable)
- `role="button"`
- `aria-label="Collapse sidebar"` / `"Expand sidebar"`
- `aria-expanded="true"` / `"false"`
- Activatable with `Enter` or `Space`

**Navigation items:**
- All links are keyboard-navigable
- Focus visible ring: `focus:ring-2 focus:ring-[#3F3182]`
- Current page indicator: `aria-current="page"`

**Tooltips in collapsed mode:**
- Appear on hover **and** keyboard focus
- `role="tooltip"`
- Positioned with `absolute` or Popper.js

**Mobile drawer:**
- Focus trap when open
- `Escape` key closes drawer
- Backdrop click closes drawer

---

## 5. Scrollbar Behavior

### 5.1 Design Intent

**Modern, invisible-until-needed scrollbars** that reduce visual clutter while maintaining discoverability.

### 5.2 Where to Apply

**Apply `.scrollbar-thin` class to:**
- ✅ Sidebar navigation (`<nav>`)
- ✅ "Change view..." popover list (Quick Switch section)
- ✅ Card stacks (suggestions, knowledge streams)
- ✅ Modal content areas (if scrollable)

**Do NOT apply to:**
- ❌ Primary document-like content (long tables, knowledge pages with 1000+ lines)
- ❌ Code editors or text-heavy areas where scrollbar position is a strong visual cue
- ❌ Any area where user needs constant scroll position awareness

### 5.3 Pointer Devices (Desktop/Trackpad)

**Default state:**
- Scrollbar track: `transparent`
- Scrollbar thumb: `transparent`
- Width: `6px` (thin, unobtrusive)

**Hover state:**
- Scrollbar thumb: `rgba(0, 0, 0, 0.2)` (subtle gray)
- Transition: Smooth fade-in

**Active/dragging:**
- Scrollbar thumb: `rgba(0, 0, 0, 0.3)` (slightly darker)

**CSS implementation:**
```css
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.scrollbar-thin:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.2s;
}

.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
```

### 5.4 Touch Devices (Mobile/Tablet)

**Rule:** On touch-only devices, **do not hide scrollbars**.

**Rationale:**
- Touch devices have no "hover" interaction
- Users rely on visual scrollbar to understand content length
- OS defaults are optimized for touch already

**Detection:**
```javascript
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Apply class conditionally
<div className={`overflow-auto ${!isTouchDevice ? 'scrollbar-thin' : ''}`}>
```

**On touch devices:**
- Use OS default scrollbar styling
- Scrollbars appear during scroll, fade after inactivity (OS behavior)

### 5.5 Accessibility Preferences

**Respect user OS settings:**

**If user has set "Always show scrollbars" (macOS/Windows preference):**
- Do NOT force `transparent` scrollbars
- Detect via CSS media query:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .scrollbar-thin {
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent !important;
    }
  }
  ```

**If user has set high contrast mode:**
- Scrollbars should be more visible
- Override `.scrollbar-thin` styles

**Implementation:**
```css
@media (prefers-contrast: high) {
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.5) !important;
  }
}
```

### 5.6 Discoverability Hints

**Problem:** Users may not realize content is scrollable if scrollbar is completely invisible.

**Solutions (choose one or combine):**

**Option A: Subtle gradient fade**
- Add a 16px gradient at the bottom of scrollable containers
- Gradient: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))`
- Only shows when content overflows

**Option B: Hairline track**
- Keep a 1px hairline track visible: `background: rgba(0,0,0,0.05)`
- Thumb still invisible until hover

**Option C: Initial flash**
- On first scroll, flash the scrollbar thumb for 1 second
- Then return to invisible state

**Recommended:** Combination of A (gradient fade) + current hover behavior.

**Implementation:**
```tsx
<div className="relative">
  <div className="overflow-auto scrollbar-thin max-h-96">
    {/* Content */}
  </div>
  {/* Fade hint (only if content overflows) */}
  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
</div>
```

---

## 6. Profile: View & Workspace Preferences

### 6.1 Section Structure

Located at: `/profile` → "View & Workspace Preferences" card

**Purpose:** Single source of truth for all view defaults and sidebar visibility.

### 6.2 Fields

**1. Default Mode**
- Radio/button group: `Personal` | `Work`
- Visual: Two large cards with icons, descriptions
- Default: `Work` (for business users)

**2. Preferred Work View** (conditional)
- Only shown when `Default Mode = Work`
- Dropdown with all enabled work views
- Options: Business, CS, Sales, Marketing, PM, Admin, Internal
- Default: `Business`
- Help text: "This view will open automatically when you launch IntegrateWise OS"

**3. Navigation & Sections**
- Checkboxes for each hub/tool:
  - Business Hub
  - Customer Success
  - Sales
  - Marketing
  - Product
  - Admin Console
  - Internal Ops
  - Integrations
  - Webhooks
  - Settings (always checked, disabled)
- Help text: "Enable the hubs and tools you want to access. These will appear in your left sidebar."

**4. Save Button**
- Primary button: "Save Preferences"
- On success: Show checkmark + "Preferences saved successfully!" (3s timeout)
- On error: Show error message with retry option

### 6.3 Callout Box (Informational)

Prominently display:

> **These settings drive:**
> 1. The starting view for every session
> 2. Which sections appear in the left sidebar
>
> You can temporarily switch views via "Change view…" in the topbar without changing Profile defaults, unless you explicitly choose "Make this my default".

**Visual:** Blue background, info icon, medium emphasis.

### 6.4 Validation Rules

**On save:**

1. **If `defaultMode = Work`:**
   - Require at least one work view to be enabled
   - If `defaultWorkView` is now disabled, show warning: "Your preferred view is no longer enabled. Switching to {fallback}."

2. **If ALL work views are disabled:**
   - Force `defaultMode = Personal`
   - Show warning: "All work views are disabled. Setting default mode to Personal."

3. **Settings cannot be disabled:**
   - Checkbox is always checked and disabled

---

## 7. Analytics & Instrumentation

### 7.1 Events to Log

**Event 1: `view_changed`**

Triggered when user changes view (via topbar or sidebar navigation).

**Properties:**
```typescript
{
  from_mode: 'Personal' | 'Work',
  from_view: 'Business' | 'CS' | ...,  // null if Personal
  to_mode: 'Personal' | 'Work',
  to_view: 'Business' | 'CS' | ...,    // null if Personal
  via: 'change_view_popover' | 'sidebar_nav' | 'direct_url',
  is_default_change: boolean,           // Did they click "Make default"?
  timestamp: ISO8601,
  user_id: string,
  session_id: string
}
```

**Event 2: `default_view_set`**

Triggered when user updates Profile preferences or clicks "Make this my default view".

**Properties:**
```typescript
{
  mode: 'Personal' | 'Work',
  work_view: 'Business' | 'CS' | ...,  // null if Personal
  source: 'profile_page' | 'change_view_popover',
  enabled_sections: string[],           // Array of enabled hub IDs
  timestamp: ISO8601,
  user_id: string
}
```

**Event 3: `sidebar_collapsed`** (optional)

Triggered when user collapses/expands sidebar.

**Properties:**
```typescript
{
  collapsed: boolean,
  device_type: 'desktop' | 'mobile',
  timestamp: ISO8601
}
```

### 7.2 Implementation

**Use existing analytics client:**
```typescript
import { analytics } from '@/lib/analytics';

// On view change
analytics.track('view_changed', {
  from_mode: previousMode,
  from_view: previousWorkView,
  to_mode: currentMode,
  to_view: currentWorkView,
  via: 'change_view_popover',
  is_default_change: false
});

// On default change
analytics.track('default_view_set', {
  mode: defaultMode,
  work_view: defaultWorkView,
  source: 'profile_page',
  enabled_sections: Object.keys(enabledSections).filter(k => enabledSections[k])
});
```

---

## 8. Progressive Loading (Shell Initialization)

### 8.1 Loading Sequence

**Phase 1: Shell structure (0ms)**
- Render empty shell with skeleton
- Show logo + loading spinner

**Phase 2: Sidebar (200ms delay)**
- Load sidebar sections from Profile
- Animate in from left
- Transition: `opacity 0 → 1`, `transform translateX(-20px) → 0`

**Phase 3: Topbar (400ms delay)**
- Compute current projection
- Render topbar with label
- Transition: `opacity 0 → 1`

**Phase 4: Content (600ms delay)**
- Fetch hub data (API calls)
- Render content based on `currentMode` + `currentWorkView`
- Transition: `opacity 0 → 1`, `transform translateY(10px) → 0`

**Phase 5: Footer (800ms delay, optional)**
- Render AI assistant, quick actions
- Transition: `opacity 0 → 1`

### 8.2 Error States

**If Profile API fails:**
- Show error toast: "Could not load preferences. Using defaults."
- Fall back to localStorage cache
- If localStorage is empty, use hardcoded defaults: `Work → Business`
- Log error to monitoring (Sentry, LogRocket, etc.)

**If hub content API fails:**
- Show empty state with retry button: "Unable to load {view}. [Retry]"
- Do NOT crash the shell
- Allow user to switch to other views

---

## 9. Figma Spec Annotations

### 9.1 Frame Labeling Convention

**Use this naming pattern:**

```
UniversalHub_Topbar_PersonalMode
UniversalHub_Topbar_WorkMode_Business
UniversalHub_Topbar_WorkMode_CS
UniversalHub_ChangeViewPopover_FromPersonal
UniversalHub_ChangeViewPopover_FromWork
UniversalHub_Sidebar_Expanded
UniversalHub_Sidebar_Collapsed
UniversalHub_Sidebar_Mobile
UniversalHub_Profile_ViewPreferences
```

### 9.2 Annotations to Add

**On main Universal Hub frame (top-level):**

> **Mode & View are Profile-driven.**
> Topbar shows current projection ('Personal Workspace' / 'Work – {View}').
> `Change view…` is a light override per session, with an explicit 'Make default' path back to Profile.
>
> **Progressive Loading:** Sidebar (200ms) → Topbar (400ms) → Content (600ms).
>
> **Scrollable areas** (sidebar, popovers, vertical card lists) use hidden scrollbars that appear on hover for pointer devices. On touch devices, use OS defaults.

**On Topbar component:**

> Topbar label is always computed from Profile defaults (`defaultMode` + `defaultWorkView`) on initial load.
> `Change view…` overrides only the current session unless user chooses 'Make this my default view'.

**On Sidebar component:**

> Sidebar sections (Personal, Work, Admin, System) are built from `enabledSections` based on Profile preferences.
> Changing default mode/view in Profile adjusts both:
> - Topbar label
> - Visible sections in left pane

**On Profile → View & Workspace Preferences:**

> These settings drive:
> 1) The starting view for every session.
> 2) Which sections appear in the left sidebar.
>
> Users can temporarily switch views via `Change view…` in the topbar without changing Profile defaults, unless they explicitly choose 'Make this my default'.

**On Change view... popover:**

> Quick switch list shows only views enabled for the user (`enabledSections`).
> Clicking a view updates session state only.
> "Make this my default view" button appears after switching and updates Profile.

---

## 10. Implementation Checklist

### 10.1 Backend Requirements

- [ ] API endpoint: `GET /api/user/preferences`
  - Returns: `defaultMode`, `defaultWorkView`, `enabledSections`, `workMode`
- [ ] API endpoint: `PUT /api/user/preferences`
  - Accepts: Partial updates to preferences
  - Validates: At least one work view enabled if mode=Work
- [ ] Database schema: Add `user_preferences` table/column
- [ ] Migration: Seed existing users with default preferences

### 10.2 Frontend Components

- [x] `WorkspaceTopbar.tsx` - Profile-driven topbar with "Change view..."
- [x] `WorkspaceSidebar.tsx` - Collapsible sidebar with dynamic sections
- [x] `WorkspaceContainer.tsx` - Universal shell with progressive loading
- [x] `Profile.tsx` - View & Workspace Preferences section
- [ ] `ChangeViewPopover.tsx` - Extract popover to separate component (optional)
- [ ] `useProfilePreferences` hook - Centralized state management

### 10.3 State Management

- [ ] Load preferences from API on mount
- [ ] Cache in React Context or Zustand store
- [ ] Sync localStorage as fallback
- [ ] Handle API errors gracefully

### 10.4 Accessibility

- [ ] Keyboard navigation for all interactive elements
- [ ] Focus management (sidebar collapse, popover open/close)
- [ ] Screen reader announcements for view changes
- [ ] Tooltips on collapsed sidebar items
- [ ] High contrast mode support

### 10.5 Analytics

- [ ] Implement `view_changed` event tracking
- [ ] Implement `default_view_set` event tracking
- [ ] Implement `sidebar_collapsed` event tracking (optional)
- [ ] Add to analytics dashboard/monitoring

### 10.6 Testing

- [ ] Unit tests: State transitions (Profile → Session)
- [ ] Unit tests: Fallback logic (invalid preferences)
- [ ] Integration tests: "Change view..." flow
- [ ] Integration tests: Profile preferences save
- [ ] E2E tests: Full user journey (onboarding → hub → view switch)
- [ ] Accessibility audit (axe-core, Lighthouse)

---

## 11. Future Enhancements

### 11.1 Multi-Workspace Support (Phase 2)

If/when we add multiple workspaces:

- Preferences become workspace-scoped
- Topbar adds workspace switcher (separate from view switcher)
- API changes: `GET /api/workspaces/:id/preferences`

### 11.2 View Customization (Phase 3)

Allow users to:

- Rename views (e.g., "Sales Hub" → "Revenue Team")
- Reorder sidebar sections (drag-and-drop)
- Pin frequently used views to topbar

### 11.3 View Presets (Phase 4)

Preset configurations for common roles:

- "Founder" preset: Business + CS + Sales enabled
- "Product Manager" preset: PM + Internal enabled
- "CS Manager" preset: CS + Integrations enabled

---

## 12. Non-Negotiable Rules (SSOT Enforcement)

From the original locked SSOT spec:

1. ✅ **One universal hub shell** - All views live in the same container
2. ✅ **No empty dashboards** - Every view shows data or prompts action
3. ✅ **Progressive UI loading** - Sidebar → Topbar → Content (staggered)
4. ✅ **Views vs Hubs separation** - Views are lenses, Hubs are destinations
5. ✅ **IQ Hub canonical language** - Not "AI Hub" or "Smart Hub"
6. ✅ **Single workspace architecture** - No workspace switcher (Phase 1)
7. ✅ **Profile-driven projection** - Identity in Profile, projection in topbar
8. ✅ **Revolutionary headline integration** - "Load your work. Store it in your Spine. Think in your IQ Hub, Act through your Cognitive Twin"

---

## Appendix A: Type Definitions

```typescript
// User Profile
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  expertise: 'beginner' | 'intermediate' | 'advanced';
  priority: string;
  notes?: string;
}

// Profile Preferences
interface ProfilePreferences {
  defaultMode: 'Personal' | 'Work';
  defaultWorkView: 'Business' | 'CS' | 'Sales' | 'Marketing' | 'PM' | 'Admin' | 'Internal';
  workMode: 'momentum' | 'clarity' | 'automation' | 'craft';
  enabledSections: {
    personal: boolean;
    business: boolean;
    customerSuccess: boolean;
    sales: boolean;
    marketing: boolean;
    productManagement: boolean;
    admin: boolean;
    internal: boolean;
    integrations: boolean;
    webhooks: boolean;
    settings: boolean;
  };
}

// Session State
interface SessionState {
  currentMode: 'Personal' | 'Work';
  currentWorkView: 'Business' | 'CS' | 'Sales' | 'Marketing' | 'PM' | 'Admin' | 'Internal';
  currentHub: 'home' | 'today' | 'profile' | 'settings' | 'integrations' | 'webhooks';
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  hasTemporarilySwitched: boolean;
}

// View Option
interface ViewOption {
  id: 'Personal' | 'Business' | 'CS' | 'Sales' | 'Marketing' | 'PM' | 'Admin' | 'Internal';
  label: string;
  description: string;
  icon: LucideIcon;
  mode: 'Personal' | 'Work';
  sectionKey: keyof ProfilePreferences['enabledSections'];
}

// Analytics Event
interface ViewChangedEvent {
  from_mode: 'Personal' | 'Work';
  from_view: string | null;
  to_mode: 'Personal' | 'Work';
  to_view: string | null;
  via: 'change_view_popover' | 'sidebar_nav' | 'direct_url';
  is_default_change: boolean;
  timestamp: string;
  user_id: string;
  session_id: string;
}
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | Initial | Universal Hub shell, sidebar, topbar |
| 2.0 | 2026-01-17 | Revision | Profile-driven projection, scrollbar spec, edge cases |

**Reviewers:**
- Product: [ ]
- Design: [ ]
- Engineering: [ ]
- QA: [ ]

**Approval Status:** ⚠️ Pending Review

---

**END OF SPECIFICATION**