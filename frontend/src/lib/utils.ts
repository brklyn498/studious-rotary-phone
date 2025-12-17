/**
 * Utility function for merging Tailwind CSS classes
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in USD
 */
export function formatPriceUSD(price: number | null | undefined): string {
  if (price == null) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price in UZS
 */
export function formatPriceUZS(price: number | null | undefined): string {
  if (price == null) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' сум';
}

/**
 * Get stock status label in Russian
 */
export function getStockLabel(status: string): string {
  const labels: Record<string, string> = {
    'in_stock': 'В наличии',
    'low_stock': 'Мало',
    'pre_order': 'Под заказ',
    'out_of_stock': 'Нет в наличии',
  };
  return labels[status] || status;
}

/**
 * Get stock status color
 */
export function getStockColor(status: string): string {
  const colors: Record<string, string> = {
    'in_stock': 'text-green-600',
    'low_stock': 'text-yellow-600',
    'pre_order': 'text-blue-600',
    'out_of_stock': 'text-red-600',
  };
  return colors[status] || 'text-gray-600';
}
