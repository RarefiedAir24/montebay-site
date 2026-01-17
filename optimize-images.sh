#!/bin/bash
# Image Optimization Script for Montebay Website
# Converts PNG images to WebP format and optimizes them

echo "🖼️  Starting image optimization..."

# Check if cwebp is installed (part of WebP tools)
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Installing WebP tools..."
    
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            echo "Installing via Homebrew..."
            brew install webp
        else
            echo "Please install Homebrew first: https://brew.sh"
            echo "Then run: brew install webp"
            exit 1
        fi
    # Linux
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing via apt-get..."
        sudo apt-get update && sudo apt-get install -y webp
    else
        echo "Please install WebP tools manually: https://developers.google.com/speed/webp/download"
        exit 1
    fi
fi

# Create optimized directory
mkdir -p assets/images/optimized

# Convert images to WebP
echo "📦 Converting images to WebP..."

# Wordflect app image
if [ -f "assets/images/wordflect_app.png" ]; then
    echo "Converting wordflect_app.png..."
    cwebp -q 85 -m 6 "assets/images/wordflect_app.png" -o "assets/images/optimized/wordflect_app.webp"
    echo "✅ Created: assets/images/optimized/wordflect_app.webp"
fi

# Soteria app image
if [ -f "assets/images/soteria_app.png" ]; then
    echo "Converting soteria_app.png..."
    cwebp -q 85 -m 6 "assets/images/soteria_app.png" -o "assets/images/optimized/soteria_app.webp"
    echo "✅ Created: assets/images/optimized/soteria_app.webp"
fi

# Logo (if exists)
if [ -f "montebay_logo.png" ]; then
    echo "Converting montebay_logo.png..."
    cwebp -q 90 -m 6 "montebay_logo.png" -o "montebay_logo.webp"
    echo "✅ Created: montebay_logo.webp"
fi

# Blog images (JPG)
if [ -f "assets/images/blog/ai-devops-symbiotic-relationship.jpg" ]; then
    echo "Converting ai-devops-symbiotic-relationship.jpg..."
    cwebp -q 85 -m 6 "assets/images/blog/ai-devops-symbiotic-relationship.jpg" -o "assets/images/blog/ai-devops-symbiotic-relationship.webp"
    echo "✅ Created: assets/images/blog/ai-devops-symbiotic-relationship.webp"
fi

# Optimize existing images further (if imagemagick is available)
if command -v convert &> /dev/null; then
    echo ""
    echo "📉 Further optimizing images with ImageMagick..."
    
    # Optimize PNGs (lossless compression)
    find . -name "*.png" -not -path "./node_modules/*" -not -path "./.git/*" | while read img; do
        if [ -f "$img" ]; then
            echo "Optimizing $img..."
            convert "$img" -strip -quality 95 "$img"
        fi
    done
    
    # Optimize JPGs
    find . -name "*.jpg" -o -name "*.jpeg" | while read img; do
        if [ -f "$img" ]; then
            echo "Optimizing $img..."
            convert "$img" -strip -quality 85 "$img"
        fi
    done
else
    echo ""
    echo "💡 Tip: Install ImageMagick for further image optimization:"
    echo "   macOS: brew install imagemagick"
    echo "   Linux: sudo apt-get install imagemagick"
fi

echo ""
echo "✨ Image optimization complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update HTML files to use WebP with PNG fallback"
echo "2. Test images in different browsers"
echo "3. Commit optimized images to repository"
