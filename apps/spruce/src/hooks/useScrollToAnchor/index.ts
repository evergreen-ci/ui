import { useEffect, useRef } from "react";

/**
 * `useScrollToAnchor` scrolls to an anchor element on the page if the URL contains an anchor.
 */
const useScrollToAnchor = () => {
  // Get anchor from the URL
  const anchor = window.location.hash.slice(1);
  //   Delay the scroll until the next tick to ensure the anchor element is rendered
  const timeout = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    timeout.current = setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }, [anchor]);
  useEffect(
    () => () => {
      clearTimeout(timeout.current);
    },
    [],
  );
};

export default useScrollToAnchor;
