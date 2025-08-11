# Production Deployment Script for AEV TV Sales Event (PowerShell)
# This script builds and deploys the application using Docker

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Check if .env.prod exists
if (-not (Test-Path ".env.prod")) {
    Write-Host "❌ Error: .env.prod file not found!" -ForegroundColor Red
    Write-Host "Please create .env.prod with your production environment variables." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green

# Build the Docker image
Write-Host "🔨 Building Docker image..." -ForegroundColor Blue
docker compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker image built successfully" -ForegroundColor Green

# Run database migrations
Write-Host "📊 Running database migrations..." -ForegroundColor Blue
docker compose run --rm app npx dotenv -e .env.prod -- npx prisma migrate deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database migration warning - continuing deployment" -ForegroundColor Yellow
}

# Start the application
Write-Host "🎯 Starting application..." -ForegroundColor Blue
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start application!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Production deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Application should be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "  - View logs: docker compose logs -f app" -ForegroundColor White
Write-Host "  - Stop app: docker compose down" -ForegroundColor White
Write-Host "  - Restart: docker compose restart app" -ForegroundColor White
