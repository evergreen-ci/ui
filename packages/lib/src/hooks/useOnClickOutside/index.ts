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
     * `handleClickOutside` executes the callback if a mouse click is detected outside of the target elements.
     * @param event - the event that is being listened to
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
