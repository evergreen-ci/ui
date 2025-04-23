import React from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { WritableProjectSettingsType } from "pages/projectSettings/tabs/types";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";

interface Props {
  atTop: boolean;
  id?: string;
  tab?: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ atTop, id, tab }) => {
  const { title } = tab ? getTabTitle(tab) : { title: "New Settings" };
  const saveable = tab as WritableProjectSettingsType;

  return (
    <Container atTop={atTop}>
      <TitleContainer>
        <Title>New Settings</Title>
        <SubTitle>{title}</SubTitle>
      </TitleContainer>
      {saveable && <HeaderButtons id={id} tab={saveable} />}
    </Container>
  );
};

interface ContainerProps {
  atTop: boolean;
}

const Container = styled.div<ContainerProps>`
  align-items: center;
  background-color: white;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.m};
  padding: ${size.xs} 0;
  position: sticky;
  top: 0;
  transition: box-shadow 150ms ease-in-out;
  z-index: 1;
  ${({ atTop }) =>
    !atTop &&
    `
    box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  `}
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;
`;

const SubTitle = styled.div`
  font-size: ${size.m};
  margin-top: ${size.xs};
`;
