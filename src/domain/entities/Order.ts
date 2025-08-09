export class Order {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly customerName: string,
    public readonly customerPhone: string,
    public readonly products: Array<{
      productId: string;
      productName: string;
      quantity: number;
    }>,
    public readonly totalAmount: number,
    public readonly orderDate: string,
    public readonly status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = 'pending',
    public readonly notes?: string
  ) {}

  public getTotalItems(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }

  public canBeCancelled(): boolean {
    return this.status === 'pending' || this.status === 'confirmed';
  }

  public isCompleted(): boolean {
    return this.status === 'delivered';
  }

  public toPlainObject(): any {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      products: this.products,
      totalAmount: this.totalAmount,
      orderDate: this.orderDate,
      status: this.status,
      notes: this.notes
    };
  }

  public static fromPlainObject(obj: any): Order {
    return new Order(
      obj.orderId,
      obj.customerId,
      obj.customerName,
      obj.customerPhone,
      obj.products,
      obj.totalAmount,
      obj.orderDate,
      obj.status,
      obj.notes
    );
  }
}
