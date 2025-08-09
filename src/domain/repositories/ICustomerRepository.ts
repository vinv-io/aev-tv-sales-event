import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
