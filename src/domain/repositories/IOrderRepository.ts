import { Order } from '../entities/Order';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  update(id: string, orderData: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
  getTotalRevenue(): Promise<number>;
  getTotalOrderCount(): Promise<number>;
}
