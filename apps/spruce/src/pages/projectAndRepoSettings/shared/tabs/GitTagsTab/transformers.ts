import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import {
  alias as aliasUtils,
  canOverrideForProject,
  ProjectType,
} from "../utils";
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

  return {
    github: {
      gitTags: {
        gitTagAliases,
        gitTagAliasesOverride: canOverrideForProject(
          options?.projectType,
          gitTagAliases,
        ),
      },
      gitTagVersionsEnabled: gitTagVersionsEnabledForm,
      teams: {
        gitTagAuthorizedTeams: gitTagAuthorizedTeams ?? [],
        gitTagAuthorizedTeamsOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedTeams,
      },
      users: {
        gitTagAuthorizedUsers: gitTagAuthorizedUsers ?? [],
        gitTagAuthorizedUsersOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedUsers,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    github: {
      gitTags,
      gitTagVersionsEnabled,
      teams: { gitTagAuthorizedTeams, gitTagAuthorizedTeamsOverride },
      users: { gitTagAuthorizedUsers, gitTagAuthorizedUsersOverride },
    },
  },
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    gitTagAuthorizedTeams: gitTagAuthorizedTeamsOverride
      ? gitTagAuthorizedTeams
      : null,
    gitTagAuthorizedUsers: gitTagAuthorizedUsersOverride
      ? gitTagAuthorizedUsers
      : null,
    gitTagVersionsEnabled,
    id,
  };

  const gitTagAliases = transformAliases(
    gitTags.gitTagAliases,
    gitTags.gitTagAliasesOverride,
    AliasNames.GitTag,
  );

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    aliases: gitTagAliases,
    projectRef,
  };
}) satisfies FormToGqlFunction<Tab>;
