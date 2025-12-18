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

  const { count, events, fetchMore, loading, previousCount } = useDistroEvents(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    distroId,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      count={count}
      eventRenderer={({ after, before, data }) =>
        after && before ? (
          <EventDiffTable after={after} before={before} />
        ) : (
          <LegacyEventEntry data={data} />
        )
      }
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            distroId,
            before: lastEventTimestamp,
          },
        });
      }}
      limit={limit}
      loading={loading}
      previousCount={previousCount}
    />
  );
};
