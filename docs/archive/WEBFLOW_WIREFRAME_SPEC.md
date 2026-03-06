# IntegrateWise Website Wireframe Specification

> Complete wireframe and content structure for all 48 Webflow pages  
> Domain: `integratewise.ai` | App: `app.integratewise.ai`

---

## 🏗️ Site Architecture

```
integratewise.ai/
├── / (Home)
├── /pricing
├── /integrations
├── /architecture
├── /security-governance
├── /about-our-story
├── /contact-request-a-demo
├── /blog
│   └── /blog-post (template)
├── /case-studies
│   └── /customer-story (template)
│
├── /how-it-works (landing)
│   ├── /engine-stage-1-load
│   ├── /engine-stage-2-normalize
│   ├── /engine-stage-3-think
│   ├── /engine-stage-4-act
│   ├── /engine-stage-5-govern
│   └── /engine-stage-6-repeat
│
├── /use-cases (landing)
│   ├── /sales
│   ├── /marketing
│   ├── /customer-success
│   ├── /finance-billing
│   ├── /development
│   ├── /research
│   ├── /strategy
│   └── /management
│
├── /roles (landing)
│   ├── /visionary (C-Suite)
│   ├── /missionary (Champions)
│   ├── /practitioner (Doers)
│   └── /passenger (End Users)
│
└── /education (landing)
    ├── /institutions-universities
    ├── /educators
    ├── /students
    ├── /freelancers
    └── /employee-and-external-relations
```

---

## 🔗 App Integration Points

### CTAs → App Links
| Webflow CTA | App URL |
|-------------|---------|
| "Get Started" | `https://app.integratewise.ai/auth/sign-up` |
| "Start Free Trial" | `https://app.integratewise.ai/auth/sign-up?plan=starter` |
| "Sign In" | `https://app.integratewise.ai/auth/login` |
| "Request Demo" | `https://app.integratewise.ai/demo` or Calendly |
| "Talk to Sales" | `https://app.integratewise.ai/contact-sales` |
| "Enter Dashboard" | `https://app.integratewise.ai/dashboard` |

### Pricing CTAs
| Plan | CTA URL |
|------|---------|
| Free | `https://app.integratewise.ai/auth/sign-up?plan=free` |
| Growth ($99) | `https://app.integratewise.ai/auth/sign-up?plan=growth` |
| Scale ($299) | `https://app.integratewise.ai/auth/sign-up?plan=scale` |
| Enterprise | `https://app.integratewise.ai/contact-sales?plan=enterprise` |

---

## 📄 Page Wireframes

