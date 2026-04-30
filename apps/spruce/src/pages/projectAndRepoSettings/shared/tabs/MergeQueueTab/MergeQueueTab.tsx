import { useMemo } from "react";
import { GithubWebhooksDisabledBanner } from "components/Banners";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType, ErrorType, getVersionControlError } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { MergeQueueFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.MergeQueue;

const getInitialFormState = (
  projectData: MergeQueueFormState,
  repoData: MergeQueueFormState,
): MergeQueueFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const MergeQueueTab: React.FC<TabProps> = ({
  githubProjectConflicts,
  githubWebhooksEnabled,
  identifier,
  projectData,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        identifier,
        projectType,
        githubWebhooksEnabled,
        formData,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [
      githubProjectConflicts,
      formData,
      githubWebhooksEnabled,
      identifier,
      projectType,
      repoData,
      versionControlEnabled,
    ],
  );

  const validateConflicts = validate(
    projectType,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    repoData,
    versionControlEnabled,
  );

  return (
    <>
      {!githubWebhooksEnabled && <GithubWebhooksDisabledBanner />}
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
  repoData: MergeQueueFormState,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      mergeQueue: { enabled, patchDefinitions },
    } = formData;

    // getVersionControlError is a curried function, so save its partial application here to avoid repetition
    const getAliasError = getVersionControlError(
      versionControlEnabled,
      projectType,
    );

    if (
      getAliasError(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        enabled,
        patchDefinitions?.mergeQueueAliasesOverride,
        patchDefinitions?.mergeQueueAliases,
        repoData?.mergeQueue?.patchDefinitions?.mergeQueueAliases,
      ) === ErrorType.Error
    ) {
      errors.mergeQueue.patchDefinitions.addError(
        "Missing Merge Queue Patch Definition",
      );
    }

    return errors;
  }) satisfies ValidateProps<MergeQueueFormState>;
