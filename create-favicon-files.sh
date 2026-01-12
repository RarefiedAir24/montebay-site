#!/bin/bash
# Create favicon files from SVG
# This script converts favicon.svg to various formats needed for browser compatibility

echo "🖼️  Creating favicon files from favicon.svg..."

# Check if ImageMagick or other tools are available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    # Create ICO file (16x16, 32x32, 48x48)
    convert -background none -resize 16x16 favicon.svg favicon-16x16.png
    convert -background none -resize 32x32 favicon.svg favicon-32x32.png
    convert -background none -resize 48x48 favicon.svg favicon-48x48.png
    convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico
    
    # Create Apple touch icon
    convert -background none -resize 180x180 favicon.svg apple-touch-icon.png
    
    echo "✅ Favicon files created!"
elif command -v magick &> /dev/null; then
    echo "Using ImageMagick (magick)..."
    magick -background none -resize 16x16 favicon.svg favicon-16x16.png
    magick -background none -resize 32x32 favicon.svg favicon-32x32.png
    magick -background none -resize 48x48 favicon.svg favicon-48x48.png
    magick favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico
    magick -background none -resize 180x180 favicon.svg apple-touch-icon.png
    echo "✅ Favicon files created!"
elif command -v sips &> /dev/null; then
    echo "Using macOS sips (limited - will create PNGs only)..."
    # sips can't create ICO, but can create PNGs
    sips -s format png -z 16 16 favicon.svg --out favicon-16x16.png
    sips -s format png -z 32 32 favicon.svg --out favicon-32x32.png
    sips -s format png -z 180 180 favicon.svg --out apple-touch-icon.png
    echo "⚠️  Created PNG files. For ICO file, use an online converter or install ImageMagick."
else
    echo "❌ No image conversion tools found."
    echo ""
    echo "Please install ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Linux: sudo apt-get install imagemagick"
    echo ""
    echo "Or use an online converter:"
    echo "  https://convertio.co/svg-ico/"
    echo "  https://www.favicon-generator.org/"
    echo ""
    echo "You need to create:"
    echo "  - favicon.ico (16x16, 32x32, 48x48)"
    echo "  - favicon-16x16.png"
    echo "  - favicon-32x32.png"
    echo "  - apple-touch-icon.png (180x180)"
    exit 1
fi
