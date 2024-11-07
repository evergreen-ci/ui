import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { findDuplicateIndices, ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PermissionGroupsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubPermissionGroups;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): PermissionGroupsFormState => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const PermissionGroupsTab: React.FC<TabProps> = ({
  identifier,
  projectData,
  projectType,
  repoData,
  repoId,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const isRepo = projectType === ProjectType.Repo;
  const projectAppId = projectData?.appCredentials?.githubAppAuth?.appId;
  const repoAppId = repoData?.appCredentials?.githubAppAuth?.appId ?? 0;
  const defaultsToRepo = !isRepo && !(projectAppId > 0) && repoAppId > 0;

  const formSchema = useMemo(
    () => getFormSchema({ identifier, repoId, defaultsToRepo }),
    [identifier, repoId, defaultsToRepo],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters a duplicate GitHub permission types. */
const validate = ((formData, errors) => {
  formData.permissionGroups.forEach((pg, idx) => {
    const duplicateIndices = findDuplicateIndices(pg.permissions, "type");
    duplicateIndices.forEach((i) => {
      errors.permissionGroups?.[idx]?.permissions?.[i]?.type?.addError(
        "Duplicate types are not allowed.",
      );
    });
  });
  return errors;
}) satisfies ValidateProps<PermissionGroupsFormState>;
