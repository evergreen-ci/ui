import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    parsleyFilters:
      projectRef?.parsleyFilters?.map(
        ({ caseSensitive, description, exactMatch, expression }) => ({
          displayTitle: expression,
          expression,
          description,
          caseSensitive,
          exactMatch,
        }),
      ) ?? [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ parsleyFilters }, isRepo, id) => ({
  ...(isRepo ? { repoId: id } : { projectId: id }),
  projectRef: {
    id,
    parsleyFilters: parsleyFilters.map(
      ({ caseSensitive, description, exactMatch, expression }) => ({
        expression,
        description,
        caseSensitive,
        exactMatch,
      }),
    ),
  },
})) satisfies FormToGqlFunction<Tab>;
