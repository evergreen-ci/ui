import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  // This is not correct use of refs, but it's not possible to fix until DEVPROD-14178 is done
  // because it throws errors that are not easy to debug.
  return ref.current;
};
