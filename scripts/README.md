# Database Management Scripts

This directory contains scripts for managing the database data, specifically for clearing business data while preserving admin users and authentication data.

## Available Scripts

### Quick Commands (via npm)

```bash
# Show current database status
npm run db:status

# Quick clear (minimal output)
npm run db:clear

# Detailed clear with confirmation
npm run db:clear-detailed

# Comprehensive clear with full logging
npm run db:clear-all
npm run db:status

# Quick clear all business data (preserves admin users)
npm run db:clear

# Detailed clear with before/after status
npm run db:clear-detailed

# Seed database with test data
npm run db:seed
```

### Direct Script Execution

```bash
# Show database status
npx tsx scripts/show-status.ts

# Quick clear business data
npx tsx scripts/quick-clear.ts

# Detailed clear with status report
npx tsx scripts/show-and-clear-data.ts

# Basic clear script
npx tsx scripts/clear-data.ts
```

## What Gets Cleared

### Business Data (CLEARED)
- ✅ Events
- ✅ Products  
- ✅ Customers
- ✅ Orders
- ✅ Check-ins

### Admin Data (PRESERVED)
- 🔐 Admin Users
- 🔐 Admin Roles & Permissions
- 🔐 Authentication Accounts
- 🔐 Active Sessions
- 🔐 Verification Tokens

## Script Details

### `show-status.ts`
- Shows current database record counts
- Read-only operation
- Useful for monitoring data state

### `quick-clear.ts`
- Fast clearing of all business data
- No confirmation prompts
- Preserves admin users
- Perfect for development reset

### `show-and-clear-data.ts`
- Shows before/after database status
- Detailed reporting of what was cleared
- Good for understanding data impact

### `clear-data.ts`
- Basic clearing script with summary
- Comprehensive error handling
- Detailed logging of operations

## Usage Examples

```bash
# Check what's in the database
npm run db:status

# Add some test data
npm run db:seed

# Clear all business data for fresh start
npm run db:clear

# Verify it's clean
npm run db:status
```

## Safety Features

- ✅ Admin users are always preserved
- ✅ Authentication data remains intact
- ✅ Foreign key constraints respected (proper deletion order)
- ✅ Error handling with rollback
- ✅ Clear logging of all operations

## Development Workflow

1. **Start fresh**: `npm run db:clear`
2. **Add test data**: `npm run db:seed`
3. **Develop/test features**
4. **Reset when needed**: `npm run db:clear`

Perfect for development, testing, and demos!
