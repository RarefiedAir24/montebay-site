# GA4 Measurement ID Setup

## Quick Setup (2 minutes)

Your website is ready for Google Analytics 4! You just need to add your Measurement ID.

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon) in the bottom left
3. In the **Property** column, select your property (or create one if needed)
4. Click **Data Streams** → **Web**
5. Click on your web stream (or create one for `https://www.montebay.io`)
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Update Your Website

**Option A: Use the Script (Recommended)**

```bash
./update-ga4-id.sh G-YOUR-ACTUAL-ID-HERE
```

**Option B: Manual Update**

Replace `G-XXXXXXXXXX` with your actual Measurement ID in these files:
- `index.html`
- `ai-intelligent-systems.html`
- `wordflect.html`
- `soteria.html`
- `insights.html`
- `ai-diagnostic.html`
- `blog/ai-cloud-cost-saving.html`
- `blog/generative-ai-devops-insights.html`
- `unsubscribe.html`

Find and replace in each file:
- Line with: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>`
- Line with: `gtag('config', 'G-XXXXXXXXXX', {`

### Step 3: Verify It Works

1. Visit your website
2. Open GA4 → **Reports** → **Realtime**
3. You should see your visit appear within 30 seconds

---

## What's Already Set Up

✅ GA4 tracking code on all pages  
✅ Event tracking functions (`trackEvent`, `trackFormSubmission`, `trackCTAClick`)  
✅ Form submission tracking  
✅ CTA click tracking  
✅ Privacy settings (anonymize IP, secure cookies)

---

## Tracking Events

The following events are automatically tracked:

### Form Submissions
- `form_submit` - All form submissions
  - `form_name`: Name of the form
  - `form_location`: Page path
  - Additional form-specific data

### CTA Clicks
- `cta_click` - All CTA button clicks
  - `cta_text`: Button text
  - `cta_location`: Section ID
  - `page_path`: Current page

---

## Need Help?

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Measurement ID Format](https://support.google.com/analytics/answer/9304153#zippy=%2Ccreate-a-web-data-stream)
