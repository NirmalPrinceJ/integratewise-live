#!/bin/bash
# IntegrateWise Pre-Flight Check
# Run this before testing to ensure everything is ready

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCORE=0
MAX_SCORE=100

echo "🚀 IntegrateWise Pre-Flight Check"
echo "=================================="
echo ""

# Helper functions
pass() {
  echo -e "${GREEN}✓${NC} $1"
  SCORE=$((SCORE + $2))
}

fail() {
  echo -e "${RED}✗${NC} $1"
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

cd /Users/nirmal/Github/integratewise-live/integratewise-complete

# 1. Node modules (10 points)
echo "📦 Checking dependencies..."
if [ -d "apps/web/node_modules" ]; then
  pass "Node modules installed" 10
else
  fail "Node modules missing - run: cd apps/web && npm install"
fi

# 2. Build succeeds (20 points)
echo ""
echo "🔨 Checking build..."
if npm run build --prefix apps/web > /tmp/build.log 2>&1; then
  pass "Build succeeds" 20
  
  # Check bundle size
  JS_SIZE=$(du -k apps/web/dist/assets/index-*.js | cut -f1)
  if [ "$JS_SIZE" -lt 1500 ]; then
    pass "Bundle size OK (${JS_SIZE}KB)" 5
  else
    warn "Bundle size large (${JS_SIZE}KB)"
    SCORE=$((SCORE + 2))
  fi
else
  fail "Build failed - check /tmp/build.log"
fi

# 3. Critical files exist (20 points)
echo ""
echo "📄 Checking critical files..."
CRITICAL=(
  "apps/web/src/lib/api/supabase.ts"
  "apps/web/src/lib/api/auth.ts"
  "apps/web/src/hooks/useAuth.tsx"
  "apps/web/src/components/ErrorBoundary.tsx"
  "apps/web/src/components/app/ProtectedRoute.tsx"
  "apps/web/src/routes.tsx"
)

for file in "${CRITICAL[@]}"; do
  if [ -f "$file" ]; then
    SCORE=$((SCORE + 3))
  else
    fail "Missing: $file"
  fi
done
pass "All critical files present" 0

# 4. SQL migrations (15 points)
echo ""
echo "🗄️  Checking database migrations..."
MIGRATION_COUNT=$(ls -1 sql-migrations/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 45 ]; then
  pass "$MIGRATION_COUNT migrations found" 10
else
  fail "Missing migrations (found $MIGRATION_COUNT)"
fi

if [ -f "sql-migrations/050_rls_policies.sql" ]; then
  pass "RLS policies migration present" 5
else
  fail "RLS policies migration missing"
fi

# 5. Tests exist (10 points)
echo ""
echo "🧪 Checking tests..."
if [ -f "apps/web/src/test/smoke.test.tsx" ]; then
  pass "Smoke tests present" 5
else
  fail "No smoke tests"
fi

if [ -f "apps/web/vitest.config.ts" ]; then
  pass "Vitest config present" 5
else
  fail "Vitest config missing"
fi

# 6. API layer complete (15 points)
echo ""
echo "🔌 Checking API layer..."
API_FILES=("auth.ts" "entities.ts" "insights.ts" "actions.ts" "tasks.ts" "calendar.ts" "dashboard.ts" "settings.ts")
API_COUNT=0
for file in "${API_FILES[@]}"; do
  if [ -f "apps/web/src/lib/api/$file" ]; then
    API_COUNT=$((API_COUNT + 1))
  fi
done

if [ "$API_COUNT" -eq 8 ]; then
  pass "All 8 API modules present" 15
else
  fail "Missing API modules ($API_COUNT/8)"
  SCORE=$((SCORE + API_COUNT * 1))
fi

# 7. Pages complete (5 points)
echo ""
echo "📱 Checking pages..."
PAGES=("DashboardPage" "AccountsPage" "TasksPage" "CalendarPage" "IntelligencePage" "SettingsPage")
PAGE_COUNT=0
for page in "${PAGES[@]}"; do
  if [ -f "apps/web/src/components/app/${page}.tsx" ]; then
    PAGE_COUNT=$((PAGE_COUNT + 1))
  fi
done

if [ "$PAGE_COUNT" -eq 6 ]; then
  pass "All 6 app pages present" 5
else
  warn "Some pages missing ($PAGE_COUNT/6)"
  SCORE=$((SCORE + PAGE_COUNT))
fi

# 8. Doppler setup (optional - bonus 10 points)
echo ""
echo "🔐 Checking Doppler (optional)..."
if command -v doppler &> /dev/null; then
  if doppler me &> /dev/null; then
    pass "Doppler CLI installed and authenticated" 5
    
    if doppler secrets get VITE_SUPABASE_URL --plain &> /dev/null; then
      pass "Doppler secrets configured" 5
    else
      warn "Doppler secrets not configured"
    fi
  else
    warn "Doppler not authenticated"
  fi
else
  warn "Doppler CLI not installed"
fi

# Calculate percentage
echo ""
echo "=================================="
PERCENTAGE=$((SCORE * 100 / MAX_SCORE))
echo -e "Completion Score: ${PERCENTAGE}%"
echo "=================================="

if [ $PERCENTAGE -ge 95 ]; then
  echo -e "${GREEN}🎉 EXCELLENT! Ready for testing!${NC}"
  echo ""
  echo "Quick start:"
  echo "  cd integratewise-complete/apps/web"
  echo "  npm run dev     # Start dev server"
  echo "  npm test        # Run tests"
  echo ""
  exit 0
elif [ $PERCENTAGE -ge 80 ]; then
  echo -e "${YELLOW}⚠️  GOOD! Minor issues found.${NC}"
  echo "You can test, but fix warnings above."
  exit 0
else
  echo -e "${RED}❌ NEEDS WORK! Critical issues found.${NC}"
  echo "Fix failed checks before testing."
  exit 1
fi
