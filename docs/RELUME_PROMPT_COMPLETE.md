# IntegrateWise - Complete Relume Website Prompt

## EXECUTIVE SUMMARY

**Company:** IntegrateWise  
**Tagline:** The AI-Native Integration Intelligence Platform  
**Category:** Integration Operating System (iOS) - B2B SaaS  
**Target Audience:** CSMs, RevOps, Founders, Product Managers at B2B SaaS companies (50-500 employees)

**The Problem:** B2B SaaS companies struggle with fragmented customer data across 50+ tools. Current solutions (iPaaS, ELT, workflow automation) only move data — they don't understand it, remember it, or act on it intelligently.

**The Solution:** IntegrateWise is a cognitive integration layer that adds AI intelligence on top of existing infrastructure. It doesn't replace your tools — it connects them with memory, context, and autonomous intelligence.

---

## BRAND FOUNDATION

### Visual Identity

**Primary Colors:**
- Navy Blue: `#4154A3` (Primary brand, trust, intelligence)
- Pink Accent: `#EB4379` (Action, energy, innovation)
- Dark Navy: `#222C40` (Text, depth, structure)
- Midnight: `#1F2435` (Headers, emphasis)

**Secondary Colors:**
- Light Gray: `#F8FAFC` (Backgrounds)
- White: `#FFFFFF` (Cards, content areas)
- Success Green: `#10B981` (Health, growth)
- Warning Amber: `#F59E0B` (Alerts, attention)

**Typography:**
- Headlines: Clean geometric sans-serif (Inter or similar)
- Body: High readability sans-serif
- Code/Technical: Monospace for technical elements

**Logo:**
- Brain icon (3 connected nodes) + "IntegrateWise" wordmark
- 545×159px intrinsic dimensions
- Navy + Pink color scheme
- Rounded, approachable curves

---

## ARCHITECTURE DEEP DIVE (CRITICAL)

### The L0-L3 Cognitive Stack

**L0: The Foundation Layer (Raw Data)**
- Universal connectors for 200+ SaaS tools
- Real-time streaming + batch ingestion
- Schema discovery and auto-mapping
- Error resilience with exponential backoff
- Data quality scoring at ingestion

**L1: The Semantic Layer (Understanding)**
- Entity resolution across systems ("Acme Corp" = "Acme Inc.")
- Relationship mapping (Contact → Account → Opportunity)
- Historical state preservation (time-travel queries)
- Semantic normalization (standardize field meanings)
- Data lineage tracking (where did this come from?)

**L2: The Knowledge Layer (Context)**
- 360° entity views with complete history
- Cross-system metric correlation
- Health scoring algorithms
- Pattern recognition and anomaly detection
- AI-generated insights and recommendations

**L3: The Intelligence Layer (Action)**
- Autonomous workflow execution
- Predictive intervention suggestions
- Policy enforcement and governance
- Natural language interface
- Continuous learning from outcomes

### The Six-Stage Engine Cycle

**STAGE 1: LOAD**
- Connect to any API, database, or file system
- Automatic schema extraction
- Real-time change data capture
- Queue-based ingestion with retry logic

**STAGE 2: NORMALIZE**
- Transform to canonical data models
- Entity deduplication and merging
- Field standardization and validation
- Data quality scoring

**STAGE 3: THINK**
- AI analysis of patterns and relationships
- Anomaly detection across time series
- Correlation discovery between metrics
- Insight generation with confidence scores

**STAGE 4: ACT**
- Trigger workflows based on conditions
- Sync data across systems bidirectionally
- Generate alerts and notifications
- Execute policy enforcement rules

**STAGE 5: GOVERN**
- Audit all changes and decisions
- Enforce compliance policies
- Track data lineage and ownership
- Manage retention and privacy rules

**STAGE 6: REPEAT**
- Continuous monitoring and learning
- Adaptive model improvement
- Feedback loop integration
- Proactive health maintenance

### Dual-Write Linkage Handshake (NA5)

