import { useState } from "react";

export const IMAGE_EVENT_LIMIT = 5;

export const useEvents = () => {
  const [allEventsFetched, setAllEventsFetched] = useState(false);
  // const [prevCount, setPrevCount] = useState(0);

  const onCompleted = () => {};

  return {
    allEventsFetched,
    setAllEventsFetched,
    onCompleted,
    // setPrevCount,
  };
};
