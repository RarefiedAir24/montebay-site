const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

const TO_EMAIL   = process.env.TO_EMAIL   || 'contact@montebay.io';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@montebay.io';

const ALLOWED_ORIGINS = [
    'https://www.montebay.io',
    'https://montebay.io'
];

function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
}

/* Strip anything that could inject a second header into the email. */
function clean(v, max) {
    return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, max || 500);
}

function esc(s) {
    return String(s).replace(/[<>&"]/g, c => (
        { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
    ));
}

exports.handler = async (event) => {
    const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
    const headers = corsHeaders(origin);

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const data = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});

        /* Honeypot: real users never fill this. Accept silently so bots do not
           learn they were caught. */
        if (clean(data.website)) {
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        const name    = clean(data.name, 120);
        const email   = clean(data.email, 200);
        const subject = clean(data.subject, 160);
        const message = clean(data.message, 5000);

        const missing = [];
        if (!name) missing.push('name');
        if (!email) missing.push('email');
        if (!message) missing.push('message');
        if (missing.length) {
            return {
                statusCode: 400, headers,
                body: JSON.stringify({ success: false, error: 'Missing required field(s): ' + missing.join(', ') })
            };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return {
                statusCode: 400, headers,
                body: JSON.stringify({ success: false, error: 'That email address does not look valid.' })
            };
        }

        const topic = subject || 'General enquiry';
        const text =
            `New enquiry from montebay.io\n\n` +
            `Name:    ${name}\n` +
            `Email:   ${email}\n` +
            `Topic:   ${topic}\n\n` +
            `Message:\n${message}\n`;

        const html =
            `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#1A1919">` +
            `<h2 style="margin:0 0 16px;font-size:18px">New enquiry from montebay.io</h2>` +
            `<table style="border-collapse:collapse;font-size:14px">` +
            `<tr><td style="padding:4px 16px 4px 0;color:#4C4A4A">Name</td><td>${esc(name)}</td></tr>` +
            `<tr><td style="padding:4px 16px 4px 0;color:#4C4A4A">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>` +
            `<tr><td style="padding:4px 16px 4px 0;color:#4C4A4A">Topic</td><td>${esc(topic)}</td></tr>` +
            `</table>` +
            `<p style="margin:20px 0 6px;color:#4C4A4A;font-size:13px">Message</p>` +
            `<div style="white-space:pre-wrap;padding:14px;background:#F2F5F3;border-radius:6px;font-size:14px">${esc(message)}</div>` +
            `</div>`;

        await ses.send(new SendEmailCommand({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [TO_EMAIL] },
            ReplyToAddresses: [email],
            Message: {
                Subject: { Data: `montebay.io enquiry: ${topic}`, Charset: 'UTF-8' },
                Body: {
                    Text: { Data: text, Charset: 'UTF-8' },
                    Html: { Data: html, Charset: 'UTF-8' }
                }
            }
        }));

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

    } catch (err) {
        console.error('contact-form error:', err);
        return {
            statusCode: 500, headers,
            body: JSON.stringify({ success: false, error: 'Could not send the message. Please email contact@montebay.io directly.' })
        };
    }
};
