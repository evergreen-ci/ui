import { useEffect, useMemo, useRef } from "react";

interface DebouncedFunction<A extends unknown[]> {
  (...args: A): void;
  cancel: () => void;
}

/**
 * `useDebouncedCallback` returns a debounced version of the provided callback
 * that automatically cancels pending invocations on unmount.
 * @param callback - the function to debounce
 * @param delay - debounce delay in milliseconds
 * @returns a debounced function with a `.cancel()` method
 */
export const useDebouncedCallback = <A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
): DebouncedFunction<A> => {
  // When upgraded to React 19, this could be a useEffectEvent
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedFn = useMemo(() => {
    const fn = ((...args: A) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as DebouncedFunction<A>;

    fn.cancel = () => {
      clearTimeout(timeoutRef.current);
    };

    return fn;
  }, [delay]);

  useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);

  return debouncedFn;
};
