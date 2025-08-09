"use client"

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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

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


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Total Sales</CardTitle>
            <div className="text-3xl font-bold">₫1,234,567,890</div>
          </CardHeader>
          <CardContent className="h-24">
            {/* Trend chart can be added here */}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Daily Sales: ₫12,423</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Visits</CardTitle>
            <div className="text-3xl font-bold">8,846</div>
          </CardHeader>
          <CardContent className="h-24">
             {/* Trend chart can be added here */}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Daily Visits: 1,234</p>
          </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">Payments</CardTitle>
                <div className="text-3xl font-bold">6,560</div>
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
                <p className="text-sm text-muted-foreground">Conversion Rate: 60%</p>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">Operational Effect</CardTitle>
                <div className="text-3xl font-bold">78%</div>
            </CardHeader>
            <CardContent className="h-24 flex items-center">
                 <Progress value={78} />
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
                            {[...Array(7)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {i + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell>Shop No. {i + 1}</TableCell>
                                    <TableCell className="text-right">₫1,234,567</TableCell>
                                </TableRow>
                            ))}
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
                        <Pie data={pieChartData} dataKey="visitors" nameKey="browser" />
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
