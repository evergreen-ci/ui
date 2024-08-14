import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Subtitle } from "@leafygreen-ui/typography";
import { LoadingButton } from "components/Buttons";
import { size } from "constants/tokens";
import { ImageEvent } from "gql/generated/types";
import { ImageEventLogTable } from "../ImageEventLogTable";
import { Header } from "./Header";

type ImageEventLogProps = {
  allEventsFetched: boolean;
  events: ImageEvent[];
  handleFetchMore: () => void;
  loading?: boolean;
};

export const ImageEventLog: React.FC<ImageEventLogProps> = ({
  allEventsFetched,
  events,
  handleFetchMore,
  loading,
}) => {
  const allEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <Container>
      {events.map((event) => {
        const { amiAfter, amiBefore, entries, timestamp } = event;
        return (
          <ImageEventLogCard
            key={`event_log_${timestamp}`}
            data-cy="image-event-log-card"
          >
            <Header
              amiAfter={amiAfter}
              amiBefore={amiBefore ?? ""}
              timestamp={timestamp}
            />
            <ImageEventLogTable entries={entries} />
          </ImageEventLogCard>
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

const ImageEventLogCard = styled(Card)`
  width: 100%;
  margin-bottom: ${size.l};
  padding: ${size.m};
`;