### 1. HOME PAGE (`/`)
**Purpose**: Convert visitors → signups, explain value prop

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
│ [Logo] How It Works | Use Cases | Pricing | Integrations    │
│                                        [Sign In] [Get Started]│
├─────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  The chaos ends here                                     │ │
│ │                                                          │ │
│ │  Stop fighting with your tools. Stop searching between   │ │
│ │  your AIs. IntegrateWise absorbs the noise and forces    │ │
│ │  every tool and AI to work as one unified system.        │ │
│ │                                                          │ │
│ │  [Enter Dashboard →]  [Watch Demo]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                       [Hero Image/Animation]                 │
├─────────────────────────────────────────────────────────────┤
│ PROBLEM SECTION - "Reality"                                  │
│ ┌───────────────┬───────────────┬───────────────┐           │
│ │ Copy between  │ Trust issues  │ Manual rework │           │
│ │ 5+ tools      │ "Which is     │ 15 hrs/week   │           │
│ │               │  right?"      │               │           │
│ └───────────────┴───────────────┴───────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ SOLUTION - "The IntegrateWise Engine" (6 Stages)            │
│ ┌────────┬────────┬────────┬────────┬────────┬────────┐    │
│ │ 1.LOAD │2.NORM. │3.THINK │ 4.ACT  │5.GOVERN│6.REPEAT│    │
│ │  ↓     │   ↓    │   ↓    │   ↓    │   ↓    │   ↓    │    │
│ │ Bring  │ Clean  │ Surface│ Execute│ Control│ Learn  │    │
│ │ data in│ & align│ insights│actions│ access │ & grow │    │
│ └────────┴────────┴────────┴────────┴────────┴────────┘    │
│                   [Explore How It Works →]                   │
├─────────────────────────────────────────────────────────────┤
│ SOCIAL PROOF - Metrics                                       │
│ ┌───────────────┬───────────────┬───────────────┐           │
│ │ 500+          │ $40K          │ 12 hrs/week   │           │
│ │ Integrations  │ Avg savings   │ Time saved    │           │
│ └───────────────┴───────────────┴───────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ USE CASES PREVIEW                                            │
│ ┌─────────┬─────────┬─────────┬─────────┐                   │
│ │ Sales   │Marketing│ CS      │ Finance │                   │
│ │ →       │ →       │ →       │ →       │                   │
│ └─────────┴─────────┴─────────┴─────────┘                   │
├─────────────────────────────────────────────────────────────┤
│ TESTIMONIALS (Carousel)                                      │
│ "One source of truth changed everything" - Elena V.          │
├─────────────────────────────────────────────────────────────┤
│ FAQ SECTION                                                  │
│ • What makes IntegrateWise different?                        │
│ • How long does setup take?                                  │
│ • What integrations do you support?                          │
│ • Is my data secure?                                         │
├─────────────────────────────────────────────────────────────┤
│ CTA SECTION                                                  │
│ Ready to unify your stack?                                   │
│ [Start Free Trial]  [Request Demo]                           │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ Product | Company | Resources | Legal                        │
│ connect@integratewise.co | Sydney, Australia                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. PRICING PAGE (`/pricing`)
**Purpose**: Clear tier comparison, convert to signup

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Transparent Pricing that scales with you                     │
│ No hidden fees. No surprise costs.                           │
├─────────────────────────────────────────────────────────────┤
│ VALUE PROPS                                                  │
│ ✓ One price, full automation                                 │
│ ✓ Stop paying for tools you barely use                       │
│ ✓ No tool bloat                                              │
├─────────────────────────────────────────────────────────────┤
│ PRICING CARDS                                                │
│ ┌─────────────┬─────────────┬─────────────┐                 │
│ │   GROWTH    │    SCALE    │ ENTERPRISE  │                 │
│ │   $99/mo    │   $299/mo   │   Custom    │                 │
│ │             │  ★ POPULAR  │             │                 │
│ ├─────────────┼─────────────┼─────────────┤                 │
│ │ 5 integrat. │ Unlimited   │ Unlimited   │                 │
│ │ Basic rules │ Adv. rules  │ Custom API  │                 │
│ │ Email suppt │ Priority    │ Dedicated   │                 │
│ │ 7 days live │ 2 days live │ White-glove │                 │
│ ├─────────────┼─────────────┼─────────────┤                 │
│ │[Get Started]│[Get Started]│ [Talk to Us]│                 │
│ └─────────────┴─────────────┴─────────────┘                 │
│ Links:                                                       │
│ Growth → app.integratewise.ai/auth/sign-up?plan=growth       │
│ Scale → app.integratewise.ai/auth/sign-up?plan=scale         │
│ Enterprise → app.integratewise.ai/contact-sales              │
├─────────────────────────────────────────────────────────────┤
│ COMPARISON TABLE                                             │
│ IntegrateWise vs. tool sprawl                                │
│ [Detailed feature comparison matrix]                         │
├─────────────────────────────────────────────────────────────┤
│ ROI SECTION                                                  │
│ $40,000 avg annual savings | 12 hrs/week reclaimed           │
├─────────────────────────────────────────────────────────────┤
│ FAQ                                                          │
│ • Do I pay per integration or user?                          │
│ • What support is included?                                  │
│ • Can I change plans?                                        │
│ • Is there a free trial?                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. HOW IT WORKS - Landing (`/how-it-works-2`)
**Purpose**: Overview of the 6-stage engine

