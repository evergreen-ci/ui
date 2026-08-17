import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.TaskOwnershipAndFoliage;

export const gqlToForm = (() => ({
  taskOwnership: {
    dummyPlaceholder: "hello",
  },
})) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((_data, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
  },
})) satisfies FormToGqlFunction<Tab>;
