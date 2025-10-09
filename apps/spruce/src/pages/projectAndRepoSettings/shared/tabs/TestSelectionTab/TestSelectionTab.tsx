import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.TestSelection;

export const TestSelectionTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const canEnableTaskLevel =
    ((projectType === ProjectType.AttachedProject &&
      formData?.allowed === null &&
      repoData?.allowed) ||
      formData?.allowed) ??
    false;

  const initialFormState = projectData || repoData;

  const formSchema = useMemo(
    () =>
      getFormSchema({
        repoData:
          projectType === ProjectType.AttachedProject ? repoData : undefined,
        canEnableTaskLevel,
      }),
    [projectType, canEnableTaskLevel, repoData],
  );

  if (!initialFormState) {
    return null;
  }
  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
