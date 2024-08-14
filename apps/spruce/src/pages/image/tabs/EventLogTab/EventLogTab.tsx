import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H2, Overline, OverlineProps, Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { StyledLink } from "components/styles";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useFirstImage } from "hooks";
import { IMAGE_EVENT_LIMIT } from "pages/image/useEvents";
import { ImageEventLog } from "../../ImageEventLog";
import { useImageEvents } from "./useImageEvents";

const { gray } = palette;
const subtitleText = (
  <>
    With the exception of static hosts, AMI changes correspond to changes in the{" "}
    <StyledLink
      target="_blank"
      href="https://github.com/10gen/buildhost-configuration"
    >
      buildhost-configuration
    </StyledLink>{" "}
    and{" "}
    <StyledLink
      target="_blank"
      href="https://github.com/10gen/buildhost-post-config"
    >
      buildhost-post-config
    </StyledLink>{" "}
    repos.
  </>
);

export const EventLogTab: React.FC = () => {
  const { [slugs.imageId]: routeImageId } = useParams<{
    [slugs.imageId]: string;
  }>();

  const { image: firstImage } = useFirstImage();
  const imageId = routeImageId ?? firstImage;

  const {
    allEventsFetched,
    events,
    fetchMore,
    loading,
    // setAllEventLogEntriesFetched,
    // setEvents,
  } = useImageEvents(imageId);

  return (
    <>
      <Container>
        <TitleContainer>
          <StyledOverline>Event Log</StyledOverline>
          <H2 data-cy="image-title">{imageId}</H2>
          <Body>{subtitleText}</Body>
        </TitleContainer>
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
          // .then((response) => {
          //   const newEvents =
          //     response.data?.image?.events?.eventLogEntries || [];
          //   setEventLogEntries((prevEvents) => [...prevEvents, ...newEvents]);
          //   if (newEvents.length < IMAGE_EVENT_LIMIT) {
          //     setAllEventLogEntriesFetched(true);
          //   }
          // });
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
