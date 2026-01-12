# Deploy Lambda Functions - Step-by-Step Guide

This guide will walk you through deploying all three Lambda functions to AWS and wiring them up.

## Prerequisites

- AWS Account with admin access
- AWS Console access
- Email `contact@montebay.io` ready to verify in SES

---

## Step 1: Verify SES Email (5 minutes)

1. Go to **AWS Console** → **SES** → **Verified identities**
2. Click **Create identity**
3. Select **Email address**
4. Enter: `contact@montebay.io`
5. Click **Create identity**
6. Check your email and click the verification link
7. **Important:** If you're in SES Sandbox, you'll also need to verify recipient emails for testing

---

## Step 2: Create IAM Role (5 minutes)

1. Go to **IAM** → **Roles** → **Create role**
2. Select **AWS service** → **Lambda**
3. Click **Next**
4. Search for and select: `AWSLambdaBasicExecutionRole`
5. Click **Next**
6. Role name: `montebay-lambda-role`
7. Click **Create role**
8. Click on the role name to edit it
9. Click **Add permissions** → **Create inline policy**
10. Click **JSON** tab and paste this:

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

11. Click **Next**
12. Policy name: `SES-SendEmail-Policy`
13. Click **Create policy**

---

## Step 3: Deploy AI Diagnostic Tool (10 minutes)

### 3.1 Create Lambda Function

1. Go to **Lambda** → **Functions** → **Create function**
2. **Function name:** `montebay-ai-diagnostic-tool`
3. **Runtime:** Node.js 20.x
4. **Architecture:** x86_64
5. **Execution role:** Use an existing role → `montebay-lambda-role`
6. Click **Create function**

### 3.2 Upload Code

1. Scroll to **Code source** section
2. Click **Upload from** → **.zip file**
3. Upload: `lambda-functions/ai-diagnostic-tool/function.zip`
4. Click **Save**

### 3.3 Configure Function

1. Go to **Configuration** → **General configuration** → **Edit**
2. **Timeout:** 30 seconds
3. **Memory:** 512 MB
4. Click **Save**

### 3.4 Set Environment Variables

1. Go to **Configuration** → **Environment variables** → **Edit**
2. Add these variables:

```
TO_EMAIL = contact@montebay.io
FROM_EMAIL = contact@montebay.io
AWS_REGION = us-east-2
OPENAI_API_KEY = (your OpenAI API key, optional)
OPENAI_MODEL = gpt-4o-mini
```

3. Click **Save**

### 3.5 Create API Gateway Endpoint

1. Go to **API Gateway** → **APIs** → **Create API** (or use existing)
2. Select **REST API** → **Build**
3. **API name:** `montebay-api` (or use existing)
4. Click **Create API**
5. Click **Actions** → **Create Resource**
6. **Resource Path:** `montebay`
7. Click **Create Resource**
8. Select `/montebay` → **Actions** → **Create Resource**
9. **Resource Path:** `ai-diagnostic`
10. Click **Create Resource**
11. Select `/montebay/ai-diagnostic` → **Actions** → **Create Method** → **POST**
12. **Integration type:** Lambda Function
13. **Lambda Function:** `montebay-ai-diagnostic-tool`
14. Click **Save** → **OK** (for permission)
15. Select **POST** method → **Actions** → **Enable CORS**
16. **Access-Control-Allow-Origin:** `https://www.montebay.io`
17. Click **Enable CORS and replace existing CORS headers**
18. **Actions** → **Deploy API**
19. **Deployment stage:** `prod` (or create new)
20. Click **Deploy**
21. **Copy the Invoke URL** (e.g., `https://abc123.execute-api.us-east-2.amazonaws.com/prod`)

**Save this URL - you'll need it!**

---

## Step 4: Deploy Lead Magnet Handler (10 minutes)

### 4.1 Create Lambda Function

1. **Lambda** → **Create function**
2. **Function name:** `montebay-lead-magnet-handler`
3. **Runtime:** Node.js 20.x
4. **Execution role:** `montebay-lambda-role`
5. Click **Create function**

### 4.2 Upload Code

1. Upload: `lambda-functions/lead-magnet-handler/function.zip`
2. Click **Save**

### 4.3 Configure

