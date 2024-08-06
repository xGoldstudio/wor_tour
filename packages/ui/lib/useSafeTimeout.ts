import { useRef } from "react";
import { useOnUnMount } from "./lifecycle";

export default function useSafeTimeout() {
  const timeoutRef = useRef<number | null>(null);
  const safeTimeout = (cb: () => void, delay: number) => {
    timeoutRef.current = window.setTimeout(() => {
      cb();
    }, delay);
  };
  useOnUnMount(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  });
  return safeTimeout;
}