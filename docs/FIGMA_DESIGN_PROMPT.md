# Figma Design Prompt: IntegrateWise App UI

## Project Overview

**Product**: IntegrateWise - Universal Cognitive Operating System  
**URL**: app.integratewise.ai  
**Scope**: L0 Onboarding → L1 Workspace → L2 Cognitive Layer  
**Style**: Modern SaaS, dark mode primary, intelligence-driven UI

---

## Part 1: Design System

### Color Palette

#### Primary Brand
- **Navy**: `#2D4A7C` - Primary actions, headers
- **Navy Light**: `#4A6A9C` - Hover states, secondary
- **Navy Dark**: `#1A2F4F` - Backgrounds

#### Domain Colors (10)
| Domain | Color | Hex | Usage |
|--------|-------|-----|-------|
| Customer Success | Emerald | `#10B981` | CS modules, health scores |
| Sales | Blue | `#0EA5E9` | Sales modules, pipeline |
| RevOps | Purple | `#8B5CF6` | RevOps, forecasting |
| Marketing | Pink | `#EC4899` | Marketing, campaigns |
| Product/Engineering | Indigo | `#6366F1` | Product, engineering |
| Finance | Teal | `#14B8A6` | Finance, budgets |
| Customer Service | Amber | `#F59E0B` | Support, tickets |
| Procurement | Lime | `#84CC16` | Procurement |
| IT/Admin | Slate | `#64748B` | Admin, settings |
| Student/Teacher | Orange | `#F97316` | Education |

#### Semantic Colors
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Info**: `#3B82F6`

#### Intelligence Colors (L2)
- **Signal Critical**: `#EF4444` (red glow)
- **Signal Warning**: `#F59E0B` (amber glow)
- **Signal Info**: `#3B82F6` (blue glow)
- **Signal Success**: `#10B981` (green glow)

#### Background Colors
- **BG Primary**: `#0C1222` (deep navy/black)
- **BG Secondary**: `#151B2B` (card backgrounds)
- **BG Tertiary**: `#1E2535` (elevated surfaces)
- **BG Overlay**: `rgba(0, 0, 0, 0.7)` (modals)

#### Text Colors
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `rgba(255, 255, 255, 0.7)`
- **Text Tertiary**: `rgba(255, 255, 255, 0.5)`
- **Text Disabled**: `rgba(255, 255, 255, 0.3)`

### Typography

#### Font Families
- **Primary**: "Plus Jakarta Sans" (Google Fonts)
- **Monospace**: "JetBrains Mono" (code, data)

#### Type Scale
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 48px | 800 | 1.1 | Hero headlines |
| H1 | 36px | 700 | 1.2 | Page titles |
| H2 | 28px | 700 | 1.3 | Section headers |
| H3 | 22px | 600 | 1.4 | Card titles |
| H4 | 18px | 600 | 1.4 | Subsection |
| Body Large | 16px | 400 | 1.5 | Primary text |
| Body | 14px | 400 | 1.5 | Default text |
| Small | 12px | 500 | 1.4 | Labels, metadata |
| Caption | 11px | 600 | 1.3 | Tags, badges (uppercase, tracking-wide) |
| Mono | 13px | 400 | 1.4 | Code, metrics |

### Spacing System
- **Unit**: 4px base
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Border Radius
- **Small**: 6px (buttons, inputs)
- **Medium**: 12px (cards, panels)
- **Large**: 16px (modals, drawers)
- **XL**: 24px (feature cards)
- **Full**: 9999px (pills, avatars)

### Shadows & Effects

#### Glows (Intelligence)
```css
/* Critical Signal */
box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);

/* Warning Signal */
box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);

/* Success Signal */
box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);

/* AI/Intelligence */
box-shadow: 0 0 30px rgba(123, 97, 255, 0.3);
```

#### Background Blur
- **Glass**: `backdrop-filter: blur(20px)`
- **Panel**: `backdrop-filter: blur(12px)`

### Component Library

#### Buttons

**Primary Button**
- Background: `#2D4A7C`
- Text: White
- Padding: 12px 24px
- Border-radius: 8px
- Hover: `#4A6A9C`, scale(1.02)
- Shadow on hover: `0 4px 12px rgba(45, 74, 124, 0.4)`

