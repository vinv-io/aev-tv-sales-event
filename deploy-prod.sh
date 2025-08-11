#!/bin/bash

# Production Deployment Script for AEV TV Sales Event
# This script builds and deploys the application using Docker

echo "🚀 Starting production deployment..."

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ Error: .env.prod file not found!"
    echo "Please create .env.prod with your production environment variables."
    exit 1
fi

echo "✅ Environment file found"

# Build the Docker image
echo "🔨 Building Docker image..."
docker compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully"

# Run database migrations
echo "📊 Running database migrations..."
docker compose run --rm app npx dotenv -e .env.prod -- npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "⚠️  Database migration warning - continuing deployment"
fi

# Start the application
echo "🎯 Starting application..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start application!"
    exit 1
fi

echo "✅ Production deployment completed successfully!"
echo "🌐 Application should be available at: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker compose logs -f app"
echo "  - Stop app: docker compose down"
echo "  - Restart: docker compose restart app"
