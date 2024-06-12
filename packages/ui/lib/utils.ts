import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function inPx(value: number) {
  return `${value}px`;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function showTwoDecimals(x: number) {
  return x.toFixed(2);
}

export function ceilToValue(ceil: number) {
	return (v: number) => Math.ceil(v / ceil) * ceil;
}