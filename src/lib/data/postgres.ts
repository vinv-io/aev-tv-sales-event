
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
        image: e.image || undefined,
        aiHint: e.aiHint || undefined
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
        image: e.image || undefined,
        aiHint: e.aiHint || undefined
    }));
    return active;
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    const newEvent = {
        id: `EVT${Date.now()}`,
        name: JSON.stringify(eventData.name),
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        status: eventData.status,
        description: eventData.description ? JSON.stringify(eventData.description) : null,
        image: eventData.image || null,
        aiHint: eventData.aiHint || null,
    };
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
        aiHint: result.aiHint || undefined
    };
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event | undefined> => {
    const updateData: any = { ...eventData };
    if (updateData.name) {
        updateData.name = JSON.stringify(updateData.name);
    }
    if (updateData.description) {
        updateData.description = JSON.stringify(updateData.description);
    }
    
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
        aiHint: result.aiHint || undefined
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

export const createProduct = async (productData: Omit<Product, 'image' | 'aiHint'> & { image?: string, aiHint?: string }): Promise<Product> => {
    const newProduct = {
        id: `PROD${Date.now()}`,
        name: JSON.stringify(productData.name),
        description: JSON.stringify(productData.description),
        image: productData.image || 'https://placehold.co/600x400.png',
        aiHint: productData.aiHint || 'product package',
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
    return customer || undefined;
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'joined'>): Promise<Customer> => {
    const newCustomer = {
        id: `CUST${Date.now()}`,
        joined: format(new Date(), 'dd-MM-yyyy'),
        ...customerData,
    };
    const result = await prisma.customer.create({
        data: newCustomer
    });
    return result;
};

export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | undefined> => {
    const result = await prisma.customer.update({
        where: { id },
        data: customerData
    });
    return result;
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
        orderDate: format(new Date(), 'dd-MM-yyyy'),
        ...orderData,
        products: JSON.stringify(orderData.products),
    };
    const result = await prisma.order.create({
        data: newOrder
    });
    return {
        ...result,
        products: JSON.parse(result.products as string)
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
    } catch (error) {
        // Handle unique constraint violation (duplicate check-in)
        console.log('Check-in already exists for this customer and event');
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
