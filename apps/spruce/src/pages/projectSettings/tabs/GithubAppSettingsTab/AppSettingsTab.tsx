import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubAppSettings;

export const AppSettingsTab: React.FC<TabProps> = ({
  githubPermissionGroups,
  identifier,
  projectData,
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
      }),
    [githubPermissionGroups, identifier, isAppDefined],
  );

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
    />
  );
};
