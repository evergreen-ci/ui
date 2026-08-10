import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps, TestSelectionFormState } from "./types";

const tab = ProjectSettingsTabRoutes.TestSelection;
const mainlineRequiresPatchesError =
  "Test selection cannot be enabled for mainline commits without also being enabled for patches.";

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
      formData?.allowed === null &&
      repoData?.allowed) ||
      formData?.allowed) ??
    false;

  const isPatchTestSelectionEnabled =
    formData?.defaultEnabled ??
    initialFormState?.defaultEnabled ??
    repoData?.defaultEnabled ??
    false;

  const validate: ValidateProps<TestSelectionFormState> = (
    settings,
    errors,
  ) => {
    const patchesEnabled =
      settings.defaultEnabled ?? repoData?.defaultEnabled ?? false;
    const mainlineEnabled =
      settings.mainlineDefaultEnabled ??
      repoData?.mainlineDefaultEnabled ??
      false;

    if (mainlineEnabled && !patchesEnabled) {
      errors.mainlineDefaultEnabled.addError(mainlineRequiresPatchesError);
    }

    return errors;
  };

  const formSchema = useMemo(
    () =>
      getFormSchema({
        repoData:
          projectType === ProjectType.AttachedProject ? repoData : undefined,
        canEnableTaskLevel,
        mainlineRequiresPatches: !isPatchTestSelectionEnabled,
      }),
    [projectType, canEnableTaskLevel, isPatchTestSelectionEnabled, repoData],
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
