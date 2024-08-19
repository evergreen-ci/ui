import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { StyledLink } from "components/styles";
import {
  buildHostConfigurationRepoURL,
  buildHostPostConfigRepoURL,
} from "constants/externalResources";
import { size } from "constants/tokens";
import { ImageEventLog } from "pages/image/ImageEventLog";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { useImageEvents } from "./useImageEvents";

type EventLogTabProps = {
  imageId: string;
};

export const EventLogTab: React.FC<EventLogTabProps> = ({ imageId }) => {
  const { allEventsFetched, events, fetchMore, loading } =
    useImageEvents(imageId);

  return (
    <>
      <Container>
        <Body>
          With the exception of static hosts, AMI changes correspond to changes
          in the{" "}
          <StyledLink target="_blank" href={buildHostConfigurationRepoURL}>
            buildhost-configuration
          </StyledLink>{" "}
          and{" "}
          <StyledLink target="_blank" href={buildHostPostConfigRepoURL}>
            buildhost-post-config
          </StyledLink>{" "}
          repos.
        </Body>
      </Container>
      <ImageEventLog
        allEventsFetched={allEventsFetched}
        events={events}
        handleFetchMore={() => {
          fetchMore({
            variables: {
              imageId,
              page: Math.floor(events.length / IMAGE_EVENT_LIMIT),
            },
          });
        }}
        loading={loading}
      />
    </>
  );
};

const Container = styled.div`
  align-items: start;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.l};
`;
