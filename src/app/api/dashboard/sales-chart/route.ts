import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/data/actions';

export async function GET() {
  try {
    const orders = await getOrders();

    // Get last 6 months of data
    const monthsData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // Filter orders for this month
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === month && orderDate.getFullYear() === year;
      });
      
      // Calculate total sales for this month
      const sales = monthOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        month: monthName,
        desktop: sales, // Using 'desktop' to match the chart config
      };
    }).reverse(); // Reverse to show oldest first

    return NextResponse.json(monthsData);
  } catch (error) {
    console.error('Error fetching sales chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch sales chart data' }, { status: 500 });
  }
}
