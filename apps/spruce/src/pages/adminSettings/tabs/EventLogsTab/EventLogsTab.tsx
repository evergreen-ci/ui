import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import EventLog from "components/Settings/EventLog";
import { Event } from "components/Settings/EventLog/types";
import { ADMIN_EVENT_LIMIT, useAdminEvents } from "./useAdminEvents";

export const EventLogsTab: React.FC = () => {
  const { allEventsFetched, events, fetchMore, lastEventTimestamp, loading } =
    useAdminEvents();

  const transformedEvents: Event[] = events.map((event) => ({
    after: event.after,
    before: event.before,
    section: event.section,
    timestamp: event.timestamp,
    user: event.user,
  }));

  if (loading && transformedEvents.length === 0) {
    return <Skeleton />;
  }

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      events={transformedEvents}
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
