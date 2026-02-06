import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { ProjectSettingsTabRoutes, slugs } from "constants/routes";
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_SETTINGS, REPO_SETTINGS } from "gql/queries";
import SharedSettings from "./shared";
import { ProjectType } from "./shared/tabs/utils";

const ProjectSettings: React.FC = () => {
  const dispatchToast = useToastContext();
  const { [slugs.projectIdentifier]: projectIdentifier = "" } = useParams<{
    [slugs.projectIdentifier]: string;
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();

  usePageTitle(`Project Settings | ${projectIdentifier}`);

  const {
    data: projectData,
    error: projectError,
    loading: projectLoading,
  } = useQuery<ProjectSettingsQuery, ProjectSettingsQueryVariables>(
    PROJECT_SETTINGS,
    {
      skip: !projectIdentifier,
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
