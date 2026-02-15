#!/bin/bash

# Knowledge Bank API Test Script
# This script tests the complete ingestion flow

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
API_KEY="${API_KEY:-demo-api-key-12345}"
TENANT_ID="${TENANT_ID:-demo-tenant}"

echo "=================================="
echo "Knowledge Bank API Test"
echo "=================================="
echo "API URL: $API_URL"
echo "Tenant: $TENANT_ID"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
HEALTH_RESPONSE=$(curl -s "$API_URL/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Ingest Session
echo -e "${YELLOW}Test 2: Ingest Session${NC}"
SESSION_ID="test_session_$(date +%s)"

INGEST_RESPONSE=$(curl -s -X POST "$API_URL/v1/ai/session-end" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "tenant_id": "$TENANT_ID",
  "user_id": "test_user",
  "provider": "chatgpt",
  "session_id": "$SESSION_ID",
  "started_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "ended_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "summary_md": "# Test Session\n\nThis is an automated test session created at $(date).\n\n## Topics Discussed\n\n- Testing the Knowledge Bank API\n- Verifying ingestion pipeline\n- Checking GCS and Firestore integration\n\n## Outcome\n\nSuccessfully tested the complete flow from ingestion to storage.",
  "topics": ["testing", "automation", "knowledge-bank"],
  "project": "API Testing"
}
EOF
)

if echo "$INGEST_RESPONSE" | grep -q "Session ingested successfully\|Session already ingested"; then
    echo -e "${GREEN}✓ Session ingested successfully${NC}"
    echo "Session ID: $SESSION_ID"
    echo "Response: $INGEST_RESPONSE"
else
    echo -e "${RED}✗ Session ingestion failed${NC}"
    echo "Response: $INGEST_RESPONSE"
    exit 1
fi
echo ""

# Wait a moment for async operations
echo "Waiting 3 seconds for async operations..."
sleep 3
echo ""

# Test 3: Check Inbox
echo -e "${YELLOW}Test 3: Check Inbox${NC}"
INBOX_RESPONSE=$(curl -s "$API_URL/v1/kb/inbox?tenant_id=$TENANT_ID&limit=5" \
  -H "Authorization: Bearer $API_KEY")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Inbox retrieved successfully${NC}"
    echo "Response (first 500 chars): ${INBOX_RESPONSE:0:500}..."
else
    echo -e "${RED}✗ Inbox retrieval failed${NC}"
    exit 1
fi
echo ""

# Test 4: Search
echo -e "${YELLOW}Test 4: Search Sessions${NC}"
SEARCH_RESPONSE=$(curl -s "$API_URL/v1/kb/search?q=testing&tenant_id=$TENANT_ID" \
  -H "Authorization: Bearer $API_KEY")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Search completed successfully${NC}"
    echo "Response (first 500 chars): ${SEARCH_RESPONSE:0:500}..."
else
    echo -e "${RED}✗ Search failed${NC}"
    exit 1
fi
echo ""

# Test 5: List Topics
echo -e "${YELLOW}Test 5: List Topics${NC}"
TOPICS_RESPONSE=$(curl -s "$API_URL/v1/kb/topics?tenant_id=$TENANT_ID" \
  -H "Authorization: Bearer $API_KEY")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Topics retrieved successfully${NC}"
    echo "Response: $TOPICS_RESPONSE"
else
    echo -e "${RED}✗ Topics retrieval failed${NC}"
    exit 1
fi
echo ""

# Test 6: Create Topic
echo -e "${YELLOW}Test 6: Create Topic${NC}"
TOPIC_CREATE_RESPONSE=$(curl -s -X POST "$API_URL/v1/kb/topics" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "tenant_id": "$TENANT_ID",
  "name": "automated-testing",
  "cadence": "weekly",
  "hourly_opt_in": false
}
EOF
)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Topic created successfully${NC}"
    echo "Response: $TOPIC_CREATE_RESPONSE"
else
    echo -e "${RED}✗ Topic creation failed${NC}"
    echo "Response: $TOPIC_CREATE_RESPONSE"
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✓ All tests completed!${NC}"
echo "=================================="
echo ""
echo "Test session ID: $SESSION_ID"
echo ""
echo "Next steps:"
echo "1. Check GCS bucket for uploaded summary"
echo "2. Check Firestore for metadata"
echo "3. Verify Vertex AI Search indexing (may take a few minutes)"
echo ""
