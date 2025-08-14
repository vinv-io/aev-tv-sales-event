#!/bin/bash

# Docker build script with error handling
set -e

echo "🐳 Starting Docker build process..."

# Clean up any previous builds
echo "🧹 Cleaning up previous builds..."
docker system prune -f

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t aev-tv-sales-event:latest . \
  --progress=plain \
  --no-cache \
  2>&1 | tee docker-build.log

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
    echo "📝 Build log saved to docker-build.log"
    
    # Optional: Run the container to test
    read -p "🚀 Do you want to run the container now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting container..."
        docker run -p 3000:3000 aev-tv-sales-event:latest
    fi
else
    echo "❌ Docker build failed! Check docker-build.log for details."
    exit 1
fi
