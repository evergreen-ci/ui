import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import throttle from "lodash.throttle";
import { useParams, Link, Navigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
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
  slugs,
} from "constants/routes";
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_SETTINGS, REPO_SETTINGS } from "gql/queries";
import { usePageTitle } from "hooks";
import { useProjectRedirect } from "hooks/useProjectRedirect";
import { validators } from "utils";
import { ProjectSettingsProvider } from "./Context";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { getTabTitle } from "./getTabTitle";
import { ProjectSettingsTabs } from "./Tabs";
import { projectOnlyTabs } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

const { validateObjectId } = validators;

const ProjectSettings: React.FC = () => {
  usePageTitle(`Project Settings`);
  const dispatchToast = useToastContext();
  const { [slugs.projectIdentifier]: projectIdentifier, [slugs.tab]: tab } =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    useParams<{
      [slugs.projectIdentifier]: string | null;
      [slugs.tab]: ProjectSettingsTabRoutes;
    }>();

  const [atTop, setAtTop] = useState(true);
  const pageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = throttle(() => {
      if (!pageWrapperRef?.current) return;
      if (pageWrapperRef?.current?.scrollTop < 40) {
        setAtTop(true);
      } else {
        setAtTop(false);
      }
    }, 250);
    pageWrapperRef?.current?.addEventListener("scroll", onScroll);

    const wrapper = pageWrapperRef.current;
    return () => wrapper?.removeEventListener("scroll", onScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // If the path includes an Object ID, this page could either be a project or a repo if it is a project we should redirect the user so that they use the identifier.
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const identifierIsObjectId = validateObjectId(projectIdentifier);
  const [isRepo, setIsRepo] = useState<boolean>(false);

  const { sendEvent } = useProjectSettingsAnalytics();

  useEffect(() => {
    // Reset state on page change
    setIsRepo(false);
  }, [projectIdentifier]);

  useProjectRedirect({
    shouldRedirect: identifierIsObjectId,
    onError: () => {
      setIsRepo(true);
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
    skip: identifierIsObjectId,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { projectIdentifier },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the project ${projectIdentifier}: ${e.message}`,
      );
    },
  });

  const repoId =
    projectData?.projectSettings?.projectRef?.repoRefId || projectIdentifier;

  // Assign project type in order to show/hide elements that should only appear for repos, attached projects, etc.
  let projectType: ProjectType;
  if (isRepo) {
    projectType = ProjectType.Repo;
  } else if (projectData?.projectSettings?.projectRef?.repoRefId) {
    projectType = ProjectType.AttachedProject;
  } else {
    projectType = ProjectType.Project;
  }

  const { data: repoData } = useQuery<
    RepoSettingsQuery,
    RepoSettingsQueryVariables
  >(REPO_SETTINGS, {
    skip: projectLoading || projectType === ProjectType.Project,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { repoId },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the repo ${repoId}: ${e.message}`,
      );
    },
  });

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!tabRouteValues.includes(tab)) {
    return (
      <Navigate
        replace
        to={getProjectSettingsRoute(
          // @ts-expect-error: FIXME. This comment was added by an automated script.
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
  const project =
    projectType === ProjectType.Repo
      ? repoData?.repoSettings
      : projectData?.projectSettings;

  const hasLoaded =
    (projectData || projectType === ProjectType.Repo) &&
    (repoData || projectType === ProjectType.Project) &&
    project;

  const owner = project?.projectRef?.owner;
  const repo = project?.projectRef?.repo;

  // If current project is a repo, use "owner/repo" since repos lack identifiers
  const projectLabel =
    projectType === ProjectType.Repo ? `${owner}/${repo}` : projectIdentifier;

  return (
    <ProjectSettingsProvider>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <SideNavPageWrapper>
        <SideNav aria-label="Project Settings" widthOverride={250}>
          <ButtonsContainer>
            <StyledProjectSelect
              getRoute={getProjectSettingsRoute}
              isProjectSettingsPage
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              selectedProjectIdentifier={projectLabel}
            />
            {projectType === ProjectType.AttachedProject && repoId && (
              <StyledRouterLink
                arrowAppearance="persist"
                data-cy="attached-repo-link"
                to={getProjectSettingsRoute(
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
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              id={project?.projectRef?.id}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              label={projectLabel}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              owner={owner}
              projectType={projectType}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repo={repo}
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
          ref={pageWrapperRef}
          css={css`
            padding-top: 0;
            margin-top: ${size.m};
          `}
          data-cy="project-settings-page"
        >
          {hasLoaded ? (
            <ProjectSettingsTabs
              atTop={atTop}
              projectData={projectData?.projectSettings}
              projectType={projectType}
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
