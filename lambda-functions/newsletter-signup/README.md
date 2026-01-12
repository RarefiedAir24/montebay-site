# Newsletter Signup Lambda Function

This Lambda function handles newsletter signup form submissions and integrates with mailing list services.

## Features

- Email validation
- Mailing list integration (Mailchimp, ConvertKit, or custom)
- Confirmation email to subscriber
- Notification email to Montebay team
- CORS support for web frontend

## Deployment

1. **Install dependencies:**
```bash
cd lambda-functions/newsletter-signup
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Create/Update Lambda function in AWS:**
   - Function name: `montebay-newsletter-signup`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Environment variables:
     - `TO_EMAIL`: contact@montebay.io
     - `FROM_EMAIL`: contact@montebay.io (must be verified in SES)
     - `AWS_REGION`: us-east-2
     - `MAILCHIMP_API_KEY`: Your Mailchimp API key (optional)
     - `MAILCHIMP_LIST_ID`: Your Mailchimp list ID (optional)
     - `CONVERTKIT_API_KEY`: Your ConvertKit API key (optional)
     - `CONVERTKIT_FORM_ID`: Your ConvertKit form ID (optional)

4. **Configure API Gateway:**
   - Create resource: `/montebay/newsletter`
   - Method: POST
   - Integration: Lambda Function
   - Enable CORS
   - Add CORS headers to Gateway Responses

5. **Set Lambda permissions:**
   - Allow API Gateway to invoke
   - Allow SES to send emails
   - IAM role needs: `ses:SendEmail`, `ses:SendRawEmail`

6. **Update frontend:**
   - Update `insights.html` script.js
   - Replace API endpoint: `https://[YOUR_API_GATEWAY]/prod/montebay/newsletter`

## Mailing List Integration

### Option 1: Mailchimp

1. Get API key from Mailchimp dashboard
2. Get List ID from your Mailchimp list settings
3. Set environment variables:
   - `MAILCHIMP_API_KEY`: Your API key
   - `MAILCHIMP_LIST_ID`: Your list ID
4. Uncomment Mailchimp code in `index.js`
5. Install Mailchimp SDK: `npm install @mailchimp/mailchimp_marketing`

### Option 2: ConvertKit

1. Get API key from ConvertKit settings
2. Get Form ID from your ConvertKit form
3. Set environment variables:
   - `CONVERTKIT_API_KEY`: Your API key
   - `CONVERTKIT_FORM_ID`: Your form ID
4. Uncomment ConvertKit code in `index.js`

### Option 3: Custom Integration

Modify the function to integrate with your preferred mailing list service.

## Environment Variables

- `TO_EMAIL`: Email to receive notifications (default: contact@montebay.io)
- `FROM_EMAIL`: Email to send from (must be verified in SES)
- `AWS_REGION`: AWS region for SES (default: us-east-2)
- `MAILCHIMP_API_KEY`: Mailchimp API key (optional)
- `MAILCHIMP_LIST_ID`: Mailchimp list ID (optional)
- `CONVERTKIT_API_KEY`: ConvertKit API key (optional)
- `CONVERTKIT_FORM_ID`: ConvertKit form ID (optional)

## Frontend Integration

The frontend should send:
```json
{
  "email": "user@example.com",
  "name": "John Doe" // optional
}
```

## Testing

Test locally with:
```bash
node -e "require('./index.js').handler({body: JSON.stringify({email: 'test@example.com', name: 'Test User'})}, {}, console.log)"
```

## Unsubscribe Handling

For compliance, implement unsubscribe functionality:
1. Add unsubscribe link to emails
2. Create unsubscribe endpoint
3. Update mailing list when users unsubscribe
