import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, Link, Navigate } from "react-router-dom";
import { useProjectSettingsAnalytics } from "analytics";
import { ProjectBanner } from "components/Banners";
import { ProjectSelect } from "components/ProjectSelect";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
  slugs,
} from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
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
  // If the path includes an Object ID, this page could either be a project or a repo if it is a project we should redirect the user so that they use the identifier.
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const identifierIsObjectId = validateObjectId(projectIdentifier);
  const [isRepo, setIsRepo] = useState<boolean>(false);

  const { sendEvent } = useProjectSettingsAnalytics();

  useProjectRedirect({
    shouldRedirect: identifierIsObjectId,
    onError: () => {
      setIsRepo(true);
    },
    sendAnalyticsEvent: (projectId: string, identifier: string) => {
      sendEvent({
        name: "Redirect to project identifier",
        projectId,
        projectIdentifier: identifier,
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
      dispatchToast.error(`There was an error loading ${repoId}: ${e.message}`);
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
    projectIdentifier,
    currentTab: tab,
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
      <SideNav aria-label="Project Settings" widthOverride={250}>
        <ButtonsContainer>
          <ProjectSelect
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            selectedProjectIdentifier={projectLabel}
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
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
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.General}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Access}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Variables}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.GithubCommitQueue}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Notifications}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PatchAliases}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.VirtualWorkstation}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Containers}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.ViewsAndFilters}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.ProjectTriggers}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PeriodicBuilds}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Plugins}
          />
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.EventLog}
          />
        </SideNavGroup>
      </SideNav>
      <PageWrapper data-cy="project-settings-page">
        {hasLoaded ? (
          <ProjectSettingsTabs
            projectData={projectData?.projectSettings}
            projectType={projectType}
            repoData={repoData?.repoSettings}
          />
        ) : (
          <FormSkeleton />
        )}
      </PageWrapper>
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
    to={getProjectSettingsRoute(projectIdentifier, tab)}
    data-cy={`navitem-${tab}`}
  >
    {title || getTabTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const ButtonsContainer = styled.div`
  margin: 0 ${size.s};

  > :not(:last-child) {
    margin-bottom: ${size.xs};
  }
`;

export default ProjectSettings;
