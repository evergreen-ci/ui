import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, Link, Navigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { ProjectBanner } from "components/Banners";
import { ProjectSelect } from "components/ProjectSelect";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "components/styles";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  slugs,
} from "constants/routes";
import {
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { REPO_SETTINGS } from "gql/queries";
import { ProjectType } from "pages/sharedProjectSettings/tabs/utils";
import { ProjectSettingsProvider } from "../sharedProjectSettings/Context";
import { getTabTitle } from "../sharedProjectSettings/getTabTitle";
import { ProjectSettingsTabs } from "../sharedProjectSettings/Tabs";

const RepoSettings: React.FC = () => {
  const { [slugs.repoId]: repoId = "", [slugs.tab]: tab } = useParams<{
    [slugs.repoId]: string;
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();
  const dispatchToast = useToastContext();
  usePageTitle(`Repo Settings | ${repoId}`);

  const { data: repoData, loading: repoLoading } = useQuery<
    RepoSettingsQuery,
    RepoSettingsQueryVariables
  >(REPO_SETTINGS, {
    skip: !repoId,
    variables: { repoId },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the repo ${repoId}: ${e.message}`,
      );
    },
  });

  if (!tabRouteValues.includes(tab as ProjectSettingsTabRoutes)) {
    return (
      <Navigate
        replace
        to={getRepoSettingsRoute(repoId, ProjectSettingsTabRoutes.General)}
      />
    );
  }

  const sharedProps = {
    repoId,
    currentTab: tab ?? ProjectSettingsTabRoutes.General,
  };
  const repo = repoData?.repoSettings;
  const ownerName = repo?.projectRef?.owner;
  const repoName = repo?.projectRef?.repo;

  // If current project is a repo, use "owner/repo" since repos lack identifiers
  const projectLabel = `${ownerName}/${repoName}`;
  const hasLoaded = !repoLoading && repo;

  return (
    <ProjectSettingsProvider>
      <ProjectBanner projectIdentifier={repoId} />
      <SideNavPageWrapper>
        <SideNav aria-label="Repo Settings" widthOverride={250}>
          <ButtonsContainer>
            <StyledProjectSelect
              getRoute={getProjectSettingsRoute}
              isProjectSettingsPage
              selectedProjectIdentifier={projectLabel}
            />
          </ButtonsContainer>
          <SideNavGroup>
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.General}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Access}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Variables}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubCommitQueue}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Notifications}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.PatchAliases}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.VirtualWorkstation}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Containers}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.ViewsAndFilters}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.ProjectTriggers}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.PeriodicBuilds}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Plugins}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubAppSettings}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubPermissionGroups}
            />
            <RepoSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.EventLog}
            />
          </SideNavGroup>
        </SideNav>
        <SideNavPageContent
          css={css`
            padding-top: 0;
            margin-top: ${size.m};
          `}
          data-cy="repo-settings-page"
        >
          {hasLoaded ? (
            <ProjectSettingsTabs
              projectType={ProjectType.Repo}
              repoData={repoData?.repoSettings}
            />
          ) : (
            <FormSkeleton />
          )}
        </SideNavPageContent>
      </SideNavPageWrapper>
    </ProjectSettingsProvider>
  );
};

const RepoSettingsNavItem: React.FC<{
  currentTab: ProjectSettingsTabRoutes;
  repoId: string;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, repoId, tab, title }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link}
    data-cy={`navitem-${tab}`}
    to={getRepoSettingsRoute(repoId, tab)}
  >
    {title || getTabTitle(tab).title}
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

export default RepoSettings;
