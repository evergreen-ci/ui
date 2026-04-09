import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
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
  const { projectType } = options ?? {};

  const { githubChecksEnabled } = projectRef ?? {};

  const { githubCheckAliases } = sortAliases(aliases ?? []);

  const override = (field: unknown[] | undefined) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  return {
    github: {
      githubChecksEnabled: githubChecksEnabled ?? null,
      githubChecks: {
        githubCheckAliasesOverride: override(githubCheckAliases),
        githubCheckAliases,
      },
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
    id: id ?? "",
    githubChecksEnabled,
  };

  const githubCheckAliasDocs = transformAliases(
    githubCheckAliases,
    githubCheckAliasesOverride,
    AliasNames.GithubCheck,
  );

  const aliases = [...githubCheckAliasDocs];

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    aliases,
  };
}) satisfies FormToGqlFunction<Tab>;
