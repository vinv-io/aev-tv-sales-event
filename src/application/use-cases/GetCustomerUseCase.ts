import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<Customer | null> {
    return await this.customerRepository.getById(id);
  }
}
