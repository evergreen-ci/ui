import { AdminSettingsTabRoutes } from "constants/routes";
import { BannerTheme, Maybe } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.Announcements;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { banner, bannerTheme } = data;

  return {
    banner,
    bannerTheme: bannerTheme as Maybe<BannerTheme> | undefined,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ banner, bannerTheme }) => ({
  banner,
  bannerTheme,
})) satisfies FormToGqlFunction<Tab>;
