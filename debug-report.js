const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugReportData() {
  try {
    console.log('🔍 Debugging report data processing...\n');
    
    // Get the specific order
    const order = await prisma.order.findUnique({
      where: { orderId: 'ORD1754745654255' }
    });
    
    if (!order) {
      console.log('❌ Order not found');
      return;
    }
    
    console.log('📦 Raw order data:');
    console.log('Order ID:', order.orderId);
    console.log('Shop Name:', order.shopName);
    console.log('Event ID:', order.eventId);
    console.log('Products JSON:', order.products);
    
    // Parse products like the report does
    const products = JSON.parse(order.products);
    console.log('\n📋 Parsed products array:');
    console.log(products);
    
    // Simulate the flattening logic from the reports page
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    console.log('\n🧮 Total quantity:', totalQuantity);
    
    const flattenedData = products.map((product, index) => ({
      orderId: order.orderId,
      shopName: order.shopName,
      productId: product.id,
      quantity: product.quantity,
      totalQuantity: totalQuantity,
      orderDate: order.orderDate,
      isFirstProduct: index === 0,
      totalProducts: products.length
    }));
    
    console.log('\n🔄 Flattened data for display:');
    flattenedData.forEach((item, index) => {
      console.log(`  ${index + 1}. Product: ${item.productId}, Qty: ${item.quantity}, IsFirst: ${item.isFirstProduct}`);
    });
    
    // Check if this order belongs to SUMMER2025_SPECIAL event
    console.log('\n🎯 Event filter check:');
    console.log('Order event ID:', order.eventId);
    console.log('Is SUMMER2025_SPECIAL?', order.eventId === 'SUMMER2025_SPECIAL');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugReportData();
