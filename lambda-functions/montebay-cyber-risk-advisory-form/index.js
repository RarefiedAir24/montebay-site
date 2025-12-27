const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

// Email configuration
const TO_EMAIL = process.env.TO_EMAIL || 'contact@montebay.io';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';

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

        console.log('📥 [Lambda] Received form submission:', JSON.stringify(formData, null, 2));

        // Validate required fields
        const requiredFields = ['full-name', 'work-email', 'company-name', 'role-title', 'organization-type', 'advisory-tier'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            console.error('❌ [Lambda] Missing required fields:', missingFields);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                })
            };
        }

        // Validate checkbox groups
        const concerns = Array.isArray(formData['cyber-concerns']) ? formData['cyber-concerns'] : (formData['cyber-concerns'] ? [formData['cyber-concerns']] : []);
        if (concerns.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Please select at least one primary concern.'
                })
            };
        }

        const confirmations = Array.isArray(formData['cyber-confirmations']) ? formData['cyber-confirmations'] : (formData['cyber-confirmations'] ? [formData['cyber-confirmations']] : []);
        if (confirmations.length !== 3) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Please confirm all scope requirements.'
                })
            };
        }

        // Format email subject
        const emailSubject = `Strategic Cyber Risk Advisory Request - ${formData['company-name']}`;

        // Format email body (plain text)
        let emailBody = 'STRATEGIC CYBER RISK ADVISORY REQUEST\n';
        emailBody += '='.repeat(50) + '\n\n';
        
        emailBody += 'CONTACT INFORMATION\n';
        emailBody += '-'.repeat(30) + '\n';
        emailBody += `Full Name: ${formData['full-name']}\n`;
        emailBody += `Work Email: ${formData['work-email']}\n`;
        emailBody += `Company: ${formData['company-name']}\n`;
        emailBody += `Role/Title: ${formData['role-title']}\n\n`;
        
        emailBody += 'ORGANIZATION CONTEXT\n';
        emailBody += '-'.repeat(30) + '\n';
        emailBody += `Organization Type: ${formData['organization-type']}\n\n`;
        
        emailBody += 'PRIMARY CONCERNS\n';
        emailBody += '-'.repeat(30) + '\n';
        concerns.forEach(concern => {
            emailBody += `• ${concern}\n`;
        });
        emailBody += '\n';
        
        emailBody += 'ADVISORY TIER\n';
        emailBody += '-'.repeat(30) + '\n';
        emailBody += `Selected Tier: ${formData['advisory-tier']}\n\n`;
        
        emailBody += 'SCOPE CONFIRMATIONS\n';
        emailBody += '-'.repeat(30) + '\n';
        confirmations.forEach(conf => {
            emailBody += `✓ ${conf}\n`;
        });
        emailBody += '\n';
        
        if (formData['additional-notes']) {
            emailBody += 'ADDITIONAL NOTES\n';
            emailBody += '-'.repeat(30) + '\n';
            emailBody += `${formData['additional-notes']}\n\n`;
        }

        // Format email body (HTML)
        const formatEmailBodyHTML = (data) => {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        h2 { color: #1a2a4a; border-bottom: 2px solid #5a8ab0; padding-bottom: 5px; }
                        .section { margin-bottom: 20px; }
                        .field { margin-bottom: 10px; }
                        .label { font-weight: bold; color: #1a2a4a; }
                        ul { margin: 10px 0; padding-left: 20px; }
                        li { margin-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <h2>Strategic Cyber Risk Advisory Request</h2>
                    
                    <div class="section">
                        <h3>Contact Information</h3>
                        <div class="field"><span class="label">Full Name:</span> ${data['full-name']}</div>
                        <div class="field"><span class="label">Work Email:</span> ${data['work-email']}</div>
                        <div class="field"><span class="label">Company:</span> ${data['company-name']}</div>
                        <div class="field"><span class="label">Role/Title:</span> ${data['role-title']}</div>
                    </div>
                    
                    <div class="section">
                        <h3>Organization Context</h3>
                        <div class="field"><span class="label">Organization Type:</span> ${data['organization-type']}</div>
                    </div>
                    
                    <div class="section">
                        <h3>Primary Concerns</h3>
                        <ul>
                            ${concerns.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h3>Advisory Tier</h3>
                        <div class="field"><span class="label">Selected Tier:</span> ${data['advisory-tier']}</div>
                    </div>
                    
                    <div class="section">
                        <h3>Scope Confirmations</h3>
                        <ul>
                            ${confirmations.map(c => `<li>✓ ${c}</li>`).join('')}
                        </ul>
                    </div>
            `;
            
            if (data['additional-notes']) {
                html += `
                    <div class="section">
                        <h3>Additional Notes</h3>
                        <p>${data['additional-notes'].replace(/\n/g, '<br>')}</p>
                    </div>
                `;
            }
            
            html += `
                </body>
                </html>
            `;
            
            return html;
        };

        const emailParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [TO_EMAIL]
            },
            Message: {
                Subject: { Data: emailSubject, Charset: 'UTF-8' },
                Body: {
                    Text: { Data: emailBody, Charset: 'UTF-8' },
                    Html: { Data: formatEmailBodyHTML(formData), Charset: 'UTF-8' }
                }
            }
        };

        console.log('📤 [Lambda] Sending email via SES...');
        const command = new SendEmailCommand(emailParams);
        const result = await sesClient.send(command);
        console.log('✅ [Lambda] Email sent successfully:', result.MessageId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Request received. If this looks like a good fit, you\'ll receive next steps within 1–2 business days. No meetings are required unless you request one.'
            })
        };
    } catch (error) {
        console.error('❌ [Lambda] Error processing form submission:', error);
        console.error('❌ [Lambda] Error stack:', error.stack);
        console.error('❌ [Lambda] Event received:', JSON.stringify(event, null, 2));
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to process form submission',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};

