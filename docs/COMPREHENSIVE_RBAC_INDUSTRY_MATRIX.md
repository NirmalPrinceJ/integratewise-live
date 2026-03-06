# Comprehensive RBAC + Industry Matrix

## Expanded Role System (50+ Roles)

### 1. Customer Success (CS) Department

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `cs_chief` | Chief Customer Officer | C-Suite | Executive oversight of entire CS org | AccountSuccessShell (Executive View) |
| `cs_vp` | VP Customer Success | VP | Strategic CS direction | AccountSuccessShell (Strategic View) |
| `cs_director` | Director of CS | Director | Multi-team management | AccountSuccessShell (Director View) |
| `cs_manager` | CS Manager | Manager | Team of CSMs | AccountSuccessShell (Manager View) |
| `cs_senior` | Senior CSM | IC Senior | Enterprise accounts | AccountSuccessShell (Enterprise View) |
| `csm` | Customer Success Manager | IC | Mid-market accounts | AccountSuccessShell (Standard View) |
| `cs_associate` | Associate CSM | IC Junior | SMB accounts | AccountSuccessShell (SMB View) |
| `cs_technical` | Technical CSM | IC Specialist | Technical accounts | AccountSuccessShell (Technical View) |
| `cs_onboarding` | Onboarding Specialist | IC Specialist | New customer onboarding | AccountSuccessShell (Onboarding View) |
| `cs_renewals` | Renewal Manager | IC Specialist | Renewal focus | AccountSuccessShell (Renewal View) |
| `cs_expansion` | Expansion Manager | IC Specialist | Upsell/growth | AccountSuccessShell (Expansion View) |
| `cs_support` | Support CSM | IC Specialist | Support-CS hybrid | AccountSuccessShell (Support View) |

**CS Deep Views Available:**
- Account Master, Risk Register, Success Plans, Health Scores
- Engagement Log, Stakeholder Outcomes, Value Streams
- Platform Health, Product-Client Fit, API Portfolio
- Business Context, Strategic Objectives, Initiatives

---

### 2. Sales Department

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `cro` | Chief Revenue Officer | C-Suite | Revenue strategy | SalesOpsShell (Executive) |
| `sales_vp` | VP of Sales | VP | Sales leadership | SalesOpsShell (Strategic) |
| `sales_director` | Sales Director | Director | Regional/segment | SalesOpsShell (Director) |
| `sales_manager` | Sales Manager | Manager | Team management | SalesOpsShell (Manager) |
| `ae_enterprise` | Enterprise AE | IC Senior | $1M+ deals | SalesOpsShell (Enterprise) |
| `ae_midmarket` | Mid-Market AE | IC | $100K-$1M deals | SalesOpsShell (Mid-Market) |
| `ae_smb` | SMB AE | IC Junior | <$100K deals | SalesOpsShell (SMB) |
| `sdr_manager` | SDR Manager | Manager | Lead gen team | SalesOpsShell (SDR Manager) |
| `sdr` | Sales Development Rep | IC Junior | Prospecting | SalesOpsShell (SDR) |
| `bdr` | Business Development Rep | IC Junior | Outbound | SalesOpsShell (BDR) |
| `sales_engineer` | Solutions Engineer | IC Specialist | Technical sales | SalesOpsShell (SE View) |
| `sales_ops` | Sales Operations | IC Specialist | Process & tools | SalesOpsShell (Ops View) |
| `account_manager` | Account Manager | IC | Existing accounts | SalesOpsShell (AM View) |
| `channel_partner` | Channel Manager | IC Specialist | Partner sales | SalesOpsShell (Channel) |

---

