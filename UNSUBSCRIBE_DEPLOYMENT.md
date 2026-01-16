# Newsletter Unsubscribe System - Deployment Guide

## Overview

The unsubscribe system is now fully implemented and ready for deployment. It includes:

1. **Unsubscribe Lambda Function** - Handles unsubscribe requests and stores them in DynamoDB
2. **Unsubscribe HTML Page** - User-facing page for unsubscribing
3. **Updated Newsletter Signup Lambda** - Generates unsubscribe tokens and includes them in welcome emails

## Prerequisites

1. AWS Account with appropriate permissions
2. DynamoDB table for storing unsubscribed emails
3. API Gateway endpoint for the unsubscribe Lambda
4. Same `UNSUBSCRIBE_SECRET` environment variable in both Lambda functions

## Step 1: Create DynamoDB Table

Create a DynamoDB table to store unsubscribed emails:

```bash
aws dynamodb create-table \
  --table-name montebay-unsubscribes \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-2
```

Or via AWS Console:
1. Go to DynamoDB → Tables → Create table
2. Table name: `montebay-unsubscribes`
3. Partition key: `email` (String)
4. Settings: Use default settings or configure as needed
5. Create table

## Step 2: Generate Secret Key

Generate a secure random string for token signing (use the same value in both Lambda functions):

```bash
# Generate a secure random string
openssl rand -base64 32
```

Save this value - you'll need it for both Lambda functions.

## Step 3: Deploy Unsubscribe Lambda Function

1. **Install dependencies:**
```bash
cd lambda-functions/newsletter-unsubscribe
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Create Lambda function in AWS:**
   - Function name: `montebay-newsletter-unsubscribe`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Timeout: 10 seconds
   - Memory: 256 MB
   - Architecture: x86_64

4. **Set IAM Role:**
   - Use existing `montebay-lambda-role` or create new role
   - Add DynamoDB permissions:
     ```json
     {
       "Effect": "Allow",
       "Action": [
         "dynamodb:PutItem",
         "dynamodb:GetItem"
       ],
       "Resource": "arn:aws:dynamodb:us-east-2:*:table/montebay-unsubscribes"
     }
     ```

5. **Set Environment Variables:**
   - `UNSUBSCRIBE_TABLE`: montebay-unsubscribes
   - `FROM_EMAIL`: contact@montebay.io
   - `TO_EMAIL`: contact@montebay.io
   - `AWS_REGION`: us-east-2
   - `UNSUBSCRIBE_SECRET`: [Your generated secret key from Step 2]

6. **Upload deployment package:**
   - Upload `function.zip` to the Lambda function

7. **Configure API Gateway:**
   - Go to API Gateway → Your API → Resources
   - Create resource: `/montebay/unsubscribe`
   - Methods: GET, POST, OPTIONS
   - Integration: Lambda Function (`montebay-newsletter-unsubscribe`)
   - Enable CORS
   - Deploy API

## Step 4: Update Newsletter Signup Lambda

1. **Install dependencies:**
```bash
cd lambda-functions/newsletter-signup
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Update Lambda function:**
   - Go to Lambda → `montebay-newsletter-signup`
   - Upload new `function.zip`

4. **Add Environment Variables:**
   - `UNSUBSCRIBE_TABLE`: montebay-unsubscribes
   - `UNSUBSCRIBE_SECRET`: [Same secret key from Step 2]
   - `UNSUBSCRIBE_BASE_URL`: https://www.montebay.io/unsubscribe.html
   - `API_GATEWAY_URL`: https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod

5. **Update IAM Role:**
   - Add DynamoDB permissions (same as unsubscribe Lambda):
     ```json
     {
       "Effect": "Allow",
       "Action": [
         "dynamodb:GetItem"
       ],
       "Resource": "arn:aws:dynamodb:us-east-2:*:table/montebay-unsubscribes"
     }
     ```

## Step 5: Deploy Frontend

The `unsubscribe.html` page is already created and ready. Just ensure it's deployed to your website.

The page will:
- Automatically process unsubscribe if token/email is in URL
- Show manual form if no token/email provided
- Call the unsubscribe API endpoint

## Step 6: Test

1. **Test token generation:**
   - Subscribe to newsletter
   - Check welcome email for unsubscribe link
   - Verify link includes token parameter

2. **Test unsubscribe via token:**
   - Click unsubscribe link in email
   - Should redirect to unsubscribe.html with token
   - Should show success message
   - Check DynamoDB table for entry

3. **Test manual unsubscribe:**
   - Go to unsubscribe.html without token
   - Enter email address
   - Submit form
   - Should show success message

4. **Test duplicate unsubscribe:**
   - Try to unsubscribe same email again
   - Should show "already unsubscribed" message

5. **Test resubscribe prevention:**
   - Try to subscribe with unsubscribed email
   - Should be blocked with appropriate message

## API Endpoints

### Unsubscribe Endpoint
```
GET https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/unsubscribe?token=[TOKEN]
GET https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/unsubscribe?email=[EMAIL]
POST https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/unsubscribe
Body: { "email": "user@example.com" }
```

## Security Notes

- Tokens are HMAC-signed with secret key
- Tokens are email-specific (can't be reused for other emails)
- Always use HTTPS in production
- Rotate `UNSUBSCRIBE_SECRET` periodically
- Consider adding rate limiting to prevent abuse

## Troubleshooting

### "Invalid or missing email/token" error
- Check that token is properly URL-encoded
- Verify `UNSUBSCRIBE_SECRET` matches in both Lambda functions
- Check token format in email links

### DynamoDB errors
- Verify table exists and is named correctly
- Check IAM role has DynamoDB permissions
- Verify region matches (us-east-2)

### Email not sending
- Check SES configuration
- Verify FROM_EMAIL is verified in SES
- Check Lambda logs for SES errors

## Files Created/Modified

### New Files:
- `lambda-functions/newsletter-unsubscribe/index.js`
- `lambda-functions/newsletter-unsubscribe/package.json`
- `lambda-functions/newsletter-unsubscribe/README.md`
- `unsubscribe.html`

### Modified Files:
- `lambda-functions/newsletter-signup/index.js` (added token generation and DynamoDB check)
- `lambda-functions/newsletter-signup/package.json` (added DynamoDB dependency)
- `styles.css` (added `.form-message.info` style)

## Next Steps

1. Deploy DynamoDB table
2. Deploy unsubscribe Lambda function
3. Update newsletter signup Lambda function
4. Test end-to-end flow
5. Monitor DynamoDB table for unsubscribes
