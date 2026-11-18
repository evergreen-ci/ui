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
      generatedTaskValidationPrefix:
        taskOwnership?.generatedTaskValidationPrefix ?? "",
      trackGeneratedTaskTagValidation:
        taskOwnership?.trackGeneratedTaskTagValidation ?? null,
      blockTaskGenerationOnTagValidation:
        taskOwnership?.blockTaskGenerationOnTagValidation ?? null,
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
      generatedTaskValidationPrefix:
        data.tagValidation.generatedTaskValidationPrefix,
      trackGeneratedTaskTagValidation:
        data.tagValidation.trackGeneratedTaskTagValidation,
      blockTaskGenerationOnTagValidation:
        data.tagValidation.blockTaskGenerationOnTagValidation,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
