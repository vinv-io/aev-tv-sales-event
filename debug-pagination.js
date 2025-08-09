const { PrismaClient } = require('@prisma/client');
const { format } = require('date-fns');
const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 5;

async function debugPagination() {
  try {
    console.log('🔍 Debugging pagination for Sale Orders Report...\n');
    
    // Get all orders for SUMMER2025_SPECIAL event (same as report filter)
    const allOrders = await prisma.order.findMany({
      where: { eventId: 'SUMMER2025_SPECIAL' }
    });
    
    console.log(`📊 Found ${allOrders.length} orders for SUMMER2025_SPECIAL event\n`);
    
    // Process orders like the report does
    const ordersWithProductNames = await Promise.all(allOrders.map(async (order) => {
      const products = JSON.parse(order.products);
      const orderProductsWithNames = await Promise.all(products.map(async (p) => {
        const productInfo = await prisma.product.findFirst({ where: { id: p.id } });
        const name = productInfo ? (typeof productInfo.name === 'string' ? JSON.parse(productInfo.name).en : productInfo.name) : 'Unknown Product';
        return { ...p, name };
      }));
      return {
        orderId: order.orderId,
        shopName: order.shopName,
        eventId: order.eventId,
        total: order.total,
        orderDate: format(new Date(order.orderDate), 'dd-MM-yyyy'),
        products: orderProductsWithNames,
      };
    }));
    
    // Flatten for display like the report does
    const flattenedOrdersForDisplay = ordersWithProductNames.flatMap(order => {
      const totalQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);
      return order.products.map((product, index) => ({
        orderId: order.orderId,
        shopName: order.shopName,
        phone: 'N/A', // We don't have customer data here
        productId: product.id,
        quantity: product.quantity,
        totalQuantity: totalQuantity,
        orderDate: order.orderDate,
        isFirstProduct: index === 0,
        totalProducts: order.products.length,
      }));
    });
    
    console.log(`📋 Total flattened items: ${flattenedOrdersForDisplay.length}\n`);
    
    // Find our target order items
    const targetOrderItems = flattenedOrdersForDisplay.filter(item => item.orderId === 'ORD1754745654255');
    console.log(`🎯 Items for ORD1754745654255:`);
    targetOrderItems.forEach((item, index) => {
      console.log(`  ${index + 1}. Product: ${item.productId}, Qty: ${item.quantity}`);
    });
    
    // Check pagination
    const totalPages = Math.ceil(flattenedOrdersForDisplay.length / ITEMS_PER_PAGE);
    console.log(`\n📄 Total pages: ${totalPages}`);
    console.log(`📄 Items per page: ${ITEMS_PER_PAGE}\n`);
    
    // Find which page each target item appears on
    targetOrderItems.forEach(targetItem => {
      const itemIndex = flattenedOrdersForDisplay.findIndex(item => 
        item.orderId === targetItem.orderId && item.productId === targetItem.productId
      );
      const pageNumber = Math.floor(itemIndex / ITEMS_PER_PAGE) + 1;
      console.log(`📍 ${targetItem.orderId} - ${targetItem.productId} appears on page ${pageNumber} (index ${itemIndex})`);
    });
    
    // Show all items for context
    console.log(`\n📊 All flattened items (showing order ID and product ID):`);
    flattenedOrdersForDisplay.forEach((item, index) => {
      const pageNum = Math.floor(index / ITEMS_PER_PAGE) + 1;
      console.log(`  ${index + 1}. ${item.orderId} - ${item.productId} (Page ${pageNum})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPagination();
