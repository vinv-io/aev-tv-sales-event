import type { LocalizedString, Language } from '@/types';

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Get localized string value
 */
export function getLocalizedValue(
  value: LocalizedString | string,
  language: Language = 'vi'
): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[language] || value.vi || '';
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
