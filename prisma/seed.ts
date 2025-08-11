import { PrismaClient } from '@prisma/client';
// Admin auth seeding is not needed with simple auth

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.checkIn.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  
  // Admin tables removed - using simple auth
  console.log('🌱 Seeding database with new sample data...');

  // Simple auth - no admin seeding needed
  console.log('📝 Simple admin auth configured via environment variables');

  // Seed 1 Event in 2025
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
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-05-31'),
      status: true,
    }
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }

  // Seed 2 Products: Pack 3, Pack 5
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
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }

  console.log('✅ Database seeded successfully with new sample data!');
  console.log('📊 Summary:');
  console.log('   - 1 Event (Spring 2025)');
  console.log('   - 2 Products (Pack 3, Pack 5)');
  console.log('   - 0 Customers');
  console.log('   - 0 Check-in records');
  console.log('   - 0 Sale orders');
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
