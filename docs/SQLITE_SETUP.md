# SQLite Development Setup - Migration Complete

## Overview
Successfully migrated from mock data to SQLite for development mode. This provides a real database experience while keeping development simple and fast.

## What Was Implemented

### 1. **Prisma Schema Updates**
- **Updated datasource**: Changed from PostgreSQL to SQLite
- **Removed database-specific constraints**: Removed `@db.VarChar()` attributes for SQLite compatibility
- **JSON field handling**: Converted JSON fields to String fields for SQLite compatibility

### 2. **Database Schema Structure**
```sql
-- Events table with localized names
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    name TEXT, -- JSON string for LocalizedString
    type TEXT,
    start_date TEXT,
    end_date TEXT,
    status BOOLEAN
);

-- Products table with localized content
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT, -- JSON string for LocalizedString  
    description TEXT, -- JSON string for LocalizedString
    image TEXT,
    ai_hint TEXT
);

-- And more tables for customers, orders, check_ins...
```

### 3. **Data Access Layer Updates**
- **Updated `postgres.ts`**: Modified to handle JSON serialization/deserialization for SQLite
- **JSON handling**: Added `JSON.parse()` and `JSON.stringify()` for storing complex data in text fields
- **Maintained compatibility**: All function signatures remain the same

### 4. **Database Seeding**
- **Created `prisma/seed.ts`**: Comprehensive seed script with sample data
- **Sample data includes**: 
  - 3 events (Summer Sale, Tet Holiday Promo, Black Friday)
  - 6 products (Air conditioner, Refrigerator, TV, etc.)
  - 3 customers/shops
  - 3 sample orders
  - Check-in records

### 5. **Configuration Updates**
- **Environment variables**: 
  ```
  DATA_SOURCE=prisma
  DATABASE_URL="file:./prisma/dev.db"
  ```
- **Package.json**: Added seed script configuration
- **Dependencies**: Added `tsx` for TypeScript execution

## File Structure
```
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Seed script
│   ├── dev.db               # SQLite database file
│   └── migrations/          # Database migrations
├── .env.local               # Environment configuration
└── src/lib/data/
    ├── prisma.ts           # Prisma client setup
    └── postgres.ts         # Updated data access layer
```

## How to Use

### **Development Commands**
```bash
# Start development server
npm run dev

# View database with Prisma Studio
npm run db:studio

# Reset and reseed database
npx prisma migrate reset

# Generate Prisma client after schema changes
npm run db:generate
```

### **Database Operations**
```bash
# Create new migration
npx prisma migrate dev --name description

# Push schema changes without migration
npm run db:push

# Seed database
npm run db:seed
```

## Benefits of SQLite Setup

### **For Development:**
- ✅ **No setup required**: No PostgreSQL installation needed
- ✅ **Fast and lightweight**: SQLite runs in-process
- ✅ **Realistic data**: Real database operations vs mock data
- ✅ **Persistence**: Data survives app restarts
- ✅ **Visual debugging**: Prisma Studio for database exploration

### **For Testing:**
- ✅ **Isolated**: Each developer has their own database
- ✅ **Reproducible**: Easy to reset to known state
- ✅ **Version controlled**: Schema migrations tracked in git

### **For Production:**
- ✅ **Easy migration**: Can switch to PostgreSQL for production
- ✅ **Same API**: Prisma provides consistent interface across databases
- ✅ **Schema validation**: Prisma ensures schema compatibility

## Current Status
- ✅ **Application running on http://localhost:9002**
- ✅ **SQLite database created and seeded**
- ✅ **Prisma Studio available on http://localhost:5555**
- ✅ **All CRUD operations working**
- ✅ **JSON data properly serialized/deserialized**

## Next Steps (Optional)
1. **Production Setup**: Create PostgreSQL schema for production deployment
2. **Data Migration**: Create scripts to migrate from SQLite to PostgreSQL
3. **Environment Switching**: Add scripts to easily switch between databases
4. **Backup/Restore**: Add utilities for database backup and restore

## Architecture Summary

**Development Flow:**
```
Request → Actions.ts → postgres.ts → Prisma → SQLite → Response
```

**Data Source Selection:**
- `DATA_SOURCE=mock` → Uses mock data (in-memory)
- `DATA_SOURCE=prisma` → Uses Prisma with SQLite (persistent)
- Future: `DATA_SOURCE=postgres` → Production PostgreSQL

This setup provides the best of both worlds: the simplicity of local development with the realism of a proper database.

## Troubleshooting

### Database Connection Error: "Unable to open the database file"

**Problem**: Getting error `Error code 14: Unable to open the database file` when running the application.

**Root Cause**: The `DATABASE_URL` environment variable is not available to Prisma CLI commands. While Next.js reads from `.env.local`, Prisma CLI requires a `.env` file.

**Solution**:
1. Create a `.env` file in the project root:
   ```bash
   echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
   ```

2. Initialize the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

**Verification**: 
- ✅ No database errors in console
- ✅ Application loads correctly at http://localhost:9002
- ✅ Data is displayed on the homepage

### Environment File Configuration

**For Next.js** (`.env.local`):
```bash
DATA_SOURCE=prisma
DATABASE_URL="file:./prisma/dev.db"
```

**For Prisma CLI** (`.env`):
```bash
DATABASE_URL="file:./prisma/dev.db"
```

Both files are needed because Next.js and Prisma CLI load environment variables differently.
