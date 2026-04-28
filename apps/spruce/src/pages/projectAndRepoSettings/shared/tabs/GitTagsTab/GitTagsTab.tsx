import { useMemo } from "react";
import { Banner } from "@leafygreen-ui/banner";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType, ErrorType, getVersionControlError } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { GitTagsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GitTags;

const getInitialFormState = (
  projectData?: GitTagsFormState,
  repoData?: GitTagsFormState,
): GitTagsFormState | undefined => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const GitTagsTab: React.FC<TabProps> = ({
  githubWebhooksEnabled,
  projectData,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData }: { formData: GitTagsFormState } = getTab(tab);

  const initialFormState: GitTagsFormState = useMemo(
    () => getInitialFormState(projectData, repoData) ?? formData,
    [projectData, repoData, formData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        githubWebhooksEnabled,
        formData,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : undefined,
      ),
    [
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

  return (
    <>
      {!githubWebhooksEnabled && (
        <Banner data-cy="disabled-webhook-banner" variant="warning">
          GitHub features are disabled because the Evergreen GitHub App is not
          installed on the saved owner/repo. Contact IT to install the App and
          enable GitHub features.
        </Banner>
      )}
      <BaseTab
        disabled={!githubWebhooksEnabled}
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
        validate={validateConflicts}
      />
    </>
  );
};

const validate = (
  projectType: ProjectType,
  repoData: GitTagsFormState | undefined,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      github: { gitTagVersionsEnabled, gitTags },
    } = formData;

    const getAliasError = getVersionControlError(
      versionControlEnabled,
      projectType,
    );

    if (
      getAliasError(
        // @ts-expect-error: FIXME.
        gitTagVersionsEnabled,
        gitTags?.gitTagAliasesOverride,
        gitTags?.gitTagAliases,
        repoData?.github?.gitTags?.gitTagAliases,
      ) === ErrorType.Error
    ) {
      errors.github.gitTags.addError("Missing Git Tag Definition");
    }

    return errors;
  }) satisfies ValidateProps<GitTagsFormState>;
