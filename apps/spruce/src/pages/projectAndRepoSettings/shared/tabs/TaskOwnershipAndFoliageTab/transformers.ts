import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.TaskOwnershipAndFoliage;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  const { taskOwnership } = projectRef ?? {};

  return {
    taskOwnership: {
      mothra: {
        defaultMothraTeam: taskOwnership?.defaultMothraTeam ?? "",
        defaultMothraTeamForBreakingCommit:
          taskOwnership?.defaultMothraTeamForBreakingCommit ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((data, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    taskOwnership: {
      defaultMothraTeam: data.taskOwnership.mothra.defaultMothraTeam,
      defaultMothraTeamForBreakingCommit:
        data.taskOwnership.mothra.defaultMothraTeamForBreakingCommit,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
