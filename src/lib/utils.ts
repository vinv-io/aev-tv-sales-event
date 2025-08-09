import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to dd-MM-yyyy format for UI display
 * @param date - Date object, ISO string, or dd-MM-yyyy string
 * @returns Formatted date string in dd-MM-yyyy format
 */
export function formatDateForUI(date: Date | string): string {
  try {
    if (!date) return '';
    
    // If it's already in dd-MM-yyyy format, return as is
    if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
      return date;
    }
    
    // If it's a Date object, format it
    if (date instanceof Date) {
      return format(date, 'dd-MM-yyyy');
    }
    
    // If it's a string, try to parse it
    if (typeof date === 'string') {
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'dd-MM-yyyy');
      }
      
      // Handle ISO date strings
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'dd-MM-yyyy');
      }
    }
    
    return date.toString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
}

/**
 * Convert dd-MM-yyyy format to yyyy-MM-dd format for date inputs
 * @param date - Date string in dd-MM-yyyy format
 * @returns Date string in yyyy-MM-dd format for HTML date inputs
 */
export function formatDateForInput(date: string): string {
  try {
    if (!date) return '';
    
    // If it's already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Convert dd-MM-yyyy to yyyy-MM-dd
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split('-');
      return `${year}-${month}-${day}`;
    }
    
    return date;
  } catch (error) {
    console.error('Error converting date for input:', error);
    return date;
  }
}