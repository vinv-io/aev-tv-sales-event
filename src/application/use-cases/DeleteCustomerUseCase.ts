import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class DeleteCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<void> {
    const existingCustomer = await this.customerRepository.getById(id);
    if (!existingCustomer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    await this.customerRepository.delete(id);
  }
}
