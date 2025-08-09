export class Package {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly products: Array<{
      productId: string;
      productName: string;
      quantity: number;
    }>,
    public readonly discount: number = 0,
    public readonly isActive: boolean = true,
    public readonly validFrom?: string,
    public readonly validUntil?: string
  ) {}

  public getTotalProductCount(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }

  public isCurrentlyValid(): boolean {
    if (!this.isActive) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (this.validFrom && today < this.validFrom) return false;
    if (this.validUntil && today > this.validUntil) return false;
    
    return true;
  }

  public hasDiscount(): boolean {
    return this.discount > 0;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      products: this.products,
      discount: this.discount,
      isActive: this.isActive,
      validFrom: this.validFrom,
      validUntil: this.validUntil
    };
  }

  public static fromPlainObject(obj: any): Package {
    return new Package(
      obj.id,
      obj.name,
      obj.description,
      obj.products,
      obj.discount,
      obj.isActive,
      obj.validFrom,
      obj.validUntil
    );
  }
}
