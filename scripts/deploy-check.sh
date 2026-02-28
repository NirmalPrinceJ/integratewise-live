#!/bin/bash
# IntegrateWise Deployment Readiness Check
# For Doppler-based infrastructure

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 IntegrateWise Deployment Check (Doppler Infrastructure)"
echo "=========================================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
check_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASSED++))
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAILED++))
}

check_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

# Check 1: Doppler CLI installed
echo "📋 Checking Doppler Setup..."
if command -v doppler &> /dev/null; then
  check_pass "Doppler CLI installed"
  
  # Check if logged in
  if doppler me &> /dev/null; then
    check_pass "Doppler authenticated"
  else
    check_fail "Not logged into Doppler (run: doppler login)"
  fi
  
  # Check if project configured
  if [ -f ".doppler/.doppler.yaml" ] || [ -f "doppler.yaml" ]; then
    check_pass "Doppler project configured"
  else
    check_warn "Doppler project not configured (run: doppler setup)"
  fi
else
  check_fail "Doppler CLI not installed (install: brew install doppler)"
fi

echo ""

# Check 2: Can fetch secrets from Doppler
echo "🔐 Checking Secrets..."
if command -v doppler &> /dev/null && doppler me &> /dev/null; then
  if doppler secrets get VITE_SUPABASE_URL --plain &> /dev/null; then
    check_pass "VITE_SUPABASE_URL configured in Doppler"
  else
    check_fail "VITE_SUPABASE_URL not found in Doppler"
  fi
  
  if doppler secrets get VITE_SUPABASE_ANON_KEY --plain &> /dev/null; then
    check_pass "VITE_SUPABASE_ANON_KEY configured in Doppler"
  else
    check_fail "VITE_SUPABASE_ANON_KEY not found in Doppler"
  fi
else
  check_warn "Skipping secrets check (Doppler not available)"
fi

echo ""

# Check 3: Build succeeds with Doppler
echo "🔨 Checking Build..."
cd integratewise-complete/apps/web

if command -v doppler &> /dev/null && doppler me &> /dev/null; then
  if doppler run -- npm run build > /tmp/build.log 2>&1; then
    check_pass "Build succeeds with Doppler secrets"
    
    # Check bundle size
    JS_SIZE=$(du -k dist/assets/index-*.js | cut -f1)
    if [ "$JS_SIZE" -lt 1500 ]; then
      check_pass "Bundle size acceptable (${JS_SIZE}KB)"
    else
      check_warn "Bundle size large (${JS_SIZE}KB - consider code splitting)"
    fi
  else
    check_fail "Build failed (check /tmp/build.log)"
  fi
else
  # Fallback: check if build works without Doppler (will use placeholder values)
  if npm run build > /tmp/build.log 2>&1; then
    check_pass "Build succeeds (using placeholder values)"
    check_warn "Doppler not configured - app will not connect to real services"
  else
    check_fail "Build failed (check /tmp/build.log)"
  fi
fi
cd ../../..

echo ""

# Check 4: SQL migrations exist
echo "📦 Checking Database Migrations..."
MIGRATION_COUNT=$(ls -1 integratewise-complete/sql-migrations/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 40 ]; then
  check_pass "Migrations found ($MIGRATION_COUNT files)"
else
  check_fail "Missing migrations (found $MIGRATION_COUNT, expected 40+)"
fi

# Check RLS migration exists
if [ -f "integratewise-complete/sql-migrations/050_rls_policies.sql" ]; then
  check_pass "RLS policies migration exists"
else
  check_fail "RLS policies migration missing"
fi

echo ""

# Check 5: Test files exist
echo "🧪 Checking Tests..."
if [ -f "integratewise-complete/apps/web/src/test/smoke.test.tsx" ]; then
  check_pass "Smoke tests exist"
else
  check_warn "No smoke tests found"
fi

if [ -f "integratewise-complete/apps/web/vitest.config.ts" ]; then
  check_pass "Vitest config exists"
else
  check_warn "Vitest config missing"
fi

echo ""

# Check 6: Dependencies installed
echo "📁 Checking Dependencies..."
if [ -d "integratewise-complete/apps/web/node_modules" ]; then
  check_pass "Node modules installed"
else
  check_fail "Node modules missing (run: cd integratewise-complete/apps/web && npm install)"
fi

if [ -d "integratewise-complete/apps/web/node_modules/@supabase" ]; then
  check_pass "Supabase client installed"
else
  check_fail "Supabase client missing"
fi

echo ""

# Check 7: Critical files exist
echo "📄 Checking Critical Files..."
CRITICAL_FILES=(
  "integratewise-complete/apps/web/src/lib/api/supabase.ts"
  "integratewise-complete/apps/web/src/lib/api/auth.ts"
  "integratewise-complete/apps/web/src/hooks/useAuth.tsx"
  "integratewise-complete/apps/web/src/components/ErrorBoundary.tsx"
  "integratewise-complete/apps/web/src/components/app/ProtectedRoute.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    check_pass "$(basename $file) exists"
  else
    check_fail "$(basename $file) missing"
  fi
done

echo ""

# Check 8: No obvious security issues
echo "🔒 Basic Security Check..."
if grep -r "console.log" integratewise-complete/apps/web/src/lib/api/ --include="*.ts" 2>/dev/null | grep -v "console.warn\|console.error" | grep -qi "password\|token\|secret"; then
  check_warn "Potential sensitive data in console.log"
else
  check_pass "No obvious sensitive data logging"
fi

# Check for hardcoded keys (basic check)
if grep -r "sk_live_\|pk_live_" integratewise-complete/apps/web/src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "VITE_\|import\.meta\.env"; then
  check_fail "Potential hardcoded keys found"
else
  check_pass "No hardcoded API keys detected"
fi

# Check for .env files (should NOT exist - we use Doppler)
if [ -f "integratewise-complete/apps/web/.env" ] || [ -f "integratewise-complete/apps/web/.env.local" ]; then
  check_warn ".env file exists (should use Doppler instead)"
else
  check_pass "No local .env files (using Doppler)"
fi

echo ""
echo "=========================================================="
echo "📊 Summary"
echo "=========================================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All critical checks passed! Ready for deployment.${NC}"
  echo ""
  echo "Doppler workflow:"
  echo "  doppler run -- npm run dev     # Start dev server"
  echo "  doppler run -- npm run build   # Build for production"
  echo ""
  echo "Deploy to Cloudflare Pages:"
  echo "  cd integratewise-complete/apps/web"
  echo "  doppler run -- wrangler pages deploy dist"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Deployment blocked! Fix failed checks first.${NC}"
  echo ""
  echo "Critical fixes needed:"
  if ! command -v doppler &> /dev/null; then
    echo "  - Install Doppler: brew install doppler"
  fi
  if ! doppler me &> /dev/null 2>&1; then
    echo "  - Login to Doppler: doppler login"
  fi
  if [ ! -f "doppler.yaml" ] && [ ! -f ".doppler/.doppler.yaml" ]; then
    echo "  - Setup project: doppler setup"
  fi
  exit 1
fi
