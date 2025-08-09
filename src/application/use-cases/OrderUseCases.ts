import { Order } from '../../domain/entities/Order';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { NotFoundError, BusinessRuleError } from '../../shared/errors/DomainErrors';

export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  customerPhone: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  totalAmount: number;
  notes?: string;
}

export interface UpdateOrderRequest {
  customerName?: string;
  customerPhone?: string;
  products?: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  totalAmount?: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

export class GetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}

export class GetOrderByIdUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }
    return order;
  }
}

export class GetOrdersByCustomerUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(customerId: string): Promise<Order[]> {
    return await this.orderRepository.findByCustomerId(customerId);
  }
}

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(request: CreateOrderRequest): Promise<Order> {
    // Validate business rules
    if (request.products.length === 0) {
      throw new BusinessRuleError('Order must contain at least one product');
    }

    const invalidProducts = request.products.filter(p => p.quantity <= 0);
    if (invalidProducts.length > 0) {
      throw new BusinessRuleError('All products must have positive quantity');
    }

    if (request.totalAmount <= 0) {
      throw new BusinessRuleError('Order total amount must be positive');
    }

    // Create domain entity
    const orderId = `ORD${Date.now()}`;
    const orderDate = new Date().toISOString().split('T')[0];

    const order = new Order(
      orderId,
      request.customerId,
      request.customerName,
      request.customerPhone,
      request.products,
      request.totalAmount,
      orderDate,
      'pending',
      request.notes
    );

    // Save to repository
    return await this.orderRepository.save(order);
  }
}

export class UpdateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string, request: UpdateOrderRequest): Promise<Order> {
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundError('Order', id);
    }

    // Business rule: Can't modify delivered or cancelled orders
    if (existingOrder.status === 'delivered' || existingOrder.status === 'cancelled') {
      throw new BusinessRuleError('Cannot modify delivered or cancelled orders');
    }

    // Use provided total amount or keep existing one
    const totalAmount = request.totalAmount ?? existingOrder.totalAmount;

    if (totalAmount <= 0) {
      throw new BusinessRuleError('Order total amount must be positive');
    }

    const updatedOrder = new Order(
      existingOrder.orderId,
      existingOrder.customerId,
      request.customerName ?? existingOrder.customerName,
      request.customerPhone ?? existingOrder.customerPhone,
      request.products ?? existingOrder.products,
      totalAmount,
      existingOrder.orderDate,
      request.status ?? existingOrder.status,
      request.notes ?? existingOrder.notes
    );

    return await this.orderRepository.update(id, updatedOrder);
  }
}

export class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }

    // Business rule: Can only delete pending orders
    if (order.status !== 'pending') {
      throw new BusinessRuleError('Can only delete pending orders');
    }

    await this.orderRepository.delete(id);
  }
}

export class GetOrderStatsUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  }> {
    const [totalRevenue, totalOrders] = await Promise.all([
      this.orderRepository.getTotalRevenue(),
      this.orderRepository.getTotalOrderCount()
    ]);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue
    };
  }
}
