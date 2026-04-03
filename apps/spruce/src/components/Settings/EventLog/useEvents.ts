import { useMemo } from "react";

/**
 * useEvents tracks whether all events have been fetched for pagination.
 * It hides the "Load More" button when fewer than `limit` new events are returned.
 * @param limit - The number of events requested per fetch
 * @param lastFetchedCount - The number of events returned in the most recent server response
 * @param loading - Loading more data is in progress, as per Apollo
 * @returns allEventsFetched - true when no more events are available to load
 */
export const useEvents = (
  limit: number,
  lastFetchedCount: number | undefined,
  loading: boolean,
) => {
  const allEventsFetched = useMemo(
    () =>
      !loading && lastFetchedCount !== undefined && lastFetchedCount < limit,
    [lastFetchedCount, limit, loading],
  );

  return { allEventsFetched };
};
