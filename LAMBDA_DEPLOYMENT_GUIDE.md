# Lambda Functions Deployment Guide

This guide walks through deploying the three new Lambda functions for the Montebay website.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (optional, but helpful)
- Node.js 20.x installed locally
- Access to AWS Console

---

## Overview

Three Lambda functions need to be deployed:

1. **AI Diagnostic Tool** (`ai-diagnostic-tool`)
   - Generates personalized reports using LLM
   - Sends reports via email

2. **Lead Magnet Handler** (`lead-magnet-handler`)
   - Handles AI Readiness Checklist and product brief requests
   - Sends download links via email

3. **Newsletter Signup** (`newsletter-signup`)
   - Handles newsletter subscriptions
   - Integrates with mailing list services

---

## Step 1: Prepare AWS Resources

### A. Verify SES Email Address

1. Go to AWS Console → SES → Verified identities
2. Verify `contact@montebay.io` (or your FROM_EMAIL)
3. If in SES Sandbox, verify recipient email addresses too

### B. Create IAM Role for Lambda

1. Go to IAM → Roles → Create role
2. Select "Lambda" as service
3. Attach policies:
   - `AWSLambdaBasicExecutionRole`
   - Custom policy for SES (see below)

**Custom SES Policy:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

---

## Step 2: Deploy AI Diagnostic Tool

### 2.1 Install Dependencies

```bash
cd lambda-functions/ai-diagnostic-tool
npm install
```

### 2.2 Create Deployment Package

```bash
# Create zip file (exclude node_modules/.cache and other unnecessary files)
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store" "node_modules/.cache/*"
```

### 2.3 Create Lambda Function

1. Go to AWS Console → Lambda → Create function
2. **Function name:** `montebay-ai-diagnostic-tool`
3. **Runtime:** Node.js 20.x
4. **Architecture:** x86_64
5. Click "Create function"

### 2.4 Upload Code

1. In Lambda function page, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload `function.zip`
4. Click "Save"

### 2.5 Configure Function

**Basic Settings:**
- **Timeout:** 30 seconds (for LLM API calls)
- **Memory:** 512 MB

**Environment Variables:**
```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
OPENAI_API_KEY=your_openai_api_key_here (optional)
OPENAI_MODEL=gpt-4o-mini
```

**IAM Role:**
- Select the role created in Step 1

### 2.6 Create API Gateway Endpoint

1. Go to API Gateway → Your API
2. Create resource: `/montebay/ai-diagnostic`
3. Create method: POST
4. Integration type: Lambda Function
5. Select: `montebay-ai-diagnostic-tool`
6. Enable CORS:
   - Access-Control-Allow-Origin: `https://www.montebay.io`
   - Access-Control-Allow-Headers: `Content-Type`
   - Access-Control-Allow-Methods: `POST, OPTIONS`
7. Deploy API (or use existing deployment)

### 2.7 Update Frontend

The frontend is already configured to use:
```
https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic
```

If your API Gateway URL is different, update `script.js` line ~950.

---

## Step 3: Deploy Lead Magnet Handler

### 3.1 Install Dependencies

```bash
cd lambda-functions/lead-magnet-handler
npm install
```

### 3.2 Create Deployment Package

```bash
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store"
```

### 3.3 Create Lambda Function

1. **Function name:** `montebay-lead-magnet-handler`
2. **Runtime:** Node.js 20.x
3. Follow same steps as AI Diagnostic Tool

### 3.4 Configure Function

**Environment Variables:**
```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
AI_CHECKLIST_URL=https://www.montebay.io/assets/pdfs/ai-readiness-checklist.pdf
WORDFLECT_BRIEF_URL=https://www.montebay.io/assets/pdfs/wordflect-brief.pdf
SOTERIA_BRIEF_URL=https://www.montebay.io/assets/pdfs/soteria-brief.pdf
```

**Note:** Update PDF URLs once PDFs are uploaded to your site or S3.

### 3.5 Create API Gateway Endpoint

1. Resource: `/montebay/lead-magnet`
2. Method: POST
3. Enable CORS
4. Deploy

### 3.6 Update Frontend

Update `script.js` if your API Gateway URL differs from:
```
https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet
```

---

## Step 4: Deploy Newsletter Signup

### 4.1 Install Dependencies

```bash
cd lambda-functions/newsletter-signup
npm install
```

**Optional:** If using Mailchimp:
```bash
npm install @mailchimp/mailchimp_marketing
```

