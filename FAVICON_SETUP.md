# Favicon Setup Guide

## Current Status

✅ **SVG favicon created** (`favicon.svg`) - Landscape design with mountains, sun/moon, and water lines
✅ **PNG favicons created** - Multiple sizes for browser compatibility
⚠️ **ICO file needed** - For maximum browser compatibility

## Files Created

- `favicon.svg` - SVG version (modern browsers)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG  
- `apple-touch-icon.png` - 180x180 PNG (iOS)

## Missing File

You need to create `favicon.ico` for maximum browser compatibility.

### Option 1: Online Converter (Easiest)

1. Go to: https://convertio.co/svg-ico/ or https://www.favicon-generator.org/
2. Upload `favicon.svg`
3. Download the `favicon.ico` file
4. Place it in the root directory (`/Users/frankschioppa/montebay-website/`)

### Option 2: Install ImageMagick

```bash
brew install imagemagick
```

Then run:
```bash
convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico
```

### Option 3: Use Online Favicon Generator

1. Visit: https://realfavicongenerator.net/
2. Upload `favicon.svg` or `favicon-32x32.png`
3. Generate all formats
4. Download and place files in root directory

## HTML Configuration

The HTML is already configured to use all favicon formats:

```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

## Testing

After adding `favicon.ico`:

1. **Hard refresh browser**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear browser cache** if favicon still doesn't show
3. **Check browser tab** - favicon should appear
4. **Test on mobile** - Apple touch icon should work on iOS

## Troubleshooting

### Favicon not showing?

1. **Check file paths** - All favicon files should be in root directory
2. **Check file names** - Must match exactly (case-sensitive)
3. **Clear browser cache** - Browsers cache favicons aggressively
4. **Check browser console** - Look for 404 errors
5. **Try incognito mode** - Bypasses cache

### Still not working?

1. Verify files exist:
   ```bash
   ls -la favicon*
   ls -la apple-touch-icon.png
   ```

2. Check file permissions:
   ```bash
   chmod 644 favicon*
   chmod 644 apple-touch-icon.png
   ```

3. Verify HTML links are correct (already done)

## Next Steps

1. ✅ Create `favicon.ico` using one of the methods above
2. ✅ Place in root directory
3. ✅ Commit to git
4. ✅ Deploy to Vercel
5. ✅ Test in browser

---

**Note:** The SVG favicon should work in modern browsers, but ICO provides the best compatibility across all browsers and platforms.