**Secondary Button**
- Background: transparent
- Border: 1px solid `rgba(255,255,255,0.2)`
- Text: White
- Hover: Background `rgba(255,255,255,0.1)`

**Domain Buttons** (Domain selection)
- Size: 160px x 120px
- Background: `#1E2535`
- Border: 2px solid transparent
- Selected: Border = domain color, glow effect
- Icon: 32px, colored
- Label: 14px, white, centered

**Icon Button**
- Size: 40px x 40px
- Border-radius: 8px
- Background: transparent or `#1E2535`
- Hover: `rgba(255,255,255,0.1)`

#### Cards

**Data Card**
- Background: `#151B2B`
- Border: 1px solid `rgba(255,255,255,0.08)`
- Border-radius: 12px
- Padding: 20px
- Hover: Border lightens, subtle lift

**Intelligence Card** (L2)
- Background: `#151B2B`
- Left border: 3px (color = signal type)
- Border-radius: 12px
- Shadow: Signal-colored glow

**Metric Card**
- Background: `#151B2B`
- Border-radius: 12px
- Header: Label (caption), Value (H2)
- Sparkline or trend indicator
- Change badge (green/red)

#### Inputs

**Text Input**
- Background: `#1E2535`
- Border: 1px solid `rgba(255,255,255,0.1)`
- Border-radius: 8px
- Padding: 12px 16px
- Focus: Border `#2D4A7C`, glow
- Placeholder: `rgba(255,255,255,0.4)`

**Search Input**
- Left icon: Search (20px)
- Clear button on right
- Background: `#1E2535`
- Border-radius: 24px (pill shape)

#### Badges & Tags

**Status Badge**
- Padding: 4px 10px
- Border-radius: 12px (pill)
- Font: 11px uppercase, tracking-wider
- Colors: Match semantic colors

**Domain Tag**
- Background: Domain color at 15% opacity
- Text: Domain color
- Border: 1px solid domain color at 30%

#### Progress & Loading

**Progress Bar**
- Height: 8px
- Background: `rgba(255,255,255,0.1)`
- Fill: Gradient (primary)
- Border-radius: 4px

**Stepper**
- Steps: Circles 32px
- Active: Filled primary
- Complete: Checkmark icon
- Future: Outline only
- Connector line between steps

**Skeleton Loader**
- Background: `rgba(255,255,255,0.05)`
- Shimmer animation
- Border-radius: 4px

---

## Part 2: L0 Onboarding Flows

### Flow Overview
5 Steps: Identity → Domain → Connect → Upload → Accelerator → Loader

### Screen 1: Identity + AI Insights

**Layout**
- Centered card, max-width 480px
- Dark gradient background with subtle animated glow
- Progress stepper at top (5 steps)

**Elements**
1. **Logo**: IntegrateWise mark (small, top center)
2. **Headline**: "Welcome to IntegrateWise" (H2)
3. **Subheadline**: "Let's set up your cognitive workspace" (Body, secondary)
4. **Input**: "Your name" placeholder
5. **AI Insight Card** (appears after typing 3+ chars):
   - Title: "AI-Generated Insights"
   - Three items:
     - Working Style: [Dynamic]
     - Key Strengths: [Dynamic]
     - Growth Areas: [Dynamic]
   - Style: Glass card, purple glow
6. **Button**: "Continue" (primary, full-width)

**Animations**
- Input focus: Glow effect
- AI card: Fade in + slide up (0.4s)
- Insights text: Typewriter effect

### Screen 2: Role & Domain Selection

**Layout**
- Centered, max-width 720px
- 10 domain cards in 2x5 grid

**Elements**
1. **Headline**: "What's your domain?" (H2)
2. **Subheadline**: "Select your primary work area" (Body)
3. **Domain Cards** (10):
   - Icon: Lucide icon, 32px, colored
   - Label: Domain name
   - Description: One line (smaller text)
   - Selection: Border + glow effect
4. **Button**: "Continue" (disabled until selected)

