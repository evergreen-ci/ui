import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ id, projectType, tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableProjectSettingsTabs).includes(
    tab as WritableProjectSettingsType,
  );

  return (
    <Container>
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

const Container = styled.div`
  align-items: start;
  display: flex;
  gap: ${size.s};
  justify-content: space-between;
  margin-bottom: ${size.l};
`;
