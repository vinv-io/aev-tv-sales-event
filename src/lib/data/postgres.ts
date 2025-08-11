
'use server';

import { prisma } from '../database/prisma';
import { format, isWithinInterval } from 'date-fns';
import type { Customer, Event, Product, Order, CheckIn, LeaderboardEntry, Package } from './types';


// Events
export const getEvents = async (): Promise<Event[]> => {
    const allEvents = await prisma.event.findMany();
    return allEvents.map((e: any) => ({
        ...e,
        name: JSON.parse(e.name as string),
        description: e.description ? JSON.parse(e.description) : undefined,
        startDate: format(new Date(e.startDate), 'dd-MM-yyyy'),
        endDate: format(new Date(e.endDate), 'dd-MM-yyyy'),
        image: e.image || undefined
    }));
};

export const getActiveEvents = async (): Promise<Event[]> => {
    const allEvents = await prisma.event.findMany();
    const now = new Date();
    const active = allEvents.filter(event => 
        event.status && isWithinInterval(now, { start: new Date(event.startDate), end: new Date(event.endDate) })
    ).map((e: any) => ({
        ...e,
        name: JSON.parse(e.name as string),
        description: e.description ? JSON.parse(e.description) : undefined,
        startDate: format(new Date(e.startDate), 'dd-MM-yyyy'),
        endDate: format(new Date(e.endDate), 'dd-MM-yyyy'),
        image: e.image || undefined
    }));
    return active;
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    // Convert date strings to Date objects for Prisma
    const parseDate = (dateStr: string): Date => {
        // Handle different date formats
        if (dateStr.includes('-') && dateStr.length === 10) {
            // Check if it's YYYY-MM-DD or DD-MM-YYYY
            const parts = dateStr.split('-');
            if (parts[0].length === 4) {
                // YYYY-MM-DD format
                return new Date(dateStr);
            } else {
                // DD-MM-YYYY format, convert to YYYY-MM-DD
                const [day, month, year] = parts;
                return new Date(`${year}-${month}-${day}`);
            }
        }
        // Try to parse as-is
        return new Date(dateStr);
    };

    const newEvent = {
        id: `EVT${Date.now()}`,
        name: JSON.stringify(eventData.name),
        startDate: parseDate(eventData.startDate as string),
        endDate: parseDate(eventData.endDate as string),
        status: eventData.status,
        description: eventData.description ? JSON.stringify(eventData.description) : null,
        image: eventData.image || null,
    };
    
    console.log('Creating event with parsed dates:', {
        ...newEvent,
        startDate: newEvent.startDate.toISOString(),
        endDate: newEvent.endDate.toISOString()
    });
    
    const result = await prisma.event.create({
        data: newEvent
    });
    return {
        ...result,
        name: JSON.parse(result.name as string),
        description: (result as any).description ? JSON.parse((result as any).description) : undefined,
        startDate: format(new Date(result.startDate), 'dd-MM-yyyy'),
        endDate: format(new Date(result.endDate), 'dd-MM-yyyy'),
        image: result.image || undefined,
    };
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event | undefined> => {
    const updateData: any = { ...eventData };
    
    // Handle date string conversion for updates
    const parseDate = (dateStr: string): Date => {
        if (dateStr.includes('-') && dateStr.length === 10) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) {
                return new Date(dateStr);
            } else {
                const [day, month, year] = parts;
                return new Date(`${year}-${month}-${day}`);
            }
        }
        return new Date(dateStr);
    };
    
    if (updateData.name) {
        updateData.name = JSON.stringify(updateData.name);
    }
    if (updateData.description) {
        updateData.description = JSON.stringify(updateData.description);
    }
    if (updateData.startDate && typeof updateData.startDate === 'string') {
        updateData.startDate = parseDate(updateData.startDate);
    }
    if (updateData.endDate && typeof updateData.endDate === 'string') {
        updateData.endDate = parseDate(updateData.endDate);
    }
    
    console.log('Updating event with data:', updateData);
    
    const result = await prisma.event.update({
        where: { id },
        data: updateData
    });
    return {
        ...result,
        name: JSON.parse(result.name as string),
        description: (result as any).description ? JSON.parse((result as any).description) : undefined,
        startDate: format(new Date(result.startDate), 'dd-MM-yyyy'),
        endDate: format(new Date(result.endDate), 'dd-MM-yyyy'),
        image: result.image || undefined,
    };
};

export const deleteEvent = async (id: string): Promise<void> => {
    await prisma.event.delete({
        where: { id }
    });
};

// Products
export const getProducts = async (): Promise<Product[]> => {
    const allProducts = await prisma.product.findMany();
    return allProducts.map(p => ({
        ...p,
        name: JSON.parse(p.name as string),
        description: JSON.parse(p.description as string)
    }));
};

