export class Customer {
  constructor(
    public readonly id: string,
    public readonly shopName: string,
    public readonly phone: string,
    public readonly joined: string, // YYYY-MM-DD format
    public readonly address?: string,
    public readonly email?: string
  ) {
    if (!id.trim()) {
      throw new Error('Customer ID cannot be empty');
    }
    if (!shopName.trim()) {
      throw new Error('Shop name cannot be empty');
    }
    if (!this.isValidPhone(phone)) {
      throw new Error('Invalid phone number format');
    }
    if (!this.isValidDateString(joined)) {
      throw new Error('Invalid joined date format. Expected YYYY-MM-DD');
    }
    if (email && !this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
  }

  public update(updates: Partial<{
    shopName: string;
    phone: string;
    address: string;
    email: string;
  }>): Customer {
    return new Customer(
      this.id,
      updates.shopName ?? this.shopName,
      updates.phone ?? this.phone,
      this.joined,
      updates.address ?? this.address,
      updates.email ?? this.email
    );
  }

  public getContactInfo(): { shopName: string; phone: string; email?: string } {
    return {
      shopName: this.shopName,
      phone: this.phone,
      email: this.email
    };
  }

  public hasCompleteProfile(): boolean {
    return !!(this.shopName && this.phone && this.address && this.email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone.trim());
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private isValidDateString(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  public toPlainObject() {
    return {
      id: this.id,
      shopName: this.shopName,
      phone: this.phone,
      joined: this.joined,
      address: this.address,
      email: this.email
    };
  }

  public static fromPlainObject(obj: any): Customer {
    return new Customer(
      obj.id,
      obj.shopName,
      obj.phone,
      obj.joined,
      obj.address,
      obj.email
    );
  }
}
