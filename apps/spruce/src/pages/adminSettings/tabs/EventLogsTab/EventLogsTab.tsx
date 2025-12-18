import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import EventLog from "components/Settings/EventLog";
import { Event } from "components/Settings/EventLog/types";
import { ADMIN_EVENT_LIMIT, useAdminEvents } from "./useAdminEvents";

export const EventLogsTab: React.FC = () => {
  const {
    count,
    events,
    fetchMore,
    lastEventTimestamp,
    loading,
    previousCount,
  } = useAdminEvents();

  const transformedEvents: Event[] = events.map((event) => ({
    after: event.after,
    before: event.before,
    section: event.section,
    timestamp: event.timestamp,
    user: event.user,
  }));

  if (loading && transformedEvents.length === 0) {
    return <ParagraphSkeleton data-cy="admin-events-skeleton" />;
  }

  return (
    <EventLog
      count={count}
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
      limit={ADMIN_EVENT_LIMIT}
      loading={loading}
      previousCount={previousCount}
    />
  );
};
