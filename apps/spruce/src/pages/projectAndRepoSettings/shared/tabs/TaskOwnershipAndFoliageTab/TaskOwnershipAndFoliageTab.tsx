import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps, TaskOwnershipAndFoliageFormState } from "./types";

const tab = ProjectSettingsTabRoutes.TaskOwnershipAndFoliage;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): TaskOwnershipAndFoliageFormState => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!projectData) return repoData;
  return projectData;
};

export const TaskOwnershipAndFoliageTab: React.FC<TabProps> = ({
  projectData,
  repoData,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(() => getFormSchema(repoData), [repoData]);

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
