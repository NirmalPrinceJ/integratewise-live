#!/bin/bash
# IntegrateWise Quick Start Script
# Gets you running in seconds

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 IntegrateWise Quick Start${NC}"
echo "============================"
echo ""

cd /Users/nirmal/Github/integratewise-live/integratewise-complete/apps/web

# Check node modules
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Option menu
echo "Choose mode:"
echo ""
echo "1) Dev mode (with Doppler - connects to real backend)"
echo "2) Dev mode (without Doppler - uses placeholder values)"
echo "3) Run tests"
echo "4) Build for production"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    if command -v doppler &> /dev/null; then
      echo -e "${GREEN}Starting dev server with Doppler...${NC}"
      doppler run -- npm run dev
    else
      echo "Doppler not installed. Install with: brew install doppler"
      echo "Starting without Doppler..."
      npm run dev
    fi
    ;;
  2)
    echo -e "${GREEN}Starting dev server...${NC}"
    echo "⚠️  Using placeholder values - app will show mock data"
    npm run dev
    ;;
  3)
    echo -e "${GREEN}Running tests...${NC}"
    npm test
    ;;
  4)
    echo -e "${GREEN}Building for production...${NC}"
    if command -v doppler &> /dev/null; then
      doppler run -- npm run build
    else
      npm run build
    fi
    echo ""
    echo -e "${GREEN}✓ Build complete!${NC}"
    echo "Output: dist/"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
