import { useParams } from "react-router-dom";
import { EventDiffTable, EventLog } from "components/Settings/EventLog";
import { slugs } from "constants/routes";
import { LegacyEventEntry } from "./LegacyEventEntry";
import { useDistroEvents } from "./useDistroEvents";

type TabProps = {
  limit?: number;
};

export const EventLogTab: React.FC<TabProps> = ({ limit }) => {
  const { [slugs.distroId]: distroId } = useParams();

  const { allEventsFetched, events, fetchMore, loading } = useDistroEvents(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    distroId,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
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
      loading={loading}
    />
  );
};
