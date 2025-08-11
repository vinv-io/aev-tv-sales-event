# Environment Variables Configuration

This project requires environment variables to be configured for proper operation. Two files are needed:

## .env.local (for Next.js)
```env
# Data source configuration
DATA_SOURCE=prisma

# Database connection (PostgreSQL for development)
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"

# Admin authentication credentials
ADMIN_EMAIL=admin@aquavn.com
ADMIN_PASSWORD=admin123

# JWT secret for admin sessions (change this in production!)
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key-change-this-in-production

# Node environment
NODE_ENV=development

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## .env (for Prisma CLI)
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
