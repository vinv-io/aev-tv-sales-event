#!/bin/bash

# Database Migration Script for Production
# Safely migrates the production database

echo "📊 Production Database Migration Script"
echo "======================================="

# Check if .env.prod exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

echo "🔍 Checking database connection..."
npx prisma db pull --preview-feature

if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to database!"
    echo "Please check your DATABASE_URL in .env"
    exit 1
fi

echo "✅ Database connection successful"

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📋 Checking migration status..."
npx prisma migrate status

echo ""
echo "🚀 Applying migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations applied successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "📊 Final migration status:"
npx prisma migrate status
