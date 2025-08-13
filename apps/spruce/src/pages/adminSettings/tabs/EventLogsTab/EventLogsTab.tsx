import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import EventLog from "components/Settings/EventLog";
import { Event } from "components/Settings/EventLog/types";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { ADMIN_EVENT_LOG } from "gql/queries";

const ADMIN_EVENT_LIMIT = 15;

export const EventLogsTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const [allEventsFetched, setAllEventsFetched] = useState(false);

  const { data, fetchMore, loading } = useQuery<
    AdminEventsQuery,
    AdminEventsQueryVariables
  >(ADMIN_EVENT_LOG, {
    variables: {
      opts: {
        limit: ADMIN_EVENT_LIMIT,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ adminEvents: { eventLogEntries } }) => {
      if (eventLogEntries.length < ADMIN_EVENT_LIMIT) {
        setAllEventsFetched(true);
      }
    },
    onError: (e) => {
      dispatchToast.error(`Unable to fetch admin events: ${e.message}`);
    },
  });

  const events: Event[] =
    data?.adminEvents?.eventLogEntries?.map((event) => ({
      after: event.after,
      before: event.before,
      section: event.section,
      timestamp: event.timestamp,
      user: event.user,
    })) ?? [];

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

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
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            const newEvents =
              fetchMoreResult.adminEvents?.eventLogEntries || [];

            if (newEvents.length < ADMIN_EVENT_LIMIT) {
              setAllEventsFetched(true);
            }

            return {
              ...fetchMoreResult,
              adminEvents: {
                ...fetchMoreResult.adminEvents,
                eventLogEntries: [
                  ...(prev.adminEvents?.eventLogEntries || []),
                  ...newEvents,
                ],
              },
            };
          },
        });
      }}
      loading={loading}
    />
  );
};
