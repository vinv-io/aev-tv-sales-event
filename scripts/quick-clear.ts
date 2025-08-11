#!/usr/bin/env tsx

/**
 * Quick Clear Data Script
 * 
 * Simple script to quickly clear all business data.
 * Admin authentication handled via environment variables.
 * Perfect for development and testing purposes.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickClear() {
  console.log('🗑️  Quick clearing business data...');
  
  try {
    // Clear in correct order for foreign key constraints
    await prisma.checkIn.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.event.deleteMany({});

    console.log('✅ All business data cleared successfully!');
    console.log('🔐 Simple admin authentication via environment variables.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
quickClear()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
