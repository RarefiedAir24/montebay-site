# Google Analytics 4 (GA4) Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. In the **Property** column, click **Create Property**
4. Fill in:
   - Property name: `Montebay Website`
   - Reporting time zone: Your timezone
   - Currency: USD
5. Click **Next** → **Next** → **Create**

### Step 2: Get Your Measurement ID

1. In your new property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter:
   - Website URL: `https://montebay.io`
   - Stream name: `Montebay Website`
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Update Website Code

1. Open all HTML files in your project
2. Find this line in the `<head>` section:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID
4. Also update in the `gtag('config', 'G-XXXXXXXXXX', ...)` line

**Files to update:**
- `index.html`
- `ai-intelligent-systems.html`
- `wordflect.html`
- `soteria.html`
- `insights.html`
- `ai-diagnostic.html`

### Step 4: Verify Installation

1. Visit your website
2. In GA4, go to **Reports** → **Realtime**
3. You should see your visit appear within 30 seconds

---

## Event Tracking

The following events are automatically tracked:

### Form Submissions
- `form_submit` - All form submissions
  - `form_name`: Name of the form (contact_form, newsletter_signup, etc.)
  - `form_location`: Page path
  - Additional form-specific data

### CTA Clicks
- `cta_click` - All CTA button clicks
  - `cta_text`: Button text
  - `cta_location`: Section ID
  - `page_path`: Current page

### View Events in GA4

1. Go to **Reports** → **Engagement** → **Events**
2. You'll see:
   - `form_submit` events
   - `cta_click` events
   - Standard page views

---

## Custom Reports

### Form Conversion Report

1. Go to **Explore** → **Blank**
2. Add dimensions:
   - `Event name`
   - `Form name` (custom parameter)
3. Add metrics:
   - `Event count`
4. Filter: `Event name = form_submit`

### CTA Performance Report

1. Go to **Explore** → **Blank**
2. Add dimensions:
   - `Event name`
   - `CTA text` (custom parameter)
   - `CTA location` (custom parameter)
3. Add metrics:
   - `Event count`
4. Filter: `Event name = cta_click`

---

## Privacy & Compliance

The GA4 implementation includes:
- ✅ IP anonymization (`anonymize_ip: true`)
- ✅ Secure cookies (`SameSite=None;Secure`)
- ✅ GDPR-friendly configuration

**Note:** You may still need to:
- Add a cookie consent banner (if required by your jurisdiction)
- Update your privacy policy
- Configure data retention settings in GA4

---

## Troubleshooting

### Events not showing up?

1. **Check browser console** for JavaScript errors
2. **Verify Measurement ID** is correct in all files
3. **Check GA4 DebugView**:
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
   - Visit your site
   - Go to GA4 → **Admin** → **DebugView**
   - You should see events in real-time

### Form submissions not tracked?

1. Check that `script.js` is loaded
2. Verify `trackFormSubmission()` function exists
3. Check browser console for errors
4. Ensure forms have correct IDs

---

## Next Steps

1. ✅ Set up conversion goals in GA4
2. ✅ Create custom dashboards
3. ✅ Set up email reports
4. ✅ Configure audience segments
5. ✅ Link to Google Search Console (for SEO data)

---

## Support

For GA4 documentation:
- [GA4 Help Center](https://support.google.com/analytics/answer/10089681)
- [GA4 Events Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
