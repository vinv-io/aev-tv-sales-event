const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrder() {
  try {
    console.log('🔍 Checking for order: ORD1754745654255');
    
    const order = await prisma.order.findUnique({
      where: { orderId: 'ORD1754745654255' }
    });
    
    if (order) {
      console.log('\n✅ Order found:');
      console.log('Order ID:', order.orderId);
      console.log('Shop Name:', order.shopName);
      console.log('Event ID:', order.eventId);
      console.log('Order Date:', order.orderDate);
      console.log('Total:', order.total);
      console.log('Raw products field:', order.products);
      
      try {
        const parsedProducts = JSON.parse(order.products);
        console.log('\n📦 Parsed products:');
        parsedProducts.forEach((product, index) => {
          console.log(`  ${index + 1}. Product ID: ${product.productId || product.id}`);
          console.log(`     Quantity: ${product.quantity}`);
          console.log(`     Total: ${product.total || 'N/A'}`);
        });
      } catch (e) {
        console.log('❌ Error parsing products JSON:', e.message);
      }
    } else {
      console.log('❌ Order not found');
      
      // Let's see what orders exist with similar IDs
      const similarOrders = await prisma.order.findMany({
        where: {
          orderId: {
            contains: '175474'
          }
        }
      });
      
      if (similarOrders.length > 0) {
        console.log('\n🔍 Found similar order IDs:');
        similarOrders.forEach(o => {
          console.log(`- ${o.orderId}: ${o.shopName}`);
        });
      }
      
      // Show recent orders
      const recentOrders = await prisma.order.findMany({
        orderBy: { orderDate: 'desc' },
        take: 10
      });
      console.log('\n📋 Recent orders:');
      recentOrders.forEach(o => {
        const products = JSON.parse(o.products);
        console.log(`- ${o.orderId}: ${o.shopName} (${products.length} products)`);
      });
    }
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrder();
