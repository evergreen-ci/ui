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
  githubWebhooksEnabled,
  projectData,
  projectId,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(tab) as { formData: PullRequestsFormState };

  const { data } = useQuery<
    GithubProjectConflictsQuery,
    GithubProjectConflictsQueryVariables
  >(
    GITHUB_PROJECT_CONFLICTS,
    projectType === ProjectType.Repo ? skipToken : { variables: { projectId } },
  );
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
