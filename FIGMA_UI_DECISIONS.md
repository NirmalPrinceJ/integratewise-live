# Figma UI Component Decisions
## Based on AGENTS.md Architecture

---

## 1. L0: Onboarding Flow (4 Screens)

### Screen 1: Welcome + AI Insights
```
Layout: Centered card, full-bleed background gradient

┌────────────────────────────────────────────┐
│  [Logo: IntegrateWise]                     │
│                                            │
│  "Let's understand how you work"           │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │ Name: [________________]          │   │
│  │ Date of Birth: [__/__/____]       │   │
│  │                                    │   │
│  │ [Analyze My Style] →              │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [AI Insight Card - appears after input]   │
│  ┌────────────────────────────────────┐   │
│  │ 🤖 Based on your info:             │   │
│  │ • You're a visual thinker          │   │
│  • You prefer structured workflows   │
│  │ • Peak productivity: mornings      │   │
│  │                                    │   │
│  │ [Continue]                         │   │
│  └────────────────────────────────────┘   │
└────────────────────────────────────────────┘

Colors: Gradient background (slate-900 → slate-800)
Card: White, rounded-2xl, shadow-2xl
Animation: Card slides up, AI insights fade in
```

### Screen 2: AI Loader Demo
```
Layout: Split screen

┌────────────────────┬────────────────────┐
│   INPUT SIDE       │   OUTPUT SIDE      │
│                    │                    │
│  "Type anything    │  [Live preview     │
│   in natural       │   of AI processing]│
│   language..."     │                    │
│                    │  ┌──────────────┐  │
│  [________________]│  │ 📧 Email     │  │
│  [________________]│  │ 📊 Report    │  │
│  [________________]│  │ 📝 Task      │  │
│                    │  │ 📅 Calendar  │  │
│  [Watch Demo] →    │  └──────────────┘  │
│                    │                    │
│  Examples:         │  "AI transformed   │
│  • "Email team     │   your input into  │
│    about delay"    │   structured       │
│  • "Schedule       │   actions across   │
│    review"         │   4 tools"         │
│                    │                    │
│                    │  [Continue]        │
└────────────────────┴────────────────────┘

Animation: Typing effect on input, real-time processing visualization
Colors: Left (white), Right (slate-50 with tool icons)
```

### Screen 3: Context Selection
```
Layout: Two large cards side by side

┌────────────────────────────────────────────┐
│                                            │
│      "Choose your workspace context"       │
│                                            │
│  ┌────────────────┐  ┌────────────────┐   │
│  │                │  │                │   │
│  │  🎯            │  │  🤝            │   │
│  │                │  │                │   │
│  │  PRODUCTIVITY  │  │  CS PLATFORM   │   │
│  │     HUB        │  │                │   │
│  │                │  │  For Customer  │   │
│  │  For ICs, PMs, │  │  Success teams │   │
│  │  Team Leads    │  │                │   │
│  │                │  │  Focus:        │   │
│  │  Focus:        │  │  • Account     │   │
│  │  • Tasks       │  │    health      │   │
│  │  • Projects    │  │  • Renewal     │   │
│  │  • Calendar    │  │    risk        │   │
│  │  • Docs        │  │  • Expansion   │   │
│  │                │  │    ops         │   │
│  │  [Select]      │  │  [Select]      │   │
│  └────────────────┘  └────────────────┘   │
│                                            │
│  "You can switch anytime from Settings"    │
│                                            │
└────────────────────────────────────────────┘

Card hover: Scale 1.02, shadow increase
Selected: Blue border, checkmark icon
```

### Screen 4: Tool Connection + Hydration
```
Layout: Stepper with progress

┌────────────────────────────────────────────┐
│  [Back]                    Progress: 75%   │
│                                            │
│  "Connect your tools"                      │
│  "IntegrateWise works with what you use"   │
│                                            │
│  POPULAR TOOLS:                            │
│  ┌────────────────────────────────────┐   │
│  │ [Salesforce] [HubSpot] [Slack]    │   │
│  │ [Stripe] [Notion] [GitHub]        │   │
│  │ [Gmail] [Calendar] [+ More]       │   │
│  └────────────────────────────────────┘   │
│                                            │
│  OR UPLOAD DATA:                           │
│  ┌────────────────────────────────────┐   │
│  │                                    │   │
│  │      📤 Drop files here           │   │
│  │      or click to upload           │   │
│  │                                    │   │
│  │      CSV, JSON, PDF supported     │   │
│  │                                    │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [Upload Progress - when active]           │
│  ┌────────────────────────────────────┐   │
│  │ Processing: data.csv               │   │
│  │ [████████████░░░░░░░░] 60%        │   │
│  │ 4,231 records normalized...        │   │
│  └────────────────────────────────────┘   │
│                                            │
│                    [Complete Setup] →      │
└────────────────────────────────────────────┘

Tool icons: Color brand logos
Upload zone: Dashed border, hover: solid + blue tint
Progress: Animated gradient bar
```

