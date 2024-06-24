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

export function getCenterOfBoundingElement(queryOrElement: string | HTMLElement) {
  const element = typeof (queryOrElement) === "string" ? document.querySelector(queryOrElement) : queryOrElement;
  if (!element) {
    return { x: 0, y: 0 };
  }
  const { top, left, width, height } = element.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

// get top center position relative to parent
export function getYCenterPositionOfElement(element: HTMLElement | string) {
  const el =
    typeof element === "string"
      ? document.querySelector<HTMLElement>(element)
      : element;
  if (!el) {
    return 0;
  }
  return el.offsetTop + el.offsetHeight / 2;
}
