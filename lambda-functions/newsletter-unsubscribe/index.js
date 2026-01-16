const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const crypto = require('crypto');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-2' });
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

// Configuration
const UNSUBSCRIBE_TABLE = process.env.UNSUBSCRIBE_TABLE || 'montebay-unsubscribes';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';
const TO_EMAIL = process.env.TO_EMAIL || 'contact@montebay.io';
const SECRET_KEY = process.env.UNSUBSCRIBE_SECRET || 'change-this-secret-key-in-production';

// Generate unsubscribe token from email
function generateToken(email) {
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(email.toLowerCase()).digest('hex');
    return Buffer.from(`${email}:${hash}`).toString('base64url');
}

// Decode and validate token
function validateToken(token) {
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf-8');
        const [email, hash] = decoded.split(':');
        if (!email || !hash) return null;
        
        const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(email.toLowerCase()).digest('hex');
        if (hash === expectedHash) {
            return email.toLowerCase();
        }
        return null;
    } catch (error) {
        console.error('Token validation error:', error);
        return null;
    }
}

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': 'https://www.montebay.io',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        // Parse request - can come from query string (GET) or body (POST)
        let email = null;
        let token = null;

        if (event.httpMethod === 'GET') {
            // GET request - token from query string
            token = event.queryStringParameters?.token || event.queryStringParameters?.t;
            if (token) {
                email = validateToken(token);
            } else {
                email = event.queryStringParameters?.email;
            }
        } else {
            // POST request - from body
            let body;
            if (typeof event.body === 'string') {
                body = JSON.parse(event.body);
            } else {
                body = event.body;
            }
            
            token = body.token || body.t;
            if (token) {
                email = validateToken(token);
            } else {
                email = body.email?.toLowerCase();
            }
        }

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid or missing email/token'
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email address'
                })
            };
        }

        console.log(`📥 [Lambda] Processing unsubscribe for: ${email}`);

        // Check if already unsubscribed
        const checkParams = {
            TableName: UNSUBSCRIBE_TABLE,
            Key: {
                email: { S: email }
            }
        };

        const existing = await dynamoClient.send(new GetItemCommand(checkParams));
        
        if (existing.Item) {
            console.log(`ℹ️ [Lambda] Email already unsubscribed: ${email}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'You have already been unsubscribed.',
                    alreadyUnsubscribed: true
                })
            };
        }

        // Add to unsubscribe table
        const putParams = {
            TableName: UNSUBSCRIBE_TABLE,
            Item: {
                email: { S: email },
                unsubscribedAt: { S: new Date().toISOString() },
                timestamp: { N: Date.now().toString() }
            }
        };

        await dynamoClient.send(new PutItemCommand(putParams));
        console.log(`✅ [Lambda] Successfully unsubscribed: ${email}`);

        // Send confirmation email
        const emailSubject = 'You have been unsubscribed from Montebay Insights';
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
                <h1>Unsubscribed Successfully</h1>
                
                <p>You have been unsubscribed from Montebay Insights newsletter.</p>
                
                <div class="content">
                    <p>We're sorry to see you go! You will no longer receive our newsletter emails.</p>
                    <p>If you unsubscribed by mistake, you can always <a href="https://www.montebay.io/insights.html">resubscribe</a> on our website.</p>
                </div>
                
                <div class="footer">
                    <p><strong>Montebay Innovations</strong></p>
                    <p>Questions? Contact us at <a href="mailto:contact@montebay.io">contact@montebay.io</a></p>
                </div>
            </body>
            </html>
        `;

        const emailBodyText = `
Unsubscribed Successfully

You have been unsubscribed from Montebay Insights newsletter.

We're sorry to see you go! You will no longer receive our newsletter emails.

If you unsubscribed by mistake, you can always resubscribe at https://www.montebay.io/insights.html

---
Montebay Innovations
Questions? Contact us at contact@montebay.io
        `;

        try {
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

            await sesClient.send(new SendEmailCommand(emailParams));
            console.log(`📧 [Lambda] Confirmation email sent to: ${email}`);
        } catch (emailError) {
            console.error('⚠️ [Lambda] Failed to send confirmation email:', emailError);
            // Don't fail the unsubscribe if email fails
        }

        // Send notification to Montebay team
        try {
            const notificationParams = {
                Source: FROM_EMAIL,
                Destination: {
                    ToAddresses: [TO_EMAIL]
                },
                Message: {
                    Subject: { Data: 'Newsletter Unsubscribe', Charset: 'UTF-8' },
                    Body: {
                        Text: { 
                            Data: `Newsletter unsubscribe:\n\nEmail: ${email}\nTime: ${new Date().toISOString()}`, 
                            Charset: 'UTF-8' 
                        }
                    }
                }
            };

            await sesClient.send(new SendEmailCommand(notificationParams));
        } catch (notificationError) {
            console.error('⚠️ [Lambda] Failed to send notification email:', notificationError);
            // Don't fail the unsubscribe if notification fails
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'You have been successfully unsubscribed from our newsletter.',
                email: email
            })
        };

    } catch (error) {
        console.error('❌ [Lambda] Error processing unsubscribe:', error);
        console.error('❌ [Lambda] Error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to process unsubscribe',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
