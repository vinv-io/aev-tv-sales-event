#!/usr/bin/env tsx

/**
 * Show Database Status and Clear Data Script
 * 
 * This script first shows the current state of the database,
 * then clears all business data. Simple auth via environment variables.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showDatabaseStatus() {
  console.log('📊 Current Database Status:');
  console.log('════════════════════════════════════════');
  
  try {
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
    
    return {
      business: { events, products, customers, orders, checkIns },
      admin: { authType: 'simple-env-based' }
    };
  } catch (error) {
    console.error('❌ Error reading database status:', error);
    throw error;
  }
}

async function clearBusinessDataWithConfirmation() {
  const status = await showDatabaseStatus();
  
  const totalBusinessRecords = Object.values(status.business).reduce((sum, count) => sum + count, 0);
  
  if (totalBusinessRecords === 0) {
    console.log('ℹ️  No business data found to clear.');
    return;
  }
  
  console.log(`⚠️  About to clear ${totalBusinessRecords} business records.`);
  console.log('');
  
  // Proceed with clearing
  console.log('🗑️  Starting data cleanup...');
  
  try {
    // Clear in correct order for foreign key constraints
    console.log('📋 Clearing check-ins...');
    const deletedCheckIns = await prisma.checkIn.deleteMany({});
    console.log(`   ✅ ${deletedCheckIns.count} check-ins deleted`);

    console.log('🛒 Clearing orders...');
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`   ✅ ${deletedOrders.count} orders deleted`);

    console.log('👥 Clearing customers...');
    const deletedCustomers = await prisma.customer.deleteMany({});
    console.log(`   ✅ ${deletedCustomers.count} customers deleted`);

    console.log('📦 Clearing products...');
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`   ✅ ${deletedProducts.count} products deleted`);

    console.log('🎉 Clearing events...');
    const deletedEvents = await prisma.event.deleteMany({});
    console.log(`   ✅ ${deletedEvents.count} events deleted`);

    console.log('');
    console.log('✅ Cleanup completed successfully!');
    console.log('');
    
    // Show final status
    await showDatabaseStatus();
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run the script
clearBusinessDataWithConfirmation()
  .then(() => {
    console.log('🎯 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
