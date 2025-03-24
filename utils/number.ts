/**
 * Format a number with commas as thousand separators
 * @param value The number to format
 * @returns Formatted string with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};
