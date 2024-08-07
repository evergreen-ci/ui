import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  H2,
  Overline,
  OverlineProps,
  Body,
  BodyProps,
} from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { ImageEventLog, IMAGE_EVENT_LIMIT } from "../../ImageEventLog";
import { useEvents } from "./useEvents";

const { blue, gray } = palette;
const subtitleText = (
  <>
    With the exception of static hosts, AMI changes correspond to changes in the{" "}
    <a
      href="https://github.com/10gen/buildhost-configuration"
      target="_blank"
      rel="noopener noreferrer"
    >
      buildhost-configuration
    </a>{" "}
    and{" "}
    <a
      href="https://github.com/10gen/buildhost-post-config"
      target="_blank"
      rel="noopener noreferrer"
    >
      buildhost-post-config
    </a>{" "}
    repos.
  </>
);

export const EventLogTab: React.FC = () => {
  const { [slugs.imageId]: imageId } = useParams<{
    [slugs.imageId]: string;
  }>();
  const { allImageEventsFetched, events, fetchMore, loading } = useEvents(
    // @ts-expect-error
    imageId,
  );

  return (
    <>
      <Container>
        <TitleContainer>
          <StyledOverline>Event Log</StyledOverline>
          <H2>{imageId}</H2>
          <Subtitle>{subtitleText}</Subtitle>
        </TitleContainer>
      </Container>
      <ImageEventLog
        allImageEventsFetched={allImageEventsFetched}
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

const TitleContainer = styled.div`
  margin-right: ${size.s};
`;

const StyledOverline = styled(Overline)<OverlineProps>`
  color: ${gray.dark1};
`;

const Subtitle = styled(Body)<BodyProps>`
  color: ${gray.base};
  a {
    color: ${blue.base};

    &:hover {
      text-decoration: none;
    }
  }
`;
