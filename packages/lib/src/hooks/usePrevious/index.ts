import { useEffect, useRef } from "react";

/**
 * `usePrevious` is a hook that returns the previous value of a state.
 * @param state - the value to track
 * @returns the previous value of the state
 */
export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  // This is not correct use of refs, but it's not possible to fix until DEVPROD-14178 is done
  // because it throws errors that are not easy to debug.
  return ref.current;
};
