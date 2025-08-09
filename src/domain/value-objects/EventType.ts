export enum EventTypeValue {
  SIMPLE_PACKAGES = 'simple_packages',
  COMPLEX_PACKAGES = 'complex_packages',
  FLASH_SALE = 'flash_sale',
  SEASONAL = 'seasonal',
  EXPIRED = 'expired'
}

export class EventType {
  constructor(public readonly value: EventTypeValue) {}

  public static SIMPLE_PACKAGES = new EventType(EventTypeValue.SIMPLE_PACKAGES);
  public static COMPLEX_PACKAGES = new EventType(EventTypeValue.COMPLEX_PACKAGES);
  public static FLASH_SALE = new EventType(EventTypeValue.FLASH_SALE);
  public static SEASONAL = new EventType(EventTypeValue.SEASONAL);
  public static EXPIRED = new EventType(EventTypeValue.EXPIRED);

  public static fromString(value: string): EventType {
    switch (value) {
      case EventTypeValue.SIMPLE_PACKAGES:
        return EventType.SIMPLE_PACKAGES;
      case EventTypeValue.COMPLEX_PACKAGES:
        return EventType.COMPLEX_PACKAGES;
      case EventTypeValue.FLASH_SALE:
        return EventType.FLASH_SALE;
      case EventTypeValue.SEASONAL:
        return EventType.SEASONAL;
      case EventTypeValue.EXPIRED:
        return EventType.EXPIRED;
      default:
        throw new Error(`Invalid event type: ${value}`);
    }
  }

  public isPackageType(): boolean {
    return this.value === EventTypeValue.SIMPLE_PACKAGES || 
           this.value === EventTypeValue.COMPLEX_PACKAGES;
  }

  public allowsOrdering(): boolean {
    return this.value !== EventTypeValue.EXPIRED;
  }

  public getDisplayName(): { en: string; vi: string } {
    switch (this.value) {
      case EventTypeValue.SIMPLE_PACKAGES:
        return { en: 'Simple Packages', vi: 'Gói Đơn Giản' };
      case EventTypeValue.COMPLEX_PACKAGES:
        return { en: 'Complex Packages', vi: 'Gói Phức Tạp' };
      case EventTypeValue.FLASH_SALE:
        return { en: 'Flash Sale', vi: 'Giảm Giá Nhanh' };
      case EventTypeValue.SEASONAL:
        return { en: 'Seasonal', vi: 'Theo Mùa' };
      case EventTypeValue.EXPIRED:
        return { en: 'Expired', vi: 'Hết Hạn' };
      default:
        return { en: 'Unknown', vi: 'Không Rõ' };
    }
  }

  public equals(other: EventType): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
