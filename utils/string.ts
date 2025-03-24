/**
 * Capitalizes the first letter of each word in a string
 * @param text The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
