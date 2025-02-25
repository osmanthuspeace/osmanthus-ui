import { useCallback, useRef } from "react";

export const useThrottle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 100
) => {
  const last = useRef(0);
  const timeout = useRef<number>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = performance.now();
      if (now - last.current > delay) {
        last.current = now;
        fn(...args);
      } else {
        //后缘节流
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          last.current = performance.now();
          fn(...args);
        }, delay - (now - last.current));
      }
    },
    [delay, fn]
  );
};

export const useThrottleWithRuturnValue = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 100
) => {
  const last = useRef(0);
  const timeout = useRef<number>();
  const resultRef = useRef<ReturnType<T>>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = performance.now();
      if (now - last.current > delay) {
        last.current = now;
        resultRef.current = fn(...args);
      } else {
        //后缘节流
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          last.current = performance.now();
          resultRef.current = fn(...args);
        }, delay - (now - last.current));
      }
      return resultRef.current;
    },
    [delay, fn]
  );
};
