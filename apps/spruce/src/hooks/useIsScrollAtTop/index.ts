import { RefObject, useEffect, useState } from "react";
import throttle from "lodash.throttle";

export const useIsScrollAtTop = (
  pageWrapperRef: RefObject<HTMLElement>,
  scrollOffset: number,
) => {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = throttle(() => {
      if (!pageWrapperRef?.current) return;
      if (pageWrapperRef?.current?.scrollTop < scrollOffset) {
        setAtTop(true);
      } else {
        setAtTop(false);
      }
    }, 250);
    pageWrapperRef?.current?.addEventListener("scroll", onScroll);

    const wrapper = pageWrapperRef.current;
    return () => wrapper?.removeEventListener("scroll", onScroll);
  }, [pageWrapperRef, scrollOffset]);

  return { atTop };
};
