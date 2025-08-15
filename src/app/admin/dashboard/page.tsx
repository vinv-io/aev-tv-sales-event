"use client"

// Disable static generation for this client-side page
export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUp, MoreHorizontal } from "lucide-react"
import { SalesChart } from "./SalesChart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Pie, PieChart } from "recharts"

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

// Dashboard stats interface
interface DashboardStats {
  totalSales: number;
  dailySales: number;
  totalVisits: number;
  dailyVisits: number;
  totalOrders: number;
  conversionRate: number;
  operationalEffect: number;
}

interface LeaderboardEntry {
  rank: number;
  shopName: string;
  sales: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, leaderboardRes, categoriesRes, chartRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/leaderboard'),
          fetch('/api/dashboard/categories'),
          fetch('/api/dashboard/sales-chart')
        ]);

        const [statsData, leaderboardData, categoriesData, chartData] = await Promise.all([
          statsRes.json(),
          leaderboardRes.json(),
          categoriesRes.json(),
          chartRes.json()
        ]);

        setStats(statsData);
        setLeaderboard(leaderboardData);
        setCategoryData(categoriesData);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency for Vietnamese Dong
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Total Sales</CardTitle>
            <div className="text-3xl font-bold">{formatCurrency(stats?.totalSales || 0)}</div>
          </CardHeader>
          <CardContent className="h-24">
            {/* Trend chart can be added here */}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Daily Sales: {formatCurrency(stats?.dailySales || 0)}</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Visits</CardTitle>
            <div className="text-3xl font-bold">{stats?.totalVisits?.toLocaleString() || 0}</div>
          </CardHeader>
          <CardContent className="h-24">
             {/* Trend chart can be added here */}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Daily Visits: {stats?.dailyVisits?.toLocaleString() || 0}</p>
          </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">Payments</CardTitle>
                <div className="text-3xl font-bold">{stats?.totalOrders?.toLocaleString() || 0}</div>
            </CardHeader>
            <CardContent className="h-24 p-0">
                <ChartContainer config={{
                    desktop: {
                        label: "Desktop",
                        color: "hsl(var(--chart-1))",
                    },
                }} className="h-full w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} className="stroke-muted-foreground/30 stroke-dasharray-3 3" />
                        <XAxis dataKey="month" className="hidden" />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={2} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Conversion Rate: {stats?.conversionRate || 0}%</p>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">Operational Effect</CardTitle>
                <div className="text-3xl font-bold">{stats?.operationalEffect || 0}%</div>
            </CardHeader>
            <CardContent className="h-24 flex items-center">
                 <Progress value={stats?.operationalEffect || 0} />
            </CardContent>
            <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>WoW Change</span>
                    <span className="flex items-center">12% <ArrowUp className="h-4 w-4" /></span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 ml-auto">
                    <span>DoD Change</span>
                    <span className="flex items-center">11% <ArrowUp className="h-4 w-4" /></span>
                </p>
            </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                   <SalesChart />
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Sales Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="hidden">
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Shop</TableHead>
                                <TableHead>Sales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((entry) => (
                                <TableRow key={entry.shopName}>
                                    <TableCell>
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full ${entry.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {entry.rank}
                                        </span>
                                    </TableCell>
                                    <TableCell>{entry.shopName}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.sales)}</TableCell>
                                </TableRow>
                            ))}
                            {leaderboard.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Category Proportion</CardTitle>
                <MoreHorizontal />
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6">
                <ChartContainer config={pieChartConfig} className="w-full h-72">
                    <PieChart>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={categoryData} dataKey="visitors" nameKey="browser" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Offline Store Visits</CardTitle>
            </CardHeader>
            <CardContent>
                {/* A map or another chart can go here */}
                <p className="text-muted-foreground">Map placeholder</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
