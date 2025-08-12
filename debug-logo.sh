#!/bin/bash

echo "🖼️  Logo Image Diagnostic Script"
echo "================================"

echo ""
echo "1. Checking local logo image..."
if [ -f "public/images/aqua-logo.png" ]; then
    echo "✅ Local logo image exists"
    ls -lh public/images/aqua-logo.png
else
    echo "❌ Local logo image is missing"
    echo "💡 Run: curl -o public/images/aqua-logo.png 'https://aquavietnam.com.vn/wp-content/themes/aqua-themes-2306/assets/img/aqua-logo.png'"
fi

echo ""
echo "2. Checking Docker container status..."
if docker ps | grep -q "aev-tv-sales-event"; then
    echo "✅ Docker container is running"
    docker ps | grep "aev-tv-sales-event"
    
    echo ""
    echo "3. Checking local image in container..."
    docker exec $(docker ps -q --filter "name=aev-tv-sales-event") ls -la /app/public/images/ 2>/dev/null && echo "✅ Local images found in container" || echo "❌ Local images not found in container"
else
    echo "❌ Docker container is not running"
fi

echo ""
echo "4. Next.js Image Configuration Check..."
if grep -q "images:" next.config.mjs; then
    echo "✅ Image configuration found in Next.js settings"
else
    echo "❌ Image configuration not found in Next.js settings"
fi

echo ""
echo "5. Build files check..."
if [ -d ".next" ]; then
    echo "✅ Next.js build exists"
    if [ -f ".next/standalone/public/images/aqua-logo.png" ]; then
        echo "✅ Logo copied to standalone build"
    else
        echo "⚠️  Logo not found in standalone build"
    fi
else
    echo "❌ No Next.js build found"
fi

echo ""
echo "🔧 Current configuration:"
echo "  - Logo source: Local image (/images/aqua-logo.png)"
echo "  - Fallback: Text display (AQUA VN)"
echo "  - Used in: Both development and production"
echo ""
echo "💡 Troubleshooting tips:"
echo "1. Ensure public/images/aqua-logo.png exists"
echo "2. Check browser console for image loading errors"
echo "3. Verify Dockerfile copies public/ directory"
echo "4. For standalone builds, ensure public files are copied"
