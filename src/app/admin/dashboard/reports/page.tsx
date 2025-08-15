
'use client';

// Disable static generation for this client-side page
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { stringify } from 'csv-stringify/browser/esm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from 'lucide-react';
import { getEvents, getCheckIns, getOrders, getCustomers, getProducts } from '@/lib/data/actions';
import type { Event, CheckIn, Order, Customer, Product } from '@/lib/data/types';


const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_CHECKIN_ITEMS_PER_PAGE = 20;
const DEFAULT_ORDERS_PER_PAGE = 10;

export default function ReportsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [checkInCurrentPage, setCheckInCurrentPage] = useState(1);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [checkInItemsPerPage, setCheckInItemsPerPage] = useState(DEFAULT_CHECKIN_ITEMS_PER_PAGE);
  const [ordersItemsPerPage, setOrdersItemsPerPage] = useState(DEFAULT_ORDERS_PER_PAGE);
  const [checkInSearchTerm, setCheckInSearchTerm] = useState('');
  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');

  // Define orders per page (complete orders, not rows)
  const ORDERS_PER_PAGE = ordersItemsPerPage;

  useEffect(() => {
    const fetchInitialData = async () => {
        const [allEvents, allCustomers, checkinData, orderData, productData] = await Promise.all([
            getEvents() as Promise<Event[]>,
            getCustomers() as Promise<Customer[]>,
            getCheckIns() as Promise<CheckIn[]>,
            getOrders() as Promise<Order[]>,
            getProducts() as Promise<Product[]>
        ]);
        
        const sortedEvents = [...allEvents].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        setEvents(allEvents);
        setCustomers(allCustomers);
        setCheckIns(checkinData);
        setOrders(orderData);
        setProducts(productData);

        if (sortedEvents.length > 0) {
            setSelectedEvent(sortedEvents[0].id);
        }
    }
    fetchInitialData();
  }, []);

  const shopPhoneMap = new Map<string, string>();
  customers.forEach(customer => {
      if (!shopPhoneMap.has(customer.shopName)) {
          shopPhoneMap.set(customer.shopName, customer.phone);
      }
  });

  // Helper function to get product name by ID
  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    if (!product) return productId; // Fallback to ID if product not found
    
    // Handle both string and LocalizedString types
    if (typeof product.name === 'string') {
      return product.name;
    } else {
      return product.name.vi || product.name.en || productId; // Prefer Vietnamese, fallback to English, then ID
    }
  };

  const filteredCheckins = checkIns
    .filter(c => c.eventId === selectedEvent)
    .filter(c => {
      if (!checkInSearchTerm) return true;
      const searchLower = checkInSearchTerm.toLowerCase();
      return (
        c.shopName.toLowerCase().includes(searchLower) ||
        c.phone.toLowerCase().includes(searchLower)
      );
    });
  
  const filteredOrders = orders
    .filter(o => o.eventId === selectedEvent)
    .filter(o => {
      if (!ordersSearchTerm) return true;
      const searchLower = ordersSearchTerm.toLowerCase();
      const phone = shopPhoneMap.get(o.shopName) || '';
      return (
        o.shopName.toLowerCase().includes(searchLower) ||
        phone.toLowerCase().includes(searchLower)
      );
    });

  const totalCheckInPages = Math.ceil(filteredCheckins.length / checkInItemsPerPage);
  const paginatedCheckins = filteredCheckins.slice(
    (checkInCurrentPage - 1) * checkInItemsPerPage,
    checkInCurrentPage * checkInItemsPerPage
  );

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    setCheckInCurrentPage(1);
    setOrdersCurrentPage(1);
    setCheckInSearchTerm('');
    setOrdersSearchTerm('');
  }

  const handleCheckInItemsPerPageChange = (itemsPerPage: string) => {
    setCheckInItemsPerPage(parseInt(itemsPerPage));
    setCheckInCurrentPage(1);
  }

  const handleOrdersItemsPerPageChange = (itemsPerPage: string) => {
    setOrdersItemsPerPage(parseInt(itemsPerPage));
    setOrdersCurrentPage(1);
  }

  const handleCheckInSearch = (searchTerm: string) => {
    setCheckInSearchTerm(searchTerm);
    setCheckInCurrentPage(1);
  }

  const handleOrdersSearch = (searchTerm: string) => {
    setOrdersSearchTerm(searchTerm);
    setOrdersCurrentPage(1);
  }

  const clearCheckInSearch = () => {
    setCheckInSearchTerm('');
    setCheckInCurrentPage(1);
  }

  const clearOrdersSearch = () => {
    setOrdersSearchTerm('');
    setOrdersCurrentPage(1);
  }

  // Pagination for orders: paginate by complete orders, not individual rows
  const totalOrdersPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedFilteredOrders = filteredOrders.slice(
    (ordersCurrentPage - 1) * ORDERS_PER_PAGE,
    ordersCurrentPage * ORDERS_PER_PAGE
  );

  // Flatten only the paginated orders for display
  const flattenedOrdersForDisplay = paginatedFilteredOrders.flatMap(order => {
    const totalQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);
    return order.products.map((product, index) => ({
      orderId: order.orderId,
      shopName: order.shopName,
      phone: shopPhoneMap.get(order.shopName) || 'N/A',
      productId: product.id,
      productName: getProductName(product.id),
      quantity: product.quantity,
      totalQuantity: totalQuantity,
      orderDate: order.orderDate,
      isFirstProduct: index === 0, // Flag to show order info only on first product
      totalProducts: order.products.length, // For rowspan
    }));
  });

  const handleExport = () => {
    const event = events.find(e => e.id === selectedEvent);
    const eventName = event ? (typeof event.name === 'string' ? event.name : event.name.en) : 'report';
    
    // Prepare check-in data
    const checkinCsvData = filteredCheckins.map(c => ({
        "Customer ID": c.customerId,
        "Shop Name": c.shopName,
        "Phone": c.phone,
        "Event ID": c.eventId,
        "Check-in Time": c.checkInTime
    }));
    
    // Prepare orders data
    const ordersCsvData = filteredOrders.flatMap(order => 
        order.products.map(product => ({
            'Order ID': order.orderId,
            'Shop Name': order.shopName,
            'Phone Number': shopPhoneMap.get(order.shopName) || '',
            'Product ID': product.id,
            'Product Name': getProductName(product.id),
            'Quantity': product.quantity,
            'Order Date': order.orderDate,
        }))
    );

    // Helper function to download CSV
    const downloadCsv = (data: any[], filename: string) => {
      stringify(data, { header: true }, (err, output) => {
        if (err) {
          console.error('Error generating CSV:', err);
          return;
        }
        
        const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    };

    // Download both CSV files
    const safeEventName = eventName.replace(/ /g, '_');
    downloadCsv(checkinCsvData, `${safeEventName}_checkins.csv`);
    downloadCsv(ordersCsvData, `${safeEventName}_orders.csv`);
  };

  const sortedEventsForDropdown = [...events].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Generate Reports</h1>
            </div>
            <div className="flex items-center gap-4">
                <Select value={selectedEvent} onValueChange={handleEventChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortedEventsForDropdown.map(event => {
                            const eventName = typeof event.name === 'string' ? event.name : event.name.en;
                            return (<SelectItem key={event.id} value={event.id}>{eventName}</SelectItem>)
                        })}
                    </SelectContent>
                </Select>
                <Button onClick={handleExport} disabled={filteredCheckins.length === 0 && flattenedOrdersForDisplay.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Check-in Report</CardTitle>
                <CardDescription>Shop check-in data for the selected event.</CardDescription>
                <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by shop name or phone..."
                            value={checkInSearchTerm}
                            onChange={(e) => handleCheckInSearch(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {checkInSearchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCheckInSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {checkInSearchTerm && (
                        <div className="text-sm text-muted-foreground">
                            {filteredCheckins.length} result{filteredCheckins.length !== 1 ? 's' : ''} found
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer ID</TableHead>
                            <TableHead>Shop Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Event ID</TableHead>
                            <TableHead>Check-in Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCheckins.length > 0 ? paginatedCheckins.map((checkin, index) => (
                            <TableRow key={`${checkin.customerId}-${checkin.eventId}-${index}`}>
                                <TableCell>{checkin.customerId}</TableCell>
                                <TableCell>{checkin.shopName}</TableCell>
                                <TableCell>{checkin.phone}</TableCell>
                                <TableCell>{checkin.eventId}</TableCell>
                                <TableCell>{checkin.checkInTime}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No check-ins for this event.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {filteredCheckins.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Items per page:</span>
                        <Select value={checkInItemsPerPage.toString()} onValueChange={handleCheckInItemsPerPageChange}>
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {totalCheckInPages > 1 && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCheckInCurrentPage(1)}
                                disabled={checkInCurrentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCheckInCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={checkInCurrentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">Page</span>
                                <Input
                                    type="number"
                                    min="1"
                                    max={totalCheckInPages}
                                    value={checkInCurrentPage}
                                    onChange={(e) => {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= totalCheckInPages) {
                                            setCheckInCurrentPage(page);
                                        }
                                    }}
                                    className="w-16 text-center"
                                />
                                <span className="text-sm">of {totalCheckInPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCheckInCurrentPage((prev) => Math.min(prev + 1, totalCheckInPages))}
                                disabled={checkInCurrentPage === totalCheckInPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCheckInCurrentPage(totalCheckInPages)}
                                disabled={checkInCurrentPage === totalCheckInPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        Showing {((checkInCurrentPage - 1) * checkInItemsPerPage) + 1} to {Math.min(checkInCurrentPage * checkInItemsPerPage, filteredCheckins.length)} of {filteredCheckins.length} entries
                    </div>
                </CardFooter>
            )}
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sale Orders Report</CardTitle>
                <CardDescription>Detailed sales data for the selected event.</CardDescription>
                <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by shop name or phone..."
                            value={ordersSearchTerm}
                            onChange={(e) => handleOrdersSearch(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {ordersSearchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearOrdersSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {ordersSearchTerm && (
                        <div className="text-sm text-muted-foreground">
                            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Shop Name</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Product Quantity</TableHead>
                            <TableHead>Total Quantity</TableHead>
                            <TableHead>Order Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flattenedOrdersForDisplay.length > 0 ? flattenedOrdersForDisplay.map((orderItem, index) => (
                           <TableRow key={`${orderItem.orderId}-${orderItem.productId}-${index}`}>
                               {orderItem.isFirstProduct ? (
                                   <>
                                       <TableCell rowSpan={orderItem.totalProducts}>{orderItem.orderId}</TableCell>
                                       <TableCell rowSpan={orderItem.totalProducts}>{orderItem.shopName}</TableCell>
                                       <TableCell rowSpan={orderItem.totalProducts}>{orderItem.phone}</TableCell>
                                   </>
                               ) : null}
                               <TableCell>{orderItem.productName}</TableCell>
                               <TableCell>{orderItem.quantity}</TableCell>
                               {orderItem.isFirstProduct ? (
                                   <>
                                       <TableCell rowSpan={orderItem.totalProducts}>{orderItem.totalQuantity}</TableCell>
                                       <TableCell rowSpan={orderItem.totalProducts}>{orderItem.orderDate}</TableCell>
                                   </>
                               ) : null}
                           </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No sale orders for this event.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
             {filteredOrders.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Orders per page:</span>
                        <Select value={ordersItemsPerPage.toString()} onValueChange={handleOrdersItemsPerPageChange}>
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {totalOrdersPages > 1 && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrdersCurrentPage(1)}
                                disabled={ordersCurrentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrdersCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={ordersCurrentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">Page</span>
                                <Input
                                    type="number"
                                    min="1"
                                    max={totalOrdersPages}
                                    value={ordersCurrentPage}
                                    onChange={(e) => {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= totalOrdersPages) {
                                            setOrdersCurrentPage(page);
                                        }
                                    }}
                                    className="w-16 text-center"
                                />
                                <span className="text-sm">of {totalOrdersPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrdersCurrentPage((prev) => Math.min(prev + 1, totalOrdersPages))}
                                disabled={ordersCurrentPage === totalOrdersPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrdersCurrentPage(totalOrdersPages)}
                                disabled={ordersCurrentPage === totalOrdersPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        Showing {((ordersCurrentPage - 1) * ordersItemsPerPage) + 1} to {Math.min(ordersCurrentPage * ordersItemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
