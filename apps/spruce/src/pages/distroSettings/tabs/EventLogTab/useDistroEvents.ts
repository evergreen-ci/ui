import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useEvents } from "components/Settings/EventLog";
import { useToastContext } from "context/toast";
import {
  DistroEventsQuery,
  DistroEventsQueryVariables,
} from "gql/generated/types";
import { DISTRO_EVENTS } from "gql/queries";

const DISTRO_EVENT_LIMIT = 15;

export const useDistroEvents = (
  distroId: string,
  limit: number = DISTRO_EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);
  const { data, fetchMore, loading, previousData } = useQuery<
    DistroEventsQuery,
    DistroEventsQueryVariables
  >(DISTRO_EVENTS, {
    variables: {
      distroId,
      limit,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ distroEvents: { count } }) => onCompleted(count),
    onError: (e) => {
      dispatchToast.error(e.message);
    },
  });

  const events = data?.distroEvents?.eventLogEntries ?? [];

  useEffect(() => {
    setPrevCount(previousData?.distroEvents?.count ?? 0);
  }, [previousData, setPrevCount]);

  return { allEventsFetched, events, fetchMore, loading };
};
