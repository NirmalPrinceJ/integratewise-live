# UI Migration Plan: Step-by-Step Implementation

## Phase 1: Foundation Setup (Day 1)

### 1.1 Create `packages/ui` Structure

```bash
# Create package directory
mkdir -p packages/ui/{src/{components/{ui,landing,shared},hooks,lib,styles},dist}

# Initialize package
cd packages/ui
cat > package.json << 'EOF'
{
  "name": "@integratewise/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./src/styles/globals.css"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --external react",
    "dev": "tsup src/index.ts --format cjs,esm --dts --external react --watch",
    "lint": "eslint src/"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  }
}
EOF
```

### 1.2 Copy UI Components from Vite

```bash
# Copy shadcn components
cp -r apps/business-operations-design/src/components/ui/* packages/ui/src/components/ui/

# Copy landing components
cp -r apps/business-operations-design/src/components/landing packages/ui/src/components/

# Copy shared utilities
cp apps/business-operations-design/src/components/ui/utils.ts packages/ui/src/lib/
```

### 1.3 Create Package Entry Point

```typescript
// packages/ui/src/index.ts
export * from './components/ui';
export * from './components/landing';
export * from './components/shared';
export * from './hooks';
export * from './lib/utils';
```

### 1.4 Merge Global Styles

```css
/* packages/ui/src/styles/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Fonts */
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  
  /* IntegrateWise Brand Colors */
  --iw-navy: #2D4A7C;
  --iw-navy-light: #4A6A9C;
  --iw-emerald: #10B981;
  --iw-blue: #0EA5E9;
  --iw-purple: #8B5CF6;
  --iw-pink: #EC4899;
  
  /* Domain Colors */
  --cs: #10B981;
  --sales: #0EA5E9;
  --revops: #8B5CF6;
  --marketing: #EC4899;
  --product: #6366F1;
  --finance: #14B8A6;
  
  /* shadcn theme */
  --radius: 0.625rem;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 217 47% 33%;  /* Navy #2D4A7C */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 217 47% 33%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217 35% 45%;  /* Lighter navy for dark mode */
  --primary-foreground: 0 0% 100%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 217 35% 45%;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

---

## Phase 2: Landing Page Migration (Day 2)

### 2.1 Create Landing Page Structure

```typescript
// apps/web/src/app/page.tsx
import { Suspense } from 'react';
import { Navbar } from '@integratewise/ui/landing';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Pillars } from '@/components/landing/Pillars';
import { Audience } from '@/components/landing/Audience';
import { Comparison } from '@/components/landing/Comparison';
import { Differentiators } from '@/components/landing/Differentiators';
import { Integrations } from '@/components/landing/Integrations';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Problem />
      <Pillars />
      <Audience />
      <Comparison />
      <Differentiators />
      <Integrations />
      <Pricing />
      <Footer />
    </main>
  );
}
```

### 2.2 Migrate Landing Components

Copy and adapt from Vite:
```bash
# Copy landing components
mkdir -p apps/web/src/components/landing
cp apps/business-operations-design/src/components/landing/* apps/web/src/components/landing/

# Fix imports in each file
# Replace: from "../ui/button" → from "@/components/ui/button"
# Replace: from "figma:asset/..." → from "@/assets/..."
```

### 2.3 Handle Figma Assets

```typescript
// Create asset mapping
// apps/web/src/lib/assets.ts
import heroImage from '@/public/images/hero-dashboard.png';
import architectureImage from '@/public/images/architecture.png';

export const assets = {
  hero: heroImage,
  architecture: architectureImage,
};
```

---

## Phase 3: Onboarding Merge (Day 3-4)

### 3.1 Create Unified Onboarding Flow

```typescript
// apps/web/src/components/onboarding/UnifiedOnboarding.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/client';

// Steps
import { IdentityStep } from './steps/IdentityStep';
import { DomainStep } from './steps/DomainStep';        // From Vite
import { IntegrationStep } from './steps/IntegrationStep'; // From Vite
import { UploadStep } from './steps/UploadStep';         // From Vite
import { AcceleratorStep } from './steps/AcceleratorStep'; // From Vite

const STEPS = [
  { id: 'identity', label: 'Identity', component: IdentityStep },
  { id: 'domain', label: 'Domain', component: DomainStep },
  { id: 'integration', label: 'Connect', component: IntegrationStep },
  { id: 'upload', label: 'Upload', component: UploadStep },
  { id: 'accelerator', label: 'Accelerator', component: AcceleratorStep },
];

export function UnifiedOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    userName: '',
    domain: '',
    connectors: {},
    files: [],
    accelerator: null,
  });
  const router = useRouter();
  const supabase = useSupabase();

  const handleNext = (stepData: any) => {
    setData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Save to Supabase
    const { error } = await supabase
      .from('onboarding')
      .insert({
        user_name: data.userName,
        domain: data.domain,
        connectors: data.connectors,
        accelerator: data.accelerator,
      });

    if (!error) {
      router.push('/loader');
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                idx <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                idx <= currentStep ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                {idx + 1}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-xl"
        >
          <CurrentStepComponent
            data={data}
            onNext={handleNext}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### 3.2 Implement Step Components

```typescript
// apps/web/src/components/onboarding/steps/DomainStep.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Users, Target, TrendingUp, MessageSquare, Code,
  DollarSign, Mail, ShoppingCart, Wrench, GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DOMAINS = [
  { id: 'CUSTOMER_SUCCESS', label: 'Customer Success', icon: Users, color: '#10B981' },
  { id: 'SALES', label: 'Sales', icon: Target, color: '#0EA5E9' },
  { id: 'REVOPS', label: 'Revenue Operations', icon: TrendingUp, color: '#8B5CF6' },
  { id: 'MARKETING', label: 'Marketing', icon: MessageSquare, color: '#EC4899' },
  { id: 'PRODUCT_ENGINEERING', label: 'Product & Engineering', icon: Code, color: '#6366F1' },
  { id: 'FINANCE', label: 'Finance', icon: DollarSign, color: '#14B8A6' },
  { id: 'SERVICE', label: 'Customer Service', icon: Mail, color: '#F59E0B' },
  { id: 'PROCUREMENT', label: 'Procurement', icon: ShoppingCart, color: '#84CC16' },
  { id: 'IT_ADMIN', label: 'IT & Admin', icon: Wrench, color: '#64748B' },
  { id: 'STUDENT_TEACHER', label: 'Student / Teacher', icon: GraduationCap, color: '#F97316' },
];

export function DomainStep({ data, onNext }: any) {
  const [selected, setSelected] = useState(data.domain);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">What&apos;s your domain?</h1>
        <p className="text-muted-foreground mt-2">
          Select your primary work area for a tailored experience
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          return (
            <motion.button
              key={domain.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(domain.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selected === domain.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Icon 
                className="w-8 h-8 mb-2" 
                style={{ color: domain.color }} 
              />
              <div className="font-semibold">{domain.label}</div>
            </motion.button>
          );
        })}
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!selected}
        onClick={() => onNext({ domain: selected })}
      >
        Continue
      </Button>
    </div>
  );
}
```

---

## Phase 4: Theme & Styling Unification (Day 5)

### 4.1 Update Next.js Tailwind Config

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'var(--font-sans)', 'system-ui'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'monospace'],
      },
      colors: {
        // Domain colors
        cs: '#10B981',
        sales: '#0EA5E9',
        revops: '#8B5CF6',
        marketing: '#EC4899',
        product: '#6366F1',
        finance: '#14B8A6',
        service: '#F59E0B',
        // shadcn theme mapping
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... rest of shadcn colors
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### 4.2 Update Next.js Layout

```typescript
// apps/web/src/app/layout.tsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '@integratewise/ui/styles';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

---

## Phase 5: Testing & Validation (Day 6)

### 5.1 Test Checklist

- [ ] Landing page renders correctly
- [ ] All animations work
- [ ] Responsive design works
- [ ] Onboarding flow completes
- [ ] Domain selection works
- [ ] File upload works
- [ ] Data saves to Supabase
- [ ] Navigation works
- [ ] Dark mode works
- [ ] All L1 modules load
- [ ] All L2 components load
- [ ] RBAC enforces permissions
- [ ] Auth flow works

### 5.2 Build Test

```bash
# Build packages
cd packages/ui && pnpm build

# Build web app
cd apps/web && pnpm build

# Check for errors
```

---

## Phase 6: Cleanup & Finalization (Day 7)

### 6.1 Remove Vite App

```bash
rm -rf apps/business-operations-design
rm -rf apps/frontend-figma
```

### 6.2 Flatten Structure (Optional)

```bash
# Move integratewise-complete contents to root
mv integratewise-complete/* .
mv integratewise-complete/.[!.]* . 2>/dev/null || true
rmdir integratewise-complete
```

### 6.3 Update Documentation

- Update README.md
- Update AGENTS.md
- Create SETUP.md

### 6.4 Final Commit

```bash
git add -A
git commit -m "feat: merge Vite UI into Next.js, unified onboarding, new landing"
git push origin main
```

---

## Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| 1: Foundation | Day 1 | `packages/ui` with components |
| 2: Landing | Day 2 | Full landing site in Next.js |
| 3: Onboarding | Day 3-4 | Unified 5-step onboarding |
| 4: Theme | Day 5 | Unified styling, fonts |
| 5: Testing | Day 6 | All tests pass |
| 6: Cleanup | Day 7 | Clean repo, docs updated |

**Total: 1 week to complete UI unification**
