import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, canOverrideForProject } from "../utils";
import { CommitChecksFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.CommitChecks;

export const mergeProjectRepo = (
  projectData: CommitChecksFormState,
  repoData: CommitChecksFormState,
): CommitChecksFormState => {
  const {
    github: { githubChecks },
  } = repoData;

  const merged: CommitChecksFormState = projectData;
  merged.github.githubChecks.repoData = githubChecks;

  return merged;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const { githubChecksEnabled } = projectRef ?? {};
  const { githubCheckAliases } = sortAliases(aliases ?? []);

  return {
    github: {
      githubChecks: {
        githubCheckAliases,
        githubCheckAliasesOverride: canOverrideForProject(
          options?.projectType,
          githubCheckAliases,
        ),
      },
      githubChecksEnabled: githubChecksEnabled ?? null,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    github: {
      githubChecks: { githubCheckAliases, githubCheckAliasesOverride },
      githubChecksEnabled,
    },
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    githubChecksEnabled,
    id,
  };

  const githubCommitCheckAliases = transformAliases(
    githubCheckAliases,
    githubCheckAliasesOverride,
    AliasNames.GithubCheck,
  );

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    aliases: githubCommitCheckAliases,
    projectRef,
  };
}) satisfies FormToGqlFunction<Tab>;
