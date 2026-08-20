import { useMemo } from "react";
import { GithubWebhooksDisabledBanner } from "components/Banners";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ErrorType, ProjectType, getVersionControlError } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { PullRequestsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PullRequests;

const getInitialFormState = (
  projectData?: PullRequestsFormState,
  repoData?: PullRequestsFormState,
): PullRequestsFormState | undefined => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const PullRequestsTab: React.FC<TabProps> = ({
  githubProjectConflicts,
  githubWebhooksEnabled,
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
        githubWebhooksEnabled,
        formData,
        githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : undefined,
      ),
    [
      githubProjectConflicts,
      formData,
      githubWebhooksEnabled,
      projectType,
      repoData,
      versionControlEnabled,
    ],
  );

  const validateConflicts = validate(
    projectType,
    repoData,
    versionControlEnabled,
  );

  if (!initialFormState) return null;

  return (
    <>
      {!githubWebhooksEnabled && <GithubWebhooksDisabledBanner />}
      <BaseTab
        customValidate={validateConflicts}
        disabled={!githubWebhooksEnabled}
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
      />
    </>
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
