import { Customer } from '../entities/Customer';

export interface CustomerRepository {
  getById(id: string): Promise<Customer | null>;
  getAll(): Promise<Customer[]>;
  create(customer: Customer): Promise<Customer>;
  update(id: string, customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  findByPhone(phone: string): Promise<Customer | null>;
}
