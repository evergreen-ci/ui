import { useMemo } from "react";

/**
 * useEvents tracks whether all events have been fetched for pagination.
 * It hides the "Load More" button when fewer than `limit` new events are returned.
 * @param limit - The number of events requested per fetch
 * @param count - The current total count of events from the query
 * @param previousCount - The previous total count before the latest fetch
 * @param loading - Loading more data is in progress, as per Apollo
 * @returns allEventsFetched - true when no more events are available to load
 */
export const useEvents = (
  limit: number,
  count: number | undefined,
  previousCount: number,
  loading: boolean,
) => {
  // When count - previousCount < limit, we've fetched all available events
  const allEventsFetched = useMemo(
    () =>
      loading !== true && count !== undefined && count - previousCount < limit,
    [count, previousCount, limit, loading],
  );

  return { allEventsFetched };
};
