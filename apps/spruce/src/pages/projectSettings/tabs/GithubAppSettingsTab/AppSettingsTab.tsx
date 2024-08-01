import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { AppSettingsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubAppSettings;

export const AppSettingsTab: React.FC<TabProps> = ({
  githubPermissionGroups,
  identifier,
  projectData,
  projectId,
}) => {
  const initialFormState = projectData;
  const isAppDefined =
    projectData?.appCredentials?.githubAppAuth?.appId > 0 &&
    projectData?.appCredentials?.githubAppAuth?.privateKey?.length > 0;

  const formSchema = useMemo(
    () =>
      getFormSchema({
        githubPermissionGroups,
        identifier,
        isAppDefined,
        projectId,
      }),
    [githubPermissionGroups, identifier, isAppDefined, projectId],
  );

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
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
