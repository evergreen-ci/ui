import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "components/styles";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  projectOnlyTabs,
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  atTop: boolean;
  attachedRepoId?: string;
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({
  atTop,
  attachedRepoId,
  id,
  projectType,
  tab,
}) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableProjectSettingsTabs).includes(
    tab as WritableProjectSettingsType,
  );
  const showRepoLink = !projectOnlyTabs.has(tab);

  return (
    <Container atTop={atTop}>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {projectType === ProjectType.AttachedProject && showRepoLink && (
          <StyledRouterLink
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            to={getProjectSettingsRoute(attachedRepoId, tab)}
            data-cy="attached-repo-link"
          >
            <strong>Go to repo settings</strong>
          </StyledRouterLink>
        )}
      </TitleContainer>
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
  justify-content: space-between;
  margin: 0 -${size.l};
  padding: 0 ${size.l} ${size.s} ${size.l};
  position: sticky;
  top: 0;
  z-index: 1;

  ${({ atTop }) => atTop && "box-shadow: 0 6px 4px -4px rgba(0, 0, 0, 0.5);"}
`;

const TitleContainer = styled.div`
  margin-right: ${size.s};
`;
