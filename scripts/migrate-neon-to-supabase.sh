#!/bin/bash
# ============================================================================
# Neon → Supabase Migration Script
# ============================================================================
# Usage: ./scripts/migrate-neon-to-supabase.sh
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║         Neon → Supabase Migration Tool                               ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required environment variables
if [ -z "$NEON_DATABASE_URL" ]; then
    echo -e "${RED}Error: NEON_DATABASE_URL not set${NC}"
    echo "Set it with: export NEON_DATABASE_URL=postgresql://..."
    exit 1
fi

if [ -z "$SUPABASE_DIRECT_URL" ]; then
    echo -e "${RED}Error: SUPABASE_DIRECT_URL not set${NC}"
    echo "Get it from: Supabase Dashboard → Database → Connection String (Direct)"
    exit 1
fi

# Get from .env if available
if [ -f .env.local ]; then
    export $(grep -E '^(NEON_DATABASE_URL|SUPABASE_DIRECT_URL)=' .env.local | xargs)
fi

echo -e "${YELLOW}Step 1: Backing up Neon database...${NC}"
BACKUP_FILE="neon_backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump "$NEON_DATABASE_URL" --clean --if-exists > "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup saved to: $BACKUP_FILE${NC}"

echo ""
echo -e "${YELLOW}Step 2: Preparing Supabase schema...${NC}"
# Create schema if not exists
psql "$SUPABASE_DIRECT_URL" -c "CREATE SCHEMA IF NOT EXISTS hub;" 2>/dev/null || true
echo -e "${GREEN}✓ Schema 'hub' ready${NC}"

echo ""
echo -e "${YELLOW}Step 3: Migrating data...${NC}"
# Restore to Supabase
psql "$SUPABASE_DIRECT_URL" < "$BACKUP_FILE"
echo -e "${GREEN}✓ Data migrated successfully${NC}"

echo ""
echo -e "${YELLOW}Step 4: Setting up RLS policies...${NC}"
# Apply RLS policies (these are in the migrations)
psql "$SUPABASE_DIRECT_URL" -f sql-migrations/001_supabase_schema.sql
echo -e "${GREEN}✓ RLS policies applied${NC}"

echo ""
echo -e "${YELLOW}Step 5: Verifying migration...${NC}"
# Count tables
TABLE_COUNT=$(psql "$SUPABASE_DIRECT_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'hub';" | xargs)
echo -e "${GREEN}✓ Found $TABLE_COUNT tables in 'hub' schema${NC}"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                      Migration Complete!                              ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Update .env.local:"
echo "     - Remove NEON_DATABASE_URL"
echo "     - Set DATABASE_URL to Supabase pooler URL"
echo "  2. Test application: npm run dev"
echo "  3. Deploy to staging"
echo "  4. Monitor for 24 hours"
echo "  5. Decommission Neon (after 7 days)"
echo ""
echo "Backup file: $BACKUP_FILE"
echo "Keep this file until migration is fully verified."
