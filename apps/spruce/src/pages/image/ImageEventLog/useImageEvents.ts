import { useState } from "react";

export const IMAGE_EVENT_LIMIT = 5;

export const useImageEvents = () => {
  const [allImageEventsFetched] = useState(false);

  return {
    allImageEventsFetched,
  };
};