**URL FIX NEEDED**: Rename `how-it-works-2` → `how-it-works`

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ The IntegrateWise Engine                                     │
│ Six stages. One unified system.                              │
├─────────────────────────────────────────────────────────────┤
│ ENGINE OVERVIEW (Interactive/Animated)                       │
│                                                              │
│   ┌──────┐   ┌──────┐   ┌──────┐                            │
│   │ LOAD │ → │NORMAL│ → │THINK │                            │
│   └──────┘   └──────┘   └──────┘                            │
│       ↑                      ↓                               │
│   ┌──────┐   ┌──────┐   ┌──────┐                            │
│   │REPEAT│ ← │GOVERN│ ← │ ACT  │                            │
│   └──────┘   └──────┘   └──────┘                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ STAGE CARDS (Click to expand or navigate)                    │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 1. LOAD - Bring all your data in        │                 │
│ │    Pull from 500+ tools automatically   │                 │
│ │    [Learn more →] /engine-stage-1-load  │                 │
│ └─────────────────────────────────────────┘                 │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 2. NORMALIZE - Clean & align            │                 │
│ │    One schema, one truth                │                 │
│ │    [Learn more →] /engine-stage-2-norm. │                 │
│ └─────────────────────────────────────────┘                 │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 3. THINK - Surface insights             │                 │
│ │    AI-powered recommendations           │                 │
│ │    [Learn more →] /engine-stage-3-think │                 │
│ └─────────────────────────────────────────┘                 │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 4. ACT - Execute automatically          │                 │
│ │    Workflows that actually work         │                 │
│ │    [Learn more →] /engine-stage-4-act   │                 │
│ └─────────────────────────────────────────┘                 │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 5. GOVERN - Control & compliance        │                 │
│ │    Security, audit, permissions         │                 │
│ │    [Learn more →] /engine-stage-5-govern│                 │
│ └─────────────────────────────────────────┘                 │
│                                                              │
│ ┌─────────────────────────────────────────┐                 │
│ │ 6. REPEAT - Learn & improve             │                 │
│ │    Continuous optimization              │                 │
│ │    [Learn more →] /engine-stage-6-repeat│                 │
│ └─────────────────────────────────────────┘                 │
├─────────────────────────────────────────────────────────────┤
│ CTA                                                          │
│ Ready to see it in action?                                   │
│ [Start Free Trial] → app.integratewise.ai/auth/sign-up       │
│ [Request Demo] → Calendly/HubSpot                            │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. ENGINE STAGE PAGES (6 Pages)

Each stage page follows the same template:

#### `/engine-stage-1-load`
```
┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB: How It Works > Load                              │
├─────────────────────────────────────────────────────────────┤
│ HERO                                                         │
│ Stage 1: LOAD                                                │
│ Bring all your data in at once                               │
│ Pull from 500+ tools. No manual exports.                     │
├─────────────────────────────────────────────────────────────┤
│ PROBLEM                                                      │
│ Your data is scattered across:                               │
│ • CRM (Salesforce, HubSpot)                                  │
│ • Email (Gmail, Outlook)                                     │
│ • Spreadsheets (Google Sheets, Excel)                        │
│ • Support (Zendesk, Intercom)                                │
├─────────────────────────────────────────────────────────────┤
│ SOLUTION                                                     │
│ One-click connection to any tool                             │
│ [Integration logos grid]                                     │
├─────────────────────────────────────────────────────────────┤
│ HOW IT WORKS                                                 │
│ 1. Select your tools                                         │
│ 2. Authorize with OAuth                                      │
│ 3. Data flows automatically                                  │
│ [Screenshot/Animation of connector flow]                     │
├─────────────────────────────────────────────────────────────┤
│ FEATURES                                                     │
│ • Real-time sync                                             │
│ • Bi-directional updates                                     │
│ • Historical data import                                     │
│ • Custom field mapping                                       │
├─────────────────────────────────────────────────────────────┤
│ NAVIGATION                                                   │
│ ← Previous: Home    |    Next: Normalize →                   │
├─────────────────────────────────────────────────────────────┤
│ CTA                                                          │
│ [Start Loading Your Data] → app.integratewise.ai/sign-up     │
└─────────────────────────────────────────────────────────────┘
```