The core technical innovation — every data write happens simultaneously to:

1. **The Spine (Source of Truth)** — Raw, immutable facts
2. **The Knowledge Layer (Context)** — Semantic meaning, relationships, history

Linked by `entity_id` — never lose context even as systems evolve.

---

## SECURITY & COMPLIANCE ARCHITECTURE (CRITICAL)

### Certifications & Compliance
- **SOC 2 Type II** — Security, availability, confidentiality
- **GDPR** — Full data residency and deletion support
- **CCPA** — California privacy rights
- **HIPAA** — Healthcare data protection (Business Associate Agreement available)
- **ISO 27001** — Information security management

### Security Features

**Data Protection:**
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- Field-level encryption for PII
- Automatic key rotation
- Customer-managed encryption keys (CMEK) option

**Access Control:**
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Single Sign-On (SSO) via SAML 2.0 and OIDC
- Multi-factor authentication (MFA)
- API key management with granular scopes

**Infrastructure:**
- AWS/GCP/Azure cloud options
- VPC isolation per customer
- PrivateLink/Private Service Connect support
- DDoS protection via Cloudflare
- Penetration testing (quarterly)

**Audit & Monitoring:**
- Complete audit logs of all data access
- Real-time security alerting
- SIEM integration (Splunk, Datadog, etc.)
- Compliance dashboards
- Data retention policy automation

### Data Residency
- US (multiple regions)
- EU (Frankfurt, Dublin)
- UK (London)
- Canada (Montreal)
- Australia (Sydney)
- Custom regions for enterprise

---

## THE 16 DIFFERENTIATORS (DETAILED)

### NA1. Unified Namespace Architecture
Single coherent system for all data — no more data silos. Every entity has a canonical ID that persists across all integrations.

### NA2. Native Entity 360
Complete view of any entity across all time and all systems. See a customer's journey from first touch to renewal in one view.

### NA3. Continuous Intelligence
Background AI that works 24/7 — constantly analyzing, learning, and optimizing. Not just reactive, but predictive.

### NA4. Zero-Config Schema Evolution
Your integrations don't break when vendors change their APIs. Automatic schema migration and backwards compatibility.

### NA5. Dual-Write Linkage Handshake
The "secret sauce" — every write updates both raw data and semantic context simultaneously. Never lose meaning.

### NA6. Cognitive Memory Layer
AI remembers past conversations, decisions, and corrections. Ask "why did we discount Acme Corp 20%?" and get the full context.

### NA7. L0-L3 Cognitive Architecture
Four distinct layers of intelligence from raw data to autonomous action. Each layer adds value and builds on the previous.

### NA8. MCP-Native by Design
Model Context Protocol support — AI agents can discover and use IntegrateWise capabilities, not just query data.

### NA9. Semantic Health Monitoring
Detects when data relationships drift (e.g., "this metric usually correlates with that one, but it stopped").

