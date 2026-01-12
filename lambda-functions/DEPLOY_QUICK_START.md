# Lambda Functions - Quick Start Deployment

This is a streamlined guide to deploy all three Lambda functions quickly.

## Prerequisites Checklist

- [ ] AWS Account with admin access
- [ ] AWS CLI installed and configured (optional but helpful)
- [ ] Node.js 20.x installed locally
- [ ] Email address verified in AWS SES (`contact@montebay.io`)
- [ ] OpenAI API key (optional, for AI Diagnostic Tool)

---

## Step 1: Verify SES Email

1. Go to AWS Console → **SES** → **Verified identities**
2. Click **Create identity**
3. Choose **Email address**
4. Enter: `contact@montebay.io`
5. Check your email and verify
6. **Important:** If you're in SES Sandbox, also verify any test recipient emails

---

## Step 2: Create IAM Role

1. Go to **IAM** → **Roles** → **Create role**
2. Select **AWS service** → **Lambda**
3. Click **Next**
4. Attach these policies:
   - `AWSLambdaBasicExecutionRole` (for CloudWatch logs)
5. Click **Next**
6. Name: `montebay-lambda-role`
7. Click **Create role**
8. Click on the role → **Add permissions** → **Create inline policy**
9. Use JSON editor, paste this:

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

10. Name: `SES-SendEmail-Policy`
11. Click **Create policy**

---

## Step 3: Deploy AI Diagnostic Tool

### 3.1 Prepare Package

```bash
cd lambda-functions/ai-diagnostic-tool
npm install
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store"
```

### 3.2 Create Lambda Function

1. Go to **Lambda** → **Create function**
2. **Function name:** `montebay-ai-diagnostic-tool`
3. **Runtime:** Node.js 20.x
4. **Architecture:** x86_64
5. **Execution role:** Use existing role → `montebay-lambda-role`
6. Click **Create function**

### 3.3 Upload Code

1. In function page, scroll to **Code source**
2. Click **Upload from** → **.zip file**
3. Upload `function.zip`
4. Click **Save**

### 3.4 Configure

**Configuration** → **General configuration** → **Edit:**
- **Timeout:** 30 seconds
- **Memory:** 512 MB

**Configuration** → **Environment variables** → **Edit:**
```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
OPENAI_API_KEY=sk-... (optional, leave blank if not using AI)
OPENAI_MODEL=gpt-4o-mini
```

### 3.5 Create API Gateway Endpoint

1. Go to **API Gateway** → Your API (or create new REST API)
2. **Resources** → **Actions** → **Create Resource**
3. **Resource Path:** `montebay`
4. Click **Create Resource**
5. Select `/montebay` → **Actions** → **Create Resource**
6. **Resource Path:** `ai-diagnostic`
7. Click **Create Resource**
8. Select `/montebay/ai-diagnostic` → **Actions** → **Create Method** → **POST**
9. **Integration type:** Lambda Function
10. **Lambda Function:** `montebay-ai-diagnostic-tool`
11. Click **Save** → **OK** (for permission)
12. **Actions** → **Enable CORS**
13. **Access-Control-Allow-Origin:** `https://www.montebay.io`
14. Click **Enable CORS and replace existing CORS headers**
15. **Actions** → **Deploy API**
16. **Deployment stage:** `prod` (or create new)
17. Click **Deploy**
18. **Copy the Invoke URL** (e.g., `https://abc123.execute-api.us-east-2.amazonaws.com/prod`)

---

## Step 4: Deploy Lead Magnet Handler

### 4.1 Prepare Package

```bash
cd ../lead-magnet-handler
npm install
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store"
```

### 4.2 Create Lambda Function

1. **Function name:** `montebay-lead-magnet-handler`
2. **Runtime:** Node.js 20.x
3. **Execution role:** `montebay-lambda-role`
4. Follow same steps as Step 3

### 4.3 Configure Environment Variables

```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
AI_CHECKLIST_URL=https://www.montebay.io/assets/pdfs/ai-readiness-checklist.pdf
WORDFLECT_BRIEF_URL=https://www.montebay.io/assets/pdfs/wordflect-brief.pdf
SOTERIA_BRIEF_URL=https://www.montebay.io/assets/pdfs/soteria-brief.pdf
```

### 4.4 Create API Gateway Endpoint

1. In same API Gateway, create resource: `/montebay/lead-magnet`
2. Method: **POST**
3. Integration: `montebay-lead-magnet-handler`
4. Enable CORS
5. Deploy

---

## Step 5: Deploy Newsletter Signup

### 5.1 Prepare Package

```bash
cd ../newsletter-signup
npm install
zip -r function.zip index.js node_modules package.json -x "*.git*" "*.DS_Store"
```

### 5.2 Create Lambda Function

1. **Function name:** `montebay-newsletter-signup`
2. **Runtime:** Node.js 20.x
3. **Execution role:** `montebay-lambda-role`
4. Follow same steps

### 5.3 Configure Environment Variables

```
TO_EMAIL=contact@montebay.io
FROM_EMAIL=contact@montebay.io
AWS_REGION=us-east-2
MAILCHIMP_API_KEY= (optional)
MAILCHIMP_LIST_ID= (optional)
```

### 5.4 Create API Gateway Endpoint

1. Resource: `/montebay/newsletter`
2. Method: **POST**
3. Integration: `montebay-newsletter-signup`
4. Enable CORS
5. Deploy

---

## Step 6: Update Frontend API Endpoints

After deploying, you'll have an API Gateway URL like:
```
https://abc123.execute-api.us-east-2.amazonaws.com/prod
```

Update `script.js` with your actual endpoints:

1. Open `script.js`
2. Find line ~950 (AI Diagnostic Tool)
3. Replace: `https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic`
   With: `https://[YOUR_API_ID].execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic`

4. Find line ~810 (Lead Magnet)
5. Replace with your endpoint

6. Find line ~870 (Newsletter)
7. Replace with your endpoint

---

## Step 7: Test Everything

### Test AI Diagnostic Tool

```bash
curl -X POST https://[YOUR_API]/prod/montebay/ai-diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "primary-challenge": "System complexity",
    "company-size": "11-50 employees"
  }'
```

### Test Lead Magnet

```bash
curl -X POST https://[YOUR_API]/prod/montebay/lead-magnet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "resourceType": "ai-readiness-checklist"
  }'
```

### Test Newsletter

```bash
curl -X POST https://[YOUR_API]/prod/montebay/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

---

## Troubleshooting

**CORS Errors:**
- Verify CORS is enabled in API Gateway
- Check origin matches `https://www.montebay.io`

**SES Not Sending:**
- Verify email in SES
- Check IAM permissions
- Verify not in Sandbox (or verify recipient emails)

**Lambda Timeout:**
- Increase timeout to 30 seconds
- Check CloudWatch logs

**API Gateway 403:**
- Check Lambda permissions
- Verify API Gateway integration

---

## Quick Checklist

- [ ] SES email verified
- [ ] IAM role created with SES permissions
- [ ] All 3 Lambda functions deployed
- [ ] All 3 API Gateway endpoints created
- [ ] CORS enabled on all endpoints
- [ ] Environment variables set
- [ ] Frontend API endpoints updated
- [ ] All functions tested
- [ ] Emails received successfully

---

**Estimated Time:** 1-2 hours for first-time setup

**Need Help?** See `LAMBDA_DEPLOYMENT_GUIDE.md` for detailed instructions.
