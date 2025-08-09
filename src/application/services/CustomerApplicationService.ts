import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { CustomerRepositoryImpl } from '../../infrastructure/repositories/CustomerRepositoryImpl';
import { CreateCustomerUseCase } from '../use-cases/CreateCustomerUseCase';
import { GetCustomerUseCase } from '../use-cases/GetCustomerUseCase';
import { UpdateCustomerUseCase } from '../use-cases/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '../use-cases/DeleteCustomerUseCase';
import { ListCustomersUseCase } from '../use-cases/ListCustomersUseCase';

export class CustomerApplicationService {
  private customerRepository: CustomerRepository;
  private createCustomerUseCase: CreateCustomerUseCase;
  private getCustomerUseCase: GetCustomerUseCase;
  private updateCustomerUseCase: UpdateCustomerUseCase;
  private deleteCustomerUseCase: DeleteCustomerUseCase;
  private listCustomersUseCase: ListCustomersUseCase;

  constructor() {
    this.customerRepository = new CustomerRepositoryImpl();
    this.createCustomerUseCase = new CreateCustomerUseCase(this.customerRepository);
    this.getCustomerUseCase = new GetCustomerUseCase(this.customerRepository);
    this.updateCustomerUseCase = new UpdateCustomerUseCase(this.customerRepository);
    this.deleteCustomerUseCase = new DeleteCustomerUseCase(this.customerRepository);
    this.listCustomersUseCase = new ListCustomersUseCase(this.customerRepository);
  }

  async createCustomer(customerData: {
    phone: string;
    shopName: string;
    address?: string;
    email?: string;
  }): Promise<Customer> {
    return await this.createCustomerUseCase.execute(customerData);
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return await this.getCustomerUseCase.execute(id);
  }

  async updateCustomer(id: string, updateData: Partial<{
    shopName: string;
    phone: string;
    address: string;
    email: string;
  }>): Promise<Customer> {
    return await this.updateCustomerUseCase.execute(id, updateData);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }

  async getCustomers(): Promise<Customer[]> {
    return await this.listCustomersUseCase.execute();
  }

  async getCustomersAsPlainObjects(): Promise<any[]> {
    const customers = await this.getCustomers();
    return customers.map(customer => customer.toPlainObject());
  }

  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    return await this.customerRepository.findByPhone(phone);
  }
}
