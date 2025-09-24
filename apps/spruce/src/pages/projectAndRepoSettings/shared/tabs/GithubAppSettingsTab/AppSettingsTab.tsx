import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { AppSettingsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubAppSettings;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): AppSettingsFormState => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const AppSettingsTab: React.FC<TabProps> = ({
  githubPermissionGroups,
  identifier,
  projectData,
  projectId,
  projectType,
  repoData,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const isRepo = projectType === ProjectType.Repo;
  const projectAppId = projectData?.appCredentials?.githubAppAuth?.appId ?? 0;
  const repoAppId = repoData?.appCredentials?.githubAppAuth?.appId ?? 0;

  const defaultsToRepo = !isRepo && !(projectAppId > 0) && repoAppId > 0;

  const data = isRepo ? repoData : projectData;
  const isAppDefined =
    (data?.appCredentials?.githubAppAuth?.appId ?? 0) > 0 &&
    (data?.appCredentials?.githubAppAuth?.privateKey?.length ?? 0) > 0;

  const formSchema = useMemo(
    () =>
      getFormSchema({
        githubPermissionGroups,
        identifier,
        isAppDefined,
        projectId,
        repoData,
        defaultsToRepo,
      }),
    [
      githubPermissionGroups,
      identifier,
      isAppDefined,
      projectId,
      repoData,
      defaultsToRepo,
    ],
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

/* Prevent saving if a user does not have app ID and app key defined. */
const validate = ((formData, errors) => {
  if (
    formData.appCredentials.githubAppAuth.appId &&
    !formData.appCredentials.githubAppAuth.privateKey
  ) {
    errors.appCredentials.githubAppAuth.privateKey.addError(
      "Private key must be specified if an app ID is defined.",
    );
  }

  if (
    !formData.appCredentials.githubAppAuth.appId &&
    formData.appCredentials.githubAppAuth.privateKey
  ) {
    errors.appCredentials.githubAppAuth.appId.addError(
      "App ID must be specified if a private key is defined.",
    );
  }
  return errors;
}) satisfies ValidateProps<AppSettingsFormState>;
