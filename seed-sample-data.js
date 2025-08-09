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
      type: 'seasonal',
      startDate: '2025-03-15',
      endDate: '2025-04-15',
      status: true,
      description: JSON.stringify({
        en: 'Exciting spring product launch with special offers and promotions',
        vi: 'Sự kiện ra mắt sản phẩm mùa xuân với nhiều ưu đãi đặc biệt'
      }),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      aiHint: 'Spring themed product launch event with fresh and vibrant atmosphere'
    },
    {
      id: 'event-2025-summer',
      name: JSON.stringify({
        en: 'Summer Sales Festival 2025',
        vi: 'Lễ Hội Mua Sắm Mùa Hè 2025'
      }),
      type: 'flash_sale',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      status: true,
      description: JSON.stringify({
        en: 'Massive summer sales with up to 50% discount on selected products',
        vi: 'Đại hội giảm giá mùa hè với mức giảm lên đến 50% cho các sản phẩm được chọn'
      }),
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      aiHint: 'Summer sales festival with hot deals and promotional activities'
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
      aiHint: 'Premium quality package with 3 essential items'
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
      aiHint: 'Deluxe quality package with 5 premium selected items'
    },
    {
      id: 'pack-10-ultimate',
      name: JSON.stringify({
        en: 'Ultimate Pack 10',
        vi: 'Gói Ultimate 10'
      }),
      description: JSON.stringify({
        en: 'Complete package with 10 top-tier items for the ultimate experience',
        vi: 'Gói hoàn chỉnh với 10 mặt hàng hàng đầu cho trải nghiệm tuyệt vời nhất'
      }),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      aiHint: 'Ultimate luxury package with 10 top-tier premium items'
    }
  ],
  customers: [
    { id: 'cust-001', phone: '+84901234567', shopName: 'Cửa hàng Hoa Mai', joined: '2024-01-15' },
    { id: 'cust-002', phone: '+84902345678', shopName: 'Shop Tiện Lợi 24h', joined: '2024-02-20' },
    { id: 'cust-003', phone: '+84903456789', shopName: 'Siêu thị Mini Tâm An', joined: '2024-03-10' },
    { id: 'cust-004', phone: '+84904567890', shopName: 'Cửa hàng Phương Nam', joined: '2024-04-05' },
    { id: 'cust-005', phone: '+84905678901', shopName: 'Shop Gia Đình Việt', joined: '2024-05-12' },
    { id: 'cust-006', phone: '+84906789012', shopName: 'Cửa hàng Sạch & Xanh', joined: '2024-06-08' },
    { id: 'cust-007', phone: '+84907890123', shopName: 'Mini Mart Đông Dương', joined: '2024-07-18' },
    { id: 'cust-008', phone: '+84908901234', shopName: 'Shop Thực Phẩm Organic', joined: '2024-08-02' },
    { id: 'cust-009', phone: '+84909012345', shopName: 'Cửa hàng Bình Minh', joined: '2024-08-15' },
    { id: 'cust-010', phone: '+84910123456', shopName: 'Siêu thị Hoàng Gia', joined: '2024-08-25' }
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
    console.log('🌱 Seeding sample data for 2025...');

    // Create Events
    console.log('📅 Creating events...');
    for (const event of sampleData.events) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: event,
        create: event
      });
    }
    console.log(`✅ Created ${sampleData.events.length} events`);

    // Create Products  
    console.log('📦 Creating products...');
    for (const product of sampleData.products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      });
    }
    console.log(`✅ Created ${sampleData.products.length} products`);

    // Create Customers
    console.log('👥 Creating customers...');
    for (const customer of sampleData.customers) {
      await prisma.customer.upsert({
        where: { id: customer.id },
        update: customer,
        create: customer
      });
    }
    console.log(`✅ Created ${sampleData.customers.length} customers`);

    // Create Check-ins
    console.log('✅ Creating check-in records...');
    const checkIns = generateCheckIns();
    for (const checkIn of checkIns) {
      await prisma.checkIn.upsert({
        where: {
          customerId_eventId: {
            customerId: checkIn.customerId,
            eventId: checkIn.eventId
          }
        },
        update: checkIn,
        create: checkIn
      });
    }
    console.log(`✅ Created ${checkIns.length} check-in records`);

    // Create Orders
    console.log('🛒 Creating order records...');
    const orders = generateOrders();
    for (const order of orders) {
      await prisma.order.upsert({
        where: { orderId: order.orderId },
        update: order,
        create: order
      });
    }
    console.log(`✅ Created ${orders.length} order records`);

    console.log('\n🎉 Sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${sampleData.events.length} Events (Spring & Summer 2025)`);
    console.log(`   • ${sampleData.products.length} Products (Pack 3, Pack 5, Pack 10)`);
    console.log(`   • ${sampleData.customers.length} Customers (Vietnamese shops)`);
    console.log(`   • ${checkIns.length} Check-in records`);
    console.log(`   • ${orders.length} Order records`);

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSampleData()
  .then(() => {
    console.log('\n✨ Done! You can now test the application with sample data.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
