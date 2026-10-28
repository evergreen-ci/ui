import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps, TaskOwnershipAndFoliageFormState } from "./types";

const tab = ProjectSettingsTabRoutes.TaskOwnershipAndFoliage;

const PREFIX_REQUIRED_MESSAGE =
  "Generated task validation prefix must be set when tracking or blocking tasks missing the validation prefix.";

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
        PREFIX_REQUIRED_MESSAGE,
      );
    }

    return errors;
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
      customValidate={getValidate(repoData)}
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
