import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import * as database from '../../lib/data/postgres';

export class CustomerRepositoryImpl implements CustomerRepository {
  async getById(id: string): Promise<Customer | null> {
    const customerData = await database.getCustomers();
    const found = customerData.find(c => c.id === id);
    if (!found) return null;
    
    return this.toDomain(found);
  }

  async getAll(): Promise<Customer[]> {
    const customersData = await database.getCustomers();
    return customersData.map(data => this.toDomain(data));
  }

  async create(customer: Customer): Promise<Customer> {
    const customerData = {
      phone: customer.phone,
      shopName: customer.shopName
    };
    
    const createdData = await database.createCustomer(customerData);
    return this.toDomain(createdData);
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    const updateData = {
      phone: customer.phone,
      shopName: customer.shopName
    };
    
    const updatedData = await database.updateCustomer(id, updateData);
    if (!updatedData) {
      throw new Error(`Customer with id ${id} not found`);
    }
    
    return this.toDomain(updatedData);
  }

  async delete(id: string): Promise<void> {
    await database.deleteCustomer(id);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const customerData = await database.findCustomerByPhone(phone);
    if (!customerData) return null;
    
    return this.toDomain(customerData);
  }

  private toDomain(data: any): Customer {
    // Convert date format from DD-MM-YYYY to YYYY-MM-DD for Customer entity
    const convertDateFormat = (dateStr: any): string => {
      // Handle Date object
      if (dateStr instanceof Date) {
        return dateStr.toISOString().split('T')[0];
      }
      // Check if date is already in YYYY-MM-DD format
      if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      // Convert from DD-MM-YYYY to YYYY-MM-DD
      if (typeof dateStr === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      }
      throw new Error(`Unsupported date format: ${dateStr}`);
    };

    const joinedDate = convertDateFormat(data.joined);
      
    return new Customer(
      data.id,
      data.shopName,
      data.phone,
      joinedDate,
      data.address,
      data.email
    );
  }
}
