import { useState } from "react";

export const EVENT_LIMIT = 15;

export const useEvents = (limit: number) => {
  const [allEventsFetched, setAllEventsFetched] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const onCompleted = (count: number) => {
    if (count - prevCount < limit) {
      setAllEventsFetched(true);
    }
  };

  return {
    allEventsFetched,
    onCompleted,
    setPrevCount,
  };
};
