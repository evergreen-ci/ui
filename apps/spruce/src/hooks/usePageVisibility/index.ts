import { useEffect, useState } from "react";

/**
 * This hook sets an eventListener to monitor if the tab is visible or hidden.
 * @returns boolean - true if visible, false if hidden
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
