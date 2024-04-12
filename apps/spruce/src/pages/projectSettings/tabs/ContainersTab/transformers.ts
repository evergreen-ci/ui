import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Containers;

export const gqlToForm = ((data) => {
  if (!data) return null;
  const { projectRef } = data;
  const { containerSizeDefinitions } = projectRef;

  return {
    containerSizeDefinitions: {
      variables: containerSizeDefinitions,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => {
  const { containerSizeDefinitions } = formState;
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: {
      id,
      containerSizeDefinitions: containerSizeDefinitions.variables,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
