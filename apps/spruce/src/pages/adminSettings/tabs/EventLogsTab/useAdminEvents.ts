import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";
import { useErrorToast } from "hooks";
import { useEvents } from "hooks/useEvents";

export const ADMIN_EVENT_LIMIT = 15;

export const useAdminEvents = (limit: number = ADMIN_EVENT_LIMIT) => {
  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);
  const { data, error, fetchMore, loading, previousData } = useQuery<
    AdminEventsQuery,
    AdminEventsQueryVariables
  >(ADMIN_EVENT_LOG, {
    variables: {
      opts: {
        limit,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch admin events");

  const events = useMemo(
    () => data?.adminEvents?.eventLogEntries ?? [],
    [data],
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  useEffect(() => {
    setPrevCount(previousData?.adminEvents?.count ?? 0);
  }, [previousData, setPrevCount]);

  useEffect(() => {
    if (data?.adminEvents?.count !== undefined) {
      const previousCount = previousData?.adminEvents?.count ?? 0;
      onCompleted(data.adminEvents.count, previousCount);
    }
  }, [data?.adminEvents?.count, previousData, onCompleted]);

  return {
    allEventsFetched,
    events,
    fetchMore,
    lastEventTimestamp,
    loading,
  };
};
