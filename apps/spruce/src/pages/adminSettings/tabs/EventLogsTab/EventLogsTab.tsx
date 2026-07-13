import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import EventLog from "components/Settings/EventLog";
import { Event } from "components/Settings/EventLog/types";
import { ADMIN_EVENT_LIMIT, useAdminEvents } from "./useAdminEvents";

export const EventLogsTab: React.FC = () => {
  const { events, handleFetchMore, lastFetchedCount, loading } =
    useAdminEvents();

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
      events={transformedEvents}
      handleFetchMore={handleFetchMore}
      lastFetchedCount={lastFetchedCount}
      limit={ADMIN_EVENT_LIMIT}
      loading={loading}
    />
  );
};