export const createProduct = async (productData: Omit<Product, 'image'> & { image?: string }): Promise<Product> => {
    const newProduct = {
        id: `PROD${Date.now()}`,
        name: JSON.stringify(productData.name),
        description: JSON.stringify(productData.description),
        image: productData.image || 'https://placehold.co/600x400.png',
    };
    const result = await prisma.product.create({
        data: newProduct
    });
    return {
        ...result,
        name: JSON.parse(result.name as string),
        description: JSON.parse(result.description as string)
    };
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | undefined> => {
    const updateData: any = { ...productData };
    if (updateData.name) {
        updateData.name = JSON.stringify(updateData.name);
    }
    if (updateData.description) {
        updateData.description = JSON.stringify(updateData.description);
    }
    
    const result = await prisma.product.update({
        where: { id },
        data: updateData
    });
    return {
        ...result,
        name: JSON.parse(result.name as string),
        description: JSON.parse(result.description as string)
    };
};

export const deleteProduct = async (id: string): Promise<void> => {
    await prisma.product.delete({
        where: { id }
    });
};

// Customers
export const getCustomers = async (): Promise<Customer[]> => {
    const allCustomers = await prisma.customer.findMany();
    return allCustomers.map(c => ({ 
        ...c, 
        joined: format(new Date(c.joined), 'dd-MM-yyyy') 
    }));
};

export const findCustomerByPhone = async (phone: string): Promise<Customer | undefined> => {
    const customer = await prisma.customer.findUnique({
        where: { phone }
    });
    if (!customer) return undefined;
    
    return {
        ...customer,
        joined: format(customer.joined, 'dd-MM-yyyy')
    };
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'joined'>): Promise<Customer> => {
    const newCustomer = {
        id: `CUST${Date.now()}`,
        joined: new Date(),
        ...customerData,
    };
    const result = await prisma.customer.create({
        data: newCustomer
    });
    return {
        ...result,
        joined: format(result.joined, 'dd-MM-yyyy')
    };
};

export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | undefined> => {
    const result = await prisma.customer.update({
        where: { id },
        data: customerData
    });
    return {
        ...result,
        joined: format(result.joined, 'dd-MM-yyyy')
    };
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await prisma.customer.delete({
        where: { id }
    });
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
    const allOrders = await prisma.order.findMany();
    const ordersWithProductNames = allOrders.map(async (order) => {
        const products = JSON.parse(order.products as string);
        const orderProductsWithNames = await Promise.all(products.map(async (p: any) => {
            const productInfo = await prisma.product.findFirst({ 
                where: { id: p.id } 
            });
            const name = productInfo ? (typeof productInfo.name === 'string' ? JSON.parse(productInfo.name).en : productInfo.name) : 'Unknown Product';
            return { ...p, name };
        }));
        return {
            orderId: order.orderId,
            shopName: order.shopName,
            eventId: order.eventId,
            total: order.total,
            orderDate: format(new Date(order.orderDate), 'dd-MM-yyyy'),
            products: orderProductsWithNames,
        };
    });
    return Promise.all(ordersWithProductNames);
};

export const createOrder = async (orderData: Omit<Order, 'orderId' | 'orderDate'>): Promise<Order> => {
    const newOrder = {
        orderId: `ORD${Date.now()}`,
        orderDate: new Date(),
        ...orderData,
        products: JSON.stringify(orderData.products),
    };
    const result = await prisma.order.create({
        data: newOrder
    });
    return {
        ...result,
        orderDate: format(result.orderDate, 'dd-MM-yyyy'),
        products: JSON.parse(result.products)
    };
};

// CheckIns
export const getCheckIns = async (): Promise<CheckIn[]> => {
    const allCheckIns = await prisma.checkIn.findMany();
    return allCheckIns.map(ci => ({ 
        ...ci, 
        checkInTime: format(new Date(ci.checkInTime), 'dd-MM-yyyy HH:mm:ss') 
    }));
};

export const createCheckIn = async (checkInData: { customerId: string, shopName: string, phone: string, eventId: string }): Promise<void> => {
    try {
        await prisma.checkIn.create({
            data: {
                customerId: checkInData.customerId,
                shopName: checkInData.shopName,
                phone: checkInData.phone,
                eventId: checkInData.eventId,
            }
        });
        console.log('✅ Check-in created successfully for customer:', checkInData.customerId);
    } catch (error: any) {
        console.error('❌ Check-in creation failed:', error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            // Unique constraint violation - customer already checked in for this event
            throw new Error('Bạn đã check-in cho sự kiện này rồi. Mỗi khách hàng chỉ có thể check-in một lần cho mỗi sự kiện.');
        }
        
        if (error.code === 'P2003') {
            // Foreign key constraint violation
            throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin sự kiện và khách hàng.');
        }
        
        // Re-throw other errors instead of swallowing them
        throw new Error('Có lỗi xảy ra khi check-in. Vui lòng thử lại sau.');
    }
};

// Leaderboard
export const getLeaderboardData = async (count: number): Promise<LeaderboardEntry[]> => {
    const allOrders = await prisma.order.findMany();

    const aggregated: Record<string, LeaderboardEntry> = {};

    allOrders.forEach(order => {
        const key = `${order.shopName}::${order.eventId}`;
        if (!aggregated[key]) {
            aggregated[key] = {
                shopName: order.shopName,
                eventId: order.eventId,
                products: [],
            };
        }
        const products = JSON.parse(order.products as string);
        products.forEach((p: any) => {
            const existingProduct = aggregated[key].products.find(prod => prod.id === p.id);
            if (existingProduct) {
                existingProduct.quantity += p.quantity;
            } else {
                aggregated[key].products.push({ id: p.id, quantity: p.quantity });
            }
        });
    });
    
    const sorted = Object.values(aggregated)
    .sort((a,b) => {
        const totalA = a.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalB = b.products.reduce((sum, p) => sum + p.quantity, 0);
        return totalB - totalA;
    })
    .slice(0, count);

    return sorted;
};

// Packages
export const getPackages = async (): Promise<Package[]> => {
    return Promise.resolve([]);
}
export const createPackage = async(packageData: Omit<Package, 'id'>): Promise<Package> => {
    throw new Error("Not implemented");
}
export const updatePackage = async(id: string, packageData: Partial<Package>): Promise<Package | undefined> => {
    throw new Error("Not implemented");
}
export const deletePackage = async(id: string): Promise<void> => {
    throw new Error("Not implemented");
}
