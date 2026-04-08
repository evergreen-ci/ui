import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { ErrorType, getVersionControlError } from "./getErrors";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { PullRequestsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PullRequests;

const getInitialFormState = (
  projectData?: PullRequestsFormState,
  repoData?: PullRequestsFormState,
): PullRequestsFormState => {
  if (!projectData) return repoData as PullRequestsFormState;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const PullRequestsTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab) as { formData: PullRequestsFormState };

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        formData,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : undefined,
      ),
    [formData, projectType, repoData, versionControlEnabled],
  );

  const validateConflicts = validate(
    projectType,
    repoData,
    versionControlEnabled,
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validateConflicts}
    />
  );
};

const validate = (
  projectType: ProjectType,
  repoData: PullRequestsFormState | undefined,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      github: { prTesting, prTestingEnabled },
    } = formData;

    const getAliasError = getVersionControlError(
      versionControlEnabled,
      projectType,
    );

    if (
      getAliasError(
        !!prTestingEnabled,
        prTesting?.githubPrAliasesOverride,
        prTesting?.githubPrAliases,
        repoData?.github?.prTesting?.githubPrAliases ?? [],
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Patch Definition");
    }

    return errors;
  }) satisfies ValidateProps<PullRequestsFormState>;
