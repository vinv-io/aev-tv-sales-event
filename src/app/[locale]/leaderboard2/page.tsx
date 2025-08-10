
'use client';

import React, { useEffect, useState } from 'react';
import { useLayoutContext } from '../layout.client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Medal, Ribbon } from 'lucide-react';
import { cn } from '@/utils';
import { Separator } from '@/components/ui/separator';
import { getActiveEvents, getLeaderboard, getProducts } from '@/lib/data/actions';
import type { Event, Product, LeaderboardEntry } from '@/lib/data/types';
import { useParams } from 'next/navigation';


export default function LeaderboardPage2() {
    const params = useParams();
    const locale = params.locale as string;
    const [selectedEvent, setSelectedEvent] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const fetchData = async () => {
            const [leaderboard, prods, events] = await Promise.all([
                getLeaderboard(15) as Promise<LeaderboardEntry[]>,
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
            title: 'BẢNG XẾP HẠNG',
            description: 'Xem ai đang dẫn đầu bảng xếp hạng trong các sự kiện bán hàng của chúng tôi.',
            totalQuantity: 'Tổng số lượng',
            eventFilterPlaceholder: 'Chọn sự kiện',
            products: 'Sản phẩm',
            noEvents: 'Không có sự kiện nào',
            noEventsDesc: 'Hiện tại chưa có sự kiện nào được tạo. Hãy tạo sự kiện đầu tiên để bắt đầu bảng xếp hạng!',
            noData: 'Không có dữ liệu',
            noDataDesc: 'Chưa có đơn hàng nào cho sự kiện này. Hãy bắt đầu mua sắm để xuất hiện trên bảng xếp hạng!',
        },
        en: {
            title: 'LEADERBOARD',
            description: 'See who is leading the rankings in our sales events.',
            totalQuantity: 'Total Quantity',
            eventFilterPlaceholder: 'Select Event',
            products: 'Products',
            noEvents: 'No Events Available',
            noEventsDesc: 'No events have been created yet. Create your first event to start the leaderboard!',
            noData: 'No Data Available',
            noDataDesc: 'No orders have been placed for this event yet. Start shopping to appear on the leaderboard!',
        },
    };

    const currentContent = content[locale as keyof typeof content];

    const getProductName = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return productId;
        return typeof product.name === 'string' ? product.name : product.name[locale as keyof typeof product.name];
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
        
        const existingProduct = acc[curr.shopName].products.find(p => p.id === curr.id);
        if (existingProduct) {
            existingProduct.quantity += curr.quantity;
        } else {
            acc[curr.shopName].products.push({ id: curr.id, name: curr.productName, quantity: curr.quantity });
        }
        return acc;
    }, {} as Record<string, { shopName: string; totalQuantity: number; products: {id: string, name: string; quantity: number}[] }>);

    const rankedData = Object.values(groupedByShop)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10)
        .map((shop, index) => ({
            rank: index + 1,
            ...shop
        }));

    const topThree = isClient ? rankedData.slice(0, 3) : [];
    const rest = isClient ? rankedData.slice(3) : [];

    const getRankCardClass = (rank: number) => {
        switch (rank) {
            case 1: return "bg-yellow-400/80 border-yellow-500 order-2 md:-translate-y-12 shadow-2xl";
            case 2: return "bg-slate-400/80 border-slate-500 order-1";
            case 3: return "bg-orange-400/80 border-orange-500 order-3";
            default: return "bg-card";
        }
    }
    
    const getRankIcon = (rank: number) => {
        const iconProps = { className: "w-12 h-12" };
        switch(rank) {
            case 1: return <Trophy {...iconProps} className={cn(iconProps.className, "text-yellow-300")} />;
            case 2: return <Medal {...iconProps} className={cn(iconProps.className, "text-slate-300")} />;
            case 3: return <Ribbon {...iconProps} className={cn(iconProps.className, "text-orange-300")} />;
            default: return null;
        }
    }

    if(!isClient || leaderboardData.length === 0) {
        return (
             <div className="w-full bg-gradient-to-br from-purple-400 via-violet-600 to-indigo-800 text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <p>Loading leaderboard...</p>
            </div>
        )
    }

  return (
    <div className="w-full bg-gradient-to-br from-purple-400 via-violet-600 to-indigo-800 text-white p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
            <div className="text-center sm:text-left">
                <h1 className="text-5xl font-bold font-headline mb-2">{currentContent.title}</h1>
                <p className="text-lg opacity-80">{currentContent.description}</p>
            </div>
            <div className="flex justify-center gap-4">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-white/20 border-white/30 text-white placeholder:text-white/70">
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
        </div>
        
        {/* No Events Message */}
        {sortedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-white/60 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentContent.noEvents}</h3>
            <p className="text-white/80 text-lg max-w-md mx-auto">{currentContent.noEventsDesc}</p>
          </div>
        ) : rankedData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-white/60 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3.5M4 13h3.5m0-7v7m0 0l2 2 2-2m-4 0l2-2 2 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentContent.noData}</h3>
            <p className="text-white/80 text-lg max-w-md mx-auto">{currentContent.noDataDesc}</p>
          </div>
        ) : (
        <>
        {/* Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 mb-12 mt-8 md:mt-16">
            {topThree.map((entry) => (
                <Card key={entry.rank} className={cn("text-center p-6 rounded-xl transition-all duration-300 flex flex-col", getRankCardClass(entry.rank))}>
                    <div className="relative inline-block mb-4">
                        <span className="absolute -top-10 -left-10 text-8xl font-bold opacity-20">{entry.rank}</span>
                        {getRankIcon(entry.rank)}
                    </div>
                    <h3 className="text-2xl font-bold">{entry.shopName}</h3>
                    
                    <div className="flex-grow my-4">
                        <h4 className="font-bold text-lg mb-2 opacity-90">{currentContent.products}</h4>
                        <div className="space-y-1 text-left text-sm">
                            {entry.products.sort((a,b) => b.quantity-a.quantity).map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-white/10 rounded p-2">
                                    <span>{p.name}</span>
                                    <span className="font-bold">{p.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-white/20 my-4"/>

                    <p className="text-sm opacity-80 mt-2 mb-2">{currentContent.totalQuantity}</p>
                    <p className="text-4xl font-bold">{entry.totalQuantity.toLocaleString()}</p>
                </Card>
            ))}
             {topThree.length < 3 && [...Array(3 - topThree.length)].map((_, i) => (
                <div key={`placeholder-${i}`} className="hidden md:block"></div>
            ))}
        </div>

        {/* Rest of the leaderboard */}
        <div className="space-y-3 max-w-4xl mx-auto">
            {rest.map((entry) => (
                 <div key={entry.rank} className="bg-white/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between transition-transform hover:scale-105">
                    <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                        <span className="text-xl font-bold w-6 text-center">{entry.rank}</span>
                        <p className="font-semibold text-lg flex-grow">{entry.shopName}</p>
                    </div>
                    <div className='w-full sm:w-auto flex items-center gap-4'>
                        <div className="flex-grow text-sm space-y-1">
                            {entry.products.sort((a,b) => b.quantity-a.quantity).map(p => (
                                <div key={p.id} className="flex justify-between items-center gap-2">
                                    <span>{p.name}</span>
                                    <span className="font-bold bg-white/20 rounded px-2 py-0.5 text-xs">{p.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                             <p className="text-xs opacity-80">{currentContent.totalQuantity}</p>
                             <p className="font-bold text-xl">{entry.totalQuantity.toLocaleString()}</p>
                        </div>
                    </div>
                 </div>
            ))}
        </div>
        </>
        )}

      </div>
    </div>
  );
}

    
