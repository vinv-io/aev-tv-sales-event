export class LeaderboardEntry {
  constructor(
    public readonly customerId: string,
    public readonly customerName: string,
    public readonly customerPhone: string,
    public readonly shopName: string,
    public readonly totalOrders: number,
    public readonly totalAmount: number,
    public readonly checkInCount: number,
    public readonly lastActivity: string,
    public readonly rank?: number
  ) {}

  public getAverageOrderValue(): number {
    return this.totalOrders > 0 ? this.totalAmount / this.totalOrders : 0;
  }

  public isActiveCustomer(): boolean {
    const lastActivityDate = new Date(this.lastActivity);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return lastActivityDate >= thirtyDaysAgo;
  }

  public getActivityScore(): number {
    // Weighted score: 40% orders, 30% amount, 20% check-ins, 10% recency
    const orderScore = Math.min(this.totalOrders * 10, 100);
    const amountScore = Math.min(this.totalAmount / 1000 * 10, 100);
    const checkInScore = Math.min(this.checkInCount * 20, 100);
    const recencyScore = this.isActiveCustomer() ? 100 : 50;
    
    return (orderScore * 0.4 + amountScore * 0.3 + checkInScore * 0.2 + recencyScore * 0.1);
  }

  public isTopPerformer(threshold: number = 80): boolean {
    return this.getActivityScore() >= threshold;
  }

  public toPlainObject(): any {
    return {
      customerId: this.customerId,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      shopName: this.shopName,
      totalOrders: this.totalOrders,
      totalAmount: this.totalAmount,
      checkInCount: this.checkInCount,
      lastActivity: this.lastActivity,
      rank: this.rank
    };
  }

  public static fromPlainObject(obj: any): LeaderboardEntry {
    return new LeaderboardEntry(
      obj.customerId,
      obj.customerName,
      obj.customerPhone,
      obj.shopName,
      obj.totalOrders,
      obj.totalAmount,
      obj.checkInCount,
      obj.lastActivity,
      obj.rank
    );
  }
}
