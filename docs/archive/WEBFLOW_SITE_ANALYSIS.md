# IntegrateWise Webflow Site Analysis

## Site Info
- **Site ID**: `696dbefa23d782ae6fb81d40`
- **Site Name**: IntegrateWise's Awesome Site
- **Last Published**: 2026-01-22
- **Custom Domains**: None configured yet ⚠️

---

## Current Sitemap Issues

### 1. Duplicate/Orphan Pages (Need Cleanup)
| Page | Current URL | Issue |
|------|-------------|-------|
| How It Works | `/how-it-works-2` | Duplicate (3 versions exist) |
| How It Works | `/how-it-works-3` | Duplicate |
| Use Cases | `/use-cases-2` | Duplicate slug |
| Roles | `/roles-2` | Duplicate slug |
| Case Studies | `/case-studies-2` | Duplicate slug |
| Blog | `/blog-2` | Duplicate slug |

### 2. Parent Pages Without Clean URLs
These parent pages have wrong slugs:
- `/how-it-works-3` should be `/how-it-works`
- `/use-cases-2` should be `/use-cases`
- `/roles-2` should be `/roles`
- `/case-studies-2` should be `/case-studies`

### 3. Style Guide (Internal - Should be excluded from sitemap)
- `/style-guide-606ac02d-cca5-4ac1-ad93-bb64f5c5930d` - Internal page

---

## Recommended URL Structure

### Main Navigation
```
/                           → Home
/pricing                    → Pricing
/integrations               → Integrations
/architecture               → Architecture
/security-governance        → Security & Governance
```

### How It Works (Engine)
```
/how-it-works               → Overview
/how-it-works/load          → Stage 1: Load
/how-it-works/normalize     → Stage 2: Normalize
/how-it-works/think         → Stage 3: Think
/how-it-works/act           → Stage 4: Act
/how-it-works/govern        → Stage 5: Govern
/how-it-works/repeat        → Stage 6: Repeat
```

### Roles
```
/roles                      → Roles Overview
/roles/visionary            → Visionary
/roles/missionary           → Missionary
/roles/practitioner         → Practitioner
/roles/passenger            → Passenger
```

### Use Cases
```
/use-cases                  → Use Cases Overview
/use-cases/research         → Research
/use-cases/development      → Development
/use-cases/marketing        → Marketing
/use-cases/sales            → Sales
/use-cases/finance-billing  → Finance & Billing
/use-cases/strategy         → Strategy
/use-cases/customer-success → Customer Success
/use-cases/employee-relations → Employee & External Relations
/use-cases/freelancers      → Freelancers
/use-cases/institutions     → Institutions & Universities
/use-cases/educators        → Educators
/use-cases/management       → Management
/use-cases/students         → Students
```

### Case Studies
```
/case-studies               → Case Studies Overview
/case-studies/customer-story → Customer Story Template
```

### Blog
```
/blog                       → Blog
```

### Utility Pages (Exclude from sitemap)
```
/404                        → Not Found
/401                        → Password Protected
/style-guide-*              → Internal Style Guide
```

---

## Images Required for Go-Live

### 1. Logo Assets
- [ ] Logo (SVG) - Horizontal
- [ ] Logo (SVG) - Icon only
- [ ] Logo (PNG) - For social sharing (1200x630)
- [ ] Favicon (ICO/PNG) - 32x32, 16x16
- [ ] Apple Touch Icon - 180x180

### 2. Hero/Header Images
- [ ] Home page hero image
- [ ] Product screenshots (dashboard, features)
- [ ] Architecture diagram

### 3. Social/OG Images (1200x630 each)
- [ ] Default OG image
- [ ] Pricing page OG
- [ ] Integrations OG
- [ ] How It Works OG

### 4. Use Case/Role Images
- [ ] 13 use case illustrations
- [ ] 4 role persona images

### 5. Integration Logos (if showing partners)
- [ ] Partner/integration logos (Stripe, HubSpot, etc.)

### 6. Team/About
- [ ] Team photos (if applicable)
- [ ] Company photo

---

## SEO Fixes Needed

### Missing SEO Descriptions
ALL pages are missing meta descriptions. Add descriptions for:
1. Home page
2. Pricing
3. Integrations
4. All use cases
5. All roles
6. How it works stages

### Missing OG Images
No Open Graph images configured for any page.

---

## Action Items

### Immediate (Before Go-Live)
1. [ ] Configure custom domain (integratewise.ai)
2. [ ] Fix duplicate slugs (how-it-works-2, use-cases-2, etc.)
3. [ ] Add meta descriptions to all pages
4. [ ] Upload hero images
5. [ ] Add OG images for social sharing
6. [ ] Add favicon

### Post-Launch
1. [ ] Set up Google Search Console
2. [ ] Submit sitemap
3. [ ] Configure 301 redirects for old URLs
4. [ ] Add structured data (JSON-LD)
