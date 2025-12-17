import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  DistroEventsQuery,
  DistroEventsQueryVariables,
} from "gql/generated/types";
import { DISTRO_EVENTS } from "gql/queries";
import { useErrorToast } from "hooks";
import { useEvents } from "hooks/useEvents";

const DISTRO_EVENT_LIMIT = 15;

export const useDistroEvents = (
  distroId: string,
  limit: number = DISTRO_EVENT_LIMIT,
) => {
  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);
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

  useEffect(() => {
    if (data?.distroEvents?.count !== undefined) {
      const previousCount = previousData?.distroEvents?.count ?? 0;
      onCompleted(data.distroEvents.count, previousCount);
    }
  }, [data?.distroEvents?.count, previousData, onCompleted]);

  useEffect(() => {
    setPrevCount(previousData?.distroEvents?.count ?? 0);
  }, [previousData, setPrevCount]);

  return { allEventsFetched, events, fetchMore, loading };
};
