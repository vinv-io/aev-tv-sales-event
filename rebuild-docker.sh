#!/bin/bash

echo "🔄 Rebuilding Docker container for production..."

# Stop any running containers
docker-compose down

# Remove old images to force rebuild
docker-compose build --no-cache

# Start the container
docker-compose up -d

echo "✅ Docker container rebuilt and started!"
echo "🌐 Your app should be available at: https://tv-event-v1.aqua.io.vn"

# Show logs
echo "📝 Showing container logs..."
docker-compose logs -f
