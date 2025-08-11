const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample data for 2025
const sampleData = {
  events: [
    {
      id: 'event-2025-spring',
      name: JSON.stringify({
        en: 'Spring Product Launch 2025',
        vi: 'Ra Mắt Sản Phẩm Mùa Xuân 2025'
      }),
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-04-15'),
      status: true,
      description: JSON.stringify({
        en: 'Exciting spring product launch with special offers and promotions',
        vi: 'Sự kiện ra mắt sản phẩm mùa xuân với nhiều ưu đãi đặc biệt'
      }),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    }
  ],
  products: [
    {
      id: 'pack-3-premium',
      name: JSON.stringify({
        en: 'Premium Pack 3',
        vi: 'Gói Premium 3'
      }),
      description: JSON.stringify({
        en: 'Essential package with 3 premium items for your daily needs',
        vi: 'Gói thiết yếu với 3 mặt hàng cao cấp cho nhu cầu hàng ngày'
      }),
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    },
    {
      id: 'pack-5-deluxe',
      name: JSON.stringify({
        en: 'Deluxe Pack 5',
        vi: 'Gói Deluxe 5'
      }),
      description: JSON.stringify({
        en: 'Enhanced package with 5 carefully selected items for maximum value',
        vi: 'Gói nâng cao với 5 mặt hàng được lựa chọn kỹ lưỡng cho giá trị tối đa'
      }),
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    }
  ]
};

// Generate check-in records
const generateCheckIns = () => {
  const checkIns = [];
  const eventIds = ['event-2025-spring', 'event-2025-summer'];
  
  sampleData.customers.forEach((customer, index) => {
    // Each customer checks in to both events
    eventIds.forEach(eventId => {
      checkIns.push({
        customerId: customer.id,
        shopName: customer.shopName,
        phone: customer.phone,
        eventId: eventId,
        checkInTime: new Date(2025, Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 28) + 1)
      });
    });
  });
  
  return checkIns.slice(0, 10); // Return only 10 records
};

// Generate order records
const generateOrders = () => {
  const orders = [];
  const productIds = ['pack-3-premium', 'pack-5-deluxe', 'pack-10-ultimate'];
  const prices = { 'pack-3-premium': 150000, 'pack-5-deluxe': 250000, 'pack-10-ultimate': 450000 };
  
  for (let i = 1; i <= 10; i++) {
    const customer = sampleData.customers[i - 1];
    const selectedProducts = [];
    const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products per order
    
    for (let j = 0; j < numProducts; j++) {
      const productId = productIds[Math.floor(Math.random() * productIds.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      selectedProducts.push({
        productId,
        quantity,
        price: prices[productId]
      });
    }
    
    const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    orders.push({
      orderId: `ORD-2025-${String(i).padStart(4, '0')}`,
      shopName: customer.shopName,
      eventId: Math.random() > 0.5 ? 'event-2025-spring' : 'event-2025-summer',
      products: JSON.stringify(selectedProducts),
      total: total,
      orderDate: new Date(2025, Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  
  return orders;
};

async function seedSampleData() {
  try {
    console.log('🌱 Seeding minimal sample data for 2025...');

    // Clear existing data first
    console.log('�️  Clearing existing data...');
    await prisma.checkIn.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.event.deleteMany();

    // Create Events
    console.log('� Creating events...');
    for (const event of sampleData.events) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: event,
        create: event
      });
    }
    console.log(`✅ Created ${sampleData.events.length} event`);

    // Create Products (no prices)
    console.log('� Creating products...');
    for (const product of sampleData.products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      });
    }
    console.log(`✅ Created ${sampleData.products.length} products (Pack 3, Pack 5)`);

    console.log('\n🎉 Minimal sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${sampleData.events.length} Event (Spring 2025)`);
    console.log(`   • ${sampleData.products.length} Products (Pack 3, Pack 5) - No prices`);
    console.log(`   • 0 Customers`);
    console.log(`   • 0 Check-in records`);
    console.log(`   • 0 Order records`);

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSampleData()
  .then(() => {
    console.log('\n✨ Done! Minimal sample data ready for testing.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
