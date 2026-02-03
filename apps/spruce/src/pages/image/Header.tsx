import styled from "@emotion/styled";
import { H2, Overline } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import { ImageTabRoutes } from "constants/routes";
import { getTabTitle } from "./getTabTitle";

interface HeaderProps {
  imageId: string;
  tab: ImageTabRoutes;
}

export const Header: React.FC<HeaderProps> = ({ imageId, tab }) => {
  const { title } = getTabTitle(tab);

  return (
    <Container data-cy="image-tab-title">
      <Overline>{title}</Overline>
      <TitleContainer>
        <H2>{imageId}</H2>
      </TitleContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  margin-right: ${size.s};
`;
