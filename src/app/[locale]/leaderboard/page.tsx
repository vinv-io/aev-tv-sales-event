
'use client';

// Disable static generation for this client-side page
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react';
import { useLayoutContext } from '../layout.client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getActiveEvents, getLeaderboard, getProducts } from '@/lib/data/actions';
import type { Event, Product, LeaderboardEntry } from '@/lib/data/types';
import { useParams } from 'next/navigation';


export default function LeaderboardPage() {
    const params = useParams();
    const locale = params.locale as string;
    const [selectedEvent, setSelectedEvent] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [leaderboard, prods, events] = await Promise.all([
                getLeaderboard(100) as Promise<LeaderboardEntry[]>,
                getProducts() as Promise<Product[]>,
                getActiveEvents() as Promise<Event[]>
            ]);

            const sorted = [...events].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

            const newestEventId = sorted.length > 0 ? sorted[0].id : '';

            setLeaderboardData(leaderboard);
            setProducts(prods);
            setSortedEvents(sorted);
            setSelectedEvent(prev => prev || newestEventId);
        }
        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId);
    }, [])

    const content = {
        vi: {
            title: 'BẢNG XẾP HẠNG CỬA HÀNG',
            description: 'Những cửa hàng có số lượng đặt hàng cao nhất.',
            rank: 'Hạng',
            shopName: 'Tên cửa hàng',
            productName: 'Sản phẩm',
            quantity: 'Số lượng',
            totalQuantity: 'Tổng số lượng',
            eventFilterPlaceholder: 'Chọn sự kiện',
            noEvents: 'Không có sự kiện nào',
            noEventsDesc: 'Hiện tại chưa có sự kiện nào được tạo.',
            noData: 'Không có dữ liệu',
            noDataDesc: 'Chưa có đơn hàng nào cho sự kiện này.',
        },
        en: {
            title: 'SHOP LEADERBOARD',
            description: 'Shops with the highest quantity of orders.',
            rank: 'Rank',
            shopName: 'Shop Name',
            productName: 'Product',
            quantity: 'Quantity',
            totalQuantity: 'Total Quantity',
            eventFilterPlaceholder: 'Select Event',
            noEvents: 'No Events Available',
            noEventsDesc: 'No events have been created yet.',
            noData: 'No Data Available',
            noDataDesc: 'No orders have been placed for this event yet.',
        },
    };

    const currentContent = content[locale as keyof typeof content];

    const getProductName = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return productId;
        return typeof product.name === 'string' ? product.name : product.name[locale as keyof typeof product.name]
    }

    const flattenedData = leaderboardData
        .filter(entry => entry.eventId === selectedEvent)
        .flatMap(entry => entry.products.map(product => ({
            shopName: entry.shopName,
            eventId: entry.eventId,
            ...product,
            productName: getProductName(product.id)
        })));
        
    const groupedByShop = flattenedData.reduce((acc, curr) => {
        if (!acc[curr.shopName]) {
            acc[curr.shopName] = {
                shopName: curr.shopName,
                totalQuantity: 0,
                products: []
            };
        }
        acc[curr.shopName].totalQuantity += curr.quantity;
        acc[curr.shopName].products.push({ id: curr.id, name: curr.productName, quantity: curr.quantity });
        return acc;
    }, {} as Record<string, { shopName: string; totalQuantity: number; products: {id: string, name: string; quantity: number}[] }>);

    const rankedData = Object.values(groupedByShop)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .map((shop, index) => ({
            rank: index + 1,
            ...shop
        }));


    const getRankIndicator = (rank: number) => {
        if (rank <= 3) {
            const colors = ['bg-yellow-400', 'bg-gray-400', 'bg-yellow-600'];
            return (
                <Badge className={`${colors[rank-1]} text-white w-8 h-8 flex items-center justify-center`}>
                    <Crown className="w-5 h-5" />
                </Badge>
            )
        }
        return <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">{rank}</Badge>;
    }


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                    <CardTitle className="text-3xl font-headline">{currentContent.title}</CardTitle>
                    <CardDescription>{currentContent.description}</CardDescription>
                </div>
                 <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder={currentContent.eventFilterPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {sortedEvents.map(event => {
                             const eventName = typeof event.name === 'string' ? event.name : event.name[locale as keyof typeof event.name]
                             return (<SelectItem key={event.id} value={event.id}>{eventName}</SelectItem>)
                        })}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{currentContent.noEvents}</h3>
              <p className="text-gray-500">{currentContent.noEventsDesc}</p>
            </div>
          ) : rankedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3.5M4 13h3.5m0-7v7m0 0l2 2 2-2m-4 0l2-2 2 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{currentContent.noData}</h3>
              <p className="text-gray-500">{currentContent.noDataDesc}</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">{currentContent.rank}</TableHead>
                <TableHead>{currentContent.shopName}</TableHead>
                <TableHead>{currentContent.productName}</TableHead>
                <TableHead className="text-right">{currentContent.quantity}</TableHead>
                <TableHead className="text-right">{currentContent.totalQuantity}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedData.map((entry, entryIndex) => (
                <React.Fragment key={entry.shopName}>
                {entry.products.map((product, productIndex) => (
                    <TableRow key={`${entry.shopName}-${product.id}-${productIndex}`}>
                        {productIndex === 0 && (
                            <TableCell rowSpan={entry.products.length} className="font-bold text-center align-top">
                                <div className="flex justify-center pt-2">
                                    {getRankIndicator(entry.rank)}
                                </div>
                            </TableCell>
                        )}
                        {productIndex === 0 && (
                            <TableCell rowSpan={entry.products.length} className="font-medium align-top pt-4">
                                {entry.shopName}
                            </TableCell>
                        )}
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        {productIndex === 0 && (
                            <TableCell rowSpan={entry.products.length} className="text-right font-bold align-top pt-4">
                                {entry.totalQuantity}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
                {entryIndex < rankedData.length -1 && (
                     <TableRow>
                        <TableCell colSpan={5} className="p-0 h-2"></TableCell>
                    </TableRow>
                )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
