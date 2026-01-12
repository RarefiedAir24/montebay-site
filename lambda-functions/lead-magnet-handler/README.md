# Lead Magnet Handler Lambda Function

This Lambda function handles lead magnet form submissions (AI Readiness Checklist, Product Briefs) and sends download links via email.

## Features

- Handles multiple resource types (AI Checklist, Wordflect Brief, Soteria Brief)
- Email delivery with download links
- Notification emails to Montebay team
- CORS support for web frontend

## Deployment

1. **Install dependencies:**
```bash
cd lambda-functions/lead-magnet-handler
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Create/Update Lambda function in AWS:**
   - Function name: `montebay-lead-magnet-handler`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Environment variables:
     - `TO_EMAIL`: contact@montebay.io
     - `FROM_EMAIL`: contact@montebay.io (must be verified in SES)
     - `AWS_REGION`: us-east-2
     - `AI_CHECKLIST_URL`: URL to AI Readiness Checklist PDF (optional)
     - `WORDFLECT_BRIEF_URL`: URL to Wordflect brief PDF (optional)
     - `SOTERIA_BRIEF_URL`: URL to Soteria brief PDF (optional)

4. **Configure API Gateway:**
   - Create resource: `/montebay/lead-magnet`
   - Method: POST
   - Integration: Lambda Function
   - Enable CORS
   - Add CORS headers to Gateway Responses

5. **Set Lambda permissions:**
   - Allow API Gateway to invoke
   - Allow SES to send emails
   - IAM role needs: `ses:SendEmail`, `ses:SendRawEmail`

6. **Update frontend:**
   - Update `ai-intelligent-systems.html` script.js
   - Replace API endpoint: `https://[YOUR_API_GATEWAY]/prod/montebay/lead-magnet`

## Environment Variables

- `TO_EMAIL`: Email to receive notifications (default: contact@montebay.io)
- `FROM_EMAIL`: Email to send from (must be verified in SES)
- `AWS_REGION`: AWS region for SES (default: us-east-2)
- `AI_CHECKLIST_URL`: Direct URL to AI Readiness Checklist PDF
- `WORDFLECT_BRIEF_URL`: Direct URL to Wordflect brief PDF
- `SOTERIA_BRIEF_URL`: Direct URL to Soteria brief PDF

## Resource Types

The function supports these resource types:
- `ai-readiness-checklist` - AI Readiness Checklist PDF
- `wordflect-brief` - Wordflect Product Brief PDF
- `soteria-brief` - Soteria Product Brief PDF

## PDF Storage Options

**Option 1: S3 Bucket (Recommended)**
1. Upload PDFs to S3 bucket
2. Make bucket public or use signed URLs
3. Set environment variables to S3 URLs

**Option 2: Direct Links**
1. Host PDFs on your website
2. Set environment variables to website URLs

**Option 3: Attach PDFs to Email**
- Modify function to attach PDFs from S3
- Requires S3 read permissions

## Frontend Integration

The frontend should send:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "resourceType": "ai-readiness-checklist"
}
```

## Testing

Test locally with:
```bash
node -e "require('./index.js').handler({body: JSON.stringify({name: 'Test', email: 'test@example.com', resourceType: 'ai-readiness-checklist'})}, {}, console.log)"
```
