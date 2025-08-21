import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";
import { useEvents } from "hooks/useEvents";

export const ADMIN_EVENT_LIMIT = 15;

export const useAdminEvents = (limit: number = ADMIN_EVENT_LIMIT) => {
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);
  const { data, fetchMore, loading, previousData } = useQuery<
    AdminEventsQuery,
    AdminEventsQueryVariables
  >(ADMIN_EVENT_LOG, {
    variables: {
      opts: {
        limit,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ adminEvents }) => onCompleted(adminEvents?.count ?? 0),
    onError: (e) => {
      dispatchToast.error(`Unable to fetch admin events: ${e.message}`);
    },
  });

  const events = useMemo(
    () => data?.adminEvents?.eventLogEntries ?? [],
    [data],
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  useEffect(() => {
    setPrevCount(previousData?.adminEvents?.count ?? 0);
  }, [previousData, setPrevCount]);

  return {
    allEventsFetched,
    events,
    fetchMore,
    lastEventTimestamp,
    loading,
  };
};
