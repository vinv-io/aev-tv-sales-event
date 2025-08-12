#!/usr/bin/env tsx

/**
 * Clear All Data Script
 * 
 * Comprehensive script to clear all business data from the database:
 * - Events
 * - Products  
 * - Customers (Shops)
 * - Check-ins
 * - Orders
 * 
 * Features:
 * - Interactive confirmation
 * - Progress tracking
 * - Error handling
 * - Detailed logging
 * - Rollback on failure
 */

import { PrismaClient } from '@prisma/client';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

async function showCurrentStatus() {
  console.log(colorize('📊 Current Database Status', 'cyan'));
  console.log('═'.repeat(50));
  
  try {
    const [events, products, customers, orders, checkIns] = await Promise.all([
      prisma.event.count(),
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.checkIn.count()
    ]);
    
    console.log(colorize('📋 Business Data:', 'white'));
    console.log(`   ${colorize('Events:', 'blue')} ${events}`);
    console.log(`   ${colorize('Products:', 'blue')} ${products}`);
    console.log(`   ${colorize('Customers (Shops):', 'blue')} ${customers}`);
    console.log(`   ${colorize('Orders:', 'blue')} ${orders}`);
    console.log(`   ${colorize('Check-ins:', 'blue')} ${checkIns}`);
    console.log('');
    
    const total = events + products + customers + orders + checkIns;
    console.log(colorize(`📊 Total Records: ${total}`, 'magenta'));
    console.log('');
    
    return { events, products, customers, orders, checkIns, total };
  } catch (error) {
    console.error(colorize('❌ Error reading database status:', 'red'), error);
    throw error;
  }
}

async function askConfirmation(message: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(colorize(message, 'yellow'), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function clearAllData() {
  console.log(colorize('🗑️  Starting data clearing process...', 'yellow'));
  console.log('');
  
  let cleared = {
    checkIns: 0,
    orders: 0,
    customers: 0,
    products: 0,
    events: 0
  };
  
  try {
    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Clear in order to respect foreign key constraints
      console.log(colorize('🔄 Clearing check-ins...', 'blue'));
      const checkInsResult = await tx.checkIn.deleteMany({});
      cleared.checkIns = checkInsResult.count;
      console.log(colorize(`   ✅ Cleared ${cleared.checkIns} check-ins`, 'green'));
      
      console.log(colorize('🔄 Clearing orders...', 'blue'));
      const ordersResult = await tx.order.deleteMany({});
      cleared.orders = ordersResult.count;
      console.log(colorize(`   ✅ Cleared ${cleared.orders} orders`, 'green'));
      
      console.log(colorize('🔄 Clearing customers (shops)...', 'blue'));
      const customersResult = await tx.customer.deleteMany({});
      cleared.customers = customersResult.count;
      console.log(colorize(`   ✅ Cleared ${cleared.customers} customers`, 'green'));
      
      console.log(colorize('🔄 Clearing products...', 'blue'));
      const productsResult = await tx.product.deleteMany({});
      cleared.products = productsResult.count;
      console.log(colorize(`   ✅ Cleared ${cleared.products} products`, 'green'));
      
      console.log(colorize('🔄 Clearing events...', 'blue'));
      const eventsResult = await tx.event.deleteMany({});
      cleared.events = eventsResult.count;
      console.log(colorize(`   ✅ Cleared ${cleared.events} events`, 'green'));
    });
    
    console.log('');
    console.log(colorize('✅ All data cleared successfully!', 'green'));
    console.log('');
    console.log(colorize('📊 Summary:', 'cyan'));
    console.log(`   Check-ins: ${cleared.checkIns}`);
    console.log(`   Orders: ${cleared.orders}`);
    console.log(`   Customers: ${cleared.customers}`);
    console.log(`   Products: ${cleared.products}`);
    console.log(`   Events: ${cleared.events}`);
    console.log(`   ${colorize('Total cleared:', 'magenta')} ${Object.values(cleared).reduce((sum, count) => sum + count, 0)}`);
    
  } catch (error) {
    console.error(colorize('❌ Error during data clearing:', 'red'), error);
    console.error(colorize('🔄 Transaction was rolled back', 'yellow'));
    throw error;
  }
}

async function verifyEmpty() {
  console.log('');
  console.log(colorize('🔍 Verifying database is empty...', 'cyan'));
  
  const status = await showCurrentStatus();
  
  if (status.total === 0) {
    console.log(colorize('✅ Database is completely empty!', 'green'));
  } else {
    console.log(colorize('⚠️  Warning: Some data still remains', 'yellow'));
  }
  
  return status.total === 0;
}

async function main() {
  console.log(colorize('🗑️  CLEAR ALL DATA SCRIPT', 'magenta'));
  console.log('═'.repeat(50));
  console.log('');
  console.log(colorize('This script will clear ALL business data:', 'yellow'));
  console.log('• Events');
  console.log('• Products');
  console.log('• Customers (Shops)');
  console.log('• Orders');
  console.log('• Check-ins');
  console.log('');
  console.log(colorize('⚠️  WARNING: This action cannot be undone!', 'red'));
  console.log('');
  
  try {
    // Show current status
    const status = await showCurrentStatus();
    
    if (status.total === 0) {
      console.log(colorize('ℹ️  Database is already empty. Nothing to clear.', 'blue'));
      return;
    }
    
    // Ask for confirmation
    const confirmed = await askConfirmation('Are you sure you want to clear ALL data? (yes/no): ');
    
    if (!confirmed) {
      console.log(colorize('❌ Operation cancelled by user.', 'yellow'));
      return;
    }
    
    // Double confirmation for safety
    const doubleConfirmed = await askConfirmation(colorize('🚨 FINAL CONFIRMATION: Type "yes" to permanently delete all data: ', 'red'));
    
    if (!doubleConfirmed) {
      console.log(colorize('❌ Operation cancelled. Data preserved.', 'yellow'));
      return;
    }
    
    console.log('');
    console.log(colorize('🚀 Proceeding with data clearing...', 'green'));
    console.log('');
    
    // Clear all data
    await clearAllData();
    
    // Verify empty
    await verifyEmpty();
    
    console.log('');
    console.log(colorize('🎉 Data clearing completed successfully!', 'green'));
    console.log('');
    console.log(colorize('💡 Next steps:', 'cyan'));
    console.log('• You can now seed new data if needed');
    console.log('• Run npm run db:seed to add sample data');
    console.log('• Or start fresh with your own data');
    
  } catch (error) {
    console.error('');
    console.error(colorize('💥 Script failed:', 'red'), error);
    console.error('');
    console.error(colorize('🔧 Troubleshooting:', 'yellow'));
    console.error('• Check database connection');
    console.error('• Verify environment variables');
    console.error('• Check for foreign key constraints');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script termination
process.on('SIGINT', async () => {
  console.log('');
  console.log(colorize('🛑 Script interrupted by user', 'yellow'));
  await prisma.$disconnect();
  process.exit(0);
});

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(colorize('💥 Unexpected error:', 'red'), error);
    process.exit(1);
  });
