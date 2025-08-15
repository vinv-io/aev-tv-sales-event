"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export function SalesChart() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('/api/dashboard/sales-chart');
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading sales data...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
            }).format(value as number),
            'Sales'
          ]}
        />
        <Legend />
        <Line type="monotone" dataKey="desktop" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Sales" />
      </LineChart>
    </ResponsiveContainer>
  )
}
