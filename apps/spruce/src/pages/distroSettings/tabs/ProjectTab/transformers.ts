import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Project;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { expansions, validProjects } = data;

  return {
    expansions,
    validProjects,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const formToGql = (({ expansions, validProjects }, distro) => ({
  ...distro,
  expansions,
  validProjects,
})) satisfies FormToGqlFunction<Tab>;
