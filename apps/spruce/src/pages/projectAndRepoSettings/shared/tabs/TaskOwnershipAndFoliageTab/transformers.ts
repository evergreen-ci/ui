import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.TaskOwnershipAndFoliage;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  const { taskOwnership } = projectRef ?? {};

  return {
    mothra: {
      defaultMothraTeam: taskOwnership?.defaultMothraTeam ?? "",
      defaultMothraTeamForBreakingCommit:
        taskOwnership?.defaultMothraTeamForBreakingCommit ?? "",
    },
    tagValidation: {
      tagValidationPrefix: taskOwnership?.tagValidationPrefix ?? "",
      trackTagValidation: taskOwnership?.trackTagValidation ?? null,
      blockOnTagValidation: taskOwnership?.blockOnTagValidation ?? null,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((data, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    taskOwnership: {
      defaultMothraTeam: data.mothra.defaultMothraTeam,
      defaultMothraTeamForBreakingCommit:
        data.mothra.defaultMothraTeamForBreakingCommit,
      tagValidationPrefix: data.tagValidation.tagValidationPrefix,
      trackTagValidation: data.tagValidation.trackTagValidation,
      blockOnTagValidation: data.tagValidation.blockOnTagValidation,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