**Card Hover**
- Scale: 1.02
- Border: Domain color at 50%
- Background: Slightly lighter

**Card Selected**
- Border: 2px solid domain color
- Background: Domain color at 10%
- Shadow: Domain color glow (20px)
- Icon: Scale 1.1

### Screen 3: Tool Connect

**Layout**
- Centered, max-width 640px
- Categories stacked vertically

**Elements**
1. **Headline**: "Connect your tools" (H2)
2. **Subheadline**: "Sync data from your existing platforms" (Body)
3. **Categories** (3):
   - **CRM Platform**: Salesforce, HubSpot, Pipedrive
   - **Task Management**: Jira, Asana, Monday
   - **Workspace**: Notion, Slack, Microsoft Teams
   
   Each category:
   - Header: Icon + Label
   - Tool buttons: Logo + Name
   - Selected: Connected state (green check)

4. **Connection Status**:
   - Idle: Gray outline
   - Connecting: Spinner
   - Connected: Green check + "Connected"
   - Error: Red alert

5. **Button**: "Continue" (can skip)

**Tool Button Design**
- Size: 140px x 80px
- Background: `#1E2535`
- Border: 1px solid `rgba(255,255,255,0.1)`
- Logo: 24px
- Name: 12px
- Hover: Border lightens

### Screen 4: File Upload

**Layout**
- Centered, max-width 560px

**Elements**
1. **Headline**: "Upload context files" (H2)
2. **Subheadline**: "Add documents for AI context (optional)" (Body)
3. **Drop Zone**:
   - Large dashed border area
   - Icon: Upload cloud (48px)
   - Text: "Drop files here or click to browse"
   - Subtext: "Supports: Markdown, Word, TXT, CSV (max 10MB)"
   - Hover: Border color change, background lighten
   
4. **File List** (appears after upload):
   - File name
   - Size
   - Progress bar (while uploading)
   - Remove button (X)

5. **Button**: "Continue" (can skip)

**File Item Design**
- Background: `#1E2535`
- Border-radius: 8px
- Padding: 12px 16px
- Icon: File type icon
- Progress: Green fill

### Screen 5: Accelerator Selection

**Layout**
- Centered, max-width 800px
- Card grid

**Elements**
1. **Headline**: "Choose your accelerators" (H2)
2. **Subheadline**: "AI-powered intelligence for your domain" (Body)
3. **Accelerator Cards** (6):
   - Customer Health Score
   - Churn Prediction
   - Revenue Forecaster
   - Pipeline Velocity
   - Support Health
   - Marketing Attribution
   
   Each card:
   - Icon: Brain/target/chart icon
   - Name: Bold
   - Description: 2 lines
   - Badge: "Free" or "$29/mo"
   - Toggle: On/off switch

4. **Summary**: Selected count + price
5. **Button**: "Initialize Workspace" (primary, large)

**Accelerator Card**
- Background: `#151B2B`
- Border: 1px solid `rgba(255,255,255,0.08)`
- Border-radius: 12px
- Padding: 20px
- Selected: Purple glow, border purple

### Screen 6: Loader Phase 1

**Layout**
- Full screen center
- Dark background

**Elements**
1. **Logo**: Large, pulsing
2. **Status Text**: "Initializing your workspace..."
3. **Progress Bar**: 0-100%
4. **Steps List**:
   - "Creating cognitive twin" ✓
   - "Connecting data sources" ✓
   - "Building knowledge graph" (animating)
   - "Training AI models" (pending)
   - "Optimizing accelerators" (pending)

5. **Cancel Button**: (optional)

**Animations**
- Logo: Pulse + glow
- Progress: Smooth fill
- Steps: Checkmark animation when complete
- Background: Subtle particle effect or gradient shift

**Completion**
- Fade to workspace
- "Welcome to IntegrateWise" toast

---

## Part 3: L1 Workspace Shell

