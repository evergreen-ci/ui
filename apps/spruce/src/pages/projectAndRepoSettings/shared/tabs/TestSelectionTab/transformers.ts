import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.TestSelection;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  const { testSelection } = projectRef ?? {};

  return {
    projectLevel: {
      allowed: testSelection?.allowed ?? null,
    },
    taskLevel: {
      defaultEnabled: testSelection?.defaultEnabled ?? null,
      mainlineDefaultEnabled: testSelection?.mainlineDefaultEnabled ?? null,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    testSelection: {
      allowed: formState.projectLevel.allowed,
      defaultEnabled: formState.taskLevel.defaultEnabled,
      mainlineDefaultEnabled: formState.taskLevel.mainlineDefaultEnabled,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