### 4.2 Create Deployment Package

```bash
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store"
```

### 4.3 Create Lambda Function

1. **Function name:** `montebay-newsletter-signup`
2. **Runtime:** Node.js 20.x
3. Follow same steps as above

### 4.4 Configure Function

**Environment Variables:**
```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
MAILCHIMP_API_KEY=your_mailchimp_api_key (optional)
MAILCHIMP_LIST_ID=your_mailchimp_list_id (optional)
CONVERTKIT_API_KEY=your_convertkit_api_key (optional)
CONVERTKIT_FORM_ID=your_convertkit_form_id (optional)
```

### 4.5 Create API Gateway Endpoint

1. Resource: `/montebay/newsletter`
2. Method: POST
3. Enable CORS
4. Deploy

### 4.6 Update Frontend

Update `script.js` if your API Gateway URL differs from:
```
https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter
```

---

## Step 5: Test Functions

### Test AI Diagnostic Tool

```bash
curl -X POST https://[YOUR_API_GATEWAY]/prod/montebay/ai-diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "primary-challenge": "System complexity",
    "company-size": "11-50 employees",
    "pain-points": ["Manual processes"],
    "goals": ["Reduce costs"]
  }'
```

### Test Lead Magnet Handler

```bash
curl -X POST https://[YOUR_API_GATEWAY]/prod/montebay/lead-magnet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "resourceType": "ai-readiness-checklist"
  }'
```

### Test Newsletter Signup

```bash
curl -X POST https://[YOUR_API_GATEWAY]/prod/montebay/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

---

## Step 6: Update Frontend API Endpoints

If your API Gateway URLs differ from the defaults, update these files:

1. **`script.js`** - Update API endpoints:
   - Line ~950: AI Diagnostic Tool endpoint
   - Line ~810: Lead Magnet endpoint
   - Line ~870: Newsletter endpoint

2. **Test on live site** after deployment

---

## Cost Estimates

### Lambda
- **Free tier:** 1M requests/month, 400,000 GB-seconds
- **Beyond free tier:** ~$0.20 per 1M requests

### API Gateway
- **Free tier:** 1M API calls/month
- **Beyond free tier:** ~$3.50 per 1M requests

### SES
- **Free tier:** 62,000 emails/month (if on EC2)
- **Beyond free tier:** $0.10 per 1,000 emails

### OpenAI (if used)
- **gpt-4o-mini:** ~$0.01-0.02 per diagnostic report
- **Monthly estimate:** $10-50 for moderate usage

**Total estimated monthly cost (moderate usage):** $15-60

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Verify CORS is enabled in API Gateway
- Check CORS headers in Lambda response
- Verify origin matches your domain

**2. SES Email Not Sending**
- Verify email address in SES
- Check IAM permissions
- Verify you're not in SES Sandbox (or verify recipient emails)

**3. Lambda Timeout**
- Increase timeout to 30 seconds
- Check CloudWatch logs for errors
- Verify API keys are set correctly

**4. OpenAI API Errors**
- Verify API key is correct
- Check API usage limits
- Verify model name is correct

---

## Monitoring

### CloudWatch Logs

Each Lambda function creates CloudWatch log groups:
- `/aws/lambda/montebay-ai-diagnostic-tool`
- `/aws/lambda/montebay-lead-magnet-handler`
- `/aws/lambda/montebay-newsletter-signup`

Monitor for:
- Errors
- Execution time
- API usage

### Set Up Alarms

1. Go to CloudWatch → Alarms
2. Create alarms for:
   - Lambda errors
   - High execution time
   - API Gateway 5xx errors

---

## Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for sensitive data
3. **Rotate API keys** regularly
4. **Limit IAM permissions** to minimum required
5. **Enable CloudWatch logging** for audit trail
6. **Use API Gateway throttling** to prevent abuse

---

## Next Steps

After deployment:

1. ✅ Test all three functions
2. ✅ Verify emails are being sent
3. ✅ Test from live website
4. ✅ Monitor CloudWatch logs
5. ✅ Set up CloudWatch alarms
6. ✅ Update frontend if API URLs changed

---

**Need Help?**
- AWS Lambda Documentation: https://docs.aws.amazon.com/lambda/
- API Gateway Documentation: https://docs.aws.amazon.com/apigateway/
- SES Documentation: https://docs.aws.amazon.com/ses/
