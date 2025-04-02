import { useEffect, useRef } from "react";

/**
 * `usePrevious` is a custom hook that returns the previous value of a state.
 * @param value - The value to track
 * @returns The previous value of the state
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]); // Note: The Spruce version has a dependency array while Parsley doesn't. Using Spruce's implementation for correctness.
  return ref.current;
};
