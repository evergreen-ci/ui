import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  buildHostConfigurationRepoURL,
  buildHostPostConfigRepoURL,
} from "constants/externalResources";
import { ImageEventLog } from "pages/image/ImageEventLog";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { useImageEvents } from "./useImageEvents";

const { gray } = palette;

type EventLogTabProps = {
  imageId: string;
};

export const EventLogTab: React.FC<EventLogTabProps> = ({ imageId }) => {
  const { allEventsFetched, events, fetchMore, loading } =
    useImageEvents(imageId);

  return (
    <>
      <Container>
        <StyledBody data-cy="header-text">
          With the exception of static hosts, AMI changes correspond to changes
          in the{" "}
          <StyledLink href={buildHostConfigurationRepoURL} target="_blank">
            buildhost-configuration
          </StyledLink>{" "}
          and{" "}
          <StyledLink href={buildHostPostConfigRepoURL} target="_blank">
            buildhost-post-config
          </StyledLink>{" "}
          repos.
        </StyledBody>
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
  color: ${gray};
`;

const StyledBody = styled(Body)<BodyProps>`
  color: ${gray.base};
`;
