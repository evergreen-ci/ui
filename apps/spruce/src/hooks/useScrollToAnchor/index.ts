import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const anchorScrollTime = 100;

/**
 * `useScrollToAnchor` scrolls to an anchor element on the page if the URL contains an anchor.
 */
const useScrollToAnchor = () => {
  const { hash } = useLocation();
  const anchor = hash.slice(1);

  //   Delay the scroll until the next tick to ensure the anchor element is rendered
  const timeout = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (anchor === "") return;
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    timeout.current = setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, anchorScrollTime);
  }, [anchor]);

  useEffect(
    () => () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      clearTimeout(timeout.current);
    },
    [],
  );
};

export default useScrollToAnchor;
