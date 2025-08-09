import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(customerData: {
    phone: string;
    shopName: string;
    address?: string;
    email?: string;
  }): Promise<Customer> {
    // Generate a simple ID (in production, use a proper ID generator)
    const id = `cust_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const customer = new Customer(
      id,
      customerData.shopName,
      customerData.phone,
      today,
      customerData.address,
      customerData.email
    );

    return await this.customerRepository.create(customer);
  }
}
