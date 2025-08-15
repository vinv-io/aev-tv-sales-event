import { NextResponse } from 'next/server';
import { getOrders, getCheckIns, getProducts, getCustomers } from '@/lib/data/actions';

export async function GET() {
  try {
    const [orders, checkIns, products, customers] = await Promise.all([
      getOrders(),
      getCheckIns(),
      getProducts(),
      getCustomers()
    ]);

    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate daily sales (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
    const dailySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate total visits (check-ins)
    const totalVisits = checkIns.length;
    
    // Calculate daily visits (today)
    const todayVisits = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.checkInTime);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime();
    }).length;

    // Calculate total orders and conversion rate
    const totalOrders = orders.length;
    const conversionRate = totalVisits > 0 ? Math.round((totalOrders / totalVisits) * 100) : 0;

    // Calculate operational effect (example: percentage of orders from last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentOrders = orders.filter(order => new Date(order.orderDate) >= weekAgo).length;
    const operationalEffect = totalOrders > 0 ? Math.round((recentOrders / totalOrders) * 100) : 0;

    return NextResponse.json({
      totalSales,
      dailySales,
      totalVisits,
      dailyVisits: todayVisits,
      totalOrders,
      conversionRate,
      operationalEffect
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
