#!/usr/bin/env tsx

/**
 * Clear All Data Script (Simple Auth)
 * 
 * This script clears all business data from the database.
 * Simple authentication is handled via environment variables.
 * 
 * Business data that will be cleared:
 * - Events
 * - Products  
 * - Customers
 * - Orders
 * - Check-ins
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearBusinessData() {
  console.log('🗑️  Starting database cleanup...');
  console.log('⚠️  This will clear ALL business data');
  console.log('    (Simple authentication is handled via environment variables)');
  
  try {
    // Clear business data in the correct order to handle foreign key constraints
    console.log('📋 Clearing check-ins...');
    const deletedCheckIns = await prisma.checkIn.deleteMany({});
    console.log(`   ✅ Deleted ${deletedCheckIns.count} check-ins`);

    console.log('🛒 Clearing orders...');
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`   ✅ Deleted ${deletedOrders.count} orders`);

    console.log('👥 Clearing customers...');
    const deletedCustomers = await prisma.customer.deleteMany({});
    console.log(`   ✅ Deleted ${deletedCustomers.count} customers`);

    console.log('📦 Clearing products...');
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`   ✅ Deleted ${deletedProducts.count} products`);

    console.log('🎉 Clearing events...');
    const deletedEvents = await prisma.event.deleteMany({});
    console.log(`   ✅ Deleted ${deletedEvents.count} events`);

    console.log('');
    console.log('✅ Database cleanup completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Events: ${deletedEvents.count} deleted`);
    console.log(`   - Products: ${deletedProducts.count} deleted`);
    console.log(`   - Customers: ${deletedCustomers.count} deleted`);
    console.log(`   - Orders: ${deletedOrders.count} deleted`);
    console.log(`   - Check-ins: ${deletedCheckIns.count} deleted`);
    console.log('');
    
    // Simple auth - no admin data in database
    console.log('🔐 Simple admin auth configured via environment variables');
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearBusinessData()
  .then(() => {
    console.log('🎯 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
