import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const anchorScrollTime = 100;

/**
 * `useScrollToAnchor` scrolls to an anchor element on the page if the URL contains an anchor.
 * @param isReady - Whether the anchor element has rendered and can be scrolled to.
 */
const useScrollToAnchor = (isReady = true) => {
  const { hash } = useLocation();
  const anchor = hash.slice(1);

  //   Delay the scroll until the next tick to ensure the anchor element is rendered
  const timeout = useRef<NodeJS.Timeout>(null);
  const scrolledAnchor = useRef<string | null>(null);
  useEffect(() => {
    if (anchor === "") {
      scrolledAnchor.current = null;
      return;
    }
    if (!isReady || scrolledAnchor.current === anchor) return;
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    timeout.current = setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        scrolledAnchor.current = anchor;
      }
    }, anchorScrollTime);
  }, [anchor, isReady]);

  useEffect(
    () => () => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      clearTimeout(timeout.current);
    },
    [],
  );
};

export default useScrollToAnchor;
