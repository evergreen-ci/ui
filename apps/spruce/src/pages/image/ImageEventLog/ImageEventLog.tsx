import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Subtitle } from "@leafygreen-ui/typography";
import { LoadingButton } from "components/Buttons";
import { size } from "constants/tokens";
import { ImageEvent } from "gql/generated/types";
import { ImageEventDiffTable } from "../ImageEventDiffTable";
import { Header } from "./Header";

type ImageEventLogProps = {
  allImageEventsFetched: boolean;
  events: ImageEvent[];
  handleFetchMore: () => void;
  loading?: boolean;
};

export const ImageEventLog: React.FC<ImageEventLogProps> = ({
  allImageEventsFetched,
  events,
  handleFetchMore,
  loading,
}) => {
  const allImageEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <Container>
      {events.map((event) => {
        const { amiAfter, amiBefore, entries, timestamp } = event;
        return (
          <ImageEventLogCard key={`event_log_${timestamp}`}>
            <Header
              amiAfter={amiAfter}
              // @ts-expect-error
              amiBefore={amiBefore}
              timestamp={timestamp}
            />
            <ImageEventDiffTable entries={entries} />
          </ImageEventLogCard>
        );
      })}
      {!allImageEventsFetched && !!events.length && (
        <LoadingButton
          loading={loading}
          onClick={handleFetchMore}
          variant="primary"
        >
          Load more events
        </LoadingButton>
      )}
      {allImageEventsFetched && (
        <Subtitle>{allImageEventsFetchedCopy}</Subtitle>
      )}
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
