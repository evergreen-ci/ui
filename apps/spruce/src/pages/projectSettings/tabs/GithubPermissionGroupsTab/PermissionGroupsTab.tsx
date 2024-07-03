import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PermissionGroups;

export const PermissionGroupsTab: React.FC<TabProps> = ({ projectData }) => {
  const initialFormState = projectData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
    />
  );
};
