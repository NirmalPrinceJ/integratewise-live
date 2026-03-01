#!/bin/bash
# IntegrateWise OS - Cloudflare Monitoring Setup Script
# This script helps configure monitoring and alerting for all workers

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  IntegrateWise OS - Cloudflare Monitoring Setup${NC}"
echo -e "${BLUE}  Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Worker endpoints to monitor
if [[ "$ENVIRONMENT" == "production" ]]; then
    ENDPOINTS=(
        "https://api.integratewise.ai/health"
        "https://hooks.integratewise.ai/health"
        "https://files.integratewise.ai/health"
        "https://admin.integratewise.ai/health"
        "https://act.integratewise.ai/health"
        "https://think.integratewise.ai/health"
        "https://knowledge.integratewise.ai/health"
        "https://normalizer.integratewise.ai/health"
        "https://iq-hub.integratewise.ai/health"
        "https://mcp.integratewise.ai/health"
    )
else
    ENDPOINTS=(
        "https://staging-api.integratewise.ai/health"
        "https://staging-hooks.integratewise.ai/health"
        "https://staging-files.integratewise.ai/health"
        "https://staging-admin.integratewise.ai/health"
        "https://act-staging.integratewise.ai/health"
        "https://think-staging.integratewise.ai/health"
        "https://knowledge-staging.integratewise.ai/health"
        "https://normalizer-staging.integratewise.ai/health"
        "https://iq-hub-staging.integratewise.ai/health"
        "https://mcp-staging.integratewise.ai/health"
    )
fi

echo -e "\n${YELLOW}Testing Health Endpoints...${NC}"

# Test all health endpoints
FAILED_ENDPOINTS=()
for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "Testing $endpoint... "
    if curl -s --max-time 10 --fail "$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED_ENDPOINTS+=("$endpoint")
    fi
done

if [[ ${#FAILED_ENDPOINTS[@]} -gt 0 ]]; then
    echo -e "\n${RED}Warning: Some health endpoints are not responding:${NC}"
    for endpoint in "${FAILED_ENDPOINTS[@]}"; do
        echo -e "  ${RED}• $endpoint${NC}"
    done
    echo -e "\n${YELLOW}Note: This is expected if workers haven't been fully configured yet.${NC}"
else
    echo -e "\n${GREEN}✓ All health endpoints are responding!${NC}"
fi

echo -e "\n${BLUE}Cloudflare Monitoring Setup Instructions:${NC}"
echo -e "${YELLOW}===========================================${NC}"

echo -e "\n${GREEN}1. Synthetic Monitors (Cloudflare Dashboard)${NC}"
echo -e "   Navigate: https://dash.cloudflare.com → Monitoring → Synthetic Monitors"
echo -e "   Create monitors for these endpoints (every 1 minute):"

for endpoint in "${ENDPOINTS[@]}"; do
    echo -e "   ${BLUE}• $endpoint${NC}"
done

echo -e "\n${GREEN}2. Alert Policies (Cloudflare Dashboard)${NC}"
echo -e "   Navigate: https://dash.cloudflare.com → Notifications → Add"
echo -e "   Create alerts for:"
echo -e "   ${BLUE}• Synthetic Monitor Down${NC}"
echo -e "   ${BLUE}• Worker Errors (>5% 5xx responses)${NC}"
echo -e "   ${BLUE}• Worker Latency (>2s p95)${NC}"
echo -e "   ${BLUE}• Worker CPU Usage (>80%)${NC}"

echo -e "\n${GREEN}3. Worker-Level Monitoring${NC}"
echo -e "   For each worker, enable:"
echo -e "   ${BLUE}• Real-time logs${NC}"
echo -e "   ${BLUE}• Error tracking${NC}"
echo -e "   ${BLUE}• Performance metrics${NC}"

echo -e "\n${GREEN}4. Custom Dashboard${NC}"
echo -e "   Create a dashboard with these metrics:"
echo -e "   ${BLUE}• Response times${NC}"
echo -e "   ${BLUE}• Error rates${NC}"
echo -e "   ${BLUE}• Request volumes${NC}"
echo -e "   ${BLUE}• CPU/Memory usage${NC}"

echo -e "\n${YELLOW}Manual Setup Required:${NC}"
echo -e "   These monitoring configurations must be set up manually"
echo -e "   through the Cloudflare Dashboard as they require account-specific"
echo -e "   settings and notification preferences."

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Monitoring Setup Guide Complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Generate a summary report
echo -e "\n${YELLOW}Health Check Summary:${NC}"
echo -e "Environment: $ENVIRONMENT"
echo -e "Total endpoints tested: ${#ENDPOINTS[@]}"
echo -e "Healthy endpoints: $((${#ENDPOINTS[@]} - ${#FAILED_ENDPOINTS[@]}))"
echo -e "Failed endpoints: ${#FAILED_ENDPOINTS[@]}"

if [[ ${#FAILED_ENDPOINTS[@]} -gt 0 ]]; then
    echo -e "\nFailed endpoints:"
    for endpoint in "${FAILED_ENDPOINTS[@]}"; do
        echo -e "  • $endpoint"
    done
fi

echo -e "\n${GREEN}Next: Configure monitoring in Cloudflare Dashboard${NC}"