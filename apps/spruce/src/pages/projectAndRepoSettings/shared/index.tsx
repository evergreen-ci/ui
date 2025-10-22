import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, Link, Navigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { ProjectBanner } from "components/Banners";
import { ProjectSelect } from "components/ProjectSelect";
import {
  SettingsPageContent,
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageWrapper,
} from "components/styles";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  slugs,
} from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { ProjectSettingsProvider } from "./Context";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { getTabTitle } from "./getTabTitle";
import { ProjectSettingsTabs } from "./Tabs";
import { projectOnlyTabs } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface SharedSettingsProps {
  hasLoaded: boolean;
  owner: string;
  projectData?: ProjectSettingsQuery["projectSettings"];
  projectIdentifier: string;
  projectType: ProjectType;
  repo: string;
  repoData?: RepoSettingsQuery["repoSettings"];
  repoId: string;
}

const SharedSettings: React.FC<SharedSettingsProps> = ({
  hasLoaded,
  owner,
  projectData,
  projectIdentifier,
  projectType,
  repo,
  repoData,
  repoId,
}) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();
  const isRepo = projectType === ProjectType.Repo;
  const projectLabel = isRepo ? `${owner}/${repo}` : projectIdentifier;

  if (!tabRouteValues.includes(tab as ProjectSettingsTabRoutes)) {
    return (
      <Navigate
        replace
        to={
          isRepo
            ? getRepoSettingsRoute(repoId, ProjectSettingsTabRoutes.General)
            : getProjectSettingsRoute(
                projectIdentifier,
                ProjectSettingsTabRoutes.General,
              )
        }
      />
    );
  }

  return (
    <ProjectSettingsProvider>
      {!isRepo && <ProjectBanner projectIdentifier={projectIdentifier} />}
      <SideNavPageWrapper>
        <SideNav aria-label="Shared settings" widthOverride={250}>
          <ButtonsContainer>
            <StyledProjectSelect
              getProjectRoute={getProjectSettingsRoute}
              getRepoRoute={getRepoSettingsRoute}
              isProjectSettingsPage
              selectedProjectIdentifier={projectLabel}
            />
            {projectType === ProjectType.AttachedProject && repoId && (
              <StyledRouterLink
                arrowAppearance="persist"
                data-cy="attached-repo-link"
                to={getRepoSettingsRoute(
                  repoId,
                  tab && projectOnlyTabs.has(tab)
                    ? ProjectSettingsTabRoutes.General
                    : tab,
                )}
              >
                <strong>Go to repo settings</strong>
              </StyledRouterLink>
            )}
            <CreateDuplicateProjectButton
              id={projectData?.projectRef?.id}
              identifier={projectIdentifier}
              label={projectIdentifier}
              owner={owner}
              projectType={projectType}
              repo={repo}
            />
          </ButtonsContainer>
          <SideNavGroup>
            {Object.values(ProjectSettingsTabRoutes).map((v) => (
              <SharedSettingsNavItem
                key={v}
                currentTab={tab ?? ProjectSettingsTabRoutes.General}
                getRoute={
                  isRepo ? getRepoSettingsRoute : getProjectSettingsRoute
                }
                id={isRepo ? repoId : projectIdentifier}
                tab={v}
              />
            ))}
          </SideNavGroup>
        </SideNav>
        <SettingsPageContent
          data-cy={isRepo ? "repo-settings-page" : "project-settings-page"}
        >
          {hasLoaded ? (
            <ProjectSettingsTabs
              projectData={projectData}
              projectType={projectType}
              repoData={repoData}
            />
          ) : (
            <FormSkeleton />
          )}
        </SettingsPageContent>
      </SideNavPageWrapper>
    </ProjectSettingsProvider>
  );
};

const SharedSettingsNavItem: React.FC<{
  currentTab: ProjectSettingsTabRoutes;
  getRoute: (id: string, tab: ProjectSettingsTabRoutes) => string;
  id: string;
  tab: ProjectSettingsTabRoutes;
}> = ({ currentTab, getRoute, id, tab }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link}
    data-cy={`navitem-${tab}`}
    to={getRoute(id, tab)}
  >
    {getTabTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const ButtonsContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${size.s};
`;

const StyledProjectSelect = styled(ProjectSelect)`
  width: 100%;
`;

export default SharedSettings;
