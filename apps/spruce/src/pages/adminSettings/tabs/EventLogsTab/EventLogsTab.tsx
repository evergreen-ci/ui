import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import EventLog from "components/Settings/EventLog";
import { Event } from "components/Settings/EventLog/types";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";
import { useEvents } from "hooks/useEvents";

const ADMIN_EVENT_LIMIT = 100;

export const EventLogsTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const { allEventsFetched, onCompleted, setPrevCount } =
    useEvents(ADMIN_EVENT_LIMIT);

  const { data, fetchMore, loading, previousData } = useQuery<
    AdminEventsQuery,
    AdminEventsQueryVariables
  >(ADMIN_EVENT_LOG, {
    variables: {
      opts: {
        limit: ADMIN_EVENT_LIMIT,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ adminEvents: { count } }) => onCompleted(count),
    onError: (e) => {
      dispatchToast.error(`Unable to fetch admin events: ${e.message}`);
    },
  });

  const events: Event[] = useMemo(
    () =>
      data?.adminEvents?.eventLogEntries?.map((event) => ({
        after: event.after,
        before: event.before,
        timestamp: event.timestamp,
        user: event.user,
      })) ?? [],
    [data],
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  useEffect(() => {
    setPrevCount(previousData?.adminEvents?.count ?? 0);
  }, [previousData, setPrevCount]);

  if (loading && events.length === 0) {
    return <div>Loading admin event logs...</div>;
  }

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            opts: {
              limit: ADMIN_EVENT_LIMIT,
              before: lastEventTimestamp,
            },
          },
        });
      }}
      loading={loading}
    />
  );
};