---

## 2. L1: Navigation Structure

### Sidebar Redesign (Collapsible)
```
Expanded State (240px width):

┌──────────────────────────────┐
│ [Logo] IntegrateWise    [≡] │
├──────────────────────────────┤
│ HOME                         │
│ ├─ 🏠 Dashboard              │
├──────────────────────────────┤
│ RELATIONSHIPS                │
│ ├─ 🏢 Accounts               │
│ ├─ 👥 Contacts               │ ← NEW
├──────────────────────────────┤
│ WORK                         │
│ ├─ 📁 Projects               │ ← NEW
│ ├─ 📊 Pipeline               │ ← NEW
│ ├─ ✅ Tasks                  │
│ ├─ 📅 Calendar               │
│ ├─ 🎥 Meetings               │ ← NEW
├──────────────────────────────┤
│ KNOWLEDGE                    │
│ ├─ 📄 Docs                   │ ← NEW
│ ├─ 📝 Notes                  │ ← NEW
│ ├─ 🧠 Knowledge Space        │ ← NEW
├──────────────────────────────┤
│ TEAM                         │
│ ├─ 👤 Team                   │ ← NEW
│ ├─ 📈 Analytics              │ ← NEW
├──────────────────────────────┤
│ INTELLIGENCE                 │
│ ├─ 🎯 Risks                  │ ← NEW
│ ├─ 🚀 Expansion              │ ← NEW
│ ├─ 💡 Insights               │
├──────────────────────────────┤
│ ⚙️ Settings                  │
└──────────────────────────────┘

Collapsed State (64px width):
- Icons only
- Tooltip on hover
```

---

## 3. L2: Cognitive Components

### L2SignalBar (Enhanced)
```
Current: Bottom bar with rotating signals

Enhanced:
┌──────────────────────────────────────────────────────────┐
│ 🧠 L2: Cognitive Layer                            [^]   │
├──────────────────────────────────────────────────────────┤
│ [Signal 1] [Signal 2] [Signal 3] [+3 more]               │
├──────────────────────────────────────────────────────────┤
│ 🔴 CRITICAL: Carter Group — $61K overdue                │
│    "Usually pays Day 3, now Day 7. 3rd delay."           │
│    [Why?] [Send Reminder] [Dismiss]                     │
│                                                          │
│ 📋 Evidence:                                            │
│    • Invoice sent: Jan 15                              │
│    • Slack: "Will pay tomorrow" (3x)                  │
│    • Historical: Always pays by Day 3                 │
└──────────────────────────────────────────────────────────┘

New: "Why?" button opens EvidencePanel
     Evidence trail shows data sources
```

### EvidencePanel (New Component)
```
Side Drawer (400px width):

┌──────────────────────────────────┐
│ Evidence                    [×] │
├──────────────────────────────────┤
│                                  │
│ 📊 Signal: Revenue Alert        │
│ Confidence: 94%                 │
│                                  │
│ 📋 Data Sources:                │
│ ┌────────────────────────────┐  │
│ │ QuickBooks                 │  │
│ │ • Invoice #2024-0891      │  │
│ │ • Amount: $61,000         │  │
│ │ • Due: Jan 15             │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ Slack                      │  │
│ │ "Will send tomorrow"      │  │
│ │ Sender: finance@carter... │  │
│ │ Date: Jan 16, 18, 20     │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ Historical Pattern         │  │
│ │ • Avg payment time: 3 days│  │
│ │ • Previous delays: 0      │  │
│ │ • Risk score: HIGH        │  │
│ └────────────────────────────┘  │
│                                  │
│ 🧠 AI Reasoning:                │
│ "Deviation from historical     │
│  pattern + repeated promises   │
│  without action = escalation   │
│  recommended"                  │
│                                  │
└──────────────────────────────────┘
```

### SpineUI (New Component)
```
Full-width data browser:

┌─────────────────────────────────────────────────────────────────────┐
│ Spine: Canonical Data Browser                         [View: Table] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Filters: [Type: All ▼] [Status: All ▼] [Health: All ▼] [Search...] │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ Entity          │ Type    │ Health │ Status    │ Updated       ││
│ ├─────────────────────────────────────────────────────────────────┤│
│ │ Acme Corp       │ Account │ 92%    │ Active    │ 2 min ago     ││
│ │ Bright Co       │ Account │ 67%    │ At Risk   │ 1 hour ago    ││
│ │ Carter Group    │ Account │ 45%    │ Critical  │ 5 min ago     ││
│ │ Deal #4421      │ Deal    │ 78%    │ Proposal  │ 3 hours ago   ││
│ │ Task: Review    │ Task    │ 100%   │ Complete  │ 1 day ago     ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ [◀ Previous] Page 1 of 12 [Next ▶]            Showing 1-5 of 1,247 │
│                                                                     │
│ Actions: [Export] [Bulk Edit] [Archive]                            │
└─────────────────────────────────────────────────────────────────────┘

Click row → Open entity 360° view
```

