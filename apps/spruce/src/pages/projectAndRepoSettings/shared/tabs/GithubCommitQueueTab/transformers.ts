import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { GCQFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.GithubCommitQueue;

export const mergeProjectRepo = (
  projectData: GCQFormState,
  repoData: GCQFormState,
): GCQFormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    github: { gitTags, githubChecks, prTesting, teams, users },
    mergeQueue: { patchDefinitions },
  } = repoData;
  const mergedObject: GCQFormState = projectData;
  mergedObject.github.prTesting.repoData = prTesting;
  mergedObject.github.githubChecks.repoData = githubChecks;
  mergedObject.github.users.repoData = users;
  mergedObject.github.teams.repoData = teams;
  mergedObject.github.gitTags.repoData = gitTags;
  mergedObject.mergeQueue.patchDefinitions.repoData = patchDefinitions;
  return mergedObject;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { projectType } = options;

  const {
    commitQueue,
    gitTagAuthorizedTeams,
    gitTagAuthorizedUsers,
    gitTagVersionsEnabled,
    githubChecksEnabled,
    manualPrTestingEnabled,
    oldestAllowedMergeBase,
    prTestingEnabled,
  } = projectRef ?? {};

  const {
    gitTagAliases,
    githubCheckAliases,
    githubPrAliases,
    mergeQueueAliases,
  } = sortAliases(aliases ?? []);

  const override = (field: Array<any>) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  const githubPRTriggerAliases =
    projectRef?.githubPRTriggerAliases
      ?.map((aliasName) =>
        projectRef?.patchTriggerAliases?.find(
          ({ alias }) => alias === aliasName,
        ),
      )
      ?.filter((a) => a) ?? [];

  const githubMQTriggerAliases =
    projectRef?.githubMQTriggerAliases
      ?.map((aliasName) =>
        projectRef?.patchTriggerAliases?.find(
          ({ alias }) => alias === aliasName,
        ),
      )
      ?.filter((a) => a) ?? [];

  return {
    github: {
      prTestingEnabled,
      manualPrTestingEnabled,
      prTesting: {
        githubPrAliasesOverride: override(githubPrAliases),
        githubPrAliases,
      },
      githubMQTriggerAliases,
      githubPRTriggerAliases,
      githubChecksEnabled,
      githubChecks: {
        githubCheckAliasesOverride: override(githubCheckAliases),
        githubCheckAliases,
      },
      gitTagVersionsEnabled,
      oldestAllowedMergeBase,
      users: {
        gitTagAuthorizedUsersOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedUsers,
        gitTagAuthorizedUsers: gitTagAuthorizedUsers ?? [],
      },
      teams: {
        gitTagAuthorizedTeamsOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedTeams,
        gitTagAuthorizedTeams: gitTagAuthorizedTeams ?? [],
      },
      gitTags: {
        gitTagAliasesOverride: override(gitTagAliases),
        gitTagAliases,
      },
    },
    mergeQueue: {
      enabled: commitQueue?.enabled ?? false,
      patchDefinitions: {
        mergeQueueAliasesOverride: override(mergeQueueAliases),
        mergeQueueAliases,
      },
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    github: {
      gitTagVersionsEnabled,
      gitTags,
      githubChecks,
      githubChecksEnabled,
      manualPrTestingEnabled,
      oldestAllowedMergeBase,
      prTesting,
      prTestingEnabled,
      teams: { gitTagAuthorizedTeams, gitTagAuthorizedTeamsOverride },
      users: { gitTagAuthorizedUsers, gitTagAuthorizedUsersOverride },
    },
    mergeQueue: { enabled, patchDefinitions },
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    prTestingEnabled,
    manualPrTestingEnabled,
    githubChecksEnabled,
    gitTagVersionsEnabled,
    oldestAllowedMergeBase,
    gitTagAuthorizedUsers: gitTagAuthorizedUsersOverride
      ? gitTagAuthorizedUsers
      : null,
    gitTagAuthorizedTeams: gitTagAuthorizedTeamsOverride
      ? gitTagAuthorizedTeams
      : null,
    commitQueue: {
      enabled,
    },
  };

  const githubPrAliases = transformAliases(
    prTesting.githubPrAliases,
    prTesting.githubPrAliasesOverride,
    AliasNames.GithubPr,
  );

  const githubCheckAliases = transformAliases(
    githubChecks.githubCheckAliases,
    githubChecks.githubCheckAliasesOverride,
    AliasNames.GithubCheck,
  );

  const gitTagAliases = transformAliases(
    gitTags.gitTagAliases,
    gitTags.gitTagAliasesOverride,
    AliasNames.GitTag,
  );

  const mergeQueueAliases = transformAliases(
    patchDefinitions.mergeQueueAliases,
    patchDefinitions.mergeQueueAliasesOverride,
    AliasNames.MergeQueue,
  );

  const aliases = [
    ...githubPrAliases,
    ...githubCheckAliases,
    ...gitTagAliases,
    ...mergeQueueAliases,
  ];

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    aliases,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
