import { useMemo } from "react";

type EventsPayload = { eventLogEntries: unknown[] };

/**
 * getEventsUpdateQuery builds the `updateQuery` function passed to `fetchMore`
 * for event log queries that use a `no-cache` fetch policy. Because those
 * queries bypass the InMemoryCache, field policy merge functions never run, so
 * each newly fetched page of `eventLogEntries` must be appended to the previous
 * page here instead.
 * @param field - The top-level query field holding the paginated events payload.
 * @returns An `updateQuery` function that concatenates paginated event entries.
 */
export const getEventsUpdateQuery =
  <K extends string, TData extends Record<K, EventsPayload>>(field: K) =>
  (
    previousData: TData,
    { fetchMoreResult }: { fetchMoreResult: TData },
  ): TData => {
    if (!fetchMoreResult) return previousData;
    return {
      ...previousData,
      [field]: {
        ...fetchMoreResult[field],
        eventLogEntries: [
          ...previousData[field].eventLogEntries,
          ...fetchMoreResult[field].eventLogEntries,
        ],
      },
    } as TData;
  };

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
