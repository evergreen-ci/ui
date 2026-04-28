import { useMemo } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
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
import { ProjectType, ErrorType, getVersionControlError } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { CommitChecksFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.CommitChecks;

const getInitialFormState = (
  projectData: CommitChecksFormState,
  repoData: CommitChecksFormState,
): CommitChecksFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const CommitChecksTab: React.FC<TabProps> = ({
  githubWebhooksEnabled,
  projectData,
  projectId,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab) as { formData: CommitChecksFormState };

  const { data } = useQuery<
    GithubProjectConflictsQuery,
    GithubProjectConflictsQueryVariables
  >(
    GITHUB_PROJECT_CONFLICTS,
    projectType === ProjectType.Repo ? skipToken : { variables: { projectId } },
  );

  const initialFormState = useMemo(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        githubWebhooksEnabled,
        formData,
        data?.githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : undefined,
      ),
    [
      data?.githubProjectConflicts,
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
  repoData: CommitChecksFormState | undefined,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      github: { githubChecks, githubChecksEnabled },
    } = formData as CommitChecksFormState;

    const getAliasError = getVersionControlError(
      versionControlEnabled,
      projectType,
    );

    if (
      getAliasError(
        githubChecksEnabled ?? false,
        githubChecks?.githubCheckAliasesOverride ?? false,
        githubChecks?.githubCheckAliases ?? [],
        repoData?.github?.githubChecks?.githubCheckAliases ?? [],
      ) === ErrorType.Error
    ) {
      errors.github.githubChecks?.addError?.("Missing Commit Check Definition");
    }

    return errors;
  }) satisfies ValidateProps<CommitChecksFormState>;