### NA10. Goal-Metric-KPI Cascade
Every metric automatically links to both vendor goals (your company) and client goals (your customer's success).

### NA11. Policy as Executable Code
Governance rules that actually enforce themselves — not just documentation, but active monitoring and intervention.

### NA12. Buckets™ Data Model
Flexible, taggable containers that adapt to any data shape. Tag data by project, customer, sensitivity, or custom dimensions.

### NA13. Adaptive Spine
Entity relationships evolve as your business changes. Add new attributes without breaking existing integrations.

### NA14. Shadow Mode Deployment
Test new integrations safely — run in parallel with existing systems without risk. Validate before cutover.

### NA15. Bridge Architecture
Seamless handoff between AI assistance and human expertise. AI handles routine, humans handle exceptions.

### NA16. Non-Disruptive Integration
Works alongside existing tools — no rip-and-replace. Complement your current stack, don't disrupt it.

---

## USE CASES & PERSONAS

### Persona 1: The CSM (Customer Success Manager)
**Pain Points:**
- Data scattered across 10+ tools
- No single view of customer health
- Reactive firefighting instead of proactive success
- Manual QBR preparation takes days

**IntegrateWise Solution:**
- Unified customer 360 dashboard
- AI-powered health scoring
- Automated QBR decks with insights
- Early warning alerts for churn risk

**ROI:** 70% reduction in QBR prep time, 25% improvement in retention

---

### Persona 2: The RevOps Lead
**Pain Points:**
- Pipeline data doesn't match financial data
- Lead routing breaks when systems change
- Forecasting based on gut, not data
- Tool sprawl creating chaos

**IntegrateWise Solution:**
- Single source of truth for GTM data
- Automated lead-to-cash reconciliation
- Predictive forecasting with AI
- Unified metric definitions

**ROI:** 50% faster month-end close, 30% forecast accuracy improvement

---

### Persona 3: The Founder/CEO
**Pain Points:**
- Can't trust the numbers in board meetings
- Every department has different metrics
- Due diligence is a nightmare
- Strategic decisions based on incomplete data

**IntegrateWise Solution:**
- Verified, auditable metrics
- Single dashboard for company health
- AI-generated board prep
- Investor-ready data rooms

**ROI:** 10 hours/week saved on reporting, faster fundraising

---

### Persona 4: The Product Manager
**Pain Points:**
- Feature adoption data in silos
- Can't connect product usage to revenue
- Beta feedback scattered across channels
- Launch metrics take weeks to compile

**IntegrateWise Solution:**
- Feature adoption tracking across segments
- Product-qualified lead identification
- Unified beta feedback collection
- Real-time launch dashboards

**ROI:** 3x faster product iteration, clearer feature ROI

---

## PAGE-BY-PAGE SPECIFICATIONS

### PAGE 1: HOMEPAGE

**Hero Section**
- Headline: "The Integration Operating System for B2B SaaS"
- Subheadline: "Connect your customer data with AI that understands context, remembers history, and acts autonomously."
- Primary CTA: "Start Free Trial" (email + company size capture)
- Secondary CTA: "See How It Works" (scroll to video/demo)
- Visual: Animated L0-L3 stack visualization or product dashboard screenshot
- Trust badges: "SOC 2 Certified" + "GDPR Compliant" + "99.99% Uptime"

**Logo Bar**
- "Trusted by fast-growing B2B teams"
- 5-6 customer logos (grayed out, hover reveals color)

**The Problem (Pain Agitation)**
- Headline: "Your customer data is everywhere. Your insights are nowhere."
- 3-column layout:
  1. "Data Silos" — Tools don't talk to each other
  2. "Context Loss" — Historical data gets overwritten
  3. "Reactive Firefighting" — You find out about problems too late
- Visual: Fragmented dashboard mockup vs. unified IntegrateWise view

**The Solution (Value Prop)**
- Headline: "One platform. Complete context. Autonomous intelligence."
- 4-column feature grid:
  1. **Connect** — Universal integrations (200+ connectors)
  2. **Understand** — AI-powered semantic layer
  3. **Remember** — Persistent cognitive memory
  4. **Act** — Autonomous workflow execution
- Visual: Product screenshot or animated diagram

**How It Works (Process)**
- Headline: "The 6-Stage Intelligence Engine"
- Horizontal timeline or circular diagram:
  1. Load → 2. Normalize → 3. Think → 4. Act → 5. Govern → 6. Repeat
- Brief description for each stage
- Hover/click for more detail

**Social Proof**
- Headline: "Loved by operations teams"
- 3 testimonial cards with:
  - Customer photo/logo
  - Quote (specific metric preferred)
  - Name, title, company
  - Link to full case study

**Use Case Grid**
- Headline: "Built for every role"
- 2x2 or 3x2 grid:
  - Customer Success (icon: heart/handshake)
  - Revenue Operations (icon: chart/growth)
  - Founders & Executives (icon: rocket/strategy)
  - Product Teams (icon: cube/gear)
- Each links to dedicated use case page

**Architecture Teaser**
- Headline: "Built for scale. Designed for trust."
- Brief overview of L0-L3 architecture
- Link to full Architecture page
- Security badges prominently displayed

**CTA Section**
- Headline: "Ready to unify your customer data?"
- Subheadline: "Start free. No credit card required."
- Email capture form
- Trust text: "Free 14-day trial • SOC 2 certified • Cancel anytime"

---

### PAGE 2: ARCHITECTURE

**Hero**
- Headline: "The Cognitive Integration Stack"
- Subheadline: "Four layers of intelligence that transform raw data into autonomous action"
- Visual: Layered architecture diagram (L0-L3)

**L0: Foundation Layer**
- Headline: "Connect Everything"
- Content:
  - Universal connector framework
  - Real-time + batch ingestion
  - Schema auto-discovery
  - Error resilience with retry logic
- Visual: Connector icons flowing into central hub
- Tech specs: Supported protocols (REST, GraphQL, gRPC, SQL, etc.)

**L1: Semantic Layer**
- Headline: "Understand Relationships"
- Content:
  - Entity resolution across systems
  - Relationship mapping
  - Historical state preservation
  - Data lineage tracking
- Visual: Entity relationship diagram
- Example: "How we connect a Contact to an Account across Salesforce, HubSpot, and your database"

**L2: Knowledge Layer**
- Headline: "Build Context"
- Content:
  - 360° entity views
  - Cross-system correlation
  - Health scoring
  - Anomaly detection
- Visual: 360° dashboard mockup
- Metrics: "10,000+ entities tracked per customer on average"

**L3: Intelligence Layer**
- Headline: "Act Autonomously"
- Content:
  - Workflow automation
  - Predictive interventions
  - Policy enforcement
  - Natural language interface
- Visual: AI assistant interface or workflow builder
- Example workflows with before/after

**The Six-Stage Engine**
- Detailed vertical timeline
- Each stage with:
  - Icon
  - Name
  - Description
  - Input/output example
  - Time indicator (real-time vs. batch)

**Security Architecture**
- Dedicated subsection
- Encryption diagram (at-rest + in-transit)
- Compliance badge grid
- "Security Whitepaper" download CTA

**Technical Specifications**
- Data tables with:
  - Throughput limits (events/second)
  - Storage retention policies
  - API rate limits
  - Supported data types
  - Integration latency SLAs

**Deployment Options**
- Cloud (multi-tenant)
- Dedicated (single-tenant)
- VPC/PrivateLink
- On-premise (enterprise)

---

### PAGE 3: SECURITY & GOVERNANCE

**Hero**
- Headline: "Enterprise-Grade Security by Design"
- Subheadline: "SOC 2 Type II certified, GDPR compliant, and trusted by security-conscious teams"
- Visual: Security shield with certification badges

**Certifications Grid**
- Large badges for:
  - SOC 2 Type II
  - GDPR
  - ISO 27001
  - CCPA
  - HIPAA (available)
- Each clickable for verification/details

**Security Features (3-column)**

**Column 1: Data Protection**
- AES-256 encryption at rest
- TLS 1.3 in transit
- Field-level PII encryption
- Customer-managed keys (CMEK)
- Automatic key rotation

**Column 2: Access Control**
- SSO (SAML 2.0, OIDC)
- Multi-factor authentication
- Role-based access control
- API key management
- Session management

**Column 3: Infrastructure**
- VPC isolation
- PrivateLink support
- DDoS protection
- Penetration testing
- 99.99% uptime SLA

**Compliance Features**
- Data residency options
- Right to deletion
- Data portability
- Audit logs
- Breach notification

**Trust Center**
- Security whitepaper download
- Penetration test summaries
- Subprocessor list
- Status page link
- Contact security team

---

### PAGE 4: USE CASES (Hub)

**Hero**
- Headline: "Built for Every Team"
- Subheadline: "See how different roles use IntegrateWise to drive outcomes"

**Role Cards (4-column)**

**Customer Success**
- Icon: Heart/handshake
- Headline: "Proactive Customer Success"
- Bullets:
  - 360° customer health dashboards
  - Automated QBR preparation
  - Churn risk early warning
  - Expansion opportunity detection
- CTA: "See CSM Features"
- Case study link

**Revenue Operations**
- Icon: Chart/growth
- Headline: "Unified Revenue Operations"
- Bullets:
  - Lead-to-cash reconciliation
  - Predictive forecasting
  - Territory planning
  - Pipeline hygiene monitoring
- CTA: "See RevOps Features"
- Case study link

**Founders & Executives**
- Icon: Rocket/strategy
- Headline: "Strategic Decision Intelligence"
- Bullets:
  - Single source of truth
  - AI-powered board prep
  - Investor-ready metrics
  - Strategic planning support
- CTA: "See Executive Features"
- Case study link

**Product Teams**
- Icon: Cube/gear
- Headline: "Data-Driven Product Development"
- Bullets:
  - Feature adoption tracking
  - Beta program management
  - Product-qualified leads
  - Launch health monitoring
- CTA: "See Product Features"
- Case study link

---

### PAGE 5: USE CASE DETAIL (Individual)

**Template for each role-specific page:**

**Hero**
- Role-specific headline
- Key metric highlight (e.g., "70% faster QBR prep")
- Testimonial from that role

**The Problem**
- 3 specific pain points for this role
- Visual: Frustrated workflow diagram

**The Solution**
- How IntegrateWise solves each pain point
- Feature screenshots
- Before/after comparison

**Key Features (for this role)**
- 4-6 feature deep-dives
- Each with screenshot, explanation, and benefit

**ROI Calculator**
- Interactive calculator
- Inputs: Team size, current tool costs, hours spent on manual tasks
- Output: Estimated savings with IntegrateWise

**Customer Story**
- Full case study
- Quote, metrics, company logo
- "Read full story" link

**Related Resources**
- Blog posts for this role
- Webinar recordings
- Template downloads

---

### PAGE 6: INTEGRATIONS

**Hero**
- Headline: "Connect Your Entire Stack"
- Subheadline: "200+ pre-built connectors. Custom integrations in minutes, not months."
- Visual: Integration network diagram

**Integration Grid**
- Filterable by category:
  - CRM (Salesforce, HubSpot, Pipedrive)
  - Marketing (Marketo, Klaviyo, Customer.io)
  - Product (Segment, Amplitude, Mixpanel)
  - Finance (Stripe, NetSuite, QuickBooks)
  - Support (Zendesk, Intercom, Freshdesk)
  - Communication (Slack, Teams, email)
  - Data Warehouse (Snowflake, BigQuery, Redshift)
  - Database (PostgreSQL, MySQL, MongoDB)
- Search bar
- "Request new integration" CTA

**Universal Connector**
- Headline: "Can't find your tool? Build it."
- Content:
  - REST/GraphQL API connector
  - Webhook support
  - Custom transformation logic
  - Schema mapping UI
- Visual: Connector builder interface
- Code snippet example

**Integration Health Dashboard**
- Screenshot of monitoring UI
- Features:
  - Real-time sync status
  - Error alerting
  - Data quality scores
  - Usage analytics

---

### PAGE 7: PRICING

**Hero**
- Headline: "Simple, Transparent Pricing"
- Subheadline: "Start free. Scale as you grow."
- Toggle: Monthly / Annual (save 20%)

**Pricing Tiers (3-column)**

**Starter**
- Price: $99/month (annual) or $129/month
- For: Small teams getting started
- Includes:
  - Up to 10,000 entities
  - 5 integrations
  - 2 users
  - L0-L2 features
  - Email support
  - Standard connectors
- CTA: "Start Free Trial"

**Growth (Most Popular)**
- Price: $499/month (annual) or $649/month
- Badge: "Best Value"
- For: Scaling teams
- Includes:
  - Up to 100,000 entities
  - 20 integrations
  - 10 users
  - Full L0-L3 features
  - Priority support
  - All connectors + custom
  - AI insights
- CTA: "Start Free Trial"

**Enterprise**
- Price: Custom
- For: Large organizations
- Includes:
  - Unlimited entities
  - Unlimited integrations
  - Unlimited users
  - Dedicated success manager
  - SLA guarantees
  - Custom contracts
  - On-premise option
  - Advanced security
- CTA: "Contact Sales"

**Feature Comparison Table**
- Full feature matrix
- Expandable sections
- Tooltips for feature descriptions

**FAQ Section**
- Common pricing questions
- "Can I change plans?"
- "What counts as an entity?"
- "Do you offer discounts for nonprofits?"
- "What's your refund policy?"

---

### PAGE 8: ABOUT / OUR STORY

**Hero**
- Headline: "Built by Operators, for Operators"
- Subheadline: "We're solving the integration problems we faced ourselves"
- Visual: Team photo or office culture shot

**The Story**
- Timeline format:
  - 2022: Founders experienced the pain at previous startup
  - 2023: Built initial prototype with design partners
  - 2024: Launched with 10 beta customers
  - 2025: $XM ARR, 100+ customers
- Photos/milestones

**Mission & Values**
- Mission statement
- 4-5 core values with descriptions:
  1. Customer Obsession
  2. Technical Excellence
  3. Continuous Learning
  4. Radical Transparency
  5. Sustainable Growth

**Team Section**
- Leadership team with photos
- Department highlights (Engineering, Customer Success, etc.)
- "Join the team" CTA linking to careers

**Investors/Backers**
- VC logos (if applicable)
- Angel investors
- Advisor network

**Press & Media**
- Recent press mentions
- Download press kit
- Brand assets

---

### PAGE 9: BLOG / RESOURCES

**Hub Layout**
- Featured post (hero section)
- Category filters:
  - Integration Intelligence
  - Customer Success
  - Revenue Operations
  - Product Updates
  - Case Studies
- Grid of recent posts
- Newsletter signup

**Blog Post Template**
- Author byline with photo
- Reading time
- Category tags
- Social sharing buttons
- Related posts
- Newsletter CTA at bottom

---

### PAGE 10: CASE STUDIES

**Hub Layout**
- Filter by industry, use case, company size
- Grid of case study cards with:
  - Company logo
  - Key metric highlight
  - Brief description
  - "Read case study" link

**Individual Case Study Template**
- Hero: Company logo + key metric
- Challenge section
- Solution section
- Results section (with metrics)
- Quote from customer
- "See similar case studies" links

---

### PAGE 11: CONTACT / REQUEST DEMO

**Two-column layout:**

**Left: Form**
- First name, Last name
- Work email
- Company name
- Company size (dropdown)
- Role (dropdown)
- Message / What are you trying to solve?
- "Request Demo" button

**Right: Alternative Contact**
- Sales email
- Phone number
- Office address (if applicable)
- Links to:
  - Documentation
  - Community forum
  - Support center

---

## COMPONENT LIBRARY REQUIREMENTS

### Navigation
- Sticky header with logo, nav links, CTA
- Dropdowns for Use Cases, Resources
- Mobile hamburger menu
- "Book Demo" prominent button

### Hero Sections
- Large headline + subheadline
- Primary and secondary CTAs
- Hero image/video (product screenshot or abstract visualization)
- Trust badges below fold

### Feature Cards
- Icon (custom SVG or Lucide)
- Headline
- Description
- Optional: "Learn more" link

### Testimonial Cards
- Quote text
- Photo
- Name, title, company
- Optional: Company logo

### Pricing Cards
- Tier name
- Price (monthly/annual toggle)
- Feature list with checkmarks
- CTA button
- "Popular" badge for Growth tier

### Integration Grid Items
- Tool logo
- Tool name
- Category tag
- Hover: Brief description

### FAQ Accordion
- Question
- Expandable answer
- Smooth animation

### CTA Sections
- Contrasting background color
- Headline + subheadline
- Email capture or button
- Trust text

### Footer
- Logo
- Column links (Product, Company, Resources, Legal)
- Social media icons
- Copyright
- Privacy/Terms links

---

## INTERACTIVE ELEMENTS

1. **Pricing Calculator** — Estimate costs based on entity count
2. **ROI Calculator** — Time savings calculator by role
3. **Integration Search** — Filter connectors by category/name
4. **Architecture Explorer** — Click through L0-L3 layers
5. **Demo Booking** — Calendar embed (Calendly/Chilipiper)

---

## CONTENT TONE & STYLE GUIDE

**Tone Attributes:**
- Professional but approachable
- Technical credibility without jargon
- Empathetic to operator struggles
- Confident, not arrogant
- "We've been there" vibe

**Writing Principles:**
- Lead with benefits, not features
- Use specific metrics (not "improve efficiency" but "save 10 hours/week")
- Active voice
- Short paragraphs (2-3 sentences max)
- Bullet points for scannability

**Words to Use:**
- Intelligence, context, memory, autonomous
- Unified, seamless, integrated
- Proactive, predictive, preventive
- Trusted, secure, proven

**Words to Avoid:**
- "Synergy", "paradigm", "leverage" (buzzwords)
- "Simply", "just", "easily" (dismissive)
- Over-promising ("revolutionary", "game-changing")

---

## SEO REQUIREMENTS

**Primary Keywords:**
- Integration platform
- Customer data platform
- Integration operating system
- AI integration
- Customer 360
- Data integration software

**Long-tail Keywords:**
- "Best integration platform for SaaS"
- "Customer success data integration"
- "Revenue operations automation"
- "Unified customer view software"

**Meta Requirements:**
- Unique title tags (60 chars max)
- Meta descriptions (155 chars max)
- OG tags for social sharing
- Structured data (Organization, Product, FAQ)

---

## ANALYTICS & TRACKING

**Required Events:**
- Page views
- CTA clicks (track by button text)
- Form submissions
- Pricing tier selection
- Integration search queries
- Demo requests
- Newsletter signups
- Video plays (if applicable)

**Tools:**
- Google Analytics 4
- Mixpanel or Amplitude
- Hotjar (heatmaps/recordings)

---

## TECHNICAL REQUIREMENTS

**Performance:**
- Lighthouse score >90
- First Contentful Paint <1.5s
- Time to Interactive <3.5s

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Alt text for all images

**Responsive:**
- Mobile-first design
- Breakpoints: 360, 768, 1024, 1440px
- Touch-friendly targets (min 44px)

**SEO:**
- Semantic HTML
- Canonical tags
- XML sitemap
- Robots.txt
- Fast load times

---

## ASSETS PROVIDED

**Logo:**
- `logo.svg` — Full horizontal (545×159)
- `favicon.svg` — Icon only (180×180)
- `icon.svg` — Small icon (32×32)

**Colors:**
- Navy: #4154A3
- Pink: #EB4379
- Dark: #222C40, #1F2435
- Light: #F8FAFC

**Reference Materials:**
- Complete Webflow export available
- Brand guidelines PDF (if provided)
- Existing product screenshots

---

## LAUNCH CHECKLIST

- [ ] All pages created and reviewed
- [ ] All links working
- [ ] Forms connected to backend
- [ ] Analytics tracking verified
- [ ] SEO meta tags complete
- [ ] Performance optimized
- [ ] Accessibility audited
- [ ] Mobile responsive tested
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Legal pages (Privacy, Terms) complete
- [ ] 404 page designed
- [ ] SSL certificate active
- [ ] Sitemap submitted to Google

---

**END OF PROMPT**

This prompt contains everything needed to build a comprehensive, conversion-focused marketing website for IntegrateWise. All critical elements — architecture, security, differentiators, and use cases — are documented with specific content requirements.