**Repeat for stages 2-6 with stage-specific content:**

| Stage | Slug | Headline | Key Message |
|-------|------|----------|-------------|
| 2 | `engine-stage-2-normalize` | Clean & Align | One schema, one truth, no arguments |
| 3 | `engine-stage-3-think` | Surface Insights | AI-powered priorities and next moves |
| 4 | `engine-stage-4-act` | Execute Automatically | Workflows that actually work |
| 5 | `engine-stage-5-govern` | Control & Compliance | Security, audit trails, permissions |
| 6 | `engine-stage-6-repeat` | Learn & Improve | Continuous optimization loop |

---

### 5. USE CASES - Landing (`/use-cases-2`)

**URL FIX NEEDED**: Rename `use-cases-2` → `use-cases`

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Built for every team                                         │
│ See how IntegrateWise solves real problems                   │
├─────────────────────────────────────────────────────────────┤
│ USE CASE GRID                                                │
│ ┌───────────────┬───────────────┬───────────────┐           │
│ │    SALES      │   MARKETING   │      CS       │           │
│ │ Stop losing   │ Attribution   │ 360° customer │           │
│ │ deals to      │ that actually │ view          │           │
│ │ spreadsheets  │ works         │               │           │
│ │ [Learn →]     │ [Learn →]     │ [Learn →]     │           │
│ └───────────────┴───────────────┴───────────────┘           │
│ ┌───────────────┬───────────────┬───────────────┐           │
│ │   FINANCE     │  DEVELOPMENT  │   RESEARCH    │           │
│ │ Billing that  │ API-first     │ Data science  │           │
│ │ reconciles    │ integrations  │ pipelines     │           │
│ │ [Learn →]     │ [Learn →]     │ [Learn →]     │           │
│ └───────────────┴───────────────┴───────────────┘           │
│ ┌───────────────┬───────────────┐                           │
│ │   STRATEGY    │  MANAGEMENT   │                           │
│ │ Real-time     │ Cross-team    │                           │
│ │ dashboards    │ visibility    │                           │
│ │ [Learn →]     │ [Learn →]     │                           │
│ └───────────────┴───────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. USE CASE DETAIL PAGES (8 Pages)

Template for each use case (e.g., `/sales`):

```
┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Use Cases > Sales                                │
├─────────────────────────────────────────────────────────────┤
│ HERO                                                         │
│ Sales                                                        │
│ Stop losing deals to spreadsheets                            │
│ [Demo] [Start Free Trial]                                    │
├─────────────────────────────────────────────────────────────┤
│ THREE PROBLEMS (Cards)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Problem 1: Copying opportunities between 3 tools        │ │
│ │ Problem 2: Forecasts nobody trusts                      │ │
│ │ Problem 3: Follow-ups falling through cracks            │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ SOLUTION - How IntegrateWise Helps                           │
│ • LOAD: Pull every lead automatically                        │
│ • NORMALIZE: Clean duplicates, standardize fields            │
│ • THINK: AI surfaces priority deals                          │
│ • ACT: Automated follow-ups and tasks                        │
├─────────────────────────────────────────────────────────────┤
│ RESULTS (Metrics)                                            │
│ • 30% more selling time                                      │
│ • Forecasts you can trust                                    │
│ • Zero dropped deals                                         │
├─────────────────────────────────────────────────────────────┤
│ TESTIMONIAL                                                  │
│ "We stopped losing leads because our data stayed in sync"    │
│ - James Liu, RevOps Manager                                  │
├─────────────────────────────────────────────────────────────┤
│ CTA                                                          │
│ [See Sales Demo] [Start Free Trial]                          │
│ → app.integratewise.ai/auth/sign-up?use_case=sales           │
└─────────────────────────────────────────────────────────────┘
```

**Use Case Pages Content Map:**

