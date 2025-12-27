# Strategic Cyber Risk Advisory Form Lambda Function

This Lambda function handles form submissions for the Strategic Cyber Risk Advisory service.

## Deployment

1. Install dependencies:
```bash
npm install
```

2. Create a deployment package:
```bash
zip -r function.zip index.js node_modules package.json
```

3. Create/Update the Lambda function in AWS:
   - Function name: `montebay-cyber-risk-advisory-form`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Environment variables:
     - `TO_EMAIL`: contact@montebay.io
     - `FROM_EMAIL`: contact@montebay.io
     - `AWS_REGION`: us-east-2

4. Configure API Gateway:
   - Create a new resource: `/montebay/strategic-cyber-risk-advisory`
   - Method: POST
   - Integration: Lambda Function
   - Enable CORS for the endpoint
   - Add CORS headers to Gateway Responses (4XX, 5XX)

5. Set Lambda permissions:
   - Allow API Gateway to invoke the function
   - Allow SES to send emails (if using IAM role)

## Environment Variables

- `TO_EMAIL`: Email address to receive form submissions
- `FROM_EMAIL`: Email address to send from (must be verified in SES)
- `AWS_REGION`: AWS region for SES (default: us-east-2)

## CORS Configuration

The function returns CORS headers to allow requests from `https://www.montebay.io`.