### App Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                     │
│  [Logo] [Breadcrumb]          [Search] [Notif] [Avatar] │
├─────────────────────────────────────────────────────┤
│  │                                                  │
│  │  MAIN CONTENT                                   │
│  │                                                  │
│ S│  ┌─────────────────────────────────────────────┐│
│ I│  │                                             ││
│ D│  │  Module Content                             ││
│ E│  │                                             ││
│ B│  │                                             ││
│ A│  │                                             ││
│ R│  │                                             ││
│  │  └─────────────────────────────────────────────┘│
│ (│                                                  │
│ 2│  INTELLIGENCE DRAWER (right, collapsible)      │
│ 4│  ┌─────────────────────────────┐               │
│ 0│  │ Signals | Think | Evidence  │               │
│ p│  │                             │               │
│ x│  │ [Intelligence cards...]     │               │
│ )│  └─────────────────────────────┘               │
│  │                                                  │
└─────────────────────────────────────────────────────┘
```

### Top Bar (64px height)

**Elements (Left to Right)**
1. **Logo**: 32px, collapses on mobile
2. **Breadcrumb**: Domain > Module (e.g., "CS > Accounts")
3. **Spacer**
4. **Command Palette Trigger**: CMD+K, search icon
5. **Notifications**: Bell icon, badge with count
6. **User Menu**: Avatar (32px), dropdown on click

**Design**
- Background: `#0C1222` with blur
- Border-bottom: 1px solid `rgba(255,255,255,0.08)`
- Position: Fixed top

### Sidebar (240px width, collapsible to 72px)

**Elements**
1. **Domain Switcher**: Dropdown to switch domain context
2. **Navigation Items**: Icon + Label
   - Home
   - Today
   - Tasks
   - Accounts (CS) / Deals (Sales) / etc.
   - Contacts
   - Meetings
   - Docs
   - Calendar
   - ... (module-specific)
3. **Divider**
4. **L2 Access**: Intelligence, Spine, Context
5. **Bottom**: Settings, Help

**Item States**
- Default: Text tertiary, icon muted
- Hover: Text primary, background `#1E2535`
- Active: Left border (domain color), text white
- Collapsed: Icon only, tooltip on hover

**Collapsed State (72px)**
- Icons only
- Active indicator: Dot or left border
- Hover: Tooltip with full label

### Intelligence Drawer (400px, right side)

**Toggle**: Button in top bar or sidebar

**Tabs**
1. **Signals**: Real-time alerts, recommendations
2. **Think**: AI analysis, proposed actions
3. **Evidence**: Supporting data for decisions
4. **Context**: Related documents, history

**Signal Card Design**
- Left border: 3px (color = severity)
- Icon: Signal type (alert, recommendation, insight)
- Title: Bold, white
- Description: Secondary text
- Evidence button
- Action buttons (Approve/Reject/Modify)
- Timestamp

---

## Part 4: L1 Module Designs

### Module: Home Dashboard

**Layout**: Grid layout, responsive
```
┌─────────────────────────────────────────────┐
│ Welcome back, [Name]          [Date]        │
├─────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐          │
│ │ TODAY        │ │ PRIORITIES   │          │
│ │ - Task 1     │ │ - High risk  │          │
│ │ - Task 2     │ │ - Renewal    │          │
│ │ - Meeting    │ │ - Deal close │          │
│ └──────────────┘ └──────────────┘          │
│ ┌──────────────┐ ┌──────────────┐          │
│ │ PENDING      │ │ GOALS        │          │
│ │ Approvals (3)│ │ 75% of Q4    │          │
│ └──────────────┘ └──────────────┘          │
└─────────────────────────────────────────────┘
```

**Widgets**
1. **Today**: Calendar + tasks for today
2. **Priorities**: AI-ranked urgent items
3. **Pending Approvals**: HITL queue
4. **Goals**: Progress to targets
5. **Recent Signals**: Last 3 intelligence signals
6. **Quick Actions**: Create task, Schedule meeting, etc.

### Module: Tasks (Kanban View)

**Layout**: Board view with columns

**Columns**
- Backlog
- To Do
- In Progress
- Review
- Done

**Task Card**
- Title
- Assignee avatar
- Due date
- Priority indicator (dot color)
- Tags
- Attachments count
- Comments count

**Quick Add**: "+" at bottom of each column

### Module: Tasks (Table View)