| Page | Slug | Problems | Key Metrics |
|------|------|----------|-------------|
| Sales | `/sales` | Deal tracking, forecasting, follow-ups | 30% more selling time |
| Marketing | `/marketing` | Attribution, campaign sync, lead handoff | 2x qualified leads |
| Customer Success | `/customer-success` | Health scores, renewal tracking, escalations | 40% churn reduction |
| Finance & Billing | `/finance-billing` | Invoice reconciliation, revenue recognition | 90% fewer errors |
| Development | `/development` | API integrations, data pipelines | 50% faster shipping |
| Research | `/research` | Data aggregation, analysis pipelines | 3x insights velocity |
| Strategy | `/strategy` | Real-time dashboards, OKR tracking | Single source of truth |
| Management | `/management` | Cross-team visibility, resource planning | 360° operations view |

---

### 7. ROLES - Landing (`/roles-2`)

**URL FIX NEEDED**: Rename `roles-2` → `roles`

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Built for every role                                         │
│ From C-suite vision to daily execution                       │
├─────────────────────────────────────────────────────────────┤
│ ROLE CARDS                                                   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ VISIONARY (C-Suite, Founders)                          │   │
│ │ See the big picture. Make decisions with confidence.   │   │
│ │ [Learn more →] /visionary                              │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ MISSIONARY (Champions, Evangelists)                    │   │
│ │ Drive adoption. Be the hero of your organization.      │   │
│ │ [Learn more →] /missionary                             │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ PRACTITIONER (Operators, Analysts)                     │   │
│ │ Get things done. Automate the manual work.             │   │
│ │ [Learn more →] /practitioner                           │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ PASSENGER (End Users, Team Members)                    │   │
│ │ Just use it. No training needed.                       │   │
│ │ [Learn more →] /passenger                              │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. INTEGRATIONS PAGE (`/integrations`)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Connect Everything                                           │
│ 500+ tools ready to connect right now                        │
├─────────────────────────────────────────────────────────────┤
│ INTEGRATION CATEGORIES (Filterable)                          │
│ [All] [CRM] [Marketing] [Support] [Finance] [Communication]  │
├─────────────────────────────────────────────────────────────┤
│ INTEGRATION GRID                                             │
│ ┌────────┬────────┬────────┬────────┬────────┬────────┐     │
│ │Salesfrc│ HubSpot│ Slack  │ Gmail  │ Zendesk│ Sheets │     │
│ │ [→]    │ [→]    │ [→]    │ [→]    │ [→]    │ [→]    │     │
│ └────────┴────────┴────────┴────────┴────────┴────────┘     │
│                    [See All 500+ →]                          │
├─────────────────────────────────────────────────────────────┤
│ HOW INTEGRATIONS WORK                                        │
│ 1. One-click OAuth connection                                │
│ 2. Automatic data sync (real-time)                           │
│ 3. Custom field mapping                                      │
├─────────────────────────────────────────────────────────────┤
│ CUSTOM INTEGRATIONS                                          │
│ Don't see your tool? We can build it.                        │
│ [Request Integration] → app.integratewise.ai/request-integ   │
├─────────────────────────────────────────────────────────────┤
│ FAQ                                                          │
│ • How secure are integrations?                               │
│ • What if my tool isn't listed?                              │
│ • How fast do integrations sync?                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 9. ARCHITECTURE PAGE (`/architecture`)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Built for Scale                                              │
│ Enterprise-grade architecture you can trust                  │
├─────────────────────────────────────────────────────────────┤
│ ARCHITECTURE DIAGRAM                                         │
│ [Visual diagram of the 6-stage engine with data flow]        │
├─────────────────────────────────────────────────────────────┤
│ TECHNICAL SPECS                                              │
│ ┌─────────────────┬─────────────────┬─────────────────┐     │
│ │ 99.99% Uptime   │ <100ms Latency  │ SOC 2 Type II   │     │
│ │ SLA             │ P95             │ Certified       │     │
│ └─────────────────┴─────────────────┴─────────────────┘     │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                               │
│ • Multi-region deployment (AWS/GCP)                          │
│ • Auto-scaling based on load                                 │
│ • Real-time data replication                                 │
│ • Edge caching for global performance                        │
├─────────────────────────────────────────────────────────────┤
│ DATA HANDLING                                                │
│ • End-to-end encryption (AES-256)                            │
│ • Customer data isolation                                    │
│ • GDPR/CCPA compliant                                        │
│ • No third-party data sharing                                │
├─────────────────────────────────────────────────────────────┤
│ API                                                          │
│ RESTful API with GraphQL support                             │
│ [View API Docs →] → app.integratewise.ai/docs/api            │
└─────────────────────────────────────────────────────────────┘
```

---

### 10. SECURITY & GOVERNANCE (`/security-governance`)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Security First                                               │
│ Your data is safe with us                                    │
├─────────────────────────────────────────────────────────────┤
│ CERTIFICATIONS                                               │
│ [SOC 2] [GDPR] [HIPAA] [ISO 27001]                           │
├─────────────────────────────────────────────────────────────┤
│ SECURITY FEATURES                                            │
│ • End-to-end encryption                                      │
│ • Role-based access control (RBAC)                           │
│ • SSO/SAML support                                           │
│ • Audit logging                                              │
│ • Data residency options                                     │
├─────────────────────────────────────────────────────────────┤
│ COMPLIANCE                                                   │
│ • GDPR compliant                                             │
│ • CCPA compliant                                             │
│ • HIPAA available (Enterprise)                               │
├─────────────────────────────────────────────────────────────┤
│ GOVERNANCE TOOLS                                             │
│ • Permission management                                      │
│ • Data access policies                                       │
│ • Retention policies                                         │
│ • Export controls                                            │
├─────────────────────────────────────────────────────────────┤
│ SECURITY WHITEPAPER                                          │
│ [Download Security Overview PDF]                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 11. ABOUT / OUR STORY (`/about-our-story`)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Our Story                                                    │
│ We built IntegrateWise because we lived the chaos            │
├─────────────────────────────────────────────────────────────┤
│ MISSION                                                      │
│ "Make every tool and AI work as one unified system"          │
├─────────────────────────────────────────────────────────────┤
│ FOUNDER STORY                                                │
│ [Photo] + narrative about why we started                     │
├─────────────────────────────────────────────────────────────┤
│ VALUES                                                       │
│ • Simplicity over complexity                                 │
│ • Customer outcomes first                                    │
│ • Transparency in everything                                 │
├─────────────────────────────────────────────────────────────┤
│ TEAM (Optional)                                              │
│ [Team photos and bios]                                       │
├─────────────────────────────────────────────────────────────┤
│ LOCATION                                                     │
│ Sydney, Australia                                            │
│ connect@integratewise.co                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 12. CONTACT / REQUEST A DEMO (`/contact-request-a-demo`)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Let's Talk                                                   │
│ Request a demo or get in touch                               │
├─────────────────────────────────────────────────────────────┤
│ TWO COLUMNS                                                  │
│ ┌─────────────────────┬─────────────────────────────────┐   │
│ │ REQUEST A DEMO      │ CONTACT INFO                    │   │
│ │                     │                                 │   │
│ │ [Form]              │ Email:                          │   │
│ │ • Name              │ connect@integratewise.co        │   │
│ │ • Email             │                                 │   │
│ │ • Company           │ Phone:                          │   │
│ │ • Role              │ +91 70197 46296                 │   │
│ │ • Team Size         │                                 │   │
│ │ • Message           │ Location:                       │   │
│ │                     │ Sydney, Australia               │   │
│ │ [Submit →]          │                                 │   │
│ └─────────────────────┴─────────────────────────────────┘   │
│ Form submission → app.integratewise.ai/api/webflow/forms     │
├─────────────────────────────────────────────────────────────┤
│ CALENDLY EMBED (Alternative)                                 │
│ [Calendly booking widget]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 13. EDUCATION PAGES (5 Pages)

Landing: `/institutions-universities` (rename consideration)

| Page | Slug | Audience | Key Message |
|------|------|----------|-------------|
| Institutions | `/institutions-universities` | Universities, Colleges | Academic integration solutions |
| Educators | `/educators` | Professors, Teachers | Tools for teaching with data |
| Students | `/students` | Students | Learn real-world integration |
| Freelancers | `/freelancers` | Independent consultants | Power your practice |
| HR/External | `/employee-and-external-relations` | HR teams | People data integration |

---

## 🔧 URL Structure Fixes Needed

| Current Slug | Recommended Slug | Action |
|--------------|------------------|--------|
| `how-it-works-2` | `how-it-works` | Rename |
| `how-it-works-3` | DELETE | Remove duplicate |
| `how-it-works-4` | DELETE | Remove duplicate |
| `use-cases-2` | `use-cases` | Rename |
| `roles-2` | `roles` | Rename |
| `case-studies-2` | `case-studies` | Rename |
| `blog-2` | `blog` | Rename |

---

## 🎨 Global Components

### NAVBAR
```
[Logo] How It Works ▼ | Use Cases ▼ | Pricing | Integrations | Security
                                            [Sign In] [Get Started →]

