import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { StyledLink } from "components/styles";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useFirstImage } from "hooks";
import { IMAGE_EVENT_LIMIT } from "pages/image/useEvents";
import { ImageEventLog } from "../../ImageEventLog";
import { useImageEvents } from "./useImageEvents";

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

  const { allEventsFetched, events, fetchMore, loading } =
    useImageEvents(imageId);

  return (
    <>
      <Container>
        <Body>{subtitleText}</Body>
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
