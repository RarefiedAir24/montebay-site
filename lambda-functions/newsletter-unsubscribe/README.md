# Newsletter Unsubscribe Lambda Function

This Lambda function handles newsletter unsubscribe requests and stores unsubscribed emails in DynamoDB.

## Features

- Token-based unsubscribe links (secure, one-click)
- Email-based unsubscribe (fallback)
- DynamoDB storage for unsubscribed emails
- Confirmation email to user
- Notification email to Montebay team
- CORS support for web frontend
- Prevents duplicate unsubscribes

## Prerequisites

1. **DynamoDB Table:** Create a table named `montebay-unsubscribes`
   - Partition key: `email` (String)
   - No sort key needed
   - Enable point-in-time recovery (optional but recommended)

2. **IAM Permissions:** Lambda role needs:
   - `dynamodb:PutItem`
   - `dynamodb:GetItem`
   - `ses:SendEmail`
   - `ses:SendRawEmail`

## Deployment

1. **Install dependencies:**
```bash
cd lambda-functions/newsletter-unsubscribe
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Create/Update Lambda function in AWS:**
   - Function name: `montebay-newsletter-unsubscribe`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Timeout: 10 seconds
   - Memory: 256 MB
   - Environment variables:
     - `UNSUBSCRIBE_TABLE`: montebay-unsubscribes
     - `FROM_EMAIL`: contact@montebay.io (must be verified in SES)
     - `TO_EMAIL`: contact@montebay.io
     - `AWS_REGION`: us-east-2
     - `UNSUBSCRIBE_SECRET`: [Generate a secure random string for token signing]

4. **Configure API Gateway:**
   - Create resource: `/montebay/unsubscribe`
   - Methods: GET, POST, OPTIONS
   - Integration: Lambda Function
   - Enable CORS
   - Add CORS headers to Gateway Responses

5. **Set Lambda permissions:**
   - Allow API Gateway to invoke
   - Allow DynamoDB access (PutItem, GetItem)
   - Allow SES to send emails
   - IAM role needs: `dynamodb:PutItem`, `dynamodb:GetItem`, `ses:SendEmail`, `ses:SendRawEmail`

## DynamoDB Table Setup

```bash
aws dynamodb create-table \
  --table-name montebay-unsubscribes \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-2
```

## Environment Variables

- `UNSUBSCRIBE_TABLE`: DynamoDB table name (default: montebay-unsubscribes)
- `FROM_EMAIL`: Email to send from (must be verified in SES)
- `TO_EMAIL`: Email to receive notifications (default: contact@montebay.io)
- `AWS_REGION`: AWS region (default: us-east-2)
- `UNSUBSCRIBE_SECRET`: Secret key for token generation (CHANGE THIS IN PRODUCTION!)

## Usage

### Token-based unsubscribe (recommended)
```
GET https://[API_GATEWAY]/prod/montebay/unsubscribe?token=[TOKEN]
```

### Email-based unsubscribe (fallback)
```
GET https://[API_GATEWAY]/prod/montebay/unsubscribe?email=user@example.com
POST https://[API_GATEWAY]/prod/montebay/unsubscribe
Body: { "email": "user@example.com" }
```

## Token Generation

Tokens are generated in the newsletter-signup Lambda using:
```javascript
const crypto = require('crypto');
const SECRET_KEY = process.env.UNSUBSCRIBE_SECRET;

function generateToken(email) {
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(email.toLowerCase()).digest('hex');
    return Buffer.from(`${email}:${hash}`).toString('base64url');
}
```

**Important:** Use the same `UNSUBSCRIBE_SECRET` in both newsletter-signup and newsletter-unsubscribe Lambda functions!

## Frontend Integration

The unsubscribe page (`unsubscribe.html`) should:
1. Extract token from URL query parameter
2. Call the unsubscribe API
3. Display success/error message

## Testing

Test locally with:
```bash
node -e "require('./index.js').handler({httpMethod: 'GET', queryStringParameters: {email: 'test@example.com'}}, {}, console.log)"
```

## Security Notes

- Tokens are HMAC-signed with a secret key
- Tokens include email, so they're email-specific
- Always use HTTPS in production
- Rotate `UNSUBSCRIBE_SECRET` periodically
- Consider adding rate limiting to prevent abuse
