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

  const formSchema = useMemo(
    () => getFormSchema({ githubPermissionGroups, identifier }),
    [githubPermissionGroups, identifier],
  );

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
    />
  );
};
