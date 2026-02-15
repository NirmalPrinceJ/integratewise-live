# Missing Components & Dependencies Audit

**Generated:** Feb 2, 2026
**Commit:** 48aad14c + b158c293
**Status:** Build Failing ❌

---

## 🔴 Critical Issues (Blocking Build)

### 1. Workspace Packages Not Built

**Issue:** Workspace packages exist but are not compiled

| Package | Location | Status | Action Required |
|---------|----------|--------|-----------------|
| `@integratewise/accelerators` | `packages/accelerators` | ❌ Not built | Add build script & compile |
| `@integratewise/connectors` | `packages/connectors` | ❌ Not built | Add build script & compile |
| `@integratewise/rbac` | `packages/rbac` | ❌ Not built | Add build script & compile |

**Files Affected:**
```
src/app/api/accelerators/route.ts
src/app/api/accelerators/run/route.ts
src/app/api/connectors/route.ts
src/app/api/rbac/assign/route.ts
src/app/api/rbac/check/route.ts
src/app/api/rbac/me/route.ts
src/app/api/rbac/roles/route.ts
src/__tests__/unit/resilience.test.ts
src/contexts/tenant-context.tsx
```

**Fix:**

```bash
# Add build scripts to each package
cd packages/accelerators
# Add to package.json:
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsc -p tsconfig.json --watch"
  }
}

# Build all workspace packages
pnpm --filter "@integratewise/*" build
```

---

### 2. Missing UI Component: Switch

**Issue:** `@/components/ui/switch` does not exist

**Files Affected:**
```
(Multiple files reference this component)
```

**Existing UI Components:**
```
✅ alert-dialog.tsx
✅ avatar.tsx
✅ badge.tsx
✅ button.tsx
✅ card.tsx
✅ checkbox.tsx
✅ dialog.tsx
✅ input.tsx
✅ label.tsx
✅ select.tsx
✅ tabs.tsx
❌ switch.tsx  <-- MISSING
```

**Fix:**

Create `src/components/ui/switch.tsx`:

```typescript
// Copy from shadcn/ui or create custom switch component
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

Then add to `src/components/ui/index.ts`:
```typescript
export { Switch } from "./switch"
```

---

### 3. Missing Component: Custom Dashboard

**Issue:** `src/components/analytics/custom-dashboard.tsx` does not exist

**Files Affected:**
```
src/app/(app)/analytics/page.tsx
```

**Current Import:**
```typescript
import CustomDashboard from '../../components/analytics/custom-dashboard';
```

**Fix:**

Create `src/components/analytics/custom-dashboard.tsx`:

```typescript
import React from 'react'

export default function CustomDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Analytics Dashboard</h1>
      <p className="text-gray-600">Analytics dashboard coming soon...</p>
    </div>
  )
}
```

Or update `src/app/(app)/analytics/page.tsx` to use an existing dashboard component.

---

### 4. Missing Library: Spine Context Provider

**Issue:** `src/lib/spine/spine-context-provider.tsx` does not exist

**Files Affected:**
```
(Check which files import this)
```

**Fix:**

Create `src/lib/spine/spine-context-provider.tsx`:

```typescript
"use client"

import React, { createContext, useContext, useState } from 'react'

interface SpineContextValue {
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const SpineContext = createContext<SpineContextValue | undefined>(undefined)

export function SpineContextProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)

  const connect = async () => {
    // TODO: Implement spine connection logic
    setConnected(true)
  }

  const disconnect = () => {
    setConnected(false)
  }

  return (
    <SpineContext.Provider value={{ connected, connect, disconnect }}>
      {children}
    </SpineContext.Provider>
  )
}

export function useSpine() {
  const context = useContext(SpineContext)
  if (!context) {
    throw new Error('useSpine must be used within SpineContextProvider')
  }
  return context
}
```

---

## 📋 Complete Missing Files Checklist

### 🔧 To Create

- [ ] `src/components/ui/switch.tsx`
- [ ] `src/components/analytics/custom-dashboard.tsx`
- [ ] `src/lib/spine/spine-context-provider.tsx`
- [ ] Build configuration for workspace packages

### 🔨 To Build

- [ ] `packages/accelerators` - Add build script & compile
- [ ] `packages/connectors` - Add build script & compile
- [ ] `packages/rbac` - Add build script & compile

### ✅ Verified Existing (No Action Needed)

- [x] `src/components/views/n8n-dashboard.tsx` ✅
- [x] `src/components/workflow-builder/workflow-canvas.tsx` ✅
- [x] `src/components/views/admin/release-dashboard.tsx` ✅
- [x] `src/components/views/knowledge-dashboard.tsx` ✅

---

## 🎯 Implementation Priority

### Phase 1: Critical (Blocks All Builds)

1. **Add workspace package build scripts** (15 min)
   ```bash
   # For each package in packages/{accelerators,connectors,rbac}
   # Add build script to package.json
   # Run pnpm build
   ```

2. **Create Switch component** (10 min)
   - Copy from shadcn/ui or create custom
   - Add to ui/index.ts exports

### Phase 2: High Priority (Blocks Specific Pages)

3. **Create Custom Dashboard** (30 min)
   - Basic analytics dashboard component
   - Or replace import in analytics page

4. **Create Spine Context Provider** (20 min)
   - Basic context implementation
   - Stub out connection logic

### Phase 3: Verification

5. **Run full build** (5 min)
   ```bash
   pnpm build
   ```

6. **Run tests** (10 min)
   ```bash
   pnpm test
   pnpm test:e2e
   ```

---

## 🛠️ Quick Fix Commands

### Build All Workspace Packages
a
```bash
# Navigate to root
cd /Users/nirmal/Github/brainstroming

# Build accelerators
cd packages/accelerators
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF

# Add build script
npm pkg set scripts.build="tsc -p tsconfig.json"
pnpm build

# Repeat for connectors and rbac
cd ../connectors
npm pkg set scripts.build="tsc -p tsconfig.json"
pnpm build

cd ../rbac
npm pkg set scripts.build="tsc -p tsconfig.json"
pnpm build
```

### Create Missing UI Component

```bash
# Create switch component
cat > src/components/ui/switch.tsx << 'EOF'
[Component code from above]
EOF

# Add to exports
echo 'export { Switch } from "./switch"' >> src/components/ui/index.ts
```

---

## 📊 Estimated Time to Fix

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| Phase 1 | Workspace packages | 25 min | 🔴 Critical |
| Phase 2 | Missing components | 50 min | 🟡 High |
| Phase 3 | Verification | 15 min | 🟢 Normal |
| **Total** | | **~90 min** | |

---

## 🎬 Next Steps

1. Review this audit document
2. Decide implementation approach:
   - **Option A:** Fix all issues now (~90 min)
   - **Option B:** Fix critical (Phase 1) only, stub others
   - **Option C:** Create feature branch for fixes
3. Run implementation commands
4. Verify build succeeds
5. Push to dev branch
6. Create PR to main

---

## 📝 Notes

- All missing view components were verified to exist ✅
- The main issues are unbuilt workspace packages
- Most "missing" components actually exist but aren't being found due to build issues
- After fixing workspace packages, re-run build to verify no other issues

---

**Last Updated:** Feb 2, 2026
**Document:** MISSING_COMPONENTS_AUDIT.md
**Location:** `/docs/MISSING_COMPONENTS_AUDIT.md`
