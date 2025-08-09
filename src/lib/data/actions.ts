'use server';

// Import services instead of direct database access
import { EventService, ProductService, CustomerService } from '@/services';
import type { Event, Product, Customer, Order, CheckIn, LeaderboardEntry, Package } from '@/types';

// Import legacy functions for features not yet migrated
import * as prismaDb from './postgres';

// Events - Using new service layer
export const getEvents = async (): Promise<Event[]> => EventService.getAll();
export const getActiveEvents = async (): Promise<Event[]> => EventService.getActive();
export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => EventService.create(eventData);
export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event | null> => EventService.update(id, eventData);
export const deleteEvent = async (id: string): Promise<void> => EventService.delete(id);

// Products - Using new service layer
export const getProducts = async (): Promise<Product[]> => ProductService.getAll();
export const getProductById = async (id: string): Promise<Product | null> => ProductService.getById(id);
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => ProductService.create(productData);
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => ProductService.update(id, productData);
export const deleteProduct = async (id: string): Promise<void> => ProductService.delete(id);

// Customers - Using new service layer
export const getCustomers = async (): Promise<Customer[]> => CustomerService.getAll();
export const getCustomerById = async (id: string): Promise<Customer | null> => CustomerService.getById(id);
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'joined'>): Promise<Customer> => CustomerService.create(customerData);
export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | null> => CustomerService.update(id, customerData);
export const deleteCustomer = async (id: string): Promise<void> => CustomerService.delete(id);
export const findCustomerByPhone = async (phone: string): Promise<Customer | null> => CustomerService.findByPhone(phone);

// Legacy functions - TODO: Migrate these to services
export const getOrders = async (): Promise<Order[]> => prismaDb.getOrders();
export const createOrder = async (orderData: Omit<Order, 'orderId' | 'orderDate'>): Promise<Order> => prismaDb.createOrder(orderData);

export const getCheckIns = async (): Promise<CheckIn[]> => prismaDb.getCheckIns();
export const createCheckIn = async (checkInData: { customerId: string, shopName: string, phone: string, eventId: string }): Promise<void> => prismaDb.createCheckIn(checkInData);

export const getLeaderboard = async (count: number = 10): Promise<LeaderboardEntry[]> => prismaDb.getLeaderboardData(count);

export const getPackages = async (): Promise<Package[]> => prismaDb.getPackages();
export const createPackage = async (packageData: Omit<Package, 'id'>): Promise<Package> => prismaDb.createPackage(packageData);