How It Works dropdown:
- Overview
- 1. Load
- 2. Normalize
- 3. Think
- 4. Act
- 5. Govern
- 6. Repeat

Use Cases dropdown:
- Sales
- Marketing
- Customer Success
- Finance
- Development
- Research
- Strategy
- Management
```

### FOOTER
```
┌─────────────────────────────────────────────────────────────┐
│ Product         Company         Resources       Legal        │
│ How It Works    About           Blog           Privacy       │
│ Use Cases       Careers         Case Studies   Terms         │
│ Pricing         Contact         Documentation  Security      │
│ Integrations                    API Docs                     │
│ Architecture                                                 │
│                                                              │
│ connect@integratewise.co  |  Sydney, Australia               │
│ © 2026 IntegrateWise. All rights reserved.                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 App Links Summary

All CTAs should link to these app URLs:

| Action | URL |
|--------|-----|
| Sign Up (default) | `https://app.integratewise.ai/auth/sign-up` |
| Sign Up (with plan) | `https://app.integratewise.ai/auth/sign-up?plan={plan}` |
| Sign Up (with use case) | `https://app.integratewise.ai/auth/sign-up?use_case={use_case}` |
| Sign In | `https://app.integratewise.ai/auth/login` |
| Dashboard | `https://app.integratewise.ai/dashboard` |
| Contact Sales | `https://app.integratewise.ai/contact-sales` |
| Request Demo | `https://calendly.com/integratewise/demo` or internal |
| API Docs | `https://app.integratewise.ai/docs/api` |

