import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string, updateData: Partial<{
    shopName: string;
    phone: string;
    address: string;
    email: string;
  }>): Promise<Customer> {
    const existingCustomer = await this.customerRepository.getById(id);
    if (!existingCustomer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    const updatedCustomer = existingCustomer.update(updateData);
    return await this.customerRepository.update(id, updatedCustomer);
  }
}
