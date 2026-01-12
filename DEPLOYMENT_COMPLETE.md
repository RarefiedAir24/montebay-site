# ✅ Lambda Deployment Complete!

## Deployment Summary

All three Lambda functions have been successfully deployed and wired to API Gateway.

### Deployed Lambda Functions

1. **montebay-ai-diagnostic-tool** ✅
   - Runtime: Node.js 20.x
   - Timeout: 30 seconds
   - Memory: 512 MB
   - Status: Active and tested

2. **montebay-lead-magnet-handler** ✅
   - Runtime: Node.js 20.x
   - Timeout: 10 seconds
   - Memory: 256 MB
   - Status: Active and tested

3. **montebay-newsletter-signup** ✅
   - Runtime: Node.js 20.x
   - Timeout: 10 seconds
   - Memory: 256 MB
   - Status: Active and tested

### API Gateway Endpoints

All endpoints are live at:
```
https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod
```

**Endpoints:**
- ✅ `/montebay/ai-diagnostic` (POST)
- ✅ `/montebay/lead-magnet` (POST)
- ✅ `/montebay/newsletter` (POST)

### Configuration

**IAM Role:** `montebay-lambda-role` (with SES permissions)

**Environment Variables:**
- All functions: `TO_EMAIL=contact@montebay.io`, `FROM_EMAIL=contact@montebay.io`
- AI Diagnostic: `OPENAI_MODEL=gpt-4o-mini` (OpenAI API key can be added later)
- Lead Magnet: PDF URLs configured

**CORS:** Enabled for `https://www.montebay.io`

### Test Results

✅ **AI Diagnostic Tool:** Working
- Tested successfully
- Returns diagnostic report
- Email delivery configured

✅ **Lead Magnet Handler:** Working
- Tested successfully
- Returns download link
- Email delivery configured

✅ **Newsletter Signup:** Working
- Tested successfully
- Returns confirmation
- Email delivery configured

### Frontend Integration

The frontend (`script.js`) is already configured to use these endpoints:
- Line ~1057: AI Diagnostic Tool
- Line ~804: Lead Magnet Handler
- Line ~892: Newsletter Signup

**No frontend changes needed!** Everything is wired correctly.

---

## Next Steps

### Optional: Add OpenAI API Key

To enable AI-generated reports (instead of template reports):

1. Go to AWS Lambda → `montebay-ai-diagnostic-tool`
2. Configuration → Environment variables
3. Add: `OPENAI_API_KEY=sk-...`
4. Save

### Optional: Add Mailchimp/ConvertKit

To integrate with mailing list:

1. Go to AWS Lambda → `montebay-newsletter-signup`
2. Configuration → Environment variables
3. Add: `MAILCHIMP_API_KEY=...` and `MAILCHIMP_LIST_ID=...`
4. Save

### Monitor

- CloudWatch Logs: `/aws/lambda/montebay-*`
- API Gateway Metrics: Monitor request counts and errors
- SES: Monitor email delivery

---

## Deployment Details

**Deployment Date:** 2026-01-12
**API Gateway ID:** bisrhls8q9
**Region:** us-east-2
**Stage:** prod
**Deployment ID:** keb3c8

---

## Verification

Test endpoints:
```bash
# AI Diagnostic
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","primary-challenge":"System complexity","company-size":"11-50 employees"}'

# Lead Magnet
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","resourceType":"ai-readiness-checklist"}'

# Newsletter
curl -X POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```

---

**Status:** ✅ All systems operational!
