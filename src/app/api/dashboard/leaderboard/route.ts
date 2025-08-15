import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/data/actions';

export async function GET() {
  try {
    const leaderboardData = await getLeaderboard(7); // Get top 7 for dashboard
    
    // Transform leaderboard data to include sales amounts
    const dashboardLeaderboard = leaderboardData.map((entry, index) => {
      // Calculate estimated sales based on products
      const estimatedSales = entry.products.reduce((sum, product) => {
        // Rough estimate: each product worth ~500,000 VND on average
        return sum + (product.quantity * 500000);
      }, 0);
      
      return {
        rank: index + 1,
        shopName: entry.shopName,
        sales: estimatedSales
      };
    });

    return NextResponse.json(dashboardLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
}