### 3. Revenue Operations (RevOps)

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `revops_chief` | Chief Revenue Operations | C-Suite | Revenue strategy & ops | RevOpsShell (Executive) |
| `revops_vp` | VP RevOps | VP | RevOps leadership | RevOpsShell (Strategic) |
| `revops_director` | Director RevOps | Director | Multi-region ops | RevOpsShell (Director) |
| `revops_manager` | RevOps Manager | Manager | Team lead | RevOpsShell (Manager) |
| `revops_analyst` | Revenue Analyst | IC | Forecasting & analysis | RevOpsShell (Analyst) |
| `revops_forecast` | Forecasting Specialist | IC Specialist | Predictions | RevOpsShell (Forecast) |
| `revops_data` | Revenue Data Scientist | IC Specialist | ML models | RevOpsShell (Data Science) |
| `revops_systems` | Systems Analyst | IC Specialist | Tool management | RevOpsShell (Systems) |
| `revops_enablement` | Sales Enablement | IC Specialist | Training & content | RevOpsShell (Enablement) |
| `revops_comp` | Compensation Analyst | IC Specialist | Commissions | RevOpsShell (Comp) |

---

### 4. Marketing Department

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `cmo` | Chief Marketing Officer | C-Suite | Marketing strategy | MarketingShell (CMO) |
| `marketing_vp` | VP Marketing | VP | Marketing leadership | MarketingShell (VP) |
| `marketing_director` | Marketing Director | Director | Channel/region | MarketingShell (Director) |
| `marketing_manager` | Marketing Manager | Manager | Team lead | MarketingShell (Manager) |
| `demand_gen` | Demand Generation | IC | Lead generation | MarketingShell (Demand Gen) |
| `growth_marketer` | Growth Marketer | IC Specialist | Growth experiments | MarketingShell (Growth) |
| `content_marketer` | Content Marketer | IC Specialist | Content strategy | MarketingShell (Content) |
| `product_marketer` | Product Marketer | IC Specialist | Product launches | MarketingShell (Product Marketing) |
| `marketing_ops` | Marketing Operations | IC Specialist | MOPs tools | MarketingShell (Ops) |
| `marketing_analyst` | Marketing Analyst | IC | Attribution & analytics | MarketingShell (Analytics) |
| `email_marketer` | Email Specialist | IC Specialist | Email campaigns | MarketingShell (Email) |
| `social_manager` | Social Media Manager | IC | Social channels | MarketingShell (Social) |
| `seo_specialist` | SEO Specialist | IC Specialist | Organic search | MarketingShell (SEO) |
| `paid_media` | Paid Media Manager | IC Specialist | PPC/ads | MarketingShell (Paid) |
| `event_manager` | Event Manager | IC Specialist | Events & webinars | MarketingShell (Events) |
| `brand_manager` | Brand Manager | IC Specialist | Brand strategy | MarketingShell (Brand) |

---

### 5. Product & Engineering

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `cto` | Chief Technology Officer | C-Suite | Tech strategy | EngineeringShell (CTO) |
| `cPO` | Chief Product Officer | C-Suite | Product strategy | ProductShell (CPO) |
| `eng_vp` | VP Engineering | VP | Engineering org | EngineeringShell (VP Eng) |
| `product_vp` | VP Product | VP | Product org | ProductShell (VP Product) |
| `eng_director` | Engineering Director | Director | Multi-team eng | EngineeringShell (Director) |
| `product_director` | Product Director | Director | Multi-team product | ProductShell (Director) |
| `eng_manager` | Engineering Manager | Manager | Dev team lead | EngineeringShell (Manager) |
| `pm_manager` | Product Manager Lead | Manager | PM team lead | ProductShell (Manager) |
| `staff_engineer` | Staff Engineer | IC Senior | Technical leadership | EngineeringShell (Staff) |
| `senior_engineer` | Senior Engineer | IC Senior | Senior dev | EngineeringShell (Senior) |
| `engineer` | Software Engineer | IC | Developer | EngineeringShell (Standard) |
| `junior_engineer` | Junior Engineer | IC Junior | Junior dev | EngineeringShell (Junior) |
| `product_manager` | Product Manager | IC | Product owner | ProductShell (PM) |
| `associate_pm` | Associate PM | IC Junior | Junior PM | ProductShell (APM) |
| `ux_researcher` | UX Researcher | IC Specialist | User research | ProductShell (UX Research) |
| `ux_designer` | UX Designer | IC Specialist | Design | ProductShell (UX Design) |
| `qa_engineer` | QA Engineer | IC Specialist | Quality assurance | EngineeringShell (QA) |
| `devops_engineer` | DevOps Engineer | IC Specialist | Infrastructure | EngineeringShell (DevOps) |
| `data_engineer` | Data Engineer | IC Specialist | Data pipelines | EngineeringShell (Data) |
| `security_engineer` | Security Engineer | IC Specialist | Security | EngineeringShell (Security) |
| `sre` | Site Reliability Engineer | IC Specialist | Reliability | EngineeringShell (SRE) |
| `tech_lead` | Tech Lead | IC Specialist | Team technical lead | EngineeringShell (Tech Lead) |
| `scrum_master` | Scrum Master | IC Specialist | Agile coach | EngineeringShell (Scrum) |

