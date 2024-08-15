import { useState } from "react";

export const IMAGE_EVENT_LIMIT = 5;

export const useEvents = () => {
  const [allEventsFetched, setAllEventsFetched] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Hide Load More button when an additional fetch fails
  // to load more events.
  const onCompleted = (count: number) => {
    if (count - prevCount < IMAGE_EVENT_LIMIT) {
      setAllEventsFetched(true);
    }
  };

  return {
    allEventsFetched,
    setAllEventsFetched,
    onCompleted,
    setPrevCount,
  };
};
