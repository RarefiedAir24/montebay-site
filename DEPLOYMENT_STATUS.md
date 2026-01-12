# Deployment Status & Wiring Verification

## Current Configuration

### Frontend API Endpoints (script.js)

All three Lambda functions are configured to use:
```
https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod
```

**Endpoints configured:**
1. **AI Diagnostic Tool** (line ~1057)
   - Endpoint: `/montebay/ai-diagnostic`
   - Full URL: `https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic`

2. **Lead Magnet Handler** (line ~804)
   - Endpoint: `/montebay/lead-magnet`
   - Full URL: `https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet`

3. **Newsletter Signup** (line ~892)
   - Endpoint: `/montebay/newsletter`
   - Full URL: `https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter`

### Existing Endpoints (Already Deployed)

The API Gateway URL `bisrhls8q9.execute-api.us-east-2.amazonaws.com` appears to already exist and has:
- Silent AWS Audit endpoint (line ~388)
- Strategic Cyber Risk Advisory endpoint (line ~613)

---

## Deployment Checklist

### ✅ Code Ready
- [x] All Lambda functions created and packaged
- [x] Frontend wired to API endpoints
- [x] Error handling and fallbacks in place
- [x] CORS headers configured in Lambda functions

### ⏳ AWS Deployment Needed

**Step 1: Verify API Gateway**
- [ ] Check if API Gateway `bisrhls8q9` already has the new endpoints
- [ ] If not, create endpoints: `/montebay/ai-diagnostic`, `/montebay/lead-magnet`, `/montebay/newsletter`

**Step 2: Deploy Lambda Functions**
- [ ] Deploy `montebay-ai-diagnostic-tool` Lambda function
- [ ] Deploy `montebay-lead-magnet-handler` Lambda function
- [ ] Deploy `montebay-newsletter-signup` Lambda function

**Step 3: Wire API Gateway to Lambda**
- [ ] Connect `/montebay/ai-diagnostic` POST → `montebay-ai-diagnostic-tool`
- [ ] Connect `/montebay/lead-magnet` POST → `montebay-lead-magnet-handler`
- [ ] Connect `/montebay/newsletter` POST → `montebay-newsletter-signup`

**Step 4: Configure Environment Variables**
- [ ] Set SES email addresses
- [ ] Set AWS region
- [ ] Set OpenAI API key (optional, for AI Diagnostic)
- [ ] Set PDF URLs (for Lead Magnet)

**Step 5: Test**
- [ ] Test AI Diagnostic Tool
- [ ] Test Lead Magnet Handler
- [ ] Test Newsletter Signup
- [ ] Verify emails are received

---

## Quick Deployment Steps

### Option 1: Use Existing API Gateway

If the API Gateway `bisrhls8q9` is already set up:

1. **Deploy Lambda Functions:**
   ```bash
   # Go to AWS Console → Lambda
   # For each function, upload the function.zip file
   ```

2. **Add API Gateway Endpoints:**
   - Go to API Gateway → Select your API
   - Create resources: `/montebay/ai-diagnostic`, `/montebay/lead-magnet`, `/montebay/newsletter`
   - Connect each to its Lambda function
   - Enable CORS
   - Deploy

3. **Test:**
   ```bash
   cd lambda-functions
   ./verify-deployment.sh https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod
   ```

### Option 2: Create New API Gateway

Follow `lambda-functions/DEPLOY_NOW.md` for complete step-by-step instructions.

---

## Verification

After deployment, test each endpoint:

### Test AI Diagnostic Tool
```bash
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "primary-challenge": "System complexity",
    "company-size": "11-50 employees"
  }'
```

### Test Lead Magnet
```bash
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "resourceType": "ai-readiness-checklist"
  }'
```

### Test Newsletter
```bash
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.montebay.io" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

---

## Files Ready for Deployment

**Lambda Functions:**
- `lambda-functions/ai-diagnostic-tool/function.zip`
- `lambda-functions/lead-magnet-handler/function.zip`
- `lambda-functions/newsletter-signup/function.zip`

**Deployment Guides:**
- `lambda-functions/DEPLOY_NOW.md` - Step-by-step deployment
- `lambda-functions/DEPLOY_QUICK_START.md` - Quick reference
- `lambda-functions/DEPLOYMENT_CHECKLIST.md` - Checklist

**Verification:**
- `lambda-functions/verify-deployment.sh` - Test script

---

## Next Steps

1. **If API Gateway already exists:** Add the three new endpoints and deploy Lambda functions
2. **If creating new API Gateway:** Follow `DEPLOY_NOW.md` completely
3. **After deployment:** Run verification script and test from live website
4. **Update frontend:** If using different API Gateway URL, update `script.js`

---

**Status:** Code is ready and wired. AWS deployment needed.
