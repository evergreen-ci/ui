import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { GitTagsFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.GitTags;

export const mergeProjectRepo = (
  projectData: GitTagsFormState,
  repoData: GitTagsFormState,
): GitTagsFormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    github: { gitTags, teams, users },
  } = repoData;
  const mergedObject: GitTagsFormState = projectData;
  mergedObject.github.users.repoData = users;
  mergedObject.github.teams.repoData = teams;
  mergedObject.github.gitTags.repoData = gitTags;
  return mergedObject;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const { projectType } = options ?? {};

  const {
    gitTagAuthorizedTeams,
    gitTagAuthorizedUsers,
    gitTagVersionsEnabled,
  } = projectRef ?? {};
  const gitTagVersionsEnabledForm = gitTagVersionsEnabled ?? null;
  const { gitTagAliases } = sortAliases(aliases ?? []);

  const override = (field: Array<unknown>) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  return {
    github: {
      gitTagVersionsEnabled: gitTagVersionsEnabledForm,
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
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    github: {
      gitTagVersionsEnabled,
      gitTags,
      teams: { gitTagAuthorizedTeams, gitTagAuthorizedTeamsOverride },
      users: { gitTagAuthorizedUsers, gitTagAuthorizedUsersOverride },
    },
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    id: id ?? "",
    gitTagVersionsEnabled,
    gitTagAuthorizedUsers: gitTagAuthorizedUsersOverride
      ? gitTagAuthorizedUsers
      : null,
    gitTagAuthorizedTeams: gitTagAuthorizedTeamsOverride
      ? gitTagAuthorizedTeams
      : null,
  };

  const gitTagAliases = transformAliases(
    gitTags.gitTagAliases,
    gitTags.gitTagAliasesOverride,
    AliasNames.GitTag,
  );

  const aliases = [...gitTagAliases];

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    aliases,
  };
}) satisfies FormToGqlFunction<Tab>;
