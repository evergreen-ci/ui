import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType, findDuplicateIndices } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PromoteVariablesModalButton } from "./PromoteVariablesModal";
import { VariablesFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Variables;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): VariablesFormState => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const VariablesTab: React.FC<TabProps> = ({
  identifier,
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: VariablesFormState } = getTab(
    ProjectSettingsTabRoutes.Variables,
  );

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const variables = formData?.vars?.map(({ varName }) => ({
    name: varName,
    inRepo:
      repoData?.vars?.some(({ varName: repoVar }) => varName === repoVar) ??
      false,
  }));

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        projectType === ProjectType.AttachedProject ? repoData : null,
        projectType === ProjectType.AttachedProject ? (
          <PromoteVariablesModalButton
            projectId={identifier}
            variables={variables}
          />
        ) : null,
      ),
    [projectType, repoData, identifier, variables],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters a variable name that already appears in the project. */
const validate = ((formData, errors) => {
  const duplicateIndices = findDuplicateIndices(formData.vars, "varName");
  duplicateIndices.forEach((i) => {
    errors.vars?.[i]?.varName?.addError(
      "Value already appears in project variables.",
    );
  });

  return errors;
}) satisfies ValidateProps<VariablesFormState>;
