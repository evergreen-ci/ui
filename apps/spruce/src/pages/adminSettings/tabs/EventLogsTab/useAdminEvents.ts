import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";

export const ADMIN_EVENT_LIMIT = 15;

export const useAdminEvents = (limit: number = ADMIN_EVENT_LIMIT) => {
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

  return {
    count: data?.adminEvents?.count,
    events,
    fetchMore,
    lastEventTimestamp,
    loading,
    previousCount: previousData?.adminEvents?.count ?? 0,
  };
};
