import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { LoadingButton } from "components/Buttons";
import EventDiffTable from "./EventDiffTable";
import { CustomKeyValueRenderConfig } from "./EventDiffTable/utils/keyRenderer";
import { Header } from "./Header";
import { Event } from "./types";

type EventLogProps = {
  allEventsFetched: boolean;
  eventRenderer?: (event: Event) => React.ReactNode;
  events: Event[];
  handleFetchMore: () => void;
  loading?: boolean;
  customKeyValueRenderConfig?: CustomKeyValueRenderConfig;
};

const EventLog: React.FC<EventLogProps> = ({
  allEventsFetched,
  customKeyValueRenderConfig,
  eventRenderer,
  events,
  handleFetchMore,
  loading,
}) => {
  const allEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <Container data-cy="event-log">
      {events.map((event) => {
        const { after, before, section, timestamp, user } = event;
        return (
          <EventLogCard key={`event_log_${timestamp}`} data-cy="event-log-card">
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
          </EventLogCard>
        );
      })}
      {!allEventsFetched && !!events.length && (
        <LoadingButton
          data-cy="load-more-button"
          loading={loading}
          onClick={handleFetchMore}
          variant="primary"
        >
          Load more events
        </LoadingButton>
      )}
      {allEventsFetched && <Subtitle>{allEventsFetchedCopy}</Subtitle>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150%;
`;

const EventLogCard = styled(Card)`
  width: 100%;
  margin-bottom: ${size.l};
  padding: ${size.m};
`;

export default EventLog;
