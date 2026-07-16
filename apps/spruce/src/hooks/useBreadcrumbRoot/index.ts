import { useBreadcrumbAnalytics } from "analytics";
import { getWaterfallRoute } from "constants/routes";
import { User } from "gql/generated/types";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  user: Pick<User, "displayName" | "userId">,
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(user, !isPatch) ?? {};

  return isPatch
    ? {
        "data-cy": "bc-my-patches",
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            link: "myPatches",
            name: "Clicked link",
          });
        },
        text: userPatchesPageTitle,
        to: userPatchesPageLink,
      }
    : {
        "data-cy": "bc-waterfall",
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            link: "waterfall",
            name: "Clicked link",
          });
        },
        text: projectIdentifier,
        to: getWaterfallRoute(projectIdentifier),
      };
};
