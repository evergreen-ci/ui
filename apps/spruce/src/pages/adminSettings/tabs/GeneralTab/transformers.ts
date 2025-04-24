import { AdminSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.General;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { announcements } = data;

  return {
    announcements: {
      announcements,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const fromGql = (({ announcements }) => ({
  announcements,
})) satisfies FormToGqlFunction<Tab>;
