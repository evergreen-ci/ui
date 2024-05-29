import { MutableRefObject, useEffect, useRef } from "react";
import { useResize, usePrevious } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { MainlineCommitQueryParams } from "types/commits";
/**
 * `useCommitLimit` is a hook that calculates the number of commits to fetch based on the width of the commits container.
 * @returns - a tuple containing a ref to the commits container, the number of commits to fetch, and a boolean indicating whether the window is being resized or not
 */
export const useCommitLimit = <T extends HTMLElement>(): [
  MutableRefObject<T>,
  number,
  boolean,
] => {
  const [, setSkipOrderNumber] = useQueryParam(
    MainlineCommitQueryParams.SkipOrderNumber,
    0,
  );
  const commitsContainerRef = useRef<T>();
  const isResizing = useResize();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { width } = useDimensions(commitsContainerRef);
  const previousWidth = usePrevious(width);
  const nextLimit = Math.max(Math.round(width / COL_WIDTH), MIN_LIMIT);

  useEffect(() => {
    // Checking that a previous width existed ensures that skipOrderNumber is not reset on initial page loads
    if (previousWidth) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setSkipOrderNumber(undefined);
    }
  }, [nextLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return [commitsContainerRef, nextLimit, isResizing];
};

const MIN_LIMIT = 5;
const COL_WIDTH = 200;
