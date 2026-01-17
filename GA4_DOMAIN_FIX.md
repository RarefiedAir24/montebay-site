# GA4 Domain Configuration Fix

## The Problem

Your site is accessible at: **`https://www.montebay.io`** (with www)  
But GA4 is configured for: **`montebay.io`** (without www)

GA4 needs to match the **actual domain** where your site is accessible.

---

## Solution: Update GA4 Data Stream

### Option 1: Update GA4 to use www (Recommended if site uses www)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Admin → Data Streams → Web
3. Click on your stream: **Montebay Main**
4. Click the **pencil icon** to edit
5. Change **Stream URL** from:
   - `https://montebay.io`
   - To: `https://www.montebay.io`
6. Click **Save**

### Option 2: Add both domains (if both work)

If both `montebay.io` and `www.montebay.io` work (one redirects to the other):

1. Keep the existing stream for `montebay.io`
2. Add a **second data stream** for `www.montebay.io`
3. Use the **same Measurement ID** (`G-9J09SFBL2N`) for both

**Note:** Actually, you can only have one Measurement ID per property. So you need to choose which domain is the "primary" one.

---

## Check Your Actual Domain

To verify which domain your site actually uses:

1. Visit: `https://montebay.io`
   - Does it redirect to `www.montebay.io`?
   - Or does it stay as `montebay.io`?

2. Visit: `https://www.montebay.io`
   - Does it redirect to `montebay.io`?
   - Or does it stay as `www.montebay.io`?

**The domain that DOESN'T redirect is your primary domain.**

---

## Quick Test

After updating GA4:

1. Visit your site at the domain you configured in GA4
2. Open DevTools → Network tab
3. Filter for: `gtag`
4. You should see requests to `googletagmanager.com`
5. Check GA4 → Realtime reports within 30 seconds

---

## Current Configuration

- **GA4 Stream URL:** `https://montebay.io` (needs to match actual domain)
- **Actual Site:** `https://www.montebay.io` (based on error message)
- **Measurement ID:** `G-9J09SFBL2N` ✅ (this is correct)

**Action needed:** Update GA4 Stream URL to `https://www.montebay.io`
