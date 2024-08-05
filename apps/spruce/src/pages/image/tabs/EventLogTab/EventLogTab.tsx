import styled from "@emotion/styled";
import { H2, Overline } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { ImageTabRoutes, slugs } from "constants/routes";
import { size } from "constants/tokens";

export const EventLogTab: React.FC = () => {
  const { [slugs.imageId]: imageId } = useParams<{
    [slugs.imageId]: ImageTabRoutes;
  }>();
  return (
    <Container>
      <TitleContainer>
        <Overline>Event Log</Overline>
        <H2>{imageId}</H2>
      </TitleContainer>
    </Container>
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
