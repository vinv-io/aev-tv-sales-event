import { NextResponse } from 'next/server';
import { getOrders, getProducts } from '@/lib/data/actions';

export async function GET() {
  try {
    const [orders, products] = await Promise.all([
      getOrders(),
      getProducts()
    ]);

    // Create a map of product categories with counts
    const categoryData = new Map<string, number>();
    
    // Count product quantities by extracting category from product name
    orders.forEach(order => {
      order.products.forEach(orderProduct => {
        // Find the actual product to get its name
        const product = products.find(p => p.id === orderProduct.id);
        if (product) {
          // Extract category from product name (assuming format like "Category - Product Name")
          const productName = typeof product.name === 'string' ? product.name : product.name.en || product.name.vi || 'Unknown';
          let category = 'Other';
          
          // Simple categorization based on product name patterns
          if (productName.toLowerCase().includes('tivi') || productName.toLowerCase().includes('tv')) {
            category = 'TV';
          } else if (productName.toLowerCase().includes('loa') || productName.toLowerCase().includes('speaker')) {
            category = 'Audio';
          } else if (productName.toLowerCase().includes('máy') || productName.toLowerCase().includes('machine')) {
            category = 'Appliances';
          } else if (productName.toLowerCase().includes('phụ kiện') || productName.toLowerCase().includes('accessory')) {
            category = 'Accessories';
          }
          
          const currentCount = categoryData.get(category) || 0;
          categoryData.set(category, currentCount + orderProduct.quantity);
        }
      });
    });

    // Convert to chart format
    const chartData = Array.from(categoryData.entries()).map(([category, count]) => ({
      browser: category.toLowerCase(),
      visitors: count,
      fill: getColorForCategory(category)
    }));

    // Add "Other" category if no data
    if (chartData.length === 0) {
      chartData.push({
        browser: 'other',
        visitors: 0,
        fill: 'var(--color-other)'
      });
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching category chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch category chart data' }, { status: 500 });
  }
}

function getColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    'TV': 'var(--color-chrome)',
    'Audio': 'var(--color-safari)', 
    'Appliances': 'var(--color-firefox)',
    'Accessories': 'var(--color-edge)',
    'Other': 'var(--color-other)'
  };
  
  return colorMap[category] || 'var(--color-other)';
}
