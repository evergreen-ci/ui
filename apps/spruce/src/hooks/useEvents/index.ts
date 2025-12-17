import { useState } from "react";

export const useEvents = (limit: number) => {
  const [allEventsFetched, setAllEventsFetched] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Hide Load More button when event count < limit is returned,
  // or when an additional fetch fails to load more events.
  const onCompleted = (count: number, previousCount: number = prevCount) => {
    if (count - previousCount < limit) {
      setAllEventsFetched(true);
    }
  };

  return {
    allEventsFetched,
    onCompleted,
    setPrevCount,
  };
};