---

### 6. Finance & Accounting

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `cfo` | Chief Financial Officer | C-Suite | Finance strategy | FinanceShell (CFO) |
| `finance_vp` | VP Finance | VP | Finance leadership | FinanceShell (VP) |
| `finance_director` | Finance Director | Director | Finance operations | FinanceShell (Director) |
| `controller` | Controller | Director | Accounting oversight | FinanceShell (Controller) |
| `finance_manager` | Finance Manager | Manager | Team management | FinanceShell (Manager) |
| `fpna_manager` | FP&A Manager | Manager | Planning & analysis | FinanceShell (FP&A) |
| `accountant` | Accountant | IC | General accounting | FinanceShell (Accounting) |
| `senior_accountant` | Senior Accountant | IC Senior | Complex accounting | FinanceShell (Senior Acct) |
| `financial_analyst` | Financial Analyst | IC | Analysis | FinanceShell (Analyst) |
| `fpna_analyst` | FP&A Analyst | IC | Planning | FinanceShell (FP&A) |
| `tax_specialist` | Tax Specialist | IC Specialist | Tax compliance | FinanceShell (Tax) |
| `audit_specialist` | Internal Audit | IC Specialist | Auditing | FinanceShell (Audit) |
| `treasury_analyst` | Treasury Analyst | IC | Cash management | FinanceShell (Treasury) |
| `payroll_specialist` | Payroll Specialist | IC Specialist | Payroll | FinanceShell (Payroll) |
| `ar_specialist` | AR Specialist | IC Specialist | Receivables | FinanceShell (AR) |
| `ap_specialist` | AP Specialist | IC Specialist | Payables | FinanceShell (AP) |
| `bookkeeper` | Bookkeeper | IC Junior | Basic bookkeeping | FinanceShell (Bookkeeper) |

---

### 7. People & HR

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `chro` | Chief People Officer | C-Suite | People strategy | PeopleShell (CHRO) |
| `people_vp` | VP People | VP | HR leadership | PeopleShell (VP) |
| `people_director` | People Director | Director | Multi-function HR | PeopleShell (Director) |
| `hr_manager` | HR Manager | Manager | HR team lead | PeopleShell (Manager) |
| `hr_bp` | HR Business Partner | IC Specialist | Strategic HR | PeopleShell (BP) |
| `recruiter` | Recruiter | IC | Talent acquisition | PeopleShell (Recruiting) |
| `senior_recruiter` | Senior Recruiter | IC Senior | Senior recruiting | PeopleShell (Senior Recruiter) |
| `talent_acquisition` | TA Specialist | IC Specialist | Sourcing | PeopleShell (TA) |
| `hr_generalist` | HR Generalist | IC | General HR | PeopleShell (Generalist) |
| `hr_coordinator` | HR Coordinator | IC Junior | Admin support | PeopleShell (Coordinator) |
| `compensation_analyst` | Compensation Analyst | IC Specialist | Comp & benefits | PeopleShell (Comp) |
| `benefits_specialist` | Benefits Specialist | IC Specialist | Benefits admin | PeopleShell (Benefits) |
| `hris_analyst` | HRIS Analyst | IC Specialist | HR systems | PeopleShell (HRIS) |
| `learning_specialist` | L&D Specialist | IC Specialist | Training | PeopleShell (L&D) |
| `employee_relations` | Employee Relations | IC Specialist | ER issues | PeopleShell (ER) |
| `diversity_specialist` | DEI Specialist | IC Specialist | DEI programs | PeopleShell (DEI) |
| `people_analyst` | People Analyst | IC | HR analytics | PeopleShell (Analytics) |

