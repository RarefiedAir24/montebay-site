const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { OpenAI } = require('openai'); // or use Anthropic SDK

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

// Email configuration
const TO_EMAIL = process.env.TO_EMAIL || 'contact@montebay.io';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';

// AI/LLM configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // Use gpt-4o-mini for cost efficiency

// Initialize OpenAI client (if using OpenAI)
// const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

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

        console.log('📥 [Lambda] Received diagnostic form submission');

        // Validate required fields
        const requiredFields = ['name', 'email', 'primary-challenge', 'company-size'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                })
            };
        }

        // Extract form data
        const challenge = Array.isArray(formData['primary-challenge']) 
            ? formData['primary-challenge'][0] 
            : formData['primary-challenge'];
        const infrastructure = formData['current-infrastructure'] || 'Not provided';
        const painPoints = Array.isArray(formData['pain-points']) 
            ? formData['pain-points'] 
            : (formData['pain-points'] ? [formData['pain-points']] : []);
        const goals = Array.isArray(formData['goals']) 
            ? formData['goals'] 
            : (formData['goals'] ? [formData['goals']] : []);
        const companySize = formData['company-size'];
        const name = formData['name'];
        const email = formData['email'];
        const company = formData['company'] || 'Not provided';

        // Generate AI report using LLM
        let aiReport = '';
        
        if (OPENAI_API_KEY) {
            try {
                // Construct prompt for LLM
                const prompt = `You are a senior technical consultant at Montebay Innovations, a consulting firm focused on solving complex systems with clarity.

Based on the following diagnostic information, generate a personalized system assessment report:

PRIMARY CHALLENGE: ${challenge}
CURRENT INFRASTRUCTURE: ${infrastructure}
PAIN POINTS: ${painPoints.join(', ')}
GOALS: ${goals.join(', ')}
COMPANY SIZE: ${companySize}

Generate a professional, actionable assessment report that includes:
1. Executive Summary (2-3 sentences)
2. Key Findings (3-4 bullet points)
3. Recommended Services (2-3 specific Montebay services that would help)
4. Next Steps (2-3 actionable items)

Keep it concise, professional, and focused on practical solutions. Format as plain text with clear sections.`;

                // Call OpenAI API
                const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
                const completion = await openai.chat.completions.create({
                    model: OPENAI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a senior technical consultant providing clear, actionable advice to organizations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                });

                aiReport = completion.choices[0].message.content;
                console.log('✅ [Lambda] AI report generated successfully');
            } catch (aiError) {
                console.error('⚠️ [Lambda] AI generation failed, using template:', aiError);
                // Fallback to template if AI fails
                aiReport = generateTemplateReport(challenge, painPoints, goals, companySize);
            }
        } else {
            // Use template if no API key
            console.log('ℹ️ [Lambda] No OpenAI API key, using template report');
            aiReport = generateTemplateReport(challenge, painPoints, goals, companySize);
        }

        // Format email subject
        const emailSubject = `AI System Diagnostic Report - ${name}`;

        // Format email body (HTML)
        const emailBodyHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1a2a4a; border-bottom: 3px solid #5a8ab0; padding-bottom: 10px; }
                    h2 { color: #1a2a4a; margin-top: 30px; border-bottom: 2px solid #5a8ab0; padding-bottom: 5px; }
                    .section { margin-bottom: 25px; }
                    .report-content { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #5a8ab0; white-space: pre-wrap; }
                    .info-box { background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .cta-button { display: inline-block; background: #5a8ab0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>AI System Diagnostic Report</h1>
                
                <div class="info-box">
                    <strong>Generated for:</strong> ${name}<br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Date:</strong> ${new Date().toLocaleDateString()}
                </div>
                
                <div class="section">
                    <h2>Your Personalized Assessment</h2>
                    <div class="report-content">${aiReport.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="section">
                    <h2>Your Responses Summary</h2>
                    <p><strong>Primary Challenge:</strong> ${challenge}</p>
                    <p><strong>Company Size:</strong> ${companySize}</p>
                    ${painPoints.length > 0 ? `<p><strong>Pain Points:</strong> ${painPoints.join(', ')}</p>` : ''}
                    ${goals.length > 0 ? `<p><strong>Goals:</strong> ${goals.join(', ')}</p>` : ''}
                </div>
                
                <div class="section">
                    <h2>Next Steps</h2>
                    <p>This report was generated based on your responses. For a deeper assessment and personalized recommendations, consider scheduling a consultation with our team.</p>
                    <a href="https://www.montebay.io#contact" class="cta-button">Schedule a Consultation</a>
                </div>
                
                <p style="margin-top: 40px; color: #666; font-size: 0.9em;">
                    This is an automated report generated by Montebay Innovations' AI diagnostic tool. 
                    For questions or to discuss your specific needs, please contact us at contact@montebay.io
                </p>
            </body>
            </html>
        `;

        // Format email body (plain text)
        const emailBodyText = `
AI SYSTEM DIAGNOSTIC REPORT
${'='.repeat(50)}

Generated for: ${name}
Email: ${email}
Company: ${company}
Date: ${new Date().toLocaleDateString()}

${'='.repeat(50)}

YOUR PERSONALIZED ASSESSMENT
${'-'.repeat(50)}

${aiReport}

${'='.repeat(50)}

YOUR RESPONSES SUMMARY
${'-'.repeat(50)}

Primary Challenge: ${challenge}
Company Size: ${companySize}
${painPoints.length > 0 ? `Pain Points: ${painPoints.join(', ')}\n` : ''}
${goals.length > 0 ? `Goals: ${goals.join(', ')}\n` : ''}

${'='.repeat(50)}

NEXT STEPS
${'-'.repeat(50)}

This report was generated based on your responses. For a deeper assessment and personalized recommendations, consider scheduling a consultation with our team.

Visit: https://www.montebay.io#contact

${'='.repeat(50)}

This is an automated report generated by Montebay Innovations' AI diagnostic tool.
For questions, contact us at contact@montebay.io
        `;

        // Send email with report
        const emailParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [email],
                CcAddresses: [TO_EMAIL] // Also send to Montebay
            },
            Message: {
                Subject: { Data: emailSubject, Charset: 'UTF-8' },
                Body: {
                    Text: { Data: emailBodyText, Charset: 'UTF-8' },
                    Html: { Data: emailBodyHTML, Charset: 'UTF-8' }
                }
            }
        };

        console.log('📤 [Lambda] Sending diagnostic report via SES...');
        const command = new SendEmailCommand(emailParams);
        const result = await sesClient.send(command);
        console.log('✅ [Lambda] Report sent successfully:', result.MessageId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Your personalized diagnostic report has been sent to your email address.',
                reportPreview: aiReport.substring(0, 200) + '...' // Preview for frontend
            })
        };
    } catch (error) {
        console.error('❌ [Lambda] Error processing diagnostic form:', error);
        console.error('❌ [Lambda] Error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to generate diagnostic report',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};

// Template report generator (fallback when AI is not available)
function generateTemplateReport(challenge, painPoints, goals, companySize) {
    let report = `EXECUTIVE SUMMARY\n`;
    report += `${'-'.repeat(30)}\n`;
    report += `Based on your diagnostic responses, your primary challenge is ${challenge}. `;
    report += `This assessment provides initial recommendations tailored to your company size (${companySize}) and stated goals.\n\n`;
    
    report += `KEY FINDINGS\n`;
    report += `${'-'.repeat(30)}\n`;
    if (painPoints.length > 0) {
        painPoints.forEach((point, i) => {
            report += `${i + 1}. ${point}\n`;
        });
    } else {
        report += `• Your primary challenge: ${challenge}\n`;
    }
    report += `\n`;
    
    report += `RECOMMENDED SERVICES\n`;
    report += `${'-'.repeat(30)}\n`;
    if (challenge.includes('Security') || challenge.includes('Risk')) {
        report += `• Strategic Cyber Risk Advisory - Get clarity on your security posture\n`;
    }
    if (challenge.includes('Cost') || challenge.includes('AWS')) {
        report += `• Silent AWS Audit - Expert review of your AWS environment\n`;
    }
    report += `• Strategic Consulting - Senior-level guidance for your specific challenges\n`;
    report += `\n`;
    
    report += `NEXT STEPS\n`;
    report += `${'-'.repeat(30)}\n`;
    report += `1. Review this assessment and identify priority areas\n`;
    report += `2. Schedule a consultation to discuss your specific needs\n`;
    report += `3. Consider starting with a focused assessment (Silent AWS Audit or Strategic Cyber Risk Advisory)\n`;
    
    return report;
}
