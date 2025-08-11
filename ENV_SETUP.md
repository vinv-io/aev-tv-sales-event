# Environment Variables Configuration

This project uses separate environment files for development and production environments.

## Environment Files Structure

- **`.env.dev`** - Development environment (used with `npm run dev`)
- **`.env.prod`** - Production environment (used with `npm run build` and `npm start`)
- **`.env.example`** - Template file showing required variables

## Setup Instructions

### For Development:
1. Copy `.env.example` to `.env.dev`
2. Update the values in `.env.dev` with your development configuration
3. Run `npm run dev` to start development server

### For Production:
1. Copy `.env.example` to `.env.prod`
2. Update the values in `.env.prod` with your production configuration
3. Run `npm run build` then `npm start` for production

## .env.dev (Development Configuration)
```env
# Data source configuration
DATA_SOURCE=prisma

# Admin authentication credentials (development)
ADMIN_EMAIL=admin
ADMIN_PASSWORD=admin123

# JWT secret for admin sessions (development only)
ADMIN_JWT_SECRET=your-development-jwt-secret

# Node environment
NODE_ENV=development

# Next.js configuration (development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database connection (PostgreSQL for development)
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
DIRECT_URL="postgresql://user:password@localhost:5432/mydatabase"
```

## .env.prod (Production Configuration)
```env
# Data source configuration
DATA_SOURCE=prisma

# Admin authentication credentials (production)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-production-password

# JWT secret for admin sessions (CRITICAL: Use strong secret in production!)
ADMIN_JWT_SECRET=your-super-secure-production-jwt-secret

# Node environment
NODE_ENV=production

# Next.js configuration (production)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database connection (PostgreSQL for production)
DATABASE_URL="postgresql://user:password@production-host:5432/mydatabase"
DIRECT_URL="postgresql://user:password@production-host:5432/mydatabase"
```
```env
# Database connection for Prisma CLI commands
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
```

## Production Setup

For production deployment, update the following:

1. **Change admin credentials**:
   - Set a secure `ADMIN_EMAIL` 
   - Set a strong `ADMIN_PASSWORD`

2. **Update JWT secret**:
   - Set a strong, unique `ADMIN_JWT_SECRET`

3. **Database configuration**:
   - Update `DATABASE_URL` to point to your production database
   - For PostgreSQL: `postgresql://username:password@host:port/database`

4. **Environment settings**:
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use different credentials for development and production
- Keep your JWT secret secure and unique
- Consider using environment variable management services for production

## Authentication System

The app now uses a simplified authentication system:
- Single admin user configured via environment variables
- JWT-based sessions
- No complex role management or database-stored users
- Simple login at `/admin/login`

## Default Login

For development, you can log in with:
- **Email**: admin@aquavn.com
- **Password**: admin123

Change these credentials in the `.env.local` file as needed.