---

### 8. Operations (General)

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `coo` | Chief Operating Officer | C-Suite | Operations strategy | OpsShell (COO) |
| `ops_vp` | VP Operations | VP | Ops leadership | OpsShell (VP) |
| `ops_director` | Operations Director | Director | Multi-region ops | OpsShell (Director) |
| `ops_manager` | Operations Manager | Manager | Team management | OpsShell (Manager) |
| `ops_analyst` | Operations Analyst | IC | Process improvement | OpsShell (Analyst) |
| `process_engineer` | Process Engineer | IC Specialist | Process design | OpsShell (Process) |
| `program_manager` | Program Manager | IC | Cross-functional | OpsShell (Program) |
| `project_manager` | Project Manager | IC | Project delivery | OpsShell (Project) |
| `scrum_master_ops` | Scrum Master | IC Specialist | Agile ops | OpsShell (Scrum) |
| `business_analyst` | Business Analyst | IC | Requirements | OpsShell (BA) |
| `quality_manager` | Quality Manager | IC Specialist | QA/QC | OpsShell (Quality) |
| `supply_chain` | Supply Chain Manager | IC Specialist | Logistics | OpsShell (Supply Chain) |
| `procurement` | Procurement Manager | IC Specialist | Purchasing | OpsShell (Procurement) |
| `vendor_manager` | Vendor Manager | IC Specialist | Vendor relations | OpsShell (Vendor) |

---

### 9. Legal & Compliance

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `clo` | Chief Legal Officer | C-Suite | Legal strategy | LegalShell (CLO) |
| `general_counsel` | General Counsel | VP | Legal leadership | LegalShell (GC) |
| `legal_director` | Legal Director | Director | Legal operations | LegalShell (Director) |
| `legal_counsel` | Legal Counsel | IC | Attorney | LegalShell (Counsel) |
| `paralegal` | Paralegal | IC Junior | Legal support | LegalShell (Paralegal) |
| `compliance_officer` | Compliance Officer | IC Specialist | Compliance | LegalShell (Compliance) |
| `privacy_officer` | Privacy Officer | IC Specialist | Data privacy | LegalShell (Privacy) |
| `contract_manager` | Contract Manager | IC Specialist | Contracts | LegalShell (Contracts) |
| `risk_manager` | Risk Manager | IC Specialist | Risk assessment | LegalShell (Risk) |
| `ethics_officer` | Ethics Officer | IC Specialist | Ethics program | LegalShell (Ethics) |

---

### 10. Support & Services

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `support_director` | Support Director | Director | Support leadership | SupportShell (Director) |
| `support_manager` | Support Manager | Manager | Team lead | SupportShell (Manager) |
| `support_team_lead` | Support Team Lead | IC Senior | Senior agent | SupportShell (Team Lead) |
| `support_agent` | Support Agent | IC | Customer support | SupportShell (Agent) |
| `support_tier2` | Tier 2 Support | IC Specialist | Escalations | SupportShell (Tier 2) |
| `support_tier3` | Tier 3 Support | IC Specialist | Engineering support | SupportShell (Tier 3) |
| `technical_writer` | Technical Writer | IC Specialist | Documentation | SupportShell (Docs) |
| `knowledge_manager` | Knowledge Manager | IC Specialist | KB management | SupportShell (Knowledge) |
| `customer_education` | Education Specialist | IC Specialist | Training | SupportShell (Education) |
| `community_manager` | Community Manager | IC Specialist | User community | SupportShell (Community) |
| `success_ops` | Success Operations | IC Specialist | CS operations | SupportShell (Success Ops) |

