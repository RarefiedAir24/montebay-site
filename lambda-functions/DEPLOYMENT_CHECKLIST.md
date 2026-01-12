# Lambda Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] AWS Account ready with admin access
- [ ] AWS CLI installed (optional but helpful)
- [ ] Node.js 20.x installed locally
- [ ] Email `contact@montebay.io` verified in AWS SES
- [ ] OpenAI API key obtained (optional, for AI Diagnostic Tool)
- [ ] Mailchimp/ConvertKit API keys (optional, for Newsletter)

## Step 1: Prepare Deployment Packages

- [ ] Run deployment script: `./deploy.sh` (or manually zip each function)
- [ ] Verify `ai-diagnostic-tool/function.zip` exists
- [ ] Verify `lead-magnet-handler/function.zip` exists
- [ ] Verify `newsletter-signup/function.zip` exists

## Step 2: AWS Setup

### SES Configuration
- [ ] Verified `contact@montebay.io` in SES
- [ ] Verified recipient emails (if in SES Sandbox)
- [ ] SES is out of Sandbox (or ready to verify recipients)

### IAM Role
- [ ] Created IAM role: `montebay-lambda-role`
- [ ] Attached `AWSLambdaBasicExecutionRole` policy
- [ ] Created inline policy for SES (`ses:SendEmail`, `ses:SendRawEmail`)

## Step 3: Deploy AI Diagnostic Tool

- [ ] Created Lambda function: `montebay-ai-diagnostic-tool`
- [ ] Runtime: Node.js 20.x
- [ ] Handler: `index.handler`
- [ ] Uploaded `function.zip`
- [ ] Set timeout: 30 seconds
- [ ] Set memory: 512 MB
- [ ] Set IAM role: `montebay-lambda-role`
- [ ] Environment variables set:
  - [ ] `TO_EMAIL=contact@montebay.io`
  - [ ] `FROM_EMAIL=contact@montebay.io`
  - [ ] `AWS_REGION=us-east-2`
  - [ ] `OPENAI_API_KEY=sk-...` (optional)
  - [ ] `OPENAI_MODEL=gpt-4o-mini`
- [ ] Created API Gateway endpoint: `/montebay/ai-diagnostic`
- [ ] Method: POST
- [ ] Enabled CORS
- [ ] Deployed API Gateway
- [ ] Copied API Gateway URL: `https://[ID].execute-api.[REGION].amazonaws.com/prod`
- [ ] Tested function with curl or Postman

## Step 4: Deploy Lead Magnet Handler

- [ ] Created Lambda function: `montebay-lead-magnet-handler`
- [ ] Runtime: Node.js 20.x
- [ ] Handler: `index.handler`
- [ ] Uploaded `function.zip`
- [ ] Set timeout: 10 seconds
- [ ] Set memory: 256 MB
- [ ] Set IAM role: `montebay-lambda-role`
- [ ] Environment variables set:
  - [ ] `TO_EMAIL=contact@montebay.io`
  - [ ] `FROM_EMAIL=contact@montebay.io`
  - [ ] `AWS_REGION=us-east-2`
  - [ ] `AI_CHECKLIST_URL=https://www.montebay.io/assets/pdfs/ai-readiness-checklist.pdf`
  - [ ] `WORDFLECT_BRIEF_URL=https://www.montebay.io/assets/pdfs/wordflect-brief.pdf`
  - [ ] `SOTERIA_BRIEF_URL=https://www.montebay.io/assets/pdfs/soteria-brief.pdf`
- [ ] Created API Gateway endpoint: `/montebay/lead-magnet`
- [ ] Method: POST
- [ ] Enabled CORS
- [ ] Deployed API Gateway
- [ ] Tested function

## Step 5: Deploy Newsletter Signup

- [ ] Created Lambda function: `montebay-newsletter-signup`
- [ ] Runtime: Node.js 20.x
- [ ] Handler: `index.handler`
- [ ] Uploaded `function.zip`
- [ ] Set timeout: 10 seconds
- [ ] Set memory: 256 MB
- [ ] Set IAM role: `montebay-lambda-role`
- [ ] Environment variables set:
  - [ ] `TO_EMAIL=contact@montebay.io`
  - [ ] `FROM_EMAIL=contact@montebay.io`
  - [ ] `AWS_REGION=us-east-2`
  - [ ] `MAILCHIMP_API_KEY=...` (optional)
  - [ ] `MAILCHIMP_LIST_ID=...` (optional)
- [ ] Created API Gateway endpoint: `/montebay/newsletter`
- [ ] Method: POST
- [ ] Enabled CORS
- [ ] Deployed API Gateway
- [ ] Tested function

## Step 6: Update Frontend

- [ ] Got API Gateway base URL: `https://[ID].execute-api.[REGION].amazonaws.com/prod`
- [ ] Updated `script.js` line ~950: AI Diagnostic Tool endpoint
- [ ] Updated `script.js` line ~810: Lead Magnet endpoint
- [ ] Updated `script.js` line ~870: Newsletter endpoint
- [ ] Committed and pushed changes
- [ ] Verified deployment on Vercel

## Step 7: Testing

### AI Diagnostic Tool
- [ ] Tested from live website
- [ ] Received email with report
- [ ] Report content looks correct
- [ ] Fallback works if API fails

### Lead Magnet Handler
- [ ] Tested AI Readiness Checklist request
- [ ] Received email with download link
- [ ] Link works correctly
- [ ] Notification email received at Montebay

### Newsletter Signup
- [ ] Tested newsletter signup
- [ ] Received confirmation email
- [ ] Added to mailing list (if configured)
- [ ] Notification email received at Montebay

## Step 8: Monitoring & Maintenance

- [ ] Set up CloudWatch alarms for errors
- [ ] Set up CloudWatch alarms for high latency
- [ ] Monitored CloudWatch logs
- [ ] Verified no errors in logs
- [ ] Documented API Gateway URLs
- [ ] Saved environment variable values securely

## Troubleshooting Notes

_Use this space to note any issues encountered and their solutions:_

- 

---

## Quick Reference

**API Gateway Base URL:** `https://[ID].execute-api.[REGION].amazonaws.com/prod`

**Endpoints:**
- AI Diagnostic: `/montebay/ai-diagnostic`
- Lead Magnet: `/montebay/lead-magnet`
- Newsletter: `/montebay/newsletter`

**Full URLs:**
- AI Diagnostic: `https://[ID].execute-api.[REGION].amazonaws.com/prod/montebay/ai-diagnostic`
- Lead Magnet: `https://[ID].execute-api.[REGION].amazonaws.com/prod/montebay/lead-magnet`
- Newsletter: `https://[ID].execute-api.[REGION].amazonaws.com/prod/montebay/newsletter`

---

**Deployment Date:** _______________
**Deployed By:** _______________
**API Gateway URL:** _______________
