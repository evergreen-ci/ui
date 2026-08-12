import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { MAINLINE_REQUIRES_PATCHES_MESSAGE } from "./constants";
import { getFormSchema } from "./getFormSchema";
import { TabProps, TestSelectionFormState } from "./types";

const tab = ProjectSettingsTabRoutes.TestSelection;

export const TestSelectionTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = projectData || repoData;

  const canEnableTaskLevel =
    ((projectType === ProjectType.AttachedProject &&
      formData?.projectLevel.allowed === null &&
      repoData?.projectLevel.allowed) ||
      formData?.projectLevel.allowed) ??
    false;

  const canEnableMainline =
    formData?.taskLevel.defaultEnabled ??
    initialFormState?.taskLevel.defaultEnabled ??
    repoData?.taskLevel.defaultEnabled ??
    false;

  const validate: ValidateProps<TestSelectionFormState> = (
    settings,
    errors,
  ) => {
    const patchesEnabled =
      settings.taskLevel.defaultEnabled ??
      repoData?.taskLevel.defaultEnabled ??
      false;
    const mainlineEnabled =
      settings.taskLevel.mainlineDefaultEnabled ??
      repoData?.taskLevel.mainlineDefaultEnabled ??
      false;

    if (mainlineEnabled && !patchesEnabled) {
      errors.taskLevel.mainlineDefaultEnabled.addError(
        MAINLINE_REQUIRES_PATCHES_MESSAGE,
      );
    }

    return errors;
  };

  const formSchema = useMemo(
    () =>
      getFormSchema({
        repoData:
          projectType === ProjectType.AttachedProject ? repoData : undefined,
        canEnableTaskLevel,
        mainlineRequiresPatches: !canEnableMainline,
      }),
    [projectType, canEnableTaskLevel, canEnableMainline, repoData],
  );

  if (!initialFormState) {
    return null;
  }
  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validate}
    />
  );
};
