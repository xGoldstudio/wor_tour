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

export function roundToTwoMath(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function getCenterOfBoundingElement(queryOrElement: string | HTMLElement) {
  const element = getElement(queryOrElement);
  if (!element) {
    return { x: 0, y: 0 };
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

export function getValueInRange(min: number | undefined, max: number | undefined) {
  return (value: number | null) => {
    if (value === null || isNaN(value)) {
      return min !== undefined ? min : max !== undefined ? max : null;
    }
    if (min !== undefined && value < min) {
      return min;
    }
    if (max !== undefined && value > max) {
      return max;
    }
    return value;
  }
}

export function arrayfindElementOrFirst<T extends string>(usingValue: T, array: T[]): T {
  if (array.find(t => t === usingValue)) {
    return usingValue;
  }
  return array[0];
}

export function defaultValue<T>(def: T): (value: T | undefined | null) => T {
  return (value: T | undefined | null) => value ?? def;
}

export const safeArray = <T>(value: T[] | undefined | null): T[] => defaultValue<T[]>([])(value);

export const safeMap = <T, U>(array: T[] | undefined | null) => (
  fn: (item: T, index: number) => U
) => safeArray(array).map(fn);

export function inRangeValue(min: number, max: number) {
	return (value: number | undefined | null) => typeof value === "number"
		? Math.max(min, Math.min(max, value))
		: min;
}

export function filterNulls<T>(array: (T | null)[]): T[] {
	return array.filter((item): item is T => item !== null);
}

export function isTrueOr<T, U>(value: T, defaultValue: U) {
  return (bool: boolean) => bool === true ? value : defaultValue;
}

export function findInOrFirst<T>(array: T[]) {
  return (value: T | null | undefined) => defaultValue(array[0])(array.find(t => t === value));
}

export function translateYpx(value: number) {
  return `translateY(${inPx(value)})`;
}

export function getSecondsFromHours(hours: number) {
  return hours * 3600;
}

export function getSecondsFromDays(days: 1) {
  return days * 86400;
}

export function isNotEmpty<T>(array: T[]) {
  return array.length > 0;
}