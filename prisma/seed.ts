import { PrismaClient } from '@prisma/client';
import { seedAdminAuth } from './seed-admin';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.checkIn.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  
  // Clear admin data and re-seed
  await prisma.adminUser.deleteMany();
  await prisma.adminRole.deleteMany();

  console.log('🌱 Seeding database with new sample data...');

  // Seed admin authentication first
  await seedAdminAuth();

  // Seed 2 Events in 2025
  const events = [
    {
      id: 'SPRING2025_PROMO',
      name: JSON.stringify({ 
        en: 'Spring 2025 Package Promotion', 
        vi: 'Khuyến mãi gói sản phẩm Xuân 2025' 
      }),
      description: JSON.stringify({
        en: 'Spring promotion with attractive packages for dealers and retailers.',
        vi: 'Chương trình khuyến mãi mùa xuân với các gói sản phẩm hấp dẫn dành cho đại lý và nhà bán lẻ.'
      }),
      image: 'https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg',
      aiHint: 'spring promotion package deals retailers',
      startDate: '2025-03-01',
      endDate: '2025-05-31',
      status: true,
    },
    {
      id: 'SUMMER2025_SPECIAL',
      name: JSON.stringify({ 
        en: 'Summer 2025 Special Campaign', 
        vi: 'Chiến dịch đặc biệt Hè 2025' 
      }),
      description: JSON.stringify({
        en: 'Summer special campaign with exclusive packages and bonuses for high-volume purchases.',
        vi: 'Chiến dịch đặc biệt mùa hè với các gói độc quyền và thưởng cho mua số lượng lớn.'
      }),
      image: 'https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg',
      aiHint: 'summer special campaign exclusive packages bonuses',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      status: true,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }

  // Seed 3 Products: Pack 3, Pack 5, Pack 7
  const products = [
    {
      id: 'PACK_3',
      name: JSON.stringify({ 
        en: 'Pack 3 - Starter Bundle', 
        vi: 'Gói 3 - Gói khởi động' 
      }),
      description: JSON.stringify({ 
        en: 'Entry-level package with 3 essential products for small retailers. Perfect for new partners starting their business.', 
        vi: 'Gói sản phẩm cơ bản với 3 sản phẩm thiết yếu cho nhà bán lẻ nhỏ. Hoàn hảo cho đối tác mới bắt đầu kinh doanh.' 
      }),
      image: 'https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg',
      aiHint: 'starter bundle 3 products entry level small retailers',
    },
    {
      id: 'PACK_5',
      name: JSON.stringify({ 
        en: 'Pack 5 - Growth Package', 
        vi: 'Gói 5 - Gói phát triển' 
      }),
      description: JSON.stringify({ 
        en: 'Balanced package with 5 popular products for medium-sized retailers. Great value with diverse product mix.', 
        vi: 'Gói sản phẩm cân bằng với 5 sản phẩm phổ biến cho nhà bán lẻ trung bình. Giá trị tốt với sự đa dạng sản phẩm.' 
      }),
      image: 'https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg',
      aiHint: 'growth package 5 products balanced medium retailers',
    },
    {
      id: 'PACK_7',
      name: JSON.stringify({ 
        en: 'Pack 7 - Premium Collection', 
        vi: 'Gói 7 - Bộ sưu tập cao cấp' 
      }),
      description: JSON.stringify({ 
        en: 'Premium package with 7 high-demand products for large retailers. Maximum profit potential with comprehensive coverage.', 
        vi: 'Gói cao cấp với 7 sản phẩm có nhu cầu cao cho nhà bán lẻ lớn. Tiềm năng lợi nhuận tối đa với bao phủ toàn diện.' 
      }),
      image: 'https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg',
      aiHint: 'premium collection 7 products high demand large retailers',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }

  // Seed 10 Customers for Check-ins
  const customers = [
    { id: 'CUST_001', phone: '0901234567', shopName: 'Electronics Plus Store', joined: '2024-12-15' },
    { id: 'CUST_002', phone: '0907654321', shopName: 'Smart Home Solutions', joined: '2024-11-20' },
    { id: 'CUST_003', phone: '0912345678', shopName: 'Tech World Vietnam', joined: '2024-10-05' },
    { id: 'CUST_004', phone: '0923456789', shopName: 'Digital Life Store', joined: '2025-01-10' },
    { id: 'CUST_005', phone: '0934567890', shopName: 'Modern Appliances Hub', joined: '2024-09-25' },
    { id: 'CUST_006', phone: '0945678901', shopName: 'Innovation Electronics', joined: '2025-02-01' },
    { id: 'CUST_007', phone: '0956789012', shopName: 'Future Tech Mart', joined: '2024-08-18' },
    { id: 'CUST_008', phone: '0967890123', shopName: 'Premium Electronics Co', joined: '2024-12-30' },
    { id: 'CUST_009', phone: '0978901234', shopName: 'Smart Living Store', joined: '2025-01-25' },
    { id: 'CUST_010', phone: '0989012345', shopName: 'Tech Paradise Vietnam', joined: '2024-11-12' },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
  }

  // Seed 10 Check-in Records
  const checkIns = [
    { customerId: 'CUST_001', shopName: 'Electronics Plus Store', phone: '0901234567', eventId: 'SPRING2025_PROMO' },
    { customerId: 'CUST_002', shopName: 'Smart Home Solutions', phone: '0907654321', eventId: 'SPRING2025_PROMO' },
    { customerId: 'CUST_003', shopName: 'Tech World Vietnam', phone: '0912345678', eventId: 'SUMMER2025_SPECIAL' },
    { customerId: 'CUST_004', shopName: 'Digital Life Store', phone: '0923456789', eventId: 'SPRING2025_PROMO' },
    { customerId: 'CUST_005', shopName: 'Modern Appliances Hub', phone: '0934567890', eventId: 'SUMMER2025_SPECIAL' },
    { customerId: 'CUST_006', shopName: 'Innovation Electronics', phone: '0945678901', eventId: 'SPRING2025_PROMO' },
    { customerId: 'CUST_007', shopName: 'Future Tech Mart', phone: '0956789012', eventId: 'SUMMER2025_SPECIAL' },
    { customerId: 'CUST_008', shopName: 'Premium Electronics Co', phone: '0967890123', eventId: 'SPRING2025_PROMO' },
    { customerId: 'CUST_009', shopName: 'Smart Living Store', phone: '0978901234', eventId: 'SUMMER2025_SPECIAL' },
    { customerId: 'CUST_010', shopName: 'Tech Paradise Vietnam', phone: '0989012345', eventId: 'SPRING2025_PROMO' },
  ];

  for (const checkIn of checkIns) {
    await prisma.checkIn.create({
      data: checkIn,
    });
  }

  // Seed 10 Sale Orders
  const orders = [
    {
      orderId: 'ORD_001',
      shopName: 'Electronics Plus Store',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_3', quantity: 2, total: 30000000 }
      ]),
      total: 30000000,
      orderDate: '2025-03-15',
    },
    {
      orderId: 'ORD_002',
      shopName: 'Smart Home Solutions',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_5', quantity: 1, total: 25000000 }
      ]),
      total: 25000000,
      orderDate: '2025-03-18',
    },
    {
      orderId: 'ORD_003',
      shopName: 'Tech World Vietnam',
      eventId: 'SUMMER2025_SPECIAL',
      products: JSON.stringify([
        { productId: 'PACK_7', quantity: 1, total: 35000000 }
      ]),
      total: 35000000,
      orderDate: '2025-06-10',
    },
    {
      orderId: 'ORD_004',
      shopName: 'Digital Life Store',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_3', quantity: 1, total: 15000000 },
        { productId: 'PACK_5', quantity: 1, total: 25000000 }
      ]),
      total: 40000000,
      orderDate: '2025-03-22',
    },
    {
      orderId: 'ORD_005',
      shopName: 'Modern Appliances Hub',
      eventId: 'SUMMER2025_SPECIAL',
      products: JSON.stringify([
        { productId: 'PACK_7', quantity: 2, total: 70000000 }
      ]),
      total: 70000000,
      orderDate: '2025-06-15',
    },
    {
      orderId: 'ORD_006',
      shopName: 'Innovation Electronics',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_5', quantity: 2, total: 50000000 }
      ]),
      total: 50000000,
      orderDate: '2025-04-01',
    },
    {
      orderId: 'ORD_007',
      shopName: 'Future Tech Mart',
      eventId: 'SUMMER2025_SPECIAL',
      products: JSON.stringify([
        { productId: 'PACK_3', quantity: 3, total: 45000000 }
      ]),
      total: 45000000,
      orderDate: '2025-06-20',
    },
    {
      orderId: 'ORD_008',
      shopName: 'Premium Electronics Co',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_7', quantity: 1, total: 35000000 },
        { productId: 'PACK_3', quantity: 1, total: 15000000 }
      ]),
      total: 50000000,
      orderDate: '2025-04-10',
    },
    {
      orderId: 'ORD_009',
      shopName: 'Smart Living Store',
      eventId: 'SUMMER2025_SPECIAL',
      products: JSON.stringify([
        { productId: 'PACK_5', quantity: 3, total: 75000000 }
      ]),
      total: 75000000,
      orderDate: '2025-07-01',
    },
    {
      orderId: 'ORD_010',
      shopName: 'Tech Paradise Vietnam',
      eventId: 'SPRING2025_PROMO',
      products: JSON.stringify([
        { productId: 'PACK_3', quantity: 1, total: 15000000 },
        { productId: 'PACK_5', quantity: 1, total: 25000000 },
        { productId: 'PACK_7', quantity: 1, total: 35000000 }
      ]),
      total: 75000000,
      orderDate: '2025-05-15',
    },
  ];

  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }

  console.log('✅ Database seeded successfully with new sample data!');
  console.log('📊 Summary:');
  console.log('   - 2 Events (Spring 2025 & Summer 2025)');
  console.log('   - 3 Products (Pack 3, Pack 5, Pack 7)');
  console.log('   - 10 Customers');
  console.log('   - 10 Check-in records');
  console.log('   - 10 Sale orders');
  console.log('   - Admin authentication system');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
