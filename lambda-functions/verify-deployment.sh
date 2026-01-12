#!/bin/bash

# Lambda Deployment Verification Script
# This script helps verify that Lambda functions are deployed and wired correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Lambda Deployment Verification${NC}"
echo "======================================"
echo ""

# Check if API Gateway URL is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}⚠️  No API Gateway URL provided${NC}"
    echo ""
    echo "Usage: ./verify-deployment.sh <API_GATEWAY_URL>"
    echo "Example: ./verify-deployment.sh https://abc123.execute-api.us-east-2.amazonaws.com/prod"
    echo ""
    echo "This script will test all three Lambda endpoints."
    exit 1
fi

API_BASE_URL=$1
# Remove trailing slash if present
API_BASE_URL=${API_BASE_URL%/}

echo -e "${BLUE}Testing API Gateway: ${API_BASE_URL}${NC}"
echo ""

# Test AI Diagnostic Tool
echo -e "${BLUE}1. Testing AI Diagnostic Tool...${NC}"
DIAGNOSTIC_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/montebay/ai-diagnostic" \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "primary-challenge": "System complexity",
    "company-size": "11-50 employees",
    "pain-points": ["Manual processes"],
    "goals": ["Reduce costs"]
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$DIAGNOSTIC_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$DIAGNOSTIC_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ AI Diagnostic Tool: Working${NC}"
    echo "   Response: $(echo "$BODY" | jq -r '.message // .success' 2>/dev/null || echo 'OK')"
else
    echo -e "${RED}❌ AI Diagnostic Tool: Failed (HTTP $HTTP_CODE)${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test Lead Magnet Handler
echo -e "${BLUE}2. Testing Lead Magnet Handler...${NC}"
LEAD_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/montebay/lead-magnet" \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "resourceType": "ai-readiness-checklist"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$LEAD_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$LEAD_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Lead Magnet Handler: Working${NC}"
    echo "   Response: $(echo "$BODY" | jq -r '.message // .success' 2>/dev/null || echo 'OK')"
else
    echo -e "${RED}❌ Lead Magnet Handler: Failed (HTTP $HTTP_CODE)${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test Newsletter Signup
echo -e "${BLUE}3. Testing Newsletter Signup...${NC}"
NEWSLETTER_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/montebay/newsletter" \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$NEWSLETTER_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$NEWSLETTER_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Newsletter Signup: Working${NC}"
    echo "   Response: $(echo "$BODY" | jq -r '.message // .success' 2>/dev/null || echo 'OK')"
else
    echo -e "${RED}❌ Newsletter Signup: Failed (HTTP $HTTP_CODE)${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Summary
echo "======================================"
echo -e "${BLUE}Verification Complete${NC}"
echo ""
echo "If all tests passed, update script.js with:"
echo "  ${API_BASE_URL}"
echo ""
