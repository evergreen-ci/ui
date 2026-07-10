import { useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { getEventsUpdateQuery } from "components/Settings/EventLog/useEvents";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";

export const ADMIN_EVENT_LIMIT = 15;

export const useAdminEvents = (limit: number = ADMIN_EVENT_LIMIT) => {
  const { data, error, fetchMore, loading } = useQuery<
    AdminEventsQuery,
    AdminEventsQueryVariables
  >(ADMIN_EVENT_LOG, {
    variables: {
      opts: {
        limit,
      },
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch admin events");

  const events = data?.adminEvents?.eventLogEntries ?? [];

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  const handleFetchMore = useCallback(
    () =>
      fetchMore({
        variables: {
          opts: {
            limit,
            before: lastEventTimestamp,
          },
        },
        updateQuery: getEventsUpdateQuery<"adminEvents", AdminEventsQuery>(
          "adminEvents",
        ),
      }),
    [fetchMore, limit, lastEventTimestamp],
  );

  return {
    events,
    handleFetchMore,
    lastFetchedCount: data?.adminEvents?.count,
    loading,
  };
};
