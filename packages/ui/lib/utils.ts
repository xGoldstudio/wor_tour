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
  const element = getElement(queryOrElement);
  if (!element) {
    return { x: 0, y: 0};
  }
  return {
    x: getXCenterBoudingOfElement(element),
    y: getYCenterBoudingOfElement(element),
  };
}

export function getXCenterBoudingOfElement(queryOrElement: string | HTMLElement) {
  const element = getElement(queryOrElement);
  if (!element) {
    return 0;
  }
  const { left, width } = element.getBoundingClientRect();
  return left + width / 2;
}

export function getYCenterBoudingOfElement(queryOrElement: string | HTMLElement) {
  const element = getElement(queryOrElement);
  if (!element) {
    return 0;
  }
  const { top, height } = element.getBoundingClientRect();
  return top + height / 2;
}

function getElement(queryOrElement: string | HTMLElement) {
  return typeof (queryOrElement) === "string" ? document.querySelector<HTMLElement>(queryOrElement) : queryOrElement;
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
