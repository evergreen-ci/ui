import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useProjectSettingsAnalytics } from "analytics";
import {
  ProjectSettingsTabRoutes,
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
import SharedSettings from "./shared";
import { projectOnlyTabs } from "./shared/tabs/types";
import { ProjectType } from "./shared/tabs/utils";

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
      // DEVPROD-18977: Redirect can be removed once the repo settings URL change has been baked in long enough.
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

  const {
    data: projectData,
    error: projectError,
    loading: projectLoading,
  } = useQuery<ProjectSettingsQuery, ProjectSettingsQueryVariables>(
    PROJECT_SETTINGS,
    {
      skip: identifierIsObjectId || !projectIdentifier,
      variables: { projectIdentifier },
    },
  );
  useErrorToast(
    projectError,
    `There was an error loading the project ${projectIdentifier}`,
  );

  // Show error toast if project is hidden
  const hasShownHiddenToast = useRef(false);
  useEffect(() => {
    // Reset ref when project changes
    hasShownHiddenToast.current = false;
  }, [projectIdentifier]);

  useEffect(() => {
    if (
      projectData?.projectSettings?.projectRef?.hidden &&
      !hasShownHiddenToast.current
    ) {
      hasShownHiddenToast.current = true;
      dispatchToast.error(`Project is hidden.`);
    }
  }, [projectData?.projectSettings?.projectRef?.hidden, dispatchToast]);

  const projectIsHidden = projectData?.projectSettings?.projectRef?.hidden;
  const repoId = projectData?.projectSettings?.projectRef?.repoRefId ?? "";

  const {
    data: repoData,
    error: repoError,
    loading: repoLoading,
  } = useQuery<RepoSettingsQuery, RepoSettingsQueryVariables>(REPO_SETTINGS, {
    skip: !repoId || projectIsHidden === true,
    variables: { repoId },
  });
  useErrorToast(repoError, `There was an error loading the repo ${repoId}`);

  if (projectIsHidden) {
    return null;
  }

  const projectType = repoId
    ? ProjectType.AttachedProject
    : ProjectType.Project;

  const project = projectData?.projectSettings;
  const repo = repoData?.repoSettings;

  const ownerName = project?.projectRef?.owner ?? "";
  const repoName = project?.projectRef?.repo ?? "";

  const hasLoaded =
    projectType === ProjectType.Project
      ? !projectLoading && !!project
      : !projectLoading && !!project && !repoLoading && !!repo;

  return (
    <SharedSettings
      hasLoaded={hasLoaded}
      owner={ownerName}
      projectData={project}
      projectIdentifier={projectIdentifier}
      projectType={projectType}
      repo={repoName}
      repoData={repo}
      repoId={repoId}
    />
  );
};

export default ProjectSettings;
