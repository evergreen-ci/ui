import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { ImageTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";

interface Props {
  tab: ImageTabRoutes;
}

export const Header: React.FC<Props> = ({ tab }) => {
  const { title } = getTabTitle(tab);

  return (
    <Container>
      <TitleContainer>
        <H2>{title}</H2>
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
