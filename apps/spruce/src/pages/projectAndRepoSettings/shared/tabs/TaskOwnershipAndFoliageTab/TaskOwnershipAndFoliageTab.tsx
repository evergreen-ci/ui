import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
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

const getValidate =
  (
    repoData: TabProps["repoData"],
  ): ValidateProps<TaskOwnershipAndFoliageFormState> =>
  (formData, errors) => {
    const trackEnabled =
      formData.tagValidation.trackGeneratedTaskTagValidation ??
      repoData?.tagValidation.trackGeneratedTaskTagValidation ??
      false;
    const blockEnabled =
      formData.tagValidation.blockTaskGenerationOnTagValidation ??
      repoData?.tagValidation.blockTaskGenerationOnTagValidation ??
      false;
    // The project defaults to the repo when its own prefix is unset, so the
    // effective prefix is what save-time validation checks.
    const prefix =
      formData.tagValidation.generatedTaskValidationPrefix ||
      repoData?.tagValidation.generatedTaskValidationPrefix ||
      "";

    if ((trackEnabled || blockEnabled) && prefix === "") {
      errors.tagValidation.generatedTaskValidationPrefix.addError(
        "Must be set when either of the settings below are enabled.",
      );
    }

    return errors;
  };

export const TaskOwnershipAndFoliageTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType === ProjectType.AttachedProject ? repoData : undefined,
      ),
    [repoData, projectType],
  );

  return (
    <BaseTab
      customValidate={getValidate(repoData)}
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
