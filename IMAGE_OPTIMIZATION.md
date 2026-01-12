# Image Optimization Guide

## Quick Start

Run the optimization script:

```bash
./optimize-images.sh
```

This will:
1. Check for WebP tools (install if needed)
2. Convert PNG images to WebP format
3. Create optimized versions in `assets/images/optimized/`

## Manual Conversion

If you prefer to convert manually:

### Install WebP Tools

**macOS:**
```bash
brew install webp
```

**Linux:**
```bash
sudo apt-get update && sudo apt-get install -y webp
```

**Windows:**
Download from: https://developers.google.com/speed/webp/download

### Convert Images

```bash
# Wordflect app
cwebp -q 85 -m 6 assets/images/wordflect_app.png -o assets/images/optimized/wordflect_app.webp

# Soteria app
cwebp -q 85 -m 6 assets/images/soteria_app.png -o assets/images/optimized/soteria_app.webp

# Logo (if needed)
cwebp -q 90 -m 6 montebay_logo.png -o montebay_logo.webp
```

## Quality Settings

- **-q 85**: Good balance between quality and file size (recommended for product images)
- **-q 90**: Higher quality (use for logos, important images)
- **-m 6**: Maximum compression effort (slower but better compression)

## HTML Implementation

The HTML already uses `<picture>` elements with WebP fallback:

```html
<picture>
    <source srcset="assets/images/optimized/wordflect_app.webp" type="image/webp">
    <img src="assets/images/wordflect_app.png" alt="Wordflect App">
</picture>
```

This ensures:
- Modern browsers load WebP (smaller file size)
- Older browsers fall back to PNG
- No functionality is lost

## File Size Comparison

Expected savings:
- **Wordflect image**: ~30-50% smaller
- **Soteria image**: ~30-50% smaller
- **Logo**: ~20-40% smaller

## Testing

After conversion:

1. **Check file sizes:**
   ```bash
   ls -lh assets/images/*.png
   ls -lh assets/images/optimized/*.webp
   ```

2. **Test in browser:**
   - Open DevTools → Network tab
   - Reload page
   - Check which format loads (should be WebP in modern browsers)

3. **Verify fallback:**
   - Disable WebP support in browser
   - Verify PNG still loads

## Next Steps

1. ✅ Run optimization script
2. ✅ Commit optimized images
3. ✅ Test in production
4. ✅ Monitor performance improvements

## Performance Impact

Expected improvements:
- **Faster page loads**: Smaller images = faster downloads
- **Better mobile experience**: Less data usage
- **Improved SEO**: Page speed is a ranking factor
- **Better user experience**: Faster = happier users

---

## Troubleshooting

### Script fails to install WebP tools?

Install manually using the commands above.

### Images not loading?

1. Check file paths are correct
2. Verify WebP files exist in `assets/images/optimized/`
3. Check browser console for errors
4. Ensure server supports WebP MIME type (Vercel does automatically)

### Want to optimize further?

1. Use **Squoosh** (online tool): https://squoosh.app/
2. Use **ImageOptim** (macOS app)
3. Use **TinyPNG** for additional compression
