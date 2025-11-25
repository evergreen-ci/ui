import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Banner } from "@leafygreen-ui/banner";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  GithubProjectConflictsQuery,
  GithubProjectConflictsQueryVariables,
} from "gql/generated/types";
import { GITHUB_PROJECT_CONFLICTS } from "gql/queries";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { ErrorType, getVersionControlError } from "./getErrors";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { GCQFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubCommitQueue;

const getInitialFormState = (
  projectData: GCQFormState,
  repoData: GCQFormState,
): GCQFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const GithubCommitQueueTab: React.FC<TabProps> = ({
  githubWebhooksEnabled,
  identifier,
  projectData,
  projectId,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const { data } = useQuery<
    GithubProjectConflictsQuery,
    GithubProjectConflictsQueryVariables
  >(GITHUB_PROJECT_CONFLICTS, {
    skip: projectType === ProjectType.Repo,
    variables: { projectId },
  });

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
        data?.githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [
      data?.githubProjectConflicts,
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
      {!githubWebhooksEnabled && (
        <Banner variant="warning">
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
  repoData: GCQFormState,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      github: {
        gitTagVersionsEnabled,
        gitTags,
        githubChecks,
        githubChecksEnabled,
        prTesting,
        prTestingEnabled,
      },
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
        prTestingEnabled,
        prTesting?.githubPrAliasesOverride,
        prTesting?.githubPrAliases,
        repoData?.github?.prTesting?.githubPrAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Patch Definition");
    }

    if (
      getAliasError(
        githubChecksEnabled,
        githubChecks?.githubCheckAliasesOverride,
        githubChecks?.githubCheckAliases,
        repoData?.github?.githubChecks?.githubCheckAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Commit Check Definition");
    }

    if (
      getAliasError(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        gitTagVersionsEnabled,
        gitTags?.gitTagAliasesOverride,
        gitTags?.gitTagAliases,
        repoData?.github?.gitTags?.gitTagAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Git Tag Definition");
    }

    if (
      getAliasError(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        enabled,
        patchDefinitions?.mergeQueueAliasesOverride,
        patchDefinitions?.mergeQueueAliases,
        repoData?.mergeQueue?.patchDefinitions?.mergeQueueAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Merge Queue Patch Definition");
    }

    return errors;
  }) satisfies ValidateProps<GCQFormState>;
