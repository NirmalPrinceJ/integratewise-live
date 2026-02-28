# Architecture Misalignment Summary
**AGENTS.md vs. Current Implementation**

---

## The Gap

| Layer | Spec | Reality | Match |
|-------|------|---------|-------|
| **L0** | 4-stage onboarding | Login page only | ❌ 25% |
| **L1** | 15 modules | 6 modules | ❌ 40% |
| **L2** | 14 cognitive components | 5 components | ❌ 36% |
| **L3** | 8-stage pipeline | 8 API modules | ✅ 100% |

**Overall: 65% aligned with architecture**

---

## What's Missing

### 🔴 L0: Missing 75%
**Spec:** Entry → AI Insights → Demo → Context → Connect

**Current:** Just a login form

**Need to Build:**
1. `/onboarding/welcome` - AI personality analyzer
2. `/onboarding/demo` - Live AI demo
3. `/onboarding/context` - Path selector (Productivity Hub vs CS)
4. `/onboarding/connect` - Tool connection wizard

### 🟠 L1: Missing 9 of 15 Modules
**Spec:** Home, Projects, Accounts, Contacts, Meetings, Docs, Tasks, Calendar, Notes, Knowledge, Team, Pipeline, Risks, Expansion, Analytics

**Current:** Dashboard, Accounts, Tasks, Calendar, Intelligence, Settings

**Need to Build:**
1. **Home** (enhance current Dashboard)
2. **Projects** - Cross-tool project tracking
3. **Contacts** - Contact directory with relationships
4. **Meetings** - AI-generated agendas
5. **Docs** - Document hub with embeddings
6. **Notes** - AI-assisted note-taking
7. **Knowledge** - Knowledge graph
8. **Team** - Team performance
9. **Pipeline** - Deal tracking
10. **Analytics** - Cross-module analytics
11. **Risks** - Risk detection
12. **Expansion** - Upsell opportunities

### 🟡 L2: Missing 9 of 14 Components
**Spec:** SpineUI, ContextUI, KnowledgeUI, Evidence, Signals, Think, Act, HITL, Govern, Adjust, Repeat, AuditUI, AgentConfig, DigitalTwin

**Current:** Signals (in Dashboard), Act (Actions), HITL (ProtectedRoute), partial Think (Intelligence), partial AuditUI (Settings)

**Need to Build:**
1. **SpineUI** - Canonical data browser
2. **ContextUI** - Unstructured content viewer
3. **KnowledgeUI** - Knowledge graph explorer
4. **EvidencePanel** - Evidence compiler ("Why this signal?")
5. **Govern** - Policy enforcement UI
6. **Adjust** - Feedback capture for learning
7. **Repeat** - Continuous cycle visualization
8. **AgentConfig** - Agent administration panel
9. **DigitalTwin** - Simulation environment

---

## The Figma Decision Tree

### For UI/UX Designer:

**Q1: L0 Onboarding - 4 screens or skip?**
- ✅ **Build all 4** - This is the "wow moment" per AGENTS.md
- Screen 1: AI personality insights
- Screen 2: Live demo (natural language → 4 tools)
- Screen 3: Context selection (Productivity vs CS)
- Screen 4: Tool connection

**Q2: L1 Navigation - Flat or grouped?**
- ✅ **Grouped** per AGENTS.md section 5
```
HOME
├── Dashboard

RELATIONSHIPS
├── Accounts
├── Contacts

WORK
├── Projects
├── Pipeline
├── Tasks
├── Calendar
├── Meetings

KNOWLEDGE
├── Docs
├── Notes
├── Knowledge Space

TEAM
├── Team
├── Analytics

INTELLIGENCE
├── Risks
├── Expansion
├── Insights
```

**Q3: L2 Components - Where do they live?**
- ✅ **Overlay/panel pattern** (not separate pages)
- L2SignalBar: Bottom bar (existing)
- EvidencePanel: Side drawer (new)
- SpineUI: Modal overlay (new)
- KnowledgeUI: Full-screen toggle (new)
- DigitalTwin: Full-screen simulation (new)

**Q4: Domain Views - How to show 12 domains?**
- ✅ **Toggle buttons in Home dashboard**
- Not separate pages
- Same page, different data view
- 12 toggle buttons: CS, Sales, RevOps, Marketing, Product, Finance, Service, Procurement, IT, Education, Personal, BizOps

---

## Critical Decisions Needed NOW

### Decision 1: Build L0 or Skip?
**Options:**
- A) Skip L0, use simple login (current) → Faster launch, less "wow"
- B) Build full L0 onboarding → 1-2 weeks, full AGENTS.md alignment

**Recommendation:** B for differentiation

### Decision 2: All 15 L1 modules or MVP subset?
**Options:**
- A) Build all 15 now → 4-6 weeks, complete architecture
- B) Build core 6 (existing), add rest later → Launch faster, patch later

**Recommendation:** B for speed, with clear roadmap to 15

### Decision 3: L2 as overlays or pages?
**Options:**
- A) Separate pages (/spine, /knowledge, etc.) → Simpler, less integrated
- B) Overlay panels (drawers, modals) → Complex, but AGENTS.md aligned

**Recommendation:** B for true L2 "layer" concept

---

## Immediate Action Plan

### Week 1: L0 Onboarding
- Design 4 onboarding screens
- Build AI insights mock
- Create tool connection UI

### Week 2: L1 Core Enhancement
- Redesign sidebar navigation (grouped)
- Build Home dashboard (12 domain toggles)
- Create 3 new pages (Contacts, Projects, Pipeline)

### Week 3: L1 Expansion
- Build 3 more pages (Docs, Notes, Knowledge)
- Build 3 more pages (Team, Analytics, Meetings)

### Week 4: L2 Components
- Build EvidencePanel
- Build SpineUI overlay
- Build KnowledgeUI graph

### Week 5: Polish
- Wire all L2 to L3 APIs
- Add DigitalTwin simulation
- Full integration testing

---

## Bottom Line

**Current:** 65% aligned with AGENTS.md architecture

**With L0 + 9 L1 + 9 L2:** 100% aligned

**Time to 100%:** 4-5 weeks

**Decision:** Build L0 (critical for differentiation), add L1 modules incrementally, implement L2 as overlays.

---

**The architecture is sound. The execution needs to match it.**
