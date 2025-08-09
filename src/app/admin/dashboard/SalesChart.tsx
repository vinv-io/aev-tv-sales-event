"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const salesData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
  { name: 'Aug', sales: 2000, revenue: 9800 },
  { name: 'Sep', sales: 2780, revenue: 3908 },
  { name: 'Oct', sales: 1890, revenue: 4800 },
  { name: 'Nov', sales: 2390, revenue: 3800 },
  { name: 'Dec', sales: 3490, revenue: 4300 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" />
      </LineChart>
    </ResponsiveContainer>
  )
}
