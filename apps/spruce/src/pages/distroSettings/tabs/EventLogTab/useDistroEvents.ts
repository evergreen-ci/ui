import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
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
  const { data, error, fetchMore, loading, previousData } = useQuery<
    DistroEventsQuery,
    DistroEventsQueryVariables
  >(DISTRO_EVENTS, {
    variables: {
      distroId,
      limit,
    },
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch distro events");

  const events = data?.distroEvents?.eventLogEntries ?? [];

  return {
    events,
    fetchMore,
    lastFetchedCount:
      (data?.distroEvents?.count ?? 0) -
      (previousData?.distroEvents?.count ?? 0),
    loading,
  };
};
