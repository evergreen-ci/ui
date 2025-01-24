import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  atTop: boolean;
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ atTop, id, projectType, tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableProjectSettingsTabs).includes(
    tab as WritableProjectSettingsType,
  );

  return (
    <Container atTop={atTop}>
      <H2 data-cy="project-settings-tab-title">{title}</H2>
      {saveable && (
        <HeaderButtons
          id={id}
          projectType={projectType}
          tab={tab as WritableProjectSettingsType}
        />
      )}
    </Container>
  );
};

const Container = styled.div<{ atTop: boolean }>`
  align-items: start;
  background-color: white;
  display: flex;
  gap: ${size.s};
  justify-content: space-between;
  margin: 0 -${size.l};
  padding: 0 ${size.l} ${size.s} ${size.l};
  position: sticky;
  top: 0;
  z-index: 1;

  ${({ atTop }) =>
    atTop
      ? "box-shadow: unset"
      : "box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.5); "}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;
