# Tawk.to Chat Widget Setup Guide

## Quick Setup (5 minutes)

### Step 1: Sign Up for Tawk.to
1. Go to https://www.tawk.to
2. Click "Sign Up Free"
3. Create your account (free forever)
4. Verify your email

### Step 2: Create a Property
1. After logging in, you'll be prompted to create a property
2. Name: "Montebay Innovations"
3. Website URL: `https://www.montebay.io`
4. Click "Add Property"

### Step 3: Get Your Widget Code
1. After creating the property, you'll see your widget code
2. You'll need:
   - **Property ID**: A long string like `1234567890abcdef1234567890abcdef`
   - **Widget ID**: A shorter string like `1a2b3c4d`

### Step 4: Add to Website
1. Open `index.html`
2. Find the Tawk.to script section (around line 8-20)
3. Replace `YOUR_PROPERTY_ID` with your Property ID
4. Replace `YOUR_WIDGET_ID` with your Widget ID
5. Uncomment the script (remove `<!--` and `-->`)

### Step 5: Configure Chat Widget
1. In Tawk.to dashboard, go to **Administration** → **Chat Widget**
2. Customize appearance:
   - Primary color: `#5a8ab0` (Montebay blue)
   - Widget position: Bottom right
   - Show on mobile: Yes
3. Set up welcome messages
4. Configure chat routing (if needed)

### Step 6: Test
1. Save `index.html`
2. Deploy to Vercel
3. Visit your site
4. Verify chat widget appears in bottom-right corner
5. Test sending a message

---

## Example Configuration

Once you have your IDs, your script should look like this:

```html
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

Replace:
- `YOUR_PROPERTY_ID` → Your actual Property ID
- `YOUR_WIDGET_ID` → Your actual Widget ID

---

## Advanced Configuration

### Customize Chat Messages
1. Go to **Administration** → **Chat Widget** → **Chat Widget Settings**

2. **Welcome Message** (when chat opens):
   ```
   👋 Hi! I'm here to help you find the right Montebay solution. What's your biggest technical challenge?
   ```
   Or more concise:
   ```
   Hi! How can we help you today?
   ```

3. **Suggested Messages** (quick reply buttons):
   - **Option 1:** "I have a question about your services"
   - **Option 2:** "Tell me about AI capabilities"
   - **Option 3:** "I need help with AWS/cloud architecture"
   - **Option 4:** "Schedule a consultation"
   
   You can add 2-4 suggested messages. Choose the ones most relevant to your common inquiries.

4. **Offline Message** (when team is unavailable):
   ```
   We're currently offline. Leave a message and we'll get back to you within 24 hours.
   ```
   Or more personalized:
   ```
   Thanks for reaching out! We're currently offline, but we'll respond to your message within 24 hours. For urgent matters, email us at contact@montebay.io
   ```

### Set Up Chat Routing
1. Go to **Administration** → **Chat Widget** → **Routing**
2. Create routing rules based on:
   - Page visited
   - Visitor location
   - Time of day
   - Keywords in messages

### Add to All Pages
The script in `index.html` will work on all pages. If you want to add it to other pages:
- Copy the script to `ai-intelligent-systems.html`
- Copy to `wordflect.html`
- Copy to `soteria.html`
- Copy to `insights.html`
- Copy to `ai-diagnostic.html`

---

## Alternative: Add Script to All Pages Automatically

You can add the script to the `<head>` section of all HTML pages, or use a shared include if you move to a templating system.

---

## Troubleshooting

**Widget not appearing?**
- Check browser console for errors
- Verify Property ID and Widget ID are correct
- Make sure script is uncommented
- Clear browser cache

**Widget styling issues?**
- Customize colors in Tawk.to dashboard
- Check for CSS conflicts
- Use Tawk.to's customization options

**Messages not being received?**
- Check Tawk.to dashboard for messages
- Verify email notifications are enabled
- Check spam folder

---

## Next Steps After Setup

1. **Train your team** on using Tawk.to dashboard
2. **Set up email notifications** for offline messages
3. **Create canned responses** for common questions
4. **Set business hours** if applicable
5. **Monitor chat analytics** in Tawk.to dashboard

---

**Need Help?**
- Tawk.to Documentation: https://www.tawk.to/knowledgebase/
- Tawk.to Support: Available in dashboard
