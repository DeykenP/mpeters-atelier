import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** "$75" or "From $75" when the options change the price. */
export function priceLabel(price: number, priceMax?: number): string {
  return priceMax && priceMax > price ? `From ${formatPrice(price)}` : formatPrice(price);
}

/** Colors as shoppers filter them: gold, silver tones, rose gold, black. */
export function colorFamily(color: string): string {
  const c = color.toLowerCase();
  if (c.includes("rose")) return "Rose Gold";
  if (c.includes("white gold") || c.includes("silver") || c.includes("steel")) return "Silver";
  if (c.includes("gold")) return "Gold";
  if (c.includes("black")) return "Black";
  return "";
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
