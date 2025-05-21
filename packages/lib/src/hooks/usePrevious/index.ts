import { useEffect, useRef } from "react";

/**
 * `usePrevious` is a hook that returns the previous value of a state.
 * @param state - the state to track
 * @returns the previous value of the state
 */
export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};
