import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class ListCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return await this.customerRepository.getAll();
  }
}
