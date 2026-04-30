import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, canOverrideForProject } from "../utils";
import { PullRequestsFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PullRequests;

export const mergeProjectRepo = (
  projectData: PullRequestsFormState,
  repoData: PullRequestsFormState,
): PullRequestsFormState => {
  const {
    github: { prTesting },
  } = repoData;

  const merged: PullRequestsFormState = projectData;
  merged.github.prTesting.repoData = prTesting;
  return merged;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const { manualPrTestingEnabled, oldestAllowedMergeBase, prTestingEnabled } =
    projectRef ?? {};
  const { githubPrAliases } = sortAliases(aliases ?? []);
  const githubPRTriggerAliases =
    projectRef?.githubPRTriggerAliases
      ?.map((aliasName) =>
        projectRef?.patchTriggerAliases?.find(
          ({ alias }) => alias === aliasName,
        ),
      )
      .filter((a) => !!a) ?? [];

  return {
    github: {
      prTestingEnabled,
      manualPrTestingEnabled,
      oldestAllowedMergeBase: oldestAllowedMergeBase ?? "",
      prTesting: {
        githubPrAliasesOverride: canOverrideForProject(
          options?.projectType,
          githubPrAliases,
        ),
        githubPrAliases,
      },
      githubPRTriggerAliases,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    github: {
      manualPrTestingEnabled,
      oldestAllowedMergeBase,
      prTesting,
      prTestingEnabled,
    },
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    id,
    prTestingEnabled,
    manualPrTestingEnabled,
    oldestAllowedMergeBase,
  };

  const githubPrAliases = transformAliases(
    prTesting.githubPrAliases,
    prTesting.githubPrAliasesOverride,
    AliasNames.GithubPr,
  );

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    aliases: githubPrAliases,
  };
}) satisfies FormToGqlFunction<Tab>;