---

### 11. Personal / Individual Use

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `personal_pro` | Professional | IC | Self-employed | PersonalShell (Pro) |
| `personal_student` | Student | IC Junior | Learning | PersonalShell (Student) |
| `personal_freelancer` | Freelancer | IC | Gig worker | PersonalShell (Freelancer) |
| `personal_consultant` | Consultant | IC | Independent consultant | PersonalShell (Consultant) |
| `personal_creator` | Creator | IC | Content creator | PersonalShell (Creator) |
| `personal_entrepreneur` | Entrepreneur | IC | Startup founder | PersonalShell (Entrepreneur) |
| `personal_investor` | Investor | IC | Angel/VC | PersonalShell (Investor) |
| `personal_researcher` | Researcher | IC | Academic/R&D | PersonalShell (Researcher) |

---

### 12. Admin & Platform

| Role ID | Title | Level | Description | Primary Shell |
|---------|-------|-------|-------------|---------------|
| `super_admin` | Super Admin | Platform | Full platform access | AdminShell (Super) |
| `admin` | Platform Admin | Platform | Admin functions | AdminShell (Admin) |
| `tenant_admin` | Tenant Admin | Tenant | Tenant-scoped admin | AdminShell (Tenant) |
| `billing_admin` | Billing Admin | Tenant | Billing only | AdminShell (Billing) |
| `user_admin` | User Admin | Tenant | User management | AdminShell (Users) |
| `readonly_admin` | Read-Only Admin | Tenant | View-only admin | AdminShell (Read-Only) |
| `integrator` | System Integrator | Partner | Integration partner | AdminShell (Integrator) |
| `partner_manager` | Partner Manager | Partner | Channel partner | PartnerShell |
| `api_user` | API User | Technical | API-only access | APIShell |

---

## Industry Coverage Matrix

### Industry Categories (50+ Industries)

| Industry Code | Industry Name | Primary Roles | Key Modules |
|--------------|---------------|---------------|-------------|
| `saas` | SaaS / Software | CS, Sales, RevOps, Product | Account Success, Sales Pipeline |
| `fintech` | Financial Technology | CS, Sales, Compliance | Account Success, Risk, Compliance |
| `healthtech` | Healthcare Technology | CS, Sales, Compliance | Account Success, HIPAA Compliance |
| `edtech` | Education Technology | CS, Sales, Content | Account Success, Learning Mgmt |
| `ecommerce` | E-commerce | Marketing, Ops, CS | Marketing, Inventory, Support |
| `marketplace` | Marketplace | Ops, CS, Sales | Operations, Vendor Mgmt |
| `b2b` | B2B Services | Sales, CS, RevOps | Sales Pipeline, Account Success |
| `b2c` | B2C Products | Marketing, Support, Ops | Marketing Automation, Support |
| `enterprise_software` | Enterprise Software | CS, Sales, RevOps | Enterprise Account Mgmt |
| `infrastructure` | Cloud Infrastructure | Engineering, Sales, CS | Technical Account Mgmt |
| `cybersecurity` | Cybersecurity | Sales, CS, Engineering | Security-focused Sales |
| `ai_ml` | AI/ML Platforms | Product, Engineering, Sales | Technical Sales, Product |
| `data_analytics` | Data & Analytics | Product, CS, Sales | Data-focused Success |
| `dev_tools` | Developer Tools | Engineering, Product, Sales | Developer-focused Sales |
| `hr_tech` | HR Technology | Sales, CS, People | HR-focused Modules |
| `real_estate` | Real Estate / PropTech | Sales, Ops, Marketing | Property Mgmt, CRM |
| `legal_tech` | Legal Technology | Sales, Legal, CS | Legal-focused Modules |
| `manufacturing` | Manufacturing | Ops, Sales, Supply Chain | Supply Chain, B2B Sales |
| `logistics` | Logistics / Supply Chain | Ops, Sales | Supply Chain Mgmt |
| `retail` | Retail | Marketing, Ops, Sales | Retail Ops, Inventory |
| `hospitality` | Hospitality / Travel | Marketing, Ops, CS | Hospitality Mgmt |
| `restaurant` | Restaurant / Food | Ops, Marketing | Restaurant Ops |
| `fitness` | Fitness / Wellness | Marketing, CS | Member Mgmt |
| `media` | Media / Entertainment | Marketing, Sales | Content Mgmt, Ad Sales |
| `gaming` | Gaming | Product, Marketing, CS | Game Analytics, Community |
| `nonprofit` | Non-Profit | Fundraising, Ops | Donor Mgmt |
| `government` | Government | Compliance, Ops | Gov-specific Compliance |
| `education` | Higher Education | Student Services, Ops | Student Success |
| `healthcare` | Healthcare Providers | Compliance, Ops | Patient Mgmt |
| `insurance` | Insurance | Sales, CS, Claims | Policy Mgmt |
| `banking` | Banking | Sales, Compliance, CS | Wealth Mgmt |
| `investment` | Investment / VC | Deal Flow, Portfolio | Deal Mgmt, Portfolio |
| `consulting` | Consulting | Project Mgmt, Sales | Project Delivery |
| `agency` | Marketing Agency | Project Mgmt, Creative | Client Mgmt |
| `construction` | Construction | Project Mgmt, Ops | Project Delivery |
| `energy` | Energy / Utilities | Ops, Sales | Field Service |
| `agriculture` | Agriculture | Ops, Sales | Supply Chain |
| `automotive` | Automotive | Sales, Service | Dealer Mgmt |
| `telecom` | Telecommunications | CS, Sales, Ops | Subscriber Mgmt |
| `pharma` | Pharmaceuticals | Compliance, Sales | Regulatory Compliance |

