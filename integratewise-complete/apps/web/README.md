# IntegrateWise Web App

Unified Vite + React application for IntegrateWise - Marketing site + Dashboard.

## Quick Start

```bash
# Install dependencies
npm install

# Run with Doppler (recommended)
doppler run -- npm run dev

# Or run without Doppler (uses placeholder values)
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `doppler run -- npm run dev` | Start dev server with Doppler secrets |
| `doppler run -- npm run build` | Build for production |
| `doppler run -- npm test` | Run tests |
| `doppler run -- wrangler pages deploy dist` | Deploy to Cloudflare Pages |

## Project Structure

```
src/
├── components/
│   ├── app/           # Dashboard pages (Dashboard, Accounts, Tasks, etc.)
│   ├── pages/         # Marketing pages (Home, Pricing, etc.)
│   ├── ui/            # shadcn/ui components (45 components)
│   └── workspace/     # Workspace visualizations
├── hooks/             # React hooks (useAuth, useEntities, etc.)
├── lib/
│   └── api/           # API layer (entities, auth, settings, etc.)
├── test/              # Test files
├── routes.tsx         # React Router configuration
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Environment Variables

**Managed by Doppler - NO .env files!**

Required secrets:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Tech Stack

- **Framework:** Vite 6 + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion (motion/react)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Secrets:** Doppler
- **Hosting:** Cloudflare Pages

## Features

### Marketing Site
- Landing page with animations
- Pricing, Security, Story pages
- Integrations showcase
- Login/Signup

### Dashboard (12 Domain Views)
- Customer Success
- Sales
- RevOps
- Marketing
- Product & Engineering
- Finance
- Service
- Procurement
- IT Admin
- Education
- Personal
- BizOps

### Data Binding
- Real-time entity data from Spine
- AI insights and signals
- Task management
- Calendar events
- Settings management

## Architecture

L3 (Spine) → L2 (Cognitive) → L1 (UI)

- **L3:** Supabase PostgreSQL with entity_360 view
- **L2:** Signals, Insights, Actions (HITL)
- **L1:** React components with domain views

## Deployment Checklist

1. Configure Doppler secrets
2. Apply SQL migrations (including 050_rls_policies.sql)
3. Run `./scripts/deploy-check.sh`
4. Build: `doppler run -- npm run build`
5. Deploy: `doppler run -- wrangler pages deploy dist`

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
