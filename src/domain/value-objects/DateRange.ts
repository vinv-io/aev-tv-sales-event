import { isWithinInterval, parseISO } from 'date-fns';

export class DateRange {
  constructor(
    public readonly startDate: string, // YYYY-MM-DD format
    public readonly endDate: string    // YYYY-MM-DD format
  ) {
    if (!this.isValidDateString(startDate) || !this.isValidDateString(endDate)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (start >= end) {
      throw new Error('Start date must be before end date');
    }
  }

  public isCurrentlyActive(): boolean {
    try {
      const now = new Date();
      const start = parseISO(this.startDate);
      const end = parseISO(this.endDate);
      
      return isWithinInterval(now, { start, end });
    } catch (error) {
      return false;
    }
  }

  public contains(date: Date): boolean {
    try {
      const start = parseISO(this.startDate);
      const end = parseISO(this.endDate);
      
      return isWithinInterval(date, { start, end });
    } catch (error) {
      return false;
    }
  }

  public getDurationInDays(): number {
    const start = parseISO(this.startDate);
    const end = parseISO(this.endDate);
    
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private isValidDateString(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = parseISO(dateString);
    return !isNaN(date.getTime());
  }

  public equals(other: DateRange): boolean {
    return this.startDate === other.startDate && this.endDate === other.endDate;
  }
}
