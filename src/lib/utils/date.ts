import { format, isWithinInterval } from 'date-fns';

/**
 * Format date to YYYY-MM-DD format
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd-MM-yyyy');
}

/**
 * Format date to display format
 */
export function formatDisplayDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

/**
 * Check if current date is within event date range
 */
export function isEventActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  return isWithinInterval(now, {
    start: new Date(startDate),
    end: new Date(endDate)
  });
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
