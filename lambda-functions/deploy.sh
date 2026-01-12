#!/bin/bash

# Montebay Lambda Functions Deployment Script
# This script helps prepare deployment packages for all Lambda functions

set -e

echo "🚀 Montebay Lambda Functions Deployment Helper"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to deploy a Lambda
deploy_lambda() {
    local FUNCTION_NAME=$1
    local FUNCTION_DIR=$2
    
    echo -e "${BLUE}📦 Preparing ${FUNCTION_NAME}...${NC}"
    
    cd "$FUNCTION_DIR"
    
    # Check if node_modules exists, if not install
    if [ ! -d "node_modules" ]; then
        echo "   Installing dependencies..."
        npm install
    fi
    
    # Remove old zip if exists
    if [ -f "function.zip" ]; then
        rm function.zip
    fi
    
    # Create deployment package
    echo "   Creating deployment package..."
    zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store" "node_modules/.cache/*" "*.test.js" "*.spec.js"
    
    echo -e "${GREEN}✅ ${FUNCTION_NAME} package ready: ${FUNCTION_DIR}/function.zip${NC}"
    echo ""
    
    cd - > /dev/null
}

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "This script will prepare deployment packages for all Lambda functions."
echo ""
echo "Functions to prepare:"
echo "  1. AI Diagnostic Tool"
echo "  2. Lead Magnet Handler"
echo "  3. Newsletter Signup"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "Starting deployment package preparation..."
echo ""

# Deploy AI Diagnostic Tool
deploy_lambda "AI Diagnostic Tool" "ai-diagnostic-tool"

# Deploy Lead Magnet Handler
deploy_lambda "Lead Magnet Handler" "lead-magnet-handler"

# Deploy Newsletter Signup
deploy_lambda "Newsletter Signup" "newsletter-signup"

echo ""
echo -e "${GREEN}✨ All deployment packages are ready!${NC}"
echo ""
echo "Next steps:"
echo "  1. Go to AWS Console → Lambda"
echo "  2. For each function:"
echo "     - Create function (or update existing)"
echo "     - Upload the function.zip file"
echo "     - Set environment variables"
echo "     - Configure timeout and memory"
echo "  3. Create API Gateway endpoints"
echo "  4. Update frontend script.js with API Gateway URLs"
echo ""
echo "See DEPLOY_QUICK_START.md for detailed instructions."
echo ""
