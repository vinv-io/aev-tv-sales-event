# Production Deployment Guide

This guide covers deploying the AEV TV Sales Event application to production using Docker.

## Prerequisites

- Docker and Docker Compose installed
- `.env.prod` file configured with production values
- Access to production database (Supabase)

## Environment Setup

1. **Create `.env.prod`** with the following variables:
   ```bash
   # PRODUCTION ENVIRONMENT VARIABLES
   DATA_SOURCE=prisma
   ADMIN_EMAIL=admin@aqua.io.vn
   ADMIN_PASSWORD=your_secure_password
   ADMIN_JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   DATABASE_URL=your_production_database_url
   DIRECT_URL=your_direct_database_url
   ```

## Manual Deployment

### Option 1: Using Deployment Script (Recommended)

```bash
# Linux/macOS
./deploy-prod.sh

# Windows PowerShell
.\deploy-prod.ps1
```

### Option 2: Manual Steps

1. **Build the Docker image:**
   ```bash
   docker compose build --no-cache
   ```

2. **Run database migrations:**
   ```bash
   docker compose run --rm app npx dotenv -e .env.prod -- npx prisma migrate deploy
   ```

3. **Start the application:**
   ```bash
   docker compose up -d
   ```

## GitHub Actions Auto-Deployment

The application will automatically deploy when you push to the `main` branch. Ensure these secrets are configured in your GitHub repository:

- `VPS_HOST` - Your VPS IP address
- `VPS_USER` - SSH username
- `VPS_SSH_KEY` - SSH private key
- `ADMIN_EMAIL` - Production admin email
- `ADMIN_PASSWORD` - Production admin password  
- `ADMIN_JWT_SECRET` - JWT secret for sessions
- `NEXT_PUBLIC_APP_URL` - Your production URL
- `DATABASE_URL` - Production database connection
- `DIRECT_URL` - Direct database connection

## Database Management

### Run Migrations Only
```bash
./migrate-prod.sh
```

### Reset Database (DANGER!)
```bash
npx dotenv -e .env.prod -- npx prisma migrate reset
```

## Monitoring and Maintenance

### View Logs
```bash
docker compose logs -f app
```

### Restart Application
```bash
docker compose restart app
```

### Stop Application
```bash
docker compose down
```

### Update Application
```bash
git pull origin main
./deploy-prod.sh
```

## Troubleshooting

### Build Issues
- Ensure `.env.prod` exists and is properly formatted
- Check Docker build logs: `docker compose build`

### Database Connection Issues
- Verify `DATABASE_URL` and `DIRECT_URL` in `.env.prod`
- Test connection: `npx dotenv -e .env.prod -- npx prisma db pull`

### Application Not Starting
- Check logs: `docker compose logs app`
- Verify port 3000 is not in use
- Ensure all environment variables are set

## Security Considerations

1. **Environment Variables:**
   - Use strong, unique values for `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET`
   - Never commit `.env.prod` to version control

2. **Database:**
   - Use connection pooling (Supabase pgBouncer)
   - Regularly backup your database

3. **Application:**
   - The app runs with security headers enabled
   - Admin authentication is required for management functions

## Performance Optimization

1. **Docker:**
   - Built with multi-stage Docker for smaller image size
   - Uses Node.js Alpine for minimal footprint

2. **Next.js:**
   - Built in standalone mode for production
   - Static assets are properly cached
   - Images are optimized with Next.js Image component

3. **Database:**
   - Uses Prisma connection pooling
   - Optimized queries for better performance
