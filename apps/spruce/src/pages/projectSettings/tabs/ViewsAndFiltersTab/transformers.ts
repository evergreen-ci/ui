import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

// @ts-ignore: FIXME. This comment was added by an automated script.
export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    parsleyFilters:
      // @ts-ignore: FIXME. This comment was added by an automated script.
      projectRef.parsleyFilters?.map(
        ({ caseSensitive, exactMatch, expression }) => ({
          displayTitle: expression,
          expression,
          caseSensitive,
          exactMatch,
        }),
      ) ?? [],
    ...(projectType !== ProjectType.Repo &&
      // @ts-ignore: FIXME. This comment was added by an automated script.
      "projectHealthView" in projectRef && {
        view: {
          projectHealthView: projectRef.projectHealthView,
        },
      }),
  };
  // @ts-ignore: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ parsleyFilters, view }, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    id,
    parsleyFilters: parsleyFilters.map(
      ({ caseSensitive, exactMatch, expression }) => ({
        expression,
        caseSensitive,
        exactMatch,
      }),
    ),
    ...(view && {
      projectHealthView: view.projectHealthView,
    }),
  },
})) satisfies FormToGqlFunction<Tab>;
