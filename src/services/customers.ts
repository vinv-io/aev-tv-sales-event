import type { Customer } from '@/types';
import { prisma } from '@/lib/database';
import { format } from 'date-fns';

export class CustomerService {
  /**
   * Get all customers
   */
  static async getAll(): Promise<Customer[]> {
    const allCustomers = await prisma.customer.findMany();
    return allCustomers.map(c => ({
      ...c,
      joined: format(new Date(c.joined), 'dd-MM-yyyy')
    }));
  }

  /**
   * Get customer by ID
   */
  static async getById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id }
    });
    
    if (!customer) return null;
    
    return {
      ...customer,
      joined: format(new Date(customer.joined), 'dd-MM-yyyy')
    };
  }

  /**
   * Create a new customer
   */
  static async create(customerData: Omit<Customer, 'id' | 'joined'>): Promise<Customer> {
    const now = new Date();
    const newCustomer = {
      id: `CUST${Date.now()}`,
      phone: customerData.phone,
      shopName: customerData.shopName,
      joined: now, // Pass Date object directly to Prisma
    };
    
    const result = await prisma.customer.create({
      data: newCustomer
    });
    
    return {
      ...result,
      joined: format(new Date(result.joined), 'dd-MM-yyyy')
    };
  }

  /**
   * Update an existing customer
   */
  static async update(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
    const result = await prisma.customer.update({
      where: { id },
      data: customerData
    });
    
    return {
      ...result,
      joined: format(new Date(result.joined), 'dd-MM-yyyy')
    };
  }

  /**
   * Delete a customer
   */
  static async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id }
    });
  }

  /**
   * Find customer by phone number
   */
  static async findByPhone(phone: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: { phone }
    });
    
    if (!customer) return null;
    
    return {
      ...customer,
      joined: format(new Date(customer.joined), 'dd-MM-yyyy')
    };
  }
}
