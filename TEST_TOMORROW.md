# 🧪 Test Tomorrow - Quick Reference

## Where to Test

**✅ USE THIS LOCATION:**
```bash
cd /Users/nirmal/Github/integratewise-live
./scripts/quick-start.sh
```

**Why here?**
- All latest work is here
- Full API binding complete
- 98% pre-flight score
- Ready to run

---

## What's Available

### In Current Location (`integratewise-live`)
```
integratewise-complete/apps/web/
├── src/lib/api/          ✅ 8 API modules (L3 complete)
├── src/hooks/            ✅ 8 React hooks (L2 partial)
├── src/components/app/   ✅ 6 pages (L1 partial)
├── src/test/             ✅ Smoke tests
└── dist/                 ✅ Production build ready
```

### Reference Components (`integratewise-brainstroming`)
```
apps/frontend-figma/src/components/
├── domains/              📦 5 domain shells (migrate later)
├── ui/                   📦 UI components (reference)
└── ...                   📦 185 total components
```

---

## Test Plan

### Phase 1: Quick Verification (5 min)
```bash
cd /Users/nirmal/Github/integratewise-live
./scripts/preflight-check.sh
```
Expected: 98% score ✅

### Phase 2: Start Dev Server (1 min)
```bash
./scripts/quick-start.sh
# Select option 2 (without Doppler)
```
Open: http://localhost:5173

### Phase 3: Manual Testing (30 min)

**Marketing Site:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Responsive on mobile

**Auth:**
- [ ] Login page
- [ ] OAuth buttons visible
- [ ] Protected routes work

**Dashboard:**
- [ ] 12 domain toggles
- [ ] Data table renders
- [ ] Signal bar shows

**App Pages:**
- [ ] Accounts
- [ ] Tasks
- [ ] Calendar
- [ ] Intelligence
- [ ] Settings

### Phase 4: Build Test (2 min)
```bash
cd integratewise-complete/apps/web
npm run build
```
Expected: ✅ Build succeeds

---

## If Something Breaks

### Check Build
```bash
cd integratewise-complete/apps/web
rm -rf node_modules
npm install
npm run build
```

### Reset to Clean State
```bash
cd /Users/nirmal/Github/integratewise-live
git status  # See what's changed
git diff    # Review changes
```

### Reference Original
```bash
# Look at original components for comparison
cd /Users/nirmal/Github/integratewise-brainstroming
ls apps/frontend-figma/src/components/
```

---

## After Testing

### If All Good:
1. ✅ Note any issues found
2. ✅ Sync to main repo:
```bash
cd /Users/nirmal/Github/integratewise-live
rsync -av integratewise-complete/apps/web/src/ \
  ../integratewise-brainstroming/integratewise-complete/apps/web/src/
```

### If Issues Found:
1. 🔧 Fix in current location
2. 🔄 Re-test
3. ✅ Then sync

---

## Quick Command Cheat Sheet

```bash
# Test in current location
cd /Users/nirmal/Github/integratewise-live
./scripts/quick-start.sh

# Or manually
cd integratewise-complete/apps/web
npm run dev

# Build
cd integratewise-complete/apps/web
npm run build

# Test
npm test

# Check
./scripts/preflight-check.sh
```

---

## Summary

| Location | Purpose | Status |
|----------|---------|--------|
| `integratewise-live` | **TEST HERE** | ✅ Ready |
| `integratewise-brainstroming/integratewise-complete` | Sync target | ⏳ After test |
| `integratewise-brainstroming/apps/frontend-figma` | Component reference | 📦 For migration |

**Bottom Line:** Test in `integratewise-live`, sync to main repo after verification.
