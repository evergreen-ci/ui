import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.TestSelection;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  const { testSelection } = projectRef ?? {};

  return {
    allowed: testSelection?.allowed ?? null,
    defaultEnabled: testSelection?.defaultEnabled ?? null,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    testSelection: {
      allowed: formState?.allowed,
      defaultEnabled: formState?.defaultEnabled,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
