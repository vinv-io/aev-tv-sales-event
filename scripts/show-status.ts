#!/usr/bin/env tsx

/**
 * Database Status Script
 * 
 * Shows the current state of the database without making any changes.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showStatus() {
  console.log('📊 Database Status Report');
  console.log('════════════════════════════════════════');
  
  try {
    // Count business data
    const events = await prisma.event.count();
    const products = await prisma.product.count();
    const customers = await prisma.customer.count();
    const orders = await prisma.order.count();
    const checkIns = await prisma.checkIn.count();
    
    // Admin tables removed - using simple auth
    console.log('📋 Business Data:');
    console.log(`   Events: ${events}`);
    console.log(`   Products: ${products}`);
    console.log(`   Customers: ${customers}`);
    console.log(`   Orders: ${orders}`);
    console.log(`   Check-ins: ${checkIns}`);
    console.log('');
    console.log('🔐 Simple admin auth configured via environment variables');
    console.log('');
    
    const totalBusiness = events + products + customers + orders + checkIns;
    
    console.log('📈 Summary:');
    console.log(`   Total Business Records: ${totalBusiness}`);
    console.log(`   Total Database Records: ${totalBusiness}`);
    
    if (totalBusiness === 0) {
      console.log('');
      console.log('ℹ️  No business data found. Database is clean for development.');
    }
    
  } catch (error) {
    console.error('❌ Error reading database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
showStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