**Columns**
- Checkbox (bulk select)
- Title
- Assignee
- Due Date
- Priority
- Status
- Actions (3 dots)

**Filters (above table)**
- Search
- Assignee dropdown
- Status dropdown
- Due date range
- Tags

**Bulk Actions Bar** (appears on selection)
- Change status
- Change assignee
- Set due date
- Delete

### Module: Accounts (CS)

**Layout**: Table + Detail drawer

**Table Columns**
- Account name (link)
- Health score (colored badge)
- ARR
- Last activity
- Risk level
- Owner
- Actions

**Health Score Badge**
- 80-100: Green "Healthy"
- 60-79: Amber "At Risk"
- 0-59: Red "Critical"

**Row Hover**: Show quick actions (email, log call, create task)

**Detail Drawer** (click row)
- Account header (name, health, ARR)
- Tabs: Overview, Contacts, Activity, Health, Risks
- Quick actions bar

### Module: Pipeline (Sales)

**Layout**: Horizontal pipeline + metrics

**Pipeline Stages**
- Lead
- Qualified
- Proposal
- Negotiation
- Closed Won/Lost

**Deal Card**
- Company logo
- Deal name
- Value
- Close date
- Confidence score
- Owner

**Metrics Bar (above pipeline)**
- Total pipeline value
- Weighted pipeline
- Win rate
- Avg deal size
- Days in stage

### Module: Analytics

**Layout**: Dashboard with charts

**Chart Types**
- Line: Trends over time
- Bar: Comparisons
- Donut: Distribution
- Area: Cumulative
- Sparklines: Inline trends

**Cards**
- Chart title
- Time period selector
- Chart
- Key metric below
- Comparison (vs last period)

---

## Part 5: L2 Cognitive Components

### Signal Card

**Variants**

**Critical Signal** (red)
```
┌─────────────────────────────────┐
│ █ CRITICAL          2 min ago   │
│                                 │
│ Account At Risk: Acme Corp      │
│ Champion left, support tickets  │
│ up 400%, no engagement in 14d   │
│                                 │
│ [View Evidence] [Take Action]   │
└─────────────────────────────────┘
```

**Recommendation** (blue)
```
┌─────────────────────────────────┐
│ █ RECOMMENDATION    1 hour ago  │
│                                 │
│ Schedule QBR with TechFlow      │
│ Renewal in 60 days, upsell opp  │
│ identified                      │
│                                 │
│ [Schedule] [Dismiss] [Snooze]   │
└─────────────────────────────────┘
```

**Insight** (purple)
```
┌─────────────────────────────────┐
│ █ INSIGHT           3 hours ago │
│                                 │
│ Pattern detected: Similar       │
│ accounts show 30% higher        │
│ engagement with video updates   │
│                                 │
│ [Learn More]                    │
└─────────────────────────────────┘
```

### HITL Approval Card

```
┌─────────────────────────────────────────┐
│ AI-PROPOSED ACTION                      │
│                                         │
│ Send renewal reminder email             │
│                                         │
│ To: john@acmecorp.com                   │
│ Subject: Acme Corp renewal - 30 days    │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ Email preview...                │     │
│ └─────────────────────────────────┘     │
│                                         │
│ EVIDENCE:                               │
│ • Contract expires: Dec 31, 2024        │
│ • Last renewal: 1 year ago              │
│ • Health score: 85 (stable)             │
│                                         │
│ [Approve & Send] [Modify] [Reject]      │
│ [Schedule for later]                    │
└─────────────────────────────────────────┘
```

### Evidence Panel

**Evidence Item**
- Source icon (Salesforce, Slack, etc.)
- Source name
- Timestamp
- Content snippet
- Link to full record

**Sources**
- CRM records
- Support tickets
- Emails
- Meeting notes
- Usage data
- External news

### Think Panel

**Situation Assessment**
- Context summary
- Goal alignment
- Gap analysis
- Recommended actions (ranked)
- Confidence scores

**Action Proposal**
- Action type
- Description
- Expected outcome
- Risk assessment
- Effort required

### Spine View (L2)

**Entity Browser**
- Search/filter
- Entity list
- Entity detail
- Relationships graph
- Change history

