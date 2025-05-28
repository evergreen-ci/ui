import { AdminSettingsTabRoutes } from "constants/routes";
import { BannerTheme } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.Announcements;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { banner, bannerTheme } = data ?? {};

  return {
    announcements: {
      banner: banner ?? "",
      bannerTheme: bannerTheme as BannerTheme,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ announcements }) =>
  announcements) satisfies FormToGqlFunction<Tab>;
