import { useState } from "react";
import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { SearchInput } from "@leafygreen-ui/search-input";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useImageAnalytics } from "analytics";
import { LoadingButton } from "components/Buttons";
import { useEvents } from "components/Settings/EventLog/useEvents";
import { ImageEvent } from "gql/generated/types";
import { Header } from "./Header";
import { ImageEventLogTable } from "./ImageEventLogTable";

type ImageEventLogProps = {
  count: number | undefined;
  events: ImageEvent[];
  handleFetchMore: () => void;
  limit: number;
  loading: boolean;
  previousCount: number;
};

export const ImageEventLog: React.FC<ImageEventLogProps> = ({
  count,
  events,
  handleFetchMore,
  limit,
  loading,
  previousCount,
}) => {
  const { allEventsFetched } = useEvents(limit, count, previousCount, loading);
  const { sendEvent } = useImageAnalytics();

  const [globalSearch, setGlobalSearch] = useState("");
  const handleGlobalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearch(e.target.value);
  };

  const initialLoading = events.length === 0 && loading;

  const allEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          aria-labelledby="event-log-global-search"
          data-cy="event-log-global-search"
          onChange={handleGlobalSearchChange}
          onSubmit={() => {
            sendEvent({ name: "Used global search", search: globalSearch });
          }}
          placeholder="Global search by name"
          value={globalSearch}
        />
      </SearchContainer>
      {initialLoading && <ParagraphSkeleton data-cy="image-events-skeleton" />}
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
            <ImageEventLogTable entries={entries} globalFilter={globalSearch} />
          </ImageEventLogCard>
        );
      })}
      {!allEventsFetched && events.length > 0 && (
        <LoadingButton
          data-cy="load-more-button"
          loading={loading}
          onClick={() => {
            sendEvent({ name: "Clicked 'Load more events' button" });
            handleFetchMore();
          }}
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
  gap: ${size.l};
`;

const SearchContainer = styled.div`
  align-self: flex-start;
  width: 420px;
`;

const ImageEventLogCard = styled(Card)`
  width: 100%;
  padding: ${size.m};
`;
