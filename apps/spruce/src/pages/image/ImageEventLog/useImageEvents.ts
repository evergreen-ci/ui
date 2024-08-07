import { useState } from "react";

export const IMAGE_EVENT_LIMIT = 5;

export const useImageEvents = () => {
  const [allImageEventsFetched, setAllImageEventsFetched] = useState(false);

  // @ts-expect-error
  const onCompleted = (events) => {
    const length = events.length ?? 0;
    console.log(length);
    if (length === 0) {
      setAllImageEventsFetched(true);
    }
  };

  return {
    allImageEventsFetched,
    onCompleted,
  };
};
