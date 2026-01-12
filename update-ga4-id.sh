#!/bin/bash
# Quick script to update GA4 Measurement ID across all HTML files

if [ -z "$1" ]; then
    echo "Usage: ./update-ga4-id.sh G-XXXXXXXXXX"
    echo ""
    echo "This script will replace G-XXXXXXXXXX with your actual GA4 Measurement ID"
    echo "in all HTML files."
    echo ""
    echo "Example: ./update-ga4-id.sh G-ABC123XYZ789"
    exit 1
fi

GA4_ID="$1"

# Validate format (should start with G-)
if [[ ! "$GA4_ID" =~ ^G-[A-Z0-9]+$ ]]; then
    echo "❌ Error: GA4 Measurement ID should be in format G-XXXXXXXXXX"
    echo "   Example: G-ABC123XYZ789"
    exit 1
fi

echo "🔄 Updating GA4 Measurement ID to: $GA4_ID"
echo ""

# Find all HTML files and replace
HTML_FILES=$(find . -maxdepth 1 -name "*.html" -type f)

for file in $HTML_FILES; do
    if grep -q "G-XXXXXXXXXX" "$file"; then
        echo "Updating $file..."
        # Use sed to replace all instances
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/G-XXXXXXXXXX/$GA4_ID/g" "$file"
        else
            # Linux
            sed -i "s/G-XXXXXXXXXX/$GA4_ID/g" "$file"
        fi
        echo "✅ Updated $file"
    else
        echo "⏭️  Skipping $file (no placeholder found)"
    fi
done

echo ""
echo "✨ GA4 ID updated in all HTML files!"
echo ""
echo "📝 Next steps:"
echo "1. Test the site to verify GA4 is tracking"
echo "2. Check GA4 Realtime view to confirm events"
echo "3. Commit changes: git add *.html && git commit -m 'Add GA4 Measurement ID'"
