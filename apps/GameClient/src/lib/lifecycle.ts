import { useEffect } from "react";

export function useOnMount(cb: () => void) {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useOnUnMount(cb: () => void) {
  useEffect(() => {
    return cb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
