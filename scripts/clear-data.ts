#!/usr/bin/env tsx

/**
 * Clear All Data Script (Preserving Admin Users)
 * 
 * This script clears all business data from the database while preserving:
 * - Admin users and authentication data
 * - Admin roles and permissions
 * - NextAuth.js sessions and accounts
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
  console.log('⚠️  This will clear ALL business data but preserve admin users');
  
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
    
    // Verify admin data is preserved
    const adminUsers = await prisma.adminUser.count();
    const adminRoles = await prisma.adminRole.count();
    console.log('🔐 Admin data preserved:');
    console.log(`   - Admin users: ${adminUsers} preserved`);
    console.log(`   - Admin roles: ${adminRoles} preserved`);
    
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
