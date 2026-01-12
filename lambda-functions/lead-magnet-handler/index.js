const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

// Email configuration
const TO_EMAIL = process.env.TO_EMAIL || 'contact@montebay.io';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';

// Resource URLs (can be S3 URLs or direct links)
const RESOURCES = {
    'ai-readiness-checklist': {
        name: 'AI Readiness Checklist',
        url: process.env.AI_CHECKLIST_URL || 'https://www.montebay.io/assets/pdfs/ai-readiness-checklist.pdf',
        description: 'A comprehensive checklist to assess your organization\'s readiness for AI adoption.'
    },
    'wordflect-brief': {
        name: 'Wordflect Product Brief',
        url: process.env.WORDFLECT_BRIEF_URL || 'https://www.montebay.io/assets/pdfs/wordflect-brief.pdf',
        description: 'Learn more about Wordflect, our minimalist word puzzle game.'
    },
    'soteria-brief': {
        name: 'Soteria Product Brief',
        url: process.env.SOTERIA_BRIEF_URL || 'https://www.montebay.io/assets/pdfs/soteria-brief.pdf',
        description: 'Learn more about Soteria, our behavioral finance app.'
    }
};

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': 'https://www.montebay.io',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        let formData;
        if (typeof event.body === 'string') {
            formData = JSON.parse(event.body);
        } else {
            formData = event.body;
        }

        console.log('📥 [Lambda] Received lead magnet request:', formData.resourceType);

        // Validate required fields
        if (!formData.email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Email is required'
                })
            };
        }

        if (!formData.resourceType || !RESOURCES[formData.resourceType]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid resource type'
                })
            };
        }

        const resource = RESOURCES[formData.resourceType];
        const name = formData.name || 'Valued Visitor';
        const email = formData.email;
        const company = formData.company || 'Not provided';

        // Format email subject
        const emailSubject = `Your ${resource.name} from Montebay Innovations`;

        // Format email body (HTML)
        const emailBodyHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1a2a4a; border-bottom: 3px solid #5a8ab0; padding-bottom: 10px; }
                    .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .cta-button { display: inline-block; background: #5a8ab0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <h1>Thank You, ${name}!</h1>
                
                <p>We're excited to share the <strong>${resource.name}</strong> with you.</p>
                
                <div class="content">
                    <p><strong>${resource.name}</strong></p>
                    <p>${resource.description}</p>
                    <a href="${resource.url}" class="cta-button">Download ${resource.name}</a>
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #5a8ab0;">${resource.url}</p>
                
                <div class="footer">
                    <p><strong>Montebay Innovations</strong></p>
                    <p>Solving complex problems with clear, practical systems.</p>
                    <p>Questions? Contact us at <a href="mailto:contact@montebay.io">contact@montebay.io</a></p>
                </div>
            </body>
            </html>
        `;

        // Format email body (plain text)
        const emailBodyText = `
Thank You, ${name}!

We're excited to share the ${resource.name} with you.

${resource.name}
${resource.description}

Download here: ${resource.url}

If the link doesn't work, copy and paste it into your browser.

---
Montebay Innovations
Solving complex problems with clear, practical systems.
Questions? Contact us at contact@montebay.io
        `;

        // Send email to requester
        const userEmailParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: { Data: emailSubject, Charset: 'UTF-8' },
                Body: {
                    Text: { Data: emailBodyText, Charset: 'UTF-8' },
                    Html: { Data: emailBodyHTML, Charset: 'UTF-8' }
                }
            }
        };

        // Notification email to Montebay
        const notificationEmailParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [TO_EMAIL]
            },
            Message: {
                Subject: { Data: `Lead Magnet Request: ${resource.name}`, Charset: 'UTF-8' },
                Body: {
                    Text: { 
                        Data: `New lead magnet request:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nResource: ${resource.name}`, 
                        Charset: 'UTF-8' 
                    }
                }
            }
        };

        console.log('📤 [Lambda] Sending lead magnet emails via SES...');
        
        // Send both emails
        const [userResult, notificationResult] = await Promise.all([
            sesClient.send(new SendEmailCommand(userEmailParams)),
            sesClient.send(new SendEmailCommand(notificationEmailParams))
        ]);
        
        console.log('✅ [Lambda] Emails sent successfully');
        console.log('   User email:', userResult.MessageId);
        console.log('   Notification email:', notificationResult.MessageId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Your ${resource.name} has been sent to ${email}. Please check your inbox.`,
                resourceUrl: resource.url // Optional: return URL for direct download
            })
        };
    } catch (error) {
        console.error('❌ [Lambda] Error processing lead magnet request:', error);
        console.error('❌ [Lambda] Error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to process request',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
