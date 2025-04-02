import { RefObject, useEffect } from "react";

/**
 * `useOnClickOutside` is a hook that executes a callback when a click is detected outside of the provided refs.
 * @param refs - array of refs to check if the click is outside of
 * @param cb - callback to execute when the click is outside of the refs
 */
export const useOnClickOutside = (
  refs: Array<RefObject<HTMLElement>>,
  cb: () => void,
): void => {
  useEffect(() => {
    /**
     * This function checks if the click is outside of the provided refs.
     * @param event - click event
     */
    function handleClickOutside(event: MouseEvent): void {
      const isNotFocused = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );
      if (isNotFocused) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, refs]);
};
