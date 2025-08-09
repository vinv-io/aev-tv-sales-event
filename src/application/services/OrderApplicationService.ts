import { 
  GetAllOrdersUseCase,
  GetOrderByIdUseCase,
  GetOrdersByCustomerUseCase,
  CreateOrderUseCase,
  UpdateOrderUseCase,
  DeleteOrderUseCase,
  GetOrderStatsUseCase,
  CreateOrderRequest,
  UpdateOrderRequest
} from '../use-cases/OrderUseCases';
import { OrderRepositoryImpl } from '../../infrastructure/repositories/OrderRepositoryImpl';
import { Order } from '../../domain/entities/Order';

export class OrderApplicationService {
  private orderRepository = new OrderRepositoryImpl();
  
  // Use cases
  private getAllOrdersUseCase = new GetAllOrdersUseCase(this.orderRepository);
  private getOrderByIdUseCase = new GetOrderByIdUseCase(this.orderRepository);
  private getOrdersByCustomerUseCase = new GetOrdersByCustomerUseCase(this.orderRepository);
  private createOrderUseCase = new CreateOrderUseCase(this.orderRepository);
  private updateOrderUseCase = new UpdateOrderUseCase(this.orderRepository);
  private deleteOrderUseCase = new DeleteOrderUseCase(this.orderRepository);
  private getOrderStatsUseCase = new GetOrderStatsUseCase(this.orderRepository);

  async getAllOrders(): Promise<Order[]> {
    return await this.getAllOrdersUseCase.execute();
  }

  async getOrderById(id: string): Promise<Order> {
    return await this.getOrderByIdUseCase.execute(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await this.getOrdersByCustomerUseCase.execute(customerId);
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    return await this.createOrderUseCase.execute(request);
  }

  async updateOrder(id: string, request: UpdateOrderRequest): Promise<Order> {
    return await this.updateOrderUseCase.execute(id, request);
  }

  async deleteOrder(id: string): Promise<void> {
    return await this.deleteOrderUseCase.execute(id);
  }

  async getOrderStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  }> {
    return await this.getOrderStatsUseCase.execute();
  }
}
