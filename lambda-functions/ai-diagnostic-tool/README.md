# AI Diagnostic Tool Lambda Function

This Lambda function handles AI System Diagnostic Tool form submissions and generates personalized reports using LLM (OpenAI or Anthropic).

## Features

- Multi-step form data processing
- AI-powered report generation using OpenAI GPT models
- Fallback to template reports if AI is unavailable
- Email delivery of diagnostic reports
- CORS support for web frontend

## Deployment

1. **Install dependencies:**
```bash
cd lambda-functions/ai-diagnostic-tool
npm install
```

2. **Create deployment package:**
```bash
zip -r function.zip index.js node_modules package.json
```

3. **Create/Update Lambda function in AWS:**
   - Function name: `montebay-ai-diagnostic-tool`
   - Runtime: Node.js 20.x
   - Handler: `index.handler`
   - Timeout: 30 seconds (for LLM API calls)
   - Memory: 512 MB
   - Environment variables:
     - `TO_EMAIL`: contact@montebay.io
     - `FROM_EMAIL`: contact@montebay.io (must be verified in SES)
     - `AWS_REGION`: us-east-2
     - `OPENAI_API_KEY`: Your OpenAI API key (optional - will use template if not set)
     - `OPENAI_MODEL`: gpt-4o-mini (default, cost-efficient)

4. **Configure API Gateway:**
   - Create resource: `/montebay/ai-diagnostic`
   - Method: POST
   - Integration: Lambda Function
   - Enable CORS
   - Add CORS headers to Gateway Responses

5. **Set Lambda permissions:**
   - Allow API Gateway to invoke
   - Allow SES to send emails
   - IAM role needs: `ses:SendEmail`, `ses:SendRawEmail`

6. **Update frontend:**
   - Update `ai-diagnostic.html` script.js
   - Replace API endpoint: `https://[YOUR_API_GATEWAY]/prod/montebay/ai-diagnostic`

## Environment Variables

- `TO_EMAIL`: Email to receive diagnostic submissions (default: contact@montebay.io)
- `FROM_EMAIL`: Email to send from (must be verified in SES)
- `AWS_REGION`: AWS region for SES (default: us-east-2)
- `OPENAI_API_KEY`: OpenAI API key (optional - if not set, uses template reports)
- `OPENAI_MODEL`: Model to use (default: gpt-4o-mini for cost efficiency)

## Cost Considerations

- **With OpenAI**: ~$0.01-0.02 per report (using gpt-4o-mini)
- **Without OpenAI**: Free (uses template reports)
- **SES**: Free tier includes 62,000 emails/month

## Alternative: Use Anthropic Claude

To use Anthropic instead of OpenAI:

1. Install Anthropic SDK:
```bash
npm install @anthropic-ai/sdk
```

2. Update `index.js`:
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

3. Replace OpenAI call with Anthropic:
```javascript
const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307', // Cost-efficient model
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
});
```

## Testing

Test locally with:
```bash
node -e "require('./index.js').handler({body: JSON.stringify({name: 'Test', email: 'test@example.com', 'primary-challenge': 'System complexity', 'company-size': '11-50 employees'})}, {}, console.log)"
```

## Monitoring

- Check CloudWatch logs for errors
- Monitor OpenAI API usage in OpenAI dashboard
- Track email delivery in SES console
