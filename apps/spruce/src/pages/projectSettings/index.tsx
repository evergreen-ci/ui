import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useProjectSettingsAnalytics } from "analytics";
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
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_SETTINGS, REPO_SETTINGS } from "gql/queries";
import { useProjectRedirect } from "hooks/useProjectRedirect";
import { validators } from "utils";
import { ProjectSettingsProvider } from "../sharedProjectSettings/Context";
import { CreateDuplicateProjectButton } from "../sharedProjectSettings/CreateDuplicateProjectButton";
import { getTabTitle } from "../sharedProjectSettings/getTabTitle";
import { ProjectSettingsTabs } from "../sharedProjectSettings/Tabs";
import { projectOnlyTabs } from "../sharedProjectSettings/tabs/types";
import { ProjectType } from "../sharedProjectSettings/tabs/utils";

const { validateObjectId } = validators;

const ProjectSettings: React.FC = () => {
  const { sendEvent } = useProjectSettingsAnalytics();
  const dispatchToast = useToastContext();
  const {
    [slugs.projectIdentifier]: projectIdentifier = "",
    [slugs.tab]: tab,
  } = useParams<{
    [slugs.projectIdentifier]: string;
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();
  usePageTitle(`Project Settings | ${projectIdentifier}`);
  const navigate = useNavigate();

  // If the path includes an Object ID, we should redirect the user so that they use the identifier.
  const identifierIsObjectId = validateObjectId(projectIdentifier);

  useProjectRedirect({
    shouldRedirect: identifierIsObjectId,

    onError: (repoId) => {
      // This redirect can be removed once the repo settings URL change has been baked in long enough.
      navigate(
        getRepoSettingsRoute(
          repoId,
          tab && projectOnlyTabs.has(tab)
            ? ProjectSettingsTabRoutes.General
            : tab,
        ),
      );
    },
    sendAnalyticsEvent: (projectId: string, identifier: string) => {
      sendEvent({
        name: "Redirected to project identifier",
        "project.id": projectId,
        "project.identifier": identifier,
      });
    },
  });

  const { data: projectData, loading: projectLoading } = useQuery<
    ProjectSettingsQuery,
    ProjectSettingsQueryVariables
  >(PROJECT_SETTINGS, {
    skip: identifierIsObjectId || !projectIdentifier,
    variables: { projectIdentifier },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the project ${projectIdentifier}: ${e.message}`,
      );
    },
  });

  const repoId = projectData?.projectSettings?.projectRef?.repoRefId ?? "";

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
        to={getProjectSettingsRoute(
          projectIdentifier,
          ProjectSettingsTabRoutes.General,
        )}
      />
    );
  }

  const sharedProps = {
    projectIdentifier: projectIdentifier ?? "",
    currentTab: tab ?? ProjectSettingsTabRoutes.General,
  };
  const projectType = repoId
    ? ProjectType.AttachedProject
    : ProjectType.Project;
  const project = projectData?.projectSettings;
  const repo = repoData?.repoSettings;
  const ownerName = project?.projectRef?.owner ?? "";
  const repoName = project?.projectRef?.repo ?? "";
  const hasLoaded =
    projectType === ProjectType.Project
      ? !projectLoading && project
      : !projectLoading && project && !repoLoading && repo;

  return (
    <ProjectSettingsProvider>
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <SideNavPageWrapper>
        <SideNav aria-label="Project Settings" widthOverride={250}>
          <ButtonsContainer>
            <StyledProjectSelect
              getRoute={getProjectSettingsRoute}
              isProjectSettingsPage
              selectedProjectIdentifier={projectIdentifier}
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
              id={project?.projectRef?.id ?? ""}
              label={projectIdentifier}
              owner={ownerName}
              projectType={projectType}
              repo={repoName}
            />
          </ButtonsContainer>
          <SideNavGroup>
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.General}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Access}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Variables}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubCommitQueue}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Notifications}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.PatchAliases}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.VirtualWorkstation}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Containers}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.ViewsAndFilters}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.ProjectTriggers}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.PeriodicBuilds}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.Plugins}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubAppSettings}
            />
            <ProjectSettingsNavItem
              {...sharedProps}
              tab={ProjectSettingsTabRoutes.GithubPermissionGroups}
            />
            <ProjectSettingsNavItem
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
          data-cy="project-settings-page"
        >
          {hasLoaded ? (
            <ProjectSettingsTabs
              projectData={project}
              projectType={projectType}
              repoData={repo}
            />
          ) : (
            <FormSkeleton />
          )}
        </SideNavPageContent>
      </SideNavPageWrapper>
    </ProjectSettingsProvider>
  );
};

const ProjectSettingsNavItem: React.FC<{
  currentTab: ProjectSettingsTabRoutes;
  projectIdentifier: string;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, projectIdentifier, tab, title }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link}
    data-cy={`navitem-${tab}`}
    to={getProjectSettingsRoute(projectIdentifier, tab)}
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

export default ProjectSettings;
