import { Card } from "@leafygreen-ui/card";
import { Subtitle } from "@leafygreen-ui/typography";
import { LoadingButton } from "components/Buttons";
import EventDiffTable from "./EventDiffTable";
import { CustomKeyValueRenderConfig } from "./EventDiffTable/utils/keyRenderer";
import { Header } from "./Header";
import styles from "./index.module.css";
import { Event } from "./types";
import { useEvents } from "./useEvents";

type EventLogProps = {
  eventRenderer?: (event: Event) => React.ReactNode;
  events: Event[];
  handleFetchMore: () => void;
  lastFetchedCount: number | undefined;
  limit: number;
  loading: boolean;
  customKeyValueRenderConfig?: CustomKeyValueRenderConfig;
};

const EventLog: React.FC<EventLogProps> = ({
  customKeyValueRenderConfig,
  eventRenderer,
  events,
  handleFetchMore,
  lastFetchedCount,
  limit,
  loading,
}) => {
  const { allEventsFetched } = useEvents(limit, lastFetchedCount, loading);
  const allEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <div className={styles.container} data-testid="event-log">
      {events.map((event) => {
        const { after, before, section, timestamp, user } = event;
        return (
          <Card
            key={`event_log_${timestamp}`}
            className={styles.eventLogCard}
            data-testid="event-log-card"
          >
            <Header section={section} timestamp={timestamp} user={user} />
            {eventRenderer ? (
              eventRenderer(event)
            ) : (
              <EventDiffTable
                after={after}
                before={before}
                customKeyValueRenderConfig={customKeyValueRenderConfig}
              />
            )}
          </Card>
        );
      })}
      {!allEventsFetched && !!events.length && (
        <LoadingButton
          data-testid="load-more-button"
          loading={loading}
          onClick={handleFetchMore}
          variant="primary"
        >
          Load more events
        </LoadingButton>
      )}
      {allEventsFetched && <Subtitle>{allEventsFetchedCopy}</Subtitle>}
    </div>
  );
};

export default EventLog;
