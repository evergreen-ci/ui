import { AdminSettingsTabRoutes } from "constants/routes";
import { BannerTheme } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.Announcements;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { banner, bannerTheme } = data ?? {};

  return {
    banner: banner ?? "",
    bannerTheme: bannerTheme as BannerTheme,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ banner, bannerTheme }) => ({
  banner,
  bannerTheme,
})) satisfies FormToGqlFunction<Tab>;
