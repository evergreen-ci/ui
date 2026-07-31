import { useParams } from "react-router-dom";
import EventLog from "components/Settings/EventLog";
import EventDiffTable from "components/Settings/EventLog/EventDiffTable";
import { slugs } from "constants/routes";
import { LegacyEventEntry } from "./LegacyEventEntry";
import { DISTRO_EVENT_LIMIT, useDistroEvents } from "./useDistroEvents";

type TabProps = {
  limit?: number;
};

export const EventLogTab: React.FC<TabProps> = ({
  limit = DISTRO_EVENT_LIMIT,
}) => {
  const { [slugs.distroId]: distroId } = useParams();

  const { events, handleFetchMore, lastFetchedCount, loading } =
    useDistroEvents(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      distroId,
      limit,
    );

  return (
    <EventLog
      eventRenderer={({ after, before, data }) =>
        after && before ? (
          <EventDiffTable after={after} before={before} />
        ) : (
          <LegacyEventEntry data={data} />
        )
      }
      events={events}
      handleFetchMore={handleFetchMore}
      lastFetchedCount={lastFetchedCount}
      limit={limit}
      loading={loading}
    />
  );
};
