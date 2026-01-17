# Testing GA4 Tag on Live Site

## Quick Browser Test (2 minutes)

### Step 1: Open Your Site
Visit: **https://montebay.io**

### Step 2: Open Browser DevTools
- **Chrome/Edge:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Safari:** Press `Cmd+Option+I` (need to enable Developer menu first)

### Step 3: Check Console Tab
Look for any errors related to:
- `gtag`
- `googletagmanager`
- `analytics`

**Expected:** No errors. If you see errors, note them down.

### Step 4: Check Network Tab
1. Click the **Network** tab in DevTools
2. Filter for: `gtag` or `analytics`
3. Refresh the page (F5)
4. Look for requests to `googletagmanager.com`

**Expected:** You should see requests like:
- `https://www.googletagmanager.com/gtag/js?id=G-9J09SFBL2N`
- `https://www.google-analytics.com/g/collect?...`

### Step 5: Check if gtag is loaded
In the **Console** tab, type:
```javascript
typeof gtag
```

**Expected:** Should return `"function"`

Then type:
```javascript
dataLayer
```

**Expected:** Should show an array with GA4 configuration

### Step 6: Manually trigger an event
In the **Console** tab, type:
```javascript
gtag('event', 'test_event', {'event_category': 'test'});
```

**Expected:** No errors. Then check GA4 Realtime reports.

---

## Common Issues & Solutions

### Issue 1: Tag not loading
**Symptoms:** No requests to `googletagmanager.com` in Network tab

**Solutions:**
- Check if site is deployed (wait 2-3 minutes after git push)
- Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try incognito/private mode

### Issue 2: CORS errors
**Symptoms:** Console shows CORS errors

**Solutions:**
- Check if domain matches exactly: `montebay.io` vs `www.montebay.io`
- Verify GA4 data stream URL matches your actual domain

### Issue 3: Tag loads but no data in GA4
**Symptoms:** Network requests work, but Realtime shows nothing

**Solutions:**
- Wait 30-60 seconds (GA4 can have a delay)
- Check if you're looking at the right GA4 property
- Verify Measurement ID matches: `G-9J09SFBL2N`
- Try sending a test event (see Step 6 above)

### Issue 4: Ad blockers
**Symptoms:** Tag doesn't load, but works in incognito

**Solutions:**
- Disable ad blockers temporarily
- Add `montebay.io` to ad blocker whitelist
- Test in incognito mode (ad blockers often disabled there)

---

## Verify Tag in Page Source

1. Visit: https://montebay.io
2. Right-click → **View Page Source** (or `Ctrl+U` / `Cmd+Option+U`)
3. Search for: `G-9J09SFBL2N`
4. You should see:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-9J09SFBL2N"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-9J09SFBL2N', {
           'anonymize_ip': true,
           'cookie_flags': 'SameSite=None;Secure'
       });
   </script>
   ```

---

## Quick Test Script

You can also open the test file locally:
1. Open `test-ga4.html` in your browser
2. It will automatically test the tag
3. Click the test buttons to verify each component

---

## Still Not Working?

If after all these tests the tag still doesn't work:

1. **Check Vercel deployment:**
   - Go to your Vercel dashboard
   - Verify the latest deployment is successful
   - Check deployment logs for errors

2. **Verify domain:**
   - GA4 data stream URL must match exactly
   - If your site is `www.montebay.io`, GA4 must be configured for `www.montebay.io`
   - If your site is `montebay.io`, GA4 must be configured for `montebay.io`

3. **Check for redirects:**
   - If `montebay.io` redirects to `www.montebay.io` (or vice versa), make sure GA4 is configured for the final destination

4. **Contact me with:**
   - Screenshot of Network tab (filtered for "gtag")
   - Screenshot of Console tab (any errors)
   - What you see when you type `typeof gtag` in console
