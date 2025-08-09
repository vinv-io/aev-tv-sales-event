export class CheckIn {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly customerPhone: string,
    public readonly shopName: string,
    public readonly eventId: string,
    public readonly checkInDate: string,
    public readonly checkInTime: string,
    public readonly location?: string,
    public readonly notes?: string
  ) {}

  public isToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.checkInDate === today;
  }

  public getTimestamp(): Date {
    return new Date(`${this.checkInDate}T${this.checkInTime}`);
  }

  public isWithinEventPeriod(eventStartDate: string, eventEndDate: string): boolean {
    const checkInTimestamp = this.getTimestamp();
    const eventStart = new Date(eventStartDate);
    const eventEnd = new Date(eventEndDate);
    
    return checkInTimestamp >= eventStart && checkInTimestamp <= eventEnd;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      customerId: this.customerId,
      customerPhone: this.customerPhone,
      shopName: this.shopName,
      eventId: this.eventId,
      checkInDate: this.checkInDate,
      checkInTime: this.checkInTime,
      location: this.location,
      notes: this.notes
    };
  }

  public static fromPlainObject(obj: any): CheckIn {
    return new CheckIn(
      obj.id,
      obj.customerId,
      obj.customerPhone,
      obj.shopName,
      obj.eventId,
      obj.checkInDate,
      obj.checkInTime,
      obj.location,
      obj.notes
    );
  }
}