**Entity Card**
- Type icon
- Name
- Key fields
- Status
- Last updated

---

## Part 6: Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations

**Onboarding**
- Single column
- Full-width buttons
- Bottom sheet for selections

**Workspace**
- Bottom navigation (icons)
- Collapsed sidebar (drawer)
- Stacked cards
- Full-screen detail views

**Tables**
- Card view instead of table
- Swipe actions
- Filter as bottom sheet

---

## Part 7: Animation Specifications

### Transitions
- **Page**: 0.3s ease-out
- **Modal/Drawer**: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
- **Hover**: 0.15s ease
- **Loading**: Skeleton shimmer 1.5s infinite

### Micro-interactions
- **Button press**: Scale 0.98
- **Card hover**: Translate Y -2px, shadow increase
- **Toggle**: Spring animation
- **Toast**: Slide in from right, fade out

### Loading States
- **Button**: Spinner replaces text
- **Card**: Skeleton with shimmer
- **Page**: Full-screen loader with logo
- **Data**: Progressive loading (placeholder → content)

---

## Part 8: Iconography

### Icon Library
- **Source**: Lucide React
- **Size**: 16px (inline), 20px (buttons), 24px (navigation)
- **Stroke width**: 1.5px
- **Color**: Inherit from text

### Domain Icons
| Domain | Icon |
|--------|------|
| Customer Success | Users |
| Sales | Target |
| RevOps | TrendingUp |
| Marketing | MessageSquare |
| Product | Code |
| Finance | DollarSign |
| Service | Mail |
| Procurement | ShoppingCart |
| IT/Admin | Wrench |
| Education | GraduationCap |

### Module Icons
| Module | Icon |
|--------|------|
| Home | Home |
| Tasks | CheckSquare |
| Accounts | Building2 |
| Contacts | Users |
| Meetings | Video |
| Docs | FileText |
| Calendar | CalendarDays |
| Notes | StickyNote |
| Knowledge | BookOpen |
| Team | Users2 |
| Pipeline | TrendingUp |
| Analytics | BarChart3 |
| Settings | Settings |

---

## Part 9: Export Specifications

### Frames to Create

**L0 Onboarding (5 screens)**
1. Identity + AI Insights
2. Role & Domain Selection
3. Tool Connect
4. File Upload
5. Accelerator Selection
6. Loader Phase 1

**L1 Workspace Shell**
1. Workspace Layout (desktop)
2. Workspace Layout (tablet)
3. Workspace Layout (mobile)
4. Sidebar expanded
5. Sidebar collapsed
6. Intelligence drawer open

**L1 Modules (15)**
1. Home Dashboard
2. Tasks (Kanban)
3. Tasks (Table)
4. Accounts (CS)
5. Contacts
6. Meetings
7. Docs
8. Calendar
9. Notes
10. Knowledge Space
11. Team
12. Pipeline
13. Risks
14. Expansion
15. Analytics

**L2 Cognitive**
1. Intelligence Drawer (Signals tab)
2. Intelligence Drawer (Think tab)
3. Intelligence Drawer (Evidence tab)
4. HITL Approval Modal
5. Signal Detail View
6. Spine View

**Component Library**
1. Colors (all tokens)
2. Typography scale
3. Buttons (all states)
4. Inputs (all states)
5. Cards (all variants)
6. Icons (full set)
7. Data components (table, list, etc.)

### Export Settings
- **Format**: PNG @2x for screens, SVG for icons
- **Color Profile**: sRGB
- **Naming**: `L0-01-Identity`, `L1-Home-Dashboard`, etc.

---

## Part 10: Design Principles

1. **Dark First**: Design for dark mode, light mode optional
2. **Intelligence Forward**: L2 signals prominent but not intrusive
3. **Progressive Disclosure**: Show what's needed, hide complexity
4. **Motion with Purpose**: Animations guide attention
5. **Domain Identity**: Color coding for domains
6. **Density**: Information-rich but scannable
7. **Accessibility**: WCAG 2.1 AA minimum

---

**END OF PROMPT**

Use this prompt to create a complete, production-ready Figma design system and all screen designs for IntegrateWise.