### KnowledgeUI (New Component)
```
Knowledge Graph Visualization:

┌─────────────────────────────────────────────────────────────────────┐
│ Knowledge Graph                                             [3D ▼] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌─────────┐         ┌─────────┐         ┌─────────┐             │
│    │ Acme    │◄───────►│ Q4 Deal │◄───────►│ Sarah   │             │
│    │ Corp    │         │ $250K   │         │ (VP)    │             │
│    └────┬────┘         └────┬────┘         └─────────┘             │
│         │                   │                                       │
│         ▼                   ▼                                       │
│    ┌─────────┐         ┌─────────┐                                 │
│    │ Contract│         │ Meeting │                                 │
│    │ (PDF)   │         │ Notes   │                                 │
│    └─────────┘         └─────────┘                                 │
│                                                                     │
│ Legend: [● Entity] [● Document] [● Person] [● Insight]             │
│ Filters: [All] [Accounts] [Deals] [Docs] [People]                   │
│                                                                     │
│ Selected: Q4 Deal $250K                                            │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ Related: 5 entities | 3 documents | 2 people                 │    │
│ │ Confidence: 87%                                             │    │
│ └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

Interactive: Drag nodes, zoom, click for details
```

### DigitalTwin (New Component)
```
Full-screen simulation:

┌─────────────────────────────────────────────────────────────────────┐
│ 🧪 Digital Twin: Safe Simulation Environment              [Exit ▶] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ SIMULATION SCENARIO                                             ││
│ │                                                                 ││
│ │ "What if we increase outreach to at-risk accounts?"            ││
│ │                                                                 ││
│ │ Variables:                                                      ││
│ │ • Outreach frequency: [Weekly ▼]                               ││
│ │ • Account tier: [Enterprise ▼]                                 ││
│ │ • Message type: [Personalized ▼]                               ││
│ │                                                                 ││
│ │ [Run Simulation]                                               ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ RESULTS (simulated):                                               │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ Projected Impact (90 days):                                     ││
│ │ • Churn reduction: 15% → 8%                                    ││
│ │ • Revenue saved: $450K                                         ││
│ │ • Team workload: +12 hours/week                                ││
│ │ • Confidence: 78%                                              ││
│ │                                                                 ││
│ │ [Apply to Production] [Save Scenario] [Run Another]            ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ⚠️  This is a simulation. No real changes made.                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### Color Palette (Architecture-Aligned)
```
Primary:     slate-900 (L3 - Backend/Trust)
Secondary:   slate-700 (L2 - Intelligence)
Accent:      blue-600  (L1 - Action)
Success:     green-500 (Positive signals)
Warning:     amber-500 (Attention needed)
Critical:    red-500   (Urgent signals)
Info:        blue-400  (Information)
Background:  slate-50  (Canvas)
Surface:     white     (Cards)
```

### Typography Scale
```
Hero:        48px/1.1 (Onboarding headlines)
H1:          32px/1.2 (Page titles)
H2:          24px/1.3 (Section headers)
H3:          18px/1.4 (Card titles)
Body:        14px/1.5 (Content)
Caption:     12px/1.5 (Metadata)
Signal:      13px/1.4 (L2 cognitive text)
```

### Spacing System
```
xs:  4px   (Tight padding)
sm:  8px   (Component internal)
md:  16px  (Component spacing)
lg:  24px  (Section spacing)
xl:  32px  (Page sections)
2xl: 48px  (Major sections)
3xl: 64px  (Page breaks)
```

### Animation Standards
```
Micro-interactions: 150ms ease-out
Panel transitions:  300ms ease-in-out
Page transitions:   400ms cubic-bezier(0.4, 0, 0.2, 1)
Signal cycling:     5000ms per signal
Loading states:     800ms pulse animation
```

---

## 5. Responsive Breakpoints

```
Mobile:    < 640px   (Sidebar hidden, stack layout)
Tablet:    640-1024px (Collapsible sidebar)
Desktop:   > 1024px   (Full sidebar, 2-3 column layouts)
Wide:      > 1440px   (Maximized workspace, side panels)
```

---

## Summary: What to Build in Figma

### Priority 1: Onboarding (L0)
1. Welcome screen with AI insights
2. Demo screen with live preview
3. Context selection cards
4. Tool connection wizard

### Priority 2: Navigation (L1)
1. Full sidebar with 15 modules
2. Collapsed sidebar state
3. Mobile navigation drawer

### Priority 3: L2 Components
1. Enhanced SignalBar with evidence
2. EvidencePanel side drawer
3. SpineUI data browser
4. KnowledgeUI graph
5. DigitalTwin simulation

### Priority 4: Page Templates
1. Home dashboard (12 domain toggles)
2. Entity list pages (Accounts, Contacts, etc.)
3. Detail pages (360° view)
4. Settings with tabs

---

**All designs must align with AGENTS.md L0-L3 architecture.**
