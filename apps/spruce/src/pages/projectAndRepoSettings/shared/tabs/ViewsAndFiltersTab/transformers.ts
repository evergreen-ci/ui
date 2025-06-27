import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    parsleyFilters:
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectRef.parsleyFilters?.map(
        ({ caseSensitive, exactMatch, expression }) => ({
          displayTitle: expression,
          expression,
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    id,
    parsleyFilters: parsleyFilters.map(
      ({ caseSensitive, exactMatch, expression }) => ({
        expression,
        caseSensitive,
        exactMatch,
      }),
    ),
  },
})) satisfies FormToGqlFunction<Tab>;