---

## ✅ Implementation Checklist

### Phase 1: Fix URL Structure
- [ ] Rename `how-it-works-2` → `how-it-works`
- [ ] Rename `use-cases-2` → `use-cases`
- [ ] Rename `roles-2` → `roles`
- [ ] Rename `case-studies-2` → `case-studies`
- [ ] Rename `blog-2` → `blog`
- [ ] Delete duplicate pages (`how-it-works-3`, `how-it-works-4`)

### Phase 2: Wire Up Navigation
- [ ] Update navbar links to correct slugs
- [ ] Add dropdown menus for How It Works, Use Cases
- [ ] Update footer links

### Phase 3: Connect App CTAs
- [ ] Update all "Get Started" → `app.integratewise.ai/auth/sign-up`
- [ ] Update all "Sign In" → `app.integratewise.ai/auth/login`
- [ ] Update pricing CTAs with plan parameters
- [ ] Update use case CTAs with use_case parameters

### Phase 4: Publish All Pages
- [ ] Publish engine stage pages (1-6)
- [ ] Publish use case pages (8)
- [ ] Publish role pages (4)
- [ ] Publish education pages (5)
- [ ] Publish to custom domain `integratewise.ai`

### Phase 5: Update Contact Info
- [ ] Change all emails to `connect@integratewise.co`
- [ ] Update phone number if needed
- [ ] Update location/address

---

## 📧 Contact
- **Email**: connect@integratewise.co
- **App**: app.integratewise.ai
- **Website**: integratewise.ai
