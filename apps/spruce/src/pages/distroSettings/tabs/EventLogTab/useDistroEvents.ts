import { useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { getEventsUpdateQuery } from "components/Settings/EventLog/useEvents";
import {
  DistroEventsQuery,
  DistroEventsQueryVariables,
} from "gql/generated/types";
import { DISTRO_EVENTS } from "gql/queries";

export const DISTRO_EVENT_LIMIT = 15;

export const useDistroEvents = (
  distroId: string,
  limit: number = DISTRO_EVENT_LIMIT,
) => {
  const { data, error, fetchMore, loading } = useQuery<
    DistroEventsQuery,
    DistroEventsQueryVariables
  >(DISTRO_EVENTS, {
    variables: {
      distroId,
      limit,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch distro events");

  const events = data?.distroEvents?.eventLogEntries ?? [];

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  const handleFetchMore = useCallback(
    () =>
      fetchMore({
        variables: {
          distroId,
          before: lastEventTimestamp,
        },
        updateQuery: getEventsUpdateQuery<"distroEvents", DistroEventsQuery>(
          "distroEvents",
        ),
      }),
    [distroId, fetchMore, lastEventTimestamp],
  );

  return {
    events,
    handleFetchMore,
    lastFetchedCount: data?.distroEvents?.count,
    loading,
  };
};