1. **Timeout:** 10 seconds
2. **Memory:** 256 MB
3. **Environment variables:**

```
TO_EMAIL = contact@montebay.io
FROM_EMAIL = contact@montebay.io
AWS_REGION = us-east-2
AI_CHECKLIST_URL = https://www.montebay.io/assets/pdfs/ai-readiness-checklist.pdf
WORDFLECT_BRIEF_URL = https://www.montebay.io/assets/pdfs/wordflect-brief.pdf
SOTERIA_BRIEF_URL = https://www.montebay.io/assets/pdfs/soteria-brief.pdf
```

### 4.4 Create API Gateway Endpoint

1. In same API Gateway, create resource: `/montebay/lead-magnet`
2. Method: **POST**
3. Integration: `montebay-lead-magnet-handler`
4. Enable CORS
5. Deploy API

---

## Step 5: Deploy Newsletter Signup (10 minutes)

### 5.1 Create Lambda Function

1. **Function name:** `montebay-newsletter-signup`
2. **Runtime:** Node.js 20.x
3. **Execution role:** `montebay-lambda-role`
4. Click **Create function**

### 5.2 Upload Code

1. Upload: `lambda-functions/newsletter-signup/function.zip`
2. Click **Save**

### 5.3 Configure

1. **Timeout:** 10 seconds
2. **Memory:** 256 MB
3. **Environment variables:**

```
TO_EMAIL = contact@montebay.io
FROM_EMAIL = contact@montebay.io
AWS_REGION = us-east-2
MAILCHIMP_API_KEY = (optional)
MAILCHIMP_LIST_ID = (optional)
```

### 5.4 Create API Gateway Endpoint

1. Resource: `/montebay/newsletter`
2. Method: **POST**
3. Integration: `montebay-newsletter-signup`
4. Enable CORS
5. Deploy API

---

## Step 6: Update Frontend (5 minutes)

After deployment, you'll have an API Gateway URL like:
```
https://abc123.execute-api.us-east-2.amazonaws.com/prod
```

### Update script.js

1. Open `script.js`
2. Find line ~810 (Lead Magnet) and replace:
   ```javascript
   const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet';
   ```
   With your actual URL:
   ```javascript
   const API_ENDPOINT = 'https://[YOUR_API_ID].execute-api.[REGION].amazonaws.com/prod/montebay/lead-magnet';
   ```

3. Find line ~870 (Newsletter) and replace:
   ```javascript
   const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter';
   ```

4. Find line ~1005 (AI Diagnostic) and replace:
   ```javascript
   const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic';
   ```

5. Save and commit:
   ```bash
   git add script.js
   git commit -m "Update API Gateway endpoints"
   git push origin main
   ```

---

## Step 7: Test Everything (10 minutes)

### Test from Command Line

Use the verification script:
```bash
cd lambda-functions
./verify-deployment.sh https://[YOUR_API_ID].execute-api.[REGION].amazonaws.com/prod
```

### Test from Website

1. Visit your live site
2. Test AI Diagnostic Tool: Fill out the form and submit
3. Test Lead Magnet: Request AI Readiness Checklist
4. Test Newsletter: Sign up for newsletter
5. Check emails are received

---

## Troubleshooting

### CORS Errors
- Verify CORS is enabled in API Gateway
- Check origin matches `https://www.montebay.io`
- Verify CORS headers in Lambda response

### SES Not Sending
- Verify email in SES
- Check IAM role has SES permissions
- If in Sandbox, verify recipient emails

### Lambda Timeout
- Increase timeout in Lambda configuration
- Check CloudWatch logs for errors

### API Gateway 403
- Check Lambda permissions
- Verify API Gateway integration
- Check CORS configuration

---

## Quick Checklist

- [ ] SES email verified
- [ ] IAM role created with SES permissions
- [ ] AI Diagnostic Tool deployed
- [ ] Lead Magnet Handler deployed
- [ ] Newsletter Signup deployed
- [ ] All API Gateway endpoints created
- [ ] CORS enabled on all endpoints
- [ ] Environment variables set
- [ ] Frontend script.js updated
- [ ] All functions tested
- [ ] Emails received successfully

---

**Estimated Total Time:** 1-1.5 hours

**Need Help?** Check CloudWatch logs for each Lambda function if something isn't working.