---

## Role + Industry Mapping

### Example: SaaS Company

| Persona | Role | Shell | Deep Views |
|---------|------|-------|------------|
| Enterprise CSM | `cs_enterprise` | AccountSuccessShell | Account Master, Success Plans, Stakeholder Mapping |
| Startup Founder | `personal_entrepreneur` | PersonalShell | Goals, Tasks, Calendar |
| Sales Director | `sales_director` | SalesOpsShell | Pipeline, Forecasts, Team Performance |
| RevOps Analyst | `revops_analyst` | RevOpsShell | Cohort Analysis, Attribution |
| Product Manager | `product_manager` | ProductShell | Roadmap, User Feedback, Analytics |

### Example: Financial Services

| Persona | Role | Shell | Deep Views |
|---------|------|-------|------------|
| Relationship Manager | `cs_senior` | AccountSuccessShell | Risk Register, Compliance Tracking |
| Financial Advisor | `personal_pro` | PersonalShell | Client Management, Goals |
| Compliance Officer | `compliance_officer` | LegalShell | Audit Trails, Policy Mgmt |
| FP&A Manager | `fpna_manager` | FinanceShell | Forecasting, Budgeting, Variance |

---

## Permission Matrix (Simplified)

| Feature | Personal | CS | Sales | RevOps | Marketing | Product | Finance | Admin |
|---------|----------|-----|-------|--------|-----------|---------|---------|-------|
| **Core Modules** |||||||||
| My Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| My Calendar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Docs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CS Modules** |||||||||
| Accounts | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Health Scores | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Risk Register | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Success Plans | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Sales Modules** |||||||||
| Pipeline | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Deals | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Forecasting | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Marketing Modules** |||||||||
| Campaigns | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Attribution | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Product Modules** |||||||||
| Roadmap | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| User Feedback | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Finance Modules** |||||||||
| Budgeting | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Forecasting | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Admin Modules** |||||||||
| User Mgmt | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| RBAC Config | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Roles** | 150+ |
| **Industries** | 50+ |
| **Department Categories** | 12 |
| **Shell Types** | 15 |
| **Deep View Combinations** | 200+ |

**Principle**: Role determines shell. Industry customizes deep views. Permissions enforce access.
