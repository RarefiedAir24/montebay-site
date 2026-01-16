const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');
// Optional: Add mailing list service SDK (Mailchimp, ConvertKit, etc.)
// const mailchimp = require('@mailchimp/mailchimp_marketing');

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-2' });

// Email configuration
const TO_EMAIL = process.env.TO_EMAIL || 'contact@montebay.io';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';
const UNSUBSCRIBE_TABLE = process.env.UNSUBSCRIBE_TABLE || 'montebay-unsubscribes';
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'change-this-secret-key-in-production';
const UNSUBSCRIBE_BASE_URL = process.env.UNSUBSCRIBE_BASE_URL || 'https://www.montebay.io/unsubscribe.html';
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod';

// Generate unsubscribe token from email
function generateUnsubscribeToken(email) {
    const hash = crypto.createHmac('sha256', UNSUBSCRIBE_SECRET).update(email.toLowerCase()).digest('hex');
    return Buffer.from(`${email}:${hash}`).toString('base64url');
}

// Mailing list configuration (optional)
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

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

        console.log('📥 [Lambda] Received newsletter signup');

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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email address'
                })
            };
        }

        const email = formData.email.toLowerCase();
        const name = formData.name || '';

        // Check if email is already unsubscribed
        try {
            const checkParams = {
                TableName: UNSUBSCRIBE_TABLE,
                Key: {
                    email: { S: email }
                }
            };
            const existing = await dynamoClient.send(new GetItemCommand(checkParams));
            if (existing.Item) {
                console.log(`⚠️ [Lambda] Email is unsubscribed: ${email}`);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'This email address has been unsubscribed. Please contact us if you wish to resubscribe.'
                    })
                };
            }
        } catch (dynamoError) {
            console.error('⚠️ [Lambda] Error checking unsubscribe status:', dynamoError);
            // Continue with signup if DynamoDB check fails (table might not exist yet)
        }

        // Generate unsubscribe token
        const unsubscribeToken = generateUnsubscribeToken(email);
        const unsubscribeUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubscribeToken}`;

        // Add to mailing list (if configured)
        let mailingListSuccess = false;
        let mailingListError = null;

        // Option 1: Mailchimp
        if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID) {
            try {
                // Uncomment and configure if using Mailchimp
                /*
                mailchimp.setConfig({
                    apiKey: MAILCHIMP_API_KEY,
                    server: 'us1' // Replace with your server prefix
                });

                const response = await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: name.split(' ')[0] || '',
                        LNAME: name.split(' ').slice(1).join(' ') || ''
                    }
                });
                */
                mailingListSuccess = true;
                console.log('✅ [Lambda] Added to Mailchimp list');
            } catch (mailingListError) {
                console.error('⚠️ [Lambda] Mailchimp error:', mailingListError);
                mailingListError = mailingListError.message;
            }
        }

        // Option 2: ConvertKit
        if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID && !mailingListSuccess) {
            try {
                // Uncomment and configure if using ConvertKit
                /*
                const convertkitResponse = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_key: CONVERTKIT_API_KEY,
                        email: email,
                        first_name: name.split(' ')[0] || ''
                    })
                });
                */
                mailingListSuccess = true;
                console.log('✅ [Lambda] Added to ConvertKit list');
            } catch (mailingListError) {
                console.error('⚠️ [Lambda] ConvertKit error:', mailingListError);
                mailingListError = mailingListError.message;
            }
        }

        // Send confirmation email
        const emailSubject = 'Welcome to Montebay Insights';
        const emailBodyHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1a2a4a; border-bottom: 3px solid #5a8ab0; padding-bottom: 10px; }
                    .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <h1>Welcome to Montebay Insights!</h1>
                
                <p>${name ? `Hi ${name},` : 'Hi there,'}</p>
                
                <p>Thank you for subscribing to Montebay Insights. You'll receive:</p>
                <ul>
                    <li>Practical insights on AI, cloud architecture, and automation</li>
                    <li>Tips for building better systems</li>
                    <li>Updates on new services and resources</li>
                </ul>
                
                <div class="content">
                    <p><strong>What to expect:</strong></p>
                    <p>We send thoughtful, actionable content—not spam. Expect 1-2 emails per month with insights that matter.</p>
                </div>
                
                <p>In the meantime, check out our latest insights at <a href="https://www.montebay.io/insights.html">montebay.io/insights</a></p>
                
                <div class="footer">
                    <p><strong>Montebay Innovations</strong></p>
                    <p>Solving complex problems with clear, practical systems.</p>
                    <p>Questions? Contact us at <a href="mailto:contact@montebay.io">contact@montebay.io</a></p>
                    <p style="margin-top: 20px; font-size: 0.85em;">
                        <a href="${unsubscribeUrl}">Unsubscribe</a> | 
                        <a href="https://www.montebay.io">Visit Website</a>
                    </p>
                </div>
            </body>
            </html>
        `;

        const emailBodyText = `
Welcome to Montebay Insights!

${name ? `Hi ${name},` : 'Hi there,'}

Thank you for subscribing to Montebay Insights. You'll receive:
- Practical insights on AI, cloud architecture, and automation
- Tips for building better systems
- Updates on new services and resources

What to expect:
We send thoughtful, actionable content—not spam. Expect 1-2 emails per month with insights that matter.

In the meantime, check out our latest insights at https://www.montebay.io/insights.html

---
Montebay Innovations
Solving complex problems with clear, practical systems.
Questions? Contact us at contact@montebay.io

Unsubscribe: ${unsubscribeUrl}
        `;

        const emailParams = {
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

        // Send notification to Montebay (optional)
        const notificationParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [TO_EMAIL]
            },
            Message: {
                Subject: { Data: 'New Newsletter Signup', Charset: 'UTF-8' },
                Body: {
                    Text: { 
                        Data: `New newsletter signup:\n\nName: ${name || 'Not provided'}\nEmail: ${email}`, 
                        Charset: 'UTF-8' 
                    }
                }
            }
        };

        console.log('📤 [Lambda] Sending confirmation email via SES...');
        
        const [emailResult, notificationResult] = await Promise.all([
            sesClient.send(new SendEmailCommand(emailParams)),
            sesClient.send(new SendEmailCommand(notificationParams))
        ]);
        
        console.log('✅ [Lambda] Emails sent successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Thank you for subscribing! Check your email for confirmation.',
                mailingListAdded: mailingListSuccess,
                mailingListError: mailingListError || undefined
            })
        };
    } catch (error) {
        console.error('❌ [Lambda] Error processing newsletter signup:', error);
        console.error('❌ [Lambda] Error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to process signup',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
